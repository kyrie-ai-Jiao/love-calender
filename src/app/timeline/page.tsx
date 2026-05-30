"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Camera,
  ListTodo,
  CalendarCheck,
  Calendar,
  Pin,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";
import { formatChineseDate, formatDateStr } from "@/lib/dateUtils";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "start" | "anniversary" | "photo" | "wish" | "checkin";
  emoji?: string;
  imageData?: string;
}

const TYPE_CONFIG = {
  start: {
    icon: <Heart className="w-4 h-4 text-white fill-white" />,
    bg: "bg-love-400",
    label: "开始",
  },
  anniversary: {
    icon: <Calendar className="w-4 h-4 text-white" />,
    bg: "bg-amber-400",
    label: "纪念日",
  },
  photo: {
    icon: <Camera className="w-4 h-4 text-white" />,
    bg: "bg-sky-400",
    label: "照片",
  },
  wish: {
    icon: <ListTodo className="w-4 h-4 text-white" />,
    bg: "bg-emerald-400",
    label: "愿望",
  },
  checkin: {
    icon: <CalendarCheck className="w-4 h-4 text-white" />,
    bg: "bg-violet-400",
    label: "打卡",
  },
};

export default function TimelinePage() {
  const router = useRouter();
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  const events = useMemo((): TimelineEvent[] => {
    if (!hasSetup) return [];

    const result: TimelineEvent[] = [];

    // 1. 在一起的开始
    result.push({
      date: coupleInfo.startDate,
      title: `${coupleInfo.partner1Name} ♥ ${coupleInfo.partner2Name}`,
      description: `在一起的开始 · ${formatChineseDate(coupleInfo.startDate)}`,
      type: "start",
      emoji: "",
    });

    // 2. 自定义纪念日
    for (const ann of coupleInfo.customAnniversaries) {
      if (!ann.date || !ann.name) continue;
      result.push({
        date: ann.date,
        title: ann.name,
        description: formatChineseDate(ann.date),
        type: "anniversary",
      });
    }

    // 3. 照片
    for (const photo of coupleInfo.photos) {
      result.push({
        date: photo.date,
        title: photo.caption || "一张照片",
        description: photo.caption ? formatChineseDate(photo.date) : formatChineseDate(photo.date),
        type: "photo",
        imageData: photo.data,
      });
    }

    // 4. 已完成的愿望
    for (const wish of coupleInfo.wishes) {
      if (!wish.completed) continue;
      result.push({
        date: wish.createdAt,
        title: wish.title,
        description: wish.description || "愿望完成 ✓",
        type: "wish",
      });
    }

    // 5. 打卡任务（取首次打卡日）
    for (const task of coupleInfo.tasks) {
      if (task.completedDates.length === 0) continue;
      const firstDate = [...task.completedDates].sort()[0];
      result.push({
        date: firstDate,
        title: `开始打卡：${task.title}`,
        description: `已连续打卡 ${task.completedDates.length} 天`,
        type: "checkin",
        emoji: task.emoji,
      });
    }

    // 按日期升序
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [coupleInfo, hasSetup]);

  if (!loaded) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-love-50 text-gray-400 hover:text-love-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">恋爱大事记</h1>
        </div>
        {events.length > 0 && (
          <span className="text-xs text-gray-400">{events.length} 个事件</span>
        )}
      </div>

      {!hasSetup ? (
        <Card className="text-center py-12">
          <Heart className="w-8 h-8 text-love-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">请先在设置中填写恋爱信息</p>
        </Card>
      ) : events.length === 0 ? (
        <Card className="text-center py-12">
          <Pin className="w-8 h-8 text-love-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">还没有任何事件</p>
          <p className="text-xs text-gray-300 mt-1">添加纪念日、照片、愿望后这里会自动生成时间线</p>
        </Card>
      ) : (
        /* 时间线 */
        <div className="relative">
          {/* 中间的竖线 */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-love-100" />

          <div className="space-y-4">
            {events.map((event, i) => {
              const config = TYPE_CONFIG[event.type];
              const today = formatDateStr(new Date());
              const isFuture = event.date > today;

              return (
                <div key={`${event.type}-${event.date}-${event.title}-${i}`} className="flex gap-4 group">
                  {/* 左侧圆点 */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${config.bg} ${
                        isFuture ? "opacity-40" : ""
                      }`}
                    >
                      {config.icon}
                    </div>
                  </div>

                  {/* 右侧内容卡片 */}
                  <div className={`flex-1 min-w-0 ${isFuture ? "opacity-40" : ""}`}>
                    <Card className="p-4 group-hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bg} text-white`}
                          >
                            {config.label}
                          </span>
                          {isFuture && (
                            <span className="text-[10px] text-gray-400">未到来</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatChineseDate(event.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {event.emoji && <span>{event.emoji}</span>}
                        <h3 className="text-sm font-medium text-gray-800">{event.title}</h3>
                      </div>

                      {event.description && (
                        <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                      )}

                      {/* 照片缩略图 */}
                      {event.imageData && (
                        <div className="mt-3 rounded-xl overflow-hidden w-full max-h-48">
                          <img
                            src={event.imageData}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
