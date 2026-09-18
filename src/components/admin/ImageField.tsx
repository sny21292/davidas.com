'use client';

import { useState } from 'react';
import { uploadImage } from '@/app/admin/actions';

// Image picker for the article editor: upload a file straight to Supabase Storage
// (bucket `article-images`) and keep its public URL, or paste an existing path.
// The chosen value is submitted via a hidden input named `name`.
function previewSrc(v: string): string {
  if (!v) return '';
  if (/^https?:\/\//i.test(v) || v.startsWith('/')) return v;
  return '/' + v;
}

export default function ImageField({
  name,
  label,
  defaultValue = '',
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd);
      if (res.error) setError(res.error);
      else if (res.url) setValue(res.url);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="admin-field admin-image-field">
      <span>{label}</span>
      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="admin-image-field__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc(value)} alt="Preview" />
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--danger"
            onClick={() => setValue('')}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="admin-image-field__empty">No image selected</div>
      )}

      <div className="admin-image-field__controls">
        <label className="admin-btn admin-btn--sm admin-image-field__upload">
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            hidden
          />
        </label>
        <input
          type="text"
          className="admin-image-field__url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="…or paste an image path / URL"
        />
      </div>

      {error && <span className="admin-image-field__error">{error}</span>}
    </div>
  );
}
