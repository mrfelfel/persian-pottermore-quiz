import type { Metadata } from "next";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";

export const metadata: Metadata = {
  title: "گروه‌بندی هاگوارتز ⚡",
  description: "کدوم گروه هاگوارتزی تو هستی؟",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
