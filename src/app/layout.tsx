import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "گروه‌بندی هاگوارتز",
  description: "کدوم گروه هاگوارتزی تو هستی؟",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable}`}>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="bg-gray-950 text-white min-h-screen font-[family-name:var(--font-vazir)]">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
