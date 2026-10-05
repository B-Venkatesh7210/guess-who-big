import assert from "node:assert/strict";
import { test } from "node:test";
import {
  adjustGuessByPercent,
  calculateGuessFromRenderedSize,
  calculatePercentageError,
  calculateRelativeError,
  calculateRenderedSize,
  calculateScaleRatio,
  clampTargetSize,
} from "./scaleMath.ts";

test("case 1: half the reference renders at half the pixels", () => {
  assert.equal(calculateRenderedSize(200, 50, 100), 100);
  assert.equal(calculateScaleRatio(50, 100), 0.5);
});

test("case 2: basketball pixels map the soda can to 91.5px", () => {
  assert.ok(Math.abs(calculateRenderedSize(180, 12.2, 24) - 91.5) < 1e-9);
});

test("case 3: reverse calculation recovers 12.2cm", () => {
  const guess = calculateGuessFromRenderedSize(91.5, 180, 24);
  assert.ok(Math.abs(guess - 12.2) < 1e-9);
});

test("case 4: zoom scales both sizes and preserves the ratio", () => {
  const referenceAtFull = 180;
  const targetAtFull = calculateRenderedSize(referenceAtFull, 12.2, 24);
  const zoom = 0.5;
  const referenceZoomed = referenceAtFull * zoom;
  const targetZoomed = calculateRenderedSize(referenceZoomed, 12.2, 24);

  assert.equal(referenceZoomed, 90);
  assert.ok(Math.abs(targetZoomed - 45.75) < 1e-9);
  assert.ok(
    Math.abs(targetZoomed / referenceZoomed - targetAtFull / referenceAtFull) <
      1e-9,
  );
  assert.ok(
    Math.abs(calculateRenderedSize(180, 12.2, 24, zoom) - 45.75) < 1e-9,
  );
});

test("relative and percentage error", () => {
  assert.equal(calculateRelativeError(12.2, 12.2), 0);
  assert.ok(Math.abs(calculatePercentageError(13.42, 12.2) - 10) < 0.001);
});

test("clamp and percentage adjustments stay inside bounds", () => {
  assert.equal(clampTargetSize(2, 3.6, 36), 3.6);
  assert.equal(clampTargetSize(40, 3.6, 36), 36);
  assert.ok(Math.abs(adjustGuessByPercent(10, 0.02, 1, 40) - 10.2) < 1e-9);
  assert.equal(adjustGuessByPercent(10, -0.5, 8, 40), 8);
});
