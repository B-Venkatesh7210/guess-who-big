export function calculateScore(relativeError: number): number {
  if (!Number.isFinite(relativeError)) return 0;
  const raw = Math.round(1000 * Math.exp(-3 * Math.max(0, relativeError)));
  return Math.min(1000, Math.max(0, raw));
}

/** `errorPercent` is a percentage, so 12.3 means 12.3% off. */
export function getFeedbackMessage(errorPercent: number): string {
  if (errorPercent < 1) return "BULLSEYE.";
  if (errorPercent < 3) return "RIDICULOUSLY CLOSE.";
  if (errorPercent < 7) return "GREAT EYE.";
  if (errorPercent < 15) return "PRETTY CLOSE.";
  if (errorPercent < 25) return "NOT BAD.";
  if (errorPercent < 40) return "A LITTLE OFF.";
  if (errorPercent < 60) return "WAY OFF.";
  return "REALITY HAD OTHER PLANS.";
}
