// ===== 数据版本号 =====
// 当数据结构发生变化时，递增此版本号并编写对应的迁移函数
export const STORAGE_VERSION = 4;

// ===== 打卡任务 =====
export interface Task {
  id: string;
  title: string;            // "说早安"
  emoji: string;            // ""
  completedDates: string[]; // ["2026-05-30", "2026-05-29"]
}

// ===== 愿望 =====
export interface Wish {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;  // "2026-05-30"
}

// ===== 照片 =====
export interface Photo {
  id: string;
  data: string;   // base64 压缩后的图片数据
  caption: string; // 照片说明
  date: string;    // 上传日期 "2026-05-30"
}

// ===== 纪念日 =====
export interface Anniversary {
  id: string;
  name: string;        // 如 "第一次牵手"
  date: string;        // "2025-06-15"
  repeatYearly: boolean; // 是否每年重复
}

// ===== 情侣核心信息 =====
export interface CoupleInfo {
  partner1Name: string;    // 你的名字
  partner2Name: string;    // 对方的名字
  startDate: string;       // 在一起的日期 "2025-05-20"
  partner1Birthday: string; // 你的生日
  partner2Birthday: string; // 对方的生日
  customAnniversaries: Anniversary[]; // 自定义纪念日
  photos: Photo[];           // 情侣相册
  wishes: Wish[];            // 共同愿望清单
  tasks: Task[];             // 情侣打卡
}

// ===== 默认值 =====
export const DEFAULT_COUPLE_INFO: CoupleInfo = {
  partner1Name: "",
  partner2Name: "",
  startDate: "",
  partner1Birthday: "",
  partner2Birthday: "",
  customAnniversaries: [],
  photos: [],
  wishes: [],
  tasks: [],
};
