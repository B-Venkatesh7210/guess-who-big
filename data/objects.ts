import type { MeasurementType, ScaleObjectDefinition } from "../types/game";
import { generatedObjects } from "./generated/objects";

/**
 * Every playable object. Edit catalog/ and run `npm run objects:build`;
 * only entries whose art has been built appear here.
 */
export const scaleObjects: readonly ScaleObjectDefinition[] = generatedObjects;

const objectsById = new Map(scaleObjects.map((object) => [object.id, object]));

export function getScaleObject(id: string): ScaleObjectDefinition {
  const object = objectsById.get(id);
  if (!object) {
    throw new Error(`Unknown scale object: ${id}`);
  }
  return object;
}

const measurementLabels: Record<MeasurementType, string> = {
  height: "Height",
  length: "Length",
  width: "Width",
  diameter: "Diameter",
  "shoulder-height": "Shoulder height",
  wingspan: "Wingspan",
  elevation: "Elevation",
};

export function measurementLabel(type: MeasurementType): string {
  return measurementLabels[type];
}
