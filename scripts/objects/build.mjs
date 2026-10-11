// Turns AI clay renders into layered, tintable SVGs and generates the game's object data.
// Input:  catalog/ + assets-src/objects/<id>/render.(png|jpg|webp)
// Output: public/objects/<id>.svg and data/generated/objects.ts
// Usage:  npm run objects:build -- [--rebuild] [id ...]   (listed ids always rebuild)

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import potrace from "potrace";
import sharp from "sharp";
import { optimize } from "svgo";
import { catalog, validateCatalog } from "../../catalog/index.ts";
import { OBJECTS_OUTPUT_DIR, findRender, objectSourceDir } from "./paths.mjs";

const GENERATED_FILE = path.join("data", "generated", "objects.ts");
/** Bump when the tracing algorithm changes so every object rebuilds. */
const PIPELINE_VERSION = 3;
/** Art settings that change the traced SVG; changing one rebuilds that object. */
const SVG_SETTINGS = [
  "shadeBlur",
  "minShadeArea",
  "relight",
  "relightStrength",
  "keyMargin",
  "creaseBlur",
  "creaseRadius",
  "creaseThreshold",
  "minCreaseArea",
];

const LONG_EDGE = 1024;
const DEFAULT_KEY_MARGIN = 38;
const MIN_ISLAND_FRACTION = 0.002;
const CREASE_OPACITY = 0.28;
const MAX_HOLE_FRACTION = 0.0015;

// Tone bands on luminance normalized to the object's own 3rd–97th percentile.
const TONES = [
  { id: "shade", test: (t) => t < 0.46, fill: "#000", opacity: 0.2 },
  { id: "shade-deep", test: (t) => t < 0.22, fill: "#000", opacity: 0.24 },
  { id: "highlight", test: (t) => t > 0.86, fill: "#fff", opacity: 0.18 },
];

const args = process.argv.slice(2);
const rebuildAll = args.includes("--rebuild");
const only = new Set(args.filter((arg) => !arg.startsWith("--")));

const problems = validateCatalog(catalog);
if (problems.length > 0) {
  console.error(`Catalog problems:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

await mkdir(OBJECTS_OUTPUT_DIR, { recursive: true });
await mkdir(path.dirname(GENERATED_FILE), { recursive: true });

const objects = [];
const missing = [];
for (const entry of catalog) {
  const render = findRender(entry.id);
  if (!render) {
    missing.push(entry.id);
    continue;
  }

  const config = {
    extentRatio: 1,
    shadeBlur: 2,
    minShadeArea: 30,
    relight: null,
    relightStrength: 0.6,
    keyMargin: DEFAULT_KEY_MARGIN,
    creaseBlur: 1,
    creaseRadius: 8,
    creaseThreshold: 1.8,
    minCreaseArea: 20,
    ...entry.art,
  };
  const signature = createHash("sha1")
    .update(String(PIPELINE_VERSION))
    .update(JSON.stringify(SVG_SETTINGS.map((key) => config[key])))
    .update(await readFile(render))
    .digest("hex");

  const output = path.join(OBJECTS_OUTPUT_DIR, `${entry.id}.svg`);
  const signatureFile = path.join(objectSourceDir(entry.id), "build.sig");
  const fresh =
    !rebuildAll &&
    !only.has(entry.id) &&
    existsSync(output) &&
    existsSync(signatureFile) &&
    (await readFile(signatureFile, "utf8")).trim() === signature;

  const svg = fresh ? await readFile(output, "utf8") : await buildSvg(render, config);
  if (!fresh) {
    await writeFile(output, svg);
    await writeFile(signatureFile, `${signature}\n`);
    console.log(`built ${entry.id}  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
  }

  const [, , width, height] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const measured = config.axis === "horizontal" ? width : height;
  objects.push({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    measurementType: entry.measurementType,
    realSizeCm: entry.realSizeCm,
    fact: entry.fact,
    ...(entry.approximationLabel ? { approximationLabel: entry.approximationLabel } : {}),
    sizeSource: entry.sizeSource,
    familiarity: entry.familiarity,
    art: {
      width,
      height,
      axis: config.axis,
      extent: round(measured * config.extentRatio),
      version: createHash("sha1").update(svg).digest("hex").slice(0, 8),
    },
  });
}

await writeFile(GENERATED_FILE, renderObjectsModule(objects));
console.log(`objects: ${objects.length} playable of ${catalog.length} in catalog`);
if (missing.length > 0) console.log(`no render yet: ${missing.join(", ")}`);

async function buildSvg(file, config) {
  const { data, info } = await sharp(file)
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    mask[i] = a >= 128 && g - Math.max(r, b) < config.keyMargin ? 1 : 0;
  }
  cleanMask(mask, w, h);

  const box = boundingBox(mask, w, h);
  if (!box) throw new Error(`${file}: no object found after keying`);
  const cw = box.x1 - box.x0 + 1;
  const ch = box.y1 - box.y0 + 1;

  const crop = new Uint8Array(cw * ch);
  const luminance = new Uint8Array(cw * ch);
  let count = 0;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const src = (box.y0 + y) * w + box.x0 + x;
      const dst = y * cw + x;
      crop[dst] = mask[src];
      if (mask[src]) {
        // Ignore the green channel so key spill on edges does not read as highlight.
        luminance[dst] = (data[src * 4] + data[src * 4 + 2]) >> 1;
        count += 1;
      }
    }
  }
  const fillBackground = (values) => {
    let total = 0;
    for (let i = 0; i < crop.length; i++) if (crop[i]) total += values[i];
    const mean = Math.round(total / count);
    for (let i = 0; i < crop.length; i++) if (!crop[i]) values[i] = mean;
  };

  const unlit = Uint8Array.from(luminance);
  fillBackground(unlit);
  if (config.relight === "sphere") relightSphere(luminance, crop, cw, ch, config.relightStrength);
  fillBackground(luminance);

  const shading = await blurGray(luminance, cw, ch, config.shadeBlur);
  const [lo, hi] = percentiles(shading, crop, 0.03, 0.97);
  const inner = erode(crop, cw, ch);

  const silhouette = await trace(crop, cw, ch, { turdSize: 12, optTolerance: 0.3 });
  const layers = [];
  const addLayer = async (band, fill, opacity, turdSize) => {
    const d = await trace(band, cw, ch, { turdSize, optTolerance: 0.4 });
    if (d) layers.push(`<path fill="${fill}" fill-opacity="${opacity}" fill-rule="evenodd" d="${d}"/>`);
  };

  for (const tone of TONES) {
    const band = new Uint8Array(cw * ch);
    for (let i = 0; i < band.length; i++) {
      band[i] = inner[i] && tone.test((shading[i] - lo) / Math.max(1, hi - lo)) ? 1 : 0;
    }
    await addLayer(band, tone.fill, tone.opacity, config.minShadeArea);
  }

  // Creases: fine detail darker than its neighbourhood, measured on the unlit render.
  const fine = await blurGray(unlit, cw, ch, config.creaseBlur);
  const broad = await blurGray(unlit, cw, ch, config.creaseRadius);
  const contrast = new Float32Array(cw * ch);
  let squares = 0;
  for (let i = 0; i < contrast.length; i++) {
    if (!inner[i]) continue;
    contrast[i] = fine[i] - broad[i];
    squares += contrast[i] * contrast[i];
  }
  const deviation = Math.sqrt(squares / count);
  const crease = new Uint8Array(cw * ch);
  for (let i = 0; i < crease.length; i++) {
    crease[i] = inner[i] && contrast[i] < -config.creaseThreshold * deviation ? 1 : 0;
  }
  await addLayer(crease, "#000", CREASE_OPACITY, config.minCreaseArea);

  const raw = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}">`,
    `<g id="art">`,
    `<path id="silhouette" fill-rule="evenodd" d="${silhouette}"/>`,
    ...layers,
    `</g>`,
    `</svg>`,
  ].join("");

  return optimize(raw, {
    multipass: true,
    floatPrecision: 1,
    plugins: [
      {
        name: "preset-default",
        // Shade fills must stay explicit: an omitted fill would inherit the tint through <use>.
        params: {
          overrides: {
            cleanupIds: false,
            mergePaths: false,
            collapseGroups: false,
            moveElemsAttrsToGroup: false,
            removeUnknownsAndDefaults: false,
            cleanupNumericValues: false,
          },
        },
      },
    ],
  }).data;
}

async function blurGray(values, w, h, sigma) {
  const { data, info } = await sharp(values, { raw: { width: w, height: h, channels: 1 } })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 1 || data.length !== w * h) {
    throw new Error(`unexpected blur output (${info.channels} channels)`);
  }
  return data;
}

// Renders often light round objects flat; apply Lambert shading from the top-left light.
function relightSphere(luminance, mask, w, h, strength) {
  const light = normalize([-0.55, -0.62, 0.56]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      const nx = (x + 0.5) / w * 2 - 1;
      const ny = (y + 0.5) / h * 2 - 1;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const lambert = Math.max(0, nx * light[0] + ny * light[1] + nz * light[2]);
      const factor = 1 - strength + strength * (0.25 + 0.75 * lambert);
      luminance[i] = Math.min(255, Math.round(luminance[i] * factor));
    }
  }
}

function normalize(vector) {
  const length = Math.hypot(...vector);
  return vector.map((v) => v / length);
}

function cleanMask(mask, w, h) {
  const fg = components(mask, w, h, 1);
  const largest = Math.max(...fg.map((c) => c.length));
  for (const c of fg) {
    if (c.length < largest * MIN_ISLAND_FRACTION) for (const i of c) mask[i] = 0;
  }
  const area = mask.reduce((total, v) => total + v, 0);
  for (const c of components(mask, w, h, 0)) {
    if (c.touchesEdge || c.length > area * MAX_HOLE_FRACTION) continue;
    for (const i of c) mask[i] = 1;
  }
}

function components(mask, w, h, value) {
  const seen = new Uint8Array(w * h);
  const result = [];
  const stack = [];
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || mask[start] !== value) continue;
    const pixels = [];
    let touchesEdge = false;
    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop();
      pixels.push(i);
      const x = i % w;
      const y = (i - x) / w;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;
      for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (n >= 0 && !seen[n] && mask[n] === value) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    pixels.touchesEdge = touchesEdge;
    result.push(pixels);
  }
  return result;
}

function boundingBox(mask, w, h) {
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

function erode(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      out[i] = mask[i] && mask[i - 1] && mask[i + 1] && mask[i - w] && mask[i + w] ? 1 : 0;
    }
  }
  return out;
}

function percentiles(values, mask, low, high) {
  const histogram = new Array(256).fill(0);
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    if (!mask[i]) continue;
    histogram[values[i]] += 1;
    total += 1;
  }
  const at = (fraction) => {
    let running = 0;
    for (let v = 0; v < 256; v++) {
      running += histogram[v];
      if (running >= total * fraction) return v;
    }
    return 255;
  };
  return [at(low), at(high)];
}

async function trace(bitmap, w, h, options) {
  const pixels = Buffer.alloc(w * h);
  let any = false;
  for (let i = 0; i < bitmap.length; i++) {
    pixels[i] = bitmap[i] ? 0 : 255;
    if (bitmap[i]) any = true;
  }
  if (!any) return null;
  const png = await sharp(pixels, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const svg = await new Promise((resolve, reject) => {
    potrace.trace(png, { threshold: 128, blackOnWhite: true, ...options }, (error, result) =>
      error ? reject(error) : resolve(result),
    );
  });
  return svg.match(/ d="([^"]+)"/)?.[1] ?? null;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function renderObjectsModule(objects) {
  return [
    "// Generated by scripts/objects/build.mjs from catalog/. Do not edit by hand.",
    'import type { ScaleObjectDefinition } from "../../types/game";',
    "",
    `export const generatedObjects: readonly ScaleObjectDefinition[] = ${JSON.stringify(objects, null, 2)};`,
    "",
  ].join("\n");
}
