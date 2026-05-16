'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEMO_REMINDERS } from '@/data/reminders';
import { getCategoryMeta } from '@/data/categories';
import { deadlineLabel, deadlineColor, fmtDate, fmtTime } from '@/data/deadlines';
import type { Reminder } from '@/types';

export function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS);

  const toggle = (id: string) =>
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, done: !r.done } : r));

  const upcoming = reminders.filter((r) => !r.done);
  const done     = reminders.filter((r) => r.done);

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#EEECEA' }}>Reminders</h2>
        <p className="text-sm mt-1" style={{ color: '#888680' }}>
          {upcoming.length} upcoming · {done.length} done
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>UPCOMING</p>
          <div className="flex flex-col gap-2.5">
            {upcoming.map((r, i) => (
              <ReminderCard key={r.id} reminder={r} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4ECBA0' }}>DONE</p>
          <div className="flex flex-col gap-2.5">
            {done.map((r, i) => (
              <ReminderCard key={r.id} reminder={r} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReminderCard({ reminder: r, index, onToggle }: { reminder: Reminder; index: number; onToggle: (id: string) => void }) {
  const cat   = getCategoryMeta(r.category);
  const color = r.done ? '#4A4850' : deadlineColor(r.dueAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden relative"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: r.done ? '#4A4850' : cat.color }} />

      <div className="pl-4 pr-4 py-3.5 flex items-start gap-3">
        <button
          onClick={() => onToggle(r.id)}
          className="shrink-0 w-[22px] h-[22px] rounded-full mt-0.5 flex items-center justify-center border transition-all"
          style={{
            background:  r.done ? '#4ECBA0' : 'transparent',
            borderColor: r.done ? '#4ECBA0' : '#4A4850',
            borderWidth: '1.5px',
          }}
        >
          {r.done && <span className="text-[10px] text-black font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium"
            style={{
              color: r.done ? '#4A4850' : '#EEECEA',
              textDecoration: r.done ? 'line-through' : 'none',
            }}
          >
            {r.title}
          </p>
          {r.description && (
            <p className="text-xs mt-0.5" style={{ color: '#888680' }}>{r.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-medium" style={{ color }}>
              ◷ {fmtDate(r.dueAt)} {fmtTime(r.dueAt)}
            </span>
            {!r.done && (
              <span className="text-[10px]" style={{ color }}>· {deadlineLabel(r.dueAt)}</span>
            )}
            {r.repeat !== 'none' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                background: '#1E1A3A', color: '#7B6EF6', border: '0.5px solid #2E2B4A'
              }}>
                ↻ {r.repeat}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
