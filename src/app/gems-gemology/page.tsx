import type { Metadata } from 'next';
import '@/styles/bookshelf.css';
import Bookshelf from '@/components/Bookshelf';
import { getArticles } from '@/lib/articles.server';

export const metadata: Metadata = {
  title: 'Gems & Gemology',
  description:
    'Gems & Gemology Library — Explore expert articles on gemstones, gem profiles, and industry insights from Davidas Design Concepts.',
  alternates: { canonical: '/gems-gemology' },
};

// Articles come from Supabase (fetched at build time).
export default async function GemsGemologyPage() {
  const articles = await getArticles();
  return <Bookshelf articles={articles} />;
}
