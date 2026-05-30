import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/ui/Header";
import PwaRegister from "@/components/ui/PwaRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "恋爱日历 — 记录我们的每一天",
  description: "记录恋爱日期，提醒纪念日，发现惊喜灵感",
  // PWA manifest
  manifest: "/love-calender/manifest.json",
  // iOS 适配
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "恋爱日历",
  },
};

export const viewport: Viewport = {
  themeColor: "#f26373",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 主题防闪烁脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("love-calendar-theme");
                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else if (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.classList.add("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* iOS 图标 */}
        <link
          rel="apple-touch-icon"
          href="/love-calender/icons/icon.svg"
        />
        {/* iOS 全屏 */}
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        {/* 主题色 */}
        <meta name="theme-color" content="#f26373" />
      </head>
      <body className="min-h-full flex flex-col bg-cream-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
        <Header />
        <main className="flex-1">{children}</main>
        {/* PWA Service Worker 注册 */}
        <PwaRegister />
      </body>
    </html>
  );
}
