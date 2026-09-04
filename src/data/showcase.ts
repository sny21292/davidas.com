// Showcase types + static presentation config (client-safe — NO database import,
// so it can be imported by the client component). The DB fetcher lives in
// `showcase.server.ts` and is used only by the server page.

export interface ShowcaseItem {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  collection: string;
  price: number;
  priceOptions: { label: string; price: number }[];
  description: string;
  image: string;        // premium AI cut-out (the "Finished Piece")
  frontImage: string;   // the client's original photo (the "Front" view)
  images: string[];
  metals: string;
  karats: string;
  style: string;
  video: string;
  motionVideo: string;   // self-hosted worn/turned clip -> "See It In Motion"
  surface: string;       // display prop: cushion | bust | bust-green | ...
  gemstone: string;
  featured: boolean;
  caseNumber: number;
  displayOrder: number;
  sketchImage: string;
  benchImage: string;
  creationVideo: string;
}

export interface ShowcaseCase {
  id: number;
  name: string;
  subtitle: string;
}

export const SHOWCASE_CASES: ShowcaseCase[] = [
  { id: 1, name: 'Featured Collection', subtitle: 'Our finest handcrafted pieces' },
  { id: 2, name: 'Specialty Pieces', subtitle: 'Unique custom designs' },
];

export const SHOWCASE_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ladies', label: 'Ladies' },
  { key: 'religious', label: 'Religious' },
  { key: 'wedding', label: 'Wedding' },
  { key: 'specialty', label: 'Specialty' },
];
