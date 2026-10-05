"use client";

import { useEffect, useState, type RefObject } from "react";

export function useStageWidth(
  ref: RefObject<HTMLElement | null>,
): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = (next: number) => {
      setWidth((current) => (Math.abs(current - next) < 0.5 ? current : next));
    };

    measure(element.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      measure(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
