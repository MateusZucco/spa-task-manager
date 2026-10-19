# Phase 1 — Problem Understanding

## Goal

> To do list system

## What should be defined

### Project name

> TO DO LIST

---

### Description

A simple task management SPA

---

### Goal

Deliver a simple task management system where a user can create, list, edit, and delete tasks, with validation that blocks incomplete records and clear success/error feedback — without authentication.

# Phase 2 — Scope Definition

## In scope

Task CRUD
Validations and error handling
Display the result of the operation to the user


---

## Out of scope

Login
Persistence in database


---

# Phase 3 — Functional Discovery

## Personas

Simple user

---

## Use Cases

List all important actions the user will be able to perform.

#### Simple user

As a Simple user, I want to create tasks, and be prevented from submitting incomplete records
As a Simple user, I want to edit tasks, and be prevented from saving incomplete records
As a Simple user, I want to delete tasks

---

## Business Rules

Document all important rules.

- Every task must contain a name, a description, and a creation date
- Tasks cannot be created without a title
- Allow deleting tasks directly from the list, with visual feedback for the user (e.g. success/error message).

---

# Phase 4 — Requirements

## Functional Requirements

FR001 - The system must list all existing tasks, showing each task’s name, description, and creation date.
FR002 - The system must allow a Simple user to create a task by providing a title (name) and a description.
FR003 - The system must set the creation date automatically when a task is created.
FR004 - The system must prevent creating a task without a title and must reject incomplete records (missing name).
FR005 - The system must allow a Simple user to edit an existing task’s name and description, and must prevent saving incomplete records.
FR006 - The system must allow a Simple user to delete a task directly from the task list.
FR007 - The system must show visual feedback after create, edit, and delete actions (success and error messages).
FR008 - The system must handle and surface validation and operation errors so the user understands why an action failed.

## Non-Functional Requirements

Define requirements such as:

NFR001 - Use Server-Side Rendering (SSR) to pre-load the task list
NFR002 - Display tasks in a simple layout
NFR003 - Use functional components and hooks to manage form state
NFR004 - Implement form validation
NFR005 - Consider user experience when handling loading, success, and failure states
NFR006 - Implement incremental loading of tasks as the user scrolls the page.
---

# Phase 5 — Solution Architecture

## Software architecture

### Architecture
> Monolith

### Architectural Partitioning
> technically partitioned

## Technologies

Document the entire stack.

### Frontend

NextJS
  - Why was it chosen? Market leader. Team familiarity. Compatibility with SPAs. Built-in SSR for the task list (NFR001) and an App Router that hosts both the UI and the API in one monolith.
  - What alternatives existed? Vue, Angular, jQuery. Also Remix and a plain React SPA (Vite) if SSR were dropped.
  - What are the trade-offs? Heavier than a static SPA for a small CRUD app. App Router and server/client boundaries add complexity. Tied to the React and Vercel ecosystem. SSR helps the first load, then client navigation behaves like an SPA.

Zustand
  - Why was it chosen? Small API for client-only UI state. No provider.
  - What alternatives existed? Redux Toolkit, Jotai.
  - What are the trade-offs?  There is no enforced action structure, so a larger app can hide updates in the global store.

### Backend

Node
  - Why was it chosen? Fully unified JavaScript ecosystem. Team familiarity. Agile development. Same language and types as the Next.js frontend, so one runtime can serve pages and the API.
  - What alternatives existed? Python, Go, Java, .NET
  - What are the trade-offs? Lower performance on CPU-intensive tasks. Complexity with concurrent work (single-threaded). Fine for this app: task CRUD is I/O-bound and the data stays in memory.

tRPC
  - Why was it chosen? End-to-end TypeScript between the Next.js client and the server procedures. No separate API contract to keep in sync. Zod schemas validate inputs once and the client sees the same types. Fits the monolith and the team’s JavaScript stack.
  - What alternatives existed? REST (Next.js route handlers or OpenAPI), GraphQL, gRPC
  - What are the trade-offs? Only TypeScript clients get the typed API; a public or multi-language API would need REST or OpenAPI instead. Client and server must ship together, so this is a poor fit for external consumers. Procedure calls are less familiar than HTTP resources, and caching depends on React Query rather than standard HTTP cache headers.

---

# Phase 7 — Project Architecture

Monolith

---

## Conventions

## File structure

### Frontend
[source](https://trpc.io/docs/client/nextjs/app-router-setup)

.
├── src
│   ├── app
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc]
│   │   │           └── route.ts  # <-- tRPC HTTP handler
│   │   ├── layout.tsx            # <-- mount TRPCReactProvider
│   │   └── page.tsx              # <-- server component
│   ├── trpc
│   │   ├── init.ts               # <-- tRPC server init & context
│   │   ├── routers
│   │   │   ├── _app.ts           # <-- main app router
│   │   │   ├── post.ts           # <-- sub routers
│   │   │   └── [..]
│   │   ├── client.tsx            # <-- client hooks & provider
│   │   ├── query-client.ts       # <-- shared QueryClient factory
│   │   └── server.tsx            # <-- server-side caller
│   └── [..]
└── [..]

### File names

**Directories:** kebab-case in lowercase.
**Frontend:** components and pages in PascalCase.tsx; hooks with the `use` prefix; services, stores, types, and utils in kebab-case with a descriptive suffix (e.g. *.service.ts).
**Backend:** files in kebab-case.ts;

### Variable names

**Variables and functions:** camelCase.
**Immutable constants and env vars:** SCREAMING_SNAKE_CASE.
**Types and interfaces:** PascalCase.
**Booleans:** prefixes is, has, can (e.g. isLoading, hasActiveGoal, canEditUser).
**Handlers and callbacks:** handle for internal functions (e.g. handleSubmit); on for props (e.g. onFilterChange).
**API JSON:** camelCase in request and response (e.g. { startDate, endDate }).

### API structure

**Base:** RPC
**Flow:** TRPC Router → Controller -> Model.

---
