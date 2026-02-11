/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Handles multiple source DOM patterns:
 *
 * 1. Tech-hub product spotlight (div.imagesliderandtext):
 *    Source: https://www.lg.com/fr/lg-experience/tech-hub/...
 *    Pattern: div.imagesliderandtext > div.desktop-flex > [div.imagesliderandtext-image + div.imagesliderandtext-text]
 *
 * 2. CES event speaker/unit boxes (div.GPC0067):
 *    Source: https://www.lg.com/global/mobility/media-center/event/ces2026
 *    Pattern: div.GPC0067 > ul.unit-box-list > li.unit-box [image + title + body-copy]
 *
 * 3. CES event connect section (div.GPC0060):
 *    Source: https://www.lg.com/global/mobility/media-center/event/ces2026
 *    Pattern: div.GPC0060 > div.component-inner > div.square [a.common-area > image + heading]
 *
 * Block Structure:
 * - Row 1: Block name header ("Columns")
 * - Row 2+: Content rows with 2 columns
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Pattern 1: Tech-hub product spotlight (imagesliderandtext) ---
  if (element.classList.contains('imagesliderandtext') || element.querySelector('.imagesliderandtext-image')) {
    const imageContainer = element.querySelector(
      '.imagesliderandtext-image img[data-src], .imagesliderandtext-image img[src]'
    );
    const textContent = element.querySelector('.imagesliderandtext-text .editable-content');

    if (!imageContainer && !textContent) return;

    // Determine layout order
    const flexContainer = element.querySelector('.desktop-flex');
    const firstChild = flexContainer ? flexContainer.firstElementChild : null;
    const isImageFirst = firstChild && firstChild.classList.contains('component-item');

    let imageEl = null;
    if (imageContainer) {
      const img = document.createElement('img');
      const src = imageContainer.getAttribute('data-src') || imageContainer.getAttribute('src');
      if (src) {
        img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
        img.setAttribute('alt', imageContainer.getAttribute('alt') || '');
        imageEl = img;
      }
    }

    let textEl = null;
    if (textContent) {
      textEl = document.createElement('div');
      textEl.innerHTML = textContent.innerHTML;
      textEl.querySelectorAll('a[href^="/"]').forEach((link) => {
        link.href = `https://www.lg.com${link.getAttribute('href')}`;
      });
    }

    if (isImageFirst) {
      cells.push([imageEl || '', textEl || '']);
    } else {
      cells.push([textEl || '', imageEl || '']);
    }
  }

  // --- Pattern 2: CES event speaker/unit boxes (GPC0067) ---
  else if (element.classList.contains('GPC0067') || element.querySelector('.unit-box-list')) {
    // VALIDATED: ul.unit-box-list > li.unit-box contains image + title + body-copy
    const unitBoxes = element.querySelectorAll('.unit-box-list > .unit-box');

    if (!unitBoxes || unitBoxes.length === 0) return;

    // Build one row with all unit-boxes as columns
    const rowCells = [];
    unitBoxes.forEach((box) => {
      const cell = document.createElement('div');

      // Extract image
      // VALIDATED: div.visual-area.image > img.lazyload[data-src]
      const imgEl = box.querySelector('.visual-area img[data-src], .visual-area img[src]');
      if (imgEl) {
        const img = document.createElement('img');
        const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
          img.setAttribute('alt', imgEl.getAttribute('alt') || '');
          cell.appendChild(img);
        }
      }

      // Extract title
      // VALIDATED: div.title > p
      const titleEl = box.querySelector('.title p, .title');
      if (titleEl) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(strong);
        cell.appendChild(p);
      }

      // Extract body copy
      // VALIDATED: p.body-copy.font-regular
      const bodyEl = box.querySelector('p.body-copy');
      if (bodyEl) {
        const p = document.createElement('p');
        p.innerHTML = bodyEl.innerHTML;
        cell.appendChild(p);
      }

      // Extract CTA button if present
      // VALIDATED: div.bottom-btn contains optional link
      const ctaLink = box.querySelector('.bottom-btn a');
      if (ctaLink) {
        const a = document.createElement('a');
        let href = ctaLink.getAttribute('href') || '#';
        if (href.startsWith('/')) href = `https://www.lg.com${href}`;
        a.setAttribute('href', href);
        a.textContent = ctaLink.textContent.trim();
        cell.appendChild(a);
      }

      rowCells.push(cell);
    });

    // Create one row with all unit boxes as columns
    cells.push(rowCells);
  }

  // --- Pattern 3: CES event connect section (GPC0060) ---
  else if (element.classList.contains('GPC0060') || element.querySelector('.component-inner .square')) {
    // VALIDATED: div.component-inner > div.square.main + div.square.sub
    const squares = element.querySelectorAll('.component-inner > .square');

    if (!squares || squares.length === 0) return;

    // Build one row with all squares as columns
    const rowCells = [];
    squares.forEach((square) => {
      const cell = document.createElement('div');

      // Extract the link wrapping everything
      // VALIDATED: a.common-area[href]
      const link = square.querySelector('a.common-area');
      const href = link ? link.getAttribute('href') : null;

      // Extract image (use pc-md/tablet version)
      // VALIDATED: div.visual-area > img.pc-md[data-src] (tablet), img.lazyload[data-src]
      const imgEl = square.querySelector('.visual-area img.pc-md[data-src], .visual-area img[data-src], .visual-area img[src]');
      if (imgEl) {
        const img = document.createElement('img');
        const src = imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.startsWith('/') ? `https://www.lg.com${src}` : src);
          img.setAttribute('alt', imgEl.getAttribute('alt') || '');
          // Wrap image in link if available
          if (href) {
            const a = document.createElement('a');
            a.setAttribute('href', href);
            a.appendChild(img);
            cell.appendChild(a);
          } else {
            cell.appendChild(img);
          }
        }
      }

      // Extract heading
      // VALIDATED: div.copy-boxing-area > div.head > h2
      const headingEl = square.querySelector('.copy-boxing-area h2');
      if (headingEl) {
        const strong = document.createElement('strong');
        strong.textContent = headingEl.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(strong);
        cell.appendChild(p);
      }

      rowCells.push(cell);
    });

    cells.push(rowCells);
  }

  if (cells.length === 0) return;

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns',
    cells,
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
