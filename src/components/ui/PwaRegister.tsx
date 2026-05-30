"use client";

import { useEffect } from "react";

/**
 * PWA 注册组件
 * - 在浏览器支持的情况下注册 Service Worker
 * - 必须在客户端组件中使用
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/love-calender/sw.js")
      .then(() => {
        console.log("PWA Service Worker 注册成功");
      })
      .catch((err) => {
        console.warn("PWA Service Worker 注册失败:", err.message);
      });
  }, []);

  return null; // 纯逻辑组件，不渲染任何东西
}
