/**
 * Parser for hero-article block variant
 * Extracts featured article content with background image and text overlay
 */

/**
 * Parse a hero-article element and return table cells
 * @param {Element} element - The DOM element to parse
 * @param {Document} document - The DOM document
 * @returns {Array} - Array of table rows, each row is an array of cells
 */
export default function parse(element, document) {
  const cells = [];

  // Row 1: Block name
  cells.push(['Hero-Article']);

  // Row 2: Background image
  const img = element.querySelector('img');
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || 'Featured article image';
    cells.push([imgEl]);
  } else {
    cells.push(['']);
  }

  // Row 3: Content (category + heading + CTA)
  const contentDiv = document.createElement('div');

  // Get category tag
  const category = element.querySelector('.category, .tag, [class*="category"]');
  if (category) {
    const categoryP = document.createElement('p');
    categoryP.textContent = category.textContent.trim();
    contentDiv.appendChild(categoryP);
  }

  // Get heading
  const heading = element.querySelector('h1, h2, h3, .title, .heading');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentDiv.appendChild(h2);
  }

  // Get CTA link
  const cta = element.querySelector('a[href]');
  if (cta) {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim() || 'En savoir plus';
    const ctaP = document.createElement('p');
    ctaP.appendChild(link);
    contentDiv.appendChild(ctaP);
  }

  cells.push([contentDiv]);

  return cells;
}

/**
 * Check if this parser should handle the given element
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - True if this parser should handle the element
 */
export function matches(element) {
  // Match featured article sections with large images
  const hasLargeImage = element.querySelector('img[width], img[style*="width"], picture');
  const hasHeading = element.querySelector('h1, h2, h3');
  const hasOverlay = element.querySelector('.overlay, .text-overlay, [class*="content"]');

  return !!(hasLargeImage && hasHeading);
}
