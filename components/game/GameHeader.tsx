import { formatScore } from "@/lib/game/format";

type GameHeaderProps = {
  roundNumber: number;
  roundCount: number;
  score: number | null;
};

export function GameHeader({ roundNumber, roundCount, score }: GameHeaderProps) {
  return (
    <header className="mb-6 grid grid-cols-3 items-start gap-3">
      <p className="text-[15px] font-semibold tracking-[0.18em] text-text-primary">
        SCALE IT
      </p>
      <p className="pt-1 text-center font-mono text-[11px] tracking-[0.16em] text-text-muted">
        ROUND {roundNumber} / {roundCount}
      </p>
      <p className="text-right font-mono text-[11px] tracking-[0.16em] text-text-muted">
        SCORE
        <span className="mt-1 block text-sm tracking-normal text-text-primary">
          {score == null ? "—" : formatScore(score)}
        </span>
      </p>
    </header>
  );
}
