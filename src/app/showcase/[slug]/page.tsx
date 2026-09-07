import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/styles/showcase.css';
import Breadcrumb from '@/components/Breadcrumb';
import ShowcaseProductDetail from '@/components/ShowcaseProductDetail';
import { getShowcaseItems } from '@/data/showcase.server';

type Params = { slug: string };

// Pre-render every showcase piece at build time from Supabase (SSG). These are
// the real product pages for showcase pieces — indexable, in the sitemap.
export async function generateStaticParams() {
  const items = await getShowcaseItems();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const items = await getShowcaseItems();
  const item = items.find((i) => i.slug === slug);
  if (!item) return {};
  const canonical = `/showcase/${item.slug}`;
  const shortDesc = item.description.replace(/\s+/g, ' ').trim().slice(0, 155);
  return {
    title: item.name,
    description: shortDesc,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${item.name} | Davidas Design Concepts`,
      description: shortDesc,
      url: canonical,
      images: item.image ? [{ url: item.image, alt: item.name }] : undefined,
    },
  };
}

export default async function ShowcaseProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const items = await getShowcaseItems();
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();

  return (
    <main className="section showcase-page" data-velvet="emerald">
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Showcase', href: '/showcase' },
            { label: item.name },
          ]}
        />
        <ShowcaseProductDetail item={item} />
      </div>
    </main>
  );
}
