import { expect, it } from "vitest";
import createClient from "openapi-fetch";
import type { paths } from "./generated/crabit-backend";
import { getAcademyStudent, searchAcademyStudents } from "./friends";
it("uses exact student lookup independently of the public-card list", async () => {
  const requests: Request[] = [];
  const client = createClient<paths>({ baseUrl: "https://backend.test", fetch: async request => { requests.push(request); return Response.json({ studentId: "target", nickname: "학생", isFollowing: false, isFollowedBy: false }); } });
  const result = await getAcademyStudent(client, { academyId: "academy", studentId: "target" });
  expect(result.ok).toBe(true);
  expect(requests[0].url).toBe("https://backend.test/v1/academies/academy/students/target");
});
it("preserves nickname search and page parameters", async () => {
  const requests: Request[] = [];
  const client = createClient<paths>({ baseUrl: "https://backend.test", fetch: async request => { requests.push(request); return Response.json({ items: [], nextCursor: null }); } });
  await searchAcademyStudents(client, { academyId: "academy", nickname: "민", limit: 20 });
  expect(new URL(requests[0].url).searchParams.get("nickname")).toBe("민");
});
