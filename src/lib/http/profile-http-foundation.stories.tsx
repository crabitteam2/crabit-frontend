import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import {
  APP_ENVIRONMENTS,
  BACKEND_PROFILES,
  type AppEnvironment,
  type BackendProfile,
} from "../../config/profile-policy";
import { PERSONAS } from "../persona/persona";
import { BROWSER_API_BASE_URL } from "./browser";

const ALLOWED_PROFILE_MATRIX: Readonly<
  Record<AppEnvironment, readonly BackendProfile[]>
> = {
  local: ["e2e", "demo", "prod"],
  e2e: ["e2e"],
  staging: ["e2e"],
  prod: ["demo"],
};

const PERSONA_ROUTES = [
  {
    profile: "e2e",
    route: "/api/e2e/persona",
    cookie: "crabit-e2e-persona",
  },
  {
    profile: "demo",
    route: "/api/demo/persona",
    cookie: "crabit-demo-persona",
  },
] as const;

function Code({ children }: { readonly children: string }) {
  return (
    <code className="rounded-md bg-[#f7edf3] px-1.5 py-0.5 font-mono text-[12px] text-[#5c2343]">
      {children}
    </code>
  );
}

function ProfileHttpFoundation() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 bg-white p-6 text-[#311428] sm:p-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-bold tracking-[0.16em] text-[#a04474] uppercase">
          Frontend foundation
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          프로필 기반 HTTP 호출 구조
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[#674f5d]">
          브라우저는 같은 출처 BFF만 호출하고, 서버가 검증된 프로필과 HttpOnly
          persona 쿠키를 이용해 백엔드 자격 증명을 주입합니다. 화면 기능은
          생성된 OpenAPI 타입과 공통 결과 형식을 통해 이 경계를 사용합니다.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">허용 프로필 조합</h2>
        <div className="overflow-hidden rounded-2xl border border-[#ead6e1]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#fbf5f8] text-[#674f5d]">
              <tr>
                <th className="px-4 py-3 font-semibold">APP_ENV</th>
                {BACKEND_PROFILES.map((profile) => (
                  <th
                    key={profile}
                    className="px-4 py-3 text-center font-semibold"
                  >
                    {profile}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APP_ENVIRONMENTS.map((appEnv) => (
                <tr key={appEnv} className="border-t border-[#f0e2e9]">
                  <th className="px-4 py-3 font-semibold">{appEnv}</th>
                  {BACKEND_PROFILES.map((profile) => {
                    const allowed =
                      ALLOWED_PROFILE_MATRIX[appEnv].includes(profile);
                    return (
                      <td key={profile} className="px-4 py-3 text-center">
                        <span
                          className={
                            allowed
                              ? "font-semibold text-[#8f315f]"
                              : "text-[#c5abb9]"
                          }
                        >
                          {allowed ? "허용" : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="flex flex-col gap-3 rounded-2xl border border-[#ead6e1] p-5">
          <h2 className="text-lg font-bold">브라우저 → BFF</h2>
          <p className="text-sm leading-6 text-[#674f5d]">
            브라우저 OpenAPI 클라이언트의 고정 base URL은{" "}
            <Code>{BROWSER_API_BASE_URL}</Code>
            입니다. 백엔드 URL과 Bearer 토큰은 클라이언트 번들에 포함하지
            않습니다.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#674f5d]">
            <li>허용 메서드와 요청·응답 헤더만 전달</li>
            <li>리다이렉트 수동 처리, 캐시 금지, 업스트림 제한 시간 적용</li>
            <li>
              백엔드·BFF·네트워크·잘못된 응답을 하나의 오류 형식으로 정규화
            </li>
          </ul>
        </article>

        <article className="flex flex-col gap-3 rounded-2xl border border-[#ead6e1] p-5">
          <h2 className="text-lg font-bold">서버 → Backend</h2>
          <p className="text-sm leading-6 text-[#674f5d]">
            서버 클라이언트는 명시된 persona 또는 요청의 HttpOnly 쿠키를 현재
            프로필 토큰으로 변환해 Authorization 헤더를 주입합니다.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#674f5d]">
            <li>서버 전용 환경 설정과 토큰 레지스트리 사용</li>
            <li>persona와 요청 문맥은 동시에 전달할 수 없음</li>
            <li>prod 백엔드 프로필은 persona 자격 증명 사용 안 함</li>
          </ul>
        </article>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Persona 선택 경계</h2>
          <p className="text-sm leading-6 text-[#674f5d]">
            Route Handler 자체는 UI가 아니므로 Storybook에서 렌더링하지
            않습니다. 아래에는 개발자가 연결할 경로와 쿠키 계약만 표시합니다.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {PERSONA_ROUTES.map(({ profile, route, cookie }) => (
            <article key={profile} className="rounded-2xl bg-[#fbf5f8] p-5">
              <h3 className="font-bold">{profile} namespace</h3>
              <dl className="mt-3 grid grid-cols-[72px_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-[#8d7381]">Route</dt>
                <dd>
                  <Code>{route}</Code>
                </dd>
                <dt className="text-[#8d7381]">Cookie</dt>
                <dd>
                  <Code>{cookie}</Code>
                </dd>
              </dl>
            </article>
          ))}
        </div>
        <p className="text-sm leading-6 text-[#674f5d]">
          지원 persona: {PERSONAS.join(", ")}. POST는 하나의 persona를 선택하고
          DELETE는 선택을 해제합니다. 성공 응답은 <Code>204 No Content</Code>
          이며 모든 응답은 캐시하지 않습니다.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-[#5c2343] p-5 text-white">
        <h2 className="text-lg font-bold">기능 코드가 사용하는 모듈</h2>
        <p className="text-sm leading-6 text-[#f4dce8]">
          <Code>friends.ts</Code>, <Code>wishes.ts</Code>,{" "}
          <Code>card-balance-accounts.ts</Code>가 생성된 계약 타입을 사용합니다.
          각 호출은 raw 응답 대신 <Code>ApiResult</Code>를 반환하며, 예외 흐름이
          필요한 소비자는 <Code>unwrapResult()</Code>를 사용할 수 있습니다.
        </p>
      </section>
    </main>
  );
}

const meta = {
  title: "Foundation/Profile HTTP",
  component: ProfileHttpFoundation,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "프로필 정책, persona 선택, 같은 출처 BFF, 서버 전용 자격 증명, 타입 안전 HTTP 헬퍼의 연결 지점을 한 화면에서 설명합니다.",
      },
    },
  },
} satisfies Meta<typeof ProfileHttpFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "프로필 기반 HTTP 호출 구조" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(BROWSER_API_BASE_URL)).toBeInTheDocument();
    await expect(canvas.getByText("/api/e2e/persona")).toBeInTheDocument();
    await expect(canvas.getByText("/api/demo/persona")).toBeInTheDocument();
    await expect(
      canvas.getByText(/owner, friend, nonfriend/),
    ).toBeInTheDocument();
  },
};
