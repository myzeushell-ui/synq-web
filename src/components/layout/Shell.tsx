'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { useThoughts } from '@/hooks/useThoughts';
import { useEmotions } from '@/hooks/useEmotions';
import { useReminders } from '@/hooks/useReminders';
import { createClient } from '@/lib/supabase/client';

export type Tab = 'home' | 'thoughts' | 'emotions' | 'reminders';

interface ShellProps {
  userId?: string;
  userName?: string;
}

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

export function Shell({ userId, userName }: ShellProps = {}) {
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

  const router = useRouter();

  // ── Real data hooks (only active when userId is provided) ─────────────────
  const { thoughts: dbThoughts, add: addThought, update: updateThought, remove: removeThought } = useThoughts(userId);
  const { emotions: dbEmotions, add: addEmotion } = useEmotions(userId);
  const { reminders: dbReminders, add: addReminder, toggle: toggleReminder, remove: removeReminder } = useReminders(userId);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

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
  const handleVoiceSave = useCallback(
    async (result: ParseResult) => {
      // Thoughts
      if (result.thoughts.length) {
        if (userId) {
          for (const t of result.thoughts) await addThought(t);
        } else {
          setExtraThoughts((p) => [...result.thoughts, ...p]);
        }
      }
      // Reminders
      if (result.reminders.length) {
        if (userId) {
          for (const r of result.reminders) await addReminder(r);
        } else {
          setExtraReminders((p) => [...result.reminders, ...p]);
        }
        result.reminders.forEach((r) => {
          if (r.dueAt && new Date(r.dueAt).getTime() > Date.now()) {
            scheduleNotification(r.id, r.title, `Synq reminder`, r.dueAt);
          }
        });
      }
      // Emotions
      if (result.emotions.length) {
        if (userId) {
          for (const e of result.emotions) await addEmotion(e);
        } else {
          setExtraEmotions((p) => [...result.emotions, ...p]);
        }
      }
    },
    [userId, addThought, addReminder, addEmotion]
  );

  const screens: Record<Tab, React.ReactNode> = {
    home: (
      <HomeScreen
        onCapture={() => setCaptureOpen(true)}
        onChat={() => setChatOpen(true)}
        thoughts={userId ? dbThoughts : undefined}
        emotions={userId ? dbEmotions : undefined}
        userName={userName}
      />
    ),
    thoughts: (
      <ThoughtsScreen
        onCapture={() => setCaptureOpen(true)}
        extraThoughts={extraThoughts}
        initialThoughts={userId ? dbThoughts : undefined}
        onUpdateThought={userId ? updateThought : undefined}
        onDeleteThought={userId ? removeThought : undefined}
      />
    ),
    emotions: (
      <EmotionsScreen
        extraEmotions={extraEmotions}
        initialEmotions={userId ? dbEmotions : undefined}
        onLogEmotion={userId ? addEmotion : undefined}
      />
    ),
    reminders: (
      <RemindersScreen
        extraReminders={extraReminders}
        initialReminders={userId ? dbReminders : undefined}
        onToggleReminder={userId ? toggleReminder : undefined}
        onDeleteReminder={userId ? removeReminder : undefined}
        onAddReminder={userId ? addReminder : undefined}
      />
    ),
  };

  return (
    <>
      {/* Light mode overrides injected once */}
      <style>{LIGHT_CSS}</style>

      <div
        className={`flex flex-col h-screen max-w-md mx-auto relative overflow-hidden${darkMode ? '' : ' light-mode'}`}
        style={{ background: darkMode ? '#0A0A0D' : '#F4F2EF' }}
      >
        {!userId && <DemoBanner darkMode={darkMode} onToggleTheme={toggleTheme} />}
        {userId && (
          <div className="flex items-center justify-between px-4 py-2 shrink-0"
            style={{ borderBottom: `0.5px solid ${darkMode ? '#2C2C32' : '#E0DED8'}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#7B6EF6' }}>S</div>
              <span className="text-xs font-semibold" style={{ color: darkMode ? '#EEECEA' : '#1A1820' }}>
                {userName ?? 'Synq'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: darkMode ? '#1C1C21' : '#E4E2E8', color: '#7B6EF6' }}
                title={darkMode ? 'Light mode' : 'Dark mode'}>
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={handleSignOut}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: '#1C1C21', color: '#888680', border: '0.5px solid #2C2C32' }}>
                Sign out
              </button>
            </div>
          </div>
        )}

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
          {captureOpen && (
            <CaptureModal
              onClose={() => setCaptureOpen(false)}
              onSave={async (newThoughts) => {
                if (userId) {
                  for (const t of newThoughts) await addThought(t);
                } else {
                  const toAdd = newThoughts.map((t) => ({
                    ...t,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                  }));
                  setExtraThoughts((p) => [...toAdd, ...p]);
                }
              }}
            />
          )}
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
