import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import Donut from '@/components/admin/Donut';
import {
  IconArticles, IconShowcase, IconProducts, IconGrid, IconPlay, IconPlus,
} from '@/components/admin/icons';

export const dynamic = 'force-dynamic';

function pct(n: number, d: number): number {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const now = new Date();

  const [articlesRes, showcaseRes] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('showcase_items').select('motion_video, creation_video'),
  ]);
  const articlesCount = articlesRes.count ?? 0;
  const S = showcaseRes.data ?? [];
  const showcaseCount = S.length;
  const scWithVideo = S.filter((x) => (x.motion_video ?? '') || (x.creation_video ?? '')).length;

  const productsCount = PRODUCTS.length;
  const categoriesCount = CATEGORIES.length;
  const totalContent = productsCount + showcaseCount + articlesCount;

  const bars: { label: string; value: number; gold?: boolean }[] = [
    { label: 'Products', value: productsCount },
    { label: 'Showcase', value: showcaseCount, gold: true },
    { label: 'Articles', value: articlesCount },
    { label: 'Categories', value: categoriesCount, gold: true },
  ];
  const barMax = Math.max(1, ...bars.map((b) => b.value));

  const donut = [
    { label: 'Products', value: productsCount, color: '#0b2608' },
    { label: 'Articles', value: articlesCount, color: '#0a9b45' },
    { label: 'Showcase', value: showcaseCount, color: '#d3a033' },
  ];
  const productsPct = pct(productsCount, totalContent);

  const catCounts = CATEGORIES
    .map((c) => ({ label: c.label, value: PRODUCTS.filter((p) => p.category === c.id).length }))
    .sort((a, b) => b.value - a.value);
  const catMax = Math.max(1, ...catCounts.map((c) => c.value));

  const stats = [
    { label: 'Products', value: productsCount, hint: 'Catalog inventory', Icon: IconProducts, feature: true, href: null },
    { label: 'Showcase', value: showcaseCount, hint: 'Featured pieces', Icon: IconShowcase, href: null },
    { label: 'Articles', value: articlesCount, hint: 'Gems & Gemology', Icon: IconArticles, href: '/admin/articles' },
    { label: 'Categories', value: categoriesCount, hint: 'Catalog taxonomy', Icon: IconGrid, href: null },
  ];

  const health = [
    { num: articlesCount, label: 'Articles available', status: 'Active', Icon: IconArticles },
    { num: showcaseCount, label: 'Showcase pieces', status: 'Active', Icon: IconShowcase },
    { num: scWithVideo, label: 'Showcase videos', status: 'Available', Icon: IconPlay },
    { num: productsCount, label: 'Catalog products', status: 'Indexed', Icon: IconProducts },
  ];

  return (
    <div className="admin-page admin-dash">
      {/* HEADER */}
      <div className="admin-dash__header">
        <div>
          <div className="admin-dash__eyebrow">Davidas Admin</div>
          <h1>Dashboard</h1>
          <p className="admin-dash__subtitle">A quick view of your jewelry catalog and content.</p>
        </div>
        <div className="admin-dash__header-right">
          <span className="admin-dash__updated">
            Updated {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn">View website</a>
          <Link href="/admin/articles/new" className="admin-btn admin-btn--primary">
            <IconPlus width={15} height={15} /> New article
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">
        {stats.map((s) => {
          const card = (
            <div className={`admin-stat${s.feature ? ' admin-stat--feature' : ''}`}>
              <div className="admin-stat__top">
                <span className="admin-stat__label">{s.label}</span>
                <span className="admin-stat__icon"><s.Icon /></span>
              </div>
              <span className="admin-stat__value">{s.value}</span>
              <span className="admin-stat__hint">{s.hint}</span>
            </div>
          );
          return s.href
            ? <Link key={s.label} href={s.href} className="admin-stat-link">{card}</Link>
            : <div key={s.label}>{card}</div>;
        })}
      </div>

      {/* OVERVIEW + DONUT */}
      <div className="admin-dash-grid">
        <section className="admin-card">
          <div className="admin-recent__head">
            <div>
              <h2 className="admin-card__title" style={{ margin: 0 }}>Content overview</h2>
              <p className="admin-dash__subtitle" style={{ margin: '4px 0 0' }}>Current content across the platform</p>
            </div>
            <Link href="/admin/articles" className="admin-recent__all">View all →</Link>
          </div>
          <div className="admin-vbars">
            {bars.map((b) => (
              <div key={b.label} className="admin-vbar">
                <div className={`admin-vbar__col${b.gold ? ' admin-vbar__col--gold' : ''}`} style={{ height: `${(b.value / barMax) * 100}%` }}>
                  <span className="admin-vbar__val">{b.value}</span>
                </div>
                <span className="admin-vbar__label">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-card__title">Content distribution</h2>
          <div className="admin-donut-wrap">
            <Donut segments={donut} centerNum={`${productsPct}%`} centerSub="Products" />
            <ul className="admin-legend">
              {donut.map((s) => (
                <li key={s.label}>
                  <span className="admin-legend__dot" style={{ background: s.color }} />
                  {s.label}
                  <strong>{s.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* CATALOG BY CATEGORY (full width) */}
      <section className="admin-card">
        <h2 className="admin-card__title">Catalog by category</h2>
        <div className="admin-hbars">
          {catCounts.map((c) => (
            <div key={c.label} className="admin-hbar">
              <span className="admin-hbar__label">{c.label}</span>
              <span className="admin-hbar__track">
                <span className="admin-hbar__fill" style={{ width: `${(c.value / catMax) * 100}%` }} />
              </span>
              <span className="admin-hbar__val">{c.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT HEALTH */}
      <section className="admin-card">
        <h2 className="admin-card__title">Content health</h2>
        <div className="admin-healthgrid">
          {health.map((h) => (
            <div key={h.label} className="admin-healthcard">
              <span className="admin-healthcard__icon"><h.Icon /></span>
              <div className="admin-healthcard__num">{h.num}</div>
              <div className="admin-healthcard__label">{h.label}</div>
              <div className="admin-healthcard__status">{h.status}</div>
            </div>
          ))}
        </div>
      </section>

      <p className="admin-footer-note">DavidAS Admin · Premium content management</p>
    </div>
  );
}
