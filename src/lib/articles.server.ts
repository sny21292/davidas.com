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

// Normalize an image reference to an absolute /public path; empty stays empty.
function normalizeImage(v: unknown): string {
  if (typeof v !== 'string' || !v) return '';
  return v.startsWith('/') ? v : '/' + v;
}

// image2 may be a plain string (legacy) or a text[] array (gallery). Coerce to a
// single image string here so this branch's article page keeps working either
// way — takes the first non-empty entry of an array.
function firstImage(v: unknown): string {
  if (Array.isArray(v)) {
    const first = v.find((x) => typeof x === 'string' && x);
    return normalizeImage(first);
  }
  return normalizeImage(v);
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
    image: normalizeImage(a.image),
    image2: firstImage(a.image2),
  }));
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const all = await getArticles();
  return all.find((a) => a.id === id);
}
