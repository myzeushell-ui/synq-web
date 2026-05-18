'use client';

import { motion } from 'framer-motion';
import { MOOD_META } from '@/data/emotions';
import type { Emotion } from '@/types';

interface Props {
  emotions: Emotion[];
}

const MOOD_SCORE: Record<string, number> = {
  energized: 5,
  grateful: 5,
  calm: 4,
  neutral: 3,
  tired: 2,
  anxious: 2,
  sad: 1,
  overwhelmed: 1,
};

const DAY_LABELS = ['7d', '6d', '5d', '4d', '3d', '2d', '1d'];

export function MoodChart({ emotions }: Props) {
  // Take last 7, sorted oldest→newest
  const sorted = [...emotions]
    .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
    .slice(-7);

  // Pad to 7 if fewer entries
  while (sorted.length < 7) {
    sorted.unshift({ id: '_pad', mood: 'neutral', intensity: 3, loggedAt: '' } as Emotion);
  }

  const W = 280;
  const H = 80;
  const PAD = { left: 20, right: 20, top: 10, bottom: 10 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const pts = sorted.map((e, i) => {
    const score = e.id === '_pad' ? 3 : (MOOD_SCORE[e.mood] ?? 3);
    const x = PAD.left + (i / 6) * chartW;
    const y = PAD.top + chartH - ((score - 1) / 4) * chartH;
    return { x, y, e };
  });

  // Smooth polyline path
  const pathD = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Gradient fill path
  const fillD = `${pathD} L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold tracking-widest" style={{ color: '#4A4850' }}>
          7-DAY MOOD TREND
        </p>
        <span className="text-[10px]" style={{ color: '#888680' }}>
          {MOOD_META[sorted[sorted.length - 1]?.mood]?.emoji} Latest:{' '}
          {MOOD_META[sorted[sorted.length - 1]?.mood]?.label}
        </span>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B6EF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7B6EF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[1, 2, 3, 4].map((i) => {
          const y = PAD.top + chartH - ((i - 1) / 4) * chartH;
          return (
            <line
              key={i}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="#2C2C32"
              strokeWidth="0.5"
              strokeDasharray="3 4"
            />
          );
        })}

        {/* Fill */}
        <motion.path
          d={fillD}
          fill="url(#moodFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#7B6EF6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dots */}
        {pts.map((pt, i) => {
          if (pt.e.id === '_pad') return null;
          const color = MOOD_META[pt.e.mood]?.color ?? '#7B6EF6';
          return (
            <motion.circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill={color}
              stroke="#141417"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
            />
          );
        })}
      </svg>

      {/* Day labels */}
      <div className="flex justify-between mt-1.5">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="text-[9px]" style={{ color: '#4A4850' }}>
            {d}
          </span>
        ))}
      </div>

      {/* Mood legend for last entry */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {Object.entries(MOOD_META).map(([key, meta]) => {
          const count = sorted.filter((e) => e.mood === key && e.id !== '_pad').length;
          if (!count) return null;
          return (
            <span
              key={key}
              className="text-[9px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${meta.color}18`,
                color: meta.color,
                border: `0.5px solid ${meta.color}44`,
              }}
            >
              {meta.emoji} {meta.label} ×{count}
            </span>
          );
        })}
      </div>
    </div>
  );
}
