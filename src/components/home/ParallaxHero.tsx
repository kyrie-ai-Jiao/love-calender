"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ParallaxHeroProps {
  /** base64 封面照片，空字符串则显示纯色背景 */
  coverPhoto: string;
  /** 前景内容 */
  children: ReactNode;
}

export default function ParallaxHero({ coverPhoto, children }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // 视差滚动
  useEffect(() => {
    if (!coverPhoto) return;

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!bgRef.current) return;
        const scrollY = window.scrollY;
        const container = containerRef.current;
        if (!container) return;
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        // 只在容器可见时计算
        if (scrollY + window.innerHeight < containerTop) return;
        if (scrollY > containerTop + containerHeight) return;
        // 背景慢速移动（0.3 倍速）
        const offset = (scrollY - containerTop) * 0.3;
        bgRef.current.style.transform = `translateY(${offset}px) scale(1.05)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [coverPhoto]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[24px] sm:rounded-[32px]"
    >
      {/* 背景层 */}
      <div className="absolute inset-0 -top-12 -bottom-12">
        {coverPhoto ? (
          <>
            {/* 照片 */}
            <div
              ref={bgRef}
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{ backgroundImage: `url(${coverPhoto})` }}
            />
            {/* 暗色渐变蒙版 + 轻微模糊 */}
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                background: `
                  linear-gradient(
                    180deg,
                    rgba(0,0,0,0.15) 0%,
                    rgba(0,0,0,0.05) 40%,
                    rgba(0,0,0,0.15) 100%
                  )
                `,
              }}
            />
          </>
        ) : (
          /* 无封面时显示渐变背景 */
          <div className="absolute inset-0 bg-gradient-to-br from-coral-50 via-warm-100 to-blush-100 dark:from-coral-500/10 dark:via-warm-800 dark:to-blush-400/10" />
        )}
      </div>

      {/* 前景内容 — 悬浮在背景之上 */}
      <div className="relative z-10 px-0.5">
        {children}
      </div>
    </div>
  );
}
