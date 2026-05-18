'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  active: boolean;
  color?: string;
  bars?: number;
  height?: number;
}

export function WaveformAnimation({ active, color = '#7B6EF6', bars = 28, height = 40 }: Props) {
  // Pre-compute stable random values — avoids hydration mismatches
  const config = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => ({
        maxH: 6 + Math.floor((((i % 7) + 1) * (height * 0.7)) / 7),
        dur: 0.35 + (i % 5) * 0.07,
        del: (i % 4) * 0.06,
      })),
    [bars, height]
  );

  return (
    <div
      className="flex items-center justify-center gap-[2px]"
      style={{ height, minWidth: bars * 5 }}
      aria-hidden
    >
      {config.map((c, i) => (
        <motion.div
          key={i}
          animate={
            active
              ? { scaleY: [0.15, 1, 0.15], opacity: [0.5, 1, 0.5] }
              : { scaleY: 0.15, opacity: 0.25 }
          }
          transition={
            active
              ? { duration: c.dur, delay: c.del, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
          }
          style={{
            width: 3,
            height: c.maxH,
            borderRadius: 2,
            background: color,
            transformOrigin: 'center',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
