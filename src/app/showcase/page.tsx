import type { Metadata } from 'next';
import '@/styles/showcase.css';
import ShowcaseCollection from '@/components/ShowcaseCollection';
import { getShowcaseItems } from '@/data/showcase.server';

// OG image is one of the showcase pieces (not the site-wide default).
const SHOWCASE_OG_IMAGE = '/images/showcase/real/mystic-topaz-pendant.jpg';

export const metadata: Metadata = {
  title: 'The Jewelry Showcase',
  description:
    'Explore our virtual jewelry showcase — browse fine rings, pendants, bracelets, and earrings from Davidas Design Concepts.',
  alternates: { canonical: '/showcase' },
  openGraph: {
    type: 'website',
    title: 'The Jewelry Showcase | Davidas Design Concepts',
    description:
      'Explore our virtual jewelry showcase — fine rings, pendants, and necklaces from Davidas Design Concepts.',
    url: '/showcase',
    images: [{ url: SHOWCASE_OG_IMAGE, alt: 'Davidas Design Concepts jewelry showcase' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Jewelry Showcase | Davidas Design Concepts',
    images: [SHOWCASE_OG_IMAGE],
  },
};

export default async function ShowcasePage() {
  const items = await getShowcaseItems();
  return (
    <main className="showcase-page">
      <ShowcaseCollection items={items} />
    </main>
  );
}
