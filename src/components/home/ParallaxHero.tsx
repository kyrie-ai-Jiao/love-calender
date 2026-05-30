"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ParallaxHeroProps {
  coverPhoto: string;
  children: ReactNode;
}

export default function ParallaxHero({ coverPhoto, children }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 视差滚动 + IntersectionObserver 优化
  useEffect(() => {
    if (!coverPhoto) return;

    const bg = bgRef.current;
    const container = containerRef.current;
    if (!bg || !container) return;

    let rafId = 0;
    let visible = true;

    // IntersectionObserver: 离屏时停止视差
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "200px" }
    );
    observer.observe(container);

    // 图片淡入（预加载）
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.src = coverPhoto;

    const handleScroll = () => {
      if (!visible) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const containerTop = container.offsetTop;
        const offset = (scrollY - containerTop) * 0.3;
        bg.style.transform = `translateY(${offset}px) scale(1.05)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
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
            {/* 照片 — 带淡入 */}
            <div
              ref={bgRef}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${coverPhoto})` }}
            />
            {/* 蒙版 + 模糊 */}
            <div className="absolute inset-0 backdrop-blur-[6px]"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.18) 100%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-coral-50 via-warm-100 to-blush-100 dark:from-coral-500/10 dark:via-warm-800 dark:to-blush-400/10" />
        )}
      </div>

      {/* 前景 */}
      <div className="relative z-10 px-0.5">{children}</div>
    </div>
  );
}
