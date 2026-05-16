// ── Core types ────────────────────────────────────────────────────────────────

export type Category = 'task' | 'idea' | 'emotion' | 'note';

export type TaskState = 'active' | 'done' | 'paused' | 'overwhelmed';

export type MoodTag =
  | 'calm'
  | 'anxious'
  | 'energized'
  | 'tired'
  | 'grateful'
  | 'sad'
  | 'overwhelmed'
  | 'neutral';

export type Priority = 'low' | 'normal' | 'high';

export interface Thought {
  id: string;
  text: string;
  category: Category;
  state: TaskState;
  priority: Priority;
  createdAt: string; // ISO string
  deadline?: string; // ISO string
  reminderAt?: string; // ISO string
  tags?: string[];
}

export interface Emotion {
  id: string;
  mood: MoodTag;
  note?: string;
  intensity: number; // 1–5
  loggedAt: string; // ISO string
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueAt: string; // ISO string
  category: Category;
  done: boolean;
  repeat?: 'none' | 'daily' | 'weekly';
}

export interface DemoUser {
  name: string;
  avatar: string;
  streak: number;
  totalCaptured: number;
  doneToday: number;
}

export interface InsightCard {
  id: string;
  type: 'pattern' | 'suggestion' | 'milestone';
  title: string;
  body: string;
  icon: string;
  color: 'purple' | 'coral' | 'amber' | 'green' | 'blue';
}
