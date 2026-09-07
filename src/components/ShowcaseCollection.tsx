'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  SHOWCASE_CASES,
  SHOWCASE_CATEGORIES,
} from '@/data/showcase';
import type { ShowcaseItem } from '@/data/showcase';
import Img from '@/components/Img';

function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US');
}

const VELVET_DARK = '/images/showcase/velvet.jpg';
const VELVET_GREEN = '/images/showcase/green-velvet.png';
// Fallback prop for any piece whose `surface` isn't in PROP_IMAGES. Points to an
// existing asset (cushion.png was never shipped) so an unknown surface never
// renders a broken image.
const CUSHION_IMG = '/images/showcase/props/bust.png';

// Per-piece display prop, keyed on ShowcaseItem.surface.
const PROP_IMAGES: Record<string, string> = {
  cushion: '/images/showcase/props/bust.png',
  bust: '/images/showcase/props/bust.png',
  'box-ring': '/images/showcase/props/box2.png',
  velvet: '/images/showcase/infinity-backdrop.png',
  boxtop: '/images/showcase/props/box-closed.png',
};

/* ───── Hero ───── */
function ShowcaseHero({ velvet }: { velvet: string }) {
  return (
    <section className="sc-hero">
      <img
        src={velvet}
        alt=""
        aria-hidden="true"
        className="sc-hero__velvet"
      />
      <div className="sc-hero__vignette" />

      <div className="sc-hero__grid">
        <div>
          <p className="sc-hero__eyebrow">The Virtual Showcase</p>
          <h1 className="sc-hero__title">
            Our
            <br />
            Collection
          </h1>
          <div className="sc-hero__rule" />
          <p className="sc-hero__subtitle">
            Timeless designs. Exceptional craftsmanship.
            <br />
            Discover the perfect piece for your story.
          </p>
          <a href="#showcase" className="sc-hero__cta">
            Enter the case
          </a>
        </div>

        <div className="sc-hero__case">
          <div className="sc-hero__case-inner">
            <img
              src="/images/showcase/hero.jpg"
              alt="Diamond ring resting on black velvet inside a gold display case"
              className="sc-hero__img"
            />
            <div className="sc-hero__glass" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Collection Navigation ───── */
function CollectionNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <nav className="sc-nav">
      {SHOWCASE_CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`sc-nav__tab${active === cat.key ? ' active' : ''}`}
          onClick={() => onChange(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}

/* ───── Product Compartment ───── */
function ShowcaseProduct({
  item,
  index = 0,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: {
  item: ShowcaseItem;
  index?: number;
  onSelect: (item: ShowcaseItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
}) {
  return (
    <div className="sc-comp" style={{ '--item-index': index } as React.CSSProperties}>
      <button
        className={`sc-comp__fav${isFavorite ? ' active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.slug); }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <div className="sc-comp__spotlight" />
      <div className="sc-comp__sparkles">
        <span className="sc-comp__sparkle" />
        <span className="sc-comp__sparkle" />
        <span className="sc-comp__sparkle" />
      </div>
      <button
        className="sc-comp__btn"
        onClick={() => onSelect(item)}
        aria-label={`View ${item.name}`}
      >
        <div className={`sc-comp__image sc-comp__image--${item.surface}`}>
          <Img
            src={item.image}
            alt={item.name}
            className="sc-comp__img"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <img
            src={PROP_IMAGES[item.surface] || CUSHION_IMG}
            alt=""
            aria-hidden="true"
            className="sc-comp__cushion"
          />
          <div className="sc-comp__reflection" />
        </div>
        <span className="sc-comp__info">
          <span className="sc-comp__name">{item.name}</span>
          <span className="sc-comp__price">{formatPrice(item.price)}</span>
        </span>
      </button>
    </div>
  );
}

/* ───── Display Case ───── */
function DisplayCase({
  activeCase,
  items,
  onSelectItem,
  velvet,
  slideDirection,
  favorites,
  onToggleFavorite,
}: {
  activeCase: number;
  items: ShowcaseItem[];
  onSelectItem: (item: ShowcaseItem) => void;
  velvet: string;
  slideDirection: 'left' | 'right' | null;
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
}) {
  const caseItems = items.filter((i) => i.caseNumber === activeCase);
  const cols = 4;
  const rows = Math.ceil(caseItems.length / cols);

  const slideClass = slideDirection === 'right'
    ? ' sc-case--slide-right'
    : slideDirection === 'left'
      ? ' sc-case--slide-left'
      : '';

  return (
    <div id="showcase" className="sc-display">
      <div className="sc-case-3d">
        <div className="sc-case-3d__top" />
        <div className="sc-case-3d__body">
          <div className="sc-case-3d__left" />
          <div className={`sc-case${slideClass}`} key={activeCase}>
            <div className="sc-case__interior">
              <img
                src={velvet}
                alt=""
                aria-hidden="true"
                className="sc-case__velvet-img"
              />
              <div className="sc-case__vignette" />

              <div className="sc-case__grid">
                {caseItems.map((item, idx) => (
                  <ShowcaseProduct
                    key={item.slug}
                    item={item}
                    index={idx}
                    onSelect={onSelectItem}
                    isFavorite={favorites.includes(item.slug)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>

              {/* Gold dividers */}
              <div className="sc-case__dividers">
                {Array.from({ length: Math.min(cols, caseItems.length) - 1 }, (_, i) => (
                  <span
                    key={`v${i}`}
                    className="sc-case__divider-v"
                    style={{ left: `${((i + 1) / Math.min(cols, caseItems.length)) * 100}%` }}
                  />
                ))}
                {Array.from({ length: rows - 1 }, (_, i) => (
                  <span
                    key={`h${i}`}
                    className="sc-case__divider-h"
                    style={{ top: `${((i + 1) / rows) * 100}%` }}
                  />
                ))}
              </div>

              <div className="sc-case__glass" />
            </div>
          </div>
          <div className="sc-case-3d__right" />
        </div>
        <div className="sc-case-3d__base" />
      </div>
    </div>
  );
}

/* ───── Case Navigation ───── */
function CaseNav({
  activeCase,
  onCaseChange,
  onDotClick,
}: {
  activeCase: number;
  onCaseChange: (direction: 'prev' | 'next') => void;
  onDotClick: (caseId: number) => void;
}) {
  const currentCase = SHOWCASE_CASES.find((c) => c.id === activeCase);
  const total = SHOWCASE_CASES.length;

  return (
    <div className="sc-case-nav">
      <button
        className="sc-case-nav__btn"
        onClick={() => onCaseChange('prev')}
        disabled={activeCase <= 1}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path d="M12 4 L6 10 L12 16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
        Previous case
      </button>

      <div className="sc-case-nav__info">
        <p className="sc-case-nav__title">{currentCase?.name}</p>
        <div className="sc-case-nav__dots">
          {SHOWCASE_CASES.map((c) => (
            <button
              key={c.id}
              className={`sc-case-nav__dot${c.id === activeCase ? ' active' : ''}`}
              onClick={() => onDotClick(c.id)}
              aria-label={`Go to case ${c.id}`}
            />
          ))}
        </div>
      </div>

      <button
        className="sc-case-nav__btn"
        onClick={() => onCaseChange('next')}
        disabled={activeCase >= total}
      >
        Next case
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path d="M8 4 L14 10 L8 16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </button>
    </div>
  );
}

/* ───── Product Gallery with "From Sketch to Showcase" tabs ───── */
type CreationTab = 'front' | 'finished' | 'closeup';

function ProductGallery({ item, velvet }: { item: ShowcaseItem; velvet: string }) {
  const [activeTab, setActiveTab] = useState<CreationTab>('finished');
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const hasFront = !!item.frontImage;

  useEffect(() => {
    setActiveTab('finished');
  }, [item.slug]);

  // Front = the client's original photo. Finished + Close-up both show our
  // premium cut-out on velvet (Close-up is the hover-zoom of that premium image).
  const displayImage = activeTab === 'front' ? item.frontImage : item.image;
  const showVelvet = activeTab !== 'front';

  // Amazon-style hover-zoom for the Close-up view.
  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTab !== 'closeup') return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };
  const handleZoomLeave = () => setZoom((z) => ({ ...z, on: false }));

  const tabs: { key: CreationTab; label: string }[] = [
    ...(hasFront ? [{ key: 'front' as CreationTab, label: 'Front' }] : []),
    { key: 'finished' as CreationTab, label: 'Finished Piece' },
    { key: 'closeup' as CreationTab, label: 'Close-up' },
  ];

  return (
    <div className="sc-gallery">
      {/* Photography views */}
      <div className="sc-creation-tabs">
        <span className="sc-creation-tabs__brand">Photography</span>
        <div className="sc-creation-tabs__row">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`sc-creation-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sc-gallery__frame">
        <div
          className={`sc-gallery__main${activeTab === 'closeup' ? ' sc-gallery__main--zoomable' : ''}`}
          onMouseMove={handleZoomMove}
          onMouseLeave={handleZoomLeave}
        >
          {showVelvet && (
            <img src={velvet} alt="" aria-hidden="true" className="sc-gallery__velvet" />
          )}
          <Img
            src={displayImage}
            alt={activeTab === 'front' ? `${item.name} — original photo` : item.name}
            className={`sc-gallery__img${activeTab === 'front' ? ' sc-gallery__img--front' : ''}`}
            sizes="(max-width: 640px) 100vw, 500px"
            style={activeTab === 'closeup' ? {
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transform: zoom.on ? 'scale(2.8)' : 'scale(1)',
              transition: zoom.on ? 'transform 0.04s linear' : 'transform 0.3s ease',
            } : undefined}
          />
          <div className="sc-gallery__glass" />

          {activeTab === 'front' && (
            <span className="sc-gallery__tab-label">Original Photo</span>
          )}
          {activeTab === 'closeup' && (
            <span className="sc-gallery__tab-label">{zoom.on ? 'Zoomed in' : 'Hover to zoom'}</span>
          )}
        </div>
      </div>

      {/* Thumbnails: Front (client photo) / Finished (premium) / Close-up */}
      <div className="sc-gallery__thumbs">
        {[
          ...(hasFront ? [{ src: item.frontImage, label: 'Front', tab: 'front' as CreationTab }] : []),
          { src: item.image, label: 'Finished', tab: 'finished' as CreationTab },
          { src: item.image, label: 'Close-up', tab: 'closeup' as CreationTab },
        ].map((t) => (
          <button
            key={t.tab}
            className={`sc-gallery__thumb${activeTab === t.tab ? ' active' : ''}`}
            onClick={() => setActiveTab(t.tab)}
          >
            <img src={t.src} alt={t.label} className="sc-gallery__thumb-img" />
            <span className="sc-gallery__thumb-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───── Video Modal with seamless transition ───── */
function VideoModal({ item, onClose }: { item: ShowcaseItem; onClose: () => void }) {
  const [ended, setEnded] = useState(false);
  // A real bench/creation film uses the "creation" wording; a worn/turned clip
  // uses "in motion". Fall back to the default ad only if neither exists.
  const isMotion = !item.creationVideo && !!item.motionVideo;
  const videoSrc = item.creationVideo || item.motionVideo || '/video-files/Jewelry-Repair-Ad.mp4';

  useEffect(() => {
    setEnded(false);
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="sc-video-modal" onClick={onClose}>
      <div className="sc-video-modal__frame" onClick={(e) => e.stopPropagation()}>
        <button className="sc-video-modal__close" onClick={onClose} aria-label="Close video">
          &times;
        </button>

        {!ended && (
          <p className="sc-video-modal__title">
            {isMotion ? `${item.name} in Motion` : `The Creation of ${item.name}`}
          </p>
        )}

        <div className="sc-video-modal__inner">
          {ended ? (
            <div className="sc-video-modal__reveal">
              <Img
                src={item.image}
                alt={item.name}
                className="sc-video-modal__reveal-img"
                sizes="(max-width: 800px) 100vw, 700px"
              />
              <div className="sc-video-modal__reveal-info">
                <h3 className="sc-video-modal__reveal-name">{item.name}</h3>
                <p className="sc-video-modal__reveal-tag">Designed. Crafted. Finished by Hand.</p>
                <p className="sc-video-modal__reveal-price">{formatPrice(item.price)}</p>
                <button className="sc-video-modal__reveal-btn" onClick={onClose}>
                  Return to Case
                </button>
              </div>
            </div>
          ) : (
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              onEnded={() => setEnded(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ───── Product Modal ───── */
function ProductModal({
  item,
  items,
  onClose,
  onPlayVideo,
  onNavigate,
  velvet,
  isFavorite,
  onToggleFavorite,
}: {
  item: ShowcaseItem;
  items: ShowcaseItem[];
  onClose: () => void;
  onPlayVideo: () => void;
  onNavigate: (item: ShowcaseItem) => void;
  velvet: string;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
}) {
  const currentIndex = items.findIndex((i) => i.slug === item.slug);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(items[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(items[currentIndex + 1]);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, hasPrev, hasNext, currentIndex, items, onNavigate]);

  const details = [
    { label: 'Metal', value: item.metals },
    { label: 'Karats', value: item.karats },
    { label: 'Style #', value: item.style },
    { label: 'Gemstone', value: item.gemstone },
    { label: 'Collection', value: item.collection },
  ].filter((d) => d.value);

  return (
    <div className="sc-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.name}>
      {/* Product navigation arrows */}
      <button
        className="sc-modal__nav sc-modal__nav--prev"
        onClick={(e) => { e.stopPropagation(); if (hasPrev) onNavigate(items[currentIndex - 1]); }}
        disabled={!hasPrev}
        aria-label="Previous product"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
          <path d="M12 4 L6 10 L12 16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button
        className="sc-modal__nav sc-modal__nav--next"
        onClick={(e) => { e.stopPropagation(); if (hasNext) onNavigate(items[currentIndex + 1]); }}
        disabled={!hasNext}
        aria-label="Next product"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
          <path d="M8 4 L14 10 L8 16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div className="sc-modal__panel" onClick={(e) => e.stopPropagation()}>
        <img
          src={velvet}
          alt=""
          aria-hidden="true"
          className="sc-modal__velvet"
        />
        <button className="sc-modal__close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="sc-modal__grid">
          <div className="sc-modal__left">
            <ProductGallery item={item} velvet={velvet} />
          </div>

          <div className="sc-details">
            <p className="sc-details__eyebrow">{item.category}</p>
            <h2 className="sc-details__name">{item.name}</h2>
            <p className="sc-details__price">{formatPrice(item.price)}</p>
            {item.priceOptions.length > 0 && (
              <div className="sc-details__price-options">
                {item.priceOptions.map((o) => (
                  <div key={o.label} className="sc-details__price-option">
                    <span className="sc-details__price-option-label">{o.label}</span>
                    <span className="sc-details__price-option-value">{formatPrice(o.price)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="sc-details__rule" />
            <div className="sc-details__desc">
              {item.description.split('\n').map((para) => para.trim()).filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {details.length > 0 && (
              <div className="sc-details__specs">
                {details.map((d) => (
                  <div key={d.label} className="sc-details__spec">
                    <span className="sc-details__spec-label">{d.label}</span>
                    <span className="sc-details__spec-value">{d.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="sc-details__actions">
              <a href={`/jewelry/${item.category}/${item.subcategory}/${item.slug}?inquiry=1`} className="sc-btn-gold">Inquire Now</a>
              <button
                className="sc-btn-outline"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                View Entire Case
              </button>
              <button
                className={`sc-btn-heart${isFavorite ? ' active' : ''}`}
                onClick={() => onToggleFavorite(item.slug)}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
            </div>

            {(item.motionVideo || item.creationVideo) && (
              <div className="sc-video-cta">
                <div className="sc-video-cta__icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M15 8v8H5V8h10m1-2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4V7.5l-4 4V7a1 1 0 0 0-1-1z"/>
                  </svg>
                </div>
                <div className="sc-video-cta__content">
                  <p className="sc-video-cta__title">
                    {item.creationVideo ? 'See How This Piece Was Created' : 'See It In Motion'}
                  </p>
                  <p className="sc-video-cta__text">
                    {item.creationVideo
                      ? 'Watch the 30-second journey from sketch to finished jewelry.'
                      : 'Watch this finished piece worn and turned in the light.'}
                  </p>
                </div>
                <button className="sc-video-cta__play" onClick={onPlayVideo}>
                  Play video
                  <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                    <path d="M5 2 L13 8 L5 14 Z" />
                  </svg>
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="sc-modal__product-dots">
          {items.map((p) => (
            <button
              key={p.slug}
              className={`sc-modal__product-dot${p.slug === item.slug ? ' active' : ''}`}
              onClick={() => onNavigate(p)}
              aria-label={p.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type VelvetTheme = 'emerald' | 'charcoal' | 'espresso';

/* ───── Main Collection Component ───── */
export default function ShowcaseCollection({ items }: { items: ShowcaseItem[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCase, setActiveCase] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [velvetTheme] = useState<VelvetTheme>('emerald');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Velvet texture is always the same image; CSS recolors it per theme
  // (emerald / charcoal / espresso) via filters keyed on [data-velvet].
  const heroVelvet = VELVET_GREEN;
  const caseVelvet = VELVET_GREEN;

  useEffect(() => {
    const el = document.querySelector('.showcase-page');
    if (el) el.setAttribute('data-velvet', velvetTheme);
    return () => { el?.removeAttribute('data-velvet'); };
  }, [velvetTheme]);

  const filteredItems = useMemo(() =>
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category === activeCategory),
    [activeCategory, items]
  );

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setActiveCase(1);
    setSlideDirection(null);
  }, []);

  const handleCaseChange = useCallback(
    (direction: 'prev' | 'next') => {
      setSlideDirection(direction === 'next' ? 'right' : 'left');
      setActiveCase((prev) => {
        if (direction === 'next') return Math.min(prev + 1, SHOWCASE_CASES.length);
        return Math.max(prev - 1, 1);
      });
    },
    []
  );

  const handleDotClick = useCallback((caseId: number) => {
    setSlideDirection(caseId > activeCase ? 'right' : 'left');
    setActiveCase(caseId);
  }, [activeCase]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const handleModalNavigate = useCallback((item: ShowcaseItem) => {
    setSelectedItem(item);
  }, []);

  return (
    <>
      <ShowcaseHero velvet={heroVelvet} />
      <section className="sc-browse-section">
        <img
          src={VELVET_GREEN}
          alt=""
          aria-hidden="true"
          className="sc-browse-section__velvet"
        />
        <CollectionNav active={activeCategory} onChange={handleCategoryChange} />
        <DisplayCase
          activeCase={activeCase}
          items={filteredItems}
          onSelectItem={setSelectedItem}
          velvet={caseVelvet}
          slideDirection={slideDirection}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <CaseNav
          activeCase={activeCase}
          onCaseChange={handleCaseChange}
          onDotClick={handleDotClick}
        />
      </section>
      {selectedItem && (
        <ProductModal
          item={selectedItem}
          items={filteredItems}
          onClose={() => setSelectedItem(null)}
          onPlayVideo={() => setVideoOpen(true)}
          onNavigate={handleModalNavigate}
          velvet={caseVelvet}
          isFavorite={favorites.includes(selectedItem.slug)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {videoOpen && selectedItem && <VideoModal item={selectedItem} onClose={() => setVideoOpen(false)} />}
    </>
  );
}
