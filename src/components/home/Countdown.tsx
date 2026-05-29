"use client";

import { useMemo } from "react";
import { Clock, Gift, Heart, Cake, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";
import { daysUntil, formatDateStr } from "@/lib/dateUtils";
import { HOLIDAYS } from "@/data/holidays";

interface CountdownEvent {
  id: string;
  name: string;
  daysLeft: number;
  icon: "anniversary" | "birthday" | "holiday";
  emoji?: string;
}

export default function Countdown() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  // 计算所有即将到来的事件
  const upcomingEvents = useMemo((): CountdownEvent[] => {
    if (!hasSetup) return [];

    const events: CountdownEvent[] = [];
    const start = new Date(coupleInfo.startDate);
    const today = new Date();
    const todayStr = formatDateStr(today);

    // 1. 恋爱周年纪念日
    const annMonth = start.getMonth() + 1;
    const annDay = start.getDate();
    const annDaysLeft = daysUntil(annMonth, annDay);

    // 计算这是第几周年
    const years =
      today.getFullYear() -
      start.getFullYear() -
      (today.getMonth() < start.getMonth() ||
      (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())
        ? 1
        : 0);

    events.push({
      id: "anniversary",
      name: `${years + 1}周年纪念日`,
      daysLeft: annDaysLeft,
      icon: "anniversary",
    });

    // 2. 双方生日
    if (coupleInfo.partner1Birthday) {
      const [y, m, d] = coupleInfo.partner1Birthday.split("-").map(Number);
      events.push({
        id: "partner1-birthday",
        name: `${coupleInfo.partner1Name || "你"}的生日`,
        daysLeft: daysUntil(m, d),
        icon: "birthday",
      });
    }

    if (coupleInfo.partner2Birthday) {
      const [y, m, d] = coupleInfo.partner2Birthday.split("-").map(Number);
      events.push({
        id: "partner2-birthday",
        name: `${coupleInfo.partner2Name || "TA"}的生日`,
        daysLeft: daysUntil(m, d),
        icon: "birthday",
      });
    }

    // 3. 内置节日
    const currentYear = today.getFullYear();
    for (const holiday of HOLIDAYS) {
      // 跳过今年已过期的七夕近似日期（保留最近一年的）
      const holidayDate = new Date(currentYear, holiday.month - 1, holiday.day);
      if (holidayDate < today && holiday.type === "chinese") {
        // 农历节日，如果今年已过，算明年的
        const nextDate = new Date(currentYear + 1, holiday.month - 1, holiday.day);
        const nextStr = formatDateStr(nextDate);
        const tStr = formatDateStr(today);
        const diffTime = nextDate.getTime() - new Date(tStr).getTime();
        const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        events.push({
          id: holiday.id,
          name: holiday.name,
          daysLeft,
          icon: "holiday",
          emoji: holiday.emoji,
        });
      } else {
        const daysLeft = daysUntil(holiday.month, holiday.day);
        events.push({
          id: holiday.id,
          name: holiday.name,
          daysLeft,
          icon: "holiday",
          emoji: holiday.emoji,
        });
      }
    }

    // 按剩余天数排序，取最近的 4 个
    return events.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);
  }, [coupleInfo, hasSetup]);

  // 图标映射
  const iconMap = {
    anniversary: <Heart className="w-4 h-4 text-love-400 fill-love-400" />,
    birthday: <Cake className="w-4 h-4 text-love-400" />,
    holiday: <Star className="w-4 h-4 text-love-400 fill-love-400" />,
  };

  // 加载中
  if (!loaded) {
    return (
      <Card className="py-4 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-8 w-full bg-gray-100 rounded-xl" />
          <div className="h-8 w-full bg-gray-100 rounded-xl" />
        </div>
      </Card>
    );
  }

  // 未设置
  if (!hasSetup) {
    return (
      <Card className="text-center py-6">
        <Clock className="w-5 h-5 text-love-300 mx-auto mb-2" />
        <p className="text-xs text-gray-400">设置恋爱信息后</p>
        <p className="text-xs text-gray-400">自动显示倒计时</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-love-400" />
        <h3 className="text-sm font-semibold text-gray-700">即将到来</h3>
      </div>

      <div className="space-y-2">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
              event.daysLeft <= 7
                ? "bg-love-50 border border-love-200"
                : "bg-gray-50/50 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {iconMap[event.icon]}
              <span className="text-sm text-gray-700 truncate">
                {event.emoji && <span className="mr-1">{event.emoji}</span>}
                {event.name}
              </span>
              {event.daysLeft <= 7 && (
                <span className="text-xs bg-love-400 text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                  临近
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 flex-shrink-0 ml-3">
              <span
                className={`text-xl font-bold ${
                  event.daysLeft <= 7 ? "text-love-500" : "text-gray-600"
                }`}
              >
                {event.daysLeft}
              </span>
              <span className="text-xs text-gray-400">天</span>
            </div>
          </div>
        ))}

        {upcomingEvents.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            暂无即将到来的事件
          </p>
        )}
      </div>

      {/* 底部说明 */}
      <p className="text-xs text-gray-400 text-center mt-3">
        提前7天提醒你
      </p>
    </Card>
  );
}
