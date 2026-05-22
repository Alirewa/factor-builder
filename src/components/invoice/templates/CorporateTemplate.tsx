'use client';

import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { InvoiceHeaderBlock, ItemsTable, TotalsSummary, SignatureRow, InvoiceFooter } from './shared';
import { formatCurrency } from '@/lib/utils';

interface Props { invoice: InvoiceData; totals: InvoiceTotals; }

export function CorporateTemplate({ invoice, totals }: Props) {
  const { customization } = invoice;
  const primary = customization.primaryColor;
  const zoom = customization.fontSize === 'sm' ? 0.88 : customization.fontSize === 'lg' ? 1.12 : 1;

  return (
    <div
      id="invoice-print-root"
      style={{ fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', background: '#fff', color: '#0f172a', zoom }}
    >
      {/* Dark-background header variant */}
      <div style={{ background: '#0f172a' }}>
        <InvoiceHeaderBlock invoice={invoice} primary={primary} dark />
      </div>

      <div style={{ padding: '22px 28px' }}>
        {/* Parties with accent border */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '22px' }}>
          {[
            { label: 'فروشنده', party: invoice.seller, accent: primary },
            { label: 'خریدار', party: invoice.buyer, accent: '#0f172a' },
          ].map(({ label, party, accent }) => (
            <div key={label} style={{ flex: 1, borderRight: `3px solid ${accent}`, paddingRight: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                {label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                {party.company || party.name || <span style={{ color: '#cbd5e1' }}>—</span>}
              </div>
              {party.nationalId && <div style={{ fontSize: '11px', color: '#64748b' }}>کد: {party.nationalId}</div>}
              {party.phone && <div style={{ fontSize: '11px', color: '#64748b' }}>{party.phone}</div>}
              {party.address && <div style={{ fontSize: '11px', color: '#64748b' }}>{party.address}</div>}
            </div>
          ))}
        </div>

        {/* Items */}
        <div style={{ marginBottom: '22px' }}>
          <ItemsTable invoice={invoice} primary={primary} alternateRow="#f8fafc" />
        </div>

        {/* Footer grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
          <div>
            {customization.showNotes && invoice.notes && (
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', borderRight: `3px solid ${primary}` }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: primary, marginBottom: '5px' }}>توضیحات</div>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.8, margin: 0 }}>{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Dark totals box */}
          <div style={{ minWidth: '250px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>خلاصه مالی</div>
            </div>
            <div style={{ padding: '12px 14px', fontSize: '12px' }}>
              <CRow label="جمع اقلام" value={`${formatCurrency(totals.subtotal)} ریال`} />
              {totals.itemDiscounts > 0 && <CRow label="تخفیف اقلام" value={`−${formatCurrency(totals.itemDiscounts)}`} green />}
              {totals.globalDiscountAmount > 0 && <CRow label="تخفیف کلی" value={`−${formatCurrency(totals.globalDiscountAmount)}`} green />}
              {customization.showTax && totals.taxAmount > 0 && (
                <CRow label={`مالیات (${invoice.taxRate}%)`} value={`+${formatCurrency(totals.taxAmount)}`} orange />
              )}
            </div>
            <div style={{ background: primary, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '12px' }}>مبلغ نهایی</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '15px', direction: 'ltr' }}>
                {formatCurrency(totals.total)} ریال
              </span>
            </div>
          </div>
        </div>

        <SignatureRow invoice={invoice} />
      </div>

      <InvoiceFooter invoice={invoice} primary={primary} />
    </div>
  );
}

function CRow({ label, value, green, orange }: { label: string; value: string; green?: boolean; orange?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ color: green ? '#4ade80' : orange ? '#fb923c' : 'rgba(255,255,255,0.9)', fontWeight: 600, direction: 'ltr' }}>
        {value}
      </span>
    </div>
  );
}
