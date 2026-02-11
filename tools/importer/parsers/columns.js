/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (product spotlight)
 *
 * Source: https://www.lg.com/fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Columns")
 * - Row 2+: Content rows with 2 columns (image | text or text | image)
 *
 * Source HTML Pattern:
 * <div class="imagesliderandtext">
 *   <div class="desktop-flex imagesliderandtext">
 *     <div class="component-item imagesliderandtext-image box-6 mobile-hidden">
 *       <div class="inner js-slider-component">
 *         <div class="slider-container ...">
 *           <div class="slider-absolute">
 *             <div class="slides-wrapper">
 *               <div class="slider js-slider">
 *                 <div class="item js-slide-item">
 *                   <div class="image-wrapper">
 *                     <img class="js-lazy-image lazy" data-src="...">
 *
 *     <div class="box-6 relative imagesliderandtext-text">
 *       <div class="inner imagesliderandtext-wrapper-text">
 *         <div class="editable-content">
 *           <h3><strong>Product Title</strong></h3>
 *           <p>Description text with <a href="...">buy link</a></p>
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  // Extract the product image (desktop version only)
  // VALIDATED: Source uses div.imagesliderandtext-image.mobile-hidden img[data-src] or img[src]
  const imageContainer = element.querySelector(
    '.imagesliderandtext-image.mobile-hidden img[data-src], .imagesliderandtext-image.mobile-hidden img[src]'
  );

  // Extract the text content
  // VALIDATED: Source uses div.imagesliderandtext-text div.editable-content
  const textContent = element.querySelector('.imagesliderandtext-text .editable-content');

  if (!imageContainer && !textContent) return;

  // Determine layout order: check if image comes first or text comes first
  // VALIDATED: Source DOM alternates between image-first and text-first layouts
  const flexContainer = element.querySelector('.desktop-flex');
  const firstChild = flexContainer ? flexContainer.firstElementChild : null;
  const isImageFirst = firstChild && firstChild.classList.contains('component-item');

  // Create image element for the block
  let imageEl = null;
  if (imageContainer) {
    const img = document.createElement('img');
    const src = imageContainer.getAttribute('data-src') || imageContainer.getAttribute('src');
    if (src) {
      // Resolve relative URLs
      const absoluteSrc = src.startsWith('/') ? `https://www.lg.com${src}` : src;
      img.setAttribute('src', absoluteSrc);
      const alt = imageContainer.getAttribute('alt') || '';
      img.setAttribute('alt', alt);
      imageEl = img;
    }
  }

  // Clone text content to preserve HTML structure (headings, links, etc.)
  let textEl = null;
  if (textContent) {
    textEl = document.createElement('div');
    textEl.innerHTML = textContent.innerHTML;

    // Fix relative URLs in text content links
    textEl.querySelectorAll('a[href^="/"]').forEach((link) => {
      link.href = `https://www.lg.com${link.getAttribute('href')}`;
    });
  }

  // Build cells array matching Columns block structure (2 columns per row)
  const cells = [];

  if (isImageFirst) {
    // Image left, text right
    cells.push([imageEl || '', textEl || '']);
  } else {
    // Text left, image right
    cells.push([textEl || '', imageEl || '']);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns',
    cells,
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
