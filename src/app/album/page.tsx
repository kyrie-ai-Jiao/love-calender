"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Trash2,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLoveData } from "@/hooks/useLoveData";
import { compressImage } from "@/lib/imageUtils";
import { Photo } from "@/types";

export default function AlbumPage() {
  const router = useRouter();
  const { coupleInfo, updateCoupleInfo, hasSetup } = useLoveData();
  const [uploading, setUploading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const photos = coupleInfo.photos || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const today = new Date().toISOString().split("T")[0];

      const newPhoto: Photo = {
        id: Date.now().toString(),
        data: compressed,
        caption: "",
        date: today,
      };

      updateCoupleInfo({
        ...coupleInfo,
        photos: [...photos, newPhoto],
      });
    } catch {
      alert("图片处理失败，请重试");
    }
    setUploading(false);

    // 清空 input 以便可以重复选同一文件
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      photos: photos.filter((p) => p.id !== id),
      // 如果删的是封面，清除封面
      coverPhoto: coupleInfo.coverPhoto === photos.find(p => p.id === id)?.data
        ? ""
        : coupleInfo.coverPhoto,
    });
    if (previewId === id) setPreviewId(null);
  };

  const setAsCover = (dataUrl: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      coverPhoto: coupleInfo.coverPhoto === dataUrl ? "" : dataUrl,
    });
  };

  const handleCaptionChange = (id: string, caption: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      photos: photos.map((p) => (p.id === id ? { ...p, caption } : p)),
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-coral-50 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-warm-800">
            {photos.length > 0 ? `我们的相册 (${photos.length})` : "我们的相册"}
          </h1>
        </div>
      </div>

      {!hasSetup ? (
        <Card className="text-center py-12">
          <ImageIcon className="w-8 h-8 text-coral-100 mx-auto mb-3" />
          <p className="text-sm text-warm-400">请先在设置中填写恋爱信息</p>
        </Card>
      ) : photos.length === 0 ? (
        /* 空相册引导 */
        <Card className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-coral-100 mx-auto mb-4" />
          <p className="text-warm-400 text-sm mb-2">相册还是空的</p>
          <p className="text-xs text-warm-300 mb-4">记录你们的每一个美好瞬间</p>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral-400 text-white rounded-2xl text-sm font-medium cursor-pointer hover:bg-coral-500 transition-colors shadow-md shadow-love-200/50">
            <ImagePlus className="w-4 h-4" />
            上传第一张照片
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </Card>
      ) : (
        <>
          {/* 上传按钮 */}
          <label
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
              uploading
                ? "bg-warm-200 text-warm-400"
                : "bg-coral-50 text-coral-400 hover:bg-coral-100"
            }`}
          >
            <ImagePlus className="w-4 h-4" />
            {uploading ? "处理中..." : "上传照片"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* 照片网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => {
              const isPreview = previewId === photo.id;
              return (
                <div key={photo.id}>
                  {/* 缩略图 */}
                  <div
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setPreviewId(isPreview ? null : photo.id)}
                  >
                    <img
                      src={photo.data}
                      alt={photo.caption || "照片"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* 封面标记 */}
                    {coupleInfo.coverPhoto === photo.data && (
                      <div className="absolute top-2 left-2 p-1 bg-coral-400/80 rounded-full">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                    {/* 操作按钮 */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsCover(photo.data);
                        }}
                        className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                          coupleInfo.coverPhoto === photo.data
                            ? "bg-coral-400/80"
                            : "bg-black/40 hover:bg-coral-400/60"
                        }`}
                        title={coupleInfo.coverPhoto === photo.data ? "取消封面" : "设为封面"}
                      >
                        <Star className={`w-3.5 h-3.5 text-white ${coupleInfo.coverPhoto === photo.data ? "fill-white" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        className="p-1.5 bg-black/40 rounded-full hover:bg-red-500/60 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* 展开预览 */}
                  {isPreview && (
                    <div className="mt-2 space-y-2">
                      <div className="rounded-2xl overflow-hidden">
                        <img
                          src={photo.data}
                          alt={photo.caption || "照片"}
                          className="w-full"
                        />
                      </div>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) =>
                          handleCaptionChange(photo.id, e.target.value)
                        }
                        placeholder="写一句说明..."
                        className="w-full text-xs border border-warm-200 rounded-xl px-3 py-2 focus:outline-none focus:border-coral-300 transition-colors"
                      />
                      <p className="text-xs text-warm-400">{photo.date}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <p className="text-xs text-warm-400 text-center">
            照片经过压缩存储在浏览器中，不会上传到任何服务器
          </p>
        </>
      )}
    </div>
  );
}
