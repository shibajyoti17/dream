# Whisker Gift

A small, personal web app for someone who loves cats: hero message, rotating “daily” note and cat fact, and a **static** memory timeline (edited in code).

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## The Cat API (live photos & breeds)

This app can show a **cat image of the day**, a **breed of the day**, and a **bonus random cat** using [The Cat API](https://thecatapi.com/).

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_CAT_API_KEY` to your API key.
3. Restart the dev server.

The daily image is **cached in `localStorage`** for the current calendar date so it stays stable when she refreshes the page. Breed list is cached for the browser session in `sessionStorage`.

**Note:** `VITE_*` variables are included in the front-end bundle, so the key is visible to anyone who opens the site. That is normal for this API’s client-side usage on a small personal project; for stricter control you could add a tiny serverless proxy later.

## Personalize

Edit **`src/data/personalization.ts`**:

- `recipientName`, `giverName`, `tagline`, `dedication`, **`vault`** copy
- **`memories`**: your timeline — add entries, optional `imageSrc` / `imageAlt` with files in **`public/memories/`**
- `notesForHer` and `catFacts`: add as many lines as you like

The “Today’s whisker” section picks one note and one fact based on the calendar date so it feels fresh each day without a backend.

## Vault

The site can stay behind a shared passphrase: set **`VITE_VAULT_KEY`** in `.env.local` (see `.env.example`). For **GitHub Pages**, add **`VITE_VAULT_KEY`** as a repository secret so the build can embed it.

## Build for hosting

```bash
npm run build
npm run preview
```

### Important: `.env.local` is not used online

Vite bakes `VITE_*` into the JS **at build time**. The live site never reads your laptop’s `.env.local`.

| Where you deploy | Where to set `VITE_CAT_API_KEY` / `VITE_VAULT_KEY` |
|------------------|---------------------------------------------------|
| **Vercel** | Project → **Settings** → **Environment Variables** → add both, apply to **Production**, then **Redeploy**. |
| **GitHub Pages** (Actions) | Repo → **Settings** → **Secrets and variables** → **Actions** → **Repository secrets**, then push or re-run the workflow. |
| **Netlify** | Site → **Environment variables** in the UI. |

Names must be exactly **`VITE_CAT_API_KEY`** and **`VITE_VAULT_KEY`** (include the `VITE_` prefix).

Upload the **`dist/`** folder to [Netlify](https://netlify.com), [Vercel](https://vercel.com), [Cloudflare Pages](https://pages.cloudflare.com), or any static host — and set the same variables in that host’s UI if it builds for you.

Optional: set `<title>` and meta `description` in **`index.html`** to match your message.

## Project layout

```
dream/
├── public/
│   ├── favicon.svg
│   ├── cover.jpg
│   └── memories/
├── supabase/              # optional legacy SQL only (app does not call Supabase)
├── src/
│   ├── components/
│   ├── lib/
│   │   └── catApi.ts
│   ├── data/
│   │   └── personalization.ts   # ← memories + all gift copy
│   └── …
├── index.html
├── package.json
└── vite.config.ts
```

## Tech

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
