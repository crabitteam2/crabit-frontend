# 위시 동전 정렬 후 낙하 검증

## 변경

- 드래그한 하나의 동전을 놓은 좌표부터 곡선으로 300ms 정렬하고, 100ms 멈춘 뒤 500ms 수직 낙하한다.
- 정렬 위치는 왼쪽 123.5px, 위쪽 150px이다. 144px 동전 아래와 토끼 귀 시작(310px) 사이에 16px 여백을 둔다.
- 기존 저금통 판정 사각형과 경계를 포함하는 동전 중심 판정을 보존한다. 실패 및 취소는 200ms 동안 원위치로 돌아간다.
- 앞면 가림은 낙하부터 적용해 하단에서 놓은 동전도 정렬 중 계속 보인다.
- 같은 포인터만 추적하고 수락 즉시 입력을 잠근다. 모션 감소 설정에서도 한 번만 호출하며, 화면을 떠나면 예약된 애니메이션을 취소한다.
- 기존 카드/위시 자금이동 티켓, 금액, 버전, 멱등성 키와 완료·오류 경로를 보존한다.

## 검증 범위

Vitest는 경계 및 밖의 좌표, 현재 release 좌표, grab offset, 단계별 시간, 취소/중복/다중 포인터, unmount, 모션 감소, pending, 카드/위시 payload, 오류 재시도와 balance mismatch 이동을 확인한다.

Playwright는 실제 Next 화면과 서버 액션을 로컬 제어 백엔드에 연결한다. 1280px 마우스, 375px/390px Chromium 터치 에뮬레이션으로 상·하·좌·우·중앙에서 놓기, 정렬 여백과 앞면 가림, 지연 응답 중 중복 차단, 재시도 및 모션 감소를 확인한다. 브라우저 스크린샷은 각 실행의 `test-results`에 보관한다.

실물 기기나 운영 금융 백엔드의 검증을 의미하지 않는다.

## 실행 결과

기준 HEAD: `4ddc5fe4d9f98badc3b11bfbe247d3a997853ff6` (`feature/wish-coin-snap-drop`). 변경 파일은 아직 커밋하지 않은 작업 트리 결과다.

| 검증                                                                                          | 결과                                                                        |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `npm ci --cache /private/tmp/crabit-snap-drop-npm-cache`                                      | 성공, 잠금 파일 변경 없음                                                   |
| 두 컴포넌트 대상 `npm test -- ...`                                                            | 2개 파일, 17개 테스트 통과                                                  |
| `NODE_OPTIONS=--localstorage-file=/private/tmp/crabit-snap-drop-vitest-localstorage npm test` | 70개 파일, 609개 테스트 통과                                                |
| `npm run lint`                                                                                | 성공, 기존 feed 관련 경고 2개                                               |
| `npx tsc --noEmit`                                                                            | 성공                                                                        |
| `npm run build`                                                                               | 성공, 23개 정적 페이지 생성 및 모든 경로 컴파일                             |
| `npm run e2e -- tests/e2e/wish-coin-snap-drop.spec.mjs --workers=1`                           | 5개 테스트 통과; 15개 위치/크기 조합, 모션 감소 이체 재시도, 터치 취소/복귀 |
| 계획된 파일 `prettier --check`, `git diff --check`                                            | 성공                                                                        |

초기 설치는 샌드박스 DNS, 전체 테스트와 빌드는 로컬 포트 권한 제한 때문에 실패했다. 허용된 실행 환경에서 재실행했다. Node 25의 전체 테스트에는 임시 localStorage 경로를 지정했다. 첫 빌드 실패가 남은 해당 작업 트리의 재생성 가능한 Turbopack 캐시를 삭제한 뒤 빌드가 통과했다. 첫 타입 검사는 새 작업 트리에 Next 생성 타입이 없어 실패했으며 Next 실행 후 성공했다.

제어 백엔드 fixture에 현재 Wish 계약의 `abandonmentAmount: null`을 추가한 후 실제 화면이 정상 로드됐다. 운영 API를 변경한 사항은 없다.

375px의 release/aligned/falling 이미지를 직접 읽어 하단에서 놓은 동전의 연속 표시, 귀 위 여백, 낙하 시 앞면 가림을 확인했다. 독립 검토에서 발견한 데스크톱 선택 표시를 `select-none`으로 제거하고 마우스·터치 E2E 및 스크린샷을 다시 검증했다.

스크린샷:

- 375px: `test-results/wish-coin-snap-drop-Wish-c-50436-all-and-one-delayed-request/375-{release,aligned,falling}.png`
- 390px: `test-results/wish-coin-snap-drop-Wish-c-3976c-all-and-one-delayed-request/390-{release,aligned,falling}.png`
- 데스크톱: `test-results/wish-coin-snap-drop-Wish-c-c17d6-all-and-one-delayed-request/1280-{release,aligned,falling}.png`

브라우저 시간 제어로 release 직후, 320ms 정렬 대기, 816ms 낙하를 캡처했다. 동일 DOM 유지, 900ms 전 요청 0회, 낙하 후 지연 응답 중 추가 제스처에도 요청 1회, 요청 본문 버전·멱등성 키와 완료 event 경로를 검증했다. 실물 터치 기기의 프레임 성능, 운영 백엔드, 배포는 실행 범위에 포함하지 않았다.
