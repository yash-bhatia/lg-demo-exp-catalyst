export default function decorate(block) {
  const rows = [...block.children];

  // First row should be the logo
  const logoRow = rows[0];
  if (logoRow) {
    logoRow.classList.add('gt-header-logo');
    const link = logoRow.querySelector('a');
    if (link) {
      link.classList.add('gt-header-logo-link');
      link.href = '#';
      link.addEventListener('click', (e) => e.preventDefault());
    }
  }

  // Second row should be navigation
  const navRow = rows[1];
  if (navRow) {
    const nav = document.createElement('nav');
    nav.classList.add('gt-header-nav');

    const ul = document.createElement('ul');
    const links = navRow.querySelectorAll('a');

    links.forEach((link) => {
      const li = document.createElement('li');
      li.classList.add('menu-item');
      const clonedLink = link.cloneNode(true);
      clonedLink.href = '#';
      clonedLink.addEventListener('click', (e) => e.preventDefault());
      li.appendChild(clonedLink);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    navRow.innerHTML = '';
    navRow.appendChild(nav);
    navRow.classList.add('gt-header-navigation');
  }
}
