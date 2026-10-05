import { getScaleObject } from "../../data/objects";
import {
  calculatePercentageError,
  calculateRelativeError,
  calculateScaleRatio,
} from "../scale/scaleMath";
import { calculateScore, getFeedbackMessage } from "../scoring/scoring";
import type { GameRound, ScaleObjectDefinition } from "../../types/game";

export const INITIAL_GUESS_RATIO = 0.72;
export const MIN_SCALE_RATIO = 0.15;
export const MAX_SCALE_RATIO = 1.5;
export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.5;
export const ZOOM_STEP = 0.1;

export const SCALE_STEPS = {
  normal: 0.02,
  precision: 0.005,
  large: 0.05,
} as const;

export const REVEAL_ANTICIPATION_MS = 280;
export const REVEAL_ANIMATION_MS = 680;
export const SCORE_COUNT_MS = 640;

export const PROTOTYPE_ROUND: GameRound = {
  referenceObjectId: "basketball",
  targetObjectId: "soda-can",
};

export interface RoundModel {
  reference: ScaleObjectDefinition;
  target: ScaleObjectDefinition;
  initialGuessCm: number;
  minGuessCm: number;
  maxGuessCm: number;
  correctRatio: number;
  initialRatio: number;
}

export interface RoundResult {
  lockedGuessCm: number;
  errorPercent: number;
  relativeError: number;
  score: number;
  feedback: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createRoundModel(
  round: GameRound = PROTOTYPE_ROUND,
): RoundModel {
  const reference = getScaleObject(round.referenceObjectId);
  const target = getScaleObject(round.targetObjectId);
  const correctRatio = calculateScaleRatio(
    target.realSizeCm,
    reference.realSizeCm,
  );

  return {
    reference,
    target,
    initialGuessCm: reference.realSizeCm * INITIAL_GUESS_RATIO,
    minGuessCm: reference.realSizeCm * MIN_SCALE_RATIO,
    maxGuessCm: reference.realSizeCm * MAX_SCALE_RATIO,
    correctRatio,
    initialRatio: INITIAL_GUESS_RATIO,
  };
}

/**
 * Reference pixel size from the stage width.
 * Ranges follow the constitution, while narrow stages stay inside the viewport.
 */
export function referenceBasePxForStageWidth(stageWidth: number): number {
  if (stageWidth <= 0) return 0;
  if (stageWidth < 520) return clamp(stageWidth * 0.39, 112, 168);
  if (stageWidth < 900) return clamp(stageWidth * 0.25, 168, 200);
  return clamp(stageWidth * 0.214, 210, 236);
}

export function objectFieldHeight(
  referenceBasePx: number,
  zoom: number,
): number {
  if (referenceBasePx <= 0) return 360;
  const maxObjectPx = referenceBasePx * zoom * MAX_SCALE_RATIO;
  const handleClearance = 72;
  return Math.round(Math.max(maxObjectPx + handleClearance, 280));
}

export function roundZoom(zoom: number): number {
  return Math.round(clamp(zoom, MIN_ZOOM, MAX_ZOOM) * 10) / 10;
}

export function evaluateGuess(
  guessCm: number,
  actualCm: number,
): RoundResult {
  const relativeError = calculateRelativeError(guessCm, actualCm);
  const errorPercent =
    Math.round(calculatePercentageError(guessCm, actualCm) * 10) / 10;

  return {
    lockedGuessCm: guessCm,
    errorPercent,
    relativeError,
    score: calculateScore(relativeError),
    feedback: getFeedbackMessage(errorPercent),
  };
}
