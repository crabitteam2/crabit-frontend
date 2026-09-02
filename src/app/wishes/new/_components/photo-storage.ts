import type { components } from "@/lib/http/generated/crabit-backend";

const PHOTO_STATE_PREFIX = "crabit:wish-photo-upload:";
const LEGACY_BASE64_PHOTO_KEY = "crabit:new-wish-photo";
const volatileStates = new Map<string, WishPhotoUploadState>();

interface StableKey {
  readonly signature: string;
  readonly value: string;
}

/** 브라우저 탭 안에서만 유지하는 사진 업로드 흐름 상태입니다. */
export interface WishPhotoUploadState {
  /** 재시도할 수 있는 이미 업로드된 Pending 사진입니다. */
  readonly pendingPhoto: components["schemas"]["WishPhoto"] | null;
  /** 같은 JPEG 바이트 재시도에 재사용할 업로드 키입니다. */
  readonly uploadKey: StableKey | null;
  /** 같은 create 또는 patch 본문 재시도에 재사용할 mutation 키입니다. */
  readonly mutationKey: StableKey | null;
}

const EMPTY_STATE: WishPhotoUploadState = {
  pendingPhoto: null,
  uploadKey: null,
  mutationKey: null,
};

/** 저장된 상태를 읽되 손상되거나 과거 형식이면 빈 상태로 되돌립니다. */
export function readWishPhotoUploadState(scope: string): WishPhotoUploadState {
  try {
    sessionStorage.removeItem(LEGACY_BASE64_PHOTO_KEY);
    const value: unknown = JSON.parse(
      sessionStorage.getItem(storageKey(scope)) ?? "null",
    );
    if (isState(value)) {
      volatileStates.set(scope, value);
      return value;
    }
    return volatileStates.get(scope) ?? EMPTY_STATE;
  } catch {
    return volatileStates.get(scope) ?? EMPTY_STATE;
  }
}

/** 처리 완료된 Pending 사진 identity와 짧은 미리보기 URL을 저장합니다. */
export function savePendingWishPhoto(
  scope: string,
  pendingPhoto: components["schemas"]["WishPhoto"],
) {
  writeState(scope, { ...readWishPhotoUploadState(scope), pendingPhoto });
}

/** Pending 사진과 해당 업로드 키만 지웁니다. mutation 재시도 키는 유지합니다. */
export function clearPendingWishPhoto(scope: string) {
  const state = readWishPhotoUploadState(scope);
  writeState(scope, { ...state, pendingPhoto: null, uploadKey: null });
}

/** 완료된 생성·수정 흐름의 로컬 상태를 모두 지웁니다. */
export function clearWishPhotoUploadState(scope: string) {
  volatileStates.delete(scope);
  try {
    sessionStorage.removeItem(storageKey(scope));
  } catch {
    return;
  }
}

/** 같은 서명에는 같은 키를, 달라진 바이트나 본문에는 새 키를 돌려줍니다. */
export function stableWishPhotoKey(
  scope: string,
  kind: "upload" | "mutation",
  signature: string,
) {
  const state = readWishPhotoUploadState(scope);
  const field = kind === "upload" ? "uploadKey" : "mutationKey";
  const current = state[field];
  if (current?.signature === signature) return current.value;

  const next = { signature, value: crypto.randomUUID() };
  writeState(scope, { ...state, [field]: next });
  return next.value;
}

function storageKey(scope: string) {
  return `${PHOTO_STATE_PREFIX}${scope}`;
}

function writeState(scope: string, state: WishPhotoUploadState) {
  volatileStates.set(scope, state);
  try {
    sessionStorage.setItem(storageKey(scope), JSON.stringify(state));
  } catch {
    return;
  }
}

function isState(value: unknown): value is WishPhotoUploadState {
  if (!isExactObject(value, ["mutationKey", "pendingPhoto", "uploadKey"])) {
    return false;
  }
  return (
    isStableKey(value.uploadKey) &&
    isStableKey(value.mutationKey) &&
    isWishPhoto(value.pendingPhoto)
  );
}

function isStableKey(value: unknown): value is StableKey | null {
  return (
    value === null ||
    (isExactObject(value, ["signature", "value"]) &&
      typeof value.signature === "string" &&
      typeof value.value === "string" &&
      value.value.length > 0)
  );
}

function isWishPhoto(
  value: unknown,
): value is components["schemas"]["WishPhoto"] | null {
  return (
    value === null ||
    (isExactObject(value, ["expiresAt", "id", "variants"]) &&
      typeof value.id === "string" &&
      typeof value.expiresAt === "string" &&
      isExactObject(value.variants, ["large", "medium", "small"]) &&
      typeof value.variants.large === "string" &&
      typeof value.variants.medium === "string" &&
      typeof value.variants.small === "string")
  );
}

function isExactObject(
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    JSON.stringify(Object.keys(value).sort()) ===
      JSON.stringify([...keys].sort())
  );
}
