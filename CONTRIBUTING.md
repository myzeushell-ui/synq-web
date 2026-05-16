# Contributing to Synq

Thank you for helping build Synq. This guide explains the branch strategy, PR workflow, and local dev setup.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready. Never commit directly. |
| `dev`  | Working branch. All features merge here first. |
| `feature/*` | Individual features or improvements |
| `fix/*` | Bug fixes |
| `chore/*` | Project setup, dependencies, tooling |

### Examples
```
feature/home-screen
feature/capture-thought
feature/emotions-tracker
feature/reminders
fix/styles
fix/capture-modal-keyboard
chore/project-setup
chore/add-prettier
```

---

## Developer Workflow

### 1. Setup

```bash
git clone https://github.com/your-org/synq-web.git
cd synq-web
npm install
npm run dev
# → http://localhost:3000
```

### 2. Start a new task

```bash
# Always branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/<name>
```

### 3. Make changes

- Follow TypeScript strict mode
- Keep components focused (one responsibility)
- Use the existing `PALETTE` constants from `src/lib/utils.ts`
- Never import directly from `node_modules` UI unless through `src/components/ui/`

### 4. Test locally

```bash
npm run dev          # Start dev server
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript check
npm run build        # Production build check
```

### 5. Commit

```bash
git add .
git commit -m "feat: add deadline chips to capture modal"
# Prefix: feat | fix | chore | docs | style | refactor | test
```

### 6. Open Pull Request

```bash
git push -u origin feature/<name>
# Go to GitHub → New Pull Request → base: dev → compare: feature/<name>
```

### 7. PR Review Checklist

- [ ] Builds without errors (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No broken imports
- [ ] Mobile viewport tested (Chrome DevTools)
- [ ] Matches Synq dark UI palette
- [ ] Description explains what changed and why

### 8. Merging to main

Only maintainers merge `dev → main` after:
- All PRs on dev are reviewed and passing
- Build is verified on Vercel preview
- Demo mode works without errors

---

## Code Style

- **TypeScript**: strict where reasonable, avoid `any`
- **Components**: functional, typed props interface
- **Naming**: PascalCase for components, camelCase for functions/variables
- **CSS**: Tailwind utilities + inline `style` for Synq palette tokens
- **Imports**: use `@/` alias (e.g. `@/components/thoughts/ThoughtCard`)

---

## Palette & Design Tokens

Use constants from `src/lib/utils.ts`:

```ts
import { PALETTE } from '@/lib/utils';

// Then in JSX:
style={{ background: PALETTE.purpleD, color: PALETTE.purple }}
```

Never hardcode hex colours inline — reference the palette.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

For the demo, no env vars are required.

---

## Need Help?

Open an issue on GitHub or message the team on Slack `#synq-dev`.
