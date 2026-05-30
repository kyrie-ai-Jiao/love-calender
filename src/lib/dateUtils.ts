/**
 * 计算两个日期之间的天数差
 * 例如：2025-05-20 到 2025-08-27 = 99 天
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 计算从某天到今天的天数
 * 返回的数字就是"恋爱第N天"
 * 注意：如果 startDate 是 5月20日，那 5月20日当天就是第1天
 */
export function daysSinceStart(startDate: string): number {
  const today = new Date();
  // 只比较日期部分，忽略时间
  const todayStr = formatDateStr(today);
  const days = daysBetween(startDate, todayStr);
  return days + 1; // 当天算第1天
}

/**
 * 计算周年纪念的年份数
 * 例如：2025-05-20 开始，今天是 2026-05-15，返回 0（还没到1周年）
 * 例如：2025-05-20 开始，今天是 2026-06-01，返回 1
 */
export function getAnniversaryYears(startDate: string): number {
  const today = new Date();
  const start = new Date(startDate);
  return (
    today.getFullYear() -
    start.getFullYear() -
    (today.getMonth() < start.getMonth() ||
    (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())
      ? 1
      : 0)
  );
}

/**
 * 计算距离某个日期还有多少天（通用倒计时）
 * 自动处理跨年
 */
export function daysUntil(targetMonth: number, targetDay: number): number {
  const today = new Date();
  const currentYear = today.getFullYear();

  const target = new Date(currentYear, targetMonth - 1, targetDay);

  if (target < today) {
    // 今年的已经过了，算明年的
    target.setFullYear(currentYear + 1);
  }

  const todayStr = formatDateStr(today);
  const targetStr = formatDateStr(target);
  return daysBetween(todayStr, targetStr);
}

/**
 * 把今天的日期格式化为 "YYYY-MM-DD" 字符串
 */
export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 格式化日期为中文显示
 * 例如：2025-05-20 → "2025年5月20日"
 */
export function formatChineseDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}
