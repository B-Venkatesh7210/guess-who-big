import type {
  Familiarity,
  MeasureAxis,
  MeasurementType,
  ObjectCategory,
} from "../types/game";

export type ArtView = "side" | "front";
export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

/** How the object's AI render is prompted and how the pipeline turns it into art. */
export interface ArtSpec {
  /** What to render, including the details the render must show. */
  subject: string;
  view: ArtView;
  /** Side views only. */
  facing?: "left" | "right";
  aspectRatio: AspectRatio;
  /** Wikimedia Commons search used to find reference photos. */
  referenceQuery: string;
  /** Silhouette axis that carries the real measurement. */
  axis: MeasureAxis;
  /** Fraction of the silhouette span along `axis` that the measurement covers. Default 1. */
  extentRatio?: number;
  /** Re-shade with a Lambert sphere lit from the top-left (balls, planets). */
  relight?: "sphere";
  relightStrength?: number;
  /** Blur sigma before tone banding; raise for grainy renders. Default 2. */
  shadeBlur?: number;
  /** Green-key margin; raise if the object loses edges, lower if green fringes remain. */
  keyMargin?: number;
}

export interface CatalogEntry {
  id: string;
  name: string;
  category: ObjectCategory;
  measurementType: MeasurementType;
  realSizeCm: number;
  fact: string;
  approximationLabel?: string;
  /** URL or citation for the real-world size. */
  sizeSource: string;
  familiarity: Familiarity;
  art: ArtSpec;
}
