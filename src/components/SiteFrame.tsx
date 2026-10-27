'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import MetaPixel from './MetaPixel';

// Wraps the marketing chrome (nav, footer, pixel, scroll reveal) so it renders on
// the public site but NOT in the private /admin area, which has its own dashboard
// shell. Server-rendered page content is passed through as children untouched.
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <MetaPixel />
      <Nav />
      {children}
      <Footer />
      <ScrollReveal />
    </>
  );
}
