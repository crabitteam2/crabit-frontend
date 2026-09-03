import { describe, expect, it } from "vitest";
import type { components } from "@/lib/http/generated/crabit-backend";
import { toFeedCardItem, toStudentProfileItem } from "./feed-item";

const abandonmentCard = {
  sharedCardId: "81e638f6-b433-4715-bbe1-b4e36fc3e70b",
  kind: "ABANDONMENT",
  state: "ABANDONED",
  ownerId: "dbff0550-9458-4957-a00f-6bfa46becb75",
  ownerNickname: "별이",
  purpose: "새 자전거",
  targetAmount: 200_000,
  progressPercent: 47,
  photo: null,
  startDate: "2026-03-01",
  targetDate: "2026-06-30",
  contentUpdatedAt: "2026-09-03T06:55:00Z",
} satisfies components["schemas"]["AbandonmentSharedCard"];

const student = {
  studentId: "5b4b7e8f-9f38-4d05-880e-44a1641e7379",
  nickname: "별이",
  isFollowing: true,
  isFollowedBy: false,
} satisfies components["schemas"]["StudentRelationship"];

describe("toFeedCardItem", () => {
  it("maps an ABANDONMENT shared card to the abandoned feed treatment", () => {
    expect(toFeedCardItem(abandonmentCard)).toMatchObject({
      id: abandonmentCard.sharedCardId,
      ownerId: abandonmentCard.ownerId,
      ownerNickname: abandonmentCard.ownerNickname,
      purpose: abandonmentCard.purpose,
      targetAmount: abandonmentCard.targetAmount,
      percent: 47,
      state: "ABANDONED",
      startDate: "2026.03.01",
      targetDate: "2026.06.30",
    });
  });
});

describe("toStudentProfileItem", () => {
  it("places an ABANDONMENT card in the terminal profile section and count", () => {
    const profile = toStudentProfileItem(student, [abandonmentCard]);

    expect(profile.inProgress).toHaveLength(0);
    expect(profile.finished).toHaveLength(1);
    expect(profile.finished[0]).toMatchObject({
      id: abandonmentCard.sharedCardId,
      state: "ABANDONED",
    });
  });
});
