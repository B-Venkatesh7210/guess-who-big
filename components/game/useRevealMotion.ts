"use client";

import { useEffect, useState } from "react";
import type { GamePhase } from "@/types/game";

export function useRevealMotion(phase: GamePhase, reducedMotion: boolean) {
  const [armedPhase, setArmedPhase] = useState<GamePhase>(phase);

  if (phase !== "revealing" && armedPhase === "revealing") {
    setArmedPhase(phase);
  }

  useEffect(() => {
    if (phase !== "revealing" || reducedMotion) return;
    const frame = requestAnimationFrame(() => setArmedPhase("revealing"));
    return () => cancelAnimationFrame(frame);
  }, [phase, reducedMotion]);

  const showCorrectSize =
    phase === "result" || (phase === "revealing" && (reducedMotion || armedPhase === "revealing"));
  const animateSize = phase === "revealing" && !reducedMotion;

  return { showCorrectSize, animateSize };
}
