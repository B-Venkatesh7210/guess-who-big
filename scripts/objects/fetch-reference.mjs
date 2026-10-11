// Downloads candidate reference photos from Wikimedia Commons for catalog objects.
// Usage: npm run objects:reference -- <id ...> [--all] [--refresh] [--count=N] [--query="..."]
// References only guide the AI render; they are never shipped.

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalog, findEntry } from "../../catalog/index.ts";
import { referencesDir } from "./paths.mjs";

const USER_AGENT = "scale-it-asset-pipeline/0.1 (reference lookup)";

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const refresh = args.includes("--refresh");
const count = Number(option("count") ?? 3);
const queryOverride = option("query");
const ids = args.includes("--all")
  ? catalog.map((entry) => entry.id)
  : args.filter((arg) => !arg.startsWith("--"));

if (ids.length === 0) {
  console.error('Usage: npm run objects:reference -- <id ...> [--all] [--refresh] [--count=N] [--query="..."]');
  process.exit(1);
}

for (const id of ids) {
  const entry = findEntry(id);
  const dir = referencesDir(id);
  if (!refresh && existsSync(path.join(dir, "credits.json"))) {
    console.log(`${id}: already has references (use --refresh)`);
    continue;
  }
  try {
    const credits = await fetchReferences(queryOverride ?? entry.art.referenceQuery, dir);
    console.log(`${id}: ${credits.map((c) => `${c.file} [${c.license}]`).join(", ") || "none found"}`);
  } catch (error) {
    console.error(`${id}: ${error.message}`);
    process.exitCode = 1;
  }
}

async function fetchReferences(query, dir) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: String(count * 3),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "900",
  }).toString();

  const data = await (await fetchWithRetry(api)).json();
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  await mkdir(dir, { recursive: true });

  const credits = [];
  for (const page of pages) {
    if (credits.length >= count) break;
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) continue;
    let image;
    try {
      image = await fetchWithRetry(info.thumburl);
    } catch {
      continue;
    }
    const extension = path.extname(new URL(info.thumburl).pathname).toLowerCase() || ".jpg";
    const file = `ref-${credits.length + 1}${extension}`;
    await writeFile(path.join(dir, file), Buffer.from(await image.arrayBuffer()));
    const meta = info.extmetadata ?? {};
    credits.push({
      file,
      title: page.title,
      source: info.descriptionurl,
      license: meta.LicenseShortName?.value ?? "unknown",
      artist: (meta.Artist?.value ?? "unknown").replace(/<[^>]+>/g, "").trim(),
    });
  }

  await writeFile(path.join(dir, "credits.json"), `${JSON.stringify({ query, credits }, null, 2)}\n`);
  return credits;
}

async function fetchWithRetry(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
      if (response.status < 500 && response.status !== 429) break;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
  }
  throw lastError;
}
