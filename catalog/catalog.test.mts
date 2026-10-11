import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { generatedObjects } from "../data/generated/objects.ts";
import { catalog, validateCatalog } from "./index.ts";

test("the catalog is valid", () => {
  assert.deepEqual(validateCatalog(catalog), []);
});

test("every catalog entry has built art and up-to-date generated data", () => {
  const generated = new Map(generatedObjects.map((object) => [object.id, object]));
  for (const entry of catalog) {
    const object = generated.get(entry.id);
    assert.ok(object, `${entry.id}: no built art; run npm run objects:build`);
    assert.equal(object.realSizeCm, entry.realSizeCm, `${entry.id}: stale data; rebuild`);
    assert.equal(object.name, entry.name, `${entry.id}: stale data; rebuild`);
    assert.equal(object.fact, entry.fact, `${entry.id}: stale data; rebuild`);
    assert.equal(object.art.axis, entry.art.axis, `${entry.id}: stale data; rebuild`);
  }
  assert.equal(generatedObjects.length, catalog.length);
});

test("every built SVG has the layers the renderer needs", () => {
  for (const object of generatedObjects) {
    const svg = readFileSync(`public/objects/${object.id}.svg`, "utf8");
    assert.match(svg, /id="art"/, `${object.id}: missing #art`);
    assert.match(svg, /<path id="silhouette"(?![^>]*\sfill=)/, `${object.id}: silhouette must inherit fill`);
    assert.match(
      svg,
      new RegExp(`viewBox="0 0 ${object.art.width} ${object.art.height}"`),
      `${object.id}: stale geometry`,
    );
    const span = object.art.axis === "vertical" ? object.art.height : object.art.width;
    assert.ok(object.art.extent > 0 && object.art.extent <= span);
  }
});

test("tonal layers never introduce a hue", () => {
  for (const object of generatedObjects) {
    const svg = readFileSync(`public/objects/${object.id}.svg`, "utf8");
    for (const [, fill] of svg.matchAll(/\sfill="([^"]+)"/g)) {
      assert.ok(["#000", "#fff"].includes(fill), `${object.id}: unexpected fill ${fill}`);
    }
  }
});
