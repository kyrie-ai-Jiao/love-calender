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

  // 加载数据：云端优先，本地兜底
  useEffect(() => {
    async function load() {
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
          // 云端没有数据 → 尝试从本地迁移
          const local = getCoupleInfo();
          if (local.partner1Name && local.startDate) {
            // 本地有数据 → 上传到云端
            await supabase.from("couple_data").upsert({
              user_id: user.id,
              data: local,
            });
            setCoupleInfo(local);
          } else {
            // 全新用户 → 创建空行
            await supabase.from("couple_data").upsert({
              user_id: user.id,
              data: DEFAULT_COUPLE_INFO,
            });
            setCoupleInfo(DEFAULT_COUPLE_INFO);
          }
        }
      } else {
        // 未登录：从 localStorage 加载
        setCoupleInfo(getCoupleInfo());
      }
      setLoaded(true);
    }
    load();
  }, [user]);

  // 更新数据：云端 + 本地同时写
  const updateCoupleInfo = useCallback(
    async (newInfo: CoupleInfo) => {
      setCoupleInfo(newInfo);
      // 本地兜底
      saveCoupleInfo(newInfo);
      // 云端同步
      if (user) {
        await supabase.from("couple_data").upsert({
          user_id: user.id,
          data: newInfo,
        });
      }
    },
    [user]
  );

  const hasSetup = !!coupleInfo.startDate && !!coupleInfo.partner1Name;

  return { coupleInfo, updateCoupleInfo, hasSetup, loaded };
}
