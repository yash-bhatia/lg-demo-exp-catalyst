/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for LG.com website cleanup
 * Purpose: Remove site-wide non-content elements and fix DOM issues
 * Applies to: www.lg.com (all templates)
 * Tested: /fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree
 *         /global/mobility/media-center/event/ces2026
 *         /global/mobility/media-center/event/ces2025
 * Generated: 2026-02-11
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (Playwright browser_evaluate)
 * - Page structure analysis from lg-article-container extraction
 * - CES 2026/2025 Mobility event page DOM inspection
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation and header elements
    // EXTRACTED (FR): div.gnb-wrap, div.footer-wrap
    // EXTRACTED (Mobility CES): header.navigation.vs, footer.footer-main-contents.business
    WebImporter.DOMUtils.remove(element, [
      '.gnb-wrap',
      '.footer-wrap',
      'header.navigation',
      '.footer-main-contents',
      '.breadcrumb',
      '.skip_nav',
      '.broswe-check-popup-layer',
    ]);

    // Remove floating menus and anchor navigation
    // EXTRACTED (FR): div.floating-menu, div.quickmenu, div.al-quick
    // EXTRACTED (Mobility CES): div.floating-wrap, div.anchor-floating-menu, div.GPC0076.floating-menu
    WebImporter.DOMUtils.remove(element, [
      '.floating-menu',
      '.floating-wrap',
      '.anchor-floating-menu',
      '.quickmenu',
      '.al-quick',
    ]);

    // Remove cookie consent / privacy overlays
    // EXTRACTED (FR): #onetrust-consent-sdk, div.c-pop-msg
    // EXTRACTED (Mobility CES): div.eprivacy-load-js
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '.c-pop-msg',
      '.eprivacy-load-js',
    ]);

    // Remove modal/popup overlays
    // EXTRACTED (Mobility CES): div.modal-background, div.modal-contents
    WebImporter.DOMUtils.remove(element, [
      '.modal-background',
      '.modal-contents',
    ]);

    // Remove article navigation (prev/next links) - not authorable content
    // EXTRACTED (FR): div.lg-article-nav > div.entry-navigation
    WebImporter.DOMUtils.remove(element, [
      '.lg-article-nav',
    ]);

    // Remove social share buttons from page header
    // EXTRACTED (FR): div.page-header contains social links, tags
    const socialShare = element.querySelector('.page-header .social-share, .page-header .share-button');
    if (socialShare) socialShare.remove();

    // Fix lazy-loaded images: convert data-src to src
    // EXTRACTED (FR): img.js-lazy-image.lazy[data-src="..."]
    // EXTRACTED (Mobility CES): img.lazyload[data-src="..."]
    const lazyImages = element.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc && !img.getAttribute('src')) {
        img.setAttribute('src', dataSrc);
      }
    });

    // Remove mobile-only duplicate image containers
    // EXTRACTED (FR): div.show-mobile contains duplicate images
    // EXTRACTED (Mobility CES): img.mobile duplicates in GPC0060
    WebImporter.DOMUtils.remove(element, [
      '.show-mobile',
    ]);

    // Remove mobile-only and tablet-only duplicate images within components
    // EXTRACTED (Mobility CES): GPC0060 has img.pc-lg, img.pc-md, img.mobile variants
    // Keep only pc-md (tablet) as a good balance; remove pc-lg and mobile duplicates
    const mobileDupImgs = element.querySelectorAll('.GPC0060 img.mobile, .GPC0060 img.pc-lg');
    mobileDupImgs.forEach((img) => img.remove());

    // Remove page-count tracking divs
    // EXTRACTED (Mobility CES): div.page-count[data-param] inside every GPC component
    WebImporter.DOMUtils.remove(element, [
      '.page-count',
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
    // EXTRACTED (FR): data-link-name, data-log, data-sc-item, onclick
    // EXTRACTED (Mobility CES): data-link-area, data-link-name, data-param, data-view-type
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-link-name');
      el.removeAttribute('data-link-area');
      el.removeAttribute('data-log');
      el.removeAttribute('data-sc-item');
      el.removeAttribute('data-param');
      el.removeAttribute('data-view-type');
      el.removeAttribute('onclick');
    });
  }
}
