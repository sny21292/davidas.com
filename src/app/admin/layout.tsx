import type { Metadata } from 'next';
import '@/styles/admin.css';

// The whole /admin area is private — never index it or let it into search.
export const metadata: Metadata = {
  title: 'Admin — Davidas',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
