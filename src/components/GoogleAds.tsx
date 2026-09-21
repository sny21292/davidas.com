import Script from 'next/script';

// Google Ads global site tag (gtag.js), installed site-wide via the root layout.
// Loaded with `afterInteractive` so it runs on every page and is detectable by
// Google's "Test installation" check.
const GOOGLE_ADS_ID = 'AW-18463656796';

export default function GoogleAds() {
  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
