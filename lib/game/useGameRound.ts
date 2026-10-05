"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  adjustGuessByPercent,
  calculateGuessFromRenderedSize,
  calculateRenderedSize,
  calculateScaleRatio,
  clampTargetSize,
} from "../scale/scaleMath";
import type { GamePhase } from "../../types/game";
import {
  createRoundModel,
  DEFAULT_ZOOM,
  evaluateGuess,
  MAX_ZOOM,
  MIN_ZOOM,
  objectFieldHeight,
  referenceBasePxForStageWidth,
  REVEAL_ANIMATION_MS,
  REVEAL_ANTICIPATION_MS,
  roundZoom,
  SCALE_STEPS,
  ZOOM_STEP,
} from "./gameEngine";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useGameRound(stageWidth: number) {
  const model = useMemo(() => createRoundModel(), []);
  const reducedMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<GamePhase>("guessing");
  const [guessCm, setGuessCm] = useState(model.initialGuessCm);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [lockedGuessCm, setLockedGuessCm] = useState<number | null>(null);
  const [errorPercent, setErrorPercent] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const referenceBasePx = referenceBasePxForStageWidth(stageWidth);
  const referenceRenderedPx = referenceBasePx * zoom;
  const guessRenderedPx = calculateRenderedSize(
    referenceRenderedPx,
    guessCm,
    model.reference.realSizeCm,
  );
  const correctRenderedPx = calculateRenderedSize(
    referenceRenderedPx,
    model.target.realSizeCm,
    model.reference.realSizeCm,
  );
  const lockedRenderedPx =
    lockedGuessCm == null
      ? null
      : calculateRenderedSize(
          referenceRenderedPx,
          lockedGuessCm,
          model.reference.realSizeCm,
        );

  const guessRatio = calculateScaleRatio(guessCm, model.reference.realSizeCm);
  const controlsEnabled = phase === "guessing";

  useEffect(() => {
    if (phase !== "locked") return;
    const delay = reducedMotion ? 0 : REVEAL_ANTICIPATION_MS;
    const timeout = window.setTimeout(() => setPhase("revealing"), delay);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const delay = reducedMotion ? 0 : REVEAL_ANIMATION_MS;
    const timeout = window.setTimeout(() => setPhase("result"), delay);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion]);

  const setGuessRatio = useCallback(
    (ratio: number) => {
      setGuessCm(
        clampTargetSize(
          model.reference.realSizeCm * ratio,
          model.minGuessCm,
          model.maxGuessCm,
        ),
      );
    },
    [model.maxGuessCm, model.minGuessCm, model.reference.realSizeCm],
  );

  const adjustGuess = useCallback(
    (percentDelta: number) => {
      setGuessCm((current) =>
        adjustGuessByPercent(
          current,
          percentDelta,
          model.minGuessCm,
          model.maxGuessCm,
        ),
      );
    },
    [model.maxGuessCm, model.minGuessCm],
  );

  const changeZoom = useCallback(
    (next: number) => {
      if (phase !== "guessing") return;
      setZoom(roundZoom(next));
    },
    [phase],
  );

  const stepZoom = useCallback(
    (direction: -1 | 1) => {
      if (phase !== "guessing") return;
      setZoom((current) => roundZoom(current + direction * ZOOM_STEP));
    },
    [phase],
  );

  const resetZoom = useCallback(() => {
    changeZoom(DEFAULT_ZOOM);
  }, [changeZoom]);

  const lockIn = useCallback(() => {
    if (phase !== "guessing") return;
    const result = evaluateGuess(guessCm, model.target.realSizeCm);
    setLockedGuessCm(result.lockedGuessCm);
    setErrorPercent(result.errorPercent);
    setRoundScore(result.score);
    setFeedback(result.feedback);
    setDragging(false);
    setPhase("locked");
  }, [guessCm, model.target.realSizeCm, phase]);

  const playAgain = useCallback(() => {
    setPhase("guessing");
    setGuessCm(model.initialGuessCm);
    setZoom(DEFAULT_ZOOM);
    setLockedGuessCm(null);
    setErrorPercent(null);
    setRoundScore(null);
    setFeedback(null);
    setDragging(false);
  }, [model.initialGuessCm]);

  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startGuessCm: number;
    referenceRenderedPx: number;
  } | null>(null);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase !== "guessing" || referenceRenderedPx <= 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startGuessCm: guessCm,
        referenceRenderedPx,
      };
      setDragging(true);
    },
    [guessCm, phase, referenceRenderedPx],
  );

  const onResizePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const deltaY = drag.startY - event.clientY;
      const startPx = calculateRenderedSize(
        drag.referenceRenderedPx,
        drag.startGuessCm,
        model.reference.realSizeCm,
      );
      const nextGuess = calculateGuessFromRenderedSize(
        startPx + deltaY,
        drag.referenceRenderedPx,
        model.reference.realSizeCm,
      );
      setGuessCm(
        clampTargetSize(nextGuess, model.minGuessCm, model.maxGuessCm),
      );
    },
    [model.maxGuessCm, model.minGuessCm, model.reference.realSizeCm],
  );

  const endResize = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    if (phase !== "guessing") return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const key = event.key;
      const inField = target.closest("input, textarea, select");

      if (inField) {
        if (
          key === "Enter" &&
          target instanceof HTMLInputElement &&
          target.type === "range"
        ) {
          event.preventDefault();
          lockIn();
        }
        return;
      }

      if (key === "ArrowLeft" || key === "ArrowRight") {
        event.preventDefault();
        const step = event.shiftKey ? SCALE_STEPS.precision : SCALE_STEPS.normal;
        adjustGuess(key === "ArrowLeft" ? -step : step);
        return;
      }

      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        adjustGuess(key === "ArrowDown" ? -SCALE_STEPS.large : SCALE_STEPS.large);
        return;
      }

      if (key === "Enter") {
        if (target.closest("button")) return;
        event.preventDefault();
        lockIn();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [adjustGuess, lockIn, phase]);

  return {
    model,
    phase,
    guessCm,
    guessRatio,
    zoom,
    dragging,
    controlsEnabled,
    reducedMotion,
    referenceBasePx,
    referenceRenderedPx,
    guessRenderedPx,
    correctRenderedPx,
    lockedRenderedPx,
    fieldHeight: objectFieldHeight(referenceBasePx, zoom),
    lockedGuessCm,
    errorPercent,
    roundScore,
    feedback,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    setGuessRatio,
    adjustGuess,
    stepZoom,
    resetZoom,
    lockIn,
    playAgain,
    onResizePointerDown,
    onResizePointerMove,
    endResize,
  };
}
