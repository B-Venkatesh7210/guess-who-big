import { getScaleObject } from "../../data/objects";
import {
  calculatePercentageError,
  calculateRelativeError,
} from "../scale/scaleMath";
import { calculateScore, getFeedbackMessage } from "../scoring/scoring";
import type {
  GameRound,
  RoundResult,
  ScaleObjectDefinition,
} from "../../types/game";

export const ROUNDS_PER_GAME = 5;
export const MAX_ROUND_SCORE = 1000;
export const MAX_GAME_SCORE = ROUNDS_PER_GAME * MAX_ROUND_SCORE;

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

export interface RoundObjects {
  reference: ScaleObjectDefinition;
  target: ScaleObjectDefinition;
}

export function getRoundObjects(round: GameRound): RoundObjects {
  return {
    reference: getScaleObject(round.referenceObjectId),
    target: getScaleObject(round.targetObjectId),
  };
}

export function roundZoom(zoom: number): number {
  return Math.round(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) * 10) / 10;
}

export function evaluateGuess(guessCm: number, actualCm: number): RoundResult {
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
