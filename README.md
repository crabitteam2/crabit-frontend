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

Open [http://localhost:6006](http://localhost:6006). The source stories cover `UI/Button` and the
Home components; their play functions verify disabled/loading semantics, locked quick actions, and
the tab bar's directional-scroll behavior in Chromium.

Build the complete GitHub Pages artifact and verify its repository base path:

```sh
npm run build:docs
npm run verify:docs -- --base-path /crabit-frontend/
```

The generated and uncommitted `dist/docs` directory contains:

- `index.html`: documentation landing page
- `storybook/`: static Storybook
- `api/`: TypeDoc output generated from Korean TSDoc

Malformed TSDoc fails `npm run lint`. TypeDoc warnings, invalid tags, and broken links fail
`npm run build:docs`; missing comments are intentionally non-gating. Pull requests only validate
the artifact. `.github/workflows/pages.yml` deploys it only after a push to `develop`.

## Backend-for-Frontend proxy

The server exposes the backend through the same-origin `/api/backend/[...path]` Route Handler. See
the canonical [Frontend BFF proxy Wiki source](docs/wiki/frontend-bff-proxy.md) for runtime
configuration, forwarding rules, security boundaries, BFF-specific validation, and troubleshooting.

## Validation

```sh
npm run test
npm run test:storybook
npm run lint
npm run build:docs
npm run verify:docs -- --base-path /crabit-frontend/
APP_ENV=local BACKEND_URL=http://127.0.0.1:18080 npm run build
npm run smoke:bff
```

Run the smoke command after the production build. For deterministic balance scenarios and
Playwright usage, follow the [Card Balance E2E guide](docs/wiki/card-balance-e2e-scenarios.md).

## Production start

After a successful production build, start the server separately:

```sh
APP_ENV=local BACKEND_URL=http://127.0.0.1:18080 npm run start
```
