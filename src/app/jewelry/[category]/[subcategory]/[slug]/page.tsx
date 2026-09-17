import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import ProductDetail from '@/components/ProductDetail';
import { productJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import {
  PRODUCTS,
  getCategory,
  getSubcategory,
  getProductBySlug,
  productPath,
} from '@/data/products';
import type { Product } from '@/data/products';

type Params = { category: string; subcategory: string; slug: string };

function productTitle(p: Product, sub?: { label: string }): string {
  const parts = [p.name];
  if (p.metals) parts.push(p.karats ? `${p.karats} ${p.metals}` : p.metals);
  else if (p.karats) parts.push(p.karats);
  if (sub) parts.push(sub.label);
  return parts.join(' | ');
}

function productMetaDescription(p: Product): string {
  const specs = [p.metals, p.karats].filter(Boolean).join(', ');
  const suffix = specs
    ? ` Available in ${specs}. Handcrafted in Greensboro, NC.`
    : ' Handcrafted in Greensboro, NC.';
  const maxIntro = 160 - suffix.length;
  const firstSentence = p.description.replace(/\s+/g, ' ').trim().split(/\.\s/)[0];
  const intro = firstSentence.length > maxIntro
    ? firstSentence.slice(0, maxIntro - 3) + '...'
    : firstSentence + '.';
  return intro + suffix;
}

// Pre-render every product page at build time (SSG) → fully crawlable.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    category: p.category,
    subcategory: p.subcategory,
    slug: p.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { category, subcategory, slug } = await params;
  const p = getProductBySlug(category, subcategory, slug);
  if (!p) return {};
  const sub = getSubcategory(category, subcategory);
  const canonical = productPath(p);
  const title = productTitle(p, sub ?? undefined);
  const desc = productMetaDescription(p);
  const imgAlt = [p.name, p.metals, p.karats].filter(Boolean).join(' — ');
  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description: desc,
      url: canonical,
      images: [{ url: p.image, alt: imgAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [p.image],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { category, subcategory, slug } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  const p = getProductBySlug(category, subcategory, slug);
  if (!cat || !sub || !p) notFound();

  const canonical = productPath(p);

  return (
    <main className="section">
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Jewelry', href: '/jewelry' },
            { label: cat.label, href: `/jewelry/${cat.id}` },
            { label: sub.label, href: `/jewelry/${cat.id}/${sub.id}` },
            { label: p.name },
          ]}
        />
        <div className="jewelry-view">
          <ProductDetail product={p} backHref={`/jewelry/${cat.id}/${sub.id}`} />
        </div>
      </div>

      <JsonLd
        data={[
          productJsonLd(p, canonical),
          breadcrumbJsonLd([
            { name: 'Jewelry', path: '/jewelry' },
            { name: cat.label, path: `/jewelry/${cat.id}` },
            { name: sub.label, path: `/jewelry/${cat.id}/${sub.id}` },
            { name: p.name, path: canonical },
          ]),
        ]}
      />
    </main>
  );
}
