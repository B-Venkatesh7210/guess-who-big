import assert from "node:assert/strict";
import { test } from "node:test";
import { formatLength } from "./format.ts";

test("lengths pick a unit that matches how the size is usually quoted", () => {
  assert.equal(formatLength(4.27), "4.3 cm");
  assert.equal(formatLength(24), "24 cm");
  assert.equal(formatLength(170), "1.70 m");
  assert.equal(formatLength(3950), "39.5 m");
  assert.equal(formatLength(26910), "269.1 m");
  assert.equal(formatLength(82800), "828 m");
  assert.equal(formatLength(884900), "8,849 m");
  assert.equal(formatLength(1275600000), "12,756 km");
  assert.equal(formatLength(14298400000), "142,984 km");
});
