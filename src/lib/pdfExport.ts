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

  // ── Always single A4 page ──
  // If content fits naturally → place at top, full width
  // If content is taller than A4 → scale down to fit, center horizontally
  if (imgHeightMM <= pdfHeight) {
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeightMM);
  } else {
    const scale    = pdfHeight / imgHeightMM;
    const scaledW  = pdfWidth * scale;
    const xOffset  = (pdfWidth - scaledW) / 2;
    pdf.addImage(dataUrl, 'PNG', xOffset, 0, scaledW, pdfHeight);
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
    @page { size: A4 portrait; margin: 0; }
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
      transform-origin: top center;
    }
  </style>
</head>
<body>
  ${source.outerHTML}
  <script>
    document.fonts.ready.then(function () {
      // Scale to fit A4 height (1122px at 96dpi) if content is taller
      var el = document.getElementById('invoice-print-root');
      if (el) {
        var A4H = 1122;
        var h = el.scrollHeight;
        if (h > A4H) {
          var s = A4H / h;
          el.style.transform = 'scale(' + s + ')';
          el.style.marginBottom = ((h * s) - h) + 'px';
        }
      }
      window.print();
      window.onafterprint = function () { window.close(); };
    });
  </script>
</body>
</html>`);

  pw.document.close();
}
