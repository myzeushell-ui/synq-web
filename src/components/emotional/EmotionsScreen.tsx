'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_EMOTIONS, MOOD_META } from '@/data/emotions';
import { timeAgo } from '@/data/deadlines';
import { MoodChart } from './MoodChart';
import { BreathingModal } from './BreathingModal';
import type { Emotion, MoodTag } from '@/types';

const MOODS: MoodTag[] = [
  'calm',
  'anxious',
  'energized',
  'tired',
  'grateful',
  'sad',
  'overwhelmed',
  'neutral',
];

interface Props {
  extraEmotions?: Emotion[];
  initialEmotions?: Emotion[];
  onLogEmotion?: (e: Omit<Emotion, 'id' | 'loggedAt'>) => void;
}

export function EmotionsScreen({ extraEmotions, initialEmotions, onLogEmotion }: Props) {
  const [selected, setSelected] = useState<MoodTag | null>(null);
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>(initialEmotions ?? DEMO_EMOTIONS);

  // Sync when initialEmotions change
  useEffect(() => {
    if (initialEmotions) setEmotions(initialEmotions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmotions]);

  // Merge voice-captured emotions
  useEffect(() => {
    if (!extraEmotions || extraEmotions.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmotions((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const fresh = extraEmotions.filter((e) => !existingIds.has(e.id));
      return fresh.length ? [...fresh, ...prev] : prev;
    });
  }, [extraEmotions]);

  const handleLog = () => {
    if (!selected) return;
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
    onLogEmotion?.({ mood: selected, note: note || undefined, intensity: 3 });
    setSelected(null);
    setNote('');
  };

  const avgIntensity = emotions.length
    ? (emotions.reduce((s, e) => s + e.intensity, 0) / emotions.length).toFixed(1)
    : '0.0';

  const handleExportCSV = () => {
    const header = 'id,mood,intensity,note,loggedAt';
    const rows = emotions.map((e) =>
      [e.id, e.mood, e.intensity, `"${(e.note ?? '').replace(/"/g, '""')}"`, e.loggedAt].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synq-emotions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5 pt-6 pb-24">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#EEECEA' }}>
              Emotions
            </h2>
            <p className="text-sm mt-1" style={{ color: '#888680' }}>
              How are you feeling?
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setBreathOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold"
            style={{ background: '#0A1828', border: '1px solid #102040', color: '#5BA4F5' }}
          >
            <span>🌬</span> Breathe
          </motion.button>
        </div>

        {/* Quick log */}
        <div
          className="rounded-2xl p-4"
          style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
        >
          <p
            className="text-[10px] font-semibold tracking-widest mb-3"
            style={{ color: '#4A4850' }}
          >
            LOG
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {MOODS.map((m) => {
              const meta = MOOD_META[m];
              const sel = selected === m;
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
                  <span
                    className="text-[9px] font-medium"
                    style={{ color: sel ? meta.color : '#4A4850' }}
                  >
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
                placeholder="Note (optional)…"
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

        {/* Mood trend chart */}
        <MoodChart emotions={emotions} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4"
            style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#7B6EF6' }}>
              {emotions.length}
            </p>
            <p className="text-xs mt-1" style={{ color: '#888680' }}>
              Emotions logged
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#4ECBA0' }}>
              {avgIntensity}
            </p>
            <p className="text-xs mt-1" style={{ color: '#888680' }}>
              Avg. intensity
            </p>
          </div>
        </div>

        {/* Export */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleExportCSV}
          className="w-full py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#888680' }}
        >
          <span>↓</span> Export emotions to CSV
        </motion.button>

        {/* Recent log */}
        <div>
          <p
            className="text-[10px] font-semibold tracking-widest mb-3"
            style={{ color: '#4A4850' }}
          >
            RECENT
          </p>
          <div className="flex flex-col gap-2.5">
            {emotions.map((e, i) => {
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
                      <span className="text-sm font-medium" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="text-[10px]" style={{ color: '#4A4850' }}>
                        {timeAgo(e.loggedAt)}
                      </span>
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
                    {e.note && (
                      <p className="text-xs mt-1.5" style={{ color: '#888680' }}>
                        {e.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {breathOpen && <BreathingModal onClose={() => setBreathOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
