import { CoupleInfo, DEFAULT_COUPLE_INFO } from "@/types";

const STORAGE_KEY = "love-calendar-couple-info";

/**
 * 从浏览器 localStorage 读取恋爱信息
 * 如果从没保存过，返回默认空值
 */
export function getCoupleInfo(): CoupleInfo {
  // 这段代码只在浏览器里运行（服务端渲染时跳过）
  if (typeof window === "undefined") {
    return DEFAULT_COUPLE_INFO;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_COUPLE_INFO;
  }

  try {
    return JSON.parse(raw) as CoupleInfo;
  } catch {
    return DEFAULT_COUPLE_INFO;
  }
}

/**
 * 保存恋爱信息到浏览器 localStorage
 */
export function saveCoupleInfo(info: CoupleInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}
