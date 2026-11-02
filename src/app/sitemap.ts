import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { CATEGORIES, PRODUCTS, productPath } from '@/data/products';
import { getArticles } from '@/lib/articles.server';
import { getShowcaseItems } from '@/data/showcase.server';

// Generates /sitemap.xml covering every crawlable URL (this is the payoff of
// giving products real routes instead of hash fragments).
//
// lastModified must be HONEST: if every URL carries `new Date()` (the build
// time), all pages claim to change on every deploy, so Google stops trusting the
// lastmod and loses a crawl-prioritization signal. Instead:
//   - static / category / product pages (no per-item timestamp) → SITE_UPDATED,
//     a fixed date bumped only when the catalog or those pages actually change;
//   - articles → their own `date` field;
//   - showcase pieces → their DB `updated_at`.
//
// Bump SITE_UPDATED when you make structural/catalog changes you want recrawled.
const SITE_UPDATED = new Date('2026-11-02');

// Articles store a free-text date ("2025", "November 2, 2026", …). Parse it to a
// real Date for lastmod; fall back to SITE_UPDATED if it isn't parseable.
function articleDate(raw: string): Date {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? SITE_UPDATED : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticPages = [
    '', '/showcase', '/jewelry', '/services', '/about', '/contact',
    '/videos', '/gospel-necklace', '/gems-gemology', '/gem',
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${base}${p}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));

  // Category + subcategory pages
  for (const cat of CATEGORIES) {
    // A single-subcategory category page redirect()s straight to that
    // subcategory, so listing the bare /jewelry/<cat> URL would put a redirect
    // in the sitemap ("Page with redirect" in Search Console). Only emit it when
    // the category actually renders its own subcategory chooser.
    if (cat.subcategories.length > 1) {
      entries.push({
        url: `${base}/jewelry/${cat.id}`,
        lastModified: SITE_UPDATED,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const sub of cat.subcategories) {
      if (cat.id === 'religious' && sub.id === 'gospel-necklace') continue;
      entries.push({
        url: `${base}/jewelry/${cat.id}/${sub.id}`,
        lastModified: SITE_UPDATED,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Every product (with image for image sitemap)
  for (const p of PRODUCTS) {
    entries.push({
      url: `${base}${productPath(p)}`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [`${base}${p.image}`],
    });
  }

  // Articles (from Supabase) — lastmod from the article's own date.
  const articles = await getArticles();
  for (const a of articles) {
    entries.push({
      url: `${base}/articles/${a.id}`,
      lastModified: articleDate(a.date),
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  }

  // Showcase pieces (their own /showcase/<slug> pages, from Supabase) — lastmod
  // from the DB updated_at so edits actually move the date.
  const showcaseItems = await getShowcaseItems();
  for (const s of showcaseItems) {
    entries.push({
      url: `${base}/showcase/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: s.image ? [`${base}${s.image}`] : undefined,
    });
  }

  return entries;
}
