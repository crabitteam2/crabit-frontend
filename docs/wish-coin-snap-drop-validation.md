# 위시 동전 정렬 후 낙하 검증

## 현재 변경

드래그한 하나의 동전 DOM을 유지하며 놓은 좌표에서 300ms 동안 곡선으로 정렬하고, 100ms 대기한 뒤 500ms 동안 수직으로 떨어뜨린다. 정렬·대기까지 원래 크기를 유지하고, 낙하 중 부드럽게 축소·회전해 투입구 안으로 들어간다. 앞면은 실제 투입구 앞 테두리를 따라 동전을 가린다.

- 동전 PNG는 432×432px이다. `sharp`로 alpha > 128을 측정한 픽셀 범위는 x=86…347, y=78…348이며, 반열린 경계는 (86,78)–(348,349)이다. 144px 렌더에서 보이는 폭은 약 87.33px다.
- 토끼 PNG는 1086×1448px이며 두 이미지 레이어 모두 CSS 207×277px로 명시한다. 투입구 앞 테두리를 원본의 (388,634)–(650,665)로 측정했다. 화면상 폭 약 49.94px, 중심 x≈190.92px, 앞 테두리 y≈431.28…437.21px다.
- 보이는 동전 중심이 투입구 중앙에 오도록 정렬 위치를 x≈118.59px, y=150px로 잡는다. 기존 144px 상자의 아래쪽과 귀 사이에는 16px 여백을 유지한다.
- 낙하 진행률 0에서 scale=1, 회전=0으로 시작한다. 첫 68% 구간에 smoothstep으로 균일 배율 0.44, 평면 회전 7.5°, 얕은 Y축 회전 -12°에 도달한다. 기존 이미지의 옆면을 보존하면서 투영 폭을 약 42.45px로 줄인다. 투입구에 닿기 전에 좌우 각각 3px 이상의 여유를 확보한다.
- 동전의 알파 중심을 변환 원점으로 사용하므로 축소·회전 중 수평 중심이 움직이지 않는다. 불투명도 변화나 이미지 교체는 없다.
- 동일한 토끼 앞면 이미지에 기울어진 polygon clip을 적용한다. 낙하 전에는 가림 레이어가 없으며, 낙하 중 동전 하단부터 가려지고 마지막에는 완전히 숨는다.
- 기존 경계를 포함한 동전 중심 판정, grab offset, 200ms 복귀, 취소·lost capture, 한 포인터 추적, 수락 즉시 잠금, unmount 취소, 모션 감소와 단일 callback을 유지한다.
- 카드/위시 funding 티켓, 금액, 버전, 멱등성 키, pending, 오류 재시도와 완료·오류 경로를 변경하지 않는다.

## 이번 실행 결과

검증 시 작업 트리 기준 HEAD: `e8e600c7fa3e4f417c6dffa84b36189bc8c940f7`, 브랜치 `feature/wish-coin-snap-drop`. 아래 결과는 이 HEAD 위의 이번 미커밋 변경에 대한 결과다. 이전 구현 커밋의 검증 결과와 구분한다.

| 검증 | 결과 |
| --- | --- |
| 세 컴포넌트/기하 대상 `npm test -- ...` | 3개 파일, 20개 테스트 통과 |
| `NODE_OPTIONS=--localstorage-file=/private/tmp/crabit-snap-drop-vitest-localstorage npm test` | 71개 파일, 612개 테스트 통과 |
| `npm run lint` | 성공, 기존 feed 관련 경고 2개 |
| `npx tsc --noEmit` | 성공 |
| `npm run build` | 성공, 23개 정적 페이지 및 전체 경로 컴파일 |
| 변경 파일 `prettier --check`, `git diff --check` | 성공 |
| `npm run e2e -- tests/e2e/wish-coin-snap-drop.spec.mjs --workers=1` | 5개 테스트 통과, 24.9초 |

Vitest는 실제 알파 경계의 중심과 폭, 크기 연속성, 단조 축소·회전, 투입구에 닿기 전 폭 여유, 접촉 전/중/후 가림을 확인한다. 기존 판정·포인터·시간·자금이동 회귀 테스트도 유지한다.

E2E는 실제 Next 화면과 서버 액션을 로컬 제어 백엔드에 연결한다. 1280px 마우스와 375px/390px Chromium 터치 에뮬레이션에서 상·하·좌·우·중앙 총 15개 조합을 검증한다. 같은 DOM과 release 좌표, 정렬 대기의 원래 크기, 낙하 중 축소, 900ms 전 요청 0회, 낙하 후 지연 응답 중 중복 차단, 기존 요청 본문·버전·멱등성 키 및 event 완료 경로를 확인했다. 모션 감소 위시 이체 실패/재시도 및 터치 취소/잘못 놓기 역시 통과했다.

## 실제 프레임 확인

실행 시각을 제어한 Playwright 캡처:

| 경과 시간 | 파일 이름 | 관찰 |
| --- | --- | --- |
| 320ms | aligned | 원래 크기로 귀 위에서 대기 |
| 640ms | shrinking | 공중에서 축소·회전 중 |
| 784ms | before-rim | 작아진 동전 전체가 투입구 위에 보임 |
| 816ms | falling | 동전 하단이 투입구 앞 테두리에 닿음 |
| 848ms | inside-rim | 앞 테두리 뒤에 들어가 윗부분만 보임 |
| 880ms | hidden | 완전히 가려짐, 아직 저금 요청 없음 |

- 375px: `test-results/wish-coin-snap-drop-Wish-c-50436-all-and-one-delayed-request/375-{release,aligned,shrinking,before-rim,falling,inside-rim,hidden}.png`
- 390px: `test-results/wish-coin-snap-drop-Wish-c-3976c-all-and-one-delayed-request/390-{release,aligned,shrinking,before-rim,falling,inside-rim,hidden}.png`
- 데스크톱: `test-results/wish-coin-snap-drop-Wish-c-c17d6-all-and-one-delayed-request/1280-{release,aligned,shrinking,before-rim,falling,inside-rim,hidden}.png`

구현 담당자와 부모 세션은 375px 중간 프레임을 각각 직접 열어 중심 정렬, 축소, 테두리 접촉과 점진적 가림을 확인했다. 부모 세션은 CUA로 실제 미리보기에서 마우스 드래그 후 입력 잠금과 1,234원 완료 화면 이동을 확인했다. CUA 실시간 확인과 Playwright 시간 제어 캡처는 별도 증거다.

## 실행 환경과 범위

E2E와 기존 미리보기의 `.next/dev` 잠금 충돌을 피하기 위해 부모 세션이 기존 52210 Next 프로세스를 확인한 뒤 종료했다. 허용된 fixture helper에 선택적 `port` 인자를 추가해 동일 포트 미리보기를 복구할 수 있게 했다. 새 의존성, Next 설정, 이미지 원본과 민감 경로는 변경하지 않았다.

실물 모바일 기기 성능과 운영 금융 백엔드는 검증하지 않았다. 커밋, 기존 PR #180 갱신 및 원격 read-back은 후속 controller action에서 수행한다. 이 작업은 병합이나 배포를 포함하지 않는다.
