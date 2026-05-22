'use client';

import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';

interface Props {
  value: string;          // ISO YYYY-MM-DD (Gregorian)
  onChange: (iso: string) => void;
  placeholder?: string;
}

/** Convert ISO YYYY-MM-DD → DateObject (Persian calendar) */
function isoToDateObject(iso: string): DateObject | undefined {
  if (!iso) return undefined;
  try {
    const [y, m, d] = iso.split('-').map(Number);
    const greg = new DateObject({ year: y, month: m, day: d, calendar: gregorian });
    return new DateObject({ date: greg.toDate(), calendar: persian });
  } catch {
    return undefined;
  }
}

/** Convert DateObject (Persian) → ISO YYYY-MM-DD */
function dateObjectToIso(obj: DateObject): string {
  try {
    const g = obj.convert(gregorian, gregorian_en);
    const y = g.year;
    const m = String(g.month.number).padStart(2, '0');
    const d = String(g.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return '';
  }
}

export function JalaliDatePicker({ value, onChange, placeholder = 'انتخاب تاریخ' }: Props) {
  return (
    <DatePicker
      value={isoToDateObject(value)}
      onChange={(obj) => {
        if (!obj || Array.isArray(obj)) return;
        const iso = dateObjectToIso(obj as DateObject);
        if (iso) onChange(iso);
      }}
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD"
      portal
      containerStyle={{ width: '100%' }}
      inputClass="input"
      placeholder={placeholder}
      style={{
        width: '100%',
        fontFamily: 'Vazirmatn, sans-serif',
        fontSize: '0.875rem',
      }}
      calendarPosition="bottom-right"
      arrow={false}
    />
  );
}
