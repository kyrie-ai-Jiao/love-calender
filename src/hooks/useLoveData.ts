"use client";

import { useState, useEffect, useCallback } from "react";
import { CoupleInfo, DEFAULT_COUPLE_INFO } from "@/types";
import { getCoupleInfo, saveCoupleInfo } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function useLoveData() {
  const { user } = useAuth();
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(DEFAULT_COUPLE_INFO);
  const [loaded, setLoaded] = useState(false);

  // 加载：localStorage 永远是唯一真实数据源
  useEffect(() => {
    const local = getCoupleInfo();
    setCoupleInfo(local);
    setLoaded(true);
  }, []);

  // 登录后：后台尝试把本地数据上传到云端
  useEffect(() => {
    if (!user || !loaded) return;
    const local = getCoupleInfo();
    if (!local.partner1Name || !local.startDate) return;

    // 后台静默同步，失败不提示
    supabase
      .from("couple_data")
      .upsert({ user_id: user.id, data: local })
      .catch(() => {});
  }, [user, loaded]);

  // 保存：先写 localStorage（绝不会失败），再后台同步云端
  const updateCoupleInfo = useCallback(
    (newInfo: CoupleInfo) => {
      setCoupleInfo(newInfo);
      saveCoupleInfo(newInfo);

      if (user) {
        supabase
          .from("couple_data")
          .upsert({ user_id: user.id, data: newInfo })
          .catch(() => {});
      }
    },
    [user]
  );

  const hasSetup = !!coupleInfo.startDate && !!coupleInfo.partner1Name;

  return { coupleInfo, updateCoupleInfo, hasSetup, loaded };
}
