'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { deleteArticle } from '@/app/admin/actions';
import DeleteButton from '@/components/admin/DeleteButton';

type Row = {
  id: string;
  title: string;
  tag: string | null;
  author: string | null;
  sort_order: number;
  image: string | null;
};

const PAGE_SIZES = [10, 20, 40, 100];

function thumbSrc(v: string | null): string {
  if (!v) return '';
  if (/^https?:\/\//i.test(v) || v.startsWith('/')) return v;
  return '/' + v;
}

export default function ArticlesTable({ articles }: { articles: Row[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) =>
      [a.title, a.id, a.tag, a.author]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [articles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="6" /><path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by title, slug, tag or author…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>

        <label className="admin-perpage">
          Show
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          per page
        </label>

        <span className="admin-toolbar__count">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        </span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th></th><th>Title</th><th>Slug</th><th>Tag</th><th>Order</th><th></th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((a) => (
            <tr key={a.id}>
              <td>
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbSrc(a.image)} alt="" className="admin-table__thumb" />
                ) : (
                  <span className="admin-table__thumb admin-table__thumb--empty" aria-hidden="true" />
                )}
              </td>
              <td><Link href={`/admin/articles/${a.id}`} className="admin-link">{a.title}</Link></td>
              <td><code>{a.id}</code></td>
              <td>{a.tag}</td>
              <td>{a.sort_order}</td>
              <td className="admin-table__actions">
                <Link href={`/admin/articles/${a.id}`} className="admin-btn admin-btn--sm">Edit</Link>
                <a href={`/articles/${a.id}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn--sm admin-btn--ghost">View</a>
                <form action={deleteArticle} className="admin-inline-form">
                  <input type="hidden" name="id" value={a.id} />
                  <DeleteButton label={`“${a.title}”`} />
                </form>
              </td>
            </tr>
          ))}
          {pageRows.length === 0 && (
            <tr><td colSpan={6} className="admin-table__empty">No articles match “{query}”.</td></tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-btn admin-btn--sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={current <= 1}>
            ← Prev
          </button>
          <span className="admin-pagination__info">Page {current} of {totalPages}</span>
          <button className="admin-btn admin-btn--sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={current >= totalPages}>
            Next →
          </button>
        </div>
      )}
    </>
  );
}
