# TO DO LIST

A simple task management app. A user can list, create, edit, and delete tasks, with validation that blocks incomplete records and toast feedback for success and failure. There is no authentication and no database.

The app is a Next.js monolith. Server Components pre-load the first page of tasks, then client navigation and tRPC calls behave like a single-page app.

Product scope, requirements, and architecture decisions are recorded in [PLAN.md](PLAN.md).

## Features

| Requirement | Behavior |
| --- | --- |
| List tasks | The home page shows title, description, created time, and updated time. |
| Create | `/task/new` accepts a title and an optional description. The server assigns an id and a creation timestamp. |
| Edit | `/task/[id]/edit` updates title and description and stamps `updateDateTime`. Created time is read-only. |
| Delete | Each row has a delete action. A confirmation dialog runs the delete, then the list refreshes. |
| Validation | A task cannot be saved without a title. The form shows the error inline; the server rejects the same case with Zod. |
| Feedback | Create, update, and delete show a success toast. Failures show the error message. Toasts dismiss after 5 seconds. |
| Incremental load | The list loads 10 tasks at a time. Scrolling to the bottom fetches the next page. |
| First paint | The home page prefetches the first page on the server and hydrates it on the client. |

Out of scope: login, and persistence beyond the process memory.

## Stack

| Layer | Choice | Role |
| --- | --- | --- |
| UI | Next.js 15 (App Router), React 19 | Pages, SSR, and the HTTP API in one app |
| Styling | Tailwind CSS 4 | Layout and shared button styles |
| Forms | React Hook Form | Field state and the required-title rule |
| Client data | TanStack Query | Queries, mutations, cache, infinite pages |
| API | tRPC 11 + Zod + Superjson | Typed procedures and shared input schemas |
| UI state | Zustand | Current screen (`list`, `new`, `edit`) and toast |
| Storage | In-memory `Map` singleton | Seeded tasks for the life of the Node process |

Next.js was chosen for SSR of the task list and because the App Router can host the UI and the API together. Zustand holds only client UI state and needs no provider. tRPC keeps one TypeScript contract between the page and the procedures; Zod validates inputs once and the client sees the same types. Task CRUD is I/O-bound and the data stays in memory, so a separate backend runtime is unnecessary.

Trade-offs: the App Router adds a server/client boundary that a static SPA would not. tRPC is a poor fit for non-TypeScript clients. The in-memory store resets when the server process restarts, and in development a new process starts with the original seed.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## How to use it

1. The home page lists tasks. **New Task** in the header opens the create form.
2. Enter a title. Description is optional. **Create** returns to the list and shows a success toast. An empty title stays on the form with “Title is required”.
3. The pencil icon opens the edit form for that task. **Save** updates it. **Cancel** returns to the list without writing.
4. The trash icon opens a confirmation dialog. **Delete** removes the task. **Cancel** closes the dialog.
5. Scroll the list. When the sentinel at the bottom enters the viewport, the next page of 10 tasks loads.

## Architecture

One Next.js process serves pages and the API.

```
Browser
  │
  ├─ Server Component (home)
  │    prefetchInfiniteQuery → tRPC caller → controller → model → memory
  │    dehydrate → HydrationBoundary
  │
  └─ Client components
       React Query + tRPC client
            POST/GET /api/trpc
                 fetch adapter → app router
                      controller → model → TaskDatabase
```

Request path for every procedure:

**tRPC router → controller → model → in-memory database**

- The router (`src/trpc/route/_app.ts`) declares inputs and outputs with Zod.
- The controller (`src/trpc/controller/task.controller.ts`) adapts procedure inputs to model calls.
- The model (`src/trpc/model/task.model.ts`) owns ids, timestamps, paging, and not-found errors.
- `TaskDatabase` is a singleton stored on `globalThis`, so the same `Map` survives hot reload in development. It seeds 100 tasks on first creation.

An error middleware wraps every procedure. It logs internal errors and rethrows `TRPCError`s so the client toast can show the message.

### Screens and client state

`AppStateSync` reads the pathname and sets the Zustand app state:

| Path | State | Header action |
| --- | --- | --- |
| `/` | `list` | **New Task** → `/task/new` |
| `/task/new` | `new` | none |
| `/task/[id]/edit` | `edit` | none |

`TaskForm` reads that state to choose create or update. Edit mode also shows disabled created and updated fields.

Data fetching lives in `src/app/hooks/use-task.ts`. Mutations invalidate the list and the by-id query, navigate home, and open a toast. The list page uses an `IntersectionObserver` on a sentinel to call `fetchNextPage`.

### Task shape

Defined in `src/trpc/schema/tasks.schema.ts` and shared by the server and the client.

| Field | Rule |
| --- | --- |
| `id` | String. Seeded tasks use `"1"`…`"100"`. Created tasks use a short random id. |
| `title` | Required, trimmed, at least one character. |
| `description` | Optional. |
| `createDateTime` | ISO string set on create. |
| `updateDateTime` | ISO string set on update. Absent until the first edit. |

### Procedures

All procedures are on `appRouter` and are exposed at `/api/trpc`.

| Procedure | Type | Input | Output |
| --- | --- | --- | --- |
| `getAll` | query | `{ limit?: number, cursor?: string \| null }` | `{ items, nextCursor }` |
| `getById` | query | `{ id }` | task or `undefined` |
| `create` | mutation | `{ title, description? }` | created task |
| `update` | mutation | full task (`id`, `title`, optional fields) | updated task or `undefined` |
| `delete` | mutation | `{ id }` | `boolean` |

`getAll` pages through the in-memory list. `limit` defaults to 10 and must be between 1 and 50. `cursor` is the id of the last task already shown; the next page starts after it. `nextCursor` is `null` when nothing remains.

`getById`, `update`, and `delete` throw when the id is missing or the task is not in the store.

### Rendering

The home route is a Server Component. It prefetches the first infinite-query page with the server tRPC caller, dehydrates the query client, and passes that state through `HydrationBoundary`. `TaskListPage` is a client component and reads the same query, so the first page is already present.

Create and edit routes are client components. Edit loads the task with `getById` and shows a loader until the query settles.

## Project layout

```
src
├── app
│   ├── api/trpc/[trpc]/route.ts     # tRPC HTTP handler (GET and POST)
│   ├── (routes)
│   │   ├── layout.tsx               # metadata and AppLayout
│   │   ├── page.tsx                 # SSR prefetch of the task list
│   │   └── task
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   ├── components
│   │   ├── AppLayout.tsx            # html shell, fonts, providers
│   │   ├── AppHeader.tsx
│   │   ├── AppStateSync.tsx
│   │   ├── AppToaster.tsx
│   │   ├── AppLoader.tsx
│   │   ├── tasks/                   # list, list page, form
│   │   └── ui/                      # icons
│   ├── hooks
│   │   ├── use-task.ts              # queries and mutations
│   │   ├── use-app-state-from-router.ts
│   │   └── use-app-header-state.ts
│   ├── stores
│   │   ├── app.store.ts             # list | new | edit
│   │   └── toast.store.ts
│   └── utils/format-date-time.ts
└── trpc
    ├── init.ts                      # tRPC init, superjson, error middleware
    ├── client.tsx                   # browser client and provider
    ├── server.tsx                   # server-side caller (server-only)
    ├── query-client.ts              # shared QueryClient factory
    ├── route/_app.ts                # app router
    ├── controller/task.controller.ts
    ├── model/task.model.ts
    ├── schema/tasks.schema.ts
    ├── db/fake-database.ts
    └── middleware/middleware.ts
```

`@/*` maps to `./src/*`.

## Conventions

**Directories:** kebab-case.

**Files:** React components and pages are `PascalCase.tsx`. Hooks start with `use`. Services, stores, types, and utils are kebab-case with a descriptive suffix (`toast.store.ts`, `tasks.schema.ts`). Server modules are `kebab-case.ts`.

**Names:** variables and functions are camelCase. Constants and environment variables are `SCREAMING_SNAKE_CASE`. Types are PascalCase. Booleans use `is`, `has`, or `can`. Internal handlers use `handle`; callback props use `on`. JSON fields are camelCase (`createDateTime`, `nextCursor`).

## Data lifetime

Tasks live in a `Map` on the Node process. Creating, editing, and deleting change that map immediately and are visible to later requests in the same process. Restarting the server, or starting a fresh production process, loads the 100 seeded tasks again and drops anything created in the previous process. Nothing is written to disk.
