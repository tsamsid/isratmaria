# Maria's Birthday Site — React (Vite) Project

This is your birthday website repackaged as a React project (Vite + React 18) so it can be uploaded to **Vercel**.

## How it's structured

Rather than rewriting your entire hand-built animation/pagination/scratch-card engine into
React components (which would be risky and could break the delicate GSAP/Lenis/canvas logic),
this project uses a thin, standard "wrap legacy JS in React" pattern:

- `index.html` — Vite's HTML shell. Loads your fonts and the same CDN libraries
  (GSAP, ScrollTrigger, Lenis, canvas-confetti) exactly as before, then boots React.
- `src/App.jsx` — Injects your original page markup and then runs your original
  `<script>` blocks (in the same order they appeared) as real `<script>` elements,
  so every interaction (chapter pagination, scratch card, quiz, envelope, lightbox,
  music player, confetti, etc.) works unmodified.
- `src/site/markup.html` — Your original body content (raw HTML, imported via `?raw`).
- `src/site/scripts/*.js` — Your original inline scripts, split into files, unmodified.
- `src/styles.css` — Your original `<style>` block, unchanged.

**Nothing about the design, animations, or behavior was rewritten** — this is a faithful
React wrapper around your existing site.

## Required assets — add these before deploying

Your site references a few image/audio files by relative path. Create these folders and
drop your files in:

```
public/images/hero.jpg          (Chapter 1 hero photo)
public/images/chapter2.jpg      (Chapter 2 photo — the one we added earlier)
public/music/birthday.mp3       (background music)
```

Everything in `public/` is served from the site root, matching the relative paths
already used in the markup (e.g. `images/hero.jpg`). Your gallery/memory photos
in the "Beautiful Memories" chapter are already embedded as base64 data directly
in `src/site/scripts/gallery-reasons-quiz.js`, so no extra files are needed for those.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Vite projects (build command `vite build`,
output directory `dist`), so no extra configuration is needed.

**Option B — Vercel dashboard**
1. Push this folder to a GitHub/GitLab/Bitbucket repo (or drag-and-drop the folder
   into Vercel's "Import Project" screen if using the CLI-less flow).
2. In Vercel, click "Add New Project" → import the repo.
3. Framework Preset: Vercel should auto-detect **Vite**. Leave build settings as-is
   (`npm run build`, output `dist`).
4. Click Deploy.

## Notes

- This uses React 18 + Vite 5. `npm install` will pull in `react`, `react-dom`,
  `vite`, and `@vitejs/plugin-react`.
- The GSAP/Lenis/confetti libraries load from CDN (same as your original file) —
  no npm install needed for those, and no version changes.
- If you ever want to convert this into "real" React components later (state-driven
  pagination, etc.), that's a bigger follow-up project — this version is optimized
  for zero behavior changes and a fast path to a live Vercel URL.
