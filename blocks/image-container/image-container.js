export default function decorate(block) {
  // Image Container block - styling is handled by CSS
  // The hero-grid section layout is controlled via CSS Grid

  // Make all links point to current page
  block.querySelectorAll('a').forEach((link) => {
    link.href = '#';
    link.addEventListener('click', (e) => e.preventDefault());
  });
}
