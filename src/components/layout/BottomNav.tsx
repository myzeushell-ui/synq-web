'use client';

import { motion } from 'framer-motion';
import type { Tab } from './Shell';

interface NavItem {
  id: Tab | 'capture';
  label: string;
  icon: string;
}

const ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'thoughts', label: 'Thoughts', icon: '✦' },
  { id: 'capture', label: 'Capture', icon: '+' },
  { id: 'emotions', label: 'Emotions', icon: '♡' },
  { id: 'reminders', label: 'Remind', icon: '◷' },
];

interface Props {
  current: Tab;
  onTab: (t: Tab) => void;
  onCapture: () => void;
  darkMode?: boolean;
}

export function BottomNav({ current, onTab, onCapture, darkMode = true }: Props) {
  return (
    <nav
      className="flex items-center justify-around py-2 px-4 shrink-0"
      style={{
        background: darkMode ? '#141417' : '#FFFFFF',
        borderTop: `0.5px solid ${darkMode ? '#2C2C32' : '#D8D6DC'}`,
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      {ITEMS.map((item) => {
        if (item.id === 'capture') {
          return (
            <button
              key="capture"
              onClick={onCapture}
              className="flex flex-col items-center gap-0.5"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-light shadow-lg"
                style={{ background: '#7B6EF6' }}
              >
                +
              </motion.div>
            </button>
          );
        }

        const isActive = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTab(item.id as Tab)}
            className="flex flex-col items-center gap-1 min-w-[44px] py-1 tap-scale"
          >
            <span
              className="text-lg leading-none transition-colors duration-150"
              style={{ color: isActive ? '#7B6EF6' : '#4A4850' }}
            >
              {item.icon}
            </span>
            <span
              className="text-[10px] leading-none font-medium transition-colors duration-150"
              style={{ color: isActive ? '#7B6EF6' : '#4A4850' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
