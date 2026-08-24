# Crabit 프론트엔드 문서

이 파일은 GitHub Wiki Home 페이지를 편집할 때 사용하는 저장소 원본입니다.
[게시된 Wiki](https://github.com/crabitteam2/crabit-frontend/wiki)는 독자를 위한 미러이며 별도의
기준 원천이 아닙니다. 게시 상태는 따로 검증해야 합니다. 둘의 내용이 다르면 커밋된 저장소
원본을 따릅니다.

## 문서 권위

| 위치 | 역할 |
| --- | --- |
| Riido | 제품 의도, 범위, 인수 조건, 결정의 유일한 규범적 원천 |
| [프론트엔드 저장소](https://github.com/crabitteam2/crabit-frontend) | 프론트엔드 구현, 빠른 시작, 운영 가이드, 편집 가능한 Wiki 원본 Markdown의 기준 |
| [백엔드 저장소](https://github.com/crabitteam2/crabit-backend) | 백엔드 구현, 목표 API 계약, 영속성 설계 근거, 백엔드 운영의 기준 |
| [GitHub Wiki](https://github.com/crabitteam2/crabit-frontend/wiki) | 이 저장소에서 게시하는 독자용 선별 미러 |
| Obsidian `Results/` | 출처 링크를 포함한 간결한 실행·연구 결과를 보관하는 비규범적 공간. Riido나 저장소의 기술 문서를 대신하지 않음 |

## 여기서 시작하기

- [프론트엔드 README](https://github.com/crabitteam2/crabit-frontend/blob/main/README.md): 요구 사항,
  설치, 로컬 개발, 등록된 검증 명령
- [프론트엔드 HTTP 아키텍처](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-http-architecture.md):
  UI와 typed client부터 BFF, 백엔드 인증·컨트롤러·오류 경계까지 이어지는 revision별 구조와 요청 흐름
- [프론트엔드 BFF 프록시](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-bff-proxy.md):
  런타임 설정, 전달 정책, 보안 경계, BFF 검증, 문제 해결
- [Frontend profile, persona, and typed HTTP foundation](frontend-profile-http-foundation.md):
  배포 profile 정책, 서버 전용 persona credential, BFF 인증 경계, 고정 OpenAPI와 typed HTTP 모듈
- [카드 잔액 E2E 시나리오](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/card-balance-e2e-scenarios.md):
  결정적 시나리오 CLI, Playwright fixture, 백엔드 제어 표면, 문제 해결
- [백엔드 README](https://github.com/crabitteam2/crabit-backend/blob/main/README.md): 백엔드 문서 지도,
  목표 계약과 런타임 API 문서의 구분, 설정, 검증

프론트엔드 README를 저장소의 시작점으로 삼고, 이 페이지에서 필요한 상세 가이드를 찾아가세요.
프론트엔드 가이드에 백엔드 경로, 상태 또는 영속성 동작이 나와 있다면 Wiki 사본을 또 하나의
백엔드 계약으로 해석하지 말고 연결된 백엔드 원본을 따릅니다.

## 게시 관계

| 편집 가능한 저장소 원본 | 독자용 Wiki 대상 |
| --- | --- |
| [`docs/wiki/home.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/home.md) | [Home](https://github.com/crabitteam2/crabit-frontend/wiki) |
| [`docs/wiki/frontend-http-architecture.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-http-architecture.md) | [Frontend-HTTP-Architecture](https://github.com/crabitteam2/crabit-frontend/wiki/Frontend-HTTP-Architecture) |
| [`docs/wiki/frontend-bff-proxy.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/frontend-bff-proxy.md) | [Frontend-BFF-Proxy](https://github.com/crabitteam2/crabit-frontend/wiki/Frontend-BFF-Proxy) |
| [`docs/wiki/frontend-profile-http-foundation.md`](frontend-profile-http-foundation.md) | 저장소 전용(Draft PR #5). 이 Feature Run에서는 GitHub Wiki 대상으로 게시하지 않음 |
| [`docs/wiki/card-balance-e2e-scenarios.md`](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/card-balance-e2e-scenarios.md) | [Card-Balance-E2E-Scenarios](https://github.com/crabitteam2/crabit-frontend/wiki/Card-Balance-E2E-Scenarios) |

커밋된 저장소 원본에서만 게시하고, 각 Wiki 페이지를 다시 읽었을 때 바이트가 원본과 같은지
확인합니다. Wiki 페이지를 직접 편집하면 드리프트가 생기며 기준 원본은 갱신되지 않습니다.
