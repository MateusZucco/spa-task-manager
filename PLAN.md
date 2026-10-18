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

RF001 - The system must list all existing tasks, showing each task’s name, description, and creation date.
RF002 - The system must allow a Simple user to create a task by providing a title (name) and a description.
RF003 - The system must set the creation date automatically when a task is created.
RF004 - The system must prevent creating a task without a title and must reject incomplete records (missing name and/or description).
RF005 - The system must allow a Simple user to edit an existing task’s name and description, and must prevent saving incomplete records.
RF006 - The system must allow a Simple user to delete a task directly from the task list.
RF007 - The system must show visual feedback after create, edit, and delete actions (success and error messages).
RF008 - The system must handle and surface validation and operation errors so the user understands why an action failed.

## Non-Functional Requirements

Define requirements such as:

RNF001 - Use Server-Side Rendering (SSR) to pre-load the task list
RNF002 - Display tasks in a simple layout
RNF003 - Use functional components and hooks to manage form state
RNF004 - Implement form validation
RNF005 - Consider user experience when handling loading, success, and failure states
RNF006 - Implement incremental loading of tasks as the user scrolls the page.
---

# Phase 5 — Solution Architecture

## Overview

## [Diagram]

## Software architecture

### Classification
> Security and fault tolerance

### Architecture
> Monolith

### Architectural Partitioning
> technically partitioned

## Technologies

Document the entire stack.

### Frontend

NextJS
  - Why was it chosen? Market leader. Team familiarity. Compatibility with SPAs.
  - What alternatives existed? Vue, Angular, JQuery
  - What are the trade-offs?

### Backend

Node
  - Why was it chosen? Fully unified JavaScript ecosystem. Team familiarity. Agile development.
  - What alternatives existed? Python, Go, Java, .NET
  - What are the trade-offs? Lower performance on CPU-intensive tasks. Complexity with concurrent work (single-threaded)

tRPC
  - Why was it chosen? Fully unified JavaScript ecosystem. Team familiarity. Agile development.
  - What alternatives existed? Python, Go, Java, .NET
  - What are the trade-offs? Lower performance on CPU-intensive tasks. Complexity with concurrent work (single-threaded)

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
**Backend:** files in camelCase.ts;
**SQL migrations:** YYYYMMDD_description.sql.
**Tests:** same name as the file under test + `.test.ts` or `.test.tsx` suffix; on the backend, split into unit/ and integration/ inside __tests__/.

### Variable names

**Variables and functions:** camelCase.
**Immutable constants and env vars:** SCREAMING_SNAKE_CASE.
**Types and interfaces:** PascalCase.
**Booleans:** prefixes is, has, can (e.g. isLoading, hasActiveGoal, canEditUser).
**Handlers and callbacks:** handle for internal functions (e.g. handleSubmit); on for props (e.g. onFilterChange).
**API JSON:** camelCase in request and response (e.g. { startDate, endDate }).

### API structure

**Base:** RPC
**Flow:** Router → Controller → Service -> Model.

---

# Phase 8 — Quality

Define before development.

## Testing Strategy

Unit:
Integration:
E2E:
Performance:
