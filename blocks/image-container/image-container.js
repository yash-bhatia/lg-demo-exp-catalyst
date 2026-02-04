export default function decorate(block) {
  // Create hero grid layout by combining image-container with following hero-article sections
  const section = block.closest('.section');
  if (!section) return;

  // Check if this is on desktop and if there are hero-article sections following
  const nextSections = [];
  let nextSibling = section.nextElementSibling;

  while (nextSibling && nextSibling.classList.contains('hero-article-container')) {
    nextSections.push(nextSibling);
    nextSibling = nextSibling.nextElementSibling;
  }

  // If we have hero-article sections following, create a grid layout
  if (nextSections.length > 0) {
    // Create a grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'hero-featured-grid';

    // Move the image-container block into the grid
    const imageContainerWrapper = document.createElement('div');
    imageContainerWrapper.className = 'hero-featured-main';
    imageContainerWrapper.appendChild(block.cloneNode(true));
    gridContainer.appendChild(imageContainerWrapper);

    // Create a container for the hero articles
    const heroArticlesWrapper = document.createElement('div');
    heroArticlesWrapper.className = 'hero-featured-sidebar';

    // Move each hero-article into the sidebar
    nextSections.forEach((heroSection) => {
      const heroBlock = heroSection.querySelector('.hero-article');
      if (heroBlock) {
        const heroClone = heroBlock.cloneNode(true);
        heroArticlesWrapper.appendChild(heroClone);
      }
      // Remove the original section
      heroSection.remove();
    });

    gridContainer.appendChild(heroArticlesWrapper);

    // Replace the original block with the grid
    block.replaceWith(gridContainer);
  }
}
