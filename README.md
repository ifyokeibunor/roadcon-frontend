# Frontend (Next.js)

Talks to the backend at `http://localhost:3002`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Backend URL is set in `.env.local` (`BACKEND_URL`).

## How it connects

- Browser code calls `/api/backend/...`; `next.config.mjs` rewrites that to `BACKEND_URL/...`. No CORS setup needed on the backend in dev.
- Server components / route handlers use `lib/api.ts`, which calls `BACKEND_URL` directly.

```ts
import { get, post } from "@/lib/api";

const users = await get<User[]>("/users");
await post("/users", { name: "Ada" });
```

## Structure

- `lib/api.ts` – typed fetch wrapper (`get`, `post`, `put`, `del`, `ApiError`)
- `components/BackendStatus.tsx` – live connection indicator
- `components/RequestConsole.tsx` – try any endpoint from the UI
- `app/page.tsx` – home page; replace with your screens

## Task tracker

Pages: `/` status board (move tasks between To do / In progress / Done), `/tasks` list with search and status filter, `/tasks/new`, `/tasks/[id]` (edit, delete), `/api-test`.

The backend contract is assumed to be REST on `/tasks` (GET list, GET/PUT/DELETE `/tasks/:id`, POST `/tasks`). If yours differs, change `lib/tasks.ts` (paths, field names, status values) and `lib/types.ts`.
