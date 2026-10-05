import { formatCentimeters, formatErrorPercent } from "@/lib/game/format";
import type { GamePhase } from "@/types/game";
import { PrimaryButton } from "@/components/ui/Buttons";

type ResultRevealProps = {
  phase: GamePhase;
  guessCm: number | null;
  actualCm: number;
  errorPercent: number | null;
  score: number | null;
  finalScore: number | null;
  feedback: string | null;
  fact: string;
  onPlayAgain: () => void;
};

export function ResultReveal({
  phase,
  guessCm,
  actualCm,
  errorPercent,
  score,
  finalScore,
  feedback,
  fact,
  onPlayAgain,
}: ResultRevealProps) {
  const revealing = phase === "locked" || phase === "revealing";
  const showingResult =
    phase === "result" &&
    guessCm != null &&
    errorPercent != null &&
    finalScore != null &&
    feedback != null;

  const announcement = showingResult
    ? `Your guess ${formatCentimeters(guessCm)}. Actual ${formatCentimeters(actualCm)}. Error ${formatErrorPercent(errorPercent)}. Score ${finalScore}. ${feedback} ${fact}`
    : revealing
      ? "Locked in. Revealing the true scale."
      : "";

  return (
    <section className="mt-6" aria-live="polite">
      <p className="sr-only">{announcement}</p>
      {showingResult ? (
        <div>
          <dl className="result-in grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            <Stat
              label="YOUR GUESS"
              value={formatCentimeters(guessCm)}
              swatch="guess"
            />
            <Stat
              label="ACTUAL"
              value={formatCentimeters(actualCm)}
              swatch="actual"
            />
            <Stat label="ERROR" value={formatErrorPercent(errorPercent)} />
            <Stat label="SCORE" value={`${score ?? 0} / 1000`} />
          </dl>
          <p
            className={`result-in mt-6 text-xl font-medium tracking-tight ${feedbackClass(errorPercent)}`}
            style={{ animationDelay: "560ms" }}
          >
            {feedback}
          </p>
          <p
            className="result-in mt-3 max-w-xl text-base leading-6 text-text-secondary"
            style={{ animationDelay: "900ms" }}
          >
            {fact}
          </p>
          <p
            className="result-in mt-6 font-mono text-[11px] tracking-[0.16em] text-text-muted"
            style={{ animationDelay: "1120ms" }}
          >
            ROUND COMPLETE
          </p>
          <div className="result-in mt-4" style={{ animationDelay: "1240ms" }}>
            <PrimaryButton onClick={onPlayAgain}>PLAY AGAIN</PrimaryButton>
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

function feedbackClass(errorPercent: number): string {
  if (errorPercent < 15) return "text-success";
  if (errorPercent < 40) return "text-warning";
  return "text-danger";
}
