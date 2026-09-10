interface BadgeProps {
  children: React.ReactNode;
  /** 배경색과 글자색을 함께 지정합니다. 기본 색을 두지 않아 화면마다 어긋나지 않습니다. */
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[4px] px-3 text-[10px] leading-[17px] tracking-[-0.3px] ${className}`}
    >
      {children}
    </span>
  );
}
