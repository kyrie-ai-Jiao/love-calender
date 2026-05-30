"use client";

import Link from "next/link";
import LoveDays from "@/components/home/LoveDays";
import Countdown from "@/components/home/Countdown";
import LoveQuote from "@/components/home/LoveQuote";
import ReminderList from "@/components/reminders/ReminderList";
import SurpriseCard from "@/components/surprises/SurpriseCard";
import ParallaxHero from "@/components/home/ParallaxHero";
import { useLoveData } from "@/hooks/useLoveData";

export default function Home() {
  const { coupleInfo } = useLoveData();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* ===== HERO区：景深背景 + 恋爱天数 ===== */}
      <div className="animate-in delay-100">
        <ParallaxHero coverPhoto={coupleInfo.coverPhoto}>
          <div className="px-2 py-6 sm:py-8">
            <LoveDays />
          </div>
          {/* 未设封面提示 */}
          {!coupleInfo.coverPhoto && coupleInfo.startDate && (
            <div className="px-2 pb-4 text-center">
              <Link
                href="/album"
                className="inline-flex items-center gap-1.5 text-xs text-warm-300 hover:text-coral-400 transition-colors"
              >
                设置封面照片，开启景深效果
              </Link>
            </div>
          )}
        </ParallaxHero>
      </div>

      {/* ===== 快捷区 ===== */}
      <QuickSection />

      {/* ===== 动态区 ===== */}
      <div className="space-y-4 animate-in delay-200">
        <ReminderList />
        <SurpriseCard />
        <Countdown />
        <LoveQuote />
      </div>

      <footer className="text-center pb-4 pt-2">
        <p className="text-xs text-warm-400">每一天都值得被记录</p>
      </footer>
    </div>
  );
}

function QuickSection() {
  return (
    <div className="animate-in delay-150">
      <p className="text-xs font-medium text-warm-400 mb-2 px-1">
        我们的日常
      </p>
      <div className="grid grid-cols-3 gap-3">
        <QuickCard href="/checkin" emoji="" label="打卡" color="coral" />
        <QuickCard href="/wishes" emoji="" label="愿望" color="mint" />
        <QuickCard href="/album" emoji="" label="相册" color="blush" />
      </div>
    </div>
  );
}

function QuickCard({
  href,
  emoji,
  label,
  color,
}: {
  href: string;
  emoji: string;
  label: string;
  color: "coral" | "mint" | "blush";
}) {
  const bgClass = {
    coral: "bg-coral-50 dark:bg-coral-500/10",
    mint: "bg-mint-400/10 dark:bg-mint-400/10",
    blush: "bg-blush-100/50 dark:bg-blush-400/10",
  };

  return (
    <Link
      href={href}
      className={`
        ${bgClass[color]}
        rounded-[20px] p-4 text-center
        transition-all duration-300
        hover:shadow-card hover:-translate-y-0.5
        active:scale-[0.97]
        no-underline block
      `}
    >
      <div className="text-2xl mb-1.5">{emoji}</div>
      <div className="text-xs font-medium text-warm-700 dark:text-warm-300">
        {label}
      </div>
    </Link>
  );
}
