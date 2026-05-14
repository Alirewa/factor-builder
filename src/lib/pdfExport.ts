import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

const A4_WIDTH_MM = 210;
const ELEMENT_ID  = 'invoice-print-root';

/** Find the invoice element or throw. */
function getSource(): HTMLElement {
  const el = document.getElementById(ELEMENT_ID);
  if (!el) throw new Error('پیش‌نمایش فاکتور یافت نشد');
  return el;
}

/**
 * Clone the invoice element into a clean off-screen container appended to
 * document.body.  This eliminates every parent transform / scroll / zoom
 * that would corrupt coordinates or pixelation in html-to-image.
 */
async function captureInvoicePng(source: HTMLElement): Promise<string> {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:-9999px;left:0;width:794px;background:#ffffff;overflow:visible;z-index:-1;direction:rtl';

  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.cssText += ';transform:none;min-height:unset;width:794px;zoom:1';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    await document.fonts.ready;
    // Two frames so the browser finishes painting the cloned element
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    );

    return await toPng(clone, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      width: 794,
      height: clone.scrollHeight,
      style: { transform: 'none', minHeight: 'unset', zoom: '1' },
    });
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF download
// ─────────────────────────────────────────────────────────────────────────────
export async function exportInvoiceToPDF(invoiceNumber: string): Promise<void> {
  const dataUrl = await captureInvoicePng(getSource());

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const pdfWidth  = pdf.internal.pageSize.getWidth();   // 210 mm
  const pdfHeight = pdf.internal.pageSize.getHeight();  // 297 mm

  // Measure image dimensions
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((r) => { img.onload = () => r(); });
  const { naturalWidth: nw, naturalHeight: nh } = img;
  const imgHeightMM = (nh / nw) * pdfWidth;

  if (imgHeightMM <= pdfHeight + 1) {
    // ── single page ──
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeightMM);
  } else {
    // ── multi-page: slice the canvas ──
    const src = document.createElement('canvas');
    src.width = nw; src.height = nh;
    src.getContext('2d')!.drawImage(img, 0, 0);

    const pxPerMM    = nw / pdfWidth;
    const pageHPx    = pdfHeight * pxPerMM;
    let   offsetPx   = 0;
    let   remaining  = nh;

    while (remaining > 0) {
      if (offsetPx > 0) pdf.addPage();
      const sliceH   = Math.min(pageHPx, remaining);
      const sliceHMM = (sliceH / nw) * pdfWidth;

      const pg = document.createElement('canvas');
      pg.width = nw; pg.height = Math.ceil(sliceH);
      pg.getContext('2d')!.drawImage(src, 0, offsetPx, nw, sliceH, 0, 0, nw, sliceH);

      pdf.addImage(pg.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfWidth, sliceHMM);
      offsetPx  += pageHPx;
      remaining -= pageHPx;
    }
  }

  pdf.save(`فاکتور-${invoiceNumber || 'بدون-شماره'}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Print — opens a dedicated print window containing ONLY the invoice HTML.
// This avoids printing the entire app page (form, navbar, etc.).
// ─────────────────────────────────────────────────────────────────────────────
export function printInvoice(): void {
  const source = document.getElementById(ELEMENT_ID);
  if (!source) { alert('پیش‌نمایش فاکتور یافت نشد'); return; }

  const pw = window.open('', '_blank', 'width=900,height=700');
  if (!pw) { alert('لطفاً پنجره‌های بازشو (popup) را در مرورگر مجاز کنید'); return; }

  pw.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <title>چاپ فاکتور</title>
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0;
      background: #ffffff;
      font-family: 'Vazirmatn', sans-serif;
      direction: rtl;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    #invoice-print-root {
      width: 794px;
    }
  </style>
</head>
<body>
  ${source.outerHTML}
  <script>
    // Wait for fonts, then print automatically
    document.fonts.ready.then(function () {
      window.print();
      window.onafterprint = function () { window.close(); };
    });
  </script>
</body>
</html>`);

  pw.document.close();
}
