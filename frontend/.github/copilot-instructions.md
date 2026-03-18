<!-- Auto-generated guidance for AI coding agents working on this repo. -->
# Copilot instructions for AIS frontend monorepo

Purpose: help AI coding agents be immediately productive by calling out the monorepo layout, developer workflows, conventions, and key files to inspect before changing code.

**Big Picture**:
- **Monorepo:** pnpm workspace (see package.json at repo root) with packages under `app/*`, `packages/*`, `libs/*`, `backend/*`, `theme/*`.
- **Frontend app(s):** `app/core` is the primary Vite React app (uses mode `aml`), `app/plugins` and other apps also exist.
- **Build/runtime:** root `package.json` orchestrates dev/start/build across workspace using `pnpm --filter` and `pnpm -r` scripts.

Note: this repository is organized as a monorepo where `app/core` is the main application. Other top-level folders (for example `packages/*`, `libs/*`, and `theme/*`) act as loosely-coupled SDKs or shared packages consumed by `app/core`.

Theming: theming styles and reusable UI components live under the `theme/` folder. `theme/src` (and `theme/components`) contains design-system pieces and style tokens that are consumed by `@ais/components` and the `app/core` app.

**Important files to inspect** (start here):
- `package.json` (repo root) — workspace scripts and shared dependencies.
- `app/core/package.json` and `app/core/vite.config.js` — core dev server, `--mode=aml`, Vite env loading and define-time env keys.
- `app/core/config-overrides.js` — custom Babel/transpile includes (note it adds `theme/components` and `libs/datatable` to babel-loader include).
- `theme/components/` and `libs/*` — local workspace packages used as peer deps (many use `workspace:^`).
- `backend/api` and `backend/proxy` — backend integration and proxying patterns.

**Developer workflows / useful commands**
- Install (root): `pnpm install` (repo supports pnpm workspaces). Root helper: `pnpm clean:install` (cleans caches and reinstalls).
- Start core app: `pnpm start:core` (filters to `core`), or run all apps: `pnpm start:all`.
- Dev with server: `pnpm start:dev` (starts frontend apps + server + @ais/components in dev filter).
- Build all apps: `pnpm build:dev` (runs build for apps under `app/*`).
- Start test lab: `pnpm start:test-lab` and `pnpm build:test-lab` for the lab app.

**Environment & runtime details**
- Vite in `app/core` loads env vars from two levels up using `loadEnv(mode, path.resolve(__dirname, '../../'), 'VITE')` — expect variables like `VITE_APP_CONTEXT`, `VITE_BACKEND_URL`, `VITE_BACKEND_GRAPHQL_URL`.
- Vite `define` keys: `__APP_NAME__`, `__CONTEXT_PATH__`, `__PLUGIN_URL__`, `__BACKEND_URL__`, `__GRAPHQL_URL__` (set via VITE_ prefixed env vars).

**Conventions & patterns agents should follow**
- Use workspace-scoped imports for local libs: packages use `workspace:^` and are referenced as `@ais/*` packages.
- `app/core/config-overrides.js` intentionally transpiles `theme/components` and `libs/datatable` with Babel — do not assume these are pre-built. If adding modern syntax to those packages, ensure transpilation configuration is considered.
- Plugins: local plugins live under `app/plugins` and may use CRA-style scripts (see that folder's README). When adding a local plugin, maintain the pnpm workspace linkage (`pnpm add <local> --workspace`).

**Agent behavior constraints**
- Do NOT create or modify documentation-related files (for example: `README.md`, files under `.github/`, `docs/`, or other top-level doc files) unless explicitly asked by a human.
- Keep code changes simple and minimal: prefer small, surgical patches focused on the requested change. Avoid broad refactors or adding large new files without prior approval.
- If a change might touch many files or affect CI/hosting, ask for confirmation before proceeding.

**Integration points / cross-component communication**
- Frontend => Backend: GraphQL and REST endpoints configured via `VITE_BACKEND_URL` and `VITE_BACKEND_GRAPHQL_URL`.
- Proxy rules: `app/core/vite.config.js` defines proxy entries for `/api` (overridable by env).
- Peer packages: `@ais/api`, `@ais/components`, `@ais/datatable`, etc., are workspace packages; changes in them can require restarting the dev server or rebuilding depending on how they are consumed.

**Quick debugging tips**
- If a new library import fails at runtime, check `config-overrides.js` for folders that must be transpiled and add them if needed.
- To reproduce a dev environment locally, start the backend proxy or set `VITE_BACKEND_URL` and `VITE_BACKEND_GRAPHQL_URL` to local endpoints.
- Vite dev server default port: `3000` (set in `app/core/vite.config.js`).

**Examples to reference when editing code**
- Editing runtime env: `app/core/vite.config.js` (env key loading and `define` values).
- Adding shared UI: place in `theme/components` (note babel includes) and update `@ais/components` if needed.
- Workspace script examples: see root `package.json` for `start:core`, `start:plugins`, `start:all`, `start:dev`, `clean:install`.

If something relevant is missing from this guidance, tell me what else the agent should know (CI, hosting, or additional scripts) and I will update this file.
