export const MIN_SCALE = 1;
export const MAX_SCALE = 4;

/** 정사각 틀 안에서 사진을 어디에 얼마나 크게 놓을지 나타냅니다. */
export interface CropTransform {
  /** 틀을 가득 채우는 기본 배율에 곱할 확대 배율입니다. */
  scale: number;
  /** 틀 왼쪽 위를 기준으로 한 사진의 가로 위치입니다. */
  x: number;
  /** 틀 왼쪽 위를 기준으로 한 사진의 세로 위치입니다. */
  y: number;
}

/** 사진의 원본 크기입니다. */
export interface PhotoSize {
  width: number;
  height: number;
}

export const IDENTITY_TRANSFORM: CropTransform = { scale: 1, x: 0, y: 0 };

/** 정사각 틀을 여백 없이 채우는 최소 배율을 구합니다. */
export function coverScale(box: number, photo: PhotoSize) {
  if (photo.width <= 0 || photo.height <= 0) return 1;
  return Math.max(box / photo.width, box / photo.height);
}

/** 배율을 허용 범위로 자릅니다. */
export function clampScale(scale: number) {
  if (!Number.isFinite(scale)) return MIN_SCALE;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/** 사진이 틀을 항상 덮도록 한 축의 위치를 자릅니다. */
export function clampOffset(offset: number, displayed: number, box: number) {
  if (displayed <= box) return (box - displayed) / 2;
  return Math.min(0, Math.max(box - displayed, offset));
}

/** 화면에 그려질 사진의 크기를 구합니다. */
export function displayedSize(
  transform: CropTransform,
  box: number,
  photo: PhotoSize,
) {
  const base = coverScale(box, photo) * clampScale(transform.scale);
  return { width: photo.width * base, height: photo.height * base };
}

/** 배율과 위치를 모두 허용 범위로 자릅니다. */
export function clampTransform(
  transform: CropTransform,
  box: number,
  photo: PhotoSize,
): CropTransform {
  const scale = clampScale(transform.scale);
  const size = displayedSize({ ...transform, scale }, box, photo);
  return {
    scale,
    x: clampOffset(transform.x, size.width, box),
    y: clampOffset(transform.y, size.height, box),
  };
}

/** 사진을 끌어 옮긴 결과를 구합니다. */
export function panBy(
  transform: CropTransform,
  deltaX: number,
  deltaY: number,
  box: number,
  photo: PhotoSize,
): CropTransform {
  return clampTransform(
    {
      scale: transform.scale,
      x: transform.x + deltaX,
      y: transform.y + deltaY,
    },
    box,
    photo,
  );
}

/**
 * 손가락 사이 중심점을 제자리에 둔 채 배율을 바꿉니다.
 *
 * 중심점 아래에 있던 사진의 지점이 확대 후에도 같은 자리에 남습니다.
 */
export function zoomAt(
  transform: CropTransform,
  nextScale: number,
  focusX: number,
  focusY: number,
  box: number,
  photo: PhotoSize,
): CropTransform {
  const from = clampScale(transform.scale);
  const to = clampScale(nextScale);
  const ratio = to / from;
  return clampTransform(
    {
      scale: to,
      x: focusX - (focusX - transform.x) * ratio,
      y: focusY - (focusY - transform.y) * ratio,
    },
    box,
    photo,
  );
}

/** 잘라낼 원본 영역입니다. 캔버스 `drawImage`의 앞쪽 인자로 그대로 씁니다. */
export interface CropRect {
  sx: number;
  sy: number;
  size: number;
}

/** 화면에 보이는 정사각 영역이 원본 사진의 어느 부분인지 구합니다. */
export function toCropRect(
  transform: CropTransform,
  box: number,
  photo: PhotoSize,
): CropRect {
  const safe = clampTransform(transform, box, photo);
  const scale = coverScale(box, photo) * safe.scale;
  if (scale <= 0) {
    return { sx: 0, sy: 0, size: Math.min(photo.width, photo.height) };
  }
  return { sx: -safe.x / scale, sy: -safe.y / scale, size: box / scale };
}

/** 사진을 틀 한가운데에 맞춘 처음 상태를 구합니다. */
export function initialTransform(box: number, photo: PhotoSize): CropTransform {
  const size = displayedSize(IDENTITY_TRANSFORM, box, photo);
  return clampTransform(
    { scale: 1, x: (box - size.width) / 2, y: (box - size.height) / 2 },
    box,
    photo,
  );
}
