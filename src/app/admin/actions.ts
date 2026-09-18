'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getArticleFormMeta, isSortOrderTaken } from '@/lib/admin-articles';

// Writes go through the auth-bound server client, so Supabase RLS enforces that
// only an admin can insert/update/delete. After a change we revalidate the public
// pages that render article data so the live site updates within seconds.
function revalidateArticle(id: string) {
  revalidatePath('/gems-gemology');
  revalidatePath('/articles/[slug]', 'page');
  if (id) revalidatePath(`/articles/${id}`);
  revalidatePath('/sitemap.xml');
}

export async function saveArticle(formData: FormData) {
  const supabase = await createClient();

  const id = String(formData.get('id') ?? '').trim();
  const isNew = String(formData.get('isNew') ?? '') === '1';

  const title = String(formData.get('title') ?? '').trim();
  if (!id || !title) {
    redirect('/admin/articles/new?error=missing');
  }

  const back = isNew ? '/admin/articles/new' : `/admin/articles/${id}`;

  // Sort order: blank → next free number; otherwise must be unique.
  const rawOrder = String(formData.get('sort_order') ?? '').trim();
  let sortOrder: number;
  if (rawOrder === '' || !Number.isFinite(Number(rawOrder))) {
    sortOrder = (await getArticleFormMeta()).nextOrder;
  } else {
    sortOrder = Number(rawOrder);
  }
  if (await isSortOrderTaken(sortOrder, id)) {
    redirect(`${back}?error=${encodeURIComponent(`Sort order ${sortOrder} is already used — pick a different number (leave blank for the next one).`)}`);
  }

  // Gallery images arrive as a JSON array string from MultiImageField.
  let image2: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get('image2') ?? '[]'));
    if (Array.isArray(parsed)) image2 = parsed.filter((v) => typeof v === 'string' && v.trim());
  } catch { image2 = []; }

  const record = {
    id,
    title,
    tag: String(formData.get('tag') ?? '').trim(),
    author: String(formData.get('author') ?? '').trim(),
    date: String(formData.get('date') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? ''),
    image: String(formData.get('image') ?? '').trim(),
    image2,
    meta_title: String(formData.get('metaTitle') ?? '').trim(),
    meta_description: String(formData.get('metaDescription') ?? '').trim(),
    meta_keywords: String(formData.get('metaKeywords') ?? '').trim(),
    sort_order: sortOrder,
  };

  const { error } = isNew
    ? await supabase.from('articles').insert(record)
    : await supabase.from('articles').update(record).eq('id', id);

  if (error) {
    redirect(`${back}?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArticle(id);
  redirect('/admin/articles?saved=1');
}

export async function deleteArticle(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get('id') ?? '').trim();

  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) {
    redirect(`/admin/articles?error=${encodeURIComponent(error.message)}`);
  }

  revalidateArticle(id);
  redirect('/admin/articles?deleted=1');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// Server-side sign in — keeps the Supabase keys off the browser entirely.
export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect('/admin');
}

// Server-side image upload to Supabase Storage. Called from the editor's image
// fields; the file is sent to the server and uploaded with the admin's session
// (RLS enforces admin-only writes). Returns the public URL.
export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { error: 'No file selected.' };

  const supabase = await createClient();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `articles/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('article-images')
    .upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from('article-images').getPublicUrl(path);
  return { url: data.publicUrl };
}
