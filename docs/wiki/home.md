# Crabit frontend documentation

This file is the editable repository source for the GitHub Wiki Home page. The
[published Wiki](https://github.com/crabitteam2/crabit-frontend/wiki) is a reader-facing mirror, not
an independent source of truth. Publication status must be verified separately; if the two differ,
use the committed repository source.

## Authority map

| Location | Role |
| --- | --- |
| Riido | Sole normative home for product intent, scope, acceptance criteria, and decisions |
| [Frontend repository](https://github.com/crabitteam2/crabit-frontend) | Canonical frontend implementation, quickstart, operational guides, and editable Wiki source Markdown |
| [Backend repository](https://github.com/crabitteam2/crabit-backend) | Canonical backend implementation, target API contract, persistence rationale, and backend operations |
| [GitHub Wiki](https://github.com/crabitteam2/crabit-frontend/wiki) | Curated reader-facing mirrors published from this repository |
| Obsidian `Results/` | Nonnormative concise execution and research results with provenance links; it does not replace Riido or repository-owned technical sources |

## Start here

- [Frontend README](https://github.com/crabitteam2/crabit-frontend/blob/main/README.md): requirements,
  installation, local development, and registered validation commands
- [Frontend BFF proxy](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-bff-proxy.md):
  runtime configuration, forwarding policy, security boundaries, BFF validation, and troubleshooting
- [Card Balance E2E Scenarios](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/card-balance-e2e-scenarios.md):
  deterministic scenario CLI, Playwright fixture, backend control surface, and troubleshooting
- [Backend README](https://github.com/crabitteam2/crabit-backend/blob/main/README.md): backend document map,
  target-versus-runtime API documentation, setup, and verification

Use the frontend README as the repository entry point, then follow this page to the detailed guide.
When a frontend guide states backend routes, statuses, or persistence behavior, follow its backend
source links rather than treating the Wiki copy as a second backend contract.

## Publication map

| Editable repository source | Reader-facing Wiki target |
| --- | --- |
| [`docs/wiki/home.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/home.md) | [Home](https://github.com/crabitteam2/crabit-frontend/wiki) |
| [`docs/wiki/frontend-bff-proxy.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-bff-proxy.md) | [Frontend-BFF-Proxy](https://github.com/crabitteam2/crabit-frontend/wiki/Frontend-BFF-Proxy) |
| [`docs/wiki/card-balance-e2e-scenarios.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/card-balance-e2e-scenarios.md) | [Card-Balance-E2E-Scenarios](https://github.com/crabitteam2/crabit-frontend/wiki/Card-Balance-E2E-Scenarios) |

Publish only from committed repository sources and confirm that each Wiki page reads back with the
same bytes. Editing a Wiki page directly creates drift and does not update its canonical source.
