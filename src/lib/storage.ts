import {
  CoupleInfo,
  DEFAULT_COUPLE_INFO,
  STORAGE_VERSION,
} from "@/types";

const STORAGE_KEY = "love-calendar-couple-info";

// ===== 存储格式 =====
interface StoredData {
  version: number;
  data: CoupleInfo;
}

// ===== 迁移函数注册表 =====
// 每个迁移函数接收旧数据，返回升级后的新数据
// 键 = 升级前的版本号 → 返回升级到下一个版本的数据
type MigrationFn = (data: CoupleInfo) => CoupleInfo;

const MIGRATIONS: Record<number, MigrationFn> = {
  // 版本1 → 版本2：新增 photos 字段
  1: (data) => ({
    ...data,
    photos: [],
  }),
  // 版本2 → 版本3：新增 wishes 字段
  2: (data) => ({
    ...data,
    wishes: [],
  }),
  // 版本3 → 版本4：新增 tasks 字段
  3: (data) => ({
    ...data,
    tasks: [],
  }),
};

/**
 * 从浏览器 localStorage 读取恋爱信息
 * - 首次访问返回默认空值
 * - 旧版本数据自动执行迁移
 * - 数据损坏时返回默认值
 */
export function getCoupleInfo(): CoupleInfo {
  if (typeof window === "undefined") {
    return DEFAULT_COUPLE_INFO;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_COUPLE_INFO;
  }

  let stored: StoredData;

  try {
    stored = JSON.parse(raw) as StoredData;
  } catch {
    // 数据损坏，返回默认值
    return DEFAULT_COUPLE_INFO;
  }

  // 兼容没有 version 字段的旧数据（视为版本0）
  if (typeof stored.version !== "number") {
    // 旧格式：可能直接存了 CoupleInfo 而没有外层 StoredData
    // 这种情况视为版本0，需要从版本0开始迁移
    const oldData = (stored as unknown as CoupleInfo);
    let migrated: CoupleInfo = oldData;
    let currentVersion = 0;

    while (currentVersion < STORAGE_VERSION) {
      const migrateFn = MIGRATIONS[currentVersion];
      if (migrateFn) {
        migrated = migrateFn(migrated);
      }
      currentVersion++;
    }

    // 保存迁移后的数据
    saveCoupleInfo(migrated);
    return migrated;
  }

  // 正常数据：检查版本并迁移
  let { version, data } = stored;
  let migrated = data;

  while (version < STORAGE_VERSION) {
    const migrateFn = MIGRATIONS[version];
    if (migrateFn) {
      migrated = migrateFn(migrated);
    }
    version++;
  }

  // 如果发生过迁移，更新 localStorage
  if (version !== stored.version) {
    saveCoupleInfo(migrated);
  }

  return migrated;
}

/**
 * 保存恋爱信息到浏览器 localStorage
 * 始终以最新版本格式写入
 */
export function saveCoupleInfo(info: CoupleInfo): void {
  if (typeof window === "undefined") return;

  const stored: StoredData = {
    version: STORAGE_VERSION,
    data: info,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
