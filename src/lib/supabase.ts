import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-side Supabase client used at BUILD TIME to fetch content for static
// generation. Uses the public anon key; RLS allows read-only access, so this
// key is safe. No session persistence (build context, not a browser).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Set them in .env.local (local) or the deployment environment.',
  );
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
