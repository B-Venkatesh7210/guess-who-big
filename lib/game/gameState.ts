import { adjustGuessByPercent, clampTargetSize } from "../scale/scaleMath";
import type { GamePhase, GameRound, RoundResult } from "../../types/game";
import {
  DEFAULT_ZOOM,
  evaluateGuess,
  getRoundObjects,
  roundZoom,
  ZOOM_STEP,
} from "./gameEngine";
import { generateRounds } from "./roundGenerator";

export interface GameState {
  seed: string;
  rounds: GameRound[];
  roundIndex: number;
  phase: GamePhase;
  guessCm: number;
  zoom: number;
  results: RoundResult[];
}

export type GameAction =
  | { type: "set-guess"; guessCm: number }
  | { type: "adjust-guess"; percentDelta: number }
  | { type: "step-zoom"; direction: -1 | 1 }
  | { type: "reset-zoom" }
  | { type: "lock-in" }
  | { type: "begin-reveal" }
  | { type: "finish-reveal" }
  | { type: "next-round" }
  | { type: "new-game"; seed: string };

export function createGame(seed: string): GameState {
  const rounds = generateRounds(seed);
  return {
    seed,
    rounds,
    roundIndex: 0,
    phase: "guessing",
    guessCm: rounds[0].initialGuessCm,
    zoom: DEFAULT_ZOOM,
    results: [],
  };
}

export function currentRound(state: GameState): GameRound {
  return state.rounds[state.roundIndex];
}

export function currentResult(state: GameState): RoundResult | null {
  return state.results[state.roundIndex] ?? null;
}

/** Score the player has seen revealed so far. Locked but unrevealed rounds do not count yet. */
export function revealedScore(state: GameState): number {
  const revealedRounds =
    state.phase === "result" || state.phase === "complete"
      ? state.roundIndex + 1
      : state.roundIndex;
  return state.results
    .slice(0, revealedRounds)
    .reduce((total, result) => total + result.score, 0);
}

export function isLastRound(state: GameState): boolean {
  return state.roundIndex >= state.rounds.length - 1;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const round = currentRound(state);

  switch (action.type) {
    case "set-guess": {
      if (state.phase !== "guessing") return state;
      return {
        ...state,
        guessCm: clampTargetSize(action.guessCm, round.minGuessCm, round.maxGuessCm),
      };
    }
    case "adjust-guess": {
      if (state.phase !== "guessing") return state;
      return {
        ...state,
        guessCm: adjustGuessByPercent(
          state.guessCm,
          action.percentDelta,
          round.minGuessCm,
          round.maxGuessCm,
        ),
      };
    }
    case "step-zoom": {
      if (state.phase !== "guessing") return state;
      return { ...state, zoom: roundZoom(state.zoom + action.direction * ZOOM_STEP) };
    }
    case "reset-zoom": {
      if (state.phase !== "guessing") return state;
      return { ...state, zoom: DEFAULT_ZOOM };
    }
    case "lock-in": {
      if (state.phase !== "guessing") return state;
      const { target } = getRoundObjects(round);
      const results = [...state.results];
      results[state.roundIndex] = evaluateGuess(state.guessCm, target.realSizeCm);
      return { ...state, phase: "locked", results };
    }
    case "begin-reveal": {
      if (state.phase !== "locked") return state;
      return { ...state, phase: "revealing" };
    }
    case "finish-reveal": {
      if (state.phase !== "revealing") return state;
      return { ...state, phase: "result" };
    }
    case "next-round": {
      if (state.phase !== "result") return state;
      if (isLastRound(state)) return { ...state, phase: "complete" };
      const roundIndex = state.roundIndex + 1;
      return {
        ...state,
        roundIndex,
        phase: "guessing",
        guessCm: state.rounds[roundIndex].initialGuessCm,
        zoom: DEFAULT_ZOOM,
      };
    }
    case "new-game": {
      return createGame(action.seed);
    }
  }
}
