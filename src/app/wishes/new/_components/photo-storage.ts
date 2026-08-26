const PHOTO_KEY = "crabit:new-wish-photo";

/** 잘라낸 목표 사진을 생성 완료 화면으로 넘기기 위해 보관합니다. */
export function saveNewWishPhoto(dataUrl: string) {
  try {
    sessionStorage.setItem(PHOTO_KEY, dataUrl);
  } catch {
    return;
  }
}

/** 보관해 둔 목표 사진을 읽습니다. 없으면 `null`입니다. */
export function readNewWishPhoto(): string | null {
  try {
    return sessionStorage.getItem(PHOTO_KEY);
  } catch {
    return null;
  }
}

/** 보관해 둔 목표 사진을 지웁니다. */
export function clearNewWishPhoto() {
  try {
    sessionStorage.removeItem(PHOTO_KEY);
  } catch {
    return;
  }
}
