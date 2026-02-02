/**
 * Parser for cards-article block variant
 * Extracts article cards with images, category badges, and titles
 */

/**
 * Parse a cards-article element and return table cells
 * @param {Element} element - The DOM element containing article cards
 * @param {Document} document - The DOM document
 * @returns {Array} - Array of table rows, each row is an array of cells [image, content]
 */
export default function parse(element, document) {
  const cells = [];

  // Row 1: Block name
  cells.push(['Cards-Article']);

  // Find all card items
  const cards = element.querySelectorAll('.card, .article-card, [class*="card"], li, .item');

  cards.forEach((card) => {
    // Column 1: Image
    const img = card.querySelector('img');
    let imageCell;
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Article image';
      imageCell = imgEl;
    } else {
      imageCell = '';
    }

    // Column 2: Content (category + title + link)
    const contentDiv = document.createElement('div');

    // Get category tag
    const category = card.querySelector('.category, .tag, [class*="category"], .badge');
    if (category) {
      const strong = document.createElement('strong');
      strong.textContent = category.textContent.trim();
      const categoryP = document.createElement('p');
      categoryP.appendChild(strong);
      contentDiv.appendChild(categoryP);
    }

    // Get title
    const title = card.querySelector('h2, h3, h4, .title, .heading, a');
    if (title) {
      const titleP = document.createElement('p');
      titleP.textContent = title.textContent.trim();
      contentDiv.appendChild(titleP);
    }

    // Get link
    const link = card.querySelector('a[href]');
    if (link) {
      const linkEl = document.createElement('a');
      linkEl.href = link.href;
      linkEl.textContent = "Lire l'article";
      const linkP = document.createElement('p');
      linkP.appendChild(linkEl);
      contentDiv.appendChild(linkP);
    }

    cells.push([imageCell, contentDiv]);
  });

  return cells;
}

/**
 * Check if this parser should handle the given element
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - True if this parser should handle the element
 */
export function matches(element) {
  // Match article card grids
  const hasMultipleCards = element.querySelectorAll('.card, .article-card, [class*="card"], li').length > 1;
  const hasImages = element.querySelectorAll('img').length > 0;
  const hasLinks = element.querySelectorAll('a[href]').length > 0;

  return hasMultipleCards && hasImages && hasLinks;
}
