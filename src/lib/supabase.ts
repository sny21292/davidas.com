import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-side Supabase client used at BUILD TIME to fetch content for static
// generation. This module is imported only by server code (never shipped to the
// browser), so the vars are plain server env vars (no NEXT_PUBLIC_ prefix). The
// anon key is read-only via RLS, but keeping it server-side is cleaner.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing SUPABASE_URL / SUPABASE_ANON_KEY. ' +
      'Set them in .env.local (local) or the deployment environment.',
  );
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
