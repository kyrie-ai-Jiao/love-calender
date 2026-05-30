"use client";

import { useState, useEffect, useCallback } from "react";
import { CoupleInfo, DEFAULT_COUPLE_INFO } from "@/types";
import { getCoupleInfo, saveCoupleInfo } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

/** 后台静默同步 */
async function syncToCloud(userId: string, data: CoupleInfo) {
  try {
    await supabase.from("couple_data").upsert({ user_id: userId, data });
  } catch {
    // 静默
  }
}

export function useLoveData() {
  const { user } = useAuth();
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(DEFAULT_COUPLE_INFO);
  const [loaded, setLoaded] = useState(false);

  // 加载：localStorage 是唯一数据源
  useEffect(() => {
    setCoupleInfo(getCoupleInfo());
    setLoaded(true);
  }, []);

  // 登录后：后台把本地数据上传云端
  useEffect(() => {
    if (!user || !loaded) return;
    const local = getCoupleInfo();
    if (local.partner1Name && local.startDate) {
      syncToCloud(user.id, local);
    }
  }, [user, loaded]);

  // 保存：先写本地，再后台同步
  const updateCoupleInfo = useCallback(
    (newInfo: CoupleInfo) => {
      setCoupleInfo(newInfo);
      saveCoupleInfo(newInfo);
      if (user) syncToCloud(user.id, newInfo);
    },
    [user]
  );

  const hasSetup = !!coupleInfo.startDate && !!coupleInfo.partner1Name;

  return { coupleInfo, updateCoupleInfo, hasSetup, loaded };
}
