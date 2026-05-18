'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { WaveformAnimation } from './WaveformAnimation';
import { parseVoiceTranscript, type ParseResult } from '@/lib/parseVoiceTranscript';
import type { Thought, Reminder, Emotion } from '@/types';
import { MOOD_META } from '@/data/emotions';
import { getCategoryMeta } from '@/data/categories';
import { fmtDate, fmtTime } from '@/data/deadlines';

// ─── Web Speech API types ─────────────────────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

interface Props {
  onClose: () => void;
  onSave: (result: ParseResult) => void;
  defaultLang?: string;
}

type Phase = 'idle' | 'recording' | 'processing' | 'results' | 'saved';

const LANG_OPTIONS = [
  { value: 'ru-RU', label: '🇷🇺 Русский' },
  { value: 'en-US', label: '🇺🇸 English' },
];

// ─── AI parse via API (with local fallback) ───────────────────────────────────
async function aiParse(text: string, lang: string): Promise<ParseResult> {
  try {
    const res = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    });
    const data = await res.json();

    // Server said no API key — use local parser
    if (data.fallback) return parseVoiceTranscript(text);

    // Map server response → ParseResult shape
    const now = new Date().toISOString();
    const thoughts: Thought[] = (data.thoughts ?? []).map(
      (t: { title?: string; category?: string; priority?: string; tags?: string[] }) => ({
        id: crypto.randomUUID(),
        text: t.title ?? '',
        category: t.category ?? 'task',
        priority: t.priority ?? 'normal',
        tags: t.tags ?? [],
        done: false,
        createdAt: now,
      })
    );

    const reminders: Reminder[] = (data.reminders ?? [])
      .filter((r: { dueAt?: string }) => r.dueAt)
      .map((r: { title?: string; dueAt?: string; rawTime?: string }) => ({
        id: crypto.randomUUID(),
        title: r.title ?? '',
        dueAt: r.dueAt ?? now,
        done: false,
        category: 'personal',
        createdAt: now,
      }));

    const emotions: Emotion[] = (data.emotions ?? []).map(
      (e: { mood?: string; intensity?: number; note?: string }) => ({
        id: crypto.randomUUID(),
        mood: e.mood ?? 'neutral',
        intensity: Math.min(5, Math.max(1, e.intensity ?? 3)),
        note: e.note ?? '',
        loggedAt: now,
      })
    );

    return { thoughts, reminders, emotions };
  } catch {
    // Network error → local parser
    return parseVoiceTranscript(text);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VoiceModal({ onClose, onSave, defaultLang }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [lang, setLang] = useState<string>(
    defaultLang ??
      (typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_DEFAULT_LANG ?? 'en-US') : 'en-US')
  );
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<boolean | null>(null); // null=checking
  const recogRef = useRef<ISpeechRecognition | null>(null);
  const supported =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Check if AI mode is available
  useEffect(() => {
    fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ping', lang: 'en-US' }),
    })
      .then((r) => r.json())
      .then((d) => setAiMode(!d.fallback))
      .catch(() => setAiMode(false));
  }, []);

  useEffect(() => {
    return () => {
      recogRef.current?.stop();
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition!;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;

    let finalText = '';

    r.onresult = (e) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + ' ';
        else interimText += t;
      }
      setTranscript(finalText);
      setInterim(interimText);
    };

    r.onerror = (e) => {
      const msg = (e as unknown as { error?: string }).error ?? 'microphone error';
      if (msg !== 'aborted') setError(`Microphone error: ${msg}`);
    };

    r.onend = () => {
      setInterim('');
      setPhase((p) => (p === 'recording' ? 'processing' : p));
    };

    recogRef.current = r;
    setTranscript('');
    setInterim('');
    setError(null);
    setPhase('recording');
    r.start();
  }, [lang, supported]);

  const stopRecording = useCallback(() => {
    recogRef.current?.stop();
  }, []);

  // When phase → processing, call AI parser
  useEffect(() => {
    if (phase !== 'processing') return;
    const full = (transcript + ' ' + interim).trim();
    if (!full || full.length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Nothing was captured. Try speaking again.');

      setPhase('idle');
      return;
    }
    aiParse(full, lang).then((parsed) => {
      setResult(parsed);
      setPhase('results');
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!result) return;
    onSave(result);
    setPhase('saved');
    setTimeout(onClose, 1800);
  };

  const totalItems = result
    ? result.thoughts.length + result.reminders.length + result.emotions.length
    : 0;

  const isRu = lang === 'ru-RU';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={phase === 'idle' ? onClose : undefined}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full rounded-t-3xl overflow-hidden"
        style={{ background: '#141417', border: '0.5px solid #2C2C32', maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '88vh' }}>
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-9 h-1 rounded-full" style={{ background: '#2C2C32' }} />
          </div>

          {/* ── Saved ─────────────────────────────────────────────── */}
          {phase === 'saved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-12 px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: '#0A2820', border: '1.5px solid #4ECBA088' }}
              >
                ✓
              </motion.div>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: '#EEECEA' }}>
                  {isRu ? 'Сохранено!' : 'Saved!'}
                </p>
                <p className="text-sm mt-1" style={{ color: '#888680' }}>
                  {totalItems}{' '}
                  {isRu
                    ? totalItems === 1
                      ? 'элемент записан'
                      : 'элемента записано'
                    : totalItems === 1
                      ? 'item saved'
                      : 'items saved'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Idle ──────────────────────────────────────────────── */}
          {phase === 'idle' && (
            <div className="px-6 pb-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#EEECEA' }}>
                  {isRu ? 'Голосовая запись' : 'Voice Capture'}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#888680' }}>
                  {isRu
                    ? 'Скажите всё, что на уме — задачи, чувства, напоминания — и ИИ сам всё разберёт.'
                    : 'Say whatever is on your mind — tasks, feelings, reminders — and AI will sort it all out.'}
                </p>
              </div>

              {/* AI mode badge */}
              {aiMode !== null && (
                <div
                  className="flex items-center justify-center gap-1.5 text-[10px] font-semibold mb-4 py-1.5 px-3 rounded-full mx-auto w-fit"
                  style={{
                    background: aiMode ? '#0A2820' : '#1C1C21',
                    border: `1px solid ${aiMode ? '#4ECBA044' : '#2C2C32'}`,
                    color: aiMode ? '#4ECBA0' : '#4A4850',
                  }}
                >
                  <span>{aiMode ? '✦' : '◌'}</span>
                  <span>
                    {aiMode
                      ? isRu
                        ? 'Gemini AI активен'
                        : 'Gemini AI active'
                      : isRu
                        ? 'Локальный парсер'
                        : 'Local parser'}
                  </span>
                </div>
              )}

              {/* Language selector — hidden on EN-only builds */}
              {process.env.NEXT_PUBLIC_DEFAULT_LANG === 'ru-RU' && (
                <div className="flex gap-2 mb-6">
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setLang(opt.value)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: lang === opt.value ? '#1E1A3A' : '#1C1C21',
                        border: `1px solid ${lang === opt.value ? '#7B6EF6' : '#2C2C32'}`,
                        color: lang === opt.value ? '#9B8EFF' : '#4A4850',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Example hint */}
              <div
                className="rounded-2xl p-4 mb-6 text-xs leading-relaxed"
                style={{ background: '#1C1C21', border: '0.5px solid #2C2C32', color: '#888680' }}
              >
                <p className="font-semibold mb-1" style={{ color: '#EEECEA' }}>
                  {isRu ? 'Попробуйте сказать:' : 'Try saying:'}
                </p>
                {isRu ? (
                  <p>
                    &ldquo;Блин, сейчас плохо себя чувствую. Нужно сходить за хлебом, позвонить маме
                    и составить отчёт. Позвонить маме сегодня в 5 часов.&rdquo;
                  </p>
                ) : (
                  <p>
                    &ldquo;I&apos;m feeling a bit anxious right now. Need to buy groceries, call
                    Mom, and finish the report. Call Mom today at 5pm.&rdquo;
                  </p>
                )}
              </div>

              {!supported && (
                <div
                  className="rounded-xl p-3 mb-4 text-xs text-center"
                  style={{ background: '#2A1510', border: '0.5px solid #3A2018', color: '#E07B62' }}
                >
                  {isRu
                    ? 'Распознавание речи не поддерживается. Используйте Chrome или Edge.'
                    : 'Speech recognition not supported. Use Chrome or Edge.'}
                </div>
              )}

              {error && (
                <div
                  className="rounded-xl p-3 mb-4 text-xs text-center"
                  style={{ background: '#2A1510', border: '0.5px solid #3A2018', color: '#E07B62' }}
                >
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                  style={{ background: '#1C1C21', color: '#888680', border: '0.5px solid #2C2C32' }}
                >
                  {isRu ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  onClick={startRecording}
                  disabled={!supported}
                  className="flex-[2] py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: supported ? '#7B6EF6' : '#242428' }}
                >
                  <span className="text-base">🎙</span>
                  {isRu ? 'Начать говорить' : 'Start speaking'}
                </button>
              </div>
            </div>
          )}

          {/* ── Recording ─────────────────────────────────────────── */}
          {phase === 'recording' && (
            <div className="px-6 pb-8">
              <div className="text-center mb-4">
                <h3 className="text-base font-bold" style={{ color: '#EEECEA' }}>
                  {isRu ? 'Слушаю…' : 'Listening…'}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#888680' }}>
                  {isRu
                    ? 'Говорите свободно, ИИ запишет всё'
                    : 'Speak freely, AI will capture everything'}
                </p>
              </div>

              <div
                className="rounded-2xl flex items-center justify-center py-5 mb-4"
                style={{ background: '#1C1C21', border: '0.5px solid #2E2B4A' }}
              >
                <WaveformAnimation active={true} color="#7B6EF6" bars={32} height={44} />
              </div>

              <div
                className="rounded-xl p-3 mb-4 min-h-[64px] max-h-[120px] overflow-y-auto"
                style={{ background: '#0A0A0D', border: '0.5px solid #2C2C32' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: '#EEECEA' }}>
                  {transcript}
                  <span style={{ color: '#4A4850' }}>{interim}</span>
                  {!transcript && !interim && (
                    <span style={{ color: '#2C2C32' }}>
                      {isRu ? 'Ваши слова появятся здесь…' : 'Your words will appear here…'}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#E07B62' }}
                />
                <span className="text-xs font-medium" style={{ color: '#E07B62' }}>
                  {isRu ? 'Запись' : 'Recording'}
                </span>
              </div>

              <button
                onClick={stopRecording}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: '#2A1510', border: '1px solid #3A2018', color: '#E07B62' }}
              >
                <span>■</span> {isRu ? 'Стоп — отправить в ИИ' : 'Stop — send to AI'}
              </button>
            </div>
          )}

          {/* ── Processing ────────────────────────────────────────── */}
          {phase === 'processing' && (
            <div className="px-6 py-12 flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full border-2"
                style={{ borderColor: '#7B6EF6', borderTopColor: 'transparent' }}
              />
              <p className="text-sm font-medium" style={{ color: '#888680' }}>
                {aiMode
                  ? isRu
                    ? 'Gemini анализирует…'
                    : 'Gemini is analyzing…'
                  : isRu
                    ? 'Анализирую…'
                    : 'Analyzing…'}
              </p>
              {aiMode && (
                <p className="text-xs" style={{ color: '#4A4850' }}>
                  {isRu ? 'ИИ понимает контекст и намерения' : 'AI understands context and intent'}
                </p>
              )}
            </div>
          )}

          {/* ── Results ───────────────────────────────────────────── */}
          {phase === 'results' && result && (
            <div className="px-6 pb-8">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold" style={{ color: '#EEECEA' }}>
                    {isRu ? 'Вот что я нашёл' : "Here's what I found"}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: '#888680' }}>
                    {totalItems === 0
                      ? isRu
                        ? 'Попробуйте переформулировать'
                        : 'Try rephrasing'
                      : `${totalItems} ${isRu ? 'элемент(а) готово к сохранению' : 'item(s) ready to save'}`}
                  </p>
                </div>
                {aiMode && (
                  <span
                    className="text-[9px] font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: '#0A2820',
                      color: '#4ECBA0',
                      border: '1px solid #4ECBA033',
                    }}
                  >
                    Gemini AI
                  </span>
                )}
              </div>

              {/* Transcript snippet */}
              <div
                className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
                style={{ background: '#0A0A0D', border: '0.5px solid #2C2C32', color: '#4A4850' }}
              >
                <span style={{ color: '#888680' }}>
                  {'"'}
                  {transcript.trim().slice(0, 140)}
                  {transcript.length > 140 ? '…' : ''}
                  {'"'}
                </span>
              </div>

              {/* Emotions */}
              {result.emotions.length > 0 && (
                <ResultSection
                  icon="♡"
                  label={isRu ? 'Эмоции' : 'Emotions'}
                  color="#E07B62"
                  count={result.emotions.length}
                >
                  {result.emotions.map((e) => (
                    <EmotionResultCard key={e.id} emotion={e} />
                  ))}
                </ResultSection>
              )}

              {/* Reminders */}
              {result.reminders.length > 0 && (
                <ResultSection
                  icon="◷"
                  label={isRu ? 'Напоминания' : 'Reminders'}
                  color="#E8B84B"
                  count={result.reminders.length}
                >
                  {result.reminders.map((r) => (
                    <ReminderResultCard key={r.id} reminder={r} />
                  ))}
                </ResultSection>
              )}

              {/* Thoughts */}
              {result.thoughts.length > 0 && (
                <ResultSection
                  icon="✦"
                  label={isRu ? 'Задачи и мысли' : 'Tasks & Thoughts'}
                  color="#7B6EF6"
                  count={result.thoughts.length}
                >
                  {result.thoughts.map((t) => (
                    <ThoughtResultCard key={t.id} thought={t} />
                  ))}
                </ResultSection>
              )}

              {totalItems === 0 && (
                <div className="py-8 text-center">
                  <p className="text-2xl mb-2">🤔</p>
                  <p className="text-sm" style={{ color: '#4A4850' }}>
                    {isRu
                      ? 'Упомяните задачи, чувства или конкретное время.'
                      : 'Mention tasks, feelings, or a specific time.'}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setPhase('idle');
                    setTranscript('');
                    setResult(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                  style={{ background: '#1C1C21', color: '#888680', border: '0.5px solid #2C2C32' }}
                >
                  {isRu ? 'Повторить' : 'Retry'}
                </button>
                {totalItems > 0 && (
                  <button
                    onClick={handleSave}
                    className="flex-[2] py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                    style={{ background: '#7B6EF6' }}
                  >
                    {isRu ? `Сохранить всё (${totalItems})` : `Save all (${totalItems})`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResultSection({
  icon,
  label,
  color,
  count,
  children,
}: {
  icon: string;
  label: string;
  color: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm" style={{ color }}>
          {icon}
        </span>
        <span className="text-[10px] font-semibold tracking-widest" style={{ color }}>
          {label.toUpperCase()}
        </span>
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}22`, color }}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function EmotionResultCard({ emotion: e }: { emotion: Emotion }) {
  const meta = MOOD_META[e.mood];
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      style={{ background: '#1C1C21', border: '0.5px solid #2C2C32' }}
    >
      <span className="text-xl">{meta.emoji}</span>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: meta.color }}>
          {meta.label}
        </p>
        {e.note && (
          <p className="text-xs mt-0.5" style={{ color: '#888680' }}>
            {e.note}
          </p>
        )}
        <div className="flex gap-0.5 mt-1.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              className="h-1 flex-1 rounded-full"
              style={{ background: j < e.intensity ? meta.color : '#242428' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReminderResultCard({ reminder: r }: { reminder: Reminder }) {
  const cat = getCategoryMeta(r.category);
  const due = new Date(r.dueAt);
  const today = new Date();
  const isToday = due.toDateString() === today.toDateString();
  const isTomorrow = due.toDateString() === new Date(today.getTime() + 86400000).toDateString();
  const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : fmtDate(r.dueAt);
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      style={{ background: '#1C1C21', border: '0.5px solid #2C2C32' }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: cat.bg, color: cat.color }}
      >
        {cat.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: '#EEECEA' }}>
          {r.title}
        </p>
        <p className="text-xs mt-0.5 font-medium" style={{ color: '#E8B84B' }}>
          ◷ {dayLabel} at {fmtTime(r.dueAt)}
        </p>
      </div>
    </div>
  );
}

function ThoughtResultCard({ thought: t }: { thought: Thought }) {
  const cat = getCategoryMeta(t.category);
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      style={{ background: '#1C1C21', border: '0.5px solid #2C2C32' }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: cat.bg, color: cat.color }}
      >
        {cat.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: '#EEECEA' }}>
          {t.text}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: cat.color }}>
          {cat.label}
          {t.priority === 'high' ? ' · ↑ High' : ''}
        </p>
      </div>
    </div>
  );
}
