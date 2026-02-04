import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';

        // Add category-specific class based on the first paragraph content
        const firstP = div.querySelector('p:first-child');
        if (firstP) {
          const categoryText = firstP.textContent.toLowerCase().trim();

          if (categoryText.includes('inspiration')) {
            li.classList.add('category-inspiration');
          } else if (categoryText.includes('tech hub') || categoryText.includes('tech-hub')) {
            li.classList.add('category-tech-hub');
          } else if (categoryText.includes('conseils') || categoryText.includes('pratiques')) {
            li.classList.add('category-conseils');
          } else if (categoryText.includes('à venir') || categoryText.includes('a venir')) {
            li.classList.add('category-avenir');
          } else if (categoryText.includes('nos histoires') || categoryText.includes('histoires')) {
            li.classList.add('category-histoires');
          }
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Make all links point to current page
  ul.querySelectorAll('a').forEach((link) => {
    link.href = '#';
    link.addEventListener('click', (e) => e.preventDefault());
  });

  block.textContent = '';
  block.append(ul);
}
