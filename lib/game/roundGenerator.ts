import { scaleObjects } from "../../data/objects";
import { getSilhouetteGeometry } from "../../data/silhouettes";
import { createRng, pickOne, randomBetween, type Rng } from "../random/random";
import { computeStageLayout, silhouetteBox } from "../scale/stageLayout";
import type {
  GameRound,
  RoundDifficulty,
  ScaleObjectDefinition,
} from "../../types/game";
import { ROUNDS_PER_GAME } from "./gameEngine";

export const DIFFICULTY_CURVE: readonly RoundDifficulty[] = [
  "easy",
  "easy-medium",
  "medium",
  "hard",
  "wildcard",
];

/** The guess range spans this factor, with the answer placed off-center inside it. */
export const GUESS_RANGE_FACTOR = 3.5;
const ANSWER_POSITION_MIN = 0.3;
const ANSWER_POSITION_MAX = 0.7;

export const START_FACTOR_MIN = 0.45;
export const START_FACTOR_MAX = 1.75;
/** The starting guess is always at least this far from the answer. */
export const START_MIN_DISTANCE = 0.12;

/** Phone-sized stage used to reject pairs that would render too small to read. */
const PLAYABILITY_STAGE_WIDTH = 358;
const MIN_REFERENCE_PX = 44;
const MIN_TARGET_PX = 24;

interface DifficultyRule {
  minRatio: number;
  maxRatio: number;
  maxFamiliarity: number;
  sameAxisOnly: boolean;
  minLogDistance: number;
  requireChallenge: boolean;
}

const RULES: Record<RoundDifficulty, DifficultyRule> = {
  easy: {
    minRatio: 0.3,
    maxRatio: 2.5,
    maxFamiliarity: 1,
    sameAxisOnly: true,
    minLogDistance: Math.log(1.25),
    requireChallenge: false,
  },
  "easy-medium": {
    minRatio: 0.25,
    maxRatio: 3,
    maxFamiliarity: 2,
    sameAxisOnly: true,
    minLogDistance: Math.log(1.2),
    requireChallenge: false,
  },
  medium: {
    minRatio: 0.2,
    maxRatio: 3,
    maxFamiliarity: 2,
    sameAxisOnly: false,
    minLogDistance: Math.log(1.15),
    requireChallenge: false,
  },
  hard: {
    minRatio: 0.18,
    maxRatio: 3,
    maxFamiliarity: 3,
    sameAxisOnly: false,
    minLogDistance: 0,
    requireChallenge: true,
  },
  wildcard: {
    minRatio: 0.18,
    maxRatio: 3,
    maxFamiliarity: 3,
    sameAxisOnly: false,
    minLogDistance: 0,
    requireChallenge: false,
  },
};

function axisOf(object: ScaleObjectDefinition) {
  return getSilhouetteGeometry(object.svgKey).axis;
}

function isChallenging(
  reference: ScaleObjectDefinition,
  target: ScaleObjectDefinition,
): boolean {
  const unfamiliar = reference.familiarity === 3 || target.familiarity === 3;
  const mixedAxis = axisOf(reference) !== axisOf(target);
  const closeInSize =
    Math.abs(Math.log(target.realSizeCm / reference.realSizeCm)) < Math.log(1.3);
  return unfamiliar || mixedAxis || closeInSize;
}

export function matchesDifficulty(
  reference: ScaleObjectDefinition,
  target: ScaleObjectDefinition,
  difficulty: RoundDifficulty,
): boolean {
  const rule = RULES[difficulty];
  const ratio = target.realSizeCm / reference.realSizeCm;
  if (ratio < rule.minRatio || ratio > rule.maxRatio) return false;
  if (Math.abs(Math.log(ratio)) < rule.minLogDistance) return false;
  if (Math.max(reference.familiarity, target.familiarity) > rule.maxFamiliarity) {
    return false;
  }
  if (rule.sameAxisOnly && axisOf(reference) !== axisOf(target)) return false;
  if (rule.requireChallenge && !isChallenging(reference, target)) return false;
  return true;
}

export function guessBoundsFor(actualCm: number, answerPosition: number) {
  return {
    minGuessCm: actualCm * GUESS_RANGE_FACTOR ** -answerPosition,
    maxGuessCm: actualCm * GUESS_RANGE_FACTOR ** (1 - answerPosition),
  };
}

export function isPlayable(
  reference: ScaleObjectDefinition,
  target: ScaleObjectDefinition,
  minGuessCm: number,
  maxGuessCm: number,
): boolean {
  const referenceGeometry = getSilhouetteGeometry(reference.svgKey);
  const targetGeometry = getSilhouetteGeometry(target.svgKey);
  const layout = computeStageLayout({
    stageWidth: PLAYABILITY_STAGE_WIDTH,
    zoom: 1,
    referenceCm: reference.realSizeCm,
    referenceGeometry,
    targetMaxCm: maxGuessCm,
    targetGeometry,
  });
  const referenceBox = silhouetteBox(referenceGeometry, layout.referenceRenderedPx);
  const smallestTarget = silhouetteBox(targetGeometry, minGuessCm * layout.pxPerCm);
  const actualTarget = silhouetteBox(targetGeometry, target.realSizeCm * layout.pxPerCm);
  return (
    Math.max(referenceBox.height, referenceBox.width) >= MIN_REFERENCE_PX &&
    actualTarget.height >= MIN_TARGET_PX &&
    smallestTarget.height >= MIN_TARGET_PX / 2
  );
}

function logUniform(rng: Rng, min: number, max: number): number {
  return Math.exp(randomBetween(rng, Math.log(min), Math.log(max)));
}

export function initialGuessFor(
  rng: Rng,
  actualCm: number,
  minGuessCm: number,
  maxGuessCm: number,
): number {
  const lowFactorMin = Math.max(START_FACTOR_MIN, (minGuessCm / actualCm) * 1.04);
  const lowFactorMax = 1 - START_MIN_DISTANCE;
  const highFactorMin = 1 + START_MIN_DISTANCE;
  const highFactorMax = Math.min(START_FACTOR_MAX, (maxGuessCm / actualCm) * 0.96);

  const lowValid = lowFactorMin < lowFactorMax;
  const highValid = highFactorMin < highFactorMax;
  const useLow = lowValid && (!highValid || rng() < 0.5);
  const factor = useLow
    ? logUniform(rng, lowFactorMin, lowFactorMax)
    : logUniform(rng, highFactorMin, highFactorMax);
  return actualCm * factor;
}

interface Candidate {
  reference: ScaleObjectDefinition;
  target: ScaleObjectDefinition;
}

function candidatesFor(
  difficulty: RoundDifficulty,
  usedIds: ReadonlySet<string>,
  usedTargetIds: ReadonlySet<string>,
  strictReuse: boolean,
): Candidate[] {
  const candidates: Candidate[] = [];
  for (const reference of scaleObjects) {
    for (const target of scaleObjects) {
      if (reference.id === target.id) continue;
      if (usedTargetIds.has(target.id)) continue;
      if (strictReuse && (usedIds.has(reference.id) || usedIds.has(target.id))) {
        continue;
      }
      if (!matchesDifficulty(reference, target, difficulty)) continue;
      candidates.push({ reference, target });
    }
  }
  return candidates;
}

export function generateRounds(seed: string): GameRound[] {
  const rng = createRng(seed);
  const usedIds = new Set<string>();
  const usedTargetIds = new Set<string>();
  const rounds: GameRound[] = [];

  for (let index = 0; index < ROUNDS_PER_GAME; index += 1) {
    const difficulty = DIFFICULTY_CURVE[index] ?? "wildcard";
    const answerPosition = randomBetween(rng, ANSWER_POSITION_MIN, ANSWER_POSITION_MAX);

    const attempts: Array<[RoundDifficulty, boolean]> = [
      [difficulty, true],
      [difficulty, false],
      ["wildcard", false],
    ];

    let chosen: Candidate | null = null;
    for (const [rule, strictReuse] of attempts) {
      const playable = candidatesFor(rule, usedIds, usedTargetIds, strictReuse).filter(
        ({ reference, target }) => {
          const bounds = guessBoundsFor(target.realSizeCm, answerPosition);
          return isPlayable(reference, target, bounds.minGuessCm, bounds.maxGuessCm);
        },
      );
      if (playable.length > 0) {
        chosen = pickOne(rng, playable);
        break;
      }
    }
    if (!chosen) {
      throw new Error(`No playable pair for round ${index + 1}`);
    }

    const { reference, target } = chosen;
    const { minGuessCm, maxGuessCm } = guessBoundsFor(target.realSizeCm, answerPosition);
    usedIds.add(reference.id);
    usedIds.add(target.id);
    usedTargetIds.add(target.id);

    rounds.push({
      referenceObjectId: reference.id,
      targetObjectId: target.id,
      difficulty,
      minGuessCm,
      maxGuessCm,
      initialGuessCm: initialGuessFor(rng, target.realSizeCm, minGuessCm, maxGuessCm),
    });
  }

  return rounds;
}
