// Bidirectional mapping between gem articles and jewelry products for internal
// linking. Each entry uses real route paths so links work without any lookup.

interface ProductLink {
  path: string;
  label: string;
}

interface ArticleLink {
  slug: string;
  title: string;
}

// ── Article → Products ─────────────────────────────────────────────────────

const ARTICLE_TO_PRODUCTS: Record<string, ProductLink[]> = {
  // Pearl articles → pearl products
  'tahitian-black-pearl': [
    { path: '/jewelry/ladies/rings/tahitian-pearl-gemstone-statement-ring', label: 'Tahitian Pearl & Gemstone Statement Ring' },
    { path: '/jewelry/ladies/rings/tahitian-pearl-ring', label: 'Tahitian Pearl Ring' },
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
    { path: '/jewelry/ladies/rings/black-pearl-open-band-ring', label: 'Black Pearl Open-Band Ring' },
  ],
  'akoya-pearl': [
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
    { path: '/jewelry/ladies/rings/tahitian-pearl-ring', label: 'Tahitian Pearl Ring' },
  ],
  'chinese-freshwater-pearls': [
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
    { path: '/jewelry/ladies/rings/tahitian-pearl-ring', label: 'Tahitian Pearl Ring' },
  ],
  'american-freshwater-pearl': [
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
  ],
  'conch-pearl': [
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],
  'abalone-pearl': [
    { path: '/jewelry/ladies/pendants/pearl-pendant', label: 'Pearl Pendant' },
  ],

  // Emerald articles → emerald / gemstone products
  'colombian-emerald': [
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],
  'zambian-emerald': [
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],

  // Ruby articles → engagement rings + gemstone rings
  'burma-ruby': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/wedding/engagement/halo-engagement-ring', label: 'Halo Engagement Ring' },
  ],
  'thai-ruby': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/crossover-gemstone-ring', label: 'Crossover Gemstone Ring' },
  ],
  'east-african-ruby': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'vietnamese-ruby': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/wedding/engagement/halo-engagement-ring', label: 'Halo Engagement Ring' },
  ],

  // Sapphire articles → engagement rings + gemstone rings
  'burma-sapphire': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/wedding/engagement/halo-engagement-ring', label: 'Halo Engagement Ring' },
  ],
  'east-african-fancy-sapphire': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/earrings/dangle-earrings', label: 'Dangle Earrings' },
    { path: '/jewelry/ladies/rings/multi-cluster-gemstone-ring', label: 'Multi-Cluster Gemstone Ring' },
  ],

  // Tourmaline articles → gemstone pendants + rings
  'paraiba-tourmaline': [
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/trillion-gemstone-statement-ring', label: 'Trillion Gemstone Statement Ring' },
  ],
  'california-tourmaline': [
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/crossover-gemstone-ring', label: 'Crossover Gemstone Ring' },
  ],
  'maine-tourmaline': [
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'chrome-tourmaline': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
  ],
  'indicolite': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],
  'rubellite': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],

  // Garnet articles → cross pendants + gemstone rings
  'demantoid-garnet': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/religious/cross/gemstone-cross-pendant', label: 'Gemstone Cross Pendant' },
  ],
  'malaya-garnet': [
    { path: '/jewelry/ladies/rings/crossover-gemstone-ring', label: 'Crossover Gemstone Ring' },
    { path: '/jewelry/religious/cross/gemstone-cross-pendant', label: 'Gemstone Cross Pendant' },
  ],
  'rhodolite-garnet': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/religious/cross/gemstone-cross-pendant', label: 'Gemstone Cross Pendant' },
  ],

  // Opal articles → gemstone rings
  'australian-black-opal': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'australian-white-opal': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'fire-opal': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],

  // Tanzanite → gemstone rings
  'tanzanite': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
  ],

  // Alexandrite articles → halo ring
  'brazilian-alexandrite': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'russian-alexandrite': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],

  // Spinel → halo ring
  'pink-spinel': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/crossover-gemstone-ring', label: 'Crossover Gemstone Ring' },
  ],

  // Blue topaz → gemstone pendants + rings
  'blue-topaz': [
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/trillion-pendant', label: 'Trillion Pendant' },
  ],

  // Citrine → gemstone rings + pendants
  'citrine': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
  ],

  // Amethyst → gemstone rings
  'african-amethyst': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],

  // Aquamarine → gemstone pendants + rings
  'african-aquamarine': [
    { path: '/jewelry/ladies/pendants/emerald-cut-gemstone-pendant', label: 'Emerald-Cut Gemstone Pendant' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],

  // Iolite → gemstone rings
  'iolite': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],

  // Kunzite → gemstone rings + pendants
  'kunzite': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],

  // Zircon → gemstone rings
  'zircon': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/trillion-gemstone-statement-ring', label: 'Trillion Gemstone Statement Ring' },
  ],

  // Cats-eye chrysoberyl → gemstone rings
  'cats-eye-chrysoberyl': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
  ],

  // Andalusite → gemstone rings
  'andalusite': [
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
    { path: '/jewelry/ladies/pendants/filigree-gemstone-pendant', label: 'Filigree Gemstone Pendant' },
  ],

  // General gem articles → ladies category page
  'amber': [
    { path: '/jewelry/ladies/pendants', label: 'Ladies Pendants Collection' },
  ],
  'coral': [
    { path: '/jewelry/ladies/pendants', label: 'Ladies Pendants Collection' },
  ],
  'turquoise': [
    { path: '/jewelry/ladies/rings', label: 'Ladies Rings Collection' },
    { path: '/jewelry/ladies/pendants', label: 'Ladies Pendants Collection' },
  ],
  'moonstone': [
    { path: '/jewelry/ladies/rings/halo-gemstone-ring', label: 'Halo Gemstone Ring' },
    { path: '/jewelry/ladies/rings/oval-gemstone-ring', label: 'Oval Gemstone Ring' },
  ],
  'lapis-lazuli': [
    { path: '/jewelry/ladies/pendants', label: 'Ladies Pendants Collection' },
    { path: '/jewelry/gents/pendants', label: 'Gents Pendants Collection' },
  ],
  'burma-jadeite': [
    { path: '/jewelry/ladies/rings', label: 'Ladies Rings Collection' },
    { path: '/jewelry/ladies/pendants', label: 'Ladies Pendants Collection' },
  ],
};

// ── Product → Articles (reverse index, built from the forward map) ─────────

const ARTICLE_TITLES: Record<string, string> = {
  'tahitian-black-pearl': 'Tahitian Black Pearl',
  'akoya-pearl': 'Akoya Pearl',
  'chinese-freshwater-pearls': 'Chinese Freshwater Pearls',
  'american-freshwater-pearl': 'American Freshwater Pearl',
  'conch-pearl': 'Conch Pearl',
  'abalone-pearl': 'Abalone Pearl',
  'colombian-emerald': 'Colombian Emerald',
  'zambian-emerald': 'Zambian Emerald',
  'burma-ruby': 'Burma Ruby',
  'thai-ruby': 'Thai Ruby',
  'east-african-ruby': 'East African Ruby',
  'vietnamese-ruby': 'Vietnamese Ruby',
  'burma-sapphire': 'Burma Sapphire',
  'east-african-fancy-sapphire': 'East African Fancy Sapphire',
  'paraiba-tourmaline': 'Paraíba Tourmaline',
  'california-tourmaline': 'California Tourmaline',
  'maine-tourmaline': 'Maine Tourmaline',
  'chrome-tourmaline': 'Chrome Tourmaline',
  'indicolite': 'Indicolite',
  'rubellite': 'Rubellite',
  'demantoid-garnet': 'Demantoid Garnet',
  'malaya-garnet': 'Malaya Garnet',
  'rhodolite-garnet': 'Rhodolite Garnet',
  'australian-black-opal': 'Australian Black Opal',
  'australian-white-opal': 'Australian White Opal',
  'fire-opal': 'Fire Opal',
  'tanzanite': 'Tanzanite',
  'brazilian-alexandrite': 'Brazilian Alexandrite',
  'russian-alexandrite': 'Russian Alexandrite',
  'pink-spinel': 'Pink Spinel',
  'blue-topaz': 'Blue Topaz',
  'citrine': 'Citrine',
  'african-amethyst': 'African Amethyst',
  'african-aquamarine': 'African Aquamarine',
  'iolite': 'Iolite',
  'kunzite': 'Kunzite',
  'zircon': 'Zircon',
  'cats-eye-chrysoberyl': "Cat's Eye Chrysoberyl",
  'andalusite': 'Andalusite',
  'amber': 'Amber',
  'coral': 'Precious Coral',
  'turquoise': 'Turquoise',
  'moonstone': 'Moonstone',
  'lapis-lazuli': 'Lapis Lazuli',
  'burma-jadeite': 'Burma Jadeite',
};

function extractProductSlug(path: string): string | null {
  const parts = path.split('/');
  return parts.length === 5 ? parts[4] : null;
}

function buildReverseIndex(): Record<string, ArticleLink[]> {
  const map: Record<string, ArticleLink[]> = {};
  for (const [articleSlug, products] of Object.entries(ARTICLE_TO_PRODUCTS)) {
    const title = ARTICLE_TITLES[articleSlug] ?? articleSlug;
    for (const p of products) {
      const prodSlug = extractProductSlug(p.path);
      if (!prodSlug) continue;
      if (!map[prodSlug]) map[prodSlug] = [];
      if (!map[prodSlug].some((a) => a.slug === articleSlug)) {
        map[prodSlug].push({ slug: articleSlug, title });
      }
    }
  }
  return map;
}

const PRODUCT_TO_ARTICLES = buildReverseIndex();

// ── Public API ──────────────────────────────────────────────────────────────

export function getRelatedProducts(articleSlug: string): ProductLink[] {
  return ARTICLE_TO_PRODUCTS[articleSlug] ?? [];
}

export function getRelatedArticles(productSlug: string): ArticleLink[] {
  return PRODUCT_TO_ARTICLES[productSlug] ?? [];
}
