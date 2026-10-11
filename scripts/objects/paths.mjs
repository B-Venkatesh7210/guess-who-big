import { existsSync } from "node:fs";
import path from "node:path";

export const OBJECTS_SOURCE_DIR = path.join("assets-src", "objects");
export const OBJECTS_OUTPUT_DIR = path.join("public", "objects");

export function objectSourceDir(id) {
  return path.join(OBJECTS_SOURCE_DIR, id);
}

export function referencesDir(id) {
  return path.join(objectSourceDir(id), "references");
}

export function findRender(id) {
  return ["render.png", "render.jpg", "render.webp"]
    .map((name) => path.join(objectSourceDir(id), name))
    .find((file) => existsSync(file));
}
