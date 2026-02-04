export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Make all links point to current page
  block.querySelectorAll('a').forEach((link) => {
    link.href = '#';
    link.addEventListener('click', (e) => e.preventDefault());
  });
}
