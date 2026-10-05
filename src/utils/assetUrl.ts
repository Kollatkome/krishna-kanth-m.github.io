/**
 * Resolves an asset URL properly accounting for GitHub Pages / subpath hosting and Vite base paths.
 * 
 * E.g., if hosted at https://kollatkome.github.io/krishna-kanth-m.github.io/,
 * '/assets/weekly/...' or 'assets/weekly/...' will resolve to the correct repository path.
 */
export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // Return untouched if external, data URI, blob, or anchor
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('#') ||
    url.startsWith('mailto:')
  ) {
    return url;
  }

  // Strip leading slashes or relative dot prefixes
  let cleanPath = url;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(2);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }

  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  if (normalizedBase === './' || normalizedBase === '') {
    return `./${cleanPath}`;
  }

  return `${normalizedBase}${cleanPath}`;
}
