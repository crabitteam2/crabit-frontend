import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { hasUnresolvedShortage } from "./load-account";

/**
 * 카드 잔액이 모자라는 동안에는 위시 화면을 열지 않고 잔액 조정으로 보냅니다.
 *
 * 위시리스트 탭에서 이미 잠기는 구간이며 주소로 들어오는 경우까지 여기서 막습니다.
 */
export default async function WishesLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (await hasUnresolvedShortage()) redirect("/adjust");

  return children;
}
