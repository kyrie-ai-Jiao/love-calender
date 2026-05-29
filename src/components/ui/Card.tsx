import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * 温馨卡片组件
 * 移动端内边距较小(p-4)，桌面端较大(sm:p-6)
 */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg shadow-love-100/30 border border-white/60 p-4 sm:p-6 transition-shadow hover:shadow-lg sm:hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
