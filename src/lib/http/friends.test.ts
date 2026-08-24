import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import type { components, paths } from "./generated/crabit-backend";
import {
  acceptFriendRequest,
  blockStudent,
  cancelFriendRequest,
  listAcademyFriends,
  listMyStudentBlocks,
  listReceivedFriendRequests,
  listSentFriendRequests,
  rejectFriendRequest,
  searchAcademyStudents,
  sendFriendRequest,
  unblockStudent,
  unfriendAcademyStudent,
} from "./friends";

const academyId = "11111111-1111-4111-8111-111111111111";
const studentId = "22222222-2222-4222-8222-222222222222";
const friendRequestId = "33333333-3333-4333-8333-333333333333";

const pendingRequest: components["schemas"]["FriendRequest"] = {
  counterpart: { studentId, nickname: "민지" },
  createdAt: "2026-08-24T00:00:00Z",
  friendRequestId,
  processedAt: null,
  status: "PENDING",
};

describe("Friend Management typed request helpers", () => {
  it("preserves each opaque cursor and generated GET path", async () => {
    const captured: Request[] = [];
    const relationshipPage: components["schemas"]["StudentRelationshipPage"] = {
      items: [{ studentId, nickname: "민지", relationshipState: "NONE" }],
      nextCursor: "search-next",
    };
    const friendPage: components["schemas"]["FriendPage"] = {
      items: [{ studentId, nickname: "민지", friendsSince: "2026-08-24T00:00:00Z" }],
      nextCursor: "friends-next",
    };
    const requestPage: components["schemas"]["FriendRequestPage"] = {
      items: [pendingRequest],
      nextCursor: "requests-next",
    };
    const blockPage: components["schemas"]["StudentBlockPage"] = {
      items: [{ studentId, nickname: "민지", blockedAt: "2026-08-24T01:00:00Z" }],
      nextCursor: null,
    };
    const client = testClient(captured, [
      { status: 200, body: relationshipPage },
      { status: 200, body: friendPage },
      { status: 200, body: requestPage },
      { status: 200, body: requestPage },
      { status: 200, body: blockPage },
    ]);

    await expect(searchAcademyStudents(client, {
      academyId,
      nickname: "민",
      cursor: "search-current",
      limit: 20,
    })).resolves.toEqual({ ok: true, data: relationshipPage });
    await expect(listAcademyFriends(client, {
      academyId,
      cursor: "friends-current",
      limit: 30,
    })).resolves.toEqual({ ok: true, data: friendPage });
    await expect(listSentFriendRequests(client, {
      academyId,
      cursor: "sent-current",
      limit: 40,
    })).resolves.toEqual({ ok: true, data: requestPage });
    await expect(listReceivedFriendRequests(client, {
      academyId,
      cursor: "received-current",
      limit: 50,
    })).resolves.toEqual({ ok: true, data: requestPage });
    await expect(listMyStudentBlocks(client, {
      cursor: "blocks-current",
      limit: 60,
    })).resolves.toEqual({ ok: true, data: blockPage });

    expect(requestUrl(captured[0])).toBe(
      `/v1/academies/${academyId}/students?cursor=search-current&limit=20&nickname=${encodeURIComponent("민")}`,
    );
    expect(requestUrl(captured[1])).toBe(
      `/v1/academies/${academyId}/friends?cursor=friends-current&limit=30`,
    );
    expect(requestUrl(captured[2])).toBe(
      `/v1/academies/${academyId}/friend-requests/sent?cursor=sent-current&limit=40`,
    );
    expect(requestUrl(captured[3])).toBe(
      `/v1/academies/${academyId}/friend-requests/received?cursor=received-current&limit=50`,
    );
    expect(requestUrl(captured[4])).toBe(
      "/v1/me/student-blocks?cursor=blocks-current&limit=60",
    );
  });

  it("sends only generated JSON bodies and keeps action endpoints bodyless", async () => {
    const captured: Request[] = [];
    const acceptedFriend: components["schemas"]["Friend"] = {
      studentId,
      nickname: "민지",
      friendsSince: "2026-08-24T02:00:00Z",
    };
    const rejectedRequest: components["schemas"]["FriendRequest"] = {
      ...pendingRequest,
      processedAt: "2026-08-24T02:00:00Z",
      status: "REJECTED",
    };
    const block: components["schemas"]["StudentBlock"] = {
      studentId,
      nickname: "민지",
      blockedAt: "2026-08-24T03:00:00Z",
    };
    const client = testClient(captured, [
      { status: 201, body: pendingRequest },
      { status: 200, body: acceptedFriend },
      { status: 200, body: rejectedRequest },
      { status: 201, body: block },
    ]);

    await expect(sendFriendRequest(client, {
      academyId,
      body: { studentId },
    })).resolves.toEqual({ ok: true, data: pendingRequest });
    await expect(acceptFriendRequest(client, {
      academyId,
      friendRequestId,
    })).resolves.toEqual({ ok: true, data: acceptedFriend });
    await expect(rejectFriendRequest(client, {
      academyId,
      friendRequestId,
    })).resolves.toEqual({ ok: true, data: rejectedRequest });
    await expect(blockStudent(client, {
      body: { studentId },
    })).resolves.toEqual({ ok: true, data: block });

    expect(captured.map(({ method }) => method)).toEqual([
      "POST",
      "POST",
      "POST",
      "POST",
    ]);
    expect(requestUrl(captured[0])).toBe(
      `/v1/academies/${academyId}/friend-requests`,
    );
    await expect(captured[0].clone().json()).resolves.toEqual({ studentId });
    expect(requestUrl(captured[1])).toBe(
      `/v1/academies/${academyId}/friend-requests/${friendRequestId}/acceptance`,
    );
    expect(requestUrl(captured[2])).toBe(
      `/v1/academies/${academyId}/friend-requests/${friendRequestId}/rejection`,
    );
    expect(requestUrl(captured[3])).toBe("/v1/me/student-blocks");
    await expect(captured[3].clone().json()).resolves.toEqual({ studentId });
    await expect(captured[1].clone().text()).resolves.toBe("");
    await expect(captured[2].clone().text()).resolves.toBe("");
    for (const request of captured) {
      expect(request.headers.get("authorization")).toBeNull();
      expect(request.headers.get("idempotency-key")).toBeNull();
    }
  });

  it("maps bodyless unfriend and unblock successes to undefined", async () => {
    const captured: Request[] = [];
    const canceledRequest: components["schemas"]["FriendRequest"] = {
      ...pendingRequest,
      processedAt: "2026-08-24T04:00:00Z",
      status: "CANCELED",
    };
    const client = testClient(captured, [
      { status: 200, body: canceledRequest },
      { status: 204 },
      { status: 204 },
    ]);

    await expect(cancelFriendRequest(client, {
      academyId,
      friendRequestId,
    })).resolves.toEqual({ ok: true, data: canceledRequest });
    await expect(unfriendAcademyStudent(client, {
      academyId,
      studentId,
    })).resolves.toEqual({ ok: true, data: undefined });
    await expect(unblockStudent(client, { studentId })).resolves.toEqual({
      ok: true,
      data: undefined,
    });

    expect(captured.map(({ method }) => method)).toEqual([
      "DELETE",
      "DELETE",
      "DELETE",
    ]);
    expect(requestUrl(captured[0])).toBe(
      `/v1/academies/${academyId}/friend-requests/${friendRequestId}`,
    );
    expect(requestUrl(captured[1])).toBe(
      `/v1/academies/${academyId}/friends/${studentId}`,
    );
    expect(requestUrl(captured[2])).toBe(`/v1/me/student-blocks/${studentId}`);
    for (const request of captured) {
      await expect(request.clone().text()).resolves.toBe("");
      expect(request.headers.get("idempotency-key")).toBeNull();
      expect(request.headers.get("if-match")).toBeNull();
    }
  });
});

interface ResponseSpec {
  readonly status: number;
  readonly body?: unknown;
}

function testClient(captured: Request[], responseSpecs: ResponseSpec[]) {
  return createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      captured.push(request);
      const responseSpec = responseSpecs.shift();
      if (responseSpec === undefined) {
        throw new Error("Missing test response");
      }
      if (responseSpec.status === 204) {
        return new Response(null, { status: responseSpec.status });
      }
      return new Response(JSON.stringify(responseSpec.body), {
        status: responseSpec.status,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
}

function requestUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.pathname}${url.search}`;
}
