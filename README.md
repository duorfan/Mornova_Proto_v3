
  # Mornova App Prototype v3

  This is a code bundle for Mornova App Prototype v3. The original project is available at https://www.figma.com/design/98w1WQIDdtzI9jlsW6qHEU/Mornova-App-Prototype-v3.

  ## Running the code

  Run `npm i` to install the dependencies.

  Start the Next.js dev server with `npm run dev` (defaults to http://localhost:3000).  
  Build for production with `npm run build` and serve with `npm start`.

  ## Migration status (Next.js)

  This is a 1:1 port of the original React + Vite prototype to **Next.js (App Router) +
  TypeScript**. It reproduces the existing screens, layout, styling, copy, and behavior —
  it is a migration, not a redesign. See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) for the
  full inventory and the Vue→React mapping.

  ### What's ported (all 1:1)

  - All four screens — **home → routine → rules → preview** — with client-side screen
    switching (no router), driven by local `useState`.
  - The **Tomorrow Morning** weather panel (live Open-Meteo fetch, hardcoded Durham, NC).
  - Personality selection + lamp preview animations, custom-rule dialog, and sonner toasts.
  - Pre-compiled Tailwind v4 styling, forced night theme via `next-themes`.

  ### Backend seams (reserved, not implemented)

  Stub Route Handlers under `app/api/` return `501` + `{ status: "todo", message }`:
  `calendar`, `weather`, `plan`, `reason`. Future keys are listed (placeholders only) in
  [`.env.example`](./.env.example). These reserve where the "brain" (Google Calendar +
  weather + LLM reasoning) will live; nothing real is wired up yet.

  ### 1:1 gaps / decisions

  - **Weather stays client-side by design.** `TomorrowMorningPanel` keeps its direct
    Open-Meteo fetch; `app/api/weather` is only a reserved stub.
  - **Stub HTTP methods are placeholders.** All four stubs respond to `GET` so a browser
    visit / `curl` shows the TODO; the real method (e.g. `POST` for `plan`/`reason`) is
    decided at implementation time.
  - **`Futura` font isn't bundled** (it was referenced inline in the original too); both
    apps fall back to the system sans-serif — visually identical.
  - **No `tailwindcss` dependency by design.** Styles are the original's frozen compiled
    CSS in `app/globals.css`; utility classes not present in that file produce no styles.
  
