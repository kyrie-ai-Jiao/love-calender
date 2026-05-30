"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Calendar, Settings } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLoveData } from "@/hooks/useLoveData";
import { daysSinceStart, formatChineseDate } from "@/lib/dateUtils";
import { CoupleInfo } from "@/types";

export default function LoveDays() {
  const { coupleInfo, updateCoupleInfo, hasSetup, loaded } = useLoveData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    partner1Name: coupleInfo.partner1Name,
    partner2Name: coupleInfo.partner2Name,
    startDate: coupleInfo.startDate,
  });

  if (!loaded) {
    return (
      <Card className="text-center py-10 sm:py-12 bg-gradient-to-br from-love-50 to-cream-100 animate-pulse">
        <div className="h-5 w-28 bg-love-200 rounded mx-auto mb-4" />
        <div className="h-9 w-16 bg-love-200 rounded mx-auto" />
      </Card>
    );
  }

  const days = hasSetup ? daysSinceStart(coupleInfo.startDate) : 0;

  const SPECIAL_DAY_MESSAGES: Record<number, string> = {
    100: "在一起100天啦",
    200: "200天纪念日",
    300: "300天啦",
    365: "一周年快乐",
    520: "520天",
    999: "长长久久",
    1000: "1000天里程碑",
    1314: "一生一世 (1314天)",
  };
  const specialMessage = SPECIAL_DAY_MESSAGES[days];
  const isSpecialDay = !!specialMessage;

  const handleSave = () => {
    const newInfo: CoupleInfo = {
      ...coupleInfo,
      partner1Name: formData.partner1Name,
      partner2Name: formData.partner2Name,
      startDate: formData.startDate,
    };
    updateCoupleInfo(newInfo);
    setShowForm(false);
  };

  return (
    <>
      <Card className="text-center py-6 sm:py-10 bg-gradient-to-br from-love-50 via-cream-100 to-love-50 overflow-hidden relative">
        {/* 装饰性背景爱心 */}
        <Heart className="absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 text-love-100/40 -rotate-12 pointer-events-none" />
        <Heart className="absolute -bottom-6 -left-6 w-16 sm:w-20 h-16 sm:h-20 text-love-100/30 rotate-12 pointer-events-none" />

        {hasSetup ? (
          <div className="relative z-10 space-y-2 sm:space-y-3">
            <p className="text-sm text-love-400 font-medium tracking-wide">
              {coupleInfo.partner1Name} ♥ {coupleInfo.partner2Name}
            </p>
            <p className="text-xs text-gray-400">
              从 {formatChineseDate(coupleInfo.startDate)} 开始
            </p>

            <div className="py-1 sm:py-2">
              <p className="text-xs sm:text-sm text-love-400/70">在一起的第</p>
              <p
                className={`text-5xl sm:text-6xl font-bold my-1 tracking-tight transition-all duration-500 ${
                  isSpecialDay ? "text-love-600 scale-110" : "text-love-600"
                }`}
              >
                <Heart className="inline w-7 h-7 sm:w-9 sm:h-9 fill-love-400 text-love-400 mr-1 -mt-2" />
                {days}
              </p>
              <p className="text-xs sm:text-sm text-love-400/70">天</p>
            </div>

            {specialMessage && (
              <div className="bg-love-100/60 rounded-2xl py-2 px-4 inline-block animate-in fade-in zoom-in duration-300">
                <p className="text-love-600 text-sm font-medium">
                  {specialMessage}
                </p>
              </div>
            )}

            <Link
              href="/settings"
              className="mt-2 text-xs text-gray-400 hover:text-love-500 transition-colors inline-flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              修改信息
            </Link>
          </div>
        ) : (
          <div className="relative z-10 space-y-3">
            <Heart className="w-10 h-10 text-love-300 mx-auto fill-love-200" />
            <p className="text-gray-400 text-sm">还没有设置恋爱信息</p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="text-sm"
            >
              <Calendar className="w-4 h-4" />
              开始记录
            </Button>
          </div>
        )}
      </Card>

      {/* 设置弹窗 — 移动端全屏 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6 w-full sm:max-w-sm space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                设置恋爱信息
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  你的名字
                </label>
                <input
                  type="text"
                  value={formData.partner1Name}
                  onChange={(e) =>
                    setFormData({ ...formData, partner1Name: e.target.value })
                  }
                  placeholder="你的昵称"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  对方的名字
                </label>
                <input
                  type="text"
                  value={formData.partner2Name}
                  onChange={(e) =>
                    setFormData({ ...formData, partner2Name: e.target.value })
                  }
                  placeholder="对方的昵称"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  在一起的日期
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
