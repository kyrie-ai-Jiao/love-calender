"use client";

import { useMemo, useState } from "react";
import { Bell, Heart, Cake, Star, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import EventDetail from "@/components/events/EventDetail";
import { useLoveData } from "@/hooks/useLoveData";
import { daysUntil, getAnniversaryYears } from "@/lib/dateUtils";
import { HOLIDAYS } from "@/data/holidays";

interface Reminder {
  id: string;
  name: string;
  daysLeft: number;
  icon: "anniversary" | "birthday" | "holiday";
  emoji?: string;
  subtitle: string;
  targetMonth: number;
  targetDay: number;
}

const ICON_MAP = {
  anniversary: <Heart className="w-4 h-4 text-coral-400 fill-coral-400" />,
  birthday: <Cake className="w-4 h-4 text-coral-400" />,
  holiday: <Star className="w-4 h-4 text-coral-400 fill-coral-400" />,
} as const;

const getAlertStyle = (daysLeft: number) => {
  if (daysLeft === 0) return "bg-coral-100 dark:bg-coral-500/20 border-coral-300 dark:border-coral-500/40 border-2";
  if (daysLeft <= 3) return "bg-coral-50 dark:bg-coral-500/10 border-coral-200 dark:border-coral-500/30 border";
  return "bg-apricot-400/10 dark:bg-apricot-400/5 border-apricot-400/20 dark:border-apricot-400/30 border";
};

export default function ReminderList() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();
  const [selectedEvent, setSelectedEvent] = useState<Reminder | null>(null);

  const reminders = useMemo((): Reminder[] => {
    if (!hasSetup) return [];

    const result: Reminder[] = [];
    const start = new Date(coupleInfo.startDate);

    // 恋爱周年纪念日
    const annMonth = start.getMonth() + 1;
    const annDay = start.getDate();
    const annDaysLeft = daysUntil(annMonth, annDay);
    const years = getAnniversaryYears(coupleInfo.startDate);

    if (annDaysLeft <= 7) {
      result.push({
        id: "anniversary",
        name: `${years + 1}周年纪念日`,
        daysLeft: annDaysLeft,
        icon: "anniversary",
        subtitle: annDaysLeft === 0 ? "就是今天！" : `还有${annDaysLeft}天`,
        targetMonth: annMonth,
        targetDay: annDay,
      });
    }

    // 生日
    if (coupleInfo.partner1Birthday) {
      const [, m, d] = coupleInfo.partner1Birthday.split("-").map(Number);
      const bd = daysUntil(m, d);
      if (bd <= 7) {
        result.push({
          id: "partner1-birthday",
          name: `${coupleInfo.partner1Name || "你"}的生日`,
          daysLeft: bd,
          icon: "birthday",
          subtitle: bd === 0 ? "就是今天！" : `还有${bd}天`,
          targetMonth: m,
          targetDay: d,
        });
      }
    }

    if (coupleInfo.partner2Birthday) {
      const [, m, d] = coupleInfo.partner2Birthday.split("-").map(Number);
      const bd = daysUntil(m, d);
      if (bd <= 7) {
        result.push({
          id: "partner2-birthday",
          name: `${coupleInfo.partner2Name || "TA"}的生日`,
          daysLeft: bd,
          icon: "birthday",
          subtitle: bd === 0 ? "就是今天！" : `还有${bd}天`,
          targetMonth: m,
          targetDay: d,
        });
      }
    }

    // 自定义纪念日
    for (const ann of coupleInfo.customAnniversaries) {
      if (!ann.date) continue;
      const [, m, d] = ann.date.split("-").map(Number);
      const dl = daysUntil(m, d);
      if (dl <= 7) {
        result.push({
          id: ann.id,
          name: ann.name || "自定义纪念日",
          daysLeft: dl,
          icon: "anniversary",
          subtitle: dl === 0 ? "就是今天！" : `还有${dl}天`,
          targetMonth: m,
          targetDay: d,
        });
      }
    }

    // 内置节日
    for (const holiday of HOLIDAYS) {
      const dl = daysUntil(holiday.month, holiday.day);
      if (dl <= 7) {
        result.push({
          id: holiday.id,
          name: holiday.name,
          daysLeft: dl,
          icon: "holiday",
          emoji: holiday.emoji,
          subtitle: dl === 0 ? "就是今天！" : `还有${dl}天`,
          targetMonth: holiday.month,
          targetDay: holiday.day,
        });
      }
    }

    return result.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [coupleInfo, hasSetup]);

  if (!loaded) {
    return (
      <Card className="py-4 animate-pulse">
        <div className="h-4 w-24 bg-warm-200 rounded mb-3" />
        <div className="h-10 w-full bg-warm-100 rounded-xl" />
      </Card>
    );
  }

  if (reminders.length === 0) return null;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-coral-100 rounded-full">
            <Bell className="w-4 h-4 text-coral-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-800">临近提醒 · 点击查看详情</h3>
            <p className="text-xs text-warm-400">7天内即将到来</p>
          </div>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <button
              key={reminder.id}
              onClick={() => setSelectedEvent(reminder)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer text-left hover:opacity-90 ${getAlertStyle(
                reminder.daysLeft
              )}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-white/70 rounded-full flex-shrink-0">
                  {ICON_MAP[reminder.icon]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-warm-800 truncate">
                    {reminder.emoji && <span className="mr-1">{reminder.emoji}</span>}
                    {reminder.name}
                  </p>
                  <p className="text-xs text-coral-400 font-medium">
                    {reminder.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                {reminder.daysLeft === 0 ? (
                  <Sparkles className="w-4 h-4 text-coral-400 animate-pulse" />
                ) : (
                  <>
                    <span className="text-xl font-bold text-coral-400">
                      {reminder.daysLeft}
                    </span>
                    <span className="text-xs text-coral-400">天</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
