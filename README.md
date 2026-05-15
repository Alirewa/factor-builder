<div dir="rtl">

# فاکتورساز اختصاصی اپلای فا

ابزار آنلاین ساخت فاکتور حرفه‌ای فارسی — رایگان، بدون نیاز به ثبت‌نام، با پشتیبانی کامل از زبان فارسی و چیدمان راست‌به‌چپ.

[🔗 دمو زنده](https://factor.applyfa.com) &nbsp;|&nbsp; [📖 English Docs](#english)

---

## ✨ امکانات

- **۴ قالب حرفه‌ای** — مدرن، کورپوریت، رسمی، مینیمال
- **پیش‌نمایش زنده** — تغییرات لحظه‌ای در کنار فرم
- **دانلود PDF با کیفیت بالا** — خروجی pixel-perfect با فونت وزیرمتن
- **چاپ مستقیم** — فقط فاکتور چاپ می‌شود، بدون رابط کاربری
- **ذخیره تا ۱۰ فاکتور** — ذخیره‌سازی کاملاً محلی (localStorage)
- **آپلود لوگو و امضا** — نمایش در فاکتور نهایی
- **انواع سند** — فاکتور فروش، فاکتور خرید، پیش‌فاکتور
- **تم روشن و تاریک**
- **رسپانسیو** — موبایل، تبلت و دسکتاپ
- **PWA** — قابل نصب روی موبایل

---

## 🛠 تکنولوژی‌ها

| ابزار | نسخه | کاربرد |
|-------|-------|--------|
| Next.js | 16 | فریم‌ورک اصلی (App Router) |
| React | 19 | رابط کاربری |
| Tailwind CSS | v4 | استایل‌دهی |
| Zustand | 5 | مدیریت state |
| Framer Motion | 12 | انیمیشن |
| html-to-image | 1.11 | تبدیل HTML به تصویر |
| jsPDF | 4 | ساخت PDF |
| Vazirmatn | — | فونت فارسی |

---

## 🚀 راه‌اندازی محلی

```bash
# کلون کردن پروژه
git clone https://github.com/Alirewa/factor-builder-Fa.git
cd factor-builder-Fa

# نصب پکیج‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

مرورگر را روی `http://localhost:3000` باز کنید.

---

## 📦 بیلد و دیپلوی

### خروجی استاتیک — cPanel / DirectAdmin / هر هاست معمولی

```bash
npm run build
# پوشه out/ ساخته می‌شود — آماده آپلود
```

محتوای پوشه `out/` را روی `public_html` یا subdomain موردنظر آپلود کنید.

**ساخت Subdomain در cPanel:**
1. وارد **Domains** یا **Subdomains** شوید
2. subdomain بسازید: `factor.applyfa.com`
3. Document Root را روی `public_html/factor` تنظیم کنید
4. فایل‌های `out/` را آپلود کنید

> فایل `.htaccess` داخل `out/` قرار دارد — حتماً آپلود شود (نمایش فایل‌های hidden را در File Manager فعال کنید).

### Netlify

پوشه `out/` را مستقیم روی [netlify.com](https://netlify.com) drag & drop کنید.
یا تنظیمات زیر را در Netlify وارد کنید:

```
Build command:    npm run build
Publish directory: out
```

---

## 📁 ساختار پروژه

```
src/
├── app/
│   ├── page.tsx            # صفحه اصلی
│   ├── layout.tsx          # لایه اصلی
│   └── globals.css         # استایل‌های عمومی
├── components/
│   ├── invoice/
│   │   ├── templates/      # قالب‌های ۴گانه
│   │   ├── InvoicePreview  # پیش‌نمایش زنده
│   │   ├── InvoiceItems    # اقلام فاکتور
│   │   └── ...
│   ├── layout/             # Navbar, ThemeProvider
│   └── ui/                 # کامپوننت‌های عمومی
├── hooks/                  # هوک‌های سفارشی
├── lib/                    # توابع کمکی (PDF, utils)
├── store/                  # Zustand store
└── types/                  # تایپ‌های TypeScript
```

---

## 👤 توسعه‌دهنده

ساخته شده با ❤️ توسط **[علیرضا پورغلام](https://github.com/alirewa)**

</div>

---

<a name="english"></a>

<div dir="ltr">

# Factor Builder — Persian Invoice Generator

A free, no-signup online invoice builder with full Persian (Farsi) RTL support.  
Generate professional invoices, download as PDF, or print — entirely in the browser.

[🔗 Live Demo](https://factor.applyfa.com) &nbsp;|&nbsp; [📖 راهنمای فارسی](#top)

---

## ✨ Features

- **4 professional templates** — Modern, Corporate, Formal, Minimal
- **Live preview** — See changes instantly beside the form
- **High-quality PDF export** — Pixel-perfect output with Vazirmatn Persian font
- **Direct print** — Prints only the invoice, no app UI included
- **Save up to 10 invoices** — Fully local (localStorage), no account needed
- **Logo & signature upload** — Displayed in the final invoice
- **Document types** — Sale invoice, Purchase invoice, Proforma invoice
- **Light & dark theme**
- **Fully responsive** — Mobile, tablet, and desktop
- **PWA ready** — Installable on mobile devices

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16 | Framework (App Router) |
| React | 19 | UI library |
| Tailwind CSS | v4 | Styling |
| Zustand | 5 | State management |
| Framer Motion | 12 | Animations |
| html-to-image | 1.11 | HTML → image capture |
| jsPDF | 4 | PDF generation |
| Vazirmatn | — | Persian font |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Alirewa/factor-builder-Fa.git
cd factor-builder-Fa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📦 Build & Deploy

### Static export — cPanel / DirectAdmin / any shared host

```bash
npm run build
# Generates the out/ directory — ready to upload
```

Upload the **contents** of `out/` (not the folder itself) to your `public_html` or subdomain folder.

**Subdomain setup in cPanel:**
1. Go to **Domains** → **Subdomains**
2. Create: `factor.yourdomain.com`
3. Set Document Root to `public_html/factor`
4. Upload contents of `out/` there

> The `.htaccess` file inside `out/` must be uploaded — enable "Show Hidden Files" in File Manager.

### Netlify

Drag & drop the `out/` folder on [netlify.com](https://netlify.com), or configure:

```
Build command:     npm run build
Publish directory: out
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx            # Main page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── invoice/
│   │   ├── templates/      # 4 invoice templates
│   │   ├── InvoicePreview  # Live preview panel
│   │   ├── InvoiceItems    # Line items table
│   │   └── ...
│   ├── layout/             # Navbar, ThemeProvider
│   └── ui/                 # Shared UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (PDF export, helpers)
├── store/                  # Zustand store
└── types/                  # TypeScript types
```

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 👤 Author

Built with ❤️ by **[Alireza Pourgholam](https://github.com/alirewa)**

</div>
