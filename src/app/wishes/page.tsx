"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Check, Circle, ListTodo } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLoveData } from "@/hooks/useLoveData";
import { Wish } from "@/types";

export default function WishesPage() {
  const router = useRouter();
  const { coupleInfo, updateCoupleInfo, hasSetup } = useLoveData();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const wishes = coupleInfo.wishes || [];
  const completedCount = wishes.filter((w) => w.completed).length;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const wish: Wish = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      completed: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    updateCoupleInfo({
      ...coupleInfo,
      wishes: [...wishes, wish],
    });
    setNewTitle("");
    setNewDesc("");
  };

  const handleToggle = (id: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      wishes: wishes.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w
      ),
    });
  };

  const handleDelete = (id: string) => {
    updateCoupleInfo({
      ...coupleInfo,
      wishes: wishes.filter((w) => w.id !== id),
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-coral-50 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-warm-800">
            共同愿望清单
          </h1>
        </div>
        {wishes.length > 0 && (
          <span className="text-xs text-coral-400 font-medium">
            {completedCount}/{wishes.length}
          </span>
        )}
      </div>

      {!hasSetup ? (
        <Card className="text-center py-12">
          <ListTodo className="w-8 h-8 text-coral-100 mx-auto mb-3" />
          <p className="text-sm text-warm-400">请先在设置中填写恋爱信息</p>
        </Card>
      ) : (
        <>
          {/* 进度条 */}
          {wishes.length > 0 && (
            <div className="bg-warm-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-coral-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / wishes.length) * 100}%` }}
              />
            </div>
          )}

          {/* 添加表单 */}
          <Card className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="想一起做什么？"
              className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="补充说明（可选）"
              className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
            />
            <Button onClick={handleAdd} variant="outline" className="w-full">
              <Plus className="w-4 h-4" />
              添加愿望
            </Button>
          </Card>

          {/* 愿望列表 */}
          {wishes.length === 0 ? (
            <Card className="text-center py-12">
              <ListTodo className="w-10 h-10 text-coral-100 mx-auto mb-3" />
              <p className="text-sm text-warm-400">还没有愿望</p>
              <p className="text-xs text-warm-300 mt-1">把想一起去的地方、想做的事写下来</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {/* 未完成 */}
              {wishes
                .filter((w) => !w.completed)
                .map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              {/* 已完成 */}
              {wishes
                .filter((w) => w.completed)
                .map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===== 单个愿望卡片 ===== */
function WishCard({
  wish,
  onToggle,
  onDelete,
}: {
  wish: Wish;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl transition-all ${
        wish.completed ? "bg-warm-50 opacity-60" : "bg-white border border-warm-200 shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(wish.id)}
        className="mt-0.5 flex-shrink-0 text-coral-400 hover:text-coral-400 transition-colors cursor-pointer"
      >
        {wish.completed ? (
          <Check className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            wish.completed ? "text-warm-400 line-through" : "text-warm-800 font-medium"
          }`}
        >
          {wish.title}
        </p>
        {wish.description && (
          <p className="text-xs text-warm-400 mt-0.5">{wish.description}</p>
        )}
        <p className="text-xs text-warm-300 mt-1">{wish.createdAt}</p>
      </div>

      <button
        onClick={() => onDelete(wish.id)}
        className="p-1 text-warm-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
