# Synq — Project Context

## What is Synq?

Synq is an **emotional-safe thought capture app** for people with ADHD, anxiety, RSD (Rejection Sensitive Dysphoria), or simply busy minds who need a judgment-free place to dump their thoughts, emotions, tasks, and ideas.

The core promise: **capture first, organise later**. Users type freely — Synq quietly sorts everything into categories and helps them take the next small step.

---

## The Problem

Most productivity apps create anxiety rather than reducing it. Todo lists feel accusatory. Calendar reminders add pressure. Note apps require organisation you don't have the energy for.

People with ADHD or anxiety don't need another system to fail. They need:
- A safe place to drop thoughts before they vanish
- Gentle reminders that don't pile guilt
- Emotional context alongside tasks
- The smallest possible next step when overwhelmed

---

## MVP Scope (Investor Demo)

The current demo covers:

| Feature              | Status  |
|----------------------|---------|
| Quick thought capture | ✅ Done |
| Auto-category detection (task / idea / emotion / note) | ✅ Done |
| Task states (active / done / paused / overwhelmed) | ✅ Done |
| Deadline setting (presets + custom) | ✅ Done |
| Calm deadline copy ("Still okay. Want to try now?") | ✅ Done |
| Local persistence (SharedPreferences on mobile) | ✅ Done |
| Emotion logging with intensity | ✅ Done (demo) |
| Reminder scheduling | ✅ Done (demo) |
| Insight cards | ✅ Done (demo) |
| AI emotional intelligence layer | 🔜 Phase 8 |
| Backend / auth | 🔜 Future |
| Multi-device sync | 🔜 Future |

---

## Target Users

1. **Primary**: Adults with ADHD or anxiety, 18–35, tech-comfortable
2. **Secondary**: Founders / builders who need a low-friction capture tool
3. **Tertiary**: Anyone who has ever opened a notes app and immediately felt overwhelmed

---

## Design Principles

- **Calm dark UI** — no bright whites or harsh contrasts
- **No empty shame** — empty states are encouraging, not accusatory
- **One action at a time** — never show more than what's needed
- **Safe language** — copy is gentle: "Still okay.", "No rush.", "One tiny action is enough."
- **Emotional context** — feelings are first-class citizens alongside tasks

---

## Architecture (Demo)

```
Next.js App Router (web demo)
  └── All data: local mock files in src/data/
  └── No backend, no auth, no database
  └── State: React useState (session-only in web demo)

Flutter App (mobile, Android)
  └── SharedPreferences for local persistence
  └── Single-file Dart architecture (lib/main.dart)
  └── Same design system (dark palette, categories, states)
```

---

## Key Metrics to Show Investors

- Time to first capture: **< 3 seconds**
- Categories auto-detected correctly: **~80% accuracy** on common phrases
- Emotional states tracked: 8 mood types with intensity rating
- Reminders: deadline presets (today/tonight/tomorrow/this week/custom)
