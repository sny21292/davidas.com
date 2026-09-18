// Shared text helpers for the article editor (usable on client and server).

// Turn any text into a URL slug: lowercase, spaces/punctuation → single dashes.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Gentle live sanitize while typing a slug — keeps a trailing dash so the user
// can type the next word. Full cleanup happens on blur via slugify().
export function slugifyLive(s: string): string {
  return s.toLowerCase().replace(/['"’]/g, '').replace(/[^a-z0-9-]+/g, '-');
}

// Capitalize the first letter of each word (for titles typed in all lowercase).
export function titleCase(s: string): string {
  return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
