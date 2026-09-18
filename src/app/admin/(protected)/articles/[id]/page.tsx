import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';
import { createClient } from '@/lib/supabase/server';
import { getArticleFormMeta } from '@/lib/admin-articles';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: a } = await supabase.from('articles').select('*').eq('id', id).single();

  if (!a) notFound();

  const { tags, authors, nextOrder } = await getArticleFormMeta();

  return (
    <ArticleForm
      isNew={false}
      error={error}
      tags={tags}
      authors={authors}
      nextOrder={nextOrder}
      values={{
        id: a.id,
        title: a.title ?? '',
        tag: a.tag ?? '',
        author: a.author ?? '',
        date: a.date ?? '',
        excerpt: a.excerpt ?? '',
        content: a.content ?? '',
        image: a.image ?? '',
        image2: a.image2 ?? [],
        metaTitle: a.meta_title ?? '',
        metaDescription: a.meta_description ?? '',
        ogImage: a.og_image ?? '',
        metaKeywords: a.meta_keywords ?? '',
        sort_order: a.sort_order ?? 0,
      }}
    />
  );
}
