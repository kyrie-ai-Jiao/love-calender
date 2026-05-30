"use client";

import { Heart, Cake, Star, Sparkles, X, Flower2, Gift, Coffee, PartyPopper } from "lucide-react";
import { getSurpriseSet } from "@/data/surprises";
import { daysUntil } from "@/lib/dateUtils";

interface EventInfo {
  id: string;
  name: string;
  daysLeft: number;
  icon: "anniversary" | "birthday" | "holiday";
  emoji?: string;
  targetMonth: number;
  targetDay: number;
}

interface EventDetailProps {
  event: EventInfo;
  onClose: () => void;
}

const ICON_MAP = {
  anniversary: <Heart className="w-5 h-5 text-coral-400 fill-coral-400" />,
  birthday: <Cake className="w-5 h-5 text-coral-400" />,
  holiday: <Star className="w-5 h-5 text-coral-400 fill-coral-400" />,
};

const ICON_LABEL = {
  anniversary: "纪念日",
  birthday: "生日",
  holiday: "节日",
};

const SUGGESTION_ICONS = {
  flower: <Flower2 className="w-3.5 h-3.5" />,
  gift: <Gift className="w-3.5 h-3.5" />,
  date: <Coffee className="w-3.5 h-3.5" />,
  surprise: <PartyPopper className="w-3.5 h-3.5" />,
};

const SUGGESTION_LABELS = {
  flower: "送花",
  gift: "礼物",
  date: "约会",
  surprise: "惊喜",
};

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const surpriseSet = getSurpriseSet(event.name);

  // 计算实际日期
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), event.targetMonth - 1, event.targetDay);
  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const dateStr = `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][targetDate.getDay()];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6 w-full sm:max-w-sm max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* 关闭按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ICON_MAP[event.icon]}
            <span className="text-xs text-warm-400 font-medium">{ICON_LABEL[event.icon]}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-warm-100 text-warm-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 倒计时核心 */}
        <div className="text-center py-3">
          <p className="text-sm text-warm-400 mb-2">
            {event.emoji && <span className="mr-1">{event.emoji}</span>}
            {event.name}
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl sm:text-6xl font-bold text-coral-400">
              {event.daysLeft}
            </span>
            <span className="text-lg text-coral-400">
              {event.daysLeft === 0 ? "今天!" : "天"}
            </span>
          </div>
          <p className="text-xs text-warm-400 mt-2">
            {dateStr} 星期{weekday}
          </p>
        </div>

        {/* 状态提示 */}
        <div className={`text-center py-2 rounded-xl text-sm font-medium ${
          event.daysLeft === 0
            ? "bg-coral-100 text-coral-600"
            : event.daysLeft <= 7
            ? "bg-amber-50 text-apricot-500"
            : "bg-warm-50 text-warm-500"
        }`}>
          {event.daysLeft === 0
            ? "就是今天！"
            : event.daysLeft <= 7
            ? `只剩 ${event.daysLeft} 天了，准备好了吗？`
            : `还有 ${event.daysLeft} 天，可以慢慢准备`}
        </div>

        {/* 惊喜建议 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-coral-400" />
            <h3 className="text-sm font-semibold text-warm-800">灵感建议</h3>
          </div>
          <div className="space-y-2">
            {surpriseSet.suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 bg-coral-50/50 rounded-xl"
              >
                <span className="mt-0.5 flex-shrink-0 text-coral-400">
                  {SUGGESTION_ICONS[s.category]}
                </span>
                <div>
                  <p className="text-xs font-medium text-coral-400 mb-0.5">
                    {SUGGESTION_LABELS[s.category]}
                  </p>
                  <p className="text-sm text-warm-700">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
