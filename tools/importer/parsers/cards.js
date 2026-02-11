/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Handles multiple source DOM patterns:
 *
 * 1. Tech-hub product/article cards (div.lg-tile-container):
 *    Source: https://www.lg.com/fr/lg-experience/tech-hub/...
 *    Pattern: div.lg-tile-container > div.lg-tile-box.lg-article [image-container + tile-content-container]
 *
 * 2. CES event social media video carousel (div.GPC0074):
 *    Source: https://www.lg.com/global/mobility/media-center/event/ces2026
 *    Pattern: div.GPC0074 > div.inner > div.visual-box > ul > li.item.video [img-box + txt-box]
 *
 * 3. CES event explore icon links (div.GPC0005):
 *    Source: https://www.lg.com/global/mobility/media-center/event/ces2026
 *    Pattern: div.GPC0005 > div.non-carousel-box > div.list-box > ul.items > li.item [visual-area img + bottom-btn link]
 *
 * Block Structure:
 * - Row 1: Block name header ("Cards")
 * - Row 2+: One row per card, 2 columns: [image | text content]
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Pattern 1: Tech-hub product/article cards (lg-tile-container) ---
  if (element.querySelector('.lg-tile-box.lg-article')) {
    const cards = element.querySelectorAll('.lg-tile-box.lg-article');

    if (!cards || cards.length === 0) return;

    cards.forEach((card) => {
      // Extract card image
      // VALIDATED: .image-container img[data-src] or img[src]
      const imgEl = card.querySelector('.image-container img[data-src], .image-container img[src]');
      let imageCell = '';
      if (imgEl) {
        const img = document.createElement('img');
        const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
          img.setAttribute('alt', imgEl.getAttribute('alt') || '');
          imageCell = img;
        }
      }

      // Extract card text content
      const textCell = document.createElement('div');

      // Extract title
      // VALIDATED: h3.js-text-ellipsis > a
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

      // Extract description (product cards)
      // VALIDATED: p.intro-copy
      const descEl = card.querySelector('.tile-content-container p.intro-copy');
      if (descEl) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        textCell.appendChild(p);
      }

      // Extract category (article cards)
      // VALIDATED: p.category-tag
      const categoryEl = card.querySelector('.tile-content-container p.category-tag');
      if (categoryEl && !descEl) {
        const p = document.createElement('p');
        p.textContent = categoryEl.textContent.trim();
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    });
  }

  // --- Pattern 2: CES event social media video carousel (GPC0074) ---
  else if (element.classList.contains('GPC0074') || element.querySelector('.visual-box .item.video')) {
    // VALIDATED: div.visual-box > ul.slick-track > li.item.video
    // Each item: div[role=tabpanel] > a.see-video > div.img-box > img + div.txt-box
    const videoItems = element.querySelectorAll('.visual-box .item.video, .visual-box .item');

    if (!videoItems || videoItems.length === 0) return;

    videoItems.forEach((item) => {
      // Extract thumbnail image
      // VALIDATED: div.img-box > img.lazyload[data-src]
      const imgEl = item.querySelector('.img-box img[data-src], .img-box img[src]');
      let imageCell = '';
      if (imgEl) {
        const img = document.createElement('img');
        const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
          img.setAttribute('alt', imgEl.getAttribute('alt') || '');
          imageCell = img;
        }
      }

      // Extract title text
      // VALIDATED: div.txt-box.font-regular
      const textCell = document.createElement('div');
      const txtBox = item.querySelector('.txt-box');
      if (txtBox) {
        const p = document.createElement('p');
        p.textContent = txtBox.textContent.trim();
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    });
  }

  // --- Pattern 3: CES event explore icon links (GPC0005) ---
  else if (element.classList.contains('GPC0005') || element.querySelector('.list-box .items .item')) {
    // VALIDATED: div.non-carousel-box > div.list-box > ul.items > li.item
    // Each item: div.visual-area > a > img + div.bottom-btn > span > a.link-text
    const listItems = element.querySelectorAll('.list-box .items > .item');

    if (!listItems || listItems.length === 0) return;

    listItems.forEach((item) => {
      // Extract icon image
      // VALIDATED: div.visual-area > a > img[data-src]
      const imgEl = item.querySelector('.visual-area img[data-src], .visual-area img[src]');
      let imageCell = '';
      if (imgEl) {
        const img = document.createElement('img');
        const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
          img.setAttribute('alt', imgEl.getAttribute('alt') || '');
          imageCell = img;
        }
      }

      // Extract link text
      // VALIDATED: div.bottom-btn > span > a.link-text[href]
      const textCell = document.createElement('div');
      const linkEl = item.querySelector('.bottom-btn a.link-text, .bottom-btn a');
      if (linkEl) {
        const a = document.createElement('a');
        let href = linkEl.getAttribute('href') || '#';
        if (href.startsWith('/')) href = `https://www.lg.com${href}`;
        a.setAttribute('href', href);
        a.textContent = linkEl.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(a);
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    });
  }

  if (cells.length === 0) return;

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards',
    cells,
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
