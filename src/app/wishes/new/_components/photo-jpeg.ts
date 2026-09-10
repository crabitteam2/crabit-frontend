import type { CropRect } from "./photo-crop";

/** 백엔드 사진 계약이 요구하는 정사각 JPEG 한 변의 픽셀 수입니다. */
export const WISH_PHOTO_SIZE = 1080;

/** 화면에서 고른 crop을 정확히 1080x1080 JPEG 파일로 렌더링합니다. */
export async function renderWishPhotoJpeg(
  image: CanvasImageSource,
  crop: CropRect,
): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = WISH_PHOTO_SIZE;
  canvas.height = WISH_PHOTO_SIZE;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("Photo canvas is unavailable");
  context.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.size,
    crop.size,
    0,
    0,
    WISH_PHOTO_SIZE,
    WISH_PHOTO_SIZE,
  );
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value === null
          ? reject(new Error("JPEG encoding failed"))
          : resolve(value),
      "image/jpeg",
      0.9,
    ),
  );
  return new File([blob], "wish-photo.jpg", { type: "image/jpeg" });
}

/** 원본 가운데의 가장 큰 정사각 영역을 계산합니다. */
export function centeredSquareCrop(width: number, height: number): CropRect {
  const size = Math.min(width, height);
  return { sx: (width - size) / 2, sy: (height - size) / 2, size };
}

/** 같은 JPEG 바이트 재시도를 안정적으로 식별하는 SHA-256 서명입니다. */
export async function digestWishPhotoFile(file: File) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer(),
  );
  return [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}
