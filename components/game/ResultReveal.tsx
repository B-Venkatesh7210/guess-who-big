import { formatErrorPercent, formatLength } from "@/lib/game/format";
import type { GamePhase, RoundResult } from "@/types/game";
import { PrimaryButton } from "@/components/ui/Buttons";

type ResultRevealProps = {
  phase: GamePhase;
  result: RoundResult | null;
  displayScore: number | null;
  actualCm: number;
  fact: string;
  isLastRound: boolean;
  onNext: () => void;
};

export function ResultReveal({
  phase,
  result,
  displayScore,
  actualCm,
  fact,
  isLastRound,
  onNext,
}: ResultRevealProps) {
  const revealing = phase === "locked" || phase === "revealing";
  const showingResult = phase === "result" && result != null;

  const announcement = showingResult
    ? `Your guess ${formatLength(result.lockedGuessCm)}. Actual ${formatLength(actualCm)}. Error ${formatErrorPercent(result.errorPercent)}. Score ${result.score}. ${result.feedback} ${fact}`
    : revealing
      ? "Locked in. Revealing the true scale."
      : "";

  return (
    <section className="mt-6" aria-live="polite">
      <p className="sr-only">{announcement}</p>
      {showingResult ? (
        <div>
          <dl className="result-in grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            <Stat label="YOUR GUESS" value={formatLength(result.lockedGuessCm)} swatch="guess" />
            <Stat label="ACTUAL" value={formatLength(actualCm)} swatch="actual" />
            <Stat label="ERROR" value={formatErrorPercent(result.errorPercent)} />
            <Stat label="SCORE" value={`${displayScore ?? 0} / 1000`} />
          </dl>
          <p
            className={`result-in mt-6 text-xl font-medium tracking-tight ${feedbackClass(result.errorPercent)}`}
            style={{ animationDelay: "560ms" }}
          >
            {result.feedback}
          </p>
          <p
            className="result-in mt-3 max-w-xl text-base leading-6 text-text-secondary"
            style={{ animationDelay: "900ms" }}
          >
            {fact}
          </p>
          <div className="result-in mt-6" style={{ animationDelay: "1160ms" }}>
            <PrimaryButton onClick={onNext}>
              {isLastRound ? "SEE RESULTS" : "NEXT ROUND"}
            </PrimaryButton>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Stat({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: "guess" | "actual";
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-text-muted">
        {swatch === "guess" ? (
          <span
            aria-hidden="true"
            className="block h-3 w-3 rounded-[2px] border border-dashed border-text-primary"
          />
        ) : null}
        {swatch === "actual" ? (
          <span aria-hidden="true" className="block h-3 w-3 rounded-[2px] bg-target" />
        ) : null}
        {label}
      </dt>
      <dd className="mt-2 font-mono text-xl text-text-primary">{value}</dd>
    </div>
  );
}

export function feedbackClass(errorPercent: number): string {
  if (errorPercent < 15) return "text-success";
  if (errorPercent < 40) return "text-warning";
  return "text-danger";
}
