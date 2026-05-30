"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ArrowLeft,
  Heart,
  Calendar,
  Cake,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { useLoveData } from "@/hooks/useLoveData";
import { CoupleInfo, Anniversary } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const { coupleInfo, updateCoupleInfo } = useLoveData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CoupleInfo>(coupleInfo);
  const [saved, setSaved] = useState(false);
  const [importMsg, setImportMsg] = useState("");

  // 从 coupleInfo 同步到表单（仅在首次加载时）
  // 当 coupleInfo 有数据时，同步到表单
  useEffect(() => {
    if (coupleInfo.partner1Name) {
      setForm(coupleInfo);
    }
  }, [coupleInfo]);

  const handleFieldChange = (field: keyof CoupleInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
          onClick={() => router.push("/")}
          className="p-2 -ml-2 rounded-xl hover:bg-coral-50 text-warm-400 hover:text-coral-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-warm-800">设置</h1>
      </div>

      {/* 基本信息 */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-coral-400 fill-coral-400" />
          <h2 className="text-sm font-semibold text-warm-800">基本信息</h2>
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
          <Cake className="w-4 h-4 text-coral-400" />
          <h2 className="text-sm font-semibold text-warm-800">生日设置</h2>
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
            <Calendar className="w-4 h-4 text-coral-400" />
            <h2 className="text-sm font-semibold text-warm-800">自定义纪念日</h2>
          </div>
          <button
            onClick={addAnniversary}
            className="flex items-center gap-1 text-xs text-coral-400 hover:text-coral-600 font-medium cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加
          </button>
        </div>

        {form.customAnniversaries.length === 0 ? (
          <p className="text-xs text-warm-400 text-center py-4">
            还没有自定义纪念日，点击「添加」来记录第一次牵手、第一次旅行等特殊日子
          </p>
        ) : (
          <div className="space-y-3">
            {form.customAnniversaries.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-col sm:flex-row gap-2 p-3 bg-warm-50 rounded-2xl"
              >
                <input
                  type="text"
                  value={ann.name}
                  onChange={(e) =>
                    updateAnniversary(ann.id, "name", e.target.value)
                  }
                  placeholder="纪念日名称"
                  className="flex-1 min-w-0 bg-white dark:bg-warm-800/50 dark:text-warm-200 border border-warm-200 dark:border-warm-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={ann.date}
                    onChange={(e) =>
                      updateAnniversary(ann.id, "date", e.target.value)
                    }
                    className="flex-1 sm:flex-initial sm:w-36 bg-white dark:bg-warm-800/50 dark:text-warm-200 border border-warm-200 dark:border-warm-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-coral-300 transition-colors"
                  />
                  <button
                    onClick={() => removeAnniversary(ann.id)}
                    className="p-2 text-warm-400 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
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

      {/* ===== 数据导入/导出 ===== */}
      <Card>
        <h2 className="text-sm font-semibold text-warm-800 mb-1">数据管理</h2>
        <p className="text-xs text-warm-400 mb-4">导出备份或从备份恢复数据</p>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              const json = JSON.stringify(coupleInfo, null, 2);
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `love-calendar-backup-${new Date().toISOString().split("T")[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setImportMsg("数据已导出");
              setTimeout(() => setImportMsg(""), 2000);
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4" />
            导出备份
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Upload className="w-4 h-4" />
            导入备份
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const data = JSON.parse(reader.result as string) as CoupleInfo;
                  // 基础验证：必须有 partner1Name 和 startDate
                  if (!data.partner1Name || !data.startDate) {
                    setImportMsg("文件格式不正确");
                    setTimeout(() => setImportMsg(""), 3000);
                    return;
                  }
                  updateCoupleInfo(data);
                  setForm(data);
                  setImportMsg("数据已恢复");
                  setTimeout(() => setImportMsg(""), 2000);
                } catch {
                  setImportMsg("文件格式不正确");
                  setTimeout(() => setImportMsg(""), 3000);
                }
              };
              reader.readAsText(file);
              e.target.value = "";
            }}
          />
        </div>

        {importMsg && (
          <p className="text-xs text-coral-400 text-center mt-3 font-medium">
            {importMsg}
          </p>
        )}
      </Card>

      <p className="text-xs text-warm-400 text-center pb-6">
        数据保存在你的浏览器中，不会上传到任何服务器
      </p>
    </div>
  );
}
