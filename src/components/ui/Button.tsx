import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  size = "md",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.97] select-none";

  const sizeClass = {
    sm: "rounded-[14px] px-4 py-2 text-xs",
    md: "rounded-[16px] px-5 py-2.5 text-sm",
  };

  const variantClass = {
    primary:
      "bg-coral-400 text-white hover:bg-coral-500 shadow-card disabled:opacity-40 active:shadow-soft",
    outline:
      "border-2 border-coral-200 text-coral-600 hover:bg-coral-50 active:bg-coral-100 disabled:opacity-40",
    ghost:
      "text-warm-500 hover:text-coral-500 hover:bg-coral-50/50 active:bg-coral-50 disabled:opacity-40",
  };

  const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeClass[size]} ${variantClass[variant]} ${cursorClass} ${className}`}
    >
      {children}
    </button>
  );
}
