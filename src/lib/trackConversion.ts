'use client';

// Google Ads "Submit lead form" conversion. Called from the success branch of
// every lead form (contact, product inquiry, showcase inquiry, gospel order),
// so it fires only after a genuinely successful submission — never on page load
// or on a failed submit. Safe no-op if the gtag script hasn't loaded.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONVERSION_SEND_TO = 'AW-18463656796/2_d5CLPao4EdENyWlORE';

export function trackLeadConversion(): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: CONVERSION_SEND_TO,
      value: 1.0,
      currency: 'USD',
    });
  }
}
