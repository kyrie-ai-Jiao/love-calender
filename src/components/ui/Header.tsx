"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Settings } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-love-100/50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-love-400 fill-love-400" />
          <h1 className="text-base sm:text-lg font-semibold text-love-700 tracking-wide">
            恋爱日历
          </h1>
        </Link>

        {pathname !== "/settings" && (
          <Link
            href="/settings"
            className="p-2 rounded-xl hover:bg-love-50 text-gray-400 hover:text-love-500 transition-colors"
            aria-label="设置"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
