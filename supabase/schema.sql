-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS thoughts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'task',
  state TEXT NOT NULL DEFAULT 'active',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deadline TIMESTAMPTZ,
  reminder_at TIMESTAMPTZ,
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS emotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  intensity INTEGER NOT NULL DEFAULT 3 CHECK (intensity BETWEEN 1 AND 5),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL DEFAULT 'task',
  done BOOLEAN DEFAULT FALSE,
  repeat TEXT DEFAULT 'none'
);

ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "thoughts_own" ON thoughts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "emotions_own" ON emotions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reminders_own" ON reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
