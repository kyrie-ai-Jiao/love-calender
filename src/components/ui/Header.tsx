"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Settings, Image as ImageIcon, ListTodo, CalendarCheck, Pin, Sun, Moon, User, LogOut } from "lucide-react";
import { getTheme, setTheme } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
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
    <header className="sticky top-0 z-50 bg-cream-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-love-100/50 dark:border-gray-800">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-love-400 fill-love-400" />
          <h1 className="text-base sm:text-lg font-semibold text-love-700 dark:text-love-300 tracking-wide">
            恋爱日历
          </h1>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors cursor-pointer"
            aria-label={theme === "dark" ? "切换亮色" : "切换暗色"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* 登录/用户 */}
          {user ? (
            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-love-400 transition-colors cursor-pointer"
              aria-label="退出登录"
              title={`已登录: ${user.email}`}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 transition-colors cursor-pointer"
              aria-label="登录"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {pathname !== "/timeline" && (
            <Link
              href="/timeline"
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors"
              aria-label="大事记"
            >
              <Pin className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          {pathname !== "/checkin" && (
            <Link
              href="/checkin"
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors"
              aria-label="打卡"
            >
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          {pathname !== "/wishes" && (
            <Link
              href="/wishes"
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors"
              aria-label="愿望清单"
            >
              <ListTodo className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          {pathname !== "/album" && (
            <Link
              href="/album"
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors"
              aria-label="相册"
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          {pathname !== "/settings" && (
            <Link
              href="/settings"
              className="p-2 rounded-xl hover:bg-love-50 dark:hover:bg-gray-800 text-gray-400 hover:text-love-500 dark:hover:text-love-400 transition-colors"
              aria-label="设置"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
