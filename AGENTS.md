# TicketTrip

Travel/exploration app: browse destination cities, view adventures per city, and book reservations.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (utility classes, orange accent, `max-w-7xl` layout containers)
- lowdb — JSON file database at `data/db.json`
- pnpm (`packageManager: pnpm@12.5.1`)

## Commands

```bash
pnpm dev     # dev server (rewrites the nextjs-agent-rules block below)
pnpm build   # production build
pnpm lint    # eslint
pnpm start   # serve production build
```

No test suite exists. Verify changes with `pnpm lint` and `pnpm build`.

## Structure

```
app/                  # App Router pages and API routes
  page.tsx            # home: hero + city grid (client component)
  adventures/         # /adventures (city selected via ?cities= query param)
  api/                # route handlers (see below)
components/
  home/               # Hero, CityGrid, CityCard
  adventure/          # AdventureGrid, AdventureCard, AdventureDetails
  layout/             # Navbar, Footer
  reservation/        # ReservationForm
lib/
  api.ts              # fetch helpers used by client components
  db.ts               # lowdb instance + shared DB types
data/db.json          # the database (cities, adventures, detail, reservations)
types/ticket-trip.ts  # shared domain types (City, Adventure, AdventureDetail, Reservation)
```

## Data model (`lib/db.ts`)

- `cities[]` — `id` is a URL-friendly slug (`bengaluru`, `goa`, `new-york`), `city` is the display name.
- `adventures[]` — grouped per city: `{ id: <city id>, adventures: Adventure[] }`.
- `detail[]` — full adventure details keyed by adventure `id` (images, content, `available`, `reserved`, `costPerHead`).
- `reservations[]` — created bookings.

Access the DB only through `getDb()` in `lib/db.ts` (it `read()`s first; call `db.write()` after mutations).

## API routes

| Route                    | Method | Params / body                       | Returns             |
| ------------------------ | ------ | ----------------------------------- | ------------------- |
| `/api/cities`            | GET    | —                                   | `City[]`            |
| `/api/adventures`        | GET    | `?city=` (city id)                  | `Adventure[]`       |
| `/api/adventures/detail` | GET    | `?adventure=` (adventure id)        | `AdventureDetail`   |
| `/api/adventures/new`    | POST   | `{ city }`                          | generated adventure |
| `/api/reservations`      | GET    | —                                   | `Reservation[]`     |
| `/api/reservations/new`  | POST   | `{ name, date, person, adventure }` | `{ success }`       |

Conventions: handlers return `NextResponse.json({ message }, { status })` on error and log with `console.error(error)`.

## Conventions

- Client components declare `"use client"` (Navbar, forms, home page). Everything else stays a server component.
- Client data fetching goes through `lib/api.ts` — do not call `fetch("/api/...")` directly from components.
- Import shared types from `@/types/ticket-trip`; the `@/` alias maps to the repo root.
- Links/navigation use `next/link`, not `<a>` (anchors only for in-page `#hash` targets).
- Query params are lowercase URL slugs; display names come from `city.city`.
- Match existing Tailwind patterns: rounded-2xl cards, `group-hover:scale-105` image zoom, gradient overlays on photos.
