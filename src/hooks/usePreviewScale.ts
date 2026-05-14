'use client';

import { useEffect, useRef, useState } from 'react';

const A4_WIDTH_PX = 794;

export function usePreviewScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = (width: number) => {
      const available = width - 32; // subtract horizontal padding (p-4 = 16px each side)
      return Math.min(1, Math.max(0.3, available / A4_WIDTH_PX));
    };

    // Set initial scale synchronously before first paint
    setScale(compute(container.clientWidth));

    const observer = new ResizeObserver((entries) => {
      // Use rAF to debounce rapid-fire events and avoid layout thrash
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const width = entries[0]?.contentRect.width ?? container.clientWidth;
        setScale(compute(width));
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { containerRef, scale };
}
