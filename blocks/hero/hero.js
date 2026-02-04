export default function decorate(block) {
  // Make all links point to current page
  block.querySelectorAll('a').forEach((link) => {
    link.href = '#';
    link.addEventListener('click', (e) => e.preventDefault());
  });
}
