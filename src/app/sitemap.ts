import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { CATEGORIES, PRODUCTS, productPath } from '@/data/products';
import { ARTICLES } from '@/lib/articles';
import { getShowcaseItems } from '@/data/showcase.server';

// Generates /sitemap.xml covering every crawlable URL (this is the payoff of
// giving products real routes instead of hash fragments).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticPages = [
    '', '/showcase', '/jewelry', '/services', '/about', '/contact',
    '/videos', '/gospel-necklace', '/gems-gemology', '/gem',
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));

  // Category + subcategory pages
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${base}/jewelry/${cat.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    for (const sub of cat.subcategories) {
      if (cat.id === 'religious' && sub.id === 'gospel-necklace') continue;
      entries.push({
        url: `${base}/jewelry/${cat.id}/${sub.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Every product (with image for image sitemap)
  for (const p of PRODUCTS) {
    entries.push({
      url: `${base}${productPath(p)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [`${base}${p.image}`],
    });
  }

  // Articles
  for (const a of ARTICLES) {
    entries.push({
      url: `${base}/articles/${a.id}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  }

  // Showcase pieces (their own /showcase/<slug> pages, from Supabase)
  const showcaseItems = await getShowcaseItems();
  for (const s of showcaseItems) {
    entries.push({
      url: `${base}/showcase/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: s.image ? [`${base}${s.image}`] : undefined,
    });
  }

  return entries;
}
