'use client';

import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { InvoiceHeaderBlock, PartyBox, ItemsTable, TotalsSummary, SignatureRow } from './shared';

interface Props { invoice: InvoiceData; totals: InvoiceTotals; }

export function ModernTemplate({ invoice, totals }: Props) {
  const { customization } = invoice;
  const primary = customization.primaryColor;
  const fs = customization.fontSize === 'sm' ? '11px' : customization.fontSize === 'lg' ? '15px' : '13px';

  return (
    <div
      id="invoice-print-root"
      style={{ fontFamily: 'Vazirmatn, sans-serif', fontSize: fs, direction: 'rtl', background: '#fff', color: '#0f172a' }}
    >
      <InvoiceHeaderBlock invoice={invoice} primary={primary} />

      <div style={{ padding: '20px 28px' }}>
        {/* Parties */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
          <PartyBox party={invoice.seller} label="فروشنده" primary={primary} />
          <PartyBox party={invoice.buyer} label="خریدار" primary={primary} />
        </div>

        {/* Items */}
        <div style={{ marginBottom: '20px' }}>
          <ItemsTable invoice={invoice} primary={primary} />
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '280px',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '14px',
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
              marginTop: '18px',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${primary}22`,
              background: `${primary}06`,
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: primary, marginBottom: '5px' }}>توضیحات</div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.8, margin: 0 }}>{invoice.notes}</p>
          </div>
        )}

        <SignatureRow invoice={invoice} />
      </div>
    </div>
  );
}
