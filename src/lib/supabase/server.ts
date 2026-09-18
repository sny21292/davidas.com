// Server-side Supabase client bound to the request's auth cookies. Used by admin
// server components, server actions and route handlers so RLS runs as the signed-in
// user. Public content fetching (SSG) still uses the plain client in ../supabase.ts.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only cookies). The session
            // refresh is handled by middleware, so this is safe to ignore.
          }
        },
      },
    },
  );
}
