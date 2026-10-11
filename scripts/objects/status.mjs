// Shows each catalog object's progress through the art pipeline.
// Usage: npm run objects:status

import { existsSync } from "node:fs";
import path from "node:path";
import { catalog, partnersOf, validateCatalog } from "../../catalog/index.ts";
import { OBJECTS_OUTPUT_DIR, findRender, referencesDir } from "./paths.mjs";

const rows = catalog.map((entry) => ({
  id: entry.id,
  category: entry.category,
  references: existsSync(path.join(referencesDir(entry.id), "credits.json")) ? "yes" : "-",
  render: findRender(entry.id) ? "yes" : "-",
  svg: existsSync(path.join(OBJECTS_OUTPUT_DIR, `${entry.id}.svg`)) ? "yes" : "-",
  partners: partnersOf(entry, catalog).length,
}));
console.table(rows);

const todo = rows.filter((row) => row.render === "-").map((row) => row.id);
console.log(`${catalog.length - todo.length}/${catalog.length} rendered${todo.length ? `; missing: ${todo.join(", ")}` : ""}`);

const problems = validateCatalog(catalog);
if (problems.length > 0) console.log(`catalog problems:\n  ${problems.join("\n  ")}`);
