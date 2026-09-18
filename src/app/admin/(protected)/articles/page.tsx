import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ArticlesTable from '@/components/admin/ArticlesTable';

export const dynamic = 'force-dynamic';

export default async function AdminArticles({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const { saved, deleted, error } = await searchParams;
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, tag, author, sort_order, image')
    .order('sort_order');

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1>Articles</h1>
        <Link href="/admin/articles/new" className="admin-btn admin-btn--primary">
          + New article
        </Link>
      </div>

      {saved && <p className="admin-notice admin-notice--ok">Article saved.</p>}
      {deleted && <p className="admin-notice admin-notice--ok">Article deleted.</p>}
      {error && <p className="admin-notice admin-notice--err">{error}</p>}

      <ArticlesTable articles={articles ?? []} />
    </div>
  );
}
