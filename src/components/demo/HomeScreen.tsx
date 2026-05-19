'use client';

import { motion, type Variants } from 'framer-motion';
import { DEMO_THOUGHTS, DEMO_USER } from '@/data/demoThoughts';
import { DEMO_INSIGHTS } from '@/data/emotions';
import { greeting } from '@/lib/utils';
import { ThoughtCard } from '../thoughts/ThoughtCard';
import { InsightCard } from '../emotional/InsightCard';
import type { Thought, Emotion } from '@/types';

interface Props {
  onCapture: () => void;
  onChat: () => void;
  thoughts?: Thought[];
  emotions?: Emotion[];
  userName?: string;
}

const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function calcStreak(emotions: Emotion[]): number {
  if (!emotions.length) return 0;
  const days = new Set(emotions.map((e) => new Date(e.loggedAt).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

export function HomeScreen({ onCapture, onChat, thoughts, emotions, userName }: Props) {
  const isReal = thoughts !== undefined;

  const activeThoughts = isReal
    ? thoughts!.filter((t) => t.state === 'active')
    : DEMO_THOUGHTS.filter((t) => t.state === 'active');

  const doneCount = isReal
    ? thoughts!.filter((t) => t.state === 'done').length
    : DEMO_THOUGHTS.filter((t) => t.state === 'done').length;

  const totalCount = isReal ? thoughts!.length : DEMO_THOUGHTS.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const streak = isReal && emotions ? calcStreak(emotions) : DEMO_USER.streak;
  const displayName = isReal ? (userName ?? 'You') : DEMO_USER.name;
  const avatar = isReal ? '\u{1F9E0}' : DEMO_USER.avatar;

  return (
    <motion.div
      className="flex flex-col gap-5 px-5 pt-6 pb-24"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-xs font-medium" style={{ color: '#4A4850' }}>
          {greeting()}
        </p>
        <h1 className="text-3xl font-bold tracking-tight mt-1" style={{ color: '#EEECEA' }}>
          Synq
        </h1>
        <p className="text-sm mt-1" style={{ color: '#888680' }}>
          {avatar} &nbsp;{displayName}
          {streak > 0 && ` · ${streak}-day streak 🔥`}
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div variants={item} className="rounded-2xl p-4" style={{ background: '#141417', border: '0.5px solid #2C2C32' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs" style={{ color: '#888680' }}>
            {totalCount === 0 ? 'No thoughts yet — capture your first one!' : `${doneCount} of ${totalCount} done`}
          </span>
          {pct === 100 && totalCount > 0 && (
            <span className="text-xs" style={{ color: '#4ECBA0' }}>🎉 All done!</span>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#242428' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: pct === 100 ? '#4ECBA0' : '#7B6EF6' }}
            initial={{ width: 0 }}
            animate={{ width: totalCount === 0 ? '0%' : `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Capture button */}
      <motion.div variants={item}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onCapture}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold text-sm"
          style={{ background: '#7B6EF6' }}>
          <span className="text-base">⚡</span> Capture a thought
        </motion.button>
      </motion.div>

      {/* Overwhelmed */}
      <motion.div variants={item}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onChat}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ background: '#2A1510', border: '1px solid #3A2020', color: '#E07B62' }}>
          <span>🌊</span> I&apos;m overwhelmed
        </motion.button>
      </motion.div>

      {/* Talk to Synq */}
      <motion.div variants={item}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onChat}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #1A1730 0%, #1C1C28 100%)', border: '1px solid #3A3560', color: '#9B8EFF' }}>
          <span>🧠</span> Talk to Synq
        </motion.button>
      </motion.div>

      {/* Demo insights */}
      {!isReal && (
        <motion.div variants={item}>
          <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>INSIGHTS</p>
          <div className="flex flex-col gap-3">
            {DEMO_INSIGHTS.map((ins) => (<InsightCard key={ins.id} insight={ins} />))}
          </div>
        </motion.div>
      )}

      {/* Real mood summary */}
      {isReal && emotions && emotions.length > 0 && (
        <motion.div variants={item}>
          <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>RECENT MOOD</p>
          <div className="flex gap-2 flex-wrap">
            {emotions.slice(0, 5).map((e) => (
              <div key={e.id} className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#1C1C21', border: '0.5px solid #2C2C32', color: '#888680' }}>
                {e.mood} · {e.intensity}/5
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Focus */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold tracking-widest" style={{ color: '#4A4850' }}>FOCUS</p>
          <span className="text-[10px]" style={{ color: '#4A4850' }}>{activeThoughts.length} active</span>
        </div>
        {activeThoughts.length === 0 ? (
          <div className="rounded-2xl p-4 text-center" style={{ background: '#141417', border: '0.5px solid #2C2C32' }}>
            <p className="text-sm" style={{ color: '#4A4850' }}>No active thoughts.</p>
            <p className="text-xs mt-1" style={{ color: '#4A4850' }}>Tap ⚡ to capture something.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activeThoughts.slice(0, 4).map((t, i) => (<ThoughtCard key={t.id} thought={t} index={i} />))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}