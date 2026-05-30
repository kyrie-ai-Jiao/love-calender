"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";

export default function PhotoMemory() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  const randomPhoto = useMemo(() => {
    const photos = coupleInfo.photos;
    if (!photos || photos.length === 0) return null;
    return photos[Math.floor(Math.random() * photos.length)];
  }, [coupleInfo.photos]);

  if (!loaded || !hasSetup) return null;

  if (!randomPhoto) {
    // 还没有照片 — 引导去相册
    return (
      <Link href="/album" className="block">
        <Card className="text-center py-6 bg-gradient-to-br from-warm-100/50 to-coral-50/30 border-coral-100/50 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center gap-2">
            <ImageIcon className="w-4 h-4 text-coral-200" />
            <p className="text-sm text-coral-400 font-medium">
              上传第一张照片，记录你们的瞬间
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  // 有照片 — 展示随机一张
  return (
    <Link href="/album" className="block">
      <Card className="overflow-hidden p-0 bg-gradient-to-br from-warm-50 to-coral-50/20 border-coral-100/50 hover:shadow-lg transition-shadow">
        <div className="flex items-stretch">
          {/* 左侧缩略图 */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <img
              src={randomPhoto.data}
              alt={randomPhoto.caption || "回忆"}
              className="w-full h-full object-cover"
            />
          </div>
          {/* 右侧文字 */}
          <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0">
            <p className="text-xs text-coral-400 font-medium mb-1">
              回忆瞬间
            </p>
            <p className="text-sm text-warm-800 truncate">
              {randomPhoto.caption || "那些值得记住的日子"}
            </p>
            <p className="text-xs text-warm-400 mt-1">
              点击查看全部 · 共 {coupleInfo.photos.length} 张
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
