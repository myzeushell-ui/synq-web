'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  active:      '#7B6EF6',
  done:        '#4ECBA0',
  paused:      '#E8B84B',
  overwhelmed: '#E07B62',
};

const STATE_ACTIONS: Record<TaskState, string> = {
  active:      '▶ Resume',
  done:        '✓ Mark done',
  paused:      '⏸ Pause',
  overwhelmed: '🌊 Too much',
};

export function ThoughtCard({ thought: t, index, onStateChange, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = getCategoryMeta(t.category);

  const accentColor =
    t.state === 'overwhelmed' ? '#E07B62' :
    t.state === 'paused'      ? '#E8B84B' :
    t.state === 'done'        ? '#4A4850' :
    cat.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      {/* Category accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: accentColor }}
      />

      <div className="pl-4 pr-3 py-3 flex items-start gap-3">
        {/* State circle */}
        <button
          onClick={() => onStateChange?.(t.id, t.state === 'done' ? 'active' : 'done')}
          className="shrink-0 w-[22px] h-[22px] rounded-full mt-0.5 flex items-center justify-center border transition-all duration-200"
          style={{
            background:   t.state === 'done' ? '#4ECBA0' : t.state === 'paused' ? '#261E0A' : t.state === 'overwhelmed' ? '#2A1510' : 'transparent',
            borderColor:  t.state === 'done' ? '#4ECBA0' : t.state === 'paused' ? '#E8B84B' : t.state === 'overwhelmed' ? '#E07B62' : '#4A4850',
            borderWidth:  '1.5px',
          }}
        >
          {t.state === 'done' && <span className="text-[10px] text-black font-bold">✓</span>}
          {t.state === 'paused' && <span className="text-[10px]" style={{ color: '#E8B84B' }}>⏸</span>}
          {t.state === 'overwhelmed' && <span className="text-[10px]" style={{ color: '#E07B62' }}>🌊</span>}
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
              <span className="text-[10px] font-semibold" style={{ color: '#E07B62' }}>↑ High</span>
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
            <p className="text-[11px] italic mt-1" style={{ color: '#E07B62' }}>Small step?</p>
          )}
          {t.state === 'paused' && (
            <p className="text-[11px] italic mt-1" style={{ color: '#E8B84B' }}>Still okay. No rush.</p>
          )}
        </div>

        {/* Menu button */}
        <div className="relative shrink-0">
          <button
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
                      onClick={() => { onStateChange?.(t.id, s); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium hover:opacity-80 transition-opacity"
                      style={{ color: STATE_COLORS[s] }}
                    >
                      {STATE_ACTIONS[s]}
                    </button>
                  ))}
                <div style={{ borderTop: '0.5px solid #2C2C32' }} />
                <button
                  onClick={() => { onDelete?.(t.id); setMenuOpen(false); }}
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
  );
}
