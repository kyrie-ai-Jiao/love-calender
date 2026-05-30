"use client";

import Link from "next/link";
import { CalendarCheck, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";
import { formatDateStr } from "@/lib/dateUtils";

export default function CheckInPreview() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  if (!loaded || !hasSetup) return null;

  const tasks = coupleInfo.tasks || [];
  if (tasks.length === 0) return null;

  const today = formatDateStr(new Date());
  const todayDone = tasks.filter((t) => t.completedDates.includes(today)).length;
  const allDone = todayDone === tasks.length;

  return (
    <Link href="/checkin" className="block">
      <Card className="py-4 bg-gradient-to-r from-coral-50/50 to-cream-50/50 border-coral-100/40 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-full ${allDone && tasks.length > 0 ? "bg-coral-400" : "bg-coral-100"}`}>
              {allDone && tasks.length > 0 ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <CalendarCheck className="w-3.5 h-3.5 text-coral-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-warm-800 font-medium">
                {allDone ? "今日打卡全部完成！" : "今日打卡"}
              </p>
              <p className="text-xs text-warm-400">
                {allDone
                  ? "太棒了，继续保持"
                  : `${todayDone} / ${tasks.length} 项已完成`}
              </p>
            </div>
          </div>
          <span className="text-xs text-coral-400 font-medium">打卡 →</span>
        </div>
      </Card>
    </Link>
  );
}
