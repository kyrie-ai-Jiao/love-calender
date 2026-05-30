"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Calendar,
  Cake,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useLoveData } from "@/hooks/useLoveData";
import { CoupleInfo, Anniversary } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const { coupleInfo, updateCoupleInfo } = useLoveData();

  const [form, setForm] = useState<CoupleInfo>(coupleInfo);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(coupleInfo);
  }, [coupleInfo]);

  const handleFieldChange = (field: keyof CoupleInfo, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    updateCoupleInfo(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addAnniversary = () => {
    const newAnn: Anniversary = {
      id: Date.now().toString(),
      name: "",
      date: "",
      repeatYearly: true,
    };
    setForm({
      ...form,
      customAnniversaries: [...form.customAnniversaries, newAnn],
    });
  };

  const updateAnniversary = (
    id: string,
    field: keyof Anniversary,
    value: string | boolean
  ) => {
    setForm({
      ...form,
      customAnniversaries: form.customAnniversaries.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  const removeAnniversary = (id: string) => {
    setForm({
      ...form,
      customAnniversaries: form.customAnniversaries.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-xl hover:bg-love-50 text-gray-400 hover:text-love-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">设置</h1>
      </div>

      {/* 基本信息 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-love-400 fill-love-400" />
          <h2 className="text-sm font-semibold text-gray-700">基本信息</h2>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="你的名字"
              value={form.partner1Name}
              onChange={(v) => handleFieldChange("partner1Name", v)}
              placeholder="你的昵称"
            />
            <InputField
              label="对方的名字"
              value={form.partner2Name}
              onChange={(v) => handleFieldChange("partner2Name", v)}
              placeholder="TA的昵称"
            />
          </div>
          <InputField
            label="在一起的日期"
            value={form.startDate}
            onChange={(v) => handleFieldChange("startDate", v)}
            placeholder="2025-05-20"
            type="date"
          />
        </div>
      </Card>

      {/* 生日设置 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Cake className="w-4 h-4 text-love-400" />
          <h2 className="text-sm font-semibold text-gray-700">生日设置</h2>
        </div>
        <div className="space-y-3">
          <InputField
            label={`${form.partner1Name || "你"}的生日`}
            value={form.partner1Birthday}
            onChange={(v) => handleFieldChange("partner1Birthday", v)}
            type="date"
          />
          <InputField
            label={`${form.partner2Name || "TA"}的生日`}
            value={form.partner2Birthday}
            onChange={(v) => handleFieldChange("partner2Birthday", v)}
            type="date"
          />
        </div>
      </Card>

      {/* 自定义纪念日 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-love-400" />
            <h2 className="text-sm font-semibold text-gray-700">自定义纪念日</h2>
          </div>
          <button
            onClick={addAnniversary}
            className="flex items-center gap-1 text-xs text-love-500 hover:text-love-600 font-medium cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加
          </button>
        </div>

        {form.customAnniversaries.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            还没有自定义纪念日，点击「添加」来记录第一次牵手、第一次旅行等特殊日子
          </p>
        ) : (
          <div className="space-y-3">
            {form.customAnniversaries.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-2xl"
              >
                <input
                  type="text"
                  value={ann.name}
                  onChange={(e) =>
                    updateAnniversary(ann.id, "name", e.target.value)
                  }
                  placeholder="纪念日名称"
                  className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={ann.date}
                    onChange={(e) =>
                      updateAnniversary(ann.id, "date", e.target.value)
                    }
                    className="flex-1 sm:flex-initial sm:w-36 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-love-400 transition-colors"
                  />
                  <button
                    onClick={() => removeAnniversary(ann.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 保存按钮 */}
      <Button onClick={handleSave} variant="primary" className="w-full py-3">
        {saved ? (
          <>
            <span className="text-lg">✓</span>
            已保存
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            保存设置
          </>
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center pb-6">
        数据保存在你的浏览器中，不会上传到任何服务器
      </p>
    </div>
  );
}
