// Prints the render brief for catalog objects: prompt, aspect ratio and reference images.
// Usage: npm run objects:prompt -- <id ...>

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { findEntry } from "../../catalog/index.ts";
import { artPrompt } from "../../catalog/prompt.ts";
import { referencesDir } from "./paths.mjs";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("Usage: npm run objects:prompt -- <id ...>");
  process.exit(1);
}

for (const id of ids) {
  const entry = findEntry(id);
  const creditsFile = path.join(referencesDir(id), "credits.json");
  const references = existsSync(creditsFile)
    ? JSON.parse(await readFile(creditsFile, "utf8")).credits.map((credit) =>
        path.resolve(referencesDir(id), credit.file),
      )
    : [];
  console.log(
    JSON.stringify(
      {
        id,
        aspectRatio: entry.art.aspectRatio,
        references,
        renderPath: path.resolve("assets-src", "objects", id, "render.jpg"),
        prompt: artPrompt(entry),
      },
      null,
      2,
    ),
  );
}
