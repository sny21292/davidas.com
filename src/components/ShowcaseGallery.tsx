'use client';

import React, { useState, useEffect } from 'react';
import type { ShowcaseItem } from '@/data/showcase';
import Img from '@/components/Img';

// Front (client's original photo) / Finished (premium cut-out on velvet) /
// Close-up (Amazon-style hover-zoom of the premium image). Shared by the
// showcase modal and the standalone /showcase/[slug] page.
type CreationTab = 'front' | 'finished' | 'closeup';

export default function ShowcaseGallery({ item, velvet }: { item: ShowcaseItem; velvet: string }) {
  const [activeTab, setActiveTab] = useState<CreationTab>('finished');
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const hasFront = !!item.frontImage;

  useEffect(() => {
    setActiveTab('finished');
  }, [item.slug]);

  const displayImage = activeTab === 'front' ? item.frontImage : item.image;
  const showVelvet = activeTab !== 'front';

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
