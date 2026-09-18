'use client';

import { useState } from 'react';
import { slugify, slugifyLive, titleCase } from '@/lib/slug';

// Title + slug pair. On a NEW article the slug auto-derives from the title until
// the user edits the slug directly; typing in the slug converts to slug format.
// A title typed all-lowercase is title-cased on blur. On EDIT the slug is locked.
export default function TitleSlugFields({
  defaultTitle,
  defaultSlug,
  isNew,
}: {
  defaultTitle: string;
  defaultSlug: string;
  isNew: boolean;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [slugTouched, setSlugTouched] = useState(!isNew || !!defaultSlug);

  function onTitle(v: string) {
    setTitle(v);
    if (isNew && !slugTouched) setSlug(slugify(v));
  }
  function onTitleBlur() {
    if (title && title === title.toLowerCase()) setTitle(titleCase(title));
  }

  return (
    <>
      <div className="admin-form__row">
        <label className="admin-field">
          <span>Slug (URL id){isNew ? '' : ' — locked'}</span>
          <input
            type="text"
            name="id"
            value={slug}
            readOnly={!isNew}
            onChange={(e) => { setSlugTouched(true); setSlug(slugifyLive(e.target.value)); }}
            onBlur={() => setSlug((s) => slugify(s))}
            placeholder="e.g. burma-ruby"
            required
          />
          {isNew && <small>Auto-filled from the title. Lowercase letters, numbers and dashes.</small>}
        </label>
      </div>

      <label className="admin-field">
        <span>Title</span>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          onBlur={onTitleBlur}
          required
        />
      </label>
    </>
  );
}
