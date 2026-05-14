'use client';

import { InvoiceData, InvoiceTotals } from '@/types/invoice';
import { InvoiceHeaderBlock, PartyBox, ItemsTable, TotalsSummary, SignatureRow } from './shared';

interface Props { invoice: InvoiceData; totals: InvoiceTotals; }

export function FormalTemplate({ invoice, totals }: Props) {
  const { customization } = invoice;
  const primary = customization.primaryColor;
  const fs = customization.fontSize === 'sm' ? '11px' : customization.fontSize === 'lg' ? '15px' : '13px';

  return (
    <div
      id="invoice-print-root"
      style={{ fontFamily: 'Vazirmatn, sans-serif', fontSize: fs, direction: 'rtl', background: '#fff', color: '#0f172a' }}
    >
      {/* Top accent line */}
      <div style={{ height: '4px', background: primary }} />

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

        {/* Totals + Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
          <div>
            {customization.showNotes && invoice.notes && (
              <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: primary, marginBottom: '5px' }}>توضیحات</div>
                <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.8, margin: 0 }}>{invoice.notes}</p>
              </div>
            )}
          </div>
          <div
            style={{
              minWidth: '250px',
              border: `1px solid ${primary}33`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: primary, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 12px' }}>
              خلاصه مالی
            </div>
            <div style={{ padding: '12px' }}>
              <TotalsSummary invoice={invoice} totals={totals} primary={primary} />
            </div>
          </div>
        </div>

        <SignatureRow invoice={invoice} />
      </div>

      {/* Bottom accent */}
      <div style={{ height: '4px', background: primary, marginTop: '6px' }} />
    </div>
  );
}
