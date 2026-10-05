export type MeasurementType =
  | "height"
  | "length"
  | "width"
  | "diameter"
  | "shoulder-height"
  | "wingspan";

/** 1 = everyone knows its size, 3 = most people have never stood next to one. */
export type Familiarity = 1 | 2 | 3;

export interface ScaleObjectDefinition {
  id: string;
  name: string;
  category: string;
  measurementType: MeasurementType;
  realSizeCm: number;
  svgKey: string;
  fact: string;
  approximationLabel?: string;
  sourceNote?: string;
  familiarity: Familiarity;
}

/** Which silhouette axis carries the real measurement. */
export type MeasureAxis = "vertical" | "horizontal";

/**
 * Silhouette geometry in viewBox units. The silhouette rests on the bottom
 * edge of its viewBox. `extent` is the span along `axis` that equals the
 * object's real measurement.
 */
export interface SilhouetteGeometry {
  width: number;
  height: number;
  axis: MeasureAxis;
  extent: number;
}

export type RoundDifficulty =
  | "easy"
  | "easy-medium"
  | "medium"
  | "hard"
  | "wildcard";

export interface GameRound {
  referenceObjectId: string;
  targetObjectId: string;
  difficulty: RoundDifficulty;
  minGuessCm: number;
  maxGuessCm: number;
  initialGuessCm: number;
}

export interface RoundResult {
  lockedGuessCm: number;
  errorPercent: number;
  relativeError: number;
  score: number;
  feedback: string;
}

export type GamePhase =
  | "guessing"
  | "locked"
  | "revealing"
  | "result"
  | "complete";
