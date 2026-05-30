import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/ui/Header";
import TabBar from "@/components/ui/TabBar";
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
  manifest: "/love-calender/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "恋爱日历",
  },
};

export const viewport: Viewport = {
  themeColor: "#f28482",
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
        <link rel="apple-touch-icon" href="/love-calender/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#f26373" />
      </head>
      <body className="min-h-full flex flex-col pb-16 sm:pb-18">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <TabBar />
        </AuthProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
