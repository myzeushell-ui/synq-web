import { motion } from 'framer-motion';
import type { InsightCard as InsightCardType } from '@/types';

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  purple: { bg: '#1E1A3A', border: '#2E2B4A', text: '#7B6EF6' },
  coral:  { bg: '#2A1510', border: '#3A2020', text: '#E07B62' },
  amber:  { bg: '#261E0A', border: '#3A2E10', text: '#E8B84B' },
  green:  { bg: '#0A2820', border: '#1A4030', text: '#4ECBA0' },
  blue:   { bg: '#0A1828', border: '#102040', text: '#5BA4F5' },
};

export function InsightCard({ insight }: { insight: InsightCardType }) {
  const c = COLOR_MAP[insight.color] ?? COLOR_MAP.purple;
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl p-4 flex gap-3 items-start"
      style={{ background: c.bg, border: `0.5px solid ${c.border}` }}
    >
      <span className="text-xl shrink-0">{insight.icon}</span>
      <div>
        <p className="text-sm font-semibold mb-0.5" style={{ color: c.text }}>{insight.title}</p>
        <p className="text-xs leading-relaxed" style={{ color: '#888680' }}>{insight.body}</p>
      </div>
    </motion.div>
  );
}
