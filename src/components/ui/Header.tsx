"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Sun, Moon, User, LogOut } from "lucide-react";
import { getTheme, setTheme } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, signOut } = useAuth();
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/30 dark:border-white/5">
      <div className="max-w-lg mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Heart
            className="w-5 h-5 text-coral-400 fill-coral-400"
            strokeWidth={1.5}
          />
          <h1 className="text-base font-semibold text-warm-800 dark:text-warm-200 tracking-tight">
            恋爱日历
          </h1>
        </Link>

        {/* 右侧：主题 + 用户 */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl hover:bg-warm-100/50 dark:hover:bg-white/5 text-warm-400 hover:text-warm-700 dark:hover:text-warm-300 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          {user ? (
            <button
              onClick={() => signOut()}
              className="p-2 rounded-2xl hover:bg-warm-100/50 dark:hover:bg-white/5 text-coral-400 transition-colors cursor-pointer"
              title={`已登录: ${user.email}`}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          ) : (
            <Link
              href="/login"
              className="p-2 rounded-2xl hover:bg-warm-100/50 dark:hover:bg-white/5 text-warm-400 hover:text-warm-600 transition-colors"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
