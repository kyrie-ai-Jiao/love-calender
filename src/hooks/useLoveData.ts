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

  // 加载数据：云端优先，出错时本地兜底
  useEffect(() => {
    async function load() {
      try {
        if (user) {
          // 已登录：从 Supabase 加载
          const { data: row } = await supabase
            .from("couple_data")
            .select("data")
            .eq("user_id", user.id)
            .single();

          if (row?.data) {
            setCoupleInfo(row.data as CoupleInfo);
          } else {
            // 云端没有 → 尝试本地迁移
            const local = getCoupleInfo();
            if (local.partner1Name && local.startDate) {
              await supabase.from("couple_data").upsert({
                user_id: user.id,
                data: local,
              });
              setCoupleInfo(local);
            } else {
              setCoupleInfo(DEFAULT_COUPLE_INFO);
            }
          }
        } else {
          // 未登录：从 localStorage
          setCoupleInfo(getCoupleInfo());
        }
      } catch {
        // Supabase 出错 → 静默降级到 localStorage
        setCoupleInfo(getCoupleInfo());
      }
      setLoaded(true);
    }
    load();
  }, [user]);

  // 更新数据：先写本地确保不丢，再同步云端
  const updateCoupleInfo = useCallback(
    async (newInfo: CoupleInfo) => {
      // 1. 立即更新状态 + 写 localStorage（同步操作，绝不会失败）
      setCoupleInfo(newInfo);
      saveCoupleInfo(newInfo);

      // 2. 后台同步到云端（失败不影响本地）
      if (user) {
        try {
          await supabase.from("couple_data").upsert({
            user_id: user.id,
            data: newInfo,
          });
        } catch {
          // 静默忽略云端错误，本地数据已保存
        }
      }
    },
    [user]
  );

  const hasSetup = !!coupleInfo.startDate && !!coupleInfo.partner1Name;

  return { coupleInfo, updateCoupleInfo, hasSetup, loaded };
}
