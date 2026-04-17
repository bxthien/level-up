import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "LevelUp",
  description: "Daily tasks, habits, and personal progress tracking.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "LevelUp",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
          <div className="mx-auto w-full max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="font-semibold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              LevelUp
            </div>
            <nav className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <a className="hover:text-violet-600 dark:hover:text-violet-300 hover:underline transition-colors" href="/today">
                Today
              </a>
              <a className="hover:text-violet-600 dark:hover:text-violet-300 hover:underline transition-colors" href="/habits">
                Habits
              </a>
              <a className="hover:text-violet-600 dark:hover:text-violet-300 hover:underline transition-colors" href="/journal">
                Journal
              </a>
              <a className="hover:text-violet-600 dark:hover:text-violet-300 hover:underline transition-colors" href="/dashboard">
                Dashboard
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1 bg-violet-50/20 dark:bg-slate-900/30">
          <div className="mx-auto w-full max-w-5xl px-4 py-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
