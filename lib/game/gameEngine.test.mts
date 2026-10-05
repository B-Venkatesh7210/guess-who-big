import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateRelativeError } from "../scale/scaleMath.ts";
import {
  createRoundModel,
  evaluateGuess,
  INITIAL_GUESS_RATIO,
  referenceBasePxForStageWidth,
} from "./gameEngine.ts";

test("the prototype round starts clearly away from the true can height", () => {
  const round = createRoundModel();
  assert.equal(round.reference.realSizeCm, 24);
  assert.equal(round.target.realSizeCm, 12.2);
  assert.equal(round.initialRatio, INITIAL_GUESS_RATIO);
  assert.equal(round.initialGuessCm, 24 * 0.72);
  assert.notEqual(round.initialGuessCm, round.target.realSizeCm);

  const distance = calculateRelativeError(
    round.initialGuessCm,
    round.target.realSizeCm,
  );
  assert.ok(distance >= 0.12);
});

test("reference pixel size follows the stage width", () => {
  assert.equal(referenceBasePxForStageWidth(0), 0);
  const mobile = referenceBasePxForStageWidth(390);
  assert.ok(mobile >= 140 && mobile <= 168);
  const tablet = referenceBasePxForStageWidth(760);
  assert.ok(tablet >= 168 && tablet <= 200);
  const desktop = referenceBasePxForStageWidth(1080);
  assert.ok(desktop >= 210 && desktop <= 236);
});

test("locking the true height scores 1000", () => {
  const result = evaluateGuess(12.2, 12.2);
  assert.equal(result.score, 1000);
  assert.equal(result.errorPercent, 0);
  assert.equal(result.feedback, "BULLSEYE.");
});
