'use client';

import { useEffect, useRef, useState } from 'react';

type Option = { value: string; label: string };

// Themed single-select dropdown. Shares the ComboBox look so admin controls are
// consistent — no raw OS <select> popup. Controlled: pass `value` + `onChange`.
export default function Select({
  value,
  onChange,
  options,
  className = '',
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    setHighlight(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); setHighlight(options.findIndex((o) => o.value === value)); return; }
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open && highlight >= 0) choose(options[highlight].value);
      else setOpen((o) => !o);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className={`admin-combo admin-select ${className}`} ref={wrapRef}>
      <div
        className={`admin-combo__control admin-select__control${open ? ' open' : ''}`}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="admin-select__value">{selected?.label ?? ''}</span>
        <span className="admin-combo__toggle" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {open && (
        <ul className="admin-combo__menu" role="listbox">
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`admin-combo__opt${highlight === i ? ' active' : ''}${o.value === value ? ' selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); choose(o.value); }}
              onMouseEnter={() => setHighlight(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
