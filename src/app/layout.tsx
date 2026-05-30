import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/ui/Header";
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
        {/* 防闪烁：在页面渲染前读取主题偏好 */}
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
      </head>
      <body className="min-h-full flex flex-col bg-cream-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
