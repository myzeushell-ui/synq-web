'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '@/types';
import { getCategoryMeta } from '@/data/categories';

interface Props {
  onClose: () => void;
}

const CATS: Category[] = ['task', 'idea', 'emotion', 'note'];

function guessCategory(text: string): Category {
  const l = text.toLowerCase();
  if (
    ['feel', 'anxious', 'stressed', 'happy', 'sad', 'worried', 'tired', 'grateful', 'calm'].some(
      (w) => l.includes(w)
    )
  )
    return 'emotion';
  if (['idea', 'what if', 'maybe', 'imagine', 'consider', 'possibly'].some((w) => l.includes(w)))
    return 'idea';
  if (
    ['need to', 'must', 'buy', 'call', 'email', 'book', 'pay', 'fix', 'finish', 'remind'].some(
      (w) => l.includes(w)
    )
  )
    return 'task';
  return 'note';
}

/** Detect bullet/numbered lines and return split lines if 2+ items found */
function detectSplit(text: string): string[] | null {
  const lines = text
    .split('\n')
    .map((l) =>
      l
        .replace(/^[\s]*[-•*·]\s+/, '')
        .replace(/^[\s]*\d+[.)]\s+/, '')
        .trim()
    )
    .filter(Boolean);
  if (lines.length >= 2) return lines;
  return null;
}

export function CaptureModal({ onClose }: Props) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('task');
  const [locked, setLocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [splitMode, setSplitMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const DEADLINE_CHIPS = [
    {
      label: 'Сегодня',
      value: (() => {
        const d = new Date();
        d.setHours(23, 59, 0, 0);
        return d.toISOString();
      })(),
    },
    {
      label: 'Вечером',
      value: (() => {
        const d = new Date();
        d.setHours(21, 0, 0, 0);
        return d.toISOString();
      })(),
    },
    {
      label: 'Завтра',
      value: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0, 0);
        return d.toISOString();
      })(),
    },
    {
      label: 'На неделе',
      value: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        d.setHours(9, 0, 0, 0);
        return d.toISOString();
      })(),
    },
  ];

  const splitLines = detectSplit(text);
  const isSplittable = splitLines !== null && splitLines.length >= 2;

  useEffect(() => {
    textRef.current?.focus();
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!locked && text.trim()) setCategory(guessCategory(text));
  }, [text, locked]);

  // Auto-enable split mode when bullet lines detected
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isSplittable) setSplitMode(true);
    else setSplitMode(false);
  }, [isSplittable]);

  const handleSave = () => {
    if (!text.trim()) return;
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-t-3xl p-5 pb-8"
        style={{ background: '#1C1C21', border: '0.5px solid #2C2C32' }}
        onClick={(e) => e.stopPropagation()}
      >
        {saved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: '#0A2820', border: '1.5px solid #4ECBA088' }}
            >
              ✓
            </motion.div>
            <p className="text-base font-semibold" style={{ color: '#EEECEA' }}>
              {splitMode && splitLines
                ? `${splitLines.length} thoughts captured.`
                : 'Captured. You did it.'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Handle */}
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: '#242428' }} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: getCategoryMeta(category).bg,
                  color: getCategoryMeta(category).color,
                }}
              >
                {getCategoryMeta(category).icon}
              </div>
              <span className="text-base font-semibold flex-1" style={{ color: '#EEECEA' }}>
                Новая мысль
              </span>
              <button onClick={onClose} style={{ color: '#4A4850' }}>
                ✕
              </button>
            </div>

            {/* Text area */}
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                'Что у вас на уме?\n\nПодсказка: используйте «- пункт» чтобы сразу записать несколько мыслей.'
              }
              rows={4}
              className="w-full rounded-xl p-3.5 text-sm resize-none outline-none mb-3"
              style={{
                background: '#141417',
                border: `0.5px solid ${isSplittable ? '#7B6EF666' : '#2C2C32'}`,
                color: '#EEECEA',
                lineHeight: 1.6,
              }}
            />

            {/* Split preview */}
            <AnimatePresence>
              {isSplittable && splitLines && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div
                    className="rounded-xl p-3"
                    style={{ background: '#0D1020', border: '0.5px solid #2E2B4A' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className="text-[10px] font-semibold tracking-widest"
                        style={{ color: '#7B6EF6' }}
                      >
                        SPLIT INTO {splitLines.length} THOUGHTS
                      </p>
                      <button
                        onClick={() => {
                          setSplitMode(false);
                        }}
                        className="text-[10px]"
                        style={{ color: '#4A4850' }}
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {splitLines.slice(0, 5).map((line, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5"
                            style={{ background: '#7B6EF622', color: '#7B6EF6' }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: '#EEECEA' }}>
                            {line}
                          </p>
                        </div>
                      ))}
                      {splitLines.length > 5 && (
                        <p className="text-[10px] ml-6" style={{ color: '#4A4850' }}>
                          +{splitLines.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category lock indicator */}
            {locked && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px]" style={{ color: '#4A4850' }}>
                  🔒 Locked
                </span>
                <button
                  onClick={() => setLocked(false)}
                  className="text-[10px] font-medium"
                  style={{ color: '#7B6EF6' }}
                >
                  Авто
                </button>
              </div>
            )}

            {/* Category chips */}
            <div className="flex gap-2 mb-4">
              {CATS.map((c) => {
                const meta = getCategoryMeta(c);
                const sel = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setLocked(true);
                    }}
                    className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all duration-150"
                    style={{
                      background: sel ? meta.bg : '#141417',
                      border: `${sel ? 1 : 0.5}px solid ${sel ? meta.border : '#2C2C32'}`,
                      color: sel ? meta.color : '#4A4850',
                    }}
                  >
                    <span>{meta.icon}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Deadline chips */}
            <div className="mb-5">
              <p className="text-[10px] font-medium mb-2" style={{ color: '#4A4850' }}>
                ДЕДЛАЙН
              </p>
              <div className="flex gap-2 flex-wrap">
                {DEADLINE_CHIPS.map((chip) => {
                  const sel = deadline === chip.value;
                  return (
                    <button
                      key={chip.label}
                      onClick={() => setDeadline(sel ? null : chip.value)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-150"
                      style={{
                        background: sel ? '#1E1A3A' : '#141417',
                        border: `${sel ? 1 : 0.5}px solid ${sel ? '#7B6EF6' : '#2C2C32'}`,
                        color: sel ? '#9B8EFF' : '#4A4850',
                      }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
                {deadline && (
                  <button
                    onClick={() => setDeadline(null)}
                    className="px-2 py-1.5 rounded-full text-[11px]"
                    style={{ color: '#E07B62' }}
                  >
                    ✕ clear
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <p className="text-[10px] font-medium mb-2" style={{ color: '#4A4850' }}>
                TAGS
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                    style={{
                      background: '#1C1C21',
                      border: '0.5px solid #2C2C32',
                      color: '#888680',
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                      className="text-[10px] leading-none"
                      style={{ color: '#4A4850' }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                    e.preventDefault();
                    const t = tagInput.trim().replace(/^#/, '').toLowerCase();
                    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
                    setTagInput('');
                  }
                }}
                placeholder="Add tag, press Enter…"
                className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
                style={{ background: '#242428', color: '#888680' }}
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: text.trim() ? '#7B6EF6' : '#2E2B4A' }}
              >
                {splitMode && splitLines ? `Сохранить ${splitLines.length} мысли` : 'Сохранить'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
