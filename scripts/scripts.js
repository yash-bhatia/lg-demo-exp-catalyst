import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Transforms the Event info section into accordion-style cards
 */
function createEventInfoAccordion() {
  setTimeout(() => {
    const eventInfoHeading = document.querySelector('#event-info');
    if (!eventInfoHeading) return;

    const wrapper = eventInfoHeading.closest('.default-content-wrapper');
    if (!wrapper) return;

    // Collect event data first
    const eventData = [];
    const elementsToRemove = [];
    let currentEvent = null;

    // Get all children of the wrapper after h2
    const children = Array.from(wrapper.children);
    const h2Index = children.indexOf(eventInfoHeading);

    for (let i = h2Index + 1; i < children.length; i++) {
      const el = children[i];

      // Check if it's a date paragraph (contains JANUARY)
      if (el.tagName === 'P' && el.textContent.toUpperCase().includes('JANUARY')) {
        if (currentEvent) {
          eventData.push(currentEvent);
        }
        currentEvent = {
          date: el.textContent.trim(),
          items: [],
        };
        elementsToRemove.push(el);
      } else if (el.tagName === 'UL' && currentEvent) {
        // Parse all list items
        const listItems = el.querySelectorAll('li');
        listItems.forEach((li) => {
          // Get the event type from <strong> tag
          const strongEl = li.querySelector('strong');
          const eventType = strongEl ? strongEl.textContent.trim() : '';

          // Use innerHTML to preserve the actual characters and split by em-dash patterns
          let html = li.innerHTML;

          // Remove the <strong> tag content
          html = html.replace(/<strong>[^<]*<\/strong>/, '').trim();

          // Try multiple em-dash patterns: HTML entity, actual character, or spaced dashes
          // Split by " — " or "—" or " - " (with spaces around regular dash)
          let parts = html.split(/\s*(?:—|&mdash;|\u2014)\s*/).filter((p) => p.trim());

          let timeLocation = '';
          let description = '';

          if (parts.length >= 2) {
            timeLocation = parts[0].replace(/<[^>]*>/g, '').trim();
            description = parts.slice(1).join(' ').replace(/<[^>]*>/g, '').trim();
          } else if (parts.length === 1) {
            // Fallback: try splitting by location keywords
            const text = parts[0].replace(/<[^>]*>/g, '').trim();
            
            // Look for "Bay" or "hall" as location end markers
            const bayMatch = text.match(/^(.+?Bay)\s+(.+)$/i);
            const hallMatch = text.match(/^(.+?hall)\s+(.+)$/i);
            
            if (bayMatch) {
              timeLocation = bayMatch[1].trim();
              description = bayMatch[2].trim();
            } else if (hallMatch) {
              timeLocation = hallMatch[1].trim();
              description = hallMatch[2].trim();
            } else {
              description = text;
            }
          }

          currentEvent.items.push({
            type: eventType,
            timeLocation,
            description,
          });
        });
        elementsToRemove.push(el);
      }
    }

    // Add the last event
    if (currentEvent) {
      eventData.push(currentEvent);
    }

    // If no event data found, exit
    if (eventData.length === 0) {
      console.log('No event data found for accordion');
      return;
    }

    console.log('Event data:', eventData);

    // Create accordion container
    const accordionContainer = document.createElement('div');
    accordionContainer.className = 'event-info-accordion';

    eventData.forEach((event) => {
      const card = document.createElement('div');
      card.className = 'event-accordion-card';

      // Create header
      const header = document.createElement('div');
      header.className = 'event-accordion-header';
      header.innerHTML = `
        <span class="event-date">${event.date}</span>
        <span class="event-accordion-icon">&#94;</span>
      `;

      // Create content container
      const content = document.createElement('div');
      content.className = 'event-accordion-content';

      // Add all items
      event.items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'event-item';
        itemDiv.innerHTML = `
          <div class="event-type">${item.type}</div>
          <div class="event-time-location">${item.timeLocation}</div>
          <div class="event-description">${item.description}</div>
        `;
        content.appendChild(itemDiv);
      });

      card.appendChild(header);
      card.appendChild(content);
      accordionContainer.appendChild(card);

      // Add click handler for accordion
      header.addEventListener('click', () => {
        card.classList.toggle('collapsed');
      });
    });

    // Remove original elements
    elementsToRemove.forEach((el) => el.remove());

    // Insert accordion after h2
    eventInfoHeading.after(accordionContainer);
  }, 600);
}

/**
 * Adds the "Press Releases" eyebrow text to the Announcements section
 */
function addAnnouncementsEyebrow() {
  setTimeout(() => {
    const announcementsHeading = document.querySelector('#announcements-powered-by-lg-ai-at-ces-2026');
    if (!announcementsHeading) return;

    // Check if eyebrow already exists
    if (announcementsHeading.previousElementSibling?.classList.contains('announcements-eyebrow')) return;

    // Create eyebrow element
    const eyebrow = document.createElement('p');
    eyebrow.className = 'announcements-eyebrow';
    eyebrow.textContent = 'Press Releases';

    // Insert before the heading
    announcementsHeading.parentNode.insertBefore(eyebrow, announcementsHeading);
  }, 500);
}

/**
 * Creates the Related Contents carousel
 */
function createRelatedContentsCarousel() {
  setTimeout(() => {
    const relatedContentsSection = document.querySelector('.section.cards-container:has(#related-contents)');
    if (!relatedContentsSection) return;

    const cardsWrapper = relatedContentsSection.querySelector('.cards-wrapper');
    const cardsList = relatedContentsSection.querySelector('.cards ul');
    if (!cardsList) return;

    const cards = Array.from(cardsList.querySelectorAll('li'));
    if (cards.length === 0) return;

    // Collect card data
    const cardsData = cards.map((card) => {
      const img = card.querySelector('.cards-card-image img');
      const title = card.querySelector('.cards-card-body p')?.textContent || '';
      return {
        imgSrc: img?.src || '',
        imgAlt: img?.alt || '',
        title,
        element: card,
      };
    });

    // Show all cards (remove the CSS hiding)
    cards.forEach((card) => {
      card.style.display = 'none';
    });

    // Create featured display
    const featuredDisplay = document.createElement('div');
    featuredDisplay.className = 'related-contents-featured';
    featuredDisplay.innerHTML = `
      <div class="featured-image-container">
        <img src="${cardsData[0].imgSrc}" alt="${cardsData[0].imgAlt}" class="featured-image">
        <div class="featured-play-btn"></div>
        <div class="featured-title-overlay">${cardsData[0].imgAlt || cardsData[0].title}</div>
      </div>
      <div class="featured-caption">${cardsData[0].title}</div>
    `;

    // Create carousel
    const carousel = document.createElement('div');
    carousel.className = 'related-contents-carousel';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'related-contents-carousel-nav prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'related-contents-carousel-nav next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next');

    const track = document.createElement('div');
    track.className = 'related-contents-carousel-track';

    cardsData.forEach((cardData, index) => {
      const item = document.createElement('div');
      item.className = `related-contents-carousel-item${index === 0 ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${cardData.imgSrc}" alt="${cardData.imgAlt}">
        <div class="carousel-play-btn"></div>
        <div class="carousel-item-overlay">
          <div class="carousel-item-title">${cardData.title}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        // Update featured display
        featuredDisplay.querySelector('.featured-image').src = cardData.imgSrc;
        featuredDisplay.querySelector('.featured-image').alt = cardData.imgAlt;
        featuredDisplay.querySelector('.featured-title-overlay').textContent = cardData.imgAlt || cardData.title;
        featuredDisplay.querySelector('.featured-caption').textContent = cardData.title;

        // Update active state
        track.querySelectorAll('.related-contents-carousel-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      });

      track.appendChild(item);
    });

    carousel.appendChild(prevBtn);
    carousel.appendChild(track);
    carousel.appendChild(nextBtn);

    // Navigation functionality
    const scrollAmount = 200;
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Insert into DOM
    cardsWrapper.innerHTML = '';
    cardsWrapper.appendChild(featuredDisplay);
    cardsWrapper.appendChild(carousel);

    // Add featured display styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .related-contents-featured {
        max-width: 900px;
        margin: 0 auto;
      }
      .featured-image-container {
        position: relative;
        border-radius: 0;
        overflow: hidden;
      }
      .featured-image {
        width: 100%;
        height: auto;
        display: block;
      }
      .featured-play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70px;
        height: 70px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        cursor: pointer;
      }
      .featured-play-btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-40%, -50%);
        width: 0;
        height: 0;
        border-left: 22px solid #333;
        border-top: 14px solid transparent;
        border-bottom: 14px solid transparent;
      }
      .featured-title-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        padding: 60px 30px 30px;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        line-height: 1.3;
      }
      .featured-caption {
        text-align: center;
        padding: 20px 0;
        font-size: 15px;
        color: #666;
      }
      @media (max-width: 768px) {
        .featured-title-overlay {
          font-size: 20px;
          padding: 40px 20px 20px;
        }
        .featured-play-btn {
          width: 50px;
          height: 50px;
        }
        .featured-play-btn::after {
          border-left-width: 16px;
          border-top-width: 10px;
          border-bottom-width: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }, 700);
}

/**
 * Creates the CES event page tab navigation
 */
function createCESTabNavigation() {
  // Wait for DOM to be ready
  setTimeout(() => {
    const main = document.querySelector('main');
    if (!main) return;

    // Define the tabs with their labels and target section IDs
    const tabs = [
      { label: 'Event info', target: '#event-info' },
      { label: 'Press conference', target: '#press-conference' },
      { label: 'Exhibition', target: '#exhibition' },
      { label: 'Related Contents', target: '#related-contents' },
    ];

    // Create the tab navigation container
    const tabNav = document.createElement('div');
    tabNav.className = 'ces-tab-navigation';

    // Create inner wrapper for centering
    const tabNavInner = document.createElement('div');
    tabNavInner.className = 'ces-tab-navigation-inner';

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'ces-tabs';

    tabs.forEach((tab) => {
      const tabLink = document.createElement('a');
      tabLink.href = tab.target;
      tabLink.className = 'ces-tab';
      tabLink.textContent = tab.label;
      tabLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetEl = document.querySelector(tab.target);
        if (targetEl) {
          const navHeight = 56 + 50; // header + tab nav height
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
        // Update active state
        document.querySelectorAll('.ces-tab').forEach((t) => t.classList.remove('active'));
        tabLink.classList.add('active');
      });
      tabsContainer.appendChild(tabLink);
    });

    // Create "Stay in touch" button
    const stayInTouchBtn = document.createElement('a');
    stayInTouchBtn.href = '#connect-with-lg-vs-company-updates--inquiries';
    stayInTouchBtn.className = 'ces-stay-in-touch';
    stayInTouchBtn.textContent = 'Stay in touch';
    stayInTouchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.querySelector('#connect-with-lg-vs-company-updates--inquiries');
      if (targetEl) {
        const navHeight = 56 + 50; // header + tab nav height
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });

    tabNavInner.appendChild(tabsContainer);
    tabNavInner.appendChild(stayInTouchBtn);
    tabNav.appendChild(tabNavInner);

    // Insert after the second section (after the description paragraph section)
    const sections = main.querySelectorAll('.section');
    if (sections.length >= 2) {
      sections[1].after(tabNav);
    }

    // Update active tab on scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.pageYOffset + 120;
      tabs.forEach((tab) => {
        const section = document.querySelector(tab.target);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          const tabLink = document.querySelector(`.ces-tab[href="${tab.target}"]`);
          if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            document.querySelectorAll('.ces-tab').forEach((t) => t.classList.remove('active'));
            if (tabLink) tabLink.classList.add('active');
          }
        }
      });
    });
  }, 500);
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }

    // Collect hero elements: picture, h1, and any .mp4 video links in the same section
    const elems = [picture, h1];
    const firstSection = h1.closest('div');
    if (firstSection) {
      const videoLink = firstSection.querySelector('a[href$=".mp4"]');
      if (videoLink) {
        const videoP = videoLink.closest('p') || videoLink;
        elems.push(videoP);
      }
    }

    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems }));

    // Add 'experience' class for LG Experience pages (beige background hero style)
    if (window.location.pathname.includes('/lg-experience/')) {
      section.classList.add('experience');
    }

    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto block `*/fragments/*` references
    const fragments = main.querySelectorAll('a[href*="/fragments/"]');
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(frag.firstElementChild);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  // Add 'experience-page' class to body for LG Experience pages
  if (window.location.pathname.includes('/lg-experience/')) {
    document.body.classList.add('experience-page');
  }

  // Add 'ces2025-page' class for CES 2025 event page
  if (window.location.pathname.includes('/global/mobility') && window.location.pathname.includes('ces2025')) {
    document.body.classList.add('ces2025-page');
    createCESTabNavigation();
    createEventInfoAccordion();
    createRelatedContentsCarousel();
    addAnnouncementsEyebrow();
  }

  // Add 'ces2026-page' class for CES 2026 event page
  if (window.location.pathname.includes('/global/mobility') && window.location.pathname.includes('ces2026')) {
    document.body.classList.add('ces2026-page');
    createCESTabNavigation();
    createEventInfoAccordion();
    createRelatedContentsCarousel();
    addAnnouncementsEyebrow();
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
