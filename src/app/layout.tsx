import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";

export const metadata: Metadata = {
  title: "وزارت سحر و جادو",
  description: "جامعه جادوگری فارسی — وزارت سحر و جادوی ایران",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#17212b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
