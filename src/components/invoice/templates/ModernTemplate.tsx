'use client';

import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { InvoiceHeaderBlock, PartyBox, ItemsTable, TotalsSummary, SignatureRow, InvoiceFooter } from './shared';

interface Props { invoice: InvoiceData; totals: InvoiceTotals; }

export function ModernTemplate({ invoice, totals }: Props) {
  const { customization } = invoice;
  const primary = customization.primaryColor;
  const zoom = customization.fontSize === 'sm' ? 0.88 : customization.fontSize === 'lg' ? 1.12 : 1;

  return (
    <div
      id="invoice-print-root"
      style={{ fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', background: '#fff', color: '#0f172a', zoom }}
    >
      <InvoiceHeaderBlock invoice={invoice} primary={primary} />

      <div style={{ padding: '16px 24px' }}>
        {/* Parties */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <PartyBox party={invoice.seller} label="فروشنده" primary={primary} />
          <PartyBox party={invoice.buyer} label="خریدار" primary={primary} />
        </div>

        {/* Items */}
        <div style={{ marginBottom: '16px' }}>
          <ItemsTable invoice={invoice} primary={primary} />
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '260px',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '12px',
              border: `1px solid ${primary}20`,
            }}
          >
            <TotalsSummary invoice={invoice} totals={totals} primary={primary} />
          </div>
        </div>

        {/* Notes */}
        {customization.showNotes && invoice.notes && (
          <div
            style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${primary}22`,
              background: `${primary}06`,
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: primary, marginBottom: '4px' }}>توضیحات</div>
            <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.7, margin: 0 }}>{invoice.notes}</p>
          </div>
        )}

        <SignatureRow invoice={invoice} />
      </div>

      <InvoiceFooter invoice={invoice} primary={primary} />
    </div>
  );
}
