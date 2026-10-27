'use client';

import { useState } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Mode = 'month' | 'date' | 'text';
type Parsed = { mode: Mode; value: string; monthVal: string; dateVal: string };

// Parse an existing display string back into the right editor mode + input value.
// "July 9, 2026" -> exact date; "March 2024" -> month & year; anything else -> text.
function parseInitial(s: string): Parsed {
  const v = (s ?? '').trim();
  if (!v) return { mode: 'month', value: '', monthVal: '', dateVal: '' };

  let m = v.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[1]);
    if (mi >= 0) {
      const mm = String(mi + 1).padStart(2, '0');
      const dd = String(Number(m[2])).padStart(2, '0');
      return { mode: 'date', value: v, monthVal: `${m[3]}-${mm}`, dateVal: `${m[3]}-${mm}-${dd}` };
    }
  }
  m = v.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const mi = MONTHS.indexOf(m[1]);
    if (mi >= 0) {
      const mm = String(mi + 1).padStart(2, '0');
      return { mode: 'month', value: v, monthVal: `${m[2]}-${mm}`, dateVal: '' };
    }
  }
  return { mode: 'text', value: v, monthVal: '', dateVal: '' };
}

// Flexible publish-date input. Three modes (Month & year, Exact date, Custom text);
// whatever the mode, a readable string is written to the hidden `date` field.
export default function DateField({
  name,
  label,
  defaultValue = '',
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const init = parseInitial(defaultValue);
  const [mode, setMode] = useState<Mode>(init.mode);
  const [value, setValue] = useState(init.value);
  const [monthVal, setMonthVal] = useState(init.monthVal);
  const [dateVal, setDateVal] = useState(init.dateVal);

  function onMonth(v: string) {
    setMonthVal(v);
    if (!v) return setValue('');
    const [y, m] = v.split('-');
    setValue(`${MONTHS[Number(m) - 1]} ${y}`);
  }
  function onDate(v: string) {
    setDateVal(v);
    if (!v) return setValue('');
    const [y, m, d] = v.split('-');
    setValue(`${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`);
  }

  return (
    <label className="admin-field">
      <span>{label}</span>
      <div className="admin-datefield">
        <select
          className="admin-datefield__mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          <option value="month">Month &amp; year</option>
          <option value="date">Exact date</option>
          <option value="text">Custom text</option>
        </select>

        {mode === 'month' && (
          <input type="month" value={monthVal} onChange={(e) => onMonth(e.target.value)} />
        )}
        {mode === 'date' && (
          <input type="date" value={dateVal} onChange={(e) => onDate(e.target.value)} />
        )}
        {mode === 'text' && (
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. Spring 2024" />
        )}
      </div>

      <input type="hidden" name={name} value={value} />
      <small>{value ? `Will show as: ${value}` : 'Optional — leave blank for no date.'}</small>
    </label>
  );
}
