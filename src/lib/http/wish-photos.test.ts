import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import type { components, paths } from "./generated/crabit-backend";
import { deletePendingWishPhoto, uploadWishPhoto } from "./wish-photos";

const photoId = "9a8b7c6d-5e4f-4321-9876-1234567890ab";
const uploaded: components["schemas"]["WishPhoto"] = {
  id: photoId,
  variants: {
    small: "https://storage.test/small",
    medium: "https://storage.test/medium",
    large: "https://storage.test/large",
  },
  expiresAt: "2026-08-31T12:05:00Z",
};

describe("Wish photo typed request helpers", () => {
  it("sends one JPEG multipart part with a browser-generated boundary", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, uploaded, 201);
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const photo = new File([bytes], "local-name.jpeg", { type: "image/jpeg" });

    await expect(uploadWishPhoto(client, {
      idempotencyKey: "stable-upload-key",
      photo,
    })).resolves.toEqual({ ok: true, data: uploaded });

    const request = captured[0];
    expect(request.method).toBe("POST");
    expect(request.headers.get("idempotency-key")).toBe("stable-upload-key");
    expect(request.headers.get("content-type")).toMatch(
      /^multipart\/form-data; boundary=/,
    );
    const body = await request.clone().formData();
    expect([...body.keys()]).toEqual(["photo"]);
    const part = body.get("photo");
    expect(part).toBeInstanceOf(File);
    expect((part as File).name).toBe("wish-photo.jpg");
    expect((part as File).type).toBe("image/jpeg");
    expect(new Uint8Array(await (part as File).arrayBuffer())).toEqual(bytes);
  });

  it("deletes a Pending photo without adding mutation headers", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, undefined, 204);

    await expect(deletePendingWishPhoto(client, { photoId })).resolves.toEqual({
      ok: true,
      data: undefined,
    });

    expect(captured[0].method).toBe("DELETE");
    expect(captured[0].url).toBe(
      `https://backend.test/v1/wish-photos/${photoId}`,
    );
    expect(captured[0].headers.get("idempotency-key")).toBeNull();
  });
});

function testClient(captured: Request[], body: unknown, status: number) {
  return createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      captured.push(request);
      return new Response(status === 204 ? null : JSON.stringify(body), {
        status,
        headers: status === 204 ? undefined : { "Content-Type": "application/json" },
      });
    },
  });
}
