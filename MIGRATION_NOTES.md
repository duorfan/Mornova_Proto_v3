# Mornova Migration Notes

Inventory of the source app and how it maps onto the Next.js port. The brief framed
this as "Vue → Next.js," but the original prototype is **React + Vite** (a Figma Make
export). The mapping table below is kept generic so it still reads as a Vue→React guide.

## Source stack (original prototype)

- **React 18 + Vite + TypeScript** (Figma Make export), preserved on the `legacy-vite` branch.
- **UI components:** shadcn/ui (Radix primitives) — `badge`, `button`, `card`, `dialog`,
  `input`, `label`, `skeleton`, `sonner`, `textarea`, plus a `utils` (cn) helper.
- **Styling:** Tailwind **v4**, shipped as **pre-compiled CSS** baked into `globals.css`.
  There is intentionally **no `tailwindcss` dependency or config** — the CSS is a frozen
  build output, so utility classes that aren't already in that file produce no styles.
- **Other libs:** `motion` (animations), `sonner` (toasts), `next-themes` (theme provider,
  forced night mode), `lucide-react` (icons).
- **Assets:** a single lamp PNG (Figma asset) → now `public/lamp.png`.

## App structure

- Single entry component (`legacy-vite:src/App.tsx`, ~1220 lines) with **client-side screen
  switching** via a `currentScreen` state value — **no router**.
- Four screens: **home → routine → rules → preview**.
- The home screen embeds `TomorrowMorningPanel` (the weather/morning preview card).

## State management

- Plain React **`useState`** lifted into `App` for the shared data: `personality`,
  `routine`, `rules`.
- A small **`ThemeContext`** (created in `App.tsx`) forces night mode.
- **No Vuex / Pinia / Redux / Zustand** — nothing beyond local state + one context.

## Data fetching

- `TomorrowMorningPanel` calls the **Open-Meteo** API **directly from the client**, with
  **hardcoded Durham, NC** coordinates (`latitude=35.9940&longitude=-78.8986`). No API key.
- This direct fetch is **left untouched** in the port (see the weather seam below).

## Vue → React/Next.js mapping

| Vue concept              | React / Next.js equivalent (used here)                     |
| ------------------------ | ---------------------------------------------------------- |
| Vue Router               | Next.js App Router (for real routes) — here, `useState` screen switch |
| Vuex / Pinia store       | React `useState` lifted in `App` + a `ThemeContext`        |
| `computed`               | `useMemo` / derived values                                 |
| `watch`                  | `useEffect`                                                |
| lifecycle hooks          | `useEffect` (mount/update/cleanup)                         |
| `<template>` + directives| JSX                                                        |
| SFC `<style scoped>`     | Tailwind utility classes (pre-compiled)                    |
| `main.ts` mount          | `app/layout.tsx` + `app/providers.tsx`                     |

## What changed in the port (the only deltas from `legacy-vite:src/App.tsx`)

`app/page.tsx` is re-derived 1:1 from the legacy `App.tsx` with exactly three Next.js
adaptations (no redesign, no behavior change):

1. `"use client";` added as the first line (the component uses hooks/state/context).
2. Component imports rewritten from `./components/...` to the `@/components/...` alias
   (`tsconfig` maps `@/*` → `./src/*`).
3. The Figma asset import replaced with `const lampImage = "/lamp.png";` (asset copied to
   `public/lamp.png`).

Everything else — `WavyBackground`, `GlassCard`, `LampPreview`, all four screens, and the
`ThemeContext` — is byte-for-byte the legacy content.

## Backend seams (reserved, not implemented)

Route Handlers under `app/api/` return a TODO placeholder (`501` + `{ status, message }`):

- `app/api/calendar` — Google Calendar (next-day events).
- `app/api/weather` — server-side weather (UI still uses Open-Meteo client-side by design).
- `app/api/plan` — device wake-plan (calendar + weather + rules → schedule).
- `app/api/reason` — LLM reasoning (the natural-language smart tips).

Future keys are listed in `.env.example` (placeholders only): `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_REFRESH_TOKEN`, `WEATHER_API_KEY`,
`ANTHROPIC_API_KEY`.

## Branch map

- **`legacy-vite`** — the original React + Vite prototype (source of truth for 1:1 parity).
- **`main`** — an in-progress Next.js port (~80% done; had some non-1:1 UI additions).
- **`nextjs-archive`** — an earlier Next.js port that pulled in the full UI component library.
- **`finish-nextjs-migration`** — this branch: finishes the port as a strict 1:1 reproduction
  and reserves the backend seams.
