import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Only the admin area runs through auth middleware. The public marketing site
// (statically generated, SEO-critical) is never touched.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
