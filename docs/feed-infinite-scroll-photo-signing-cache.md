# 학원 피드 무한 스크롤과 사진 서명 URL 재사용

## 사용자 동작

첫 조회와 이후 조회는 `limit: 10`을 사용한다. 하단에 가까워지면 다음 커서로 자동 조회하며, 키보드 이용자를 위한 `더 보기` 버튼도 제공한다. 마지막 커서가 null이면 종료를 알린다. 첫 페이지의 실제 `sortSource`로 추천순/최신순을 표시한다.

추가 조회 중에는 기존 카드와 스크롤 위치를 유지한다. 실패하면 하단 안내와 `다시 시도`를 제공하며 동일한 커서를 재전송한다. 자동 오류 재시도는 없다. HTTP 410 또는 `RECOMMENDATION_CURSOR_EXPIRED`이면 기존 카드를 유지하고 `목록 새로 시작`으로 첫 페이지를 다시 요청한다. 401/403은 재시도 버튼 없이 접근 안내를 표시한다. 성공한 커서가 반복되거나 순환하면 자동 조회를 멈추고 명시적인 재시작을 안내한다.

첫 페이지 로딩·빈 결과·오류에는 기존 FeedSkeleton, EmptyFeed, ErrorScreen을 사용한다. 비어 있어도 다음 커서가 있으면 계속 진행할 수 있다. PullToRefresh와 TopButton을 유지하며, 명시적 새로고침과 학원 선택도 제공한다.

## 페이지와 행동 맥락

각 행은 카드 외에 원래 페이지의 `resultContextId`, `expiresAt`, 중복 제거 전 0-based `position`을 보관한다. 같은 카드가 다시 나타나면 최초 행과 맥락을 유지한다. 추가 페이지는 기존 Impression 인스턴스와 DOM 키, 이벤트 큐를 교체하거나 비우지 않는다. 따라서 두 번째 페이지의 노출/클릭은 전체 목록 인덱스가 아닌 서버가 발급한 페이지 위치로 수집된다.

동기 in-flight 가드가 중복 observer 알림을 막고 성공 커서 집합이 이미 성공한 요청의 재전송을 막는다. 실패 커서는 성공 집합에 넣지 않는다. observer 콜백도 생성 당시 세대에 결속된다. 새로고침, 학원/페르소나에 따른 세션 교체, 화면 이탈 시 요청을 abort하고 세대를 올려 오래된 응답을 버린다. 세션 entry가 달라지면 이전 카드가 새 세션 아래 렌더링되지 않는다. Abort된 과거 409 읽기 응답은 세션 재초기화를 유발하지 않는다.

`BehaviorReadError`는 HTTP 상태와 nested backend `error.code` 및 flat BFF `code`를 보존한다. 네트워크 실패는 기존 예외로 전달된다. 새로운 클라이언트 사진 URL 캐시는 만들지 않으며 백엔드가 반환한 실제 만료 시각을 따른다.

## 계약 출처

백엔드 확인 commit: `0c8d6b802076ab826be5bf2e4a0b9e7111858fd7`.

원본: `api/openapi.yaml`, SHA-256 `f060a17c394678fa512d059be745be3f9d3991582d65168a0e2365cec1305adb`.

`openapi:refresh`로 snapshot/provenance를 동기화하고 `openapi:generate`로 타입을 재생성했다. 재사용하는 사진 URL은 원래 실제 `expiresAt`을 유지하고 반환 시 30초 이상 남은 완전한 세 변형이어야 한다. 신규 발급 최대 300초와 현재 권한 검사는 백엔드 계약을 따른다.

## 검증

- `npm run build`: 통과, TypeScript 검사 포함.
- `npm run openapi:check`: snapshot/provenance/생성 타입 일치.
- `npm run lint`: 오류 없음. behavior-session/feed-screen cleanup ref 및 기존 wishes/new unused account 경고 3개가 남는다. cleanup은 현재 세대의 마지막 추가 요청까지 취소하기 위해 ref의 최신 값을 의도적으로 읽는다.
- `NODE_OPTIONS=--no-experimental-webstorage npm test`: 80 files / 678 tests 통과. 기본 `npm test`는 Node 실험적 Web Storage가 jsdom localStorage를 가리는 환경 문제로 기존 검색 테스트 11개가 실패하고 667개가 통과했다. 저장소 설정을 변경하지 않고 실행 옵션으로 분리해 확인했다.
- pagination/typed-error/collector 집중 테스트: 51개 통과. 중복 observer, 첫 행 유지와 원래 위치, 실패 커서 재시도, 410/code 만료, 401/403 중단, 빈 페이지 커서 순환, 새로고침과 A-B-A 세대 전환, abort를 검증한다.
- `npm run e2e -- tests/e2e/behavior-events.spec.mjs tests/e2e/feed-infinite-scroll.spec.mjs`: 최종 10/10 통과(15.7초). 실제 `next start` + fixture 백엔드 Playwright에서 모바일 390×844 / 데스크톱 1280×900 스크롤, 중복 제거, 마지막 페이지 종료, 두 번째 페이지 노출/클릭 맥락, 503 스크롤 보존·정확한 커서 재시도·410 재시작·맨 위로 이동을 검증했다. 기존 행동 수집 시나리오는 학원/페르소나 A-B-A, 오래된 mismatch 차단, 실패한 목적지의 클릭만 전송, 동일 이벤트의 네 번 재시도, reload/history 방문 구분도 통과했다. 사진은 fixture에서 null이므로 실제 IAM 지연과 사진 전달은 이 브라우저 검증에 포함되지 않는다.

병합·배포·실제 Google IAM 성능은 이 프론트엔드 구현 검증의 결과가 아니다. 전역 fetch 캐시, CDN, 사진 API, URL 수명, DB migration은 변경하지 않는다.
