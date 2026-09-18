import { SITE } from './site';

// Client-safe article types + helpers. Article data now lives in Supabase and is
// fetched server-side (see articles.server.ts) — this file must NOT import the
// database client so it can be imported by client components (e.g. Bookshelf)
// for the type only.
export interface Article {
  id: string;
  title: string;
  tag: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; // HTML
  image: string; // main image; may be empty
  image2: string[]; // optional gallery, shown at the end; may be empty
  metaTitle: string; // optional SEO <title>; may be empty
  metaDescription: string; // optional meta description; may be empty
  ogImage: string; // optional social image; may be empty
  metaKeywords: string; // optional comma-separated keywords; may be empty
}

// Image to use for social/OG/JSON-LD — dedicated OG image, else main, else site.
export function articleOgImage(a: Article): string {
  return a.ogImage || a.image || SITE.ogImage;
}
