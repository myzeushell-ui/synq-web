# Synq — Supabase Setup Guide

## Step 1: Create a Supabase project (FREE)

1. Go to https://supabase.com → "Start your project"
2. Create a new project (free tier is enough)
3. Wait ~2 minutes for it to boot up

## Step 2: Run the database schema

1. Open your project → **SQL Editor** → **New query**
2. Copy-paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run** (green button)

This creates: `thoughts`, `emotions`, `reminders`, `profiles` tables with Row Level Security.

## Step 3: Get your API keys

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Add keys to .env.local

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Add keys to Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

Then redeploy: `vercel --prod`

## Step 6: Configure Supabase Auth (for email sign-up)

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://synq-web.vercel.app`
3. Add to **Redirect URLs**: `https://synq-web.vercel.app/auth/callback`

## How it works

- `/` → Landing page (demo mode, no login required)
- `/auth/login` → Sign in
- `/auth/signup` → Create account
- `/app` → Real app (requires login, all data saved to Supabase)

Data flow:
- **Logged in**: thoughts/emotions/reminders → Supabase DB (persistent, syncs across devices)
- **Demo mode**: demo data only (nothing saved)
