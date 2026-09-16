const STORAGE_KEY = "crabit.adjust-receipt";

/** 한 위시에서 꺼낸 결과 한 줄입니다. */
export interface AdjustReceiptItem {
  readonly label: string;
  readonly amount: number;
}

/** 조정 화면이 완료 화면에 넘기는 꺼낸 내역입니다. */
export interface AdjustReceipt {
  readonly items: readonly AdjustReceiptItem[];
  /** 꺼낸 금액의 합입니다. */
  readonly total: number;
}

/** 완료 화면이 찾을 수 있게 꺼낸 내역을 보관합니다. */
export function putAdjustReceipt(receipt: AdjustReceipt) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
  } catch {
    // 저장소를 쓸 수 없으면 내역이 없는 것으로 보고 조정 화면으로 되돌아간다.
  }
}

/** 내역을 꺼내면서 지웁니다. 주소로 직접 들어왔으면 null입니다. */
export function takeAdjustReceipt(): AdjustReceipt | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    return isReceipt(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isReceipt(value: unknown): value is AdjustReceipt {
  if (typeof value !== "object" || value === null) return false;

  const receipt = value as Partial<AdjustReceipt>;
  return (
    typeof receipt.total === "number" &&
    Array.isArray(receipt.items) &&
    receipt.items.every(
      (item) =>
        typeof item?.label === "string" && typeof item?.amount === "number",
    )
  );
}
