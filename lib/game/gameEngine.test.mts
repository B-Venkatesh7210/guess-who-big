import assert from "node:assert/strict";
import { test } from "node:test";
import { getScaleObject, scaleObjects } from "../../data/objects.ts";
import { silhouetteGeometry } from "../../data/silhouettes.ts";
import { calculateRelativeError } from "../scale/scaleMath.ts";
import { evaluateGuess, getRoundObjects, ROUNDS_PER_GAME } from "./gameEngine.ts";
import {
  createGame,
  gameReducer,
  revealedScore,
  type GameState,
} from "./gameState.ts";
import {
  DIFFICULTY_CURVE,
  generateRounds,
  isPlayable,
  matchesDifficulty,
  START_FACTOR_MAX,
  START_FACTOR_MIN,
  START_MIN_DISTANCE,
} from "./roundGenerator.ts";

const seeds = Array.from({ length: 60 }, (_, index) => `seed-${index}`);

test("every object has a matching silhouette and a sane size", () => {
  const ids = new Set<string>();
  for (const object of scaleObjects) {
    assert.ok(!ids.has(object.id), `duplicate id ${object.id}`);
    ids.add(object.id);
    assert.ok(silhouetteGeometry[object.svgKey], `missing silhouette ${object.svgKey}`);
    assert.ok(object.realSizeCm > 0);
    assert.ok(object.fact.length > 0);
  }
});

test("the same seed always produces the same rounds", () => {
  assert.deepEqual(generateRounds("2026-10-06"), generateRounds("2026-10-06"));
  assert.notDeepEqual(generateRounds("seed-a"), generateRounds("seed-b"));
});

test("generated games follow the difficulty curve and bounds rules", () => {
  for (const seed of seeds) {
    const rounds = generateRounds(seed);
    assert.equal(rounds.length, ROUNDS_PER_GAME);
    const targets = new Set<string>();

    rounds.forEach((round, index) => {
      assert.equal(round.difficulty, DIFFICULTY_CURVE[index]);
      const { reference, target } = getRoundObjects(round);
      assert.notEqual(reference.id, target.id);
      assert.ok(!targets.has(target.id), `${seed}: repeated target ${target.id}`);
      targets.add(target.id);

      const actual = target.realSizeCm;
      assert.ok(round.minGuessCm < actual && actual < round.maxGuessCm);
      assert.ok(round.initialGuessCm >= round.minGuessCm);
      assert.ok(round.initialGuessCm <= round.maxGuessCm);

      const factor = round.initialGuessCm / actual;
      assert.ok(factor >= START_FACTOR_MIN - 1e-9 && factor <= START_FACTOR_MAX + 1e-9);
      assert.ok(calculateRelativeError(round.initialGuessCm, actual) >= START_MIN_DISTANCE - 1e-9);

      assert.ok(isPlayable(reference, target, round.minGuessCm, round.maxGuessCm));
    });
  }
});

test("the answer is never the midpoint of the guess range", () => {
  for (const seed of seeds) {
    for (const round of generateRounds(seed)) {
      const actual = getScaleObject(round.targetObjectId).realSizeCm;
      const position =
        Math.log(actual / round.minGuessCm) / Math.log(round.maxGuessCm / round.minGuessCm);
      assert.ok(position >= 0.3 - 1e-9 && position <= 0.7 + 1e-9);
    }
  }
});

test("easy rounds use familiar objects on the same axis", () => {
  const basketball = getScaleObject("basketball");
  const soda = getScaleObject("soda-can");
  const whale = getScaleObject("blue-whale");
  assert.ok(matchesDifficulty(basketball, soda, "easy"));
  assert.ok(!matchesDifficulty(basketball, whale, "easy"));
});

function playRound(state: GameState, guessCm: number): GameState {
  let next = gameReducer(state, { type: "set-guess", guessCm });
  next = gameReducer(next, { type: "lock-in" });
  next = gameReducer(next, { type: "begin-reveal" });
  return gameReducer(next, { type: "finish-reveal" });
}

test("a full game runs through five rounds to complete", () => {
  let state = createGame("full-game");
  for (let index = 0; index < ROUNDS_PER_GAME; index += 1) {
    assert.equal(state.roundIndex, index);
    assert.equal(state.phase, "guessing");
    const actual = getRoundObjects(state.rounds[index]).target.realSizeCm;
    state = playRound(state, actual);
    assert.equal(state.phase, "result");
    assert.equal(state.results[index].score, 1000);
    state = gameReducer(state, { type: "next-round" });
  }
  assert.equal(state.phase, "complete");
  assert.equal(revealedScore(state), 5000);
});

test("lock in only scores once and freezes the guess", () => {
  let state = createGame("lock-once");
  state = gameReducer(state, { type: "lock-in" });
  const locked = state.results[0];
  state = gameReducer(state, { type: "set-guess", guessCm: 1 });
  state = gameReducer(state, { type: "lock-in" });
  assert.equal(state.results[0], locked);
  assert.equal(state.phase, "locked");
});

test("score is hidden from the total until the reveal finishes", () => {
  let state = createGame("hidden-total");
  state = gameReducer(state, { type: "lock-in" });
  assert.equal(revealedScore(state), 0);
  state = gameReducer(state, { type: "begin-reveal" });
  assert.equal(revealedScore(state), 0);
  state = gameReducer(state, { type: "finish-reveal" });
  assert.equal(revealedScore(state), state.results[0].score);
});

test("zoom never changes the guess", () => {
  let state = createGame("zoom");
  const guess = state.guessCm;
  state = gameReducer(state, { type: "step-zoom", direction: 1 });
  state = gameReducer(state, { type: "step-zoom", direction: 1 });
  assert.equal(state.zoom, 1.2);
  assert.equal(state.guessCm, guess);
});

test("guesses clamp to the round bounds", () => {
  let state = createGame("clamp");
  const round = state.rounds[0];
  state = gameReducer(state, { type: "set-guess", guessCm: round.maxGuessCm * 10 });
  assert.equal(state.guessCm, round.maxGuessCm);
  state = gameReducer(state, { type: "set-guess", guessCm: 0 });
  assert.equal(state.guessCm, round.minGuessCm);
});

test("locking the true size scores 1000", () => {
  const result = evaluateGuess(12.2, 12.2);
  assert.equal(result.score, 1000);
  assert.equal(result.errorPercent, 0);
  assert.equal(result.feedback, "BULLSEYE.");
});
