"use client";

import { useState, useEffect, useCallback } from "react";
import { CoupleInfo, DEFAULT_COUPLE_INFO } from "@/types";
import { getCoupleInfo, saveCoupleInfo } from "@/lib/storage";

/**
 * 恋爱数据的自定义 Hook
 * 用法：
 *   const { coupleInfo, updateCoupleInfo, hasSetup } = useLoveData();
 */
export function useLoveData() {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(DEFAULT_COUPLE_INFO);
  const [loaded, setLoaded] = useState(false);

  // 组件挂载时，从 localStorage 读取数据
  useEffect(() => {
    setCoupleInfo(getCoupleInfo());
    setLoaded(true);
  }, []);

  // 更新数据（同时保存到 localStorage）
  const updateCoupleInfo = useCallback((newInfo: CoupleInfo) => {
    setCoupleInfo(newInfo);
    saveCoupleInfo(newInfo);
  }, []);

  // 是否已经设置过恋爱信息
  const hasSetup = !!coupleInfo.startDate && !!coupleInfo.partner1Name;

  return { coupleInfo, updateCoupleInfo, hasSetup, loaded };
}
