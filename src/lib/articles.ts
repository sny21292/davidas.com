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
  image: string; // may be empty
  image2: string; // optional second image, shown at the end; may be empty
}

// Image to use for social/OG/JSON-LD — falls back to the site image.
export function articleOgImage(a: Article): string {
  return a.image || SITE.ogImage;
}
