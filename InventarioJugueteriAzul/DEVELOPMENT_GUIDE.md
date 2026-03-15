# Development guide (project structure & new features)

This repository is split into two apps:

- `InventarioJugueteriAzul/backend`: Express + TypeScript REST API
- `InventarioJugueteriAzul/frontend/fronted-app`: Angular 21 (standalone) client with SSR support

The goal of this guide is to make new features look and behave like the existing codebase.

---

## Backend (Express + TypeScript)

### Folder structure (how code is organized)

- **`src/app.ts`**: Express app setup, global middleware, static files, and router mounting.
- **`src/routes/*.routes.ts`**: Route definitions only (paths + middleware + controller binding).
- **`src/controllers/*.controller.ts`**: HTTP layer (request parsing + status codes + error mapping).
- **`src/services/*.service.ts`**: Business logic (validation, orchestration, cross-module rules).
- **`src/repositories/*.repository.ts`**: DB access (SQL queries using `query()` from `config/database.ts`).
- **`src/types/*.types.ts`**: Request/response and domain types used by controllers/services/repos.
- **`src/middlewares/auth.middleware.ts`**: `verificarAutenticacion` + `verificarJefe` (role enforcement).
- **`src/config/database.ts`**: MySQL pool and shared `query(sql, params)` helper.
- **`src/config/jwt.ts`**: `generarToken`, `verificarToken`.

### Standard request flow

`Route` → (auth/role middleware) → `Controller` → `Service` → `Repository` → MySQL → back up the stack.

### Creating a new backend feature (checklist)

1) **Add/extend types**
- Create or update a file under `src/types/`.
- Keep types small and aligned with API payloads (e.g. `CrearXRequest`, `EditarXRequest`, `ListarXQuery`, `X`, `XConAlgo`).

2) **Add repository methods (DB work)**
- Create `src/repositories/<feature>.repository.ts` (or extend an existing repository).
- Put *all* SQL here, call `query(sql, params)`.
- Prefer parameterized queries (`?`) and build filters by appending to SQL + pushing to `params`.

3) **Add service methods (business rules)**
- Create `src/services/<feature>.service.ts`.
- Validate inputs and enforce rules here (not in controllers).
- Return simple objects the controllers can translate into HTTP responses, e.g.:
  - `{ success: true, ... }`
  - `{ success: false, message: '...' }`

4) **Add controller endpoints (HTTP mapping)**
- Create `src/controllers/<feature>.controller.ts`.
- Parse `req.params`, `req.query`, `req.body` and handle invalid input with `400`.
- On “not found”, return `404`.
- On service validation failures, return `400`.
- Use `try/catch` and return `500` for unexpected errors.
- When you need auditing metadata, read it like other controllers:
  - `req.usuario!.id`
  - `req.ip`
  - `req.headers['user-agent']`

5) **Add routes**
- Create `src/routes/<feature>.routes.ts`.
- Apply auth consistently:
  - `router.use(verificarAutenticacion)` for authenticated areas.
  - `router.use(verificarJefe)` for admin-only areas (or add it per-route).
- Bind controller methods: `controller.metodo.bind(controller)`.

6) **Mount the router**
- Import and mount in `src/app.ts` under `/api/<feature>`.

### Auth & roles (important conventions)

- JWT is passed as `Authorization: Bearer <token>`.
- Use `verificarAutenticacion` on any private route.
- Use `verificarJefe` on jefe/admin-only actions and reporting endpoints.
- Controllers can rely on `req.usuario` being set by the auth middleware.

### Database interaction conventions

- Use `src/config/database.ts` pool and `query()` everywhere.
- Keep DB logic in repositories; services should not contain raw SQL.
- Some domain side-effects may be implemented in the DB (e.g. stock changes via triggers). If you depend on triggers, document the assumption in the service return/message (as `ventas.service.ts` does).

---

## Frontend (Angular 21 standalone + SSR)

### Folder structure (how code is organized)

- **`src/app/app.routes.ts`**: client-side routing (admin + empleado + public).
- **`src/app/features/**`**: feature screens/pages (admin, empleado, login, etc.).
- **`src/app/core/**`**: cross-cutting code:
  - `core/services/auth.service.ts`: login/session state (signals + storage)
  - `core/services/api.service.ts`: REST client wrapper (adds `Authorization` header)
  - `core/guards/*`: `authGuard`, `rolGuard`
- **SSR**:
  - `src/server.ts`: Express server that runs Angular SSR
  - `src/app/app.routes.server.ts`: server render configuration (prerender vs server)

### API calling conventions

- Use `ApiService` (`core/services/api.service.ts`) for typical JSON APIs:
  - `api.get('/api/...', params)`
  - `api.post('/api/...', body)`
  - `api.put('/api/...', body)`
  - `api.delete('/api/...')`
- For file uploads, use `api.postFormData('/api/...', formData)`.
- Don’t build `Authorization` headers manually in components—`ApiService` already does it.

### Creating a new frontend feature (checklist)

1) **Create a standalone component**
- Place it under the relevant feature folder, e.g.:
  - Admin: `src/app/features/admin/<feature>/...`
  - Empleado: `src/app/features/empleado/<feature>/...`
- Use `standalone: true` and import `CommonModule` + `FormsModule` as needed.
- Use `signal(...)` for component state to match existing screens.

2) **Wire the route**
- Add an import + route in `src/app/app.routes.ts`.
- Admin-only pages must live under the `/admin` route tree (it already applies `authGuard` + `rolGuard` with `rol: 'jefe'`).
- Empleado pages must live under `/empleado` (guarded with `rol: 'empleado'`).

3) **Add navigation (if it’s a main page)**
- Add a link in:
  - `src/app/features/admin/admin.component.html` (admin sidebar), or
  - `src/app/features/empleado/empleado.component.html` (if you have a similar menu there).

4) **Consume API**
- Keep HTTP calls in the component or (for larger features) create a small feature-specific service that wraps `ApiService`.
- Normalize backend responses like existing components do (some endpoints return arrays, some return `{ productos: [...] }`, etc.).

### SSR/prerender conventions

- `src/app/app.routes.server.ts` controls which routes are prerendered.
- Avoid prerendering parameterized routes (`:id`) unless you provide params via `getPrerenderParams`.
- If you add a new public, static route (no auth, no params), it can be safely prerendered.

---

## “New feature” definition of done (backend + frontend)

- **Backend**
  - Route is mounted in `src/app.ts`
  - Auth/role middleware matches intended access level
  - Controller validates inputs and returns correct HTTP status codes
  - Service contains the business rules
  - Repository contains *all* SQL and uses parameterized queries
  - `npm run build` in `backend` succeeds

- **Frontend**
  - Standalone component added under `features/`
  - Route added to `app.routes.ts` under the correct guarded tree
  - Uses `ApiService` (and `AuthService` where needed)
  - `npm run build` in `frontend/fronted-app` succeeds (including SSR build)

