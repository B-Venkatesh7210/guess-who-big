import type { SilhouetteGeometry } from "../types/game";

/**
 * Pure geometry for every silhouette. Must stay in sync with the drawings in
 * components/objects/silhouetteArt.tsx, which use the same viewBox units.
 */
export const silhouetteGeometry: Record<string, SilhouetteGeometry> = {
  "golf-ball": { width: 100, height: 100, axis: "vertical", extent: 100 },
  battery: { width: 29, height: 100, axis: "vertical", extent: 100 },
  "tennis-ball": { width: 100, height: 100, axis: "vertical", extent: 100 },
  mug: { width: 108, height: 95, axis: "vertical", extent: 95 },
  "soda-can": { width: 66, height: 122, axis: "vertical", extent: 122 },
  smartphone: { width: 72, height: 147, axis: "vertical", extent: 147 },
  pencil: { width: 8, height: 190, axis: "vertical", extent: 190 },
  basketball: { width: 100, height: 100, axis: "vertical", extent: 100 },
  cat: { width: 160, height: 120, axis: "vertical", extent: 90 },
  "wine-bottle": { width: 76, height: 300, axis: "vertical", extent: 300 },
  "traffic-cone": { width: 38, height: 71, axis: "vertical", extent: 71 },
  guitar: { width: 40, height: 102, axis: "vertical", extent: 102 },
  horse: { width: 250, height: 220, axis: "vertical", extent: 160 },
  adult: { width: 52, height: 170, axis: "vertical", extent: 170 },
  fridge: { width: 70, height: 178, axis: "vertical", extent: 178 },
  door: { width: 92, height: 208, axis: "vertical", extent: 203 },
  elephant: { width: 500, height: 330, axis: "vertical", extent: 300 },
  car: { width: 450, height: 145, axis: "horizontal", extent: 450 },
  giraffe: { width: 300, height: 500, axis: "vertical", extent: 500 },
  bus: { width: 1200, height: 300, axis: "horizontal", extent: 1200 },
  whale: { width: 2400, height: 420, axis: "horizontal", extent: 2400 },
  airliner: { width: 3950, height: 1255, axis: "horizontal", extent: 3950 },
};

export function getSilhouetteGeometry(svgKey: string): SilhouetteGeometry {
  const geometry = silhouetteGeometry[svgKey];
  if (!geometry) {
    throw new Error(`Unknown silhouette: ${svgKey}`);
  }
  return geometry;
}
