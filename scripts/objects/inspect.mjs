// Prints the layer structure of built object SVGs.
// Usage: node scripts/objects/inspect.mjs [svgKey ...]

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const keys = process.argv.slice(2);
const files = (await readdir(path.join("public", "objects")))
  .filter((file) => file.endsWith(".svg"))
  .filter((file) => keys.length === 0 || keys.includes(path.basename(file, ".svg")));

for (const file of files) {
  const svg = await readFile(path.join("public", "objects", file), "utf8");
  console.log(`${file}  ${(svg.length / 1024).toFixed(1)} KB  ${svg.match(/viewBox="([^"]+)"/)?.[1]}`);
  for (const match of svg.matchAll(/<path([^>]*?)\sd="([^"]*)"/g)) {
    console.log(`  ${match[1].trim() || "(no attrs)"}  d=${(match[2].length / 1024).toFixed(1)} KB`);
  }
}
