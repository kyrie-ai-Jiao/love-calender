"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Clock,
  Gift,
  PartyPopper,
  Wallet,
  MapPin,
  RefreshCw,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const EDGE_FUNCTION_URL =
  "https://mgkrjwswboqfwgsnqhtn.supabase.co/functions/v1/ai-planner";

const SCENES = [
  { label: "纪念日", emoji: "" },
  { label: "生日", emoji: "" },
  { label: "情人节", emoji: "" },
  { label: "七夕", emoji: "✨" },
  { label: "求婚", emoji: "" },
  { label: "日常惊喜", emoji: "" },
];

const STYLES = [
  { label: "浪漫", emoji: "" },
  { label: "温馨", emoji: "" },
  { label: "高级感", emoji: "✨" },
  { label: "文艺", emoji: "" },
  { label: "经济实惠", emoji: "" },
];

interface PlanData {
  title: string;
  timeline: { time: string; title: string; detail: string }[];
  gifts: { name: string; price: string; reason: string }[];
  surprises: { title: string; detail: string }[];
  budget: { total: string; breakdown: string };
  tips: string;
}

export default function PlannerPage() {
  const router = useRouter();

  // 表单
  const [budget, setBudget] = useState("");
  const [scene, setScene] = useState("");
  const [city, setCity] = useState("");
  const [style, setStyle] = useState("");

  // 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanData | null>(null);

  const canSubmit = budget && scene && city && style;

  const handleGenerate = async () => {
    if (!canSubmit || loading) return;
    setError("");
    setPlan(null);
    setLoading(true);

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, scene, city, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setPlan(data.plan as PlanData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* 顶部 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-xl hover:bg-coral-50 dark:hover:bg-white/5 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral-400" />
          <h1 className="text-lg sm:text-xl font-semibold text-warm-800 dark:text-gray-200">
            AI 策划师
          </h1>
        </div>
      </div>

      {/* 表单 */}
      <Card className="space-y-4">
        <p className="text-xs text-warm-400">填写信息，AI 为你生成完整的约会方案</p>

        {/* 预算 */}
        <div>
          <label className="block text-xs text-warm-500 mb-2">预算</label>
          <div className="grid grid-cols-4 gap-2">
            {["100元", "300元", "500元", "1000元"].map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  budget === b
                    ? "bg-coral-400 text-white shadow-md"
                    : "bg-warm-50 dark:bg-gray-800 text-warm-700 dark:text-warm-300 hover:bg-coral-50 dark:hover:bg-coral-500/10"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* 场景 */}
        <div>
          <label className="block text-xs text-warm-500 mb-2">场景</label>
          <div className="flex flex-wrap gap-2">
            {SCENES.map((s) => (
              <button
                key={s.label}
                onClick={() => setScene(s.label)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all cursor-pointer ${
                  scene === s.label
                    ? "bg-coral-400 text-white shadow-md"
                    : "bg-warm-50 dark:bg-gray-800 text-warm-700 dark:text-warm-300 hover:bg-coral-50"
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 城市 */}
        <div>
          <label className="block text-xs text-warm-500 mb-1">城市</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="如：上海、北京..."
              className="w-full border border-warm-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
            />
          </div>
        </div>

        {/* 风格 */}
        <div>
          <label className="block text-xs text-warm-500 mb-2">风格</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.label}
                onClick={() => setStyle(s.label)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all cursor-pointer ${
                  style === s.label
                    ? "bg-coral-400 text-white shadow-md"
                    : "bg-warm-50 dark:bg-gray-800 text-warm-700 dark:text-warm-300 hover:bg-coral-50"
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={handleGenerate}
          variant="primary"
          className="w-full"
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              正在生成方案...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              生成方案
            </>
          )}
        </Button>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </Card>

      {/* 加载骨架 */}
      {loading && (
        <Card className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-warm-200 dark:bg-gray-700 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-warm-100 dark:bg-gray-700 rounded" />
              <div className="h-10 w-full bg-warm-50 dark:bg-gray-700 rounded-xl" />
            </div>
          ))}
        </Card>
      )}

      {/* 结果 */}
      {plan && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* 标题 */}
          <Card className="bg-gradient-to-br from-coral-50 to-warm-100 dark:from-coral-500/10 dark:to-gray-800 text-center py-6">
            <Sparkles className="w-6 h-6 text-coral-400 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-coral-600 dark:text-coral-200">
              {plan.title}
            </h2>
            <p className="text-xs text-warm-400 mt-1">
              {scene} · {city} · {budget}
            </p>
          </Card>

          {/* 时间轴 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-coral-400" />
              <h3 className="text-sm font-semibold text-warm-800 dark:text-warm-300">
                时间安排
              </h3>
            </div>
            <div className="space-y-3">
              {plan.timeline?.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-sm font-bold text-coral-400 w-12 flex-shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-800 dark:text-gray-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-warm-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 礼物建议 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-coral-400" />
              <h3 className="text-sm font-semibold text-warm-800 dark:text-warm-300">
                礼物建议
              </h3>
            </div>
            <div className="space-y-3">
              {plan.gifts?.map((g, i) => (
                <div
                  key={i}
                  className="p-3 bg-coral-50/50 dark:bg-coral-500/5 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-warm-800 dark:text-gray-200">
                      {g.name}
                    </p>
                    <span className="text-xs font-medium text-coral-400">{g.price}</span>
                  </div>
                  <p className="text-xs text-warm-400">{g.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 惊喜建议 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <PartyPopper className="w-4 h-4 text-coral-400" />
              <h3 className="text-sm font-semibold text-warm-800 dark:text-warm-300">
                惊喜环节
              </h3>
            </div>
            <div className="space-y-3">
              {plan.surprises?.map((s, i) => (
                <div
                  key={i}
                  className="p-3 bg-coral-50/50 dark:bg-coral-500/5 rounded-2xl"
                >
                  <p className="text-sm font-medium text-warm-800 dark:text-gray-200 mb-1">
                    {s.title}
                  </p>
                  <p className="text-xs text-warm-500 dark:text-warm-400">{s.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 预算分析 */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-coral-400" />
              <h3 className="text-sm font-semibold text-warm-800 dark:text-warm-300">
                预算分析
              </h3>
            </div>
            <div className="p-3 bg-coral-50/50 dark:bg-coral-500/5 rounded-2xl">
              <p className="text-sm font-semibold text-coral-400 mb-1">
                {plan.budget?.total}
              </p>
              <p className="text-xs text-warm-500 dark:text-warm-400">
                {plan.budget?.breakdown}
              </p>
            </div>
          </Card>

          {/* 注意事项 */}
          {plan.tips && (
            <Card className="bg-apricot-400/10 dark:bg-apricot-400/5 border-apricot-400/20 dark:border-apricot-400/20">
              <h3 className="text-xs font-semibold text-apricot-500 dark:text-apricot-400 mb-2">
                小贴士
              </h3>
              <div className="text-xs text-warm-700 dark:text-warm-400 space-y-1">
                {plan.tips.split("；").map((tip, i) => (
                  <p key={i}>· {tip.trim()}</p>
                ))}
              </div>
            </Card>
          )}

          {/* 重新生成 */}
          <div className="text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
            >
              回到顶部重新填写
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
