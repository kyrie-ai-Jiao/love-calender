import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** 是否使用粉色玻璃效果 */
  tinted?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
}

export default function Card({
  children,
  className = "",
  tinted = false,
  clickable = false,
}: CardProps) {
  return (
    <div
      className={`
        ${tinted ? "glass-tinted" : "glass"}
        rounded-[20px] sm:rounded-[24px]
        shadow-soft
        p-4 sm:p-5
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        ${clickable ? "cursor-pointer hover:shadow-lift active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2" : ""}
        ${className}
      `}
      style={{ isolation: "isolate" }}
    >
      {children}
    </div>
  );
}
