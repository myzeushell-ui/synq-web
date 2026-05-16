'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { DemoBanner } from '../demo/DemoBanner';
import { HomeScreen } from '../demo/HomeScreen';
import { ThoughtsScreen } from '../thoughts/ThoughtsScreen';
import { EmotionsScreen } from '../emotional/EmotionsScreen';
import { RemindersScreen } from '../reminders/RemindersScreen';
import { CaptureModal } from '../thoughts/CaptureModal';

export type Tab = 'home' | 'thoughts' | 'emotions' | 'reminders';

const PAGE_VARIANTS: Variants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:     { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.55, 0, 1, 0.45] } },
};

export function Shell() {
  const [tab, setTab]             = useState<Tab>('home');
  const [captureOpen, setCaptureOpen] = useState(false);

  const screens: Record<Tab, React.ReactNode> = {
    home:      <HomeScreen      onCapture={() => setCaptureOpen(true)} />,
    thoughts:  <ThoughtsScreen  onCapture={() => setCaptureOpen(true)} />,
    emotions:  <EmotionsScreen />,
    reminders: <RemindersScreen />,
  };

  return (
    <div
      className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden"
      style={{ background: '#0A0A0D' }}
    >
      <DemoBanner />

      {/* Page area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full overflow-y-auto"
          >
            {screens[tab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav current={tab} onTab={setTab} onCapture={() => setCaptureOpen(true)} />

      <AnimatePresence>
        {captureOpen && (
          <CaptureModal onClose={() => setCaptureOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
