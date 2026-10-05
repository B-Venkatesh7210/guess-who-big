"use client";

import { useRef } from "react";
import { SCALE_STEPS } from "@/lib/game/gameEngine";
import { useGameRound } from "@/lib/game/useGameRound";
import { useStageWidth } from "@/lib/game/useStageWidth";
import { PrimaryButton } from "@/components/ui/Buttons";
import { GameHeader } from "./GameHeader";
import { GameStage } from "./GameStage";
import { ResultReveal } from "./ResultReveal";
import { ScaleControls } from "./ScaleControls";
import { useCountUp } from "./useCountUp";

export function Game() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageWidth = useStageWidth(stageRef);
  const round = useGameRound(stageWidth);
  const displayScore = useCountUp(
    round.phase === "result" ? round.roundScore : null,
    round.reducedMotion,
  );

  return (
    <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col px-4 py-4 sm:px-6 sm:py-8">
      <GameHeader score={displayScore} />
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[28px]">
        Match its real-world scale.
      </h1>
      <p id="game-help" className="mt-2 mb-4 max-w-xl text-sm leading-6 text-text-secondary">
        Resize the red object until you think its real-world size is correct.
      </p>

      <GameStage
        stageRef={stageRef}
        stageWidth={stageWidth}
        phase={round.phase}
        reducedMotion={round.reducedMotion}
        dragging={round.dragging}
        reference={round.model.reference}
        target={round.model.target}
        referenceRenderedPx={round.referenceRenderedPx}
        guessRenderedPx={round.guessRenderedPx}
        correctRenderedPx={round.correctRenderedPx}
        lockedRenderedPx={round.lockedRenderedPx}
        fieldHeight={round.fieldHeight}
        zoom={round.zoom}
        minZoom={round.minZoom}
        maxZoom={round.maxZoom}
        controlsEnabled={round.controlsEnabled}
        onZoomStep={round.stepZoom}
        onZoomReset={round.resetZoom}
        onResizePointerDown={round.onResizePointerDown}
        onResizePointerMove={round.onResizePointerMove}
        onResizePointerUp={round.endResize}
      />

      <ScaleControls
        ratio={round.guessRatio}
        disabled={!round.controlsEnabled}
        onRatioChange={round.setGuessRatio}
        onStep={(direction) => round.adjustGuess(direction * SCALE_STEPS.normal)}
      />

      {round.phase === "result" ? null : (
        <PrimaryButton
          className="mt-4"
          disabled={!round.controlsEnabled}
          onClick={round.lockIn}
        >
          LOCK IN
        </PrimaryButton>
      )}

      <ResultReveal
        phase={round.phase}
        guessCm={round.lockedGuessCm}
        actualCm={round.model.target.realSizeCm}
        errorPercent={round.errorPercent}
        score={displayScore}
        finalScore={round.roundScore}
        feedback={round.feedback}
        fact={round.model.target.fact}
        onPlayAgain={round.playAgain}
      />
    </main>
  );
}
