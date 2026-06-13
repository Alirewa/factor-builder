# Persian Invoice Builder — فاکتورساز

A free, client-side Persian (Farsi) invoice generator. No backend, no sign-up — everything runs in your browser and stays on your device.

**[Live Demo](https://alirewa.github.io/Factor-Builder/)** &nbsp;|&nbsp; Demo license key: `FACTO-RSAZ0-PUBLI-CDEMO`

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
- **License gate** — SHA-256–protected entry screen
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
git clone https://github.com/Alirewa/Factor-Builder.git
cd factor-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The default license key for development is `FACTO-RSAZ0-PUBLI-CDEMO`.

### Build for production

```bash
npm run build   # outputs to /out — deploy any static folder to any host
```

---

## License Gate

The app opens with a license screen. The valid key is verified client-side using SHA-256 — the plaintext key is never stored in source code.

### Changing the license key

1. Pick a 20-character alphanumeric key (e.g. `MYKEY-12345-ABCDE-XYZ99`).
2. Compute its SHA-256 hash **without dashes, uppercase**:

   **Option A — Node.js / terminal:**
   ```bash
   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('MYKEY12345ABCDEXYZ99').digest('hex'))"
   ```

   **Option B — browser console:**
   ```js
   const raw = 'MYKEY12345ABCDEXYZ99';
   const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
   console.log([...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join(''));
   ```

3. Open `src/components/LicenseGate.tsx` and replace the `LICENSE_HASH` value:
   ```ts
   const LICENSE_HASH = 'your_new_sha256_hash_here';
   ```

4. Rebuild and redeploy. The old key stops working immediately.

> **Tip:** You can also set `LICENSE_HASH` to an empty string and always return `true` from `isUnlocked()` to disable the gate entirely for a fully open deployment.

---

## Deployment

The `/out` folder is a fully static site. Upload it to:
- **cPanel / DirectAdmin** — upload contents of `out/` to `public_html`
- **GitHub Pages** — auto-deployed via GitHub Actions on every push to `master`
- **Netlify / Vercel** — connect repo, set build command `npm run build`, publish dir `out`

### GitHub Pages (basePath)

The workflow sets `NEXT_PUBLIC_BASE_PATH=/factor-builder` so assets resolve correctly under the `/factor-builder/` subdirectory. If you fork this repo under a different name, update that env var in `.github/workflows/deploy.yml`.

---

## License

MIT — free for personal and commercial use.

---

Built with ❤️ by [@alirewa](https://github.com/alirewa)
