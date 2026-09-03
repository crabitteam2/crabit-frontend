import Link from "next/link";
export function FormQueryError({ backHref }: { backHref: string }) {
  return (
    <div className="flex min-h-svh flex-col gap-6 px-4 py-10">
      <p role="alert">
        입력 정보가 올바르지 않아요. 금액과 날짜를 다시 확인해주세요.
      </p>
      <Link className="text-fg-brand underline" href={backHref}>
        입력 화면으로 돌아가기
      </Link>
    </div>
  );
}
