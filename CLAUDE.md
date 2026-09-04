# راهنمای پروژه وزارت سحر و جادو

## خلاصه پروژه

تلگرام مینی‌پ (PWA) شامل:
- **کوییز** تعیین گروه هاگوارتز
- **بانک گرینگوتس** با سیستم اقتصادی
- **کلاس‌های جادویی** و **ادارات وزارت**
- **آرشیو تاریخی** ویکی‌محور با ۱۶۳ فصل در ۱۸ جلد
- **بک‌اند** SQLite با API
- **MCP Server** برای دسترسی AI

## اجرا

```bash
npm run dev          # سرور توسعه (localhost:3001)
npm run build        # بیلد Next.js
npm run db:seed      # بازسازی دیتابیس از فایل‌های MD
```

## معماری داده

**دیتابیس (SQLite) منبع حقیقت است.**

```
archive/*.md  ──→  db:seed  ──→  data/wiki.db  ──→  API routes  ──→  فرانت‌اند
                                      ↑
                              ویرایش ویکی (وب + MCP)
```

- `archive/` — فایل‌های MD اصلی (نسخه پشتیبان و منبع اولیه محتوا)
- `data/wiki.db` — دیتابیس SQLite (منبع حقیقت اپلیکیشن)
- `src/app/api/archive/` — API routes که مستقیماً از دیتابیس می‌خوانند
- `src/lib/archive/db.ts` — لایه دسترسی به دیتابیس (پارس metadata از MD)
- `mcp-server.ts` — سرور MCP برای دسترسی AI

## ساختار پروژه

```
src/
  app/
    api/
      archive/     → API routes (catalog, characters, timeline, chapter)
      wiki/        → API ویکی (خواندن/ذخیره صفحات)
    archive/       → صفحات آرشیو
    bank/          → بانک گرینگوتس
    classes/       → کلاس‌های جادویی
    departments/   → ادارات وزارت
    profile/       → شناسنامه
    quiz/          → کوییز
    result/        → نتیجه کوییز
  components/      → کامپوننت‌ها (NavBar, WikiEditor, etc.)
  lib/
    archive/       → داده آرشیو (db.ts, catalog.ts, types.ts)
    db/            → دیتابیس SQLite (schema)
    wiki/          → سیستم ویکی (store, hooks)
    ministry/      → سیستم وزارت (types, store, content)

archive/         → فایل‌های MD اصلی آرشیو (۱۸ جلد)
scripts/         → اسکریپت‌ها (seed-db.mjs)
data/            → دیتابیس SQLite + بک‌آپ‌ها
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
| `/api/archive/catalog` | GET | فهرست جلدها و فصل‌ها |
| `/api/archive/characters` | GET | لیست شخصیت‌ها |
| `/api/archive/timeline` | GET | خط زمانی |
| `/api/archive/chapter?slug=X` | GET | محتوای یک فصل |
| `/api/auth/telegram` | POST | لاگین تلگرام |
| `/api/wiki/[slug]` | GET/PUT | خواندن/ذخیره صفحه ویکی |
| `/api/wiki/lock` | POST/DELETE | قفل/آزادسازی |
| `/api/wiki/history/[slug]` | GET | تاریخچه ادیت |

## MCP Server

`mcp-server.ts` — ابزارها: list_pages, get_page, save_page, search_pages, get_history, list_users, get_timeline, setup_admin

برای فعال‌سازی در Claude Code:
```
claude config set mcpServers.vezaratjadoo.command npx
claude config set mcpServers.vezaratjadoo.args '["tsx","mcp-server.ts"]'
```

## دیپلوی

- GitHub: mrfelfel/persian-pottermore-quiz
- Vercel: vezaratjadoo.vercel.app
- Build command: `npm run build`

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

- ۱۸ جلد + پرونده‌های ویژه + ضمیمه
- ۱۶۳ فصل در `archive/` (فایل‌های MD)
- ۱۴ شخصیت در `archive/06-volume-6-characters/`
- فهرست: `archive/INDEX.md`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
