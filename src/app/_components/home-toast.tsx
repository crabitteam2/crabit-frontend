"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/ui/toast";

const MESSAGES: Record<string, string> = {
  representative: "설정이 저장되었습니다.",
};

interface HomeToastProps {
  toastKey: string | null;
  closeHref: string;
}

export function HomeToast({ toastKey, closeHref }: HomeToastProps) {
  const router = useRouter();
  const message = toastKey === null ? undefined : MESSAGES[toastKey];

  if (message === undefined) return null;

  return <Toast message={message} onClose={() => router.replace(closeHref)} />;
}
