'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_REMINDERS } from '@/data/reminders';
import { DEMO_THOUGHTS } from '@/data/demoThoughts';
import { getCategoryMeta } from '@/data/categories';
import { deadlineLabel, deadlineColor, fmtDate, fmtTime } from '@/data/deadlines';
import { EmptyState } from '../ui/EmptyState';
import type { Reminder, Category } from '@/types';
import {
  scheduleNotification,
  requestPermission,
  permissionLabel,
  getPermission,
} from '@/lib/notifications';

const REPEAT_OPTS = ['none', 'daily', 'weekly', 'monthly'] as const;
const CAT_OPTS: Category[] = ['task', 'idea', 'emotion', 'note'];

const DOW = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function CalendarView({ reminders }: { reminders: Reminder[] }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const uiLocale = process.env.NEXT_PUBLIC_DEFAULT_LANG === 'ru-RU' ? 'ru-RU' : 'en-US';
  const monthLabel = viewDate.toLocaleDateString(uiLocale, { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const today = new Date();

  const dotsByDay: Record<number, string[]> = {};
  reminders.forEach((r) => {
    const d = new Date(r.dueAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!dotsByDay[day]) dotsByDay[day] = [];
      dotsByDay[day].push(r.done ? '#4ECBA0' : '#7B6EF6');
    }
  });

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
          style={{ color: '#888680', background: '#1C1C21' }}
        >
          ‹
        </button>
        <p className="text-sm font-semibold" style={{ color: '#EEECEA' }}>
          {monthLabel}
        </p>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
          style={{ color: '#888680', background: '#1C1C21' }}
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-2">
        {DOW.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold"
            style={{ color: '#4A4850' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const isToday =
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const dots = dotsByDay[day] ?? [];
          return (
            <div key={day} className="flex flex-col items-center gap-0.5 py-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  background: isToday ? '#7B6EF6' : 'transparent',
                  color: isToday ? '#fff' : dots.length ? '#EEECEA' : '#888680',
                  fontWeight: dots.length ? 600 : 400,
                }}
              >
                {day}
              </div>
              {dots.length > 0 && (
                <div className="flex gap-0.5">
                  {dots.slice(0, 3).map((c, j) => (
                    <div key={j} className="w-1 h-1 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RemindersProps {
  extraReminders?: Reminder[];
}

export function RemindersScreen({ extraReminders }: RemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS);

  // Merge voice-captured reminders (prepend new ones)
  useEffect(() => {
    if (!extraReminders || extraReminders.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const fresh = extraReminders.filter((r) => !existingIds.has(r.id));
      return fresh.length ? [...fresh, ...prev] : prev;
    });
  }, [extraReminders]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState<Category>('task');
  const [formRepeat, setFormRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [formDueAt, setFormDueAt] = useState('');
  const [linkedThought, setLinkedThought] = useState('');
  const [saved, setSaved] = useState(false);

  // Default datetime to tomorrow 09:00
  const defaultDue = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  })();

  const toggle = (id: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  const handleAdd = () => {
    if (!formTitle.trim()) return;
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: formTitle.trim(),
      description: linkedThought
        ? `Linked: ${DEMO_THOUGHTS.find((t) => t.id === linkedThought)?.text.slice(0, 60) ?? ''}`
        : undefined,
      dueAt: formDueAt
        ? new Date(formDueAt).toISOString()
        : new Date(Date.now() + 86400000).toISOString(),
      category: formCat,
      done: false,
      repeat: formRepeat,
    };
    setReminders((prev) => [newReminder, ...prev]);
    // Schedule browser notification
    if (new Date(newReminder.dueAt).getTime() > Date.now()) {
      requestPermission().then(() => {
        scheduleNotification(newReminder.id, newReminder.title, 'Synq reminder', newReminder.dueAt);
      });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
      setFormTitle('');
      setFormCat('task');
      setFormRepeat('none');
      setFormDueAt('');
      setLinkedThought('');
    }, 1000);
  };

  const upcoming = reminders.filter((r) => !r.done);
  const done = reminders.filter((r) => r.done);

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#EEECEA' }}>
            Напоминания
          </h2>
          <p className="text-sm mt-1" style={{ color: '#888680' }}>
            {upcoming.length} предстоит · {done.length} готово
          </p>
          <button
            onClick={() => requestPermission()}
            className="flex items-center gap-1 mt-1 text-[10px] font-medium"
            style={{ color: getPermission() === 'granted' ? '#4ECBA0' : '#E8B84B' }}
          >
            <span>{getPermission() === 'granted' ? '🔔' : '🔕'}</span>
            <span>{permissionLabel()}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: '0.5px solid #2C2C32' }}
          >
            {(['list', 'calendar'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className="px-2.5 py-1.5 text-[10px] font-semibold transition-all"
                style={{
                  background: viewMode === v ? '#7B6EF622' : '#141417',
                  color: viewMode === v ? '#7B6EF6' : '#4A4850',
                }}
              >
                {v === 'list' ? '☰' : '▦'}
              </button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowForm((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light"
            style={{
              background: showForm ? '#1E1A3A' : '#141417',
              border: `1px solid ${showForm ? '#7B6EF6' : '#2C2C32'}`,
              color: showForm ? '#9B8EFF' : '#888680',
            }}
          >
            {showForm ? '✕' : '+'}
          </motion.button>
        </div>
      </div>

      {/* Add reminder form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-4"
              style={{ background: '#141417', border: '0.5px solid #7B6EF6' }}
            >
              <p
                className="text-[10px] font-semibold tracking-widest mb-3"
                style={{ color: '#7B6EF6' }}
              >
                НОВОЕ НАПОМИНАНИЕ
              </p>

              {saved ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✓</span>
                  <span className="text-sm font-semibold" style={{ color: '#4ECBA0' }}>
                    Напоминание добавлено!
                  </span>
                </motion.div>
              ) : (
                <>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Что нужно не забыть?"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none mb-3"
                    style={{
                      background: '#0A0A0D',
                      border: '0.5px solid #2C2C32',
                      color: '#EEECEA',
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  />

                  <div className="flex gap-2 mb-3">
                    {CAT_OPTS.map((c) => {
                      const meta = getCategoryMeta(c);
                      const sel = formCat === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setFormCat(c)}
                          className="flex-1 py-1.5 rounded-xl text-[10px] font-medium text-center transition-all"
                          style={{
                            background: sel ? meta.bg : '#0A0A0D',
                            border: `${sel ? 1 : 0.5}px solid ${sel ? meta.border : '#2C2C32'}`,
                            color: sel ? meta.color : '#4A4850',
                          }}
                        >
                          {meta.icon} {meta.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Date & time picker */}
                  <div className="mb-3">
                    <p className="text-[10px] font-medium mb-1.5" style={{ color: '#4A4850' }}>
                      ДАТА И ВРЕМЯ
                    </p>
                    <input
                      type="datetime-local"
                      value={formDueAt || defaultDue}
                      onChange={(e) => setFormDueAt(e.target.value)}
                      className="w-full rounded-xl px-3 py-2.5 text-xs outline-none"
                      style={{
                        background: '#0A0A0D',
                        border: '0.5px solid #2C2C32',
                        color: '#EEECEA',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>

                  <div className="flex gap-2 mb-3">
                    {REPEAT_OPTS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setFormRepeat(r)}
                        className="flex-1 py-1.5 rounded-xl text-[10px] font-medium capitalize transition-all"
                        style={{
                          background: formRepeat === r ? '#1E1A3A' : '#0A0A0D',
                          border: `${formRepeat === r ? 1 : 0.5}px solid ${formRepeat === r ? '#7B6EF6' : '#2C2C32'}`,
                          color: formRepeat === r ? '#9B8EFF' : '#4A4850',
                        }}
                      >
                        {r === 'none'
                          ? 'Один раз'
                          : r === 'daily'
                            ? 'Ежедневно'
                            : r === 'weekly'
                              ? 'Еженедельно'
                              : 'Ежемесячно'}
                      </button>
                    ))}
                  </div>

                  {/* Link to thought */}
                  <div className="mb-4">
                    <p className="text-[10px] font-medium mb-1.5" style={{ color: '#4A4850' }}>
                      СВЯЗАТЬ С МЫСЛЬЮ (необязательно)
                    </p>
                    <select
                      value={linkedThought}
                      onChange={(e) => setLinkedThought(e.target.value)}
                      className="w-full rounded-xl px-3 py-2.5 text-xs outline-none"
                      style={{
                        background: '#0A0A0D',
                        border: `0.5px solid ${linkedThought ? '#7B6EF6' : '#2C2C32'}`,
                        color: linkedThought ? '#9B8EFF' : '#4A4850',
                        colorScheme: 'dark',
                      }}
                    >
                      <option value="">— Нет —</option>
                      {DEMO_THOUGHTS.filter((t) => t.state !== 'done').map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.text.slice(0, 55)}
                          {t.text.length > 55 ? '…' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={!formTitle.trim()}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: formTitle.trim() ? '#7B6EF6' : '#242428' }}
                  >
                    Добавить напоминание
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar view */}
      {viewMode === 'calendar' && <CalendarView reminders={reminders} />}

      {/* Upcoming */}
      {viewMode === 'list' && upcoming.length > 0 ? (
        <div>
          <p
            className="text-[10px] font-semibold tracking-widest mb-3"
            style={{ color: '#4A4850' }}
          >
            ПРЕДСТОЯЩИЕ
          </p>
          <div className="flex flex-col gap-2.5">
            {upcoming.map((r, i) => (
              <ReminderCard key={r.id} reminder={r} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      ) : viewMode === 'list' && !showForm ? (
        <EmptyState
          emoji="◷"
          title="Напоминаний нет"
          subtitle="Добавьте напоминание, чтобы ничего не упустить."
          action={{ label: '+ Добавить напоминание', onClick: () => setShowForm(true) }}
        />
      ) : null}

      {/* Done */}
      {viewMode === 'list' && done.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold tracking-widest mb-3"
            style={{ color: '#4ECBA0' }}
          >
            ВЫПОЛНЕНО
          </p>
          <div className="flex flex-col gap-2.5">
            {done.map((r, i) => (
              <ReminderCard key={r.id} reminder={r} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReminderCard({
  reminder: r,
  index,
  onToggle,
}: {
  reminder: Reminder;
  index: number;
  onToggle: (id: string) => void;
}) {
  const cat = getCategoryMeta(r.category);
  const color = r.done ? '#4A4850' : deadlineColor(r.dueAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden relative"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: r.done ? '#4A4850' : cat.color }}
      />

      <div className="pl-4 pr-4 py-3.5 flex items-start gap-3">
        <button
          onClick={() => onToggle(r.id)}
          className="shrink-0 w-[22px] h-[22px] rounded-full mt-0.5 flex items-center justify-center border transition-all"
          style={{
            background: r.done ? '#4ECBA0' : 'transparent',
            borderColor: r.done ? '#4ECBA0' : '#4A4850',
            borderWidth: '1.5px',
          }}
        >
          {r.done && <span className="text-[10px] text-black font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium"
            style={{
              color: r.done ? '#4A4850' : '#EEECEA',
              textDecoration: r.done ? 'line-through' : 'none',
            }}
          >
            {r.title}
          </p>
          {r.description && (
            <p className="text-xs mt-0.5" style={{ color: '#888680' }}>
              {r.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-medium" style={{ color }}>
              ◷ {fmtDate(r.dueAt)} {fmtTime(r.dueAt)}
            </span>
            {!r.done && (
              <span className="text-[10px]" style={{ color }}>
                · {deadlineLabel(r.dueAt)}
              </span>
            )}
            {r.repeat !== 'none' && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: '#1E1A3A',
                  color: '#7B6EF6',
                  border: '0.5px solid #2E2B4A',
                }}
              >
                ↻ {r.repeat}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
