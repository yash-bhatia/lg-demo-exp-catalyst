/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for LG.com website cleanup
 * Purpose: Remove site-wide non-content elements and fix DOM issues
 * Applies to: www.lg.com (all templates)
 * Tested: /fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree
 * Generated: 2026-02-11
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (Playwright browser_evaluate)
 * - Page structure analysis from lg-article-container extraction
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation and header elements
    // EXTRACTED: Found in captured DOM: div.gnb-wrap, header elements
    WebImporter.DOMUtils.remove(element, [
      '.gnb-wrap',
      '.footer-wrap',
      '.breadcrumb',
      '.floating-menu',
      '.quickmenu',
      '.al-quick',
      '.skip_nav',
      '.broswe-check-popup-layer',
    ]);

    // Remove cookie consent / privacy overlays
    // EXTRACTED: Found in captured DOM: #onetrust-consent-sdk
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '.c-pop-msg',
    ]);

    // Remove article navigation (prev/next links) - not authorable content
    // EXTRACTED: Found in captured DOM: div.lg-article-nav > div.entry-navigation
    WebImporter.DOMUtils.remove(element, [
      '.lg-article-nav',
    ]);

    // Remove social share buttons from page header
    // EXTRACTED: Found in captured DOM: div.page-header contains social links, tags
    // Note: We keep the page-header for title extraction but remove social elements
    const socialShare = element.querySelector('.page-header .social-share, .page-header .share-button');
    if (socialShare) socialShare.remove();

    // Fix lazy-loaded images: convert data-src to src
    // EXTRACTED: Found in captured DOM: img.js-lazy-image.lazy[data-src="..."]
    const lazyImages = element.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc && !img.getAttribute('src')) {
        img.setAttribute('src', dataSrc);
      }
    });

    // Remove mobile-only duplicate image containers
    // EXTRACTED: Found in captured DOM: div.show-mobile contains duplicate images
    WebImporter.DOMUtils.remove(element, [
      '.show-mobile',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'source',
    ]);

    // Clean up tracking attributes
    // EXTRACTED: Found data-link-name, data-log attributes on many elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-link-name');
      el.removeAttribute('data-log');
      el.removeAttribute('data-sc-item');
      el.removeAttribute('onclick');
    });
  }
}
