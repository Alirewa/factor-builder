'use client';

import { InvoiceData, InvoiceTotals, INVOICE_TYPE_LABELS } from '@/types/invoice';
import { formatCurrency, toJalali } from '@/lib/utils';
import { ItemsTable, SignatureRow } from './shared';

interface Props { invoice: InvoiceData; totals: InvoiceTotals; }

export function MinimalTemplate({ invoice, totals }: Props) {
  const { customization, seller, buyer } = invoice;
  const primary = customization.primaryColor;
  const fs = customization.fontSize === 'sm' ? '11px' : customization.fontSize === 'lg' ? '15px' : '13px';
  const typeLabel = INVOICE_TYPE_LABELS[invoice.invoiceType];

  return (
    <div
      id="invoice-print-root"
      style={{ fontFamily: 'Vazirmatn, sans-serif', fontSize: fs, direction: 'rtl', background: '#fff', color: '#0f172a', padding: '32px 36px' }}
    >
      {/* Header — 3-col layout: Right=brand, Center=type, Left=date (minimal style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '24px' }}>
        {/* Right: logo + brand name + contact */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
          {customization.logoImage && (
            <img src={customization.logoImage} alt="logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '3px' }} />
          )}
          <div style={{ fontSize: customization.logoImage ? '16px' : '22px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            {seller.company || seller.name || 'نام برند'}
          </div>
          {seller.company && seller.name && (
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{seller.name}</div>
          )}
          {seller.phone && (
            <div style={{ fontSize: '11px', color: '#94a3b8', direction: 'ltr', textAlign: 'right' }}>
              {seller.phone}
            </div>
          )}
          {seller.email && (
            <div style={{ fontSize: '10px', color: '#94a3b8', direction: 'ltr' }}>{seller.email}</div>
          )}
        </div>

        {/* Center: invoice type */}
        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <div
            style={{
              display: 'inline-block',
              border: `2px solid ${primary}`,
              color: primary,
              fontSize: '13px',
              fontWeight: 800,
              padding: '6px 16px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            {typeLabel}
          </div>
        </div>

        {/* Left: number + date (left-aligned, ltr so block flow goes to physical left) */}
        <div style={{ textAlign: 'left', direction: 'ltr' }}>
          <table style={{ fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ color: '#94a3b8', paddingBottom: '3px', paddingRight: '8px' }}>شماره:</td>
                <td style={{ fontWeight: 700, paddingBottom: '3px' }}>{invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', paddingRight: '8px' }}>تاریخ:</td>
                <td style={{ fontWeight: 600 }}>{toJalali(invoice.invoiceDate)}</td>
              </tr>
              {invoice.dueDate && (
                <tr>
                  <td style={{ color: '#94a3b8', paddingRight: '8px' }}>سررسید:</td>
                  <td style={{ fontWeight: 600 }}>{toJalali(invoice.dueDate)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thin gradient divider */}
      <div style={{ height: '2px', background: `linear-gradient(to left, ${primary}, transparent)`, marginBottom: '22px' }} />

      {/* Parties */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
        {[
          { label: 'از طرف', party: seller },
          { label: 'به طرف', party: buyer },
        ].map(({ label, party }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              {label}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>
              {party.company || party.name || <span style={{ color: '#cbd5e1' }}>—</span>}
            </div>
            {party.phone && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{party.phone}</div>}
            {party.address && <div style={{ fontSize: '11px', color: '#64748b' }}>{party.address}</div>}
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ marginBottom: '20px' }}>
        <ItemsTable invoice={invoice} primary={primary} alternateRow="#f9fafb" />
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div style={{ width: '260px', fontSize: '12px' }}>
          {totals.itemDiscounts > 0 && (
            <MRow label="تخفیف اقلام" value={`−${formatCurrency(totals.itemDiscounts)}`} />
          )}
          {totals.globalDiscountAmount > 0 && (
            <MRow label={`تخفیف (${invoice.globalDiscount}%)`} value={`−${formatCurrency(totals.globalDiscountAmount)}`} />
          )}
          {customization.showTax && totals.taxAmount > 0 && (
            <MRow label={`مالیات (${invoice.taxRate}%)`} value={`+${formatCurrency(totals.taxAmount)}`} />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${primary}`, paddingTop: '8px', marginTop: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '13px' }}>مجموع</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: primary, direction: 'ltr' }}>
              {formatCurrency(totals.total)} ریال
            </span>
          </div>
        </div>
      </div>

      {customization.showNotes && invoice.notes && (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
            یادداشت
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.8, margin: 0 }}>{invoice.notes}</p>
        </div>
      )}

      <SignatureRow invoice={invoice} />
    </div>
  );
}

function MRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: '#64748b', fontWeight: 600, direction: 'ltr' }}>{value} ریال</span>
    </div>
  );
}
