"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Pin, CalendarCheck, Image as ImageIcon, Settings } from "lucide-react";

const TABS = [
  { path: "/", label: "首页", icon: Heart },
  { path: "/timeline", label: "大事记", icon: Pin },
  { path: "/checkin", label: "打卡", icon: CalendarCheck },
  { path: "/album", label: "相册", icon: ImageIcon },
  { path: "/settings", label: "设置", icon: Settings },
] as const;

export default function TabBar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="glass border-t border-white/30 dark:border-white/5">
        <div className="max-w-lg mx-auto px-2 py-1 flex items-center justify-around">
          {TABS.map((tab) => {
            const active = tab.path === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.path);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`
                  relative flex flex-col items-center gap-0.5 py-1.5 px-3
                  transition-all duration-300 ease-out
                  active:scale-95 min-w-[56px] select-none rounded-2xl
                  ${active
                    ? "text-coral-400"
                    : "text-warm-400 hover:text-warm-600 dark:hover:text-warm-300"
                  }
                `}
              >
                {/* 激活态背景 */}
                {active && (
                  <div className="absolute inset-0 bg-coral-50 dark:bg-coral-500/10 rounded-2xl animate-fade" />
                )}
                <Icon
                  className={`relative w-5 h-5 transition-all duration-300 ${
                    active ? "fill-coral-400/20 scale-105" : ""
                  }`}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span className="relative text-[10px] font-medium">
                  {tab.label}
                </span>
                {/* 激活指示点 — 带过渡 */}
                <div
                  className={`w-1 h-1 rounded-full bg-coral-400 transition-all duration-300 ${
                    active ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
