'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconDashboard, IconArticles } from './icons';

const links = [
  { href: '/admin', label: 'Dashboard', Icon: IconDashboard, exact: true },
  { href: '/admin/articles', label: 'Articles', Icon: IconArticles },
];

export default function SidebarNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav className="admin-sidebar__nav">
      {links.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`admin-sidebar__link${active ? ' active' : ''}`}>
            <Icon /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
