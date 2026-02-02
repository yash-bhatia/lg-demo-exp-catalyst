/**
 * Parser for cards-product block variant
 * Extracts product category cards with images and labels
 */

/**
 * Parse a cards-product element and return table cells
 * @param {Element} element - The DOM element containing product cards
 * @param {Document} document - The DOM document
 * @returns {Array} - Array of table rows, each row is an array of cells [image, title]
 */
export default function parse(element, document) {
  const cells = [];

  // Row 1: Block name
  cells.push(['Cards-Product']);

  // Find all product items
  const products = element.querySelectorAll('.product, .category-item, [class*="essential"], li, .item');

  products.forEach((product) => {
    // Column 1: Product image
    const img = product.querySelector('img');
    let imageCell;
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Product image';
      imageCell = imgEl;
    } else {
      imageCell = '';
    }

    // Column 2: Product title
    const title = product.querySelector('h3, h4, .title, .label, span, p');
    const titleDiv = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      titleDiv.appendChild(strong);
    }

    cells.push([imageCell, titleDiv]);
  });

  return cells;
}

/**
 * Check if this parser should handle the given element
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - True if this parser should handle the element
 */
export function matches(element) {
  // Match product category grids
  const hasMultipleItems = element.querySelectorAll('.product, .category-item, [class*="essential"], li').length > 1;
  const hasProductImages = element.querySelectorAll('img').length > 0;
  const isProductSection = element.className.includes('essential') ||
                           element.className.includes('product') ||
                           element.id.includes('essential');

  return hasMultipleItems && hasProductImages;
}
