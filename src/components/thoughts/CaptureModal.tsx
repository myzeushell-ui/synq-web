'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Category } from '@/types';
import { getCategoryMeta } from '@/data/categories';

interface Props {
  onClose: () => void;
}

const CATS: Category[] = ['task', 'idea', 'emotion', 'note'];

function guessCategory(text: string): Category {
  const l = text.toLowerCase();
  if (['feel','anxious','stressed','happy','sad','worried','tired','grateful','calm'].some((w) => l.includes(w))) return 'emotion';
  if (['idea','what if','maybe','imagine','consider','possibly'].some((w) => l.includes(w))) return 'idea';
  if (['need to','must','buy','call','email','book','pay','fix','finish','remind'].some((w) => l.includes(w))) return 'task';
  return 'note';
}

export function CaptureModal({ onClose }: Props) {
  const [text, setText]         = useState('');
  const [category, setCategory] = useState<Category>('task');
  const [locked, setLocked]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textRef.current?.focus(); }, []);
  useEffect(() => {
    if (!locked && text.trim()) setCategory(guessCategory(text));
  }, [text, locked]);

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
            <p className="text-base font-semibold" style={{ color: '#EEECEA' }}>Captured. You did it.</p>
          </motion.div>
        ) : (
          <>
            {/* Handle */}
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: '#242428' }} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{ background: getCategoryMeta(category).bg, color: getCategoryMeta(category).color }}
              >
                {getCategoryMeta(category).icon}
              </div>
              <span className="text-base font-semibold flex-1" style={{ color: '#EEECEA' }}>Capture a thought</span>
              <button onClick={onClose} style={{ color: '#4A4850' }}>✕</button>
            </div>

            {/* Text area */}
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={"What's on your mind?"}
              rows={3}
              className="w-full rounded-xl p-3.5 text-sm resize-none outline-none mb-4"
              style={{
                background: '#141417',
                border: '0.5px solid #2C2C32',
                color: '#EEECEA',
                lineHeight: 1.6,
              }}
            />

            {/* Category lock indicator */}
            {locked && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px]" style={{ color: '#4A4850' }}>🔒 Locked</span>
                <button
                  onClick={() => setLocked(false)}
                  className="text-[10px] font-medium"
                  style={{ color: '#7B6EF6' }}
                >
                  Auto-detect
                </button>
              </div>
            )}

            {/* Category chips */}
            <div className="flex gap-2 mb-5">
              {CATS.map((c) => {
                const meta = getCategoryMeta(c);
                const sel  = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setLocked(true); }}
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

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
                style={{ background: '#242428', color: '#888680' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: text.trim() ? '#7B6EF6' : '#2E2B4A' }}
              >
                Save thought
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
