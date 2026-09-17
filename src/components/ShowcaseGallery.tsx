'use client';

import React, { useState, useEffect } from 'react';
import type { ShowcaseItem } from '@/data/showcase';
import Img from '@/components/Img';

// Gallery for a showcase piece. Shows every client photo the piece has
// (item.images) as its own thumbnail, plus the premium cut-out on velvet
// ("Finished Piece") and an Amazon-style hover-zoom of it ("Close-up").
// Shared by the showcase modal and the standalone /showcase/[slug] page.
type ViewKind = 'photo' | 'finished' | 'closeup';
type View = { key: string; kind: ViewKind; src: string; label: string };

export default function ShowcaseGallery({ item, velvet }: { item: ShowcaseItem; velvet: string }) {
  // Client photos: the images[] set minus the transparent cut-out (that is the
  // Finished/Close-up view). Fall back to frontImage for older data.
  const photos = (item.images ?? []).filter((u) => u && u !== item.image);
  const photoList = photos.length ? photos : item.frontImage ? [item.frontImage] : [];

  const views: View[] = [
    ...photoList.map((src, i) => ({
      key: `p${i}`,
      kind: 'photo' as ViewKind,
      src,
      label: i === 0 ? 'Front' : `Photo ${i + 1}`,
    })),
    { key: 'finished', kind: 'finished', src: item.image, label: 'Finished Piece' },
    { key: 'closeup', kind: 'closeup', src: item.image, label: 'Close-up' },
  ];

  const [activeKey, setActiveKey] = useState<string>('finished');
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  useEffect(() => {
    setActiveKey('finished');
  }, [item.slug]);

  const active = views.find((v) => v.key === activeKey) ?? views[0];
  const showVelvet = active.kind !== 'photo';

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (active.kind !== 'closeup') return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  };
  const handleZoomLeave = () => setZoom((z) => ({ ...z, on: false }));

  return (
    <div className="sc-gallery">
      <div className="sc-creation-tabs">
        <span className="sc-creation-tabs__brand">Photography</span>
        <span className="sc-creation-tabs__active">{active.label}</span>
      </div>

      <div className="sc-gallery__frame">
        <div
          className={`sc-gallery__main${active.kind === 'closeup' ? ' sc-gallery__main--zoomable' : ''}`}
          onMouseMove={handleZoomMove}
          onMouseLeave={handleZoomLeave}
        >
          {showVelvet && (
            <img src={velvet} alt="" aria-hidden="true" className="sc-gallery__velvet" />
          )}
          <Img
            src={active.src}
            alt={active.kind === 'photo' ? `${item.name} — photo` : item.name}
            className={`sc-gallery__img${active.kind === 'photo' ? ' sc-gallery__img--front' : ''}`}
            sizes="(max-width: 640px) 100vw, 500px"
            style={active.kind === 'closeup' ? {
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transform: zoom.on ? 'scale(2.8)' : 'scale(1)',
              transition: zoom.on ? 'transform 0.04s linear' : 'transform 0.3s ease',
            } : undefined}
          />
          <div className="sc-gallery__glass" />

          {active.kind === 'photo' && (
            <span className="sc-gallery__tab-label">Original Photo</span>
          )}
          {active.kind === 'closeup' && (
            <span className="sc-gallery__tab-label">{zoom.on ? 'Zoomed in' : 'Hover to zoom'}</span>
          )}
        </div>
      </div>

      <div className="sc-gallery__thumbs">
        {views.map((v) => (
          <button
            key={v.key}
            className={`sc-gallery__thumb${activeKey === v.key ? ' active' : ''}`}
            onClick={() => setActiveKey(v.key)}
          >
            <img src={v.src} alt={v.label} className="sc-gallery__thumb-img" />
            <span className="sc-gallery__thumb-label">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
