import type { Emotion, InsightCard } from '@/types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();

export const DEMO_EMOTIONS: Emotion[] = [
  { id: 'em-1', mood: 'anxious', intensity: 3, note: 'Nervous before the demo', loggedAt: h(2) },
  {
    id: 'em-2',
    mood: 'energized',
    intensity: 4,
    note: 'Great team meeting',
    loggedAt: h(8),
  },
  { id: 'em-3', mood: 'grateful', intensity: 5, note: 'Team came through', loggedAt: h(26) },
  { id: 'em-4', mood: 'tired', intensity: 3, note: 'Coded late into the night', loggedAt: h(32) },
  { id: 'em-5', mood: 'calm', intensity: 4, note: 'Morning walk helped a lot', loggedAt: h(48) },
  {
    id: 'em-6',
    mood: 'overwhelmed',
    intensity: 4,
    note: 'Too many tasks, too little time',
    loggedAt: h(56),
  },
  { id: 'em-7', mood: 'energized', intensity: 5, note: 'Shipped the MVP feature', loggedAt: h(72) },
];

export const MOOD_META: Record<string, { emoji: string; label: string; color: string }> = {
  calm: { emoji: '😌', label: 'Calm', color: '#5BA4F5' },
  anxious: { emoji: '😰', label: 'Anxious', color: '#E07B62' },
  energized: { emoji: '⚡', label: 'Energized', color: '#E8B84B' },
  tired: { emoji: '😴', label: 'Tired', color: '#888680' },
  grateful: { emoji: '🙏', label: 'Grateful', color: '#4ECBA0' },
  sad: { emoji: '😢', label: 'Sad', color: '#5BA4F5' },
  overwhelmed: { emoji: '🌊', label: 'Overwhelmed', color: '#E07B62' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#888680' },
};

export const DEMO_INSIGHTS: InsightCard[] = [
  {
    id: 'in-1',
    type: 'pattern',
    title: 'You often feel anxious before demos',
    body: 'Try writing down one small thing you\'re proud of before each presentation.',
    icon: '📊',
    color: 'coral',
  },
  {
    id: 'in-2',
    type: 'suggestion',
    title: '5 tasks still active',
    body: 'Want to pick one small action to do right now?',
    icon: '⚡',
    color: 'purple',
  },
  {
    id: 'in-3',
    type: 'milestone',
    title: '5 days in a row!',
    body: 'You\'ve been capturing thoughts for 5 days. Keep it up!',
    icon: '🔥',
    color: 'amber',
  },
];
