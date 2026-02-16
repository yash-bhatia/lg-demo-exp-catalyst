import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// LG France Header - Hardcoded Navigation Data
const isDesktop = window.matchMedia('(min-width: 900px)');

// Navigation data structure
const NAV_DATA = {
  brand: {
    logo: '/icons/lg-logo.svg',
    alt: 'LG',
    href: '/',
  },
  sections: [
    {
      label: 'Boutique',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'Offres',
            items: [
              { label: 'Toutes les offres', href: '#' },
              { label: 'Offres de remboursement', href: '#' },
            ],
          },
          {
            title: 'Offres Packs',
            items: [
              { label: 'Composez votre Pack', href: '#', isNew: true },
              { label: 'Packs exclusifs', href: '#' },
            ],
          },
          {
            title: 'La Revue LG',
            items: [
              { label: 'Monthly LG', href: '#' },
            ],
          },
          {
            title: 'Nouveau & En vedette',
            items: [
              { label: 'Nouveautés', href: '#' },
              { label: 'Top', href: '#' },
            ],
          },
          {
            title: 'Pourquoi acheter chez LG',
            items: [
              { label: 'Avantages des membres LG', href: '#' },
              { label: 'Comment profiter des Coupons ?', href: '#' },
            ],
          },
        ],
        promos: [
          {
            title: 'Découvrez nos produits récompensés',
            image: '/blocks/header/images/promo-awards.svg',
          },
          {
            title: 'PC Portables',
            description: "Jusqu'à 800€ de remise",
            image: '/blocks/header/images/promo-laptop.svg',
          },
          {
            title: "Profitez d'une remise de 10% avec La Revue LG",
            image: '/blocks/header/images/promo-flowers.svg',
          },
        ],
      },
    },
    {
      label: 'TV/Audio/Video',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'Offres',
            items: [
              { label: 'Toutes les offres', href: '#' },
              { label: 'Offres de remboursement', href: '#' },
              { label: 'Offre TV Grandes Tailles', href: '#', isNew: true },
            ],
          },
          {
            title: 'Offres Packs',
            items: [
              { label: 'Offre Barre de son', href: '#', isNew: true },
              { label: 'Composez votre Pack', href: '#', isNew: true },
              { label: 'Packs exclusifs', href: '#' },
            ],
          },
          {
            title: 'Smart TV webOS',
            items: [],
          },
          {
            title: 'Téléviseurs Lifestyle',
            items: [
              { label: 'Objet Collection - Posé', href: '#' },
              { label: 'OLED Flex', href: '#' },
              { label: 'StanbyME', href: '#' },
            ],
          },
          {
            title: 'Découverte',
            items: [
              { label: 'LG SIGNATURE', href: '#' },
              { label: 'LG Experience', href: '#' },
              { label: "Life's Good", href: '#' },
              { label: 'LG x BoConcept', href: '#' },
            ],
          },
          {
            title: 'TV & Barres de son',
            items: [
              { label: 'Tous les produits', href: '#' },
              { label: 'OLED evo', href: '#', isNew: true },
              { label: 'OLED', href: '#' },
              { label: 'QNED', href: '#' },
              { label: 'NanoCell', href: '#' },
              { label: 'Grandes Tailles', href: '#' },
              { label: '4K UHD', href: '#' },
              { label: 'Smart TVs', href: '#' },
              { label: 'Accessoires TV', href: '#' },
              { label: 'Barres de Son', href: '#' },
            ],
          },
          {
            title: 'TV en pouces',
            items: [
              { label: '86 pouces et plus', href: '#' },
              { label: '77 à 85 pouces', href: '#' },
              { label: '70 à 75 pouces', href: '#' },
              { label: '65 pouces', href: '#' },
              { label: '55 pouces', href: '#' },
              { label: '50 pouces', href: '#' },
              { label: '42 à 48 pouces', href: '#' },
              { label: '32 pouces et moins', href: '#' },
            ],
          },
          {
            title: 'Vidéoprojecteurs',
            items: [
              { label: 'Vidéoprojecteurs Home Cinema', href: '#' },
              { label: 'Vidéoprojecteurs Portables & Lifestyle', href: '#' },
            ],
          },
          {
            title: 'Enceintes XBOOM',
            items: [
              { label: 'Tous les produits', href: '#' },
              { label: 'Enceintes High Power', href: '#' },
              { label: 'Enceintes Portables', href: '#' },
              { label: 'Enceintes Gaming', href: '#' },
              { label: 'Chaînes Hi-Fi', href: '#' },
            ],
          },
          {
            title: 'Écouteurs Bluetooth',
            items: [
              { label: 'Tous les produits', href: '#' },
              { label: 'Écouteurs UVnano', href: '#' },
              { label: 'Écouteurs ANC', href: '#' },
            ],
          },
          {
            title: 'Vidéo',
            items: [],
          },
        ],
        promos: [
          {
            title: 'Offre TV Grandes Tailles',
            description: 'Un téléviseur LG UHD AI offert*',
            badge: '+Offert',
            image: '/blocks/header/images/promo-tv-large.svg',
          },
          {
            title: 'Offre TV',
            description: "Jusqu'à 1000€ remboursés*",
            image: '/blocks/header/images/promo-tv-offer.svg',
          },
          {
            title: 'Offre Barre de son',
            description: '-50% de remise sur votre barre de son',
            image: '/blocks/header/images/promo-soundbar.svg',
          },
        ],
      },
    },
    {
      label: 'Électroménager',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'Jeu Concours',
            isNew: true,
            items: [],
          },
          {
            title: 'Offres',
            items: [
              { label: 'Toutes les offres', href: '#' },
              { label: 'Offres de remboursement', href: '#' },
              { label: 'Packs Électroménager', href: '#', isNew: true },
            ],
          },
          {
            title: 'Réfrigérateur',
            items: [
              { label: 'Tous les produits', href: '#' },
              { label: 'Américain', href: '#' },
              { label: 'Multi-portes', href: '#' },
              { label: 'Combiné', href: '#' },
              { label: 'Deux portes', href: '#' },
              { label: 'Une porte', href: '#' },
            ],
          },
          {
            title: 'Lavage',
            items: [
              { label: 'Tous les produits', href: '#' },
              { label: 'Lave-linge', href: '#' },
              { label: 'Lave-linge séchant', href: '#' },
              { label: 'Sèche-linge', href: '#' },
              { label: 'WashTower', href: '#' },
              { label: 'Styler', href: '#' },
            ],
          },
          {
            title: 'Lave-vaisselle',
            items: [],
          },
          {
            title: 'Aspirateurs',
            items: [],
          },
          {
            title: 'Cave à Vin',
            items: [],
          },
          {
            title: 'Encastrable',
            items: [
              { label: 'Four', href: '#' },
              { label: 'Plaque de cuisson', href: '#' },
              { label: 'Hotte', href: '#' },
              { label: 'Lave vaisselle', href: '#' },
              { label: 'Micro-ondes', href: '#' },
            ],
          },
          {
            title: 'Micro-ondes',
            items: [
              { label: 'Combiné', href: '#' },
              { label: 'Grill', href: '#' },
              { label: 'Solo', href: '#' },
            ],
          },
          {
            title: 'Découverte',
            items: [
              { label: 'LG SIGNATURE', href: '#' },
              { label: 'LG Experience', href: '#' },
              { label: "Life's Good", href: '#' },
            ],
          },
        ],
        promos: [
          {
            title: 'Jeu concours',
            description: "Tentez de remporter l'un de nos lots exclusifs !",
            image: '/blocks/header/images/promo-concours.svg',
          },
          {
            title: 'Votre Pack sur mesure',
            description: "Jusqu'à 25% de remise en combinant vos achats !",
            badge: '-25%',
            image: '/blocks/header/images/promo-pack.svg',
          },
          {
            title: 'Offre Lavage',
            description: "Jusqu'à 250€ remboursés*",
            image: '/blocks/header/images/promo-lavage.svg',
          },
        ],
      },
    },
    {
      label: 'Climatisation & Chauffage',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'Climatiseurs',
            items: [],
          },
          {
            title: 'Chauffage',
            items: [],
          },
          {
            title: 'Découverte',
            items: [
              { label: 'LG SIGNATURE', href: '#' },
              { label: 'LG Experience', href: '#' },
              { label: "Life's Good", href: '#' },
            ],
          },
          {
            title: 'Nos conseils',
            items: [],
          },
        ],
        promos: [
          {
            title: 'Climatiseurs',
            image: '/blocks/header/images/promo-climatiseurs.svg',
          },
          {
            title: 'Chauffage',
            image: '/blocks/header/images/promo-chauffage.svg',
          },
        ],
      },
    },
    {
      label: 'Informatique',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'PC Portables',
            items: [
              { label: 'LG gram', href: '#' },
              { label: 'Gaming', href: '#' },
            ],
          },
          {
            title: 'Moniteurs',
            items: [
              { label: 'UltraWide', href: '#' },
              { label: 'UltraGear', href: '#' },
              { label: '4K', href: '#' },
            ],
          },
        ],
      },
    },
    {
      label: 'Service Clients',
      href: '#',
      megaMenu: {
        columns: [
          {
            title: 'Support',
            items: [
              { label: 'Contact', href: '#' },
              { label: 'FAQ', href: '#' },
              { label: 'Manuels', href: '#' },
            ],
          },
          {
            title: 'Services',
            items: [
              { label: 'Garantie', href: '#' },
              { label: 'Réparation', href: '#' },
            ],
          },
        ],
      },
    },
  ],
  tools: [
    { label: 'Professionnels', href: '#', type: 'button' },
    { icon: 'search', href: '#', ariaLabel: 'Rechercher' },
    { icon: 'user', href: '#', ariaLabel: 'Mon compte' },
    { icon: 'cart', href: '#', ariaLabel: 'Panier' },
  ],
};

// SVG Icons inline
const ICONS = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16.9,15.5c2.4-3.2,2.2-7.7-0.7-10.6c-3.1-3.1-8.1-3.1-11.3,0c-3.1,3.2-3.1,8.3,0,11.4c2.9,2.9,7.5,3.1,10.6,0.6c0,0.1,0,0.1,0,0.1l4.2,4.2c0.5,0.4,1.1,0.4,1.5,0c0.4-0.4,0.4-1,0-1.4L16.9,15.5C16.9,15.5,16.9,15.5,16.9,15.5L16.9,15.5z M14.8,6.3c2.3,2.3,2.3,6.1,0,8.5c-2.3,2.3-6.1,2.3-8.5,0C4,12.5,4,8.7,6.3,6.3C8.7,4,12.5,4,14.8,6.3z"/>
  </svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>`,
  cart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>`,
};

// LG Logo SVG - Official LG Logo (Face + Text)
const LG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 42" width="72" height="30">
  <circle cx="21" cy="21" r="18" fill="none" stroke="#A50034" stroke-width="2.8"/>
  <path d="M21 10 L21 24 L30 24" fill="none" stroke="#A50034" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="27" cy="16" r="2.5" fill="#A50034"/>
  <text x="44" y="29" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#A50034">LG</text>
</svg>`;

function closeAllMegaMenus() {
  document.querySelectorAll('.nav-item[aria-expanded="true"]').forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
  });
}

function toggleMobileMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

function createMegaMenu(megaMenuData) {
  const megaMenu = document.createElement('div');
  megaMenu.className = 'mega-menu';

  const content = document.createElement('div');
  content.className = 'mega-menu-content';

  // Columns
  const columnsWrapper = document.createElement('div');
  columnsWrapper.className = 'mega-menu-columns';

  megaMenuData.columns.forEach((column) => {
    const col = document.createElement('div');
    col.className = 'mega-menu-column';

    const header = document.createElement('div');
    header.className = 'mega-menu-column-header';
    header.textContent = column.title;

    if (column.isNew) {
      const badge = document.createElement('span');
      badge.className = 'new-badge';
      badge.textContent = 'NEW';
      header.appendChild(badge);
    }

    col.appendChild(header);

    const list = document.createElement('ul');
    list.className = 'mega-menu-column-items';

    column.items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      link.addEventListener('click', (e) => e.preventDefault());
      li.appendChild(link);

      if (item.isNew) {
        const badge = document.createElement('span');
        badge.className = 'new-badge';
        badge.textContent = 'NEW';
        li.appendChild(badge);
      }

      list.appendChild(li);
    });

    col.appendChild(list);
    columnsWrapper.appendChild(col);
  });

  content.appendChild(columnsWrapper);

  // Promo cards
  if (megaMenuData.promos && megaMenuData.promos.length > 0) {
    const promosWrapper = document.createElement('div');
    promosWrapper.className = 'mega-menu-promos';

    megaMenuData.promos.forEach((promo) => {
      const card = document.createElement('div');
      card.className = 'promo-card';

      const imageDiv = document.createElement('div');
      imageDiv.className = 'promo-card-image';

      const img = document.createElement('img');
      img.src = promo.image;
      img.alt = promo.title;
      img.loading = 'lazy';
      imageDiv.appendChild(img);

      card.appendChild(imageDiv);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'promo-card-content';

      if (promo.badge) {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'promo-card-badge';
        badgeEl.textContent = promo.badge;
        contentDiv.appendChild(badgeEl);
      }

      const title = document.createElement('div');
      title.className = 'promo-card-title';
      title.textContent = promo.title;
      contentDiv.appendChild(title);

      if (promo.description) {
        const desc = document.createElement('div');
        desc.className = 'promo-card-desc';
        desc.textContent = promo.description;
        contentDiv.appendChild(desc);
      }

      card.appendChild(contentDiv);

      // Play button
      const playBtn = document.createElement('div');
      playBtn.className = 'promo-play-btn';
      playBtn.innerHTML = ICONS.play;
      card.appendChild(playBtn);

      promosWrapper.appendChild(card);
    });

    content.appendChild(promosWrapper);
  }

  megaMenu.appendChild(content);
  return megaMenu;
}

function createHeader(logoElement = null) {
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Hamburger menu (mobile)
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;
  nav.appendChild(hamburger);

  // Brand/Logo - use logo from document if available, otherwise use fallback
  const brand = document.createElement('div');
  brand.className = 'nav-brand';

  if (logoElement) {
    // Use logo from the document
    const logoLink = document.createElement('a');
    logoLink.href = NAV_DATA.brand.href;
    logoLink.setAttribute('aria-label', 'LG Home');

    // Clone the logo content (picture/img)
    const picture = logoElement.querySelector('picture');
    const img = logoElement.querySelector('img');

    if (picture) {
      logoLink.appendChild(picture.cloneNode(true));
    } else if (img) {
      logoLink.appendChild(img.cloneNode(true));
    } else {
      // Fallback to text content or inline SVG
      logoLink.innerHTML = LG_LOGO;
    }

    brand.appendChild(logoLink);
  } else {
    // Fallback to hardcoded SVG logo
    brand.innerHTML = `<a href="${NAV_DATA.brand.href}" aria-label="LG Home">${LG_LOGO}</a>`;
  }

  brand.querySelector('a').addEventListener('click', (e) => e.preventDefault());
  nav.appendChild(brand);

  // Navigation sections
  const sections = document.createElement('div');
  sections.className = 'nav-sections';

  const navList = document.createElement('ul');
  navList.className = 'nav-list';

  NAV_DATA.sections.forEach((section) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    if (section.megaMenu) {
      li.classList.add('has-mega-menu');
    }
    li.setAttribute('aria-expanded', 'false');

    const link = document.createElement('a');
    link.href = section.href;
    link.className = 'nav-link';
    link.textContent = section.label;
    link.addEventListener('click', (e) => e.preventDefault());
    li.appendChild(link);

    if (section.megaMenu) {
      const megaMenu = createMegaMenu(section.megaMenu);
      li.appendChild(megaMenu);

      // Desktop: hover behavior
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          closeAllMegaMenus();
          li.setAttribute('aria-expanded', 'true');
        }
      });

      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          li.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile: click behavior
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const expanded = li.getAttribute('aria-expanded') === 'true';
          closeAllMegaMenus();
          li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    }

    navList.appendChild(li);
  });

  sections.appendChild(navList);
  nav.appendChild(sections);

  // Tools (Professionnels button + icons)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  const toolsList = document.createElement('ul');
  toolsList.className = 'tools-list';

  NAV_DATA.tools.forEach((tool) => {
    const li = document.createElement('li');

    if (tool.type === 'button') {
      li.className = 'tool-button';
      const link = document.createElement('a');
      link.href = tool.href;
      link.textContent = tool.label;
      link.addEventListener('click', (e) => e.preventDefault());
      li.appendChild(link);
    } else if (tool.icon) {
      li.className = 'tool-icon';
      const link = document.createElement('a');
      link.href = tool.href;
      link.setAttribute('aria-label', tool.ariaLabel);
      link.innerHTML = ICONS[tool.icon];
      link.addEventListener('click', (e) => e.preventDefault());
      li.appendChild(link);
    }

    toolsList.appendChild(li);
  });

  tools.appendChild(toolsList);
  nav.appendChild(tools);

  // Hamburger click handler
  hamburger.addEventListener('click', () => toggleMobileMenu(nav));

  // Initial state
  toggleMobileMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMobileMenu(nav, isDesktop.matches));

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMegaMenus();
      if (!isDesktop.matches) {
        toggleMobileMenu(nav, false);
      }
    }
  });

  // Close mega menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeAllMegaMenus();
    }
  });

  return nav;
}

export default async function decorate(block) {
  // Load nav fragment to get the logo from the document
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  let logoElement = null;

  try {
    const fragment = await loadFragment(navPath);
    if (fragment) {
      // The first section should be the brand/logo
      const brandSection = fragment.querySelector('.section');
      if (brandSection) {
        logoElement = brandSection;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Could not load nav fragment for logo, using fallback');
  }

  block.textContent = '';

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  const nav = createHeader(logoElement);
  navWrapper.appendChild(nav);

  block.appendChild(navWrapper);
}
