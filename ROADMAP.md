# ROADMAP — Mebel Online New

> **Dibuat:** 2026-06-22
> **Lokasi Proyek:** `C:\Users\USER\projek real\mebel-online-new`
> **GitHub:** `https://github.com/mebelonline-projek/mebel-online-new`
> **Domain Vercel:** `mebelonline.id`

---

## 📋 STATUS TERKINI

### ✅ TAHAP 1-3: SELESAI (Inisialisasi, UI Components, Landing Page)

**Config & Foundation:**
- Next.js 15.5.19 STABLE, TypeScript, Tailwind CSS v4, Turbopack
- Prisma 7.8.0 + PostgreSQL via Supabase (6 models: Admin, Category, Product, PasswordResetToken, RateLimit, SiteConfig)
- Singleton Prisma Client → `src/lib/prisma.ts`
- Brand colors: Maroon #B31324, Orange #F5A300, Cream #FDF8F5
- Fonts: Inter, Fredoka, Poppins

**UI Components (13):**
button, card, input, label, badge, skeleton, separator, textarea, dialog, alert-dialog, avatar, select, table

**Landing Page (10 komponen):**
Navbar, Hero, ProductGrid, ProductCard, ProductVariantPicker, AboutSection, ContactSection, Footer, WhatsAppButton, SocialIcon

### ✅ TAHAP 4-7: SELESAI (Auth, API, Admin Dashboard)

**Library Layer (7 file):**
- `src/lib/auth.config.ts` — NextAuth v5 config (JWT 30 menit, pages, callbacks)
- `src/lib/auth.ts` — Credentials provider + bcrypt
- `src/lib/api-auth.ts` — requireAdmin() helper
- `src/lib/rate-limit.ts` — Database-based rate limiter (forgot: 3/15menit, reset: 5/15menit)
- `src/lib/email.ts` — Resend email template (branded HTML)
- `src/lib/upload.ts` — Supabase Storage (upload, delete, base64)
- `src/middleware.ts` — Proteksi /admin/dashboard/* via NextAuth

**API Routes (12 file):**
- `[...nextauth]/route.ts` — NextAuth handler
- `auth/change-password/route.ts` — Verifikasi current password + bcrypt
- `auth/forgot-password/route.ts` — Rate limited, bcrypt hashed tokens
- `auth/reset-password/route.ts` — BCrypt token matching
- `products/route.ts` — GET (public) + POST (admin)
- `products/[id]/route.ts` — GET + PUT (renumber otomatis) + DELETE (hapus foto)
- `products/by-category/route.ts` — Admin helper
- `products/renumber/route.ts` — Reset semua sortOrder
- `categories/route.ts` — GET/POST/PUT/DELETE (lengkap renumber)
- `categories/renumber/route.ts` — Reset semua sortOrder
- `settings/route.ts` — GET (public) + PUT (admin, auto-delete foto lama)
- `upload/route.ts` — Admin upload (file validation, type check, max 5MB)

**Admin Auth Pages (3):**
- `admin/login/page.tsx` — Login form dengan animasi, eye toggle
- `admin/forgot-password/page.tsx` — Email form + success state
- `admin/reset-password/page.tsx` — Token validation + password form

**Admin Dashboard (7 file):**
- `admin/dashboard/layout.tsx` — Sidebar + Header + SessionProvider
- `admin/dashboard/page.tsx` — Stats card (total/active/inactive products + categories)
- `admin/dashboard/products/page.tsx` — CRUD table + ImageUploader + pagination
- `admin/dashboard/categories/page.tsx` — CRUD table + renumber
- `admin/dashboard/settings/page.tsx` — 6 section form (Brand, Hero, About, Contact, WA, Footer)
- `admin/dashboard/profile/page.tsx` — Profile info + change password
- `components/admin/Sidebar.tsx` — Collapsible sidebar dengan icon
- `components/admin/AdminHeader.tsx` — Avatar + session info
- `components/admin/ImageUploader.tsx` — Drag-drop + preview + upload button

---

## 🔐 KREDENSIAL TERISI

| Variabel | Status |
|----------|--------|
| `DATABASE_URL` | ✅ IPv4 direct Supabase |
| `DIRECT_URL` | ✅ IPv4 direct Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `AUTH_SECRET` | ✅ |
| `RESEND_API_KEY` | ✅ `re_Rcos6btn_147v6rK7rZzAggp2pKZzjgxm` |
| `RESEND_FROM_EMAIL` | ✅ `onboarding@resend.dev` |
| `NEXT_PUBLIC_APP_URL` | ✅ `http://localhost:3000` |

---

## 🐛 MASALAH DARI PROYEK LAMA (YANG SUDAH DIHINDARI)

1. **Koneksi database** — Langsung pakai `direct.supabase.com:5432` (tidak pakai pooler 6543 yang bermasalah SNI)
2. **Dependency hell** — Next.js 15.5.19 STABLE (tidak kena auto-upgrade ke v16)
3. **Env vars bersih** — Tidak ada Vercel auto-inject `POSTGRES_*` (mulai dari Vercel project baru)
4. **Build cache bersih** — Proyek baru, tidak ada cache corrupt dari build gagal sebelumnya
5. **Kode bersih** — Tidak ada hotfix bertumpuk + 18+ commit kacau

---

## ⏳ YANG PERLU DILAKUKAN DI CHAT BERIKUTNYA

### 🔴 PRIORITAS TINGGI
1. **Build & test** — `npm run build` untuk verifikasi kompilasi
2. **Prisma generate** — `npx prisma generate` untuk regenerasi client
3. **Deploy ke Vercel** — Pastikan env vars sudah di-set di Vercel Dashboard
4. **Seed admin** — Jalankan seed untuk admin default (email: admin@muarateweh.com, password: admin123)

### 🟡 PRIORITAS SEDANG
5. **Test login flow** — Cek auth, session, middleware berfungsi
6. **Test CRUD produk** — Tambah/edit/hapus produk dari admin
7. **Test CRUD kategori** — Tambah/edit/hapus kategori
8. **Test settings** — Simpan & baca pengaturan landing page
9. **Test upload gambar** — Upload file ke Supabase Storage

### 🟢 NICE TO HAVE
10. **Sitemap & robots.txt** — SEO (bisa copy dari proyek lama)
11. **Loading states** — Skeleton loading untuk admin pages
12. **Error boundaries** — Wrap dashboard components
13. **OpenGraph metadata** — Dinamis dari database

---

## 📂 STRUKTUR FILE LENGKAP

```
mebel-online-new/
├── .env                          # ✅ Semua credentials terisi
├── prisma/
│   └── schema.prisma             # 6 models
├── src/
│   ├── middleware.ts              # ✅ Auth protection
│   ├── lib/
│   │   ├── prisma.ts             # ✅ Singleton
│   │   ├── utils.ts              # ✅ cn() helper
│   │   ├── wa.ts                 # ✅ WhatsApp utility
│   │   ├── site-config.ts        # ✅ Settings manager
│   │   ├── auth.ts               # ✅ NextAuth + Credentials
│   │   ├── auth.config.ts        # ✅ Auth config
│   │   ├── api-auth.ts           # ✅ requireAdmin()
│   │   ├── rate-limit.ts         # ✅ Database rate limiter
│   │   ├── email.ts              # ✅ Resend (API key terisi)
│   │   └── upload.ts             # ✅ Supabase (service_role key terisi)
│   ├── types/index.ts            # ✅ All types defined
│   ├── app/
│   │   ├── layout.tsx            # ✅ Root layout
│   │   ├── globals.css           # ✅ Brand colors + animations
│   │   ├── page.tsx              # ✅ Landing page
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts     # ✅
│   │   │       ├── change-password/route.ts   # ✅
│   │   │       ├── forgot-password/route.ts   # ✅
│   │   │       └── reset-password/route.ts    # ✅
│   │   │   ├── products/
│   │   │   │   ├── route.ts                   # ✅
│   │   │   │   ├── [id]/route.ts              # ✅
│   │   │   │   ├── by-category/route.ts       # ✅
│   │   │   │   └── renumber/route.ts          # ✅
│   │   │   ├── categories/
│   │   │   │   ├── route.ts                   # ✅
│   │   │   │   └── renumber/route.ts          # ✅
│   │   │   ├── settings/route.ts              # ✅
│   │   │   └── upload/route.ts                # ✅
│   │   └── admin/
│   │       ├── login/page.tsx                 # ✅
│   │       ├── forgot-password/page.tsx       # ✅
│   │       ├── reset-password/page.tsx        # ✅
│   │       └── dashboard/
│   │           ├── layout.tsx                 # ✅
│   │           ├── page.tsx                   # ✅
│   │           ├── products/page.tsx          # ✅
│   │           ├── categories/page.tsx        # ✅
│   │           ├── settings/page.tsx          # ✅
│   │           └── profile/page.tsx           # ✅
│   └── components/
│       ├── ui/ (13 components)               # ✅
│       ├── landing/ (10 components)           # ✅
│       └── admin/
│           ├── Sidebar.tsx                   # ✅
│           ├── AdminHeader.tsx               # ✅
│           └── ImageUploader.tsx             # ✅
```

---

## 🚀 PERINTAH PENTING

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Build production
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema ke DB (jika ada perubahan)
```

---

## 🎯 UNTUK AI DI CHAT BERIKUTNYA

Proyek ini adalah **aplikasi web toko furniture (Muara Teweh Furniture)** dengan:
- **Frontend:** Landing page (publik) + Admin dashboard (login protected)
- **Backend:** Next.js 15.5.19 App Router, API Routes, Prisma + PostgreSQL Supabase
- **Auth:** NextAuth v5 (credentials, JWT 30 menit)
- **Storage:** Supabase Storage (upload/delete gambar)
- **Email:** Resend (reset password)

**Semua kode sudah lengkap dari Tahap 1-7.** Belum ada build test. Belum ada deploy. Mulai dengan `npm run build` untuk verifikasi.

**PENTING:** Jangan ubah kredensial di `.env`. Jangan upgrade Next.js ke v16. Jangan hapus proyek lama `mebel-online`.