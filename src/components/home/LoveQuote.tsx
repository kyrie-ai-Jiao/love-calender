"use client";

import { useMemo } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { getTodayQuote } from "@/data/quotes";

export default function LoveQuote() {
  const quote = useMemo(() => getTodayQuote(), []);

  return (
    <Card className="bg-gradient-to-br from-cream-100/50 to-love-50/50 border-love-100/50">
      <div className="flex gap-3">
        {/* 左侧引号图标 */}
        <QuoteIcon className="w-5 h-5 text-love-300 flex-shrink-0 mt-1 rotate-180" />

        <div className="space-y-2 min-w-0">
          <p className="text-sm text-gray-700 leading-relaxed italic">
            {quote.text}
          </p>
          {quote.author && (
            <p className="text-xs text-love-400/70 font-medium">
              —— {quote.author}
            </p>
          )}
        </div>

        {/* 右侧引号图标 */}
        <QuoteIcon className="w-5 h-5 text-love-300 flex-shrink-0 self-end" />
      </div>
    </Card>
  );
}
