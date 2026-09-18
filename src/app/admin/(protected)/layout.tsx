import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '../actions';
import SidebarNav from '@/components/admin/SidebarNav';
import { IconLogout } from '@/components/admin/icons';

// Everything under this group requires a signed-in ADMIN. Middleware already
// redirects anonymous visitors to /admin/login; here we additionally check the
// user's role (a signed-in "viewer" is not allowed in).
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Supabase isn't configured in this environment (e.g. a Vercel preview with
  // no env vars), show a clear message instead of a server-side exception.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="admin-denied">
        <h1>Admin not configured</h1>
        <p>
          This environment is missing <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Add them to enable the admin.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="admin-denied">
        <h1>Not authorized</h1>
        <p>
          Your account (<strong>{user.email}</strong>) doesn’t have admin access.
          Ask an administrator to grant you the admin role.
        </p>
        <form action={signOut}>
          <button type="submit" className="admin-btn">Sign out</button>
        </form>
      </div>
    );
  }

  const name = (user.email ?? 'Admin').split('@')[0];

  const initial = (user.email ?? 'A').charAt(0).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__mark">D</span>
          <span className="admin-brand__text">
            <strong>DavidAS</strong>
            <em>Fine Jewelry</em>
          </span>
        </div>

        <div className="admin-profile">
          <span className="admin-profile__avatar">{initial}</span>
          <span className="admin-profile__name">{name}</span>
          <span className="admin-profile__email">{user.email}</span>
          <span className="admin-profile__role">Admin</span>
        </div>

        <div className="admin-sidebar__navwrap">
          <span className="admin-sidebar__navtitle">Workspace</span>
          <SidebarNav />
        </div>

        <div className="admin-sidebar__foot">
          <form action={signOut}>
            <button type="submit" className="admin-logout">
              <IconLogout /> Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
