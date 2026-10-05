import type { SilhouetteGeometry } from "../../types/game";

export interface ObjectBox {
  width: number;
  height: number;
  pxPerUnit: number;
}

/** Rendered box for a silhouette whose measured dimension spans `measuredPx`. */
export function silhouetteBox(
  geometry: SilhouetteGeometry,
  measuredPx: number,
): ObjectBox {
  const pxPerUnit = geometry.extent > 0 ? measuredPx / geometry.extent : 0;
  return {
    width: geometry.width * pxPerUnit,
    height: geometry.height * pxPerUnit,
    pxPerUnit,
  };
}

/** Vertical px the visible silhouette grows per measured px. */
export function heightPerMeasuredPx(geometry: SilhouetteGeometry): number {
  return geometry.extent > 0 ? geometry.height / geometry.extent : 1;
}

export interface StageMetrics {
  contentHeight: number;
  sidePadding: number;
  minGap: number;
  minSlotWidth: number;
  clearance: number;
}

export function stageMetricsForWidth(stageWidth: number): StageMetrics {
  if (stageWidth < 520) {
    return { contentHeight: 300, sidePadding: 12, minGap: 24, minSlotWidth: 120, clearance: 72 };
  }
  if (stageWidth < 900) {
    return { contentHeight: 360, sidePadding: 16, minGap: 32, minSlotWidth: 140, clearance: 72 };
  }
  return { contentHeight: 400, sidePadding: 24, minGap: 48, minSlotWidth: 160, clearance: 72 };
}

export interface StageLayoutInput {
  stageWidth: number;
  zoom: number;
  referenceCm: number;
  referenceGeometry: SilhouetteGeometry;
  targetMaxCm: number;
  targetGeometry: SilhouetteGeometry;
}

export interface StageLayout {
  /** px per real centimeter at zoom 1. Both objects share it. */
  pxPerCm: number;
  referenceRenderedPx: number;
  referenceSlotWidth: number;
  targetSlotWidth: number;
  /** Space from the target slot's center to the stage's right edge. */
  targetSideRoom: number;
  fieldHeight: number;
  sidePadding: number;
}

/**
 * Picks one px-per-cm for the round so the reference and the target at its
 * largest allowed guess both fit the stage at zoom 1. Zoom multiplies it.
 */
export function computeStageLayout(input: StageLayoutInput): StageLayout {
  const metrics = stageMetricsForWidth(input.stageWidth);
  const empty: StageLayout = {
    pxPerCm: 0,
    referenceRenderedPx: 0,
    referenceSlotWidth: metrics.minSlotWidth,
    targetSlotWidth: metrics.minSlotWidth,
    targetSideRoom: 0,
    fieldHeight: metrics.contentHeight + metrics.clearance,
    sidePadding: metrics.sidePadding,
  };
  if (input.stageWidth <= 0 || input.referenceCm <= 0 || input.targetMaxCm <= 0) {
    return empty;
  }

  const ref = input.referenceGeometry;
  const tgt = input.targetGeometry;
  const refHeightPerCm = (input.referenceCm * ref.height) / ref.extent;
  const refWidthPerCm = (input.referenceCm * ref.width) / ref.extent;
  const tgtHeightPerCm = (input.targetMaxCm * tgt.height) / tgt.extent;
  const tgtWidthPerCm = (input.targetMaxCm * tgt.width) / tgt.extent;

  const innerWidth = input.stageWidth - metrics.sidePadding * 2;
  const available = innerWidth - metrics.minGap;
  const heightScale = metrics.contentHeight / Math.max(refHeightPerCm, tgtHeightPerCm);

  let widthScale = available / (refWidthPerCm + tgtWidthPerCm);
  for (let pass = 0; pass < 2; pass += 1) {
    const scale = Math.min(heightScale, widthScale);
    const refNarrow = refWidthPerCm * scale < metrics.minSlotWidth;
    const tgtNarrow = tgtWidthPerCm * scale < metrics.minSlotWidth;
    if (refNarrow && tgtNarrow) break;
    if (refNarrow) widthScale = (available - metrics.minSlotWidth) / tgtWidthPerCm;
    else if (tgtNarrow) widthScale = (available - metrics.minSlotWidth) / refWidthPerCm;
    else break;
  }

  const pxPerCm = Math.max(0, Math.min(heightScale, widthScale));
  const zoom = input.zoom;
  const referenceSlotWidth = Math.max(refWidthPerCm * pxPerCm * zoom, metrics.minSlotWidth);
  const targetSlotWidth = Math.max(tgtWidthPerCm * pxPerCm * zoom, metrics.minSlotWidth);
  const gap = Math.max(0, (innerWidth - referenceSlotWidth - targetSlotWidth) / 3);
  const tallest = Math.max(refHeightPerCm, tgtHeightPerCm) * pxPerCm * zoom;

  return {
    pxPerCm,
    referenceRenderedPx: input.referenceCm * pxPerCm * zoom,
    referenceSlotWidth,
    targetSlotWidth,
    targetSideRoom: Math.max(0, targetSlotWidth / 2 + gap + metrics.sidePadding - 8),
    fieldHeight: Math.round(Math.max(tallest + metrics.clearance, 240)),
    sidePadding: metrics.sidePadding,
  };
}
