import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";
import type { components, paths } from "./generated/crabit-backend";
import {
  blockStudent,
  followAcademyStudent,
  listAcademyFollowers,
  listAcademyFollowing,
  listMyStudentBlocks,
  searchAcademyStudents,
  unblockStudent,
  unfollowAcademyStudent,
} from "./follows";

const academyId = "11111111-1111-4111-8111-111111111111";
const studentId = "abcdefab-2222-4222-8222-222222222222";
const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });

describe("directional follow HTTP contract", () => {
  it("preserves independent flags, opaque cursors, optional search and unfiltered counts", async () => {
    const requests: Request[] = [];
    const page: components["schemas"]["FollowPage"] = {
      items: [
        {
          studentId,
          nickname: "민지",
          followedAt: "2026-09-02T00:00:00Z",
          isFollowing: false,
          isFollowedBy: true,
        },
      ],
      nextCursor: "opaque+/=",
      followingCount: 7,
      followerCount: 50,
    };
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        requests.push(request);
        return json(page);
      },
    });
    for (const list of [listAcademyFollowers, listAcademyFollowing]) {
      expect(
        await list(client, {
          academyId,
          cursor: "opaque+/=",
          nickname: "민",
          limit: 3,
        }),
      ).toEqual({ ok: true, data: page });
    }
    expect(requests.map((r) => new URL(r.url).pathname)).toEqual([
      `/v1/academies/${academyId}/followers`,
      `/v1/academies/${academyId}/following`,
    ]);
    for (const request of requests) {
      const query = new URL(request.url).searchParams;
      expect(query.get("nickname")).toBe("민");
      expect(query.get("cursor")).toBe("opaque+/=");
      expect(query.get("limit")).toBe("3");
    }
    await listAcademyFollowing(client, { academyId });
    expect(new URL(requests[2].url).search).toBe("");
  });

  it("keeps whole-academy discovery and global block listing separate", async () => {
    const requests: Request[] = [];
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        requests.push(request);
        return json({ items: [], nextCursor: null });
      },
    });
    await searchAcademyStudents(client, { academyId, nickname: "민" });
    await listMyStudentBlocks(client, { cursor: "blocks", limit: 10 });
    expect(new URL(requests[0].url).pathname).toBe(
      `/v1/academies/${academyId}/students`,
    );
    expect(new URL(requests[1].url).pathname).toBe("/v1/me/student-blocks");
    expect(new URL(requests[1].url).searchParams.get("cursor")).toBe("blocks");
  });

  it("sends PUT/DELETE bodyless and treats repeated follow/unfollow as successful current-state requests", async () => {
    const requests: Request[] = [];
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        requests.push(request);
        return new Response(null, { status: 204 });
      },
    });
    for (const mutation of [
      followAcademyStudent,
      followAcademyStudent,
      unfollowAcademyStudent,
      unfollowAcademyStudent,
    ]) {
      expect(await mutation(client, { academyId, studentId })).toEqual({
        ok: true,
        data: undefined,
      });
    }
    expect(requests.map((r) => r.method)).toEqual([
      "PUT",
      "PUT",
      "DELETE",
      "DELETE",
    ]);
    for (const request of requests) {
      expect(new URL(request.url).pathname).toBe(
        `/v1/academies/${academyId}/following/${studentId}`,
      );
      expect(await request.text()).toBe("");
      for (const header of ["authorization", "idempotency-key", "if-match"])
        expect(request.headers.get(header)).toBeNull();
    }
  });

  it("serializes same-target mutations across academies and blocks, and continues after a failed request", async () => {
    const requests: Request[] = [];
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        requests.push(request);
        if (requests.length === 1) {
          await pending;
          throw new Error("network failure");
        }
        if (request.method === "POST")
          return json({
            studentId,
            nickname: "민지",
            blockedAt: "2026-09-02T00:00:00Z",
          });
        return new Response(null, { status: 204 });
      },
    });
    const first = followAcademyStudent(client, { academyId, studentId });
    const second = unfollowAcademyStudent(client, {
      academyId: "33333333-3333-4333-8333-333333333333",
      studentId,
    });
    const third = blockStudent(client, {
      body: { studentId: studentId.toUpperCase() },
    });
    const fourth = unblockStudent(client, { studentId });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(requests.map((r) => r.method)).toEqual(["PUT"]);
    release();
    expect(await first).toMatchObject({
      ok: false,
      error: { code: "NETWORK_ERROR" },
    });
    expect(await second).toEqual({ ok: true, data: undefined });
    expect(await third).toMatchObject({ ok: true, data: { studentId } });
    expect(await fourth).toEqual({ ok: true, data: undefined });
    expect(requests.map((r) => r.method)).toEqual([
      "PUT",
      "DELETE",
      "POST",
      "DELETE",
    ]);
    expect(await requests[2].json()).toEqual({
      studentId: studentId.toUpperCase(),
    });
    expect(new URL(requests[3].url).pathname).toBe(
      `/v1/me/student-blocks/${studentId}`,
    );
  });
});
