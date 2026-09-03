import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "گروه‌بندی هاگوارتز",
  description: "کوییز گروه‌بندی هاگوارتز - کدوم گروه هاگوارتزی تویی؟",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable}`}>
      <body className="bg-gray-950 text-white min-h-screen font-[family-name:var(--font-vazir)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
