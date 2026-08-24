# crabit-frontend

The Crabit frontend runs on Next.js 16 with the App Router and the standard Node.js runtime.

## Documentation and authority

This README is the entry point for frontend setup, validation, and documentation. The documentation
locations have distinct roles:

| Location                                                            | Role                                                                                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Riido                                                               | The sole normative source for product intent, scope, acceptance criteria, and decisions                                                          |
| This repository                                                     | Canonical frontend implementation, quickstart, operational guides, and editable GitHub Wiki source Markdown                                      |
| [Backend repository](https://github.com/crabitteam2/crabit-backend) | Canonical backend implementation, target API contract, persistence rationale, and backend operations                                             |
| [GitHub Wiki](https://github.com/crabitteam2/crabit-frontend/wiki)  | Reader-facing mirrors of `docs/wiki`; it is not a separate editable source of truth                                                              |
| Obsidian `Results/`                                                 | Nonnormative execution and research results that point to Riido, Git, CI, and provider evidence instead of copying plans or repository documents |

Start with the [repository-owned Wiki Home source](docs/wiki/home.md) for the complete documentation
map. The detailed guides are:

- [Frontend HTTP architecture](docs/wiki/frontend-http-architecture.md): revision-qualified flow from
  UI and typed clients through the BFF to backend authentication, controllers, and error boundaries
- [Frontend BFF proxy](docs/wiki/frontend-bff-proxy.md): runtime configuration, forwarding and
  security boundaries, BFF validation, and troubleshooting
- [Card Balance E2E Scenarios](docs/wiki/card-balance-e2e-scenarios.md): deterministic scenario CLI,
  Playwright fixture, backend control surface, and troubleshooting

GitHub Wiki publication is a separate synchronization step. When a repository source and its Wiki
mirror differ, use the committed repository source and verify the current publication state.

## Requirements

- Node.js 20.9.0 or newer
- npm

## Development

Install the locked dependencies and start the development server:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Component and API documentation

Storybook replaces the former internal `/dev/components` catalog. It renders the supported mobile,
light-theme component states with the same global styles and static assets as the application:

```sh
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006). The source stories cover `UI/Button`, the Home
components, and `Foundation/Profile HTTP`. The foundation page documents the allowed
`APP_ENV × BACKEND_PROFILE` combinations, persona routes and cookies, the same-origin BFF boundary,
and the typed HTTP helpers without rendering server-only Route Handlers as UI.

Build the complete GitHub Pages artifact and verify its repository base path:

```sh
npm run build:docs
npm run verify:docs -- --base-path /crabit-frontend/
```

The generated and uncommitted `dist/docs` directory contains:

- `index.html`: documentation landing page
- `storybook/`: static Storybook
- `api/`: TypeDoc output generated from Korean TSDoc

To inspect the same artifact with a local static server, build it with the root base path:

```sh
npm run build:docs:preview
npm run verify:docs:preview
python3 -m http.server 8000 --directory dist/docs
```

Open [http://localhost:8000/](http://localhost:8000/),
[http://localhost:8000/storybook/](http://localhost:8000/storybook/), or
[http://localhost:8000/api/](http://localhost:8000/api/). The `/crabit-frontend/` base path is for
GitHub Pages deployment, while `/` is for the local server above.

Malformed TSDoc fails `npm run lint`. TypeDoc warnings, invalid tags, and broken links fail
`npm run build:docs`; missing comments are intentionally non-gating. Pull requests only validate
the artifact. `.github/workflows/pages.yml` deploys it only after a push to `develop`.

## Backend-for-Frontend proxy

The server exposes the backend through the same-origin `/api/backend/[...path]` Route Handler. Deployment and backend profiles are validated separately, and E2E or Demo persona credentials are selected only on the server. See the canonical [Frontend BFF proxy Wiki source](docs/wiki/frontend-bff-proxy.md) and [profile/persona/typed HTTP operations Wiki source](docs/wiki/frontend-profile-http-foundation.md).

The checked backend contract snapshot lives at `openapi/crabit-backend.yaml`. Regenerate and verify its typed client input with:

```sh
npm run openapi:generate
npm run openapi:check
```

Feature code uses the typed helpers in `src/lib/http/`. The Wish helpers include
representative-Wish read and selection operations, while `friends.ts` covers
same-academy search, friendships, friend requests, and global student blocks.
They return `ApiResult` instead of exposing raw `openapi-fetch` responses;
`unwrapResult()` is the framework-neutral bridge for consumers that need a
sanitized thrown error.

## Validation

```sh
npm run test
npm run test:storybook
npm run lint
npm run build:docs
npm run verify:docs -- --base-path /crabit-frontend/
npm run build:docs:preview
npm run verify:docs:preview
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run build
npm run openapi:check
npm run smoke:bff
```

Run the smoke command after the production build. For deterministic balance scenarios and
Playwright usage, follow the [Card Balance E2E guide](docs/wiki/card-balance-e2e-scenarios.md).

## Production start

After a successful production build, start the server separately:

```sh
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run start
```
