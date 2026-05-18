import type { Emotion, InsightCard } from '@/types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();

export const DEMO_EMOTIONS: Emotion[] = [
  { id: 'em-1', mood: 'anxious', intensity: 3, note: 'Волновалась перед демо', loggedAt: h(2) },
  {
    id: 'em-2',
    mood: 'energized',
    intensity: 4,
    note: 'Отличная встреча с командой',
    loggedAt: h(8),
  },
  { id: 'em-3', mood: 'grateful', intensity: 5, note: 'Команда поддержала', loggedAt: h(26) },
  { id: 'em-4', mood: 'tired', intensity: 3, note: 'Поздно кодила вечером', loggedAt: h(32) },
  { id: 'em-5', mood: 'calm', intensity: 4, note: 'Помогла утренняя прогулка', loggedAt: h(48) },
  {
    id: 'em-6',
    mood: 'overwhelmed',
    intensity: 4,
    note: 'Слишком много задач, мало времени',
    loggedAt: h(56),
  },
  { id: 'em-7', mood: 'energized', intensity: 5, note: 'Выпустила MVP-фичу', loggedAt: h(72) },
];

export const MOOD_META: Record<string, { emoji: string; label: string; color: string }> = {
  calm: { emoji: '😌', label: 'Спокойно', color: '#5BA4F5' },
  anxious: { emoji: '😰', label: 'Тревожно', color: '#E07B62' },
  energized: { emoji: '⚡', label: 'Энергия', color: '#E8B84B' },
  tired: { emoji: '😴', label: 'Устала', color: '#888680' },
  grateful: { emoji: '🙏', label: 'Благодарна', color: '#4ECBA0' },
  sad: { emoji: '😢', label: 'Грустно', color: '#5BA4F5' },
  overwhelmed: { emoji: '🌊', label: 'Много', color: '#E07B62' },
  neutral: { emoji: '😐', label: 'Нейтрально', color: '#888680' },
};

export const DEMO_INSIGHTS: InsightCard[] = [
  {
    id: 'in-1',
    type: 'pattern',
    title: 'Вы часто тревожитесь перед демо',
    body: 'Попробуйте записать одну маленькую вещь, которой вы гордитесь, перед каждым выступлением.',
    icon: '📊',
    color: 'coral',
  },
  {
    id: 'in-2',
    type: 'suggestion',
    title: '5 задач ещё активны',
    body: 'Хотите выбрать одно маленькое действие прямо сейчас?',
    icon: '⚡',
    color: 'purple',
  },
  {
    id: 'in-3',
    type: 'milestone',
    title: '5 дней подряд!',
    body: 'Вы фиксируете мысли уже 5 дней. Так держать!',
    icon: '🔥',
    color: 'amber',
  },
];
