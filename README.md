# Truth or Dare 2

A party Truth or Dare game. Cards come from a Supabase table and get steadily spicier as the game goes on. A small admin area (`#/admin`) lets you add, edit and delete cards.

Live at https://TheLogan.github.io/Truth-or-Dare-2/

## Stack

React 19, TypeScript 7, Vite 8, MUI, Jotai, Supabase. Linting is Oxlint (type-aware), tests are Vitest.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (`npm run host` to expose it on your network) |
| `npm run lint` | Oxlint with type-aware rules; warnings fail the run |
| `npm test` | Vitest |
| `npm run build` | Type check with `tsc`, then build with Vite |

## Deploys

Every push to `main` runs lint, tests and the build, then publishes `dist` to the `gh-pages` branch (see `.github/workflows/node.js.yml`). The deploy stops if lint or tests fail.
