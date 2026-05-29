import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
}

/**
 * 按钮组件
 * variant: primary(粉色填充) | outline(粉色边框) | ghost(透明)
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-medium text-sm transition-all duration-200 active:scale-95 cursor-pointer";

  const variantClass = {
    primary:
      "bg-love-400 text-white hover:bg-love-500 shadow-md shadow-love-200/50",
    outline:
      "border-2 border-love-300 text-love-600 hover:bg-love-50",
    ghost:
      "text-gray-500 hover:text-love-500 hover:bg-love-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
