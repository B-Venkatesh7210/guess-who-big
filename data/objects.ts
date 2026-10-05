import type { MeasurementType, ScaleObjectDefinition } from "../types/game";

export const scaleObjects = {
  basketball: {
    id: "basketball",
    name: "Basketball",
    category: "sports",
    measurementType: "diameter",
    realSizeCm: 24,
    svgKey: "basketball",
    fact: "A regulation-size basketball is roughly 24 cm across.",
    approximationLabel: "Typical regulation basketball",
  },
  "soda-can": {
    id: "soda-can",
    name: "Soda Can",
    category: "everyday",
    measurementType: "height",
    realSizeCm: 12.2,
    svgKey: "soda-can",
    fact: "A standard 330 ml soda can is roughly 12 cm tall.",
    approximationLabel: "Typical 330 ml can",
  },
} as const satisfies Record<string, ScaleObjectDefinition>;

export type ScaleObjectId = keyof typeof scaleObjects;

export function getScaleObject(id: string): ScaleObjectDefinition {
  const object = scaleObjects[id as ScaleObjectId];
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
};

export function measurementLabel(type: MeasurementType): string {
  return measurementLabels[type];
}
