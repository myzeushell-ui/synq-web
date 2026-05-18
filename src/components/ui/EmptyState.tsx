'use client';

import { motion } from 'framer-motion';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ emoji, title, subtitle, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center px-8 py-14 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
      >
        {emoji}
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: '#EEECEA' }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: '#888680' }}>
          {subtitle}
        </p>
      )}
      {action && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 rounded-2xl text-xs font-semibold text-white"
          style={{ background: '#7B6EF6' }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
