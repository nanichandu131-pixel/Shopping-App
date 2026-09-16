/** Guards "Visit Store"/"Buy Now" style links: only renders for a well-formed http(s) URL, never a dead/blank/malformed one. */
export const isValidHttpUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
