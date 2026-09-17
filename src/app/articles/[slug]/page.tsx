import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/styles/article.css';
import Img from '@/components/Img';
import JsonLd from '@/components/JsonLd';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { ARTICLES, getArticle, articleOgImage } from '@/lib/articles';
import type { Article } from '@/lib/articles';

type Params = { slug: string };

const SEO_TITLES: Record<string, string> = {
  'paraiba-tourmaline': 'Paraiba Tourmaline: Rarity, Color & Value Guide',
  'maine-tourmaline': 'Maine Tourmaline: History, Mining & Gem Guide',
  'when-gemstones-are-waste': 'Recycled Gemstones: When Gems Become Waste',
  'abalone-pearl': 'Abalone Pearl: Rarity, Colors & Value Guide',
  'blue-topaz': 'Blue Topaz: Irradiation, Grades & Buying Guide',
  'brazilian-alexandrite': 'Brazilian Alexandrite: Color-Change Gem Guide',
  'turquoise': 'Turquoise: History, Grading & Value Guide',
  'vietnamese-ruby': 'Vietnamese Ruby: Origin, Quality & Value',
  'zircon': 'Zircon: Colors, Properties & Buying Guide',
  'akoya-pearl': 'Akoya Pearl: Quality, Grading & Value Guide',
  'burma-ruby': "Burma Ruby: Why Mogok Commands Top Prices",
  'burma-sapphire': 'Burma Sapphire: Origin, Color & Market Value',
  'tahitian-black-pearl': 'Tahitian Black Pearl: Colors, Grading & Value',
  'california-tourmaline': "California Tourmaline: History & Tiffany's Legacy",
  'chinese-freshwater-pearls': 'Chinese Freshwater Pearls: Quality & Value Guide',
  'chrome-tourmaline': 'Chrome Tourmaline: The Rarest Green Tourmaline',
  'fire-opal': 'Mexican Fire Opal: Color, Care & Buying Guide',
  'indicolite': 'Indicolite: The Rare Blue Tourmaline Guide',
};

function articleSeoTitle(a: Article): string {
  return SEO_TITLES[a.id] ?? a.title;
}

function articleMetaDescription(a: Article): string {
  const text = a.excerpt.replace(/\s+/g, ' ').trim();
  if (text.length <= 160) return text;
  const truncated = text.slice(0, 157);
  const lastPeriod = truncated.lastIndexOf('.');
  if (lastPeriod > 80) return truncated.slice(0, lastPeriod + 1);
  return truncated.slice(0, 154) + '...';
}

// Pre-render every article (SSG) at clean URLs /articles/<id>.
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Article not found' };
  const title = articleSeoTitle(a);
  const desc = articleMetaDescription(a);
  const path = `/articles/${a.id}`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      url: path,
      images: [{ url: articleOgImage(a), alt: a.title }],
      ...(a.date ? { publishedTime: a.date } : {}),
      authors: [a.author],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const path = `/articles/${a.id}`;

  return (
    <main className="article-page">
      <div className="container">
        <Link href="/gems-gemology" className="article-page__back">
          Back to the Library
        </Link>

        <div className="article-page__tag">{a.tag}</div>
        <h1 className="article-page__title">{a.title}</h1>
        <div className="article-page__meta">
          <strong>{a.author}</strong>
          {a.date ? ` — ${a.date}` : ''}
        </div>

        <div className="article-page__content">
          {a.image && (
            <div className="article-page__image">
              <Img src={a.image} alt={a.title} sizes="(max-width: 600px) 200px, 380px" priority />
            </div>
          )}

          <div
            className="article-page__body"
            dangerouslySetInnerHTML={{ __html: a.content }}
          />
        </div>

        <div className="article-page__footer">
          <Link href="/gems-gemology" className="btn btn--outline">
            Back to the Library
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          articleJsonLd({
            title: a.title,
            author: a.author,
            date: a.date,
            excerpt: a.excerpt,
            image: articleOgImage(a),
            path,
          }),
          breadcrumbJsonLd([
            { name: 'Gems & Gemology', path: '/gems-gemology' },
            { name: a.title, path },
          ]),
        ]}
      />
    </main>
  );
}
