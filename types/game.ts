export type MeasurementType =
  | "height"
  | "length"
  | "width"
  | "diameter"
  | "shoulder-height"
  | "wingspan";

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
}

export interface GameRound {
  referenceObjectId: string;
  targetObjectId: string;
}

export type GamePhase =
  | "guessing"
  | "locked"
  | "revealing"
  | "result"
  | "complete";
