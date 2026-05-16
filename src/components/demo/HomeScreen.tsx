'use client';

import { motion } from 'framer-motion';
import { DEMO_THOUGHTS, DEMO_USER } from '@/data/demoThoughts';
import { DEMO_INSIGHTS } from '@/data/emotions';
import { greeting } from '@/lib/utils';
import { ThoughtCard } from '../thoughts/ThoughtCard';
import { InsightCard } from '../emotional/InsightCard';

interface Props {
  onCapture: () => void;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function HomeScreen({ onCapture }: Props) {
  const active = DEMO_THOUGHTS.filter((t) => t.state === 'active');
  const done   = DEMO_THOUGHTS.filter((t) => t.state === 'done').length;
  const total  = DEMO_THOUGHTS.length;
  const pct    = Math.round((done / total) * 100);

  return (
    <motion.div
      className="flex flex-col gap-5 px-5 pt-6 pb-24"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-xs font-medium" style={{ color: '#4A4850' }}>{greeting()}</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1" style={{ color: '#EEECEA' }}>
          Synq
        </h1>
        <p className="text-sm mt-1" style={{ color: '#888680' }}>
          {DEMO_USER.avatar} &nbsp;{DEMO_USER.name} · {DEMO_USER.streak} day streak 🔥
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4"
        style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs" style={{ color: '#888680' }}>{done} of {total} captured things done</span>
          {pct === 100 && <span className="text-xs" style={{ color: '#4ECBA0' }}>🎉 All done!</span>}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#242428' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: pct === 100 ? '#4ECBA0' : '#7B6EF6' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Capture button */}
      <motion.div variants={item}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onCapture}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold text-sm"
          style={{ background: '#7B6EF6' }}
        >
          <span className="text-base">⚡</span> Capture a thought
        </motion.button>
      </motion.div>

      {/* Overwhelmed button */}
      <motion.div variants={item}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{
            background: '#2A1510',
            border: '1px solid #3A2020',
            color: '#E07B62',
          }}
        >
          <span>🌊</span> I feel overwhelmed
        </motion.button>
      </motion.div>

      {/* Insights */}
      <motion.div variants={item}>
        <p className="text-[10px] font-semibold tracking-widest mb-3" style={{ color: '#4A4850' }}>
          INSIGHTS
        </p>
        <div className="flex flex-col gap-3">
          {DEMO_INSIGHTS.map((ins) => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </motion.div>

      {/* Focus section */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold tracking-widest" style={{ color: '#4A4850' }}>
            FOCUS
          </p>
          <span className="text-[10px]" style={{ color: '#4A4850' }}>{active.length} active</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {active.slice(0, 4).map((t, i) => (
            <ThoughtCard key={t.id} thought={t} index={i} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
