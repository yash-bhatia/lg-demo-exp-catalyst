/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (featured products + related articles)
 *
 * Source: https://www.lg.com/fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards")
 * - Row 2+: One row per card, 2 columns: [image | text content]
 *
 * Source HTML Pattern (Product Cards):
 * <div class="lg-tile-container justify-center">
 *   <div class="lg-tile-box lg-article lg-product">
 *     <div class="tile-box-container">
 *       <a href="..." data-link-name="feature_product-...">
 *         <div class="image-container">
 *           <img class="js-lazy-image lazy" data-src="...">
 *       <div class="tile-content-container">
 *         <h3 class="js-text-ellipsis"><a href="...">Product Name</a></h3>
 *         <p class="intro-copy js-text-ellipsis">Description</p>
 *
 * Source HTML Pattern (Article Cards):
 * <div class="lg-tile-container justify-center">
 *   <div class="lg-tile-box lg-article">
 *     <div class="tile-box-container">
 *       <a href="..." data-link-name="related_article-...">
 *         <div class="image-container">
 *           <img class="js-lazy-image lazy" data-src="...">
 *       <div class="tile-content-container">
 *         <p class="category-tag"><a>Category</a></p>
 *         <h3 class="js-text-ellipsis"><a>Article Title</a></h3>
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  // Get all card tiles within this container
  // VALIDATED: Source uses div.lg-tile-box.lg-article for both product and article cards
  const cards = element.querySelectorAll('.lg-tile-box.lg-article');

  if (!cards || cards.length === 0) return;

  const cells = [];

  cards.forEach((card) => {
    // Extract card image
    // VALIDATED: Source uses .image-container img[data-src] or img[src]
    const imgEl = card.querySelector('.image-container img[data-src], .image-container img[src]');
    let imageCell = '';
    if (imgEl) {
      const img = document.createElement('img');
      const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
      if (src) {
        const absoluteSrc = src.startsWith('/') ? `https://www.lg.com${src}` : src;
        img.setAttribute('src', absoluteSrc);
        const alt = imgEl.getAttribute('alt') || '';
        img.setAttribute('alt', alt);
        imageCell = img;
      }
    }

    // Extract card text content
    const textCell = document.createElement('div');

    // Extract title
    // VALIDATED: Source uses h3.js-text-ellipsis > a for title
    const titleEl = card.querySelector('.tile-content-container h3');
    if (titleEl) {
      const titleLink = titleEl.querySelector('a');
      const h3 = document.createElement('h3');
      if (titleLink) {
        const a = document.createElement('a');
        let href = titleLink.getAttribute('href') || '#';
        if (href.startsWith('/')) href = `https://www.lg.com${href}`;
        a.setAttribute('href', href);
        a.textContent = titleLink.textContent.trim();
        const strong = document.createElement('strong');
        strong.appendChild(a);
        h3.appendChild(strong);
      } else {
        h3.textContent = titleEl.textContent.trim();
      }
      textCell.appendChild(h3);
    }

    // Extract description (product cards have intro-copy)
    // VALIDATED: Source uses p.intro-copy for product card descriptions
    const descEl = card.querySelector('.tile-content-container p.intro-copy');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    // For article cards, extract category tag
    // VALIDATED: Source uses p.category-tag for article card categories
    const categoryEl = card.querySelector('.tile-content-container p.category-tag');
    if (categoryEl && !descEl) {
      // Article cards show category + title (no separate description)
      const p = document.createElement('p');
      p.textContent = categoryEl.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards',
    cells,
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
