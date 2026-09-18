'use client';

import { useEffect, useRef, useState } from 'react';

// Themed combobox: pick an existing option or type a new one. Type-to-filter, an
// "Add …" row for new values, keyboard support, click-outside to close. The
// chosen value is submitted via a hidden input named `name`.
export default function ComboBox({
  name,
  label,
  options,
  defaultValue = '',
  placeholder,
}: {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = value.trim().toLowerCase();
  const filtered = options.filter((o) => o.toLowerCase().includes(q));
  const exact = options.some((o) => o.toLowerCase() === q);
  const showAdd = value.trim().length > 0 && !exact;
  const total = filtered.length + (showAdd ? 1 : 0);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function choose(v: string) {
    setValue(v);
    setOpen(false);
    setHighlight(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlight((h) => Math.min(h + 1, total - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && highlight >= 0) {
        e.preventDefault();
        if (highlight < filtered.length) choose(filtered[highlight]);
        else choose(value.trim());
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="admin-field admin-combo" ref={wrapRef}>
      <span>{label}</span>
      <div className={`admin-combo__control${open ? ' open' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="admin-combo__input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => { setValue(e.target.value); setOpen(true); setHighlight(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
        />
        <button
          type="button"
          className="admin-combo__toggle"
          tabIndex={-1}
          aria-label="Toggle options"
          onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}
        >
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {open && total > 0 && (
        <ul className="admin-combo__menu" role="listbox">
          {filtered.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={highlight === i}
              className={`admin-combo__opt${highlight === i ? ' active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); choose(o); }}
              onMouseEnter={() => setHighlight(i)}
            >
              {o}
            </li>
          ))}
          {showAdd && (
            <li
              role="option"
              aria-selected={highlight === filtered.length}
              className={`admin-combo__opt admin-combo__opt--add${highlight === filtered.length ? ' active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); choose(value.trim()); }}
              onMouseEnter={() => setHighlight(filtered.length)}
            >
              + Add “{value.trim()}”
            </li>
          )}
        </ul>
      )}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
