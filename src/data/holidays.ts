export interface Holiday {
  id: string;
  name: string;
  emoji: string;
  month: number;  // 1-12
  day: number;    // 1-31
  type: "western" | "chinese" | "couple";
}

/**
 * 情侣节日列表
 * 七夕使用公历近似日期（每年农历七月初七对应的公历不同）
 * 2025年七夕≈8月29日, 2026年≈8月19日, 这里用近似值，后期可接入农历库
 */
export const HOLIDAYS: Holiday[] = [
  { id: "valentine", name: "情人节", emoji: "", month: 2, day: 14, type: "western" },
  { id: "white-valentine", name: "白色情人节", emoji: "", month: 3, day: 14, type: "western" },
  { id: "520", name: "520 表白日", emoji: "", month: 5, day: 20, type: "couple" },
  { id: "qixi-2026", name: "七夕", emoji: "✨", month: 8, day: 19, type: "chinese" },
  { id: "qixi-2027", name: "七夕", emoji: "✨", month: 8, day: 8, type: "chinese" },
  { id: "mid-autumn-2026", name: "中秋节", emoji: "", month: 9, day: 12, type: "chinese" },
  { id: "christmas", name: "圣诞节", emoji: "", month: 12, day: 25, type: "western" },
  { id: "new-year-eve", name: "跨年夜", emoji: "", month: 12, day: 31, type: "western" },
];
