import assert from "node:assert/strict";
import { test } from "node:test";
import type { SilhouetteGeometry } from "../../types/game.ts";
import { calculateRenderedSize, guessToSliderPosition, sliderPositionToGuess } from "./scaleMath.ts";
import { computeStageLayout, silhouetteBox } from "./stageLayout.ts";

const ball: SilhouetteGeometry = { width: 100, height: 100, axis: "vertical", extent: 100 };
const can: SilhouetteGeometry = { width: 66, height: 122, axis: "vertical", extent: 122 };
const car: SilhouetteGeometry = { width: 845, height: 275, axis: "horizontal", extent: 845 };
const adult: SilhouetteGeometry = { width: 52, height: 170, axis: "vertical", extent: 170 };

test("silhouette box maps the measured span to the measured dimension", () => {
  const box = silhouetteBox(can, 122);
  assert.equal(box.height, 122);
  assert.equal(box.width, 66);
  const carBox = silhouetteBox(car, 450);
  assert.ok(Math.abs(carBox.width - (450 * car.width) / car.extent) < 1e-9);
  assert.ok(Math.abs(carBox.height - (carBox.width * car.height) / car.width) < 1e-9);
  assert.ok(carBox.height < carBox.width);
});

test("both objects share one px-per-cm and the target max fits", () => {
  for (const stageWidth of [358, 700, 1032]) {
    const layout = computeStageLayout({
      stageWidth,
      zoom: 1,
      referenceCm: 24,
      referenceGeometry: ball,
      targetMaxCm: 30,
      targetGeometry: can,
    });
    assert.ok(Math.abs(layout.referenceRenderedPx - 24 * layout.pxPerCm) < 1e-9);
    const targetMax = silhouetteBox(can, 30 * layout.pxPerCm);
    assert.ok(targetMax.height <= layout.fieldHeight);
    const targetPx = calculateRenderedSize(layout.referenceRenderedPx, 12.2, 24);
    assert.ok(Math.abs(targetPx - 12.2 * layout.pxPerCm) < 1e-9);
  }
});

test("zoom scales the reference without changing px-per-cm", () => {
  const input = {
    stageWidth: 1032,
    referenceCm: 24,
    referenceGeometry: ball,
    targetMaxCm: 30,
    targetGeometry: can,
  };
  const base = computeStageLayout({ ...input, zoom: 1 });
  const zoomed = computeStageLayout({ ...input, zoom: 0.5 });
  assert.equal(base.pxPerCm, zoomed.pxPerCm);
  assert.ok(Math.abs(zoomed.referenceRenderedPx - base.referenceRenderedPx / 2) < 1e-9);
});

test("horizontal objects fit the stage width", () => {
  const layout = computeStageLayout({
    stageWidth: 1032,
    zoom: 1,
    referenceCm: 170,
    referenceGeometry: adult,
    targetMaxCm: 900,
    targetGeometry: car,
  });
  const carBox = silhouetteBox(car, 900 * layout.pxPerCm);
  assert.ok(carBox.width <= 1032);
});

test("log slider round-trips and the middle is the geometric mean", () => {
  const guess = sliderPositionToGuess(0.5, 10, 40);
  assert.ok(Math.abs(guess - 20) < 1e-9);
  assert.ok(Math.abs(guessToSliderPosition(20, 10, 40) - 0.5) < 1e-9);
  assert.equal(guessToSliderPosition(5, 10, 40), 0);
  assert.equal(guessToSliderPosition(80, 10, 40), 1);
});
