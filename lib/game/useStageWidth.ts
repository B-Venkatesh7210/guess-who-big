"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useStageWidth() {
  const elementRef = useRef<HTMLElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const measure = (next: number) => {
      setWidth((current) => (Math.abs(current - next) < 0.5 ? current : next));
    };

    measure(element.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !entry.target.isConnected) return;
      measure(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref, elementRef, width };
}
