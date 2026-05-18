'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { Thought, TaskState } from '@/types';
import { getCategoryMeta } from '@/data/categories';
import { deadlineLabel, deadlineColor, timeAgo } from '@/data/deadlines';

interface Props {
  thought: Thought;
  index: number;
  onStateChange?: (id: string, state: TaskState) => void;
  onDelete?: (id: string) => void;
}

const STATE_COLORS: Record<TaskState, string> = {
  active: '#7B6EF6',
  done: '#4ECBA0',
  paused: '#E8B84B',
  overwhelmed: '#E07B62',
};

const STATE_ACTIONS: Record<TaskState, string> = {
  active: '▶ Resume',
  done: '✓ Mark done',
  paused: '⏸ Pause',
  overwhelmed: '🌊 Too much',
};

const DELETE_THRESHOLD = -90;

export function ThoughtCard({ thought: t, index, onStateChange, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const cat = getCategoryMeta(t.category);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [0, DELETE_THRESHOLD], [0, 1]);
  const dragRef = useRef(false);

  const accentColor =
    t.state === 'overwhelmed'
      ? '#E07B62'
      : t.state === 'paused'
        ? '#E8B84B'
        : t.state === 'done'
          ? '#4A4850'
          : cat.color;

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < DELETE_THRESHOLD) {
      setDismissed(true);
      setTimeout(() => onDelete?.(t.id), 280);
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl"
        aria-hidden
      >
        <div style={{ background: '#2A1510' }} className="absolute inset-0 rounded-2xl" />
        <motion.div style={{ opacity: deleteOpacity }} className="relative flex items-center gap-2">
          <span style={{ color: '#E07B62', fontSize: 13, fontWeight: 600 }}>Delete</span>
          <span style={{ color: '#E07B62', fontSize: 18 }}>🗑</span>
        </motion.div>
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -140 }}
        dragElastic={0.08}
        style={{ x, touchAction: 'pan-y', background: '#141417', border: '0.5px solid #2C2C32' }}
        onDragStart={() => {
          dragRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.25,
          delay: index * 0.04,
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        }}
        className="relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Category accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          style={{ background: accentColor }}
        />

        <div className="pl-4 pr-3 py-3 flex items-start gap-3">
          {/* State circle */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onStateChange?.(t.id, t.state === 'done' ? 'active' : 'done')}
            className="shrink-0 w-[22px] h-[22px] rounded-full mt-0.5 flex items-center justify-center border transition-all duration-200"
            style={{
              background:
                t.state === 'done'
                  ? '#4ECBA0'
                  : t.state === 'paused'
                    ? '#261E0A'
                    : t.state === 'overwhelmed'
                      ? '#2A1510'
                      : 'transparent',
              borderColor:
                t.state === 'done'
                  ? '#4ECBA0'
                  : t.state === 'paused'
                    ? '#E8B84B'
                    : t.state === 'overwhelmed'
                      ? '#E07B62'
                      : '#4A4850',
              borderWidth: '1.5px',
            }}
          >
            {t.state === 'done' && <span className="text-[10px] text-black font-bold">✓</span>}
            {t.state === 'paused' && (
              <span className="text-[10px]" style={{ color: '#E8B84B' }}>
                ⏸
              </span>
            )}
            {t.state === 'overwhelmed' && (
              <span className="text-[10px]" style={{ color: '#E07B62' }}>
                🌊
              </span>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium leading-relaxed"
              style={{
                color: t.state === 'done' ? '#4A4850' : '#EEECEA',
                textDecoration: t.state === 'done' ? 'line-through' : 'none',
              }}
            >
              {t.text}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-medium" style={{ color: cat.color }}>
                {cat.icon} {cat.label}
              </span>
              <span className="text-[10px]" style={{ color: '#4A4850' }}>
                {timeAgo(t.createdAt)}
              </span>
              {t.priority === 'high' && (
                <span className="text-[10px] font-semibold" style={{ color: '#E07B62' }}>
                  ↑ High
                </span>
              )}
            </div>
            {t.deadline && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px]" style={{ color: deadlineColor(t.deadline) }}>
                  ◷ {deadlineLabel(t.deadline)}
                </span>
              </div>
            )}
            {t.state === 'overwhelmed' && (
              <p className="text-[11px] italic mt-1" style={{ color: '#E07B62' }}>
                Small step?
              </p>
            )}
            {t.state === 'paused' && (
              <p className="text-[11px] italic mt-1" style={{ color: '#E8B84B' }}>
                Still okay. No rush.
              </p>
            )}
            {t.tags && t.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      background: '#1C1C21',
                      color: '#4A4850',
                      border: '0.5px solid #2C2C32',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Menu button */}
          <div className="relative shrink-0">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 rounded-lg"
              style={{ color: '#4A4850' }}
            >
              ···
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-7 z-50 rounded-xl overflow-hidden shadow-xl"
                  style={{
                    background: '#1C1C21',
                    border: '0.5px solid #2C2C32',
                    minWidth: 160,
                  }}
                >
                  {(['active', 'done', 'paused', 'overwhelmed'] as TaskState[])
                    .filter((s) => s !== t.state)
                    .map((s) => (
                      <button
                        key={s}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          onStateChange?.(t.id, s);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ color: STATE_COLORS[s] }}
                      >
                        {STATE_ACTIONS[s]}
                      </button>
                    ))}
                  <div style={{ borderTop: '0.5px solid #2C2C32' }} />
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      onDelete?.(t.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium"
                    style={{ color: '#E07B62' }}
                  >
                    ✕ Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
