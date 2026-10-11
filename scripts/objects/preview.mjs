// Renders a contact sheet of built object SVGs in the reference and target tints.
// Usage: node scripts/objects/preview.mjs [svgKey ...]  ->  assets-src/preview.png

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TILE = 320;
const PAD = 24;
const BACKGROUND = "#0B0D10";
const TINTS = ["#4EA1FF", "#FF5C55"];

const keys = process.argv.slice(2);
const files = (await readdir(path.join("public", "objects")))
  .filter((file) => file.endsWith(".svg"))
  .filter((file) => keys.length === 0 || keys.includes(path.basename(file, ".svg")))
  .sort();

const composites = [];
for (const [row, file] of files.entries()) {
  const svg = await readFile(path.join("public", "objects", file), "utf8");
  for (const [column, tint] of TINTS.entries()) {
    const tinted = svg.replace('<g id="art"', `<g id="art" fill="${tint}"`);
    const tile = await sharp(Buffer.from(tinted), { density: 200 })
      .resize({ width: TILE, height: TILE, fit: "contain", background: BACKGROUND })
      .flatten({ background: BACKGROUND })
      .png()
      .toBuffer();
    composites.push({ input: tile, left: PAD + column * (TILE + PAD), top: PAD + row * (TILE + PAD) });
  }
}

await sharp({
  create: {
    width: PAD + TINTS.length * (TILE + PAD),
    height: PAD + files.length * (TILE + PAD),
    channels: 3,
    background: BACKGROUND,
  },
})
  .composite(composites)
  .png()
  .toFile(path.join("assets-src", "preview.png"));
console.log(`preview: ${files.length} objects -> assets-src/preview.png`);
