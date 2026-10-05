import { getScaleObject } from "@/data/objects";
import { formatErrorPercent, formatLength, formatScore } from "@/lib/game/format";
import { MAX_GAME_SCORE } from "@/lib/game/gameEngine";
import { getFeedbackMessage } from "@/lib/scoring/scoring";
import type { GameRound, RoundResult } from "@/types/game";
import { PrimaryButton } from "@/components/ui/Buttons";
import { feedbackClass } from "./ResultReveal";

type GameSummaryProps = {
  rounds: GameRound[];
  results: RoundResult[];
  displayTotal: number | null;
  onPlayAgain: () => void;
};

export function GameSummary({ rounds, results, displayTotal, onPlayAgain }: GameSummaryProps) {
  const averageError =
    results.reduce((total, result) => total + result.errorPercent, 0) /
    Math.max(1, results.length);

  return (
    <section aria-labelledby="summary-title" className="result-in">
      <p className="font-mono text-[11px] tracking-[0.16em] text-text-muted">GAME COMPLETE</p>
      <h2 id="summary-title" className="sr-only">
        Final score
      </h2>
      <p className="mt-3 font-mono text-5xl text-text-primary sm:text-6xl">
        {formatScore(displayTotal ?? 0)}
        <span className="ml-3 text-xl text-text-muted">/ {formatScore(MAX_GAME_SCORE)}</span>
      </p>
      <p className={`mt-4 text-xl font-medium tracking-tight ${feedbackClass(averageError)}`}>
        {getFeedbackMessage(averageError)}
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        Average error {formatErrorPercent(averageError)} across {results.length} rounds.
      </p>

      <ol className="mt-8 border-t border-border-subtle">
        {rounds.map((round, index) => {
          const result = results[index];
          if (!result) return null;
          const target = getScaleObject(round.targetObjectId);
          const reference = getScaleObject(round.referenceObjectId);
          return (
            <li
              key={`${round.targetObjectId}-${index}`}
              className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-border-subtle py-4"
            >
              <span className="font-mono text-[11px] tracking-[0.16em] text-text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-medium text-text-primary">
                  {target.name}
                  <span className="font-normal text-text-secondary"> vs {reference.name}</span>
                </span>
                <span className="mt-1 block font-mono text-xs text-text-secondary">
                  {formatLength(result.lockedGuessCm)} guessed · {formatLength(target.realSizeCm)} actual ·{" "}
                  {formatErrorPercent(result.errorPercent)} off
                </span>
              </span>
              <span className="font-mono text-base text-text-primary">{result.score}</span>
            </li>
          );
        })}
      </ol>

      <PrimaryButton className="mt-8" onClick={onPlayAgain}>
        PLAY AGAIN
      </PrimaryButton>
    </section>
  );
}
