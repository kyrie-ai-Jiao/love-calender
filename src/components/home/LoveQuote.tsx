"use client";

import { Quote as QuoteIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import { getTodayQuote } from "@/data/quotes";

export default function LoveQuote() {
  const quote = getTodayQuote();

  return (
    <Card className="bg-gradient-to-br from-warm-100/50 to-coral-50/50 border-coral-100/50">
      <div className="flex gap-3">
        {/* 左侧引号图标 */}
        <QuoteIcon className="w-5 h-5 text-coral-200 flex-shrink-0 mt-1 rotate-180" />

        <div className="space-y-2 min-w-0">
          <p className="text-sm text-warm-800 leading-relaxed italic">
            {quote.text}
          </p>
          {quote.author && (
            <p className="text-xs text-coral-400/70 font-medium">
              —— {quote.author}
            </p>
          )}
        </div>

        {/* 右侧引号图标 */}
        <QuoteIcon className="w-5 h-5 text-coral-200 flex-shrink-0 self-end" />
      </div>
    </Card>
  );
}
