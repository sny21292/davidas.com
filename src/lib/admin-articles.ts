import { createClient } from '@/lib/supabase/server';

// Metadata the article editor needs: existing tags/authors (for the combo boxes)
// and the next free sort order.
export async function getArticleFormMeta(): Promise<{
  tags: string[];
  authors: string[];
  nextOrder: number;
}> {
  const supabase = await createClient();
  const { data } = await supabase.from('articles').select('tag, author, sort_order');
  const rows = data ?? [];
  const tags = [...new Set(rows.map((r) => (r.tag ?? '').trim()).filter(Boolean))].sort();
  const authors = [...new Set(rows.map((r) => (r.author ?? '').trim()).filter(Boolean))].sort();
  const maxOrder = Math.max(0, ...rows.map((r) => r.sort_order ?? 0));
  return { tags, authors, nextOrder: maxOrder + 1 };
}

// Is this sort order already used by a different article?
export async function isSortOrderTaken(order: number, exceptId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('id')
    .eq('sort_order', order)
    .neq('id', exceptId);
  return (data ?? []).length > 0;
}
