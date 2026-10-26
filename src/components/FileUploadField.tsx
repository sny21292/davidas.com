'use client';

import { useState, useRef } from 'react';

const MAX_FILES = 3;
const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,application/pdf';

export default function FileUploadField() {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const next = [...files];
    for (let i = 0; i < incoming.length; i++) {
      if (next.length >= MAX_FILES) break;
      const f = incoming[i];
      if (f.size > MAX_SIZE_BYTES) {
        alert(`"${f.name}" is too large (max ${MAX_SIZE_MB}MB).`);
        continue;
      }
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      next.push(f);
    }
    setFiles(next);
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="inquiry-form__field">
      <label>Attach Images (optional)</label>
      <label className="inquiry-form__file-label" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 10v2.67A1.33 1.33 0 0112.67 14H3.33A1.33 1.33 0 012 12.67V10" />
          <polyline points="5 6 8 3 11 6" />
          <line x1="8" y1="3" x2="8" y2="11" />
        </svg>
        {files.length === 0 ? 'Choose files...' : `${files.length}/${MAX_FILES} file${files.length > 1 ? 's' : ''} selected`}
      </label>
      <input
        ref={inputRef}
        className="inquiry-form__file-input"
        type="file"
        name="attachments"
        accept={ACCEPTED}
        multiple
        onChange={(e) => addFiles(e.target.files)}
      />
      {files.length > 0 && (
        <div className="inquiry-form__file-list">
          {files.map((f, i) => (
            <div key={`${f.name}-${f.size}`} className="inquiry-form__file-item">
              <span>{f.name} ({formatSize(f.size)})</span>
              <button type="button" className="inquiry-form__file-remove" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>&times;</button>
            </div>
          ))}
        </div>
      )}
      <p className="inquiry-form__file-hint">Up to {MAX_FILES} files, {MAX_SIZE_MB}MB each. Images or PDF.</p>
      {/* Hidden file inputs so FormData picks them up */}
      <DataTransferInputs files={files} />
    </div>
  );
}

function DataTransferInputs({ files }: { files: File[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep hidden inputs in sync with the files array so that the parent
  // form's FormData.getAll('attachments') returns the actual File objects.
  // We use a ref callback approach to set files on the input elements.
  return (
    <div ref={containerRef} style={{ display: 'none' }}>
      {files.map((file, i) => (
        <HiddenFileInput key={`${file.name}-${file.size}-${i}`} file={file} />
      ))}
    </div>
  );
}

function HiddenFileInput({ file }: { file: File }) {
  const ref = useRef<HTMLInputElement>(null);

  // Set the file on the input after mount
  if (typeof window !== 'undefined' && ref.current) {
    const dt = new DataTransfer();
    dt.items.add(file);
    ref.current.files = dt.files;
  }

  return (
    <input
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        if (el) {
          const dt = new DataTransfer();
          dt.items.add(file);
          el.files = dt.files;
        }
      }}
      type="file"
      name="attachments"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
