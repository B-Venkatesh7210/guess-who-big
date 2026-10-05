export function formatCentimeters(cm: number): string {
  const rounded = Math.round(cm * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  return `${text} cm`;
}

export function formatScaleRatio(ratio: number): string {
  return `${ratio.toFixed(2)}×`;
}

export function formatErrorPercent(errorPercent: number): string {
  return `${errorPercent.toFixed(1)}%`;
}

export function formatZoom(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}
