'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { DemoBanner } from '../demo/DemoBanner';
import { HomeScreen } from '../demo/HomeScreen';
import { ThoughtsScreen } from '../thoughts/ThoughtsScreen';
import { EmotionsScreen } from '../emotional/EmotionsScreen';
import { RemindersScreen } from '../reminders/RemindersScreen';
import { CaptureModal } from '../thoughts/CaptureModal';
import { ChatModal } from '../chat/ChatModal';
import { VoiceModal } from '../voice/VoiceModal';
import type { ParseResult } from '@/lib/parseVoiceTranscript';
import type { Thought, Reminder, Emotion } from '@/types';
import {
  requestPermission,
  restoreNotifications,
  scheduleNotification,
  notificationsSupported,
} from '@/lib/notifications';

export type Tab = 'home' | 'thoughts' | 'emotions' | 'reminders';

const PAGE_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.55, 0, 1, 0.45] } },
};

// Light theme override tokens
const LIGHT_CSS = `
  .light-mode { --bg: #F4F2EF; --surface: #FFFFFF; --surf2: #F0EEF0; --surf3: #E4E2E8;
    --border: #D8D6DC; --text: #1A1820; --text2: #5A5660; --text3: #9A98A0; }
  .light-mode { background: #F4F2EF !important; }
  .light-mode [style*="background: #0A0A0D"], .light-mode [style*="background:#0A0A0D"] { background: #F4F2EF !important; }
  .light-mode [style*="background: #141417"], .light-mode [style*="background:#141417"] { background: #FFFFFF !important; }
  .light-mode [style*="background: #1C1C21"], .light-mode [style*="background:#1C1C21"] { background: #F0EEF0 !important; }
  .light-mode [style*="color: #EEECEA"] { color: #1A1820 !important; }
  .light-mode [style*="color: #888680"] { color: #5A5660 !important; }
  .light-mode [style*="color: #4A4850"] { color: #8A8890 !important; }
  .light-mode [style*="border-color: #2C2C32"], .light-mode [style*="border: 0.5px solid #2C2C32"] { border-color: #D8D6DC !important; }
`;

export function Shell() {
  const [tab, setTab] = useState<Tab>('home');
  const [captureOpen, setCaptureOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);

  // ── Voice-captured items ──────────────────────────────────────────────────
  const [extraThoughts, setExtraThoughts] = useState<Thought[]>([]);
  const [extraReminders, setExtraReminders] = useState<Reminder[]>([]);
  const [extraEmotions, setExtraEmotions] = useState<Emotion[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number>(0);

  // Persist dark/light preference
  useEffect(() => {
    const saved = localStorage.getItem('synq_dark_mode');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved !== null) setDarkMode(saved === 'true');
  }, []);

  // Request notification permission + restore scheduled reminders on mount
  useEffect(() => {
    if (!notificationsSupported()) return;
    // Small delay so the UI has rendered first
    const t = setTimeout(async () => {
      await requestPermission();
      restoreNotifications();
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setPullY(0);
    }, 1200);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0 || refreshing) return;
    const delta = e.touches[0].clientY - touchStart.current;
    if (delta > 0) setPullY(Math.min(delta * 0.45, 72));
  };

  const handleTouchEnd = () => {
    if (pullY >= 52) triggerRefresh();
    else setPullY(0);
  };

  const toggleTheme = () => {
    setDarkMode((v) => {
      const next = !v;
      localStorage.setItem('synq_dark_mode', String(next));
      return next;
    });
  };

  /** Called by VoiceModal when user confirms parsed items */
  const handleVoiceSave = useCallback((result: ParseResult) => {
    if (result.thoughts.length) setExtraThoughts((p) => [...result.thoughts, ...p]);
    if (result.reminders.length) {
      setExtraReminders((p) => [...result.reminders, ...p]);
      // Schedule browser notifications for every reminder with a future dueAt
      result.reminders.forEach((r) => {
        if (r.dueAt && new Date(r.dueAt).getTime() > Date.now()) {
          scheduleNotification(r.id, r.title, `Synq reminder`, r.dueAt);
        }
      });
    }
    if (result.emotions.length) setExtraEmotions((p) => [...result.emotions, ...p]);
  }, []);

  const screens: Record<Tab, React.ReactNode> = {
    home: <HomeScreen onCapture={() => setCaptureOpen(true)} onChat={() => setChatOpen(true)} />,
    thoughts: (
      <ThoughtsScreen onCapture={() => setCaptureOpen(true)} extraThoughts={extraThoughts} />
    ),
    emotions: <EmotionsScreen extraEmotions={extraEmotions} />,
    reminders: <RemindersScreen extraReminders={extraReminders} />,
  };

  return (
    <>
      {/* Light mode overrides injected once */}
      <style>{LIGHT_CSS}</style>

      <div
        className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden${darkMode ? '' : ' light-mode'}`}
        style={{ background: darkMode ? '#0A0A0D' : '#F4F2EF' }}
      >
        <DemoBanner darkMode={darkMode} onToggleTheme={toggleTheme} />

        {/* Page area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Pull-to-refresh indicator */}
          <AnimatePresence>
            {(pullY > 10 || refreshing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 right-0 flex justify-center z-20 pointer-events-none"
                style={{ paddingTop: Math.min(pullY, 48) * 0.5 + 4 }}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { rotate: (pullY / 72) * 180 }}
                  transition={
                    refreshing
                      ? { duration: 0.8, repeat: Infinity, ease: 'linear' }
                      : { duration: 0 }
                  }
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: '#1E1A3A', border: '1px solid #7B6EF644', color: '#7B6EF6' }}
                >
                  {refreshing ? '↻' : '↓'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              ref={scrollRef}
              variants={PAGE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full overflow-y-auto"
              style={{ transform: pullY > 0 ? `translateY(${pullY}px)` : undefined }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {screens[tab]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav + floating voice button */}
        <div className="relative shrink-0">
          {/* Floating mic button — lives above bottom nav, bottom-right */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setVoiceOpen(true)}
            className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
            style={{
              bottom: 'calc(100% + 10px)',
              background: 'linear-gradient(135deg, #6B5EE6 0%, #9B6EF6 100%)',
              boxShadow: '0 4px 20px rgba(123,110,246,0.45)',
            }}
            title="Voice capture"
          >
            <span className="text-lg">🎙</span>
          </motion.button>

          <BottomNav
            current={tab}
            onTab={setTab}
            onCapture={() => setCaptureOpen(true)}
            darkMode={darkMode}
          />
        </div>

        <AnimatePresence>
          {captureOpen && <CaptureModal onClose={() => setCaptureOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {voiceOpen && (
            <VoiceModal
              onClose={() => setVoiceOpen(false)}
              onSave={handleVoiceSave}
              defaultLang={process.env.NEXT_PUBLIC_DEFAULT_LANG ?? 'en-US'}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
