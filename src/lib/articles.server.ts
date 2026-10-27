// Server-only: fetches articles from Supabase for static generation and on-demand
// revalidation. Uses React's per-request cache() (not a long-lived module cache)
// so that after an admin edits an article and we revalidate its path, the
// regenerated page fetches fresh data instead of serving a stale in-process copy.
import { cache } from 'react';
import { supabase } from './supabase';
import type { Article } from './articles';

function normalizeImage(v: string | null | undefined): string {
  if (!v) return '';
  // Full URLs (e.g. Supabase Storage uploads) and already-absolute /public paths
  // pass through unchanged; bare paths get a leading slash.
  if (/^https?:\/\//i.test(v) || v.startsWith('/')) return v;
  return '/' + v;
}

export const getArticles = cache(async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    tag: a.tag ?? '',
    author: a.author ?? '',
    date: a.date ?? '',
    excerpt: a.excerpt ?? '',
    content: a.content ?? '',
    // Normalize to an absolute /public path; empty stays empty so the article
    // page can hide the image (matches the original static behavior).
    image: normalizeImage(a.image),
    image2: (a.image2 ?? []).map(normalizeImage).filter(Boolean),
    metaTitle: a.meta_title ?? '',
    metaDescription: a.meta_description ?? '',
    ogImage: normalizeImage(a.og_image),
    metaKeywords: a.meta_keywords ?? '',
  }));
});

export async function getArticle(id: string): Promise<Article | undefined> {
  const all = await getArticles();
  return all.find((a) => a.id === id);
}
