# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev      # 开发模式，启动 http://localhost:3000
npm run build    # 生产构建，静态导出到 out/ 目录
npm run lint     # ESLint 代码检查
```

## 技术栈

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **TailwindCSS 4**（通过 `@import "tailwindcss"` 引入，自定义颜色在 `globals.css` 的 `@theme inline` 中定义）
- **lucide-react** 图标库
- 部署目标：静态导出 (`output: "export"`)，basePath 为 `/love-calender`（GitHub Pages）

## 架构概览

### 数据流
```
localStorage ←→ src/lib/storage.ts ←→ src/hooks/useLoveData.ts ←→ 组件
```

- **数据层**：所有数据存储在浏览器 `localStorage` 中，键名为 `love-calendar-couple-info`
- **状态管理**：`useLoveData()` 是唯一的数据入口，返回 `{ coupleInfo, updateCoupleInfo, hasSetup, loaded }`
- **没有后端/API**，纯客户端应用
- 所有页面组件都有 `"use client"` 指令

### 核心类型 (`src/types/index.ts`)
- `CoupleInfo`：双方名字、开始日期、生日、自定义纪念日
- `Anniversary`：自定义纪念日（id, name, date, repeatYearly）
- `DEFAULT_COUPLE_INFO`：空数据默认值

### 数据层 (`src/data/`)
- `holidays.ts`：内置节日（情人节、七夕、圣诞等），每个节日有 month/day/type
- `quotes.ts`：30条恋爱语录，`getTodayQuote()` 根据年内第几天选取，同一天不换
- `surprises.ts`：惊喜建议库，按场景（生日/周年/情人节等）分组，每条有 category（flower/gift/date/surprise）

### 工具函数 (`src/lib/`)
- `dateUtils.ts`：`daysSinceStart()`、`daysUntil()`、`daysBetween()`、`formatChineseDate()` 等日期计算
- `storage.ts`：`getCoupleInfo()` / `saveCoupleInfo()` 封装 localStorage 读写

### 路由
- `/` — 首页（LoveDays + ReminderList + SurpriseCard + Countdown + LoveQuote）
- `/settings` — 设置页（完整表单：基本信息、生日、自定义纪念日）
- `/_not-found` — 404 页面（Next.js 自动生成）

### 页面显示逻辑
- **LoveDays**：恋爱第N天（特殊天数 100/200/365/520/999/1000/1314 有庆祝动画）
- **ReminderList**：筛选 ≤7 天内的事件，按紧迫度分级高亮（0天=今天、1-3天、4-7天）；无临近事件时组件返回 null 隐藏
- **SurpriseCard**：自动匹配最近事件到场景，4个 Tab 切换（送花/礼物/约会/惊喜），可展开查看全部
- **Countdown**：展示最近4个即将到来的事件（周年、生日、节日、自定义纪念日）
- **LoveQuote**：每日一条语录，用引号图标包裹

## 重要约束

- **React Rules of Hooks**：所有 `useState`/`useMemo`/`useEffect` 必须在组件顶层无条件调用，不能放在 `if`/早期 `return` 之后（SurpriseCard 曾因此崩溃）
- **basePath**：因为部署在 GitHub Pages 的 `/love-calender` 路径下，`next.config.ts` 中设置了 `basePath: "/love-calender"`。本地开发时不影响（dev server 忽略 basePath）
- **Next.js 16 兼容性**：部分 Cloudflare 适配器还不支持 Next.js 16（如 `@cloudflare/next-on-pages` 只支持到 15.x）。静态导出模式避开了这个问题
- **纯客户端**：不支持 SSR/SSG 数据获取（没有 `fetch`），所有数据来自 localStorage
