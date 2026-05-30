"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Calendar, Settings } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLoveData } from "@/hooks/useLoveData";
import { daysSinceStart, formatChineseDate } from "@/lib/dateUtils";
import { CoupleInfo } from "@/types";

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
      <Card className="text-center py-12 sm:py-16 animate-pulse">
        <div className="h-4 w-24 bg-warm-200 rounded mx-auto mb-4" />
        <div className="h-12 w-24 bg-warm-200 rounded mx-auto" />
      </Card>
    );
  }

  const days = hasSetup ? daysSinceStart(coupleInfo.startDate) : 0;
  const specialMessage = SPECIAL_DAY_MESSAGES[days];

  const handleSave = () => {
    updateCoupleInfo({
      ...coupleInfo,
      partner1Name: formData.partner1Name,
      partner2Name: formData.partner2Name,
      startDate: formData.startDate,
    });
    setShowForm(false);
  };

  return (
    <>
      <Card
        tinted
        className="text-center py-8 sm:py-12 overflow-hidden relative"
      >
        {/* 装饰 */}
        <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-coral-100/40 blur-xl pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-blush-300/30 blur-lg pointer-events-none" />

        {hasSetup ? (
          <div className="relative space-y-3">
            {/* 双方名字 */}
            <p className="text-sm text-coral-400 font-medium tracking-wide">
              {coupleInfo.partner1Name} & {coupleInfo.partner2Name}
            </p>
            <p className="text-xs text-warm-400">
              从 {formatChineseDate(coupleInfo.startDate)} 开始
            </p>

            {/* 天数 */}
            <div className="py-2">
              <p className="text-xs text-warm-400">在一起的第</p>
              <p
                className={`text-6xl sm:text-7xl font-bold my-2 tracking-tight text-coral-400 transition-all duration-500 ${
                  specialMessage ? "animate-bounce-soft" : ""
                }`}
              >
                {days}
              </p>
              <p className="text-sm text-warm-400">天</p>
            </div>

            {/* 特殊日 */}
            {specialMessage && (
              <div className="inline-block bg-coral-100/60 rounded-2xl py-2 px-5 animate-fade">
                <p className="text-coral-600 text-sm font-semibold">
                  {specialMessage}
                </p>
              </div>
            )}

            <Link
              href="/settings"
              className="mt-2 inline-flex items-center gap-1 text-xs text-warm-400 hover:text-coral-400 transition-colors"
            >
              <Settings className="w-3 h-3" strokeWidth={1.5} />
              修改信息
            </Link>
          </div>
        ) : (
          <div className="relative space-y-4">
            <Heart
              className="w-12 h-12 text-coral-200 mx-auto"
              strokeWidth={1}
              fill="currentColor"
            />
            <p className="text-warm-400 text-sm">还没有设置恋爱信息</p>
            <Button onClick={() => setShowForm(true)} variant="primary" size="sm">
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              开始记录
            </Button>
          </div>
        )}
      </Card>

      {/* 弹窗 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-warm-800/20 backdrop-blur-sm">
          <div className="bg-warm-50 rounded-t-[28px] sm:rounded-[28px] shadow-modal p-6 w-full sm:max-w-sm space-y-4 animate-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-warm-800">
                设置恋爱信息
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-warm-400 hover:text-warm-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <InputRow
                label="你的名字"
                value={formData.partner1Name}
                onChange={(v) =>
                  setFormData({ ...formData, partner1Name: v })
                }
                placeholder="你的昵称"
              />
              <InputRow
                label="对方的名字"
                value={formData.partner2Name}
                onChange={(v) =>
                  setFormData({ ...formData, partner2Name: v })
                }
                placeholder="对方的昵称"
              />
              <InputRow
                label="在一起的日期"
                value={formData.startDate}
                onChange={(v) =>
                  setFormData({ ...formData, startDate: v })
                }
                type="date"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InputRow({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-warm-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm bg-warm-50/50 focus:outline-none focus:border-coral-300 transition-colors"
      />
    </div>
  );
}
