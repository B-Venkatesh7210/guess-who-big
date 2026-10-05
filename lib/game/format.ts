function trimNumber(value: number, decimals: number): string {
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

/** Under a metre reads in cm, larger sizes in metres. Values are stored in cm. */
export function formatLength(cm: number): string {
  if (cm < 100) return `${trimNumber(Math.round(cm * 10) / 10, 1)} cm`;
  if (cm < 1000) return `${(cm / 100).toFixed(2)} m`;
  return `${trimNumber(cm / 100, 1)} m`;
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
