import type { Thought } from '@/types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();
const d = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();

export const DEMO_THOUGHTS: Thought[] = [
  {
    id: 'dt-1',
    text: 'Prepare investor pitch deck — add traction metrics',
    category: 'task',
    state: 'active',
    priority: 'high',
    createdAt: h(1),
    deadline: d(1),
    tags: ['investor', 'urgent'],
  },
  {
    id: 'dt-2',
    text: 'Feeling anxious about the demo tomorrow. Need to breathe.',
    category: 'emotion',
    state: 'active',
    priority: 'normal',
    createdAt: h(2),
  },
  {
    id: 'dt-3',
    text: 'Idea: add a "brain dump" mode where users can type freely and Synq auto-organises everything',
    category: 'idea',
    state: 'active',
    priority: 'normal',
    createdAt: h(3),
  },
  {
    id: 'dt-4',
    text: 'Call Maria about the product feedback session',
    category: 'task',
    state: 'done',
    priority: 'normal',
    createdAt: h(5),
  },
  {
    id: 'dt-5',
    text: 'Book the co-working space for next Tuesday',
    category: 'task',
    state: 'active',
    priority: 'normal',
    createdAt: h(6),
    deadline: d(4),
  },
  {
    id: 'dt-6',
    text: 'The AI emotional support layer could integrate with therapist-approved CBT prompts',
    category: 'idea',
    state: 'active',
    priority: 'high',
    createdAt: h(8),
  },
  {
    id: 'dt-7',
    text: 'Submit reimbursement form to accounting',
    category: 'task',
    state: 'paused',
    priority: 'low',
    createdAt: h(24),
    deadline: d(7),
  },
  {
    id: 'dt-8',
    text: 'Grateful for the team today. Everyone showed up.',
    category: 'emotion',
    state: 'active',
    priority: 'normal',
    createdAt: h(26),
  },
  {
    id: 'dt-9',
    text: 'Review onboarding flow — too many steps before capture',
    category: 'note',
    state: 'active',
    priority: 'normal',
    createdAt: h(30),
  },
  {
    id: 'dt-10',
    text: 'This task load feels like too much right now',
    category: 'emotion',
    state: 'overwhelmed',
    priority: 'normal',
    createdAt: h(36),
  },
  {
    id: 'dt-11',
    text: 'Write unit tests for the persistence layer',
    category: 'task',
    state: 'active',
    priority: 'normal',
    createdAt: h(48),
    deadline: d(3),
  },
  {
    id: 'dt-12',
    text: 'Competitor analysis: how does Notion handle emotional context?',
    category: 'note',
    state: 'done',
    priority: 'low',
    createdAt: h(72),
  },
];

export const DEMO_USER = {
  name: 'Alex',
  avatar: '🧠',
  streak: 5,
  totalCaptured: DEMO_THOUGHTS.length,
  doneToday: DEMO_THOUGHTS.filter((t) => t.state === 'done').length,
};
