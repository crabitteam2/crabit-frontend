interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`bg-gray-10 inline-flex shrink-0 items-center justify-center rounded-[4px] px-3 text-[10px] leading-[17px] tracking-[-0.3px] text-white ${className}`}
    >
      {children}
    </span>
  );
}
