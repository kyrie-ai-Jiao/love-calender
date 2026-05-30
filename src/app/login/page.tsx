"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // 注册
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        // 注册成功后自动创建空数据行
        setError("");
        // 注册成功直接登录
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      } else {
        // 登录
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      }

      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";
      if (msg.includes("Invalid login")) {
        setError("邮箱或密码错误");
      } else if (msg.includes("already registered")) {
        setError("该邮箱已注册，请直接登录");
      } else {
        setError(msg);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-love-50 to-cream-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-love-400 fill-love-400 mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-love-700 dark:text-love-300">
            恋爱日历
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRegister ? "创建账号，开始记录" : "登录继续记录你们的每一天"}
          </p>
        </div>

        {/* 表单 */}
        <Card className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位"
                  required
                  minLength={6}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full">
              {loading ? "请稍候..." : isRegister ? "注册" : "登录"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-love-500 hover:text-love-600 cursor-pointer"
            >
              {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
