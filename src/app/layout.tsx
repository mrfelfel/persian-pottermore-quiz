import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TWAInit } from "@/components/TWAInit";
import { baseMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#17212b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = websiteJsonLd();
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <TWAInit>{children}</TWAInit>
      </body>
    </html>
  );
}
