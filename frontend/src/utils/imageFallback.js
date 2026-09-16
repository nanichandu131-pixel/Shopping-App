// Locally-generated placeholder (inline SVG data URI) — has no network
// dependency, so it can never itself fail to load. This is the last-resort
// fallback, used only if a product has no category image to fall back to.
export const LOCAL_PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 fill=%22%23e4e4e7%22%3E%3Crect width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23a1a1aa%22%3ENo Image%3C/text%3E%3C/svg%3E';

/** The category's own representative image (set by the backend's category -> image mapping), if available. */
export const getCategoryFallbackImage = (item) => item?.category?.imageUrl || item?.product?.category?.imageUrl || null;

/**
 * Returns the ordered list of image URLs to try for a product/offer: its own
 * image first, then its category's image, then the guaranteed-safe local
 * placeholder. Used to build an onError fallback chain so a broken or missing
 * image never shows a broken-image icon or an empty card.
 */
export const buildImageFallbackChain = (primaryUrl, item) => {
  const chain = [];
  if (primaryUrl) chain.push(primaryUrl);
  const categoryImage = getCategoryFallbackImage(item);
  if (categoryImage && categoryImage !== primaryUrl) chain.push(categoryImage);
  chain.push(LOCAL_PLACEHOLDER_IMAGE);
  return chain;
};
