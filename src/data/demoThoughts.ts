import type { Thought } from '@/types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();
const d = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();

export const DEMO_THOUGHTS: Thought[] = [
  {
    id: 'dt-1',
    text: 'Подготовить инвестиционную презентацию — добавить метрики роста',
    category: 'task',
    state: 'active',
    priority: 'high',
    createdAt: h(1),
    deadline: d(1),
    tags: ['инвестор', 'срочно'],
  },
  {
    id: 'dt-2',
    text: 'Тревожусь перед завтрашним демо. Нужно подышать.',
    category: 'emotion',
    state: 'active',
    priority: 'normal',
    createdAt: h(2),
  },
  {
    id: 'dt-3',
    text: 'Идея: режим "выгрузки мозга" — пользователь пишет всё подряд, а Synq сам всё раскладывает',
    category: 'idea',
    state: 'active',
    priority: 'normal',
    createdAt: h(3),
  },
  {
    id: 'dt-4',
    text: 'Позвонить Марии по поводу сессии обратной связи',
    category: 'task',
    state: 'done',
    priority: 'normal',
    createdAt: h(5),
  },
  {
    id: 'dt-5',
    text: 'Забронировать коворкинг на следующий вторник',
    category: 'task',
    state: 'active',
    priority: 'normal',
    createdAt: h(6),
    deadline: d(4),
  },
  {
    id: 'dt-6',
    text: 'ИИ-слой эмоциональной поддержки можно интегрировать с КПТ-техниками от терапевтов',
    category: 'idea',
    state: 'active',
    priority: 'high',
    createdAt: h(8),
  },
  {
    id: 'dt-7',
    text: 'Подать заявление на возмещение расходов в бухгалтерию',
    category: 'task',
    state: 'paused',
    priority: 'low',
    createdAt: h(24),
    deadline: d(7),
  },
  {
    id: 'dt-8',
    text: 'Благодарна команде сегодня. Все пришли и поддержали.',
    category: 'emotion',
    state: 'active',
    priority: 'normal',
    createdAt: h(26),
  },
  {
    id: 'dt-9',
    text: 'Пересмотреть онбординг — слишком много шагов до первой записи',
    category: 'note',
    state: 'active',
    priority: 'normal',
    createdAt: h(30),
  },
  {
    id: 'dt-10',
    text: 'Задач слишком много, не знаю за что браться',
    category: 'emotion',
    state: 'overwhelmed',
    priority: 'normal',
    createdAt: h(36),
  },
  {
    id: 'dt-11',
    text: 'Написать юнит-тесты для слоя хранения данных',
    category: 'task',
    state: 'active',
    priority: 'normal',
    createdAt: h(48),
    deadline: d(3),
  },
  {
    id: 'dt-12',
    text: 'Анализ конкурентов: как Notion работает с эмоциональным контекстом?',
    category: 'note',
    state: 'done',
    priority: 'low',
    createdAt: h(72),
  },
];

export const DEMO_USER = {
  name: 'Аня',
  avatar: '🧠',
  streak: 5,
  totalCaptured: DEMO_THOUGHTS.length,
  doneToday: DEMO_THOUGHTS.filter((t) => t.state === 'done').length,
};
