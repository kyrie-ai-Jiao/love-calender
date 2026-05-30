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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        // 注册
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) throw signUpError;

        // 检查是否需要邮箱确认
        if (data.user && !data.session) {
          // 需要确认邮箱
          setSuccess("注册成功！请检查邮箱并点击确认链接，然后返回登录。");
          setIsRegister(false);
          setLoading(false);
          return;
        }

        // 不需要确认，直接注册成功
        setSuccess("注册成功，正在跳转...");
        setTimeout(() => router.push("/"), 800);
      } else {
        // 登录
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.push("/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "操作失败";

      if (msg.includes("Invalid login") || msg.includes("Invalid email")) {
        setError("邮箱或密码错误");
      } else if (msg.includes("Email not confirmed")) {
        setError("邮箱还未验证，请先去邮箱点击确认链接");
      } else if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("该邮箱已注册，请切换到登录");
      } else if (msg.includes("password") && msg.includes("6")) {
        setError("密码至少需要6位");
      } else {
        // 显示原始错误，方便调试
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
              <label className="block text-xs text-gray-500 mb-1">
                邮箱（支持 QQ/163/126 等国内邮箱）
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@qq.com"
                  required
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">密码（至少6位）</label>
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

            {success && (
              <p className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                {success}
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
                setSuccess("");
              }}
              className="text-xs text-love-500 hover:text-love-600 cursor-pointer"
            >
              {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
            </button>
          </div>
        </Card>

        <p className="text-xs text-gray-400 text-center mt-4">
          支持 QQ邮箱、163邮箱、126邮箱、Gmail 等所有邮箱
        </p>
      </div>
    </div>
  );
}
