"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Sparkles, Heart, Trash2 } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";

const QUICK_QUESTIONS = [
  "女朋友最近心情不好怎么办？",
  "520送什么礼物比较好？",
  "如何策划一个惊喜约会？",
  "异地恋如何维持感情？",
  "帮我写一段生日祝福文案",
  "纪念日朋友圈怎么写？",
];

export default function AIAssistantPage() {
  const router = useRouter();
  const { messages, loading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-4 h-[calc(100vh-4rem)] flex flex-col">
      {/* 顶部 */}
      <div className="flex items-center justify-between py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-coral-50 dark:hover:bg-white/5 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-coral-100 dark:bg-coral-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
            </div>
            <h1 className="text-lg font-semibold text-warm-800 dark:text-gray-200">
              AI 恋爱助手
            </h1>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="p-2 rounded-xl hover:bg-coral-50 dark:hover:bg-white/5 text-warm-400 hover:text-red-400 transition-colors cursor-pointer"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          /* 空状态 — 快捷提问 */
          <div className="space-y-5 pt-4">
            <div className="text-center">
              <Heart className="w-10 h-10 text-coral-200 mx-auto mb-3" />
              <p className="text-sm text-warm-400">我是你的专属恋爱助手</p>
              <p className="text-xs text-warm-300 mt-1">可以问我任何关于恋爱的问题</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-warm-400 font-medium">试试这些：</p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    sendMessage(q);
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-coral-50/50 dark:bg-coral-500/10 border border-coral-100/50 dark:border-coral-500/20 text-sm text-warm-700 dark:text-warm-300 hover:bg-coral-100/50 dark:hover:bg-coral-500/20 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 消息列表 */
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-coral-400 text-white rounded-br-md"
                    : "bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-warm-800 dark:text-gray-200 rounded-bl-md shadow-sm"
                }`}
              >
                {/* AI 标签 */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-coral-400" />
                    <span className="text-xs text-coral-400 font-medium">恋爱助手</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {/* 加载动画 */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3 h-3 text-coral-400" />
                <span className="text-xs text-coral-400 font-medium">正在思考</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-love-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-love-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-love-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 py-3 border-t border-warm-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="问我任何恋爱问题..."
            disabled={loading}
            className="flex-1 border border-warm-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-coral-300 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-coral-400 text-white hover:bg-coral-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
