# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cambodia School Management System (SMS) — a monorepo with a Rust/GraphQL backend and Next.js frontend for digitizing school administration. Currently targeting private schools (Phase 1).

## Development Commands

### Backend (server/)
```bash
cd server && cargo run          # Start dev server on :8081
cd server && cargo build        # Build
cd server && cargo check        # Type-check without building (faster)
```

### Frontend (dashboard/)
```bash
cd dashboard && npm run dev     # Start dev server on :3000 (Turbopack)
cd dashboard && npm run build   # Production build
cd dashboard && npm run lint    # ESLint with auto-fix
```

### Prerequisites
- Rust 1.70+, Node.js 18+, MongoDB 6.0+ running locally
- Backend env: `server/.env` (PORT, MONGODB_URI, MONGODB_NAME, KOOMPI_CLIENT_ID, KOOMPI_CLIENT_SECRET, JWT_SECRET)
- Frontend env: `dashboard/.env.local` (NEXT_PUBLIC_API_URL=http://localhost:8081)

## Architecture

### Backend (Rust + Actix-web + async-graphql + MongoDB)

**Entry point**: `server/src/main.rs` — sets up Actix-web server with CORS, GraphQL endpoint at `POST /graphql`, health check at `GET /health`, and auth routes at `/auth/callback` and `/auth/me`.

**Module structure** — each domain has its own directory under `server/src/graphql/` with:
- `mod.rs` — exports Query and Mutation structs
- `types.rs` — GraphQL output types (derive `SimpleObject`)
- `inputs.rs` — GraphQL input types (derive `InputObject`)
- `queries.rs` — query resolvers
- `mutations.rs` — mutation resolvers

All domain Query/Mutation structs are merged in `server/src/graphql/mod.rs` via `#[derive(MergedObject)]` into `QueryRoot` and `MutationRoot`.

**Models** (`server/src/models/`) — MongoDB document structs using `serde` for serialization. Each model maps to a MongoDB collection.

**Shared types** (`server/src/utils/common_types.rs`):
- `Status` enum: Active, Inactive, Pending, Archived
- `AuditInfo`: created_at/updated_at/created_by/updated_by — embedded in all models
- `SoftDelete`: is_deleted/deleted_at/deleted_by — embedded in all models
- `LocalizedText`: en/km bilingual text support
- `Address`, `ContactInfo`, `Gender`, `DateOfBirth`, `DayOfWeek`

**Permissions** (`server/src/utils/permissions.rs`) — role-based checks using `SchoolRole` enum: Owner, Director, DeputyDirector, Admin, HeadTeacher, Teacher, Accountant, Student, Parent.

**Auth flow**: Koompi OAuth 2.0 → JWT (24h expiry). `GraphQLContext` extracts JWT from `Authorization: Bearer` header and provides user_id/role to resolvers.

### Frontend (Next.js 16 App Router + TypeScript + Tailwind CSS)

**Path alias**: `@/*` maps to `dashboard/*`

**Route structure**: `dashboard/app/auth/(dashboard)/` — all authenticated routes live here, organized by role:
- `admin/(academic)/` — classes, attendance, exams, grading, rooms, setup
- `admin/(management)/` — students, members, HR, communication
- `admin/(finance)/` — finance
- `admin/(operations)/` — analytics, reports, library, inventory
- `admin/(institution)/` — schools, branches, settings
- `owner/`, `parent/`, `student/`, `ministry/` — role-specific views

**GraphQL client** (`dashboard/lib/graphql-client.ts`): `graphqlRequest<T>(query, variables, token)` — thin fetch wrapper that posts to `NEXT_PUBLIC_API_URL/graphql`.

**Query/mutation strings** (`dashboard/app/graphql/`): one file per domain (e.g., `class.ts`, `student.ts`) exporting `*_QUERIES` and `*_MUTATIONS` objects containing GraphQL template strings.

**Custom hooks** (`dashboard/hooks/`): one hook per domain (e.g., `useClasses`, `useStudents`). Pattern:
- Accept options object with schoolId, pagination, filters
- Use `useAuth()` for token
- Return `{ data, total, isLoading, error, refresh, create*, update*, delete* }`
- Call `graphqlRequest` with queries from `app/graphql/`

**State management**: React Context only (AuthProvider, LanguageProvider, ThemeProvider). No Redux/Zustand. Domain data lives in hook-local `useState`.

**i18n**: i18next with `en` and `km` (Khmer) locales. Translation files at `dashboard/public/locales/{lang}/translation.json`. Language stored in localStorage as `sms-language`.

**UI components** (`dashboard/components/`): Radix UI primitives + custom components organized by domain. Icons from Carbon Icons and Lucide React.

## Key Patterns

### Adding a new domain module (backend)
1. Create model in `server/src/models/{name}.rs`, add to `mod.rs`
2. Create `server/src/graphql/{name}/` with mod.rs, types.rs, inputs.rs, queries.rs, mutations.rs
3. Add to `server/src/graphql/mod.rs` — both the module declaration and into `QueryRoot`/`MutationRoot`

### Adding a new domain module (frontend)
1. Add TypeScript types in `dashboard/types/`
2. Add GraphQL queries/mutations in `dashboard/app/graphql/{name}.ts`, re-export from `index.ts`
3. Create hook in `dashboard/hooks/use{Name}.ts`
4. Create components in `dashboard/components/{name}/`
5. Create page at `dashboard/app/auth/(dashboard)/admin/(...)/page.tsx`
6. Add translations to both `en/translation.json` and `km/translation.json`

### Pagination convention
All list queries support `page`/`pageSize` and return `{ items, total, page, pageSize, totalPages }`.

### All entities use soft delete
Filter with `is_deleted: false` in queries. Use `SoftDelete::mark_deleted()` instead of actual deletion.

### Getting Started Guide (`/auth/admin/guide`)

A role-based onboarding guide that walks users through system setup step-by-step.

**Page**: `dashboard/app/auth/(dashboard)/admin/guide/page.tsx`
**Access**: HelpCircle button in the navbar (`dashboard/components/navbar.tsx`)

**Architecture**:
- 5 roles: Owner, Admin, Teacher, Parent, Student — each with tailored steps
- Steps are defined in `stepsByRole` (Record<RoleId, SetupStep[]>) with role-specific flows
- Steps grouped into sections (foundation, structure, operations, teaching, classroom, family, learning, staying_connected) via `sectionsMeta`
- Role selector uses `AnimatePresence` for smooth crossfade transitions
- Two-column card grid layout (`sm:grid-cols-2`) using `liquid-glass-card`

**Translation key pattern**:
- Role labels: `guide_role_{role}`, `guide_role_{role}_desc`
- Step titles: `step_{role}_{n}_title`, `step_{role}_{n}_desc`
- Section labels: `guide_{section_name}`
- Shared: `getting_started`, `setup_guide_subtitle`, `guide_select_role`, `go_to_module`

**To add a new step**: Add entry to the role's array in `stepsByRole` with `titleKey`, `descKey`, `icon`, `href`, and `section`, then add corresponding translations to both `en/translation.json` and `km/translation.json`.
