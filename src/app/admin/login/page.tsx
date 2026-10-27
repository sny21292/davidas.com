import { signIn } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;

  return (
    <div className="admin-auth">
      <form className="admin-login__card" action={signIn}>
        <div className="admin-login__brand">
          <span className="admin-auth__mark">D</span>
          <span className="admin-login__brandname">Davidas Design Concepts</span>
          <span className="admin-login__brandtag">Content Management</span>
        </div>

        <h2 className="admin-login__title">Sign in</h2>
        <p className="admin-login__subtitle">Enter your admin credentials to continue.</p>

        {error && <p className="admin-login__error">{error}</p>}
        {!configured && (
          <p className="admin-login__error">Admin is not configured in this environment.</p>
        )}

        <label className="admin-field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
        </label>

        <button type="submit" className="admin-btn admin-btn--primary admin-login__submit" disabled={!configured}>
          Sign in
        </button>
      </form>
    </div>
  );
}
