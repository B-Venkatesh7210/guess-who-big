"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createGameSeed } from "../random/random";
import {
  calculateGuessFromRenderedSize,
  calculateRenderedSize,
  calculateScaleRatio,
} from "../scale/scaleMath";
import { computeStageLayout, heightPerMeasuredPx } from "../scale/stageLayout";
import {
  getRoundObjects,
  MAX_ZOOM,
  MIN_ZOOM,
  REVEAL_ANIMATION_MS,
  REVEAL_ANTICIPATION_MS,
  SCALE_STEPS,
} from "./gameEngine";
import {
  createGame,
  currentResult,
  currentRound,
  gameReducer,
  isLastRound,
  revealedScore,
} from "./gameState";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface DragState {
  pointerId: number;
  startY: number;
  startMeasuredPx: number;
  referenceRenderedPx: number;
}

export function useGame(initialSeed: string, stageWidth: number) {
  const [state, dispatch] = useReducer(gameReducer, initialSeed, createGame);
  const reducedMotion = usePrefersReducedMotion();
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);

  const round = currentRound(state);
  const result = currentResult(state);
  const { reference, target } = useMemo(() => getRoundObjects(round), [round]);
  const targetGeometry = target.art;
  const { phase, guessCm, zoom } = state;

  const layout = computeStageLayout({
    stageWidth,
    zoom,
    referenceCm: reference.realSizeCm,
    referenceGeometry: reference.art,
    targetMaxCm: round.maxGuessCm,
    targetGeometry,
  });
  const referenceRenderedPx = layout.referenceRenderedPx;
  const toRenderedPx = (cm: number) =>
    calculateRenderedSize(referenceRenderedPx, cm, reference.realSizeCm);

  useEffect(() => {
    if (phase !== "locked") return;
    const delay = reducedMotion ? 0 : REVEAL_ANTICIPATION_MS;
    const timeout = window.setTimeout(() => dispatch({ type: "begin-reveal" }), delay);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const delay = reducedMotion ? 0 : REVEAL_ANIMATION_MS;
    const timeout = window.setTimeout(() => dispatch({ type: "finish-reveal" }), delay);
    return () => window.clearTimeout(timeout);
  }, [phase, reducedMotion]);

  const setGuessCm = useCallback((value: number) => {
    dispatch({ type: "set-guess", guessCm: value });
  }, []);

  const adjustGuess = useCallback((percentDelta: number) => {
    dispatch({ type: "adjust-guess", percentDelta });
  }, []);

  const stepZoom = useCallback((direction: -1 | 1) => {
    dispatch({ type: "step-zoom", direction });
  }, []);

  const resetZoom = useCallback(() => dispatch({ type: "reset-zoom" }), []);

  const lockIn = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
    dispatch({ type: "lock-in" });
  }, []);

  const nextRound = useCallback(() => dispatch({ type: "next-round" }), []);

  const newGame = useCallback(() => {
    dispatch({ type: "new-game", seed: createGameSeed() });
  }, []);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase !== "guessing" || referenceRenderedPx <= 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startMeasuredPx: calculateRenderedSize(
          referenceRenderedPx,
          guessCm,
          reference.realSizeCm,
        ),
        referenceRenderedPx,
      };
      setDragging(true);
    },
    [guessCm, phase, reference.realSizeCm, referenceRenderedPx],
  );

  const onResizePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const deltaY = drag.startY - event.clientY;
      // The handle sits on the silhouette's top edge, so convert visible height back to the measured span.
      const measuredPx = drag.startMeasuredPx + deltaY / heightPerMeasuredPx(targetGeometry);
      setGuessCm(
        calculateGuessFromRenderedSize(
          measuredPx,
          drag.referenceRenderedPx,
          reference.realSizeCm,
        ),
      );
    },
    [reference.realSizeCm, setGuessCm, targetGeometry],
  );

  const endResize = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    if (phase !== "guessing" && phase !== "result") return;

    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target;
      if (!(element instanceof Element)) return;
      const key = event.key;
      const onRange = element instanceof HTMLInputElement && element.type === "range";

      if (phase === "result") {
        if (key === "Enter" && !element.closest("button, input, textarea, select")) {
          event.preventDefault();
          nextRound();
        }
        return;
      }

      if (element.closest("input, textarea, select")) {
        if (key === "Enter" && onRange) {
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

      if (key === "Enter" && !element.closest("button")) {
        event.preventDefault();
        lockIn();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [adjustGuess, lockIn, nextRound, phase]);

  return {
    seed: state.seed,
    roundIndex: state.roundIndex,
    roundCount: state.rounds.length,
    rounds: state.rounds,
    results: state.results,
    round,
    reference,
    target,
    phase,
    guessCm,
    guessRatio: calculateScaleRatio(guessCm, reference.realSizeCm),
    zoom,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    dragging,
    reducedMotion,
    controlsEnabled: phase === "guessing",
    isLastRound: isLastRound(state),
    layout,
    referenceRenderedPx,
    guessRenderedPx: toRenderedPx(guessCm),
    correctRenderedPx: toRenderedPx(target.realSizeCm),
    lockedRenderedPx: result ? toRenderedPx(result.lockedGuessCm) : null,
    result,
    revealedScore: revealedScore(state),
    setGuessCm,
    adjustGuess,
    stepZoom,
    resetZoom,
    lockIn,
    nextRound,
    newGame,
    onResizePointerDown,
    onResizePointerMove,
    endResize,
  };
}
