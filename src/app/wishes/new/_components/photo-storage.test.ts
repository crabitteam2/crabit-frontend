// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearPendingWishPhoto,
  clearWishPhotoUploadState,
  readWishPhotoUploadState,
  savePendingWishPhoto,
  stableWishPhotoKey,
} from "./photo-storage";

const scope = "new:account-1";
const photo = {
  id: "9a8b7c6d-5e4f-4321-9876-1234567890ab",
  variants: { small: "small", medium: "medium", large: "large" },
  expiresAt: "2026-08-31T12:05:00Z",
};

describe("Wish photo upload state", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    clearWishPhotoUploadState(scope);
    vi.spyOn(crypto, "randomUUID")
      .mockReturnValueOnce("11111111-1111-4111-8111-111111111111")
      .mockReturnValueOnce("22222222-2222-4222-8222-222222222222");
  });

  it("stores only keys and Pending photo metadata, never image bytes", () => {
    sessionStorage.setItem(
      "crabit:new-wish-photo",
      "data:image/jpeg;base64,old",
    );
    const key = stableWishPhotoKey(scope, "upload", "jpeg-digest-a");
    savePendingWishPhoto(scope, photo);

    expect(key).toBe("11111111-1111-4111-8111-111111111111");
    expect(readWishPhotoUploadState(scope).pendingPhoto).toEqual(photo);
    expect(JSON.stringify(sessionStorage)).not.toContain("data:image");
    expect(sessionStorage.getItem("crabit:new-wish-photo")).toBeNull();
  });

  it("reuses a key for the same signature and rotates it for changed bytes", () => {
    expect(stableWishPhotoKey(scope, "upload", "same")).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
    expect(stableWishPhotoKey(scope, "upload", "same")).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
    expect(stableWishPhotoKey(scope, "upload", "changed")).toBe(
      "22222222-2222-4222-8222-222222222222",
    );
  });

  it("clears Pending state explicitly and removes all state after attachment", () => {
    savePendingWishPhoto(scope, photo);
    stableWishPhotoKey(scope, "mutation", "body");

    clearPendingWishPhoto(scope);
    expect(readWishPhotoUploadState(scope).pendingPhoto).toBeNull();
    expect(readWishPhotoUploadState(scope).mutationKey).not.toBeNull();

    clearWishPhotoUploadState(scope);
    expect(readWishPhotoUploadState(scope)).toEqual({
      pendingPhoto: null,
      uploadKey: null,
      mutationKey: null,
    });
  });
});
