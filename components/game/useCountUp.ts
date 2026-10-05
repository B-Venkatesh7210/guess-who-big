"use client";

import { useEffect, useState } from "react";
import { SCORE_COUNT_MS } from "@/lib/game/gameEngine";

export function useCountUp(
  target: number | null,
  reducedMotion: boolean,
  duration = SCORE_COUNT_MS,
): number | null {
  const [value, setValue] = useState<number | null>(null);
  const [tracked, setTracked] = useState({
    target,
    reducedMotion,
  });

  const targetChanged =
    tracked.target !== target || tracked.reducedMotion !== reducedMotion;
  const synced = targetChanged
    ? target == null
      ? null
      : reducedMotion
        ? target
        : 0
    : value;

  if (targetChanged) {
    setTracked({ target, reducedMotion });
    setValue(synced);
  }

  useEffect(() => {
    if (target == null || reducedMotion) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reducedMotion, target]);

  return synced;
}
