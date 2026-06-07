# Persian Invoice Builder

A free, client-side Persian (Farsi) invoice generator. No backend, no sign-up — everything runs in your browser.

**[Live Demo](https://alirewa.github.io/factor-builder-Fa/)**

---

## Features

- **4 invoice templates** — Modern, Formal, Corporate, Minimal
- **Jalali (Shamsi) date picker** — native Persian calendar
- **PDF export & print** — single A4 page, scale-to-fit
- **RTL layout** — full right-to-left support with Vazirmatn font
- **Dark mode** — toggle light/dark
- **Save & load** — up to 10 invoices stored locally (localStorage)
- **Logo upload** — PNG/JPG/WEBP, shown in invoice header
- **Stamp & signature** — uploadable images
- **Invoice footer** — optional contact/address text
- **Tax & global discount** — percentage-based, capped at 100%
- **Up to 10 line items** per invoice
- **No data leaves your device**

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Date picker | react-multi-date-picker (Jalali) |
| PDF | jsPDF + html-to-image |
| Animations | Framer Motion |
| Font | Vazirmatn |

---

## Getting Started

```bash
git clone https://github.com/Alirewa/factor-builder-Fa.git
cd factor-builder-Fa
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build   # outputs to /out — deploy any static folder to any host
```

---

## Deployment

The `/out` folder is a fully static site. Upload it to:
- **cPanel / DirectAdmin** — upload contents of `out/` to `public_html`
- **GitHub Pages** — auto-deployed via GitHub Actions on every push to `master`
- **Netlify / Vercel** — connect repo, set build command `npm run build`, publish dir `out`

---

## License

MIT — free for personal and commercial use.

---

Built with ❤️ by [@alirewa](https://github.com/alirewa)
