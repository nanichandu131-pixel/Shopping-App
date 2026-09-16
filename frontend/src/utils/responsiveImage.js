// Rewrites a stored Unsplash image URL to a different size, and builds a
// responsive srcSet from it, so each context (a 32px navbar thumbnail, a
// ~250px grid card, an 800px product-detail hero) requests an appropriately
// sized image instead of always downloading the same fixed 400x400 asset.
// Non-Unsplash URLs (the local SVG placeholder, generated store-logo data
// URIs) are returned untouched since resizing them makes no sense.
const UNSPLASH_HOST = 'images.unsplash.com';

const isUnsplashUrl = (url) => typeof url === 'string' && url.includes(UNSPLASH_HOST);

/**
 * Returns `url` resized to `width` (square `width`x`width` unless the source
 * had no `h` param, e.g. a wide banner — then only `w` is varied so the
 * original aspect ratio is preserved instead of being squashed to a square).
 */
export const resizeImageUrl = (url, width) => {
  if (!isUnsplashUrl(url)) return url;
  try {
    const parsed = new URL(url);
    const hadHeight = parsed.searchParams.has('h');
    parsed.searchParams.set('w', String(width));
    if (hadHeight) parsed.searchParams.set('h', String(width));
    if (!parsed.searchParams.has('fit')) parsed.searchParams.set('fit', 'max');
    if (!parsed.searchParams.has('auto')) parsed.searchParams.set('auto', 'format');
    return parsed.toString();
  } catch {
    return url;
  }
};

/** Builds a `srcSet` string across the given widths for responsive loading. Returns undefined for non-Unsplash URLs (nothing to vary). */
export const buildSrcSet = (url, widths) => {
  if (!isUnsplashUrl(url)) return undefined;
  return widths.map((w) => `${resizeImageUrl(url, w)} ${w}w`).join(', ');
};
