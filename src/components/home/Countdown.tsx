"use client";

import { useMemo, useState } from "react";
import { Clock, Heart, Cake, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import EventDetail from "@/components/events/EventDetail";
import { useLoveData } from "@/hooks/useLoveData";
import { daysUntil, getAnniversaryYears } from "@/lib/dateUtils";
import { HOLIDAYS } from "@/data/holidays";

interface CountdownEvent {
  id: string;
  name: string;
  daysLeft: number;
  icon: "anniversary" | "birthday" | "holiday";
  emoji?: string;
  targetMonth: number;
  targetDay: number;
}

const ICON_MAP = {
  anniversary: <Heart className="w-4 h-4 text-love-400 fill-love-400" />,
  birthday: <Cake className="w-4 h-4 text-love-400" />,
  holiday: <Star className="w-4 h-4 text-love-400 fill-love-400" />,
} as const;

export default function Countdown() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();
  const [selectedEvent, setSelectedEvent] = useState<CountdownEvent | null>(null);

  const upcomingEvents = useMemo((): CountdownEvent[] => {
    if (!hasSetup) return [];

    const events: CountdownEvent[] = [];
    const start = new Date(coupleInfo.startDate);

    // 恋爱周年纪念日
    const annMonth = start.getMonth() + 1;
    const annDay = start.getDate();
    const years = getAnniversaryYears(coupleInfo.startDate);

    events.push({
      id: "anniversary",
      name: `${years + 1}周年纪念日`,
      daysLeft: daysUntil(annMonth, annDay),
      icon: "anniversary",
      targetMonth: annMonth,
      targetDay: annDay,
    });

    // 双方生日
    if (coupleInfo.partner1Birthday) {
      const [, m, d] = coupleInfo.partner1Birthday.split("-").map(Number);
      events.push({
        id: "partner1-birthday",
        name: `${coupleInfo.partner1Name || "你"}的生日`,
        daysLeft: daysUntil(m, d),
        icon: "birthday",
        targetMonth: m,
        targetDay: d,
      });
    }

    if (coupleInfo.partner2Birthday) {
      const [, m, d] = coupleInfo.partner2Birthday.split("-").map(Number);
      events.push({
        id: "partner2-birthday",
        name: `${coupleInfo.partner2Name || "TA"}的生日`,
        daysLeft: daysUntil(m, d),
        icon: "birthday",
        targetMonth: m,
        targetDay: d,
      });
    }

    // 内置节日
    for (const holiday of HOLIDAYS) {
      events.push({
        id: holiday.id,
        name: holiday.name,
        daysLeft: daysUntil(holiday.month, holiday.day),
        icon: "holiday",
        emoji: holiday.emoji,
        targetMonth: holiday.month,
        targetDay: holiday.day,
      });
    }

    return events.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);
  }, [coupleInfo, hasSetup]);

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
    <>
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-love-400" />
          <h3 className="text-sm font-semibold text-gray-700">即将到来 · 点击查看详情</h3>
        </div>

        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors cursor-pointer text-left ${
                event.daysLeft <= 7
                  ? "bg-love-50 border border-love-200 hover:bg-love-100"
                  : "bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {ICON_MAP[event.icon]}
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
            </button>
          ))}

          {upcomingEvents.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              暂无即将到来的事件
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">
          提前7天提醒你
        </p>
      </Card>

      {/* 详情弹窗 */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
