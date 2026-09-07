// Server-only: fetches showcase items from Supabase at BUILD TIME. Kept separate
// from showcase.ts so the client component can import the static config without
// pulling the database client into the browser bundle.
import { supabase } from '@/lib/supabase';
import type { ShowcaseItem } from './showcase';

let _cache: Promise<ShowcaseItem[]> | null = null;

export function getShowcaseItems(): Promise<ShowcaseItem[]> {
  if (!_cache) _cache = fetchShowcaseItems();
  return _cache;
}

async function fetchShowcaseItems(): Promise<ShowcaseItem[]> {
  const { data, error } = await supabase
    .from('showcase_items')
    .select('*')
    .order('case_number')
    .order('display_order');
  if (error) throw error;
  return (data ?? []).map((r) => ({
    slug: r.slug,
    name: r.name,
    category: r.category_id ?? '',
    subcategory: r.subcategory_id ?? '',
    collection: r.collection ?? '',
    price: r.price ?? 0,
    priceOptions: Array.isArray(r.price_options)
      ? (r.price_options as { label: string; price: number }[])
      : [],
    description: r.description ?? '',
    image: r.image ?? '',
    frontImage: r.front_image ?? '',
    images: r.images ?? [],
    metals: r.metals ?? '',
    karats: r.karats ?? '',
    style: r.style ?? '',
    video: r.video ?? '',
    motionVideo: r.motion_video ?? '',
    surface: r.surface ?? 'cushion',
    gemstone: r.gemstone ?? '',
    featured: r.featured,
    caseNumber: r.case_number,
    displayOrder: r.display_order,
    sketchImage: r.sketch_image ?? '',
    benchImage: r.bench_image ?? '',
    creationVideo: r.creation_video ?? '',
  }));
}
