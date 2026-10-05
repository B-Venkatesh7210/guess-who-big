import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateScore, getFeedbackMessage } from "./scoring.ts";

test("score is 1000 at zero error and approaches zero as error grows", () => {
  assert.equal(calculateScore(0), 1000);
  assert.equal(calculateScore(0.05), Math.round(1000 * Math.exp(-0.15)));
  assert.equal(calculateScore(0.1), Math.round(1000 * Math.exp(-0.3)));
  assert.equal(calculateScore(0.2), Math.round(1000 * Math.exp(-0.6)));
  assert.ok(calculateScore(0.05) > 850);
  assert.ok(calculateScore(0.1) > 700 && calculateScore(0.1) < 800);
  assert.ok(calculateScore(0.2) > 500 && calculateScore(0.2) < 600);
  assert.ok(calculateScore(3) < 10);
  assert.equal(calculateScore(-1), 1000);
  assert.equal(calculateScore(Number.NaN), 0);
});

test("feedback bands match the constitution", () => {
  assert.equal(getFeedbackMessage(0), "BULLSEYE.");
  assert.equal(getFeedbackMessage(0.99), "BULLSEYE.");
  assert.equal(getFeedbackMessage(1), "RIDICULOUSLY CLOSE.");
  assert.equal(getFeedbackMessage(2.9), "RIDICULOUSLY CLOSE.");
  assert.equal(getFeedbackMessage(3), "GREAT EYE.");
  assert.equal(getFeedbackMessage(6.9), "GREAT EYE.");
  assert.equal(getFeedbackMessage(7), "PRETTY CLOSE.");
  assert.equal(getFeedbackMessage(14.9), "PRETTY CLOSE.");
  assert.equal(getFeedbackMessage(15), "NOT BAD.");
  assert.equal(getFeedbackMessage(24.9), "NOT BAD.");
  assert.equal(getFeedbackMessage(25), "A LITTLE OFF.");
  assert.equal(getFeedbackMessage(39.9), "A LITTLE OFF.");
  assert.equal(getFeedbackMessage(40), "WAY OFF.");
  assert.equal(getFeedbackMessage(59.9), "WAY OFF.");
  assert.equal(getFeedbackMessage(60), "REALITY HAD OTHER PLANS.");
});
