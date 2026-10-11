function trimNumber(value: number, decimals: number): string {
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

const CM_PER_M = 100;
const CM_PER_KM = 100_000;

/**
 * Values are stored in cm. Under a metre reads in cm, up to 10 km in metres
 * (so mountain heights read the way they are quoted), beyond that in km.
 */
export function formatLength(cm: number): string {
  if (cm < CM_PER_M) return `${trimNumber(Math.round(cm * 10) / 10, 1)} cm`;
  if (cm < 10 * CM_PER_M) return `${(cm / CM_PER_M).toFixed(2)} m`;
  if (cm < 10 * CM_PER_KM) {
    return `${(cm / CM_PER_M).toLocaleString("en-US", { maximumFractionDigits: 1 })} m`;
  }
  return `${Math.round(cm / CM_PER_KM).toLocaleString("en-US")} km`;
}

export function formatScaleRatio(ratio: number): string {
  return ratio < 10 ? `${ratio.toFixed(2)}×` : `${ratio.toFixed(1)}×`;
}

export function formatErrorPercent(errorPercent: number): string {
  return `${errorPercent.toFixed(1)}%`;
}

export function formatZoom(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}

export function formatScore(score: number): string {
  return score.toLocaleString("en-US");
}
