import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleFormMeta } from '@/lib/admin-articles';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { tags, authors, nextOrder } = await getArticleFormMeta();
  return (
    <ArticleForm
      isNew
      error={error === 'missing' ? 'Slug and title are required.' : error}
      tags={tags}
      authors={authors}
      nextOrder={nextOrder}
      values={{
        id: '',
        title: '',
        tag: '',
        author: '',
        date: '',
        excerpt: '',
        content: '',
        image: '',
        image2: [],
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        metaKeywords: '',
        sort_order: 0,
      }}
    />
  );
}
