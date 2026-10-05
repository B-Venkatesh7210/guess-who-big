/** Pure centimeter scale math. No DOM access. */

export function calculateScaleRatio(
  targetCm: number,
  referenceCm: number,
): number {
  if (referenceCm === 0) return 0;
  return targetCm / referenceCm;
}

export function calculateRenderedSize(
  referenceRenderedPx: number,
  targetCm: number,
  referenceCm: number,
  zoom = 1,
): number {
  if (referenceCm === 0) return 0;
  return referenceRenderedPx * (targetCm / referenceCm) * zoom;
}

export function calculateGuessFromRenderedSize(
  targetRenderedPx: number,
  referenceRenderedPx: number,
  referenceCm: number,
): number {
  if (referenceRenderedPx === 0) return 0;
  return (targetRenderedPx / referenceRenderedPx) * referenceCm;
}

export function calculateRelativeError(
  guessCm: number,
  actualCm: number,
): number {
  if (actualCm === 0) return 0;
  return Math.abs(guessCm - actualCm) / actualCm;
}

export function calculatePercentageError(
  guessCm: number,
  actualCm: number,
): number {
  return calculateRelativeError(guessCm, actualCm) * 100;
}

export function clampTargetSize(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(min, value));
}

/** Log-scale slider position (0–1) so steps feel equal for tiny and huge objects. */
export function guessToSliderPosition(
  guessCm: number,
  minCm: number,
  maxCm: number,
): number {
  if (minCm <= 0 || maxCm <= minCm) return 0;
  const position = Math.log(guessCm / minCm) / Math.log(maxCm / minCm);
  return clampTargetSize(position, 0, 1);
}

export function sliderPositionToGuess(
  position: number,
  minCm: number,
  maxCm: number,
): number {
  const clamped = clampTargetSize(position, 0, 1);
  return minCm * (maxCm / minCm) ** clamped;
}

export function adjustGuessByPercent(
  guessCm: number,
  percentDelta: number,
  minCm: number,
  maxCm: number,
): number {
  return clampTargetSize(guessCm * (1 + percentDelta), minCm, maxCm);
}
