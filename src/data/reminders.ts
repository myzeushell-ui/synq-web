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
    title: 'Review investor presentation',
    description: 'Final review before the 10:00 call',
    dueAt: d(1, 8),
    category: 'task',
    done: false,
    repeat: 'none',
  },
  {
    id: 'rem-2',
    title: 'Morning check-in',
    description: 'Note how you feel before the day starts',
    dueAt: d(0, 8),
    category: 'emotion',
    done: false,
    repeat: 'daily',
  },
  {
    id: 'rem-3',
    title: 'Team standup',
    description: 'Share blockers and wins',
    dueAt: d(1, 10),
    category: 'task',
    done: false,
    repeat: 'daily',
  },
  {
    id: 'rem-4',
    title: 'Submit expense reimbursement',
    description: 'Finance deadline — do not forget',
    dueAt: d(7, 17),
    category: 'task',
    done: false,
    repeat: 'none',
  },
  {
    id: 'rem-5',
    title: 'Weekly reflection',
    description: 'What went well? What drained your energy?',
    dueAt: d(5, 19),
    category: 'emotion',
    done: false,
    repeat: 'weekly',
  },
  {
    id: 'rem-6',
    title: 'Book coworking space',
    description: 'Focus session next Tuesday',
    dueAt: d(4, 9),
    category: 'task',
    done: true,
    repeat: 'none',
  },
];
