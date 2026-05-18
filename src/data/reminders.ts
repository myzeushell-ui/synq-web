import type { Reminder } from '@/types';

const now = new Date();
const d = (days: number, hour = 9) => {
  const dt = new Date(now.getTime() + days * 86_400_000);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
};

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Проверка презентации для инвесторов',
    description: 'Финальная проверка перед звонком в 10:00',
    dueAt: d(1, 8),
    category: 'task',
    done: false,
    repeat: 'none',
  },
  {
    id: 'rem-2',
    title: 'Утренний чек-ин',
    description: 'Запишите, как вы себя чувствуете до начала дня',
    dueAt: d(0, 8),
    category: 'emotion',
    done: false,
    repeat: 'daily',
  },
  {
    id: 'rem-3',
    title: 'Стендап команды',
    description: 'Поделиться блокерами и победами',
    dueAt: d(1, 10),
    category: 'task',
    done: false,
    repeat: 'daily',
  },
  {
    id: 'rem-4',
    title: 'Подать заявление на возмещение',
    description: 'Дедлайн финансового отдела — не забыть',
    dueAt: d(7, 17),
    category: 'task',
    done: false,
    repeat: 'none',
  },
  {
    id: 'rem-5',
    title: 'Еженедельная рефлексия',
    description: 'Что прошло хорошо? Что забирало энергию?',
    dueAt: d(5, 19),
    category: 'emotion',
    done: false,
    repeat: 'weekly',
  },
  {
    id: 'rem-6',
    title: 'Забронировать коворкинг',
    description: 'На фокус-сессию в следующий вторник',
    dueAt: d(4, 9),
    category: 'task',
    done: true,
    repeat: 'none',
  },
];
