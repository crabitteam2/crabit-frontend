"use client";

import { useParams } from "next/navigation";
import { ErrorScreen } from "@/app/_components/error-screen";

interface FundFlowErrorProps {
  /** 헤더에 쓸 흐름 이름입니다. */
  title: string;
  reset: () => void;
}

/** 돈 넣기와 돈 꺼내기 흐름이 조회에 실패했을 때 보여주는 화면입니다. */
export function FundFlowError({ title, reset }: FundFlowErrorProps) {
  const params = useParams<{ wishId: string }>();

  return (
    <ErrorScreen
      title={title}
      backHref={`/wishes/${params.wishId}`}
      message="화면을 불러오지 못했어요"
      reset={reset}
    />
  );
}
