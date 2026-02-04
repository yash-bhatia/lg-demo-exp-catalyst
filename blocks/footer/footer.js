import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Reorganizes the links section into proper 4-column layout
 * @param {Element} section The links section element
 */
function reorganizeLinksSection(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const children = [...wrapper.children];
  if (children.length === 0) return;

  // Check if this is the links section (has strong tags in paragraphs)
  const hasCategories = wrapper.querySelector('p strong');
  if (!hasCategories) return;

  // Create 4 column containers
  const columns = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
  ];
  columns.forEach((col) => col.classList.add('footer-column'));

  // Track which elements go into which column
  // Column mapping based on the structure:
  // Col 1: TV/Audio/Video (p:0, ul:0)
  // Col 2: Électroménager (p:1, ul:1)
  // Col 3: Climatisation & Chauffage + Informatique (p:2, ul:2, p:3, ul:3, ul:4)
  // Col 4: Service Clients + TOUT SUR LG (p:4, ul:4, p:5, ul:5)

  let pIndex = 0;
  let ulIndex = 0;

  children.forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('strong')) {
      const text = child.textContent.trim().toUpperCase();

      if (text.includes('TV/AUDIO') || text.includes('TV/VIDEO')) {
        columns[0].appendChild(child.cloneNode(true));
      } else if (text.includes('ÉLECTROMÉNAGER') || text.includes('ELECTROMENAGER')) {
        columns[1].appendChild(child.cloneNode(true));
      } else if (text.includes('CLIMATISATION') || text.includes('INFORMATIQUE')) {
        columns[2].appendChild(child.cloneNode(true));
      } else if (text.includes('SERVICE') || text.includes('TOUT SUR')) {
        columns[3].appendChild(child.cloneNode(true));
      }
      pIndex += 1;
    } else if (child.tagName === 'UL') {
      // Determine which column based on ulIndex
      if (ulIndex === 0) {
        columns[0].appendChild(child.cloneNode(true));
      } else if (ulIndex === 1) {
        columns[1].appendChild(child.cloneNode(true));
      } else if (ulIndex >= 2 && ulIndex <= 4) {
        columns[2].appendChild(child.cloneNode(true));
      } else {
        columns[3].appendChild(child.cloneNode(true));
      }
      ulIndex += 1;
    }
  });

  // Clear wrapper and add columns
  wrapper.innerHTML = '';
  columns.forEach((col) => {
    if (col.children.length > 0) {
      wrapper.appendChild(col);
    }
  });

  // Add class to wrapper for grid styling
  wrapper.classList.add('footer-links-grid');
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // Reorganize the links section (second section)
  const sections = block.querySelectorAll('.section');
  if (sections.length >= 2) {
    reorganizeLinksSection(sections[1]);
  }

  // Make all links point to current page
  block.querySelectorAll('a').forEach((link) => {
    link.href = '#';
    link.addEventListener('click', (e) => e.preventDefault());
  });
}
