import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";
import type { components, paths } from "@/lib/http/generated/crabit-backend";
import { findMyStudentBlock } from "./student-blocks";

type StudentBlockPage = components["schemas"]["StudentBlockPage"];

const studentId = "abcdefab-2222-4222-8222-222222222222";

const block = (id: string, nickname: string) => ({
  studentId: id,
  nickname,
  blockedAt: "2026-09-02T00:00:00Z",
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const clientOf = (pages: StudentBlockPage[]) => {
  const requests: Request[] = [];
  const client = createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      requests.push(request);
      return json(pages[requests.length - 1]);
    },
  });

  return { client, requests };
};

describe("findMyStudentBlock", () => {
  it("다음 커서를 따라가며 뒤 페이지의 차단도 찾는다", async () => {
    const { client, requests } = clientOf([
      {
        items: [block("11111111-1111-4111-8111-111111111111", "친구")],
        nextCursor: "next",
      },
      { items: [block(studentId, "차단 학생")], nextCursor: null },
    ]);

    expect(await findMyStudentBlock(client, studentId)).toEqual(
      block(studentId, "차단 학생"),
    );
    expect(new URL(requests[1].url).searchParams.get("cursor")).toBe("next");
  });

  it("마지막 페이지까지 없으면 null이다", async () => {
    const { client } = clientOf([{ items: [], nextCursor: null }]);

    expect(await findMyStudentBlock(client, studentId)).toBeNull();
  });

  it("대소문자가 다른 식별자도 같은 학생으로 본다", async () => {
    const { client } = clientOf([
      {
        items: [block(studentId.toUpperCase(), "차단 학생")],
        nextCursor: null,
      },
    ]);

    expect(await findMyStudentBlock(client, studentId)).not.toBeNull();
  });

  it("목록을 읽지 못하면 null이다", async () => {
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async () => json({ code: "FORBIDDEN", message: "거부" }, 403),
    });

    expect(await findMyStudentBlock(client, studentId)).toBeNull();
  });
});
