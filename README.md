# sabarishknight.github.io

Portfolio of Sabarish G. Vite + React + TypeScript + Tailwind v4 + Framer Motion + matter-js.

- **Edit content:** everything lives in `src/data/content.ts`.
- **GitHub data:** `scripts/fetch-github.mjs` snapshots public repos into `src/data/github.json` before every dev/build; if the API is unreachable the build keeps the last snapshot (or falls back to `content.ts`).
- **Hide a repo** from "More on GitHub": add it to `hideRepos` in `content.ts`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main` and weekly (Mondays 06:00 UTC).
