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

  // 登录页不显示 TabBar
  if (pathname === "/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass border-t border-white/30 dark:border-white/5">
        <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around">
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
                  flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl
                  transition-all duration-200 active:scale-90
                  min-w-[56px] select-none
                  ${active
                    ? "text-coral-400"
                    : "text-warm-400 hover:text-warm-600 dark:hover:text-warm-300"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${active ? "fill-coral-400/10" : ""}`}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span className={`text-[10px] font-medium ${active ? "" : ""}`}>
                  {tab.label}
                </span>
                {active && (
                  <div className="w-1 h-1 rounded-full bg-coral-400 -mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
