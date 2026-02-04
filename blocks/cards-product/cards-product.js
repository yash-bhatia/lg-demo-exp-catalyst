import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Check if this is a tabbed block (has rows with tab names as first cell)
  const rows = [...block.children];
  const tabs = [];
  let currentTab = null;

  // Parse rows to identify tabs and their products
  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];
    const firstCellText = firstCell?.textContent?.trim();

    // Check if this row defines a tab (single cell with tab name in uppercase or with "Tab:" prefix)
    if (cells.length === 1 && (firstCellText.startsWith('Tab:') || /^[A-ZÉÈÊËÀÂÄÙÛÜÔÖÎÏÇ\s]+$/.test(firstCellText))) {
      const tabName = firstCellText.replace('Tab:', '').trim();
      currentTab = {
        name: tabName,
        products: [],
      };
      tabs.push(currentTab);
    } else if (currentTab && cells.length >= 2) {
      // This is a product row for the current tab
      currentTab.products.push(row);
    } else if (!currentTab && cells.length >= 2) {
      // No tabs defined, treat as regular cards
      if (!tabs.length) {
        currentTab = { name: null, products: [] };
        tabs.push(currentTab);
      }
      tabs[0].products.push(row);
    }
  });

  // Clear block
  block.textContent = '';

  // If we have multiple tabs, create tabbed interface
  if (tabs.length > 1 || (tabs.length === 1 && tabs[0].name)) {
    // Create tabs navigation
    const tabNav = document.createElement('div');
    tabNav.className = 'cards-product-tabs';

    tabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = `cards-product-tab ${index === 0 ? 'active' : ''}`;
      tabButton.textContent = tab.name;
      tabButton.dataset.tab = index;

      // Set background variant based on tab name
      if (tab.name.includes('DIVERTISSEMENT')) {
        tabButton.dataset.variant = 'purple';
      } else if (tab.name.includes('ELECTRO')) {
        tabButton.dataset.variant = 'grey';
      } else if (tab.name.includes('PC') || tab.name.includes('PRODUIT')) {
        tabButton.dataset.variant = 'blue';
      }

      tabButton.addEventListener('click', () => {
        // Update active tab
        tabNav.querySelectorAll('.cards-product-tab').forEach((t) => t.classList.remove('active'));
        tabButton.classList.add('active');

        // Show corresponding content
        block.querySelectorAll('.cards-product-content').forEach((content, i) => {
          content.classList.toggle('active', i === index);
        });
      });

      tabNav.appendChild(tabButton);
    });

    block.appendChild(tabNav);

    // Create content for each tab
    tabs.forEach((tab, index) => {
      const content = document.createElement('div');
      content.className = `cards-product-content ${index === 0 ? 'active' : ''}`;

      // Set variant class based on tab name
      if (tab.name.includes('DIVERTISSEMENT')) {
        content.dataset.variant = 'purple';
      } else if (tab.name.includes('ELECTRO')) {
        content.dataset.variant = 'grey';
      } else if (tab.name.includes('PC') || tab.name.includes('PRODUIT')) {
        content.dataset.variant = 'blue';
      }

      const ul = createProductList(tab.products);
      content.appendChild(ul);
      block.appendChild(content);
    });
  } else {
    // No tabs, just create product list
    const allProducts = tabs.flatMap((t) => t.products);
    const ul = createProductList(allProducts);
    block.appendChild(ul);
  }
}

function createProductList(productRows) {
  const ul = document.createElement('ul');

  productRows.forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) {
      const div = row.firstElementChild;
      li.appendChild(div);

      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-product-card-image';
      } else {
        div.className = 'cards-product-card-body';
      }
    }

    ul.appendChild(li);
  });

  // Optimize images - skip external URLs
  ul.querySelectorAll('picture > img').forEach((img) => {
    const isExternal = img.src.startsWith('http') && !img.src.includes(window.location.hostname);
    if (!isExternal) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimizedPic);
    }
  });

  return ul;
}
