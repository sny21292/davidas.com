'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import type { ShowcaseItem } from '@/data/showcase';
import ShowcaseGallery from '@/components/ShowcaseGallery';

const DEFAULT_HINT = 'Metal, Karat & Color, and if you have stones or stone choice';
const VELVET_GREEN = '/images/showcase/green-velvet.png';

function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US');
}

// Standalone single-product page for a showcase piece (own /showcase/[slug]
// route, separate from the catalog). Premium look (gallery, dual pricing) with
// the same inquiry modal + /api/inquiry flow the catalog uses. Auto-opens the
// inquiry on ?inquiry=1.
export default function ShowcaseProductDetail({ item }: { item: ShowcaseItem }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const lockScroll = (lock: boolean) => {
    document.body.style.overflow = lock ? 'hidden' : '';
  };
  const openInquiry = () => { setInquiryOpen(true); lockScroll(true); };
  const closeInquiry = useCallback(() => { setInquiryOpen(false); lockScroll(false); }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('inquiry') === '1') {
      setInquiryOpen(true);
      lockScroll(true);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && inquiryOpen) closeInquiry(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inquiryOpen, closeInquiry]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiry', { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setTimeout(() => { setStatus('idle'); form.reset(); closeInquiry(); }, 2500);
      } else {
        alert(data.message);
        setStatus('idle');
      }
    } catch {
      alert('Something went wrong. Please call us at (336) 790-8214.');
      setStatus('idle');
    }
  }

  const btnLabel =
    status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Submit';

  const details = [
    { label: 'Metal', value: item.metals },
    { label: 'Karats', value: item.karats },
    { label: 'Style #', value: item.style },
    { label: 'Gemstone', value: item.gemstone },
    { label: 'Collection', value: item.collection },
  ].filter((d) => d.value);

  const paragraphs = item.description.split('\n').map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <div className="sc-detail">
        <div className="sc-detail__gallery">
          <ShowcaseGallery item={item} velvet={VELVET_GREEN} />
        </div>

        <div className="sc-detail__info">
          {item.category && <p className="sc-details__eyebrow">{item.category}</p>}
          <h1 className="sc-details__name">{item.name}</h1>
          {typeof item.price === 'number' && item.price > 0 && (
            <p className="sc-details__price">{formatPrice(item.price)}</p>
          )}

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
            {paragraphs.length > 0
              ? paragraphs.map((para, i) => <p key={i}>{para}</p>)
              : <p>{item.description}</p>}
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
            <button type="button" className="sc-btn-gold" onClick={openInquiry}>
              Inquire Now
            </button>
            <Link href="/showcase" className="sc-btn-outline">
              &larr; Back to Showcase
            </Link>
          </div>
        </div>
      </div>

      {inquiryOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeInquiry(); }}
        >
          <div className="modal">
            <button className="modal__close" aria-label="Close" onClick={closeInquiry}>&times;</button>
            <h2 className="modal__title">Pricing Inquiry</h2>
            <p className="modal__subtitle">{item.style ? `Style #${item.style}` : item.name}</p>
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <div className="inquiry-form__row">
                <div className="inquiry-form__field">
                  <label htmlFor="inq-fname">First Name *</label>
                  <input type="text" id="inq-fname" name="fname" required />
                </div>
                <div className="inquiry-form__field">
                  <label htmlFor="inq-lname">Last Name *</label>
                  <input type="text" id="inq-lname" name="lname" required />
                </div>
              </div>
              <div className="inquiry-form__field">
                <label htmlFor="inq-email">Email Address *</label>
                <input type="email" id="inq-email" name="email" required />
              </div>
              <div className="inquiry-form__field">
                <label htmlFor="inq-style">Style #</label>
                <input type="text" id="inq-style" name="style" value={item.style || item.name} readOnly />
              </div>
              <div className="inquiry-form__field">
                <label htmlFor="inq-message">Tell us any changes you want made:</label>
                <p className="inquiry-form__hint">{DEFAULT_HINT}</p>
                <textarea id="inq-message" name="message" rows={5}></textarea>
              </div>
              {/* Honeypot — must stay named "website"; bots that fill it get a fake success. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="inq-website">Website</label>
                <input type="text" id="inq-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="inquiry-form__actions">
                <button type="submit" className="btn btn--primary" disabled={status !== 'idle'}>
                  {btnLabel}
                </button>
                <button type="reset" className="btn btn--outline">Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
