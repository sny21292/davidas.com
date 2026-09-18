'use client';

import { useState } from 'react';
import { uploadImage } from '@/app/admin/actions';

function previewSrc(v: string): string {
  if (!v) return '';
  return /^https?:\/\//i.test(v) || v.startsWith('/') ? v : '/' + v;
}

// Multi-image field: upload several files (or paste URLs) to build a gallery.
// The ordered list is submitted as a JSON array string via a hidden input `name`.
export default function MultiImageField({
  name,
  label,
  defaultValue = [],
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [list, setList] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await uploadImage(fd);
        if (res.error) { setError(res.error); continue; }
        if (res.url) uploaded.push(res.url);
      }
      if (uploaded.length) setList((l) => [...l, ...uploaded]);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function addUrl() {
    const v = urlInput.trim();
    if (v) { setList((l) => [...l, v]); setUrlInput(''); }
  }
  function remove(i: number) { setList((l) => l.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    setList((l) => {
      const a = [...l];
      const j = i + dir;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  }

  return (
    <div className="admin-field admin-multi">
      <span>{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(list)} />

      {list.length > 0 ? (
        <div className="admin-multi__grid">
          {list.map((src, i) => (
            <div key={`${src}-${i}`} className="admin-multi__item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc(src)} alt="" />
              <div className="admin-multi__bar">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Move earlier">←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} title="Move later">→</button>
                <button type="button" className="admin-multi__remove" onClick={() => remove(i)} title="Remove">×</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-image-field__empty" style={{ width: '100%', height: 90 }}>No images yet</div>
      )}

      <div className="admin-multi__controls">
        <label className="admin-btn admin-btn--sm admin-image-field__upload">
          {uploading ? 'Uploading…' : 'Upload images'}
          <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={handleFiles} />
        </label>
        <input
          type="text"
          className="admin-image-field__url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
          placeholder="…or paste an image path / URL"
        />
        <button type="button" className="admin-btn admin-btn--sm" onClick={addUrl}>Add</button>
      </div>

      {error && <span className="admin-image-field__error">{error}</span>}
    </div>
  );
}
