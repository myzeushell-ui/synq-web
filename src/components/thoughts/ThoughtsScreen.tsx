'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_THOUGHTS } from '@/data/demoThoughts';
import { getCategoryMeta } from '@/data/categories';
import { ThoughtCard } from './ThoughtCard';
import { ThoughtCardSkeleton } from './ThoughtCardSkeleton';
import { EmptyState } from '../ui/EmptyState';
import type { Category, TaskState, Thought } from '@/types';

interface Props {
  onCapture: () => void;
  extraThoughts?: import('@/types').Thought[];
  initialThoughts?: import('@/types').Thought[];
  onUpdateThought?: (id: string, patch: Partial<Thought>) => void;
  onDeleteThought?: (id: string) => void;
}

const STATES: { id: TaskState | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '#7B6EF6' },
  { id: 'active', label: 'Active', color: '#7B6EF6' },
  { id: 'paused', label: 'Paused', color: '#E8B84B' },
  { id: 'overwhelmed', label: 'Heavy', color: '#E07B62' },
  { id: 'done', label: 'Done', color: '#4ECBA0' },
];

export function ThoughtsScreen({ onCapture, extraThoughts, initialThoughts, onUpdateThought, onDeleteThought }: Props) {
  const [stateFilter, setStateFilter] = useState<TaskState | 'all'>('all');
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>(initialThoughts ?? DEMO_THOUGHTS);
  const [loading, setLoading] = useState(true);
  const [undoItem, setUndoItem] = useState<{ thought: Thought; idx: number } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Merge voice-captured thoughts (prepend new ones, skip duplicates by id)
  useEffect(() => {
    if (!extraThoughts || extraThoughts.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThoughts((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const fresh = extraThoughts.filter((t) => !existingIds.has(t.id));
      return fresh.length ? [...fresh, ...prev] : prev;
    });
  }, [extraThoughts]);

  const filtered = thoughts.filter((t) => {
    if (stateFilter !== 'all' && t.state !== stateFilter) return false;
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (query && !t.text.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // Sync when initialThoughts change (e.g. after DB refetch)
  useEffect(() => {
    if (initialThoughts) setThoughts(initialThoughts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThoughts]);

  const handleStateChange = (id: string, state: TaskState) => {
    setThoughts((prev) => prev.map((t) => (t.id === id ? { ...t, state } : t)));
    onUpdateThought?.(id, { state });
  };

  const handleDelete = (id: string) => {
    const idx = thoughts.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const removed = thoughts[idx];
    setThoughts((prev) => prev.filter((t) => t.id !== id));
    onDeleteThought?.(id);

    // Clear previous undo timer
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoItem({ thought: removed, idx });

    undoTimer.current = setTimeout(() => setUndoItem(null), 4000);
  };

  const handleUndo = () => {
    if (!undoItem) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setThoughts((prev) => {
      const next = [...prev];
      next.splice(undoItem.idx, 0, undoItem.thought);
      return next;
    });
    setUndoItem(null);
  };

  const sections: { state: TaskState; label: string; color: string }[] = [
    { state: 'active', label: 'ACTIVE', color: '#7B6EF6' },
    { state: 'paused', label: 'PAUSED', color: '#E8B84B' },
    { state: 'overwhelmed', label: 'HEAVY', color: '#E07B62' },
    { state: 'done', label: 'DONE', color: '#4ECBA0' },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight flex-1" style={{ color: '#EEECEA' }}>
          Thoughts
        </h2>
        <button
          onClick={onCapture}
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: '#1E1A3A', color: '#7B6EF6', border: '1px solid #2E2B4A' }}
        >
          + Capture
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search thoughts…"
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }}
        />
      </div>

      {/* State filter */}
      <div className="flex gap-2 px-5 overflow-x-auto pb-1 mb-2 scrollbar-none">
        {STATES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStateFilter(s.id)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
            style={{
              background: stateFilter === s.id ? `${s.color}22` : '#141417',
              border: `0.5px solid ${stateFilter === s.id ? s.color : '#2C2C32'}`,
              color: stateFilter === s.id ? s.color : '#4A4850',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        <button
          onClick={() => setCatFilter('all')}
          className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
          style={{
            background: catFilter === 'all' ? '#1E1A3A' : '#141417',
            border: `0.5px solid ${catFilter === 'all' ? '#2E2B4A' : '#2C2C32'}`,
            color: catFilter === 'all' ? '#7B6EF6' : '#4A4850',
          }}
        >
          All
        </button>
        {(['task', 'idea', 'emotion', 'note'] as Category[]).map((c) => {
          const meta = getCategoryMeta(c);
          return (
            <button
              key={c}
              onClick={() => setCatFilter(catFilter === c ? 'all' : c)}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
              style={{
                background: catFilter === c ? `${meta.color}22` : '#141417',
                border: `0.5px solid ${catFilter === c ? meta.color : '#2C2C32'}`,
                color: catFilter === c ? meta.color : '#4A4850',
              }}
            >
              {meta.icon} {meta.label}
            </button>
          );
        })}
      </div>

      {/* Skeleton loading */}
      {loading ? (
        <div className="px-5 flex flex-col gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ThoughtCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        thoughts.length === 0 ? (
          <EmptyState
            emoji="✦"
            title="No thoughts yet"
            subtitle="Capture what's on your mind — tasks, ideas, feelings. No judgment."
            action={{ label: '+ Capture a thought', onClick: onCapture }}
          />
        ) : (
          <EmptyState
            emoji="🔍"
            title="Nothing found"
            subtitle="Try changing your filters or search query."
          />
        )
      ) : stateFilter !== 'all' ? (
        <div className="px-5 flex flex-col gap-2.5">
          {filtered.map((t, i) => (
            <ThoughtCard
              key={t.id}
              thought={t}
              index={i}
              onStateChange={handleStateChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-4">
          {sections.map(({ state, label, color }) => {
            const items = filtered.filter((t) => t.state === state);
            if (!items.length) return null;
            return (
              <div key={state}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] font-semibold tracking-widest" style={{ color }}>
                    {label}
                  </span>
                  <span className="text-[10px]" style={{ color: `${color}88` }}>
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {items.map((t, i) => (
                    <ThoughtCard
                      key={t.id}
                      thought={t}
                      index={i}
                      onStateChange={handleStateChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Undo snackbar */}
      <AnimatePresence>
        {undoItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
            style={{
              transform: 'translateX(-50%)',
              background: '#1C1C21',
              border: '0.5px solid #2C2C32',
              maxWidth: 320,
              width: 'calc(100% - 40px)',
            }}
          >
            <span className="text-xs flex-1" style={{ color: '#888680' }}>
              Thought deleted
            </span>
            <button
              onClick={handleUndo}
              className="text-xs font-semibold"
              style={{ color: '#7B6EF6' }}
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
