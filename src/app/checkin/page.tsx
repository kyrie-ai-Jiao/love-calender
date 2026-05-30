"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Check, Flame, CalendarCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLoveData } from "@/hooks/useLoveData";
import { formatDateStr, getStreak, getRecentDates } from "@/lib/dateUtils";
import { Task } from "@/types";

const EMOJI_OPTIONS = ["", "", "", "", "", "", "", "", "", ""];

export default function CheckinPage() {
  const router = useRouter();
  const { coupleInfo, updateCoupleInfo, hasSetup } = useLoveData();
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const today = formatDateStr(new Date());

  const tasks = coupleInfo.tasks || [];

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      emoji: newEmoji,
      completedDates: [],
    };
    updateCoupleInfo({
      ...coupleInfo,
      tasks: [...tasks, task],
    });
    setNewTitle("");
    setNewEmoji("");
  };

  const handleToggle = (taskId: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      tasks: tasks.map((t) => {
        if (t.id !== taskId) return t;
        const dates = t.completedDates;
        const alreadyDone = dates.includes(today);
        return {
          ...t,
          completedDates: alreadyDone
            ? dates.filter((d) => d !== today)
            : [...dates, today],
        };
      }),
    });
  };

  const handleDelete = (taskId: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      tasks: tasks.filter((t) => t.id !== taskId),
    });
  };

  // 今日完成数
  const todayDone = tasks.filter((t) => t.completedDates.includes(today)).length;
  const todayTotal = tasks.length;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* 顶部 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 -ml-2 rounded-xl hover:bg-coral-50 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-warm-800">情侣打卡</h1>
      </div>

      {!hasSetup ? (
        <Card className="text-center py-12">
          <CalendarCheck className="w-8 h-8 text-coral-100 mx-auto mb-3" />
          <p className="text-sm text-warm-400">请先在设置中填写恋爱信息</p>
        </Card>
      ) : (
        <>
          {/* 今日概览 */}
          <Card className="bg-gradient-to-br from-coral-50 to-warm-100 text-center py-6">
            <p className="text-xs text-warm-400 mb-1">{today}</p>
            <div className="flex items-center justify-center gap-2">
              <CalendarCheck className="w-5 h-5 text-coral-400" />
              <span className="text-2xl font-bold text-coral-400">
                {todayTotal === 0 ? "--" : `${todayDone}/${todayTotal}`}
              </span>
            </div>
            <p className="text-xs text-warm-400 mt-1">
              {todayTotal === 0
                ? "添加任务开始打卡"
                : todayDone === todayTotal
                ? "全部完成！"
                : "今日打卡进度"}
            </p>
          </Card>

          {/* 打卡列表 */}
          {tasks.map((task) => {
            const isDone = task.completedDates.includes(today);
            const streak = getStreak(task.completedDates);
            const recent7 = getRecentDates(7);

            return (
              <Card key={task.id} className={isDone ? "border-coral-200" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                        isDone
                          ? "bg-coral-400 border-coral-400 text-white"
                          : "border-warm-300 dark:border-warm-600 text-transparent hover:border-coral-300"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm text-warm-800">
                      {task.emoji} {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-coral-400 font-medium">
                        <Flame className="w-3.5 h-3.5" />
                        {streak}天
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 text-warm-300 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 最近7天迷你日历 */}
                <div className="flex gap-1.5 justify-end">
                  {recent7.map((date) => {
                    const [y, m, d] = date.split("-");
                    const done = task.completedDates.includes(date);
                    return (
                      <div
                        key={date}
                        title={date}
                        className={`w-7 h-7 rounded-lg flex flex-col items-center justify-center text-[10px] transition-all ${
                          done
                            ? "bg-coral-100 text-coral-400 font-medium"
                            : "bg-warm-50 text-warm-300"
                        }`}
                      >
                        <span>{d}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}

          {/* 添加任务 */}
          <Card className="space-y-3">
            <div className="flex gap-2">
              {/* emoji 选择器 */}
              <div className="flex flex-wrap gap-1 flex-shrink-0">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEmoji(newEmoji === emoji ? "" : emoji)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all cursor-pointer ${
                      newEmoji === emoji ? "bg-coral-100 scale-110" : "hover:bg-warm-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{newEmoji || ""}</span>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="添加打卡任务..."
                className="flex-1 border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
              />
              <Button onClick={handleAdd} variant="outline" className="flex-shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* 空状态 */}
          {tasks.length === 0 && (
            <Card className="text-center py-10">
              <Flame className="w-8 h-8 text-coral-100 mx-auto mb-2" />
              <p className="text-sm text-warm-400">还没有打卡任务</p>
              <p className="text-xs text-warm-300 mt-1">
                添加上面的任务，每天一起打卡
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
