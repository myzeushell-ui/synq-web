'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEMO_EMOTIONS, MOOD_META } from '@/data/emotions';
import { timeAgo } from '@/data/deadlines';
import type { MoodTag } from '@/types';

const MOODS: MoodTag[] = ['calm','anxious','energized','tired','grateful','sad','overwhelmed','neutral'];

export function EmotionsScreen() {
  const [selected, setSelected] = useState<MoodTag | null>(null);
  const [note, setNote]         = useState('');
  const [logged, setLogged]     = useState(false);

  const handleLog = () => {
    if (!selected) return;
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
    setSelected(null);
    setNote('');
  };

  const avgIntensity = (DEMO_EMOTIONS.reduce((s, e) => s + e.intensity, 0) / DEMO_EMOTIONS.length).toFixed(1);

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#EEECEA' }}>Emotions</h2>
        <p className="text-sm mt-1" style={{ color: '#888680' }}>How are you feeling right now?</p>
      </div>

      {/* Quick log */}
      <div className="rounded-2xl p-4" style={{ background: '#141417', border: '0.5px solid #2C2C32' }}>
        <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>LOG NOW</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {MOODS.map((m) => {
            const meta = MOOD_META[m];
            const sel  = selected === m;
            return (
              <motion.button
                key={m}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelected(sel ? null : m)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-center transition-all duration-150"
                style={{
                  background: sel ? `${meta.color}22` : '#1C1C21',
                  border: `${sel ? 1 : 0.5}px solid ${sel ? meta.color : '#2C2C32'}`,
                }}
              >
                <span className="text-xl">{meta.emoji}</span>
                <span className="text-[9px] font-medium" style={{ color: sel ? meta.color : '#4A4850' }}>
                  {meta.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)…"
              rows={2}
              className="w-full rounded-xl p-3 text-sm resize-none outline-none mb-3"
              style={{ background: '#0A0A0D', border: '0.5px solid #2C2C32', color: '#EEECEA' }}
            />
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLog}
          disabled={!selected}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150"
          style={{ background: selected ? '#7B6EF6' : '#242428' }}
        >
          {logged ? '✓ Logged!' : 'Log emotion'}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: '#141417', border: '0.5px solid #2C2C32' }}>
          <p className="text-2xl font-bold" style={{ color: '#7B6EF6' }}>{DEMO_EMOTIONS.length}</p>
          <p className="text-xs mt-1" style={{ color: '#888680' }}>Emotions logged</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: '#141417', border: '0.5px solid #2C2C32' }}>
          <p className="text-2xl font-bold" style={{ color: '#4ECBA0' }}>{avgIntensity}</p>
          <p className="text-xs mt-1" style={{ color: '#888680' }}>Avg intensity</p>
        </div>
      </div>

      {/* Recent log */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>RECENT</p>
        <div className="flex flex-col gap-2.5">
          {DEMO_EMOTIONS.map((e, i) => {
            const meta = MOOD_META[e.mood];
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl p-3.5"
                style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
              >
                <span className="text-xl">{meta.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="text-[10px]" style={{ color: '#4A4850' }}>{timeAgo(e.loggedAt)}</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ background: j < e.intensity ? meta.color : '#242428' }}
                      />
                    ))}
                  </div>
                  {e.note && <p className="text-xs mt-1.5" style={{ color: '#888680' }}>{e.note}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
