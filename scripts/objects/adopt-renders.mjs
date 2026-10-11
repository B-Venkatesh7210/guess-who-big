// Copies AI renders named <id>.(jpg|png|webp) from a folder into assets-src/objects/<id>/render.*.
// Usage: node scripts/objects/adopt-renders.mjs <folder> [--overwrite]

import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { findRender, objectSourceDir } from "./paths.mjs";

const [folder, ...flags] = process.argv.slice(2);
if (!folder || !existsSync(folder)) {
  console.error("Usage: node scripts/objects/adopt-renders.mjs <folder> [--overwrite]");
  process.exit(1);
}
const overwrite = flags.includes("--overwrite");

const adopted = [];
for (const file of await readdir(folder)) {
  const extension = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) continue;
  const id = path.basename(file, path.extname(file));
  if (!existsSync(objectSourceDir(id))) continue;
  const existing = findRender(id);
  if (existing && !overwrite) continue;
  if (existing) await rm(existing);
  await mkdir(objectSourceDir(id), { recursive: true });
  await copyFile(path.join(folder, file), path.join(objectSourceDir(id), `render${extension === ".jpeg" ? ".jpg" : extension}`));
  adopted.push(id);
}
console.log(`adopted ${adopted.length}: ${adopted.join(", ")}`);
