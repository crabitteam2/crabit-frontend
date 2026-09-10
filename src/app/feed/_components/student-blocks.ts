import type { CrabitApiClient } from "@/lib/http/follows";
import { listMyStudentBlocks } from "@/lib/http/follows";
import type { components } from "@/lib/http/generated/crabit-backend";

type StudentBlock = components["schemas"]["StudentBlock"];

const PAGE_LIMIT = 100;

/**
 * 내가 만든 차단 목록에서 이 학생을 찾습니다.
 *
 * 찾지 못했을 때와 목록을 읽지 못했을 때 모두 null입니다.
 */
export async function findMyStudentBlock(
  client: CrabitApiClient,
  studentId: string,
): Promise<StudentBlock | null> {
  const target = studentId.toLowerCase();
  let cursor: string | undefined;

  do {
    const result = await listMyStudentBlocks(client, {
      cursor,
      limit: PAGE_LIMIT,
    });
    if (!result.ok) return null;

    const found = result.data.items.find(
      (item) => item.studentId.toLowerCase() === target,
    );
    if (found !== undefined) return found;

    cursor = result.data.nextCursor ?? undefined;
  } while (cursor !== undefined);

  return null;
}
