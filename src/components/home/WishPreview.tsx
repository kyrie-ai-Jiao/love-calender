"use client";

import Link from "next/link";
import { ListTodo } from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";

export default function WishPreview() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  if (!loaded || !hasSetup) return null;

  const wishes = coupleInfo.wishes || [];
  if (wishes.length === 0) return null;

  const completedCount = wishes.filter((w) => w.completed).length;
  const allDone = completedCount === wishes.length;

  return (
    <Link href="/wishes" className="block">
      <Card className="py-4 bg-gradient-to-r from-love-50/50 to-cream-50/50 border-love-100/40 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-love-100 rounded-full">
              <ListTodo className="w-3.5 h-3.5 text-love-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                {allDone ? "愿望全部完成！" : "共同愿望清单"}
              </p>
              <p className="text-xs text-gray-400">
                {allDone
                  ? `完成了全部 ${completedCount} 个愿望`
                  : `已完成 ${completedCount} / ${wishes.length} 个`}
              </p>
            </div>
          </div>
          {/* 迷你进度环 */}
          <div className="w-8 h-8 rounded-full border-2 border-love-200 flex items-center justify-center">
            <span className="text-xs font-bold text-love-400">
              {Math.round((completedCount / wishes.length) * 100)}%
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
