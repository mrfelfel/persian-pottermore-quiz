# راهنمای پروژه وزارت سحر و جادو

## خلاصه پروژه

این یک تلگرام مینی‌پ (PWA) هست که شامل:
- **کوییز** تعیین گروه هاگوارتز
- **بانک گرینگوتس** با سیستم اقتصادی
- **کلاس‌های جادویی** و **ادارات وزارت**
- **آرشیو تاریخی** ویکی‌محور با ۱۶۳ فصل در ۱۶ جلد
- **بک‌اند** SQLite با API
- **MCP Server** برای دسترسی AI

## اجرا

```bash
npm run dev          # سرور توسعه
npm run build        # بیلد + seed دیتابیس
npm run db:seed      # فقط seed دیتابیس
npm run archive:build # فقط بیلد آرشیو MD → JSON
```

سرور توسعه: http://localhost:3000

## ساختار پروژه

```
src/
  app/           → صفحات Next.js (App Router)
  components/    → کامپوننت‌ها (NavBar, WikiEditor, etc.)
  lib/
    archive/     → داده آرشیو (catalog, types, data/*.json)
    db/          → دیتابیس SQLite (schema, client)
    wiki/        → سیستم ویکی (store, hooks)
    ministry/    → سیستم وزارت (types, store, content)
    twa.ts       → ابزارهای تلگرام

archive/         → فایل‌های MD اصلی آرشیو (۱۶ جلد)
scripts/         → اسکریپت‌ها (build-archive.mjs, seed-db.mjs)
data/            → دیتابیس SQLite (gitignored)
mcp-server.ts    → سرور MCP برای دسترسی AI
```

## دیتابیس

SQLite در `data/wiki.db` با ۴ جدول:
- **users** — کاربران (telegram_id, first_name, role)
- **wiki_pages** — صفحات ویکی (slug, content, volume)
- **edit_history** — تاریخچه ادیت
- **edit_locks** — قفل همزمان (۳۰ دقیقه)

ادمین: `theAIGOD` (telegram_id: 999999999, role: admin)

## API Routes

| Route | Method | توضیح |
|-------|--------|-------|
| `/api/auth/telegram` | POST | لاگین تلگرام |
| `/api/wiki/[slug]` | GET/PUT | خواندن/ذخیره صفحه |
| `/api/wiki/lock` | POST/DELETE | قفل/آزادسازی |
| `/api/wiki/history/[slug]` | GET | تاریخچه ادیت |

## MCP Server

برای دسترسی AI به دیتابیس از `mcp-server.ts` استفاده کن.
ابزارها: list_pages, get_page, save_page, search_pages, get_history, list_users, get_timeline, setup_admin

برای فعال‌سازی در Claude Code:
```
claude config set mcpServers.vezaratjadoo.command npx
claude config set mcpServers.vezaratjadoo.args '["tsx","mcp-server.ts"]'
```

## دیپلوی

- GitHub: mrfelfel/persian-pottermore-quiz
- Vercel: vezaratjadoo.vercel.app
- Build command: `npm run build` (شامل archive build + seed + next build)

## قوانین محتوا

- لحن: شخصی، صمیمی، اول‌شخص — نه دانشگاهی
- «آودیتوره» محور اصلی تاریخ
- هیوا ≠ کرولاین مایکلسون (نامشخص)
- هیوا = ازبورن/ارتمیس، رئیس بانک گرینگوتس مجیا
- ساقی (نه سگی)
- Telgwarts (نه Telgowarts)
- «از نخست تا همیشه» برای کیمیا و کوروش
- «زن» → «دختر» در جاهای مناسب

## محتوای آرشیو

- ۱۶ جلد + پرونده‌های ویژه + ضمیمه
- ۱۶۳ فصل در `archive/` (فایل‌های MD)
- ۱۴ شخصیت در `archive/06-volume-6-characters/`
- فهرست: `archive/INDEX.md`
