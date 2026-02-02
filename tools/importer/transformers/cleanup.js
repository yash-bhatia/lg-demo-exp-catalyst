/**
 * DOM Cleanup Transformer
 * Removes unwanted elements and cleans up HTML before parsing
 */

/**
 * Remove site-wide navigation, footer, and tracking elements
 * @param {Document} document - The DOM document
 */
export function removeGlobalElements(document) {
  // Remove header and navigation
  const selectorsToRemove = [
    'header',
    'nav',
    'footer',
    '.navigation',
    '.header',
    '.footer',
    '.cookie-banner',
    '.skip_nav',
    '.broswe-check-popup-layer',
    '#onetrustCookie',
    '[class*="onetrust"]',
    'iframe',
    'noscript',
    '.sr-only'
  ];

  selectorsToRemove.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  });
}

/**
 * Remove tracking pixels and analytics elements
 * @param {Document} document - The DOM document
 */
export function removeTrackingElements(document) {
  // Remove tracking images (googlesyndication, etc.)
  document.querySelectorAll('img[src*="googlesyndication"]').forEach((el) => el.remove());
  document.querySelectorAll('img[src*="doubleclick"]').forEach((el) => el.remove());
  document.querySelectorAll('img[src*="analytics"]').forEach((el) => el.remove());

  // Remove empty images
  document.querySelectorAll('img:not([src]), img[src=""]').forEach((el) => el.remove());
}

/**
 * Fix relative URLs to absolute URLs
 * @param {Document} document - The DOM document
 * @param {string} baseUrl - The base URL for the site
 */
export function fixRelativeUrls(document, baseUrl = 'https://www.lg.com') {
  // Fix image sources
  document.querySelectorAll('img[src^="/"]').forEach((img) => {
    img.src = `${baseUrl}${img.getAttribute('src')}`;
  });

  // Fix link hrefs
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.href = `${baseUrl}${link.getAttribute('href')}`;
  });
}

/**
 * Main transformer function - runs all cleanup transformations
 * @param {Document} document - The DOM document
 * @param {Object} options - Transformer options
 */
export default function transform(document, options = {}) {
  const baseUrl = options.baseUrl || 'https://www.lg.com';

  removeGlobalElements(document);
  removeTrackingElements(document);
  fixRelativeUrls(document, baseUrl);

  return document;
}
