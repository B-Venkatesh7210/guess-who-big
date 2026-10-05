"use client";

import { useEffect, useRef, useState } from "react";
import { SCORE_COUNT_MS } from "@/lib/game/gameEngine";

/** Animates from the last shown value to `target`. Null clears it. */
export function useCountUp(
  target: number | null,
  reducedMotion: boolean,
  duration = SCORE_COUNT_MS,
): number | null {
  const [value, setValue] = useState<number | null>(target);
  const shownRef = useRef<number | null>(target);

  useEffect(() => {
    if (target == null || reducedMotion) {
      const frame = requestAnimationFrame(() => {
        shownRef.current = target;
        setValue(target);
      });
      return () => cancelAnimationFrame(frame);
    }

    const from = shownRef.current ?? 0;
    if (from === target) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(from + (target - from) * eased);
      shownRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reducedMotion, target]);

  if (target == null) return null;
  if (reducedMotion) return target;
  return value ?? 0;
}
