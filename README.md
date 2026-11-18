# Truth or Dare 2

A party Truth or Dare game. Cards come from a Supabase table and get steadily spicier as the game goes on. A small admin area (`#/admin`) lets you add, edit and delete cards.

Live at https://TheLogan.github.io/Truth-or-Dare-2/

## Stack

React 19, TypeScript 7, Vite 8, MUI, Jotai, Supabase. Linting is Oxlint (type-aware), tests are Vitest.

## Setup

Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). The app throws on startup if either is missing. For deploys, set the same two names as repository variables (Settings → Secrets and variables → Actions → Variables).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (`npm run host` to expose it on your network) |
| `npm run lint` | Oxlint with type-aware rules; warnings fail the run |
| `npm test` | Vitest |
| `npm run build` | Type check with `tsc`, then build with Vite |

## Deploys

Every push to `main` runs lint, tests and the build, then deploys `dist` to GitHub Pages via the official Pages actions (see `.github/workflows/node.js.yml`). The deploy stops if lint or tests fail.
