"use client";

import { useEffect, useRef } from "react";
import { SCALE_STEPS } from "@/lib/game/gameEngine";
import { useGame } from "@/lib/game/useGame";
import { useStageWidth } from "@/lib/game/useStageWidth";
import { PrimaryButton } from "@/components/ui/Buttons";
import { GameHeader } from "./GameHeader";
import { GameStage } from "./GameStage";
import { GameSummary } from "./GameSummary";
import { ResultReveal } from "./ResultReveal";
import { ScaleControls } from "./ScaleControls";
import { useCountUp } from "./useCountUp";

export function Game({ seed }: { seed: string }) {
  const mainRef = useRef<HTMLElement>(null);
  const stage = useStageWidth();
  const game = useGame(seed, stage.width);

  const headerScore = useCountUp(
    game.revealedScore > 0 || game.phase === "result" || game.phase === "complete"
      ? game.revealedScore
      : null,
    game.reducedMotion,
  );
  const roundScore = useCountUp(
    game.phase === "result" && game.result ? game.result.score : null,
    game.reducedMotion,
  );

  const roundKey = `${game.seed}-${game.roundIndex}`;
  const firstRoundKey = useRef(roundKey);
  useEffect(() => {
    if (firstRoundKey.current === roundKey) return;
    firstRoundKey.current = roundKey;
    const element = stage.elementRef.current;
    if (!element) return;
    element.focus({ preventScroll: true });
    if (element.getBoundingClientRect().top < 0) {
      mainRef.current?.scrollIntoView({
        block: "start",
        behavior: game.reducedMotion ? "auto" : "smooth",
      });
    }
  }, [game.reducedMotion, roundKey, stage.elementRef]);

  const completeKey = game.phase === "complete" ? game.seed : null;
  useEffect(() => {
    if (!completeKey) return;
    mainRef.current?.scrollIntoView({ block: "start" });
  }, [completeKey]);

  return (
    <main
      ref={mainRef}
      className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col px-4 py-4 sm:px-6 sm:py-8"
    >
      <GameHeader
        roundNumber={game.roundIndex + 1}
        roundCount={game.roundCount}
        score={headerScore}
      />

      {game.phase === "complete" ? (
        <GameSummary
          rounds={game.rounds}
          results={game.results}
          displayTotal={headerScore}
          onPlayAgain={game.newGame}
        />
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[28px]">
            Match its real-world scale.
          </h1>
          <p id="game-help" className="mt-2 mb-4 max-w-xl text-sm leading-6 text-text-secondary">
            Resize the red object until you think its real-world size is correct.
          </p>

          <GameStage
            stageRef={stage.ref}
            roundKey={roundKey}
            phase={game.phase}
            reducedMotion={game.reducedMotion}
            dragging={game.dragging}
            reference={game.reference}
            target={game.target}
            layout={game.layout}
            referenceRenderedPx={game.referenceRenderedPx}
            guessRenderedPx={game.guessRenderedPx}
            correctRenderedPx={game.correctRenderedPx}
            lockedRenderedPx={game.lockedRenderedPx}
            zoom={game.zoom}
            minZoom={game.minZoom}
            maxZoom={game.maxZoom}
            controlsEnabled={game.controlsEnabled}
            onZoomStep={game.stepZoom}
            onZoomReset={game.resetZoom}
            onResizePointerDown={game.onResizePointerDown}
            onResizePointerMove={game.onResizePointerMove}
            onResizePointerUp={game.endResize}
          />

          <ScaleControls
            guessCm={game.guessCm}
            minGuessCm={game.round.minGuessCm}
            maxGuessCm={game.round.maxGuessCm}
            ratio={game.guessRatio}
            disabled={!game.controlsEnabled}
            onGuessChange={game.setGuessCm}
            onStep={(direction) => game.adjustGuess(direction * SCALE_STEPS.normal)}
          />

          {game.phase === "result" ? null : (
            <PrimaryButton
              className="mt-4"
              disabled={!game.controlsEnabled}
              onClick={game.lockIn}
            >
              LOCK IN
            </PrimaryButton>
          )}

          <ResultReveal
            phase={game.phase}
            result={game.result}
            displayScore={roundScore}
            actualCm={game.target.realSizeCm}
            fact={game.target.fact}
            isLastRound={game.isLastRound}
            onNext={game.nextRound}
          />
        </>
      )}
    </main>
  );
}
