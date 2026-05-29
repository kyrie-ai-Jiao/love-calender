"use client";

import { useMemo, useState } from "react";
import { Gift, Flower2, Coffee, PartyPopper, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { useLoveData } from "@/hooks/useLoveData";
import { daysUntil } from "@/lib/dateUtils";
import { HOLIDAYS } from "@/data/holidays";
import { getSurpriseSet } from "@/data/surprises";

interface ApproachingEvent {
  name: string;
  daysLeft: number;
}

/* 4个Tab定义 — 放在组件外面避免每次渲染重建 */
const TABS = [
  { key: "flower" as const, label: "送花", icon: <Flower2 className="w-3.5 h-3.5" /> },
  { key: "gift" as const, label: "礼物", icon: <Gift className="w-3.5 h-3.5" /> },
  { key: "date" as const, label: "约会", icon: <Coffee className="w-3.5 h-3.5" /> },
  { key: "surprise" as const, label: "惊喜", icon: <PartyPopper className="w-3.5 h-3.5" /> },
];

export default function SurpriseCard() {
  const { coupleInfo, hasSetup, loaded } = useLoveData();

  // ===== 所有 Hook 必须在条件返回之前 =====
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("flower");

  // 找最近的即将到来的事件
  const nearestEvent = useMemo((): ApproachingEvent | null => {
    if (!hasSetup) return null;

    let candidates: ApproachingEvent[] = [];
    const start = new Date(coupleInfo.startDate);

    // 周年
    const annDays = daysUntil(start.getMonth() + 1, start.getDate());
    candidates.push({ name: "周年纪念", daysLeft: annDays });

    // 生日
    if (coupleInfo.partner1Birthday) {
      const [, m, d] = coupleInfo.partner1Birthday.split("-").map(Number);
      candidates.push({
        name: `${coupleInfo.partner1Name || "你"}的生日`,
        daysLeft: daysUntil(m, d),
      });
    }
    if (coupleInfo.partner2Birthday) {
      const [, m, d] = coupleInfo.partner2Birthday.split("-").map(Number);
      candidates.push({
        name: `${coupleInfo.partner2Name || "TA"}的生日`,
        daysLeft: daysUntil(m, d),
      });
    }

    // 节日
    for (const h of HOLIDAYS) {
      candidates.push({ name: h.name, daysLeft: daysUntil(h.month, h.day) });
    }

    // 自定义纪念日
    for (const ann of coupleInfo.customAnniversaries) {
      if (!ann.date) continue;
      const [, m, d] = ann.date.split("-").map(Number);
      candidates.push({ name: ann.name || "纪念日", daysLeft: daysUntil(m, d) });
    }

    candidates.sort((a, b) => a.daysLeft - b.daysLeft);
    return candidates[0] || null;
  }, [coupleInfo, hasSetup]);

  // ===== 条件返回（必须在所有 Hook 之后） =====

  if (!loaded) {
    return (
      <Card className="py-4 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-full bg-gray-100 rounded-xl" />
      </Card>
    );
  }

  if (!nearestEvent) return null;

  // ===== 计算展示数据 =====
  const surpriseSet = getSurpriseSet(nearestEvent.name);
  const activeSuggestion = surpriseSet.suggestions.find(
    (s) => s.category === activeTab
  );

  return (
    <Card className="bg-gradient-to-br from-cream-50 to-love-50/30 border-love-100/50 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-love-100 rounded-full">
            <Sparkles className="w-4 h-4 text-love-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">惊喜灵感</h3>
            <p className="text-xs text-love-400/80">
              距离{nearestEvent.name}还有 {nearestEvent.daysLeft} 天
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg hover:bg-love-50 text-gray-400 transition-colors cursor-pointer"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-1.5 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-white text-love-500 shadow-sm"
                : "text-gray-400 hover:text-love-400"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 建议内容 */}
      {activeSuggestion && (
        <div className="bg-white/70 rounded-2xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {activeSuggestion.text}
          </p>
        </div>
      )}

      {/* 展开后显示全部4条 */}
      {expanded && (
        <div className="mt-3 space-y-2">
          {surpriseSet.suggestions
            .filter((s) => s.category !== activeTab)
            .map((s, i) => {
              const tab = TABS.find((t) => t.key === s.category)!;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTab(s.category);
                    setExpanded(false);
                  }}
                  className="w-full text-left bg-white/50 rounded-xl p-3 hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">{tab.icon}</span>
                    <span className="text-xs font-medium text-love-400">
                      {tab.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{s.text}</p>
                </button>
              );
            })}
        </div>
      )}
    </Card>
  );
}
