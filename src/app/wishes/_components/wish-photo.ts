import type { components } from "@/lib/http/generated/crabit-backend";

/** 같은 사진을 360, 720, 1080 정사각으로 담은 짧은 주소 세 벌입니다. */
export type WishPhotoUrls = components["schemas"]["WishPhotoVariants"];

const VARIANTS = [
  { width: 360, key: "small" },
  { width: 720, key: "medium" },
  { width: 1080, key: "large" },
] as const satisfies readonly { width: number; key: keyof WishPhotoUrls }[];

/** 고해상도 화면에 맞춰 표시 크기의 세 배를 채울 사진을 고릅니다. */
const DENSITY = 3;

/** 사진을 붙인 위시 계약에서 주소 세 벌만 꺼냅니다. */
export function toWishPhotoUrls(
  photo: components["schemas"]["WishPhoto"] | null | undefined,
): WishPhotoUrls | undefined {
  return photo == null ? undefined : photo.variants;
}

/** 표시 크기를 채우는 가장 작은 사진을 고릅니다. */
export function pickWishPhotoUrl(photo: WishPhotoUrls, displaySize: number) {
  const needed = displaySize * DENSITY;
  const variant = VARIANTS.find((candidate) => candidate.width >= needed);

  return photo[variant?.key ?? "large"];
}
