// Server-only: fetches articles from Supabase at BUILD TIME for static
// generation. Kept separate from articles.ts so client components can import the
// Article type without pulling the database client into the browser bundle.
import { supabase } from './supabase';
import type { Article } from './articles';

let _cache: Promise<Article[]> | null = null;

export function getArticles(): Promise<Article[]> {
  if (!_cache) _cache = fetchArticles();
  return _cache;
}

async function fetchArticles(): Promise<Article[]> {
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
    image: a.image ? (a.image.startsWith('/') ? a.image : '/' + a.image) : '',
    image2: a.image2 ? (a.image2.startsWith('/') ? a.image2 : '/' + a.image2) : '',
  }));
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const all = await getArticles();
  return all.find((a) => a.id === id);
}
