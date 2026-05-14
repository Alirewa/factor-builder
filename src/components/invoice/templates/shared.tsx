import { InvoiceData, InvoiceTotals, INVOICE_TYPE_LABELS } from '@/types/invoice';
import { formatCurrency, toJalali } from '@/lib/utils';

// ─── Header (shared by all templates) ───────────────────────────────────────
// Layout (RTL):
//   Right col  : لوگو + نام شرکت/برند + اطلاعات تماس
//   Center col : نوع فاکتور (فاکتور فروش / خرید / پیش‌فاکتور)
//   Left col   : شماره + تاریخ (چپ‌چین)
// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  invoice: InvoiceData;
  primary: string;
  dark?: boolean; // dark-background variant (for corporate template)
}

export function InvoiceHeaderBlock({ invoice, primary, dark = false }: HeaderProps) {
  const { customization, seller } = invoice;
  const textColor = dark ? '#ffffff' : '#0f172a';
  const mutedColor = dark ? 'rgba(255,255,255,0.65)' : '#64748b';
  const typeLabel = INVOICE_TYPE_LABELS[invoice.invoiceType];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '12px',
        padding: '22px 28px 18px',
        background: dark ? primary : `${primary}12`,
        borderBottom: dark ? 'none' : `3px solid ${primary}`,
      }}
    >
      {/* ── Right: Logo + brand name + seller contact ── */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
        {customization.logoImage && (
          <img
            src={customization.logoImage}
            alt="logo"
            style={{ height: '48px', maxWidth: '150px', objectFit: 'contain', marginBottom: '4px' }}
          />
        )}
        <div
          style={{
            fontSize: customization.logoImage ? '15px' : '20px',
            fontWeight: 900,
            color: dark ? '#ffffff' : primary,
            lineHeight: 1.2,
          }}
        >
          {seller.company || seller.name || 'نام شرکت / برند'}
        </div>
        {seller.company && seller.name && (
          <div style={{ fontSize: '11px', color: mutedColor }}>{seller.name}</div>
        )}
        {seller.phone && (
          <div style={{ fontSize: '11px', color: mutedColor, direction: 'ltr', textAlign: 'right' }}>
            {seller.phone}
          </div>
        )}
        {seller.email && (
          <div style={{ fontSize: '10px', color: mutedColor, direction: 'ltr' }}>{seller.email}</div>
        )}
      </div>

      {/* ── Center: Invoice type label ── */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: dark ? 'rgba(255,255,255,0.15)' : primary,
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 800,
            padding: '8px 20px',
            borderRadius: '10px',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
          }}
        >
          {typeLabel}
        </div>
      </div>

      {/* ── Left: Invoice number + dates (left-aligned, ltr so block flow goes to physical left) ── */}
      <div style={{ textAlign: 'left', direction: 'ltr' }}>
        <table style={{ fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ color: mutedColor, paddingBottom: '4px', paddingRight: '10px' }}>شماره:</td>
              <td style={{ fontWeight: 700, color: textColor, paddingBottom: '4px' }}>
                {invoice.invoiceNumber}
              </td>
            </tr>
            <tr>
              <td style={{ color: mutedColor, paddingBottom: '2px', paddingRight: '10px' }}>تاریخ صدور:</td>
              <td style={{ fontWeight: 600, color: textColor, paddingBottom: '2px' }}>
                {toJalali(invoice.invoiceDate)}
              </td>
            </tr>
            {invoice.dueDate && (
              <tr>
                <td style={{ color: mutedColor, paddingRight: '10px' }}>سررسید:</td>
                <td style={{ fontWeight: 600, color: textColor }}>{toJalali(invoice.dueDate)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Party box (shared) ──────────────────────────────────────────────────────
export function PartyBox({ party, label, primary }: { party: InvoiceData['seller']; label: string; primary: string }) {
  const hasData = party.name || party.company;
  return (
    <div style={{ border: `1px solid ${primary}28`, borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
      <div style={{ background: primary, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 12px' }}>
        {label}
      </div>
      <div style={{ padding: '10px 12px', fontSize: '12px', lineHeight: 1.85 }}>
        {hasData ? (
          <>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>{party.company || party.name}</div>
            {party.company && party.name && <div style={{ color: '#64748b' }}>{party.name}</div>}
            {party.nationalId && <div style={{ color: '#64748b' }}>کد: {party.nationalId}</div>}
            {party.phone && <div style={{ color: '#64748b' }}>تلفن: {party.phone}</div>}
            {party.address && <div style={{ color: '#64748b' }}>{party.address}</div>}
          </>
        ) : (
          <span style={{ color: '#cbd5e1' }}>وارد نشده</span>
        )}
      </div>
    </div>
  );
}

// ─── Items table (shared) ────────────────────────────────────────────────────
export function ItemsTable({
  invoice,
  primary,
  alternateRow = '#f8fafc',
}: {
  invoice: InvoiceData;
  primary: string;
  alternateRow?: string;
}) {
  const { items, customization } = invoice;
  const showDiscount = customization.showDiscount;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: primary }}>
          {['#', 'شرح کالا / خدمات', 'تعداد', 'قیمت واحد (ریال)', ...(showDiscount ? ['تخفیف'] : []), 'مبلغ کل (ریال)'].map(
            (h, i, arr) => (
              <th
                key={h}
                style={{
                  padding: '9px 11px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'Vazirmatn, sans-serif',
                  textAlign: i === 0 ? 'center' : i === arr.length - 1 || i === 3 ? 'left' : i === 2 || i === 4 ? 'center' : 'right',
                  borderRadius: i === 0 ? '0 6px 6px 0' : i === arr.length - 1 ? '6px 0 0 6px' : undefined,
                }}
              >
                {h}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td
              colSpan={showDiscount ? 6 : 5}
              style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}
            >
              هیچ کالایی ثبت نشده است
            </td>
          </tr>
        ) : (
          items.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? '#ffffff' : alternateRow, borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ ...tdS, textAlign: 'center', color: '#94a3b8' }}>{i + 1}</td>
              <td style={{ ...tdS, textAlign: 'right' }}>{item.name}</td>
              <td style={{ ...tdS, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ ...tdS, textAlign: 'left', direction: 'ltr' }}>{formatCurrency(item.unitPrice)}</td>
              {showDiscount && (
                <td style={{ ...tdS, textAlign: 'center' }}>{item.discount > 0 ? `${item.discount}%` : '—'}</td>
              )}
              <td style={{ ...tdS, textAlign: 'left', direction: 'ltr', fontWeight: 700 }}>
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// ─── Totals summary (shared) ─────────────────────────────────────────────────
export function TotalsSummary({
  invoice,
  totals,
  primary,
}: {
  invoice: InvoiceData;
  totals: InvoiceTotals;
  primary: string;
}) {
  return (
    <div style={{ fontSize: '12px' }}>
      <TRow label="جمع اقلام" value={`${formatCurrency(totals.subtotal)} ریال`} />
      {totals.itemDiscounts > 0 && (
        <TRow label="تخفیف اقلام" value={`−${formatCurrency(totals.itemDiscounts)} ریال`} color="#16a34a" />
      )}
      {totals.globalDiscountAmount > 0 && (
        <TRow
          label={`تخفیف کلی (${invoice.globalDiscount}%)`}
          value={`−${formatCurrency(totals.globalDiscountAmount)} ریال`}
          color="#16a34a"
        />
      )}
      {invoice.customization.showTax && totals.taxAmount > 0 && (
        <TRow
          label={`مالیات (${invoice.taxRate}%)`}
          value={`+${formatCurrency(totals.taxAmount)} ریال`}
          color="#f97316"
        />
      )}
      <div
        style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: `2px solid ${primary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '13px' }}>مبلغ قابل پرداخت</span>
        <span style={{ fontWeight: 800, fontSize: '15px', color: primary, direction: 'ltr' }}>
          {formatCurrency(totals.total)} ریال
        </span>
      </div>
    </div>
  );
}

// ─── Signature area (shared) ─────────────────────────────────────────────────
export function SignatureRow({ invoice }: { invoice: InvoiceData }) {
  const { signature, customization } = invoice;
  if (!customization.showSignature && !customization.showStamp) return null;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '40px',
        marginTop: '28px',
        paddingTop: '14px',
        borderTop: '1px dashed #e2e8f0',
      }}
    >
      {customization.showSignature && (
        <SignBox label="امضا فروشنده" img={signature.signatureImage} />
      )}
      {customization.showStamp && (
        <SignBox label="مهر شرکت" img={signature.stampImage} />
      )}
    </div>
  );
}

function SignBox({ label, img }: { label: string; img: string | null }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '110px' }}>
      {img ? (
        <img src={img} alt={label} style={{ height: '56px', objectFit: 'contain', marginBottom: '6px' }} />
      ) : (
        <div style={{ height: '56px', marginBottom: '6px' }} />
      )}
      <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}

function TRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color: color || '#1e293b', fontWeight: 600, direction: 'ltr' }}>{value}</span>
    </div>
  );
}

const tdS: React.CSSProperties = {
  padding: '9px 11px',
  fontSize: '12px',
  fontFamily: 'Vazirmatn, sans-serif',
};
