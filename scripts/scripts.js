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
    // Try CES 2026 first, then CES 2025
    let announcementsHeading = document.querySelector('#announcements-powered-by-lg-ai-at-ces-2026');
    if (!announcementsHeading) {
      announcementsHeading = document.querySelector('#announcements-powered-by-lg-ai-at-ces-2025');
    }
    if (!announcementsHeading) return;

    // Check if eyebrow already exists
    if (announcementsHeading.previousElementSibling?.classList.contains('announcements-eyebrow')) return;

    // Create eyebrow element
    const eyebrow = document.createElement('p');
    eyebrow.className = 'announcements-eyebrow';
    eyebrow.id = 'press-releases';
    eyebrow.textContent = 'Press Releases';

    // Insert before the heading
    announcementsHeading.parentNode.insertBefore(eyebrow, announcementsHeading);

    // Add section class for styling
    const section = announcementsHeading.closest('.section');
    if (section) {
      section.classList.add('press-releases-section');
    }

    // Add arrow ">" to each link
    const links = announcementsHeading.closest('.default-content-wrapper')?.querySelectorAll('ul li a');
    if (links) {
      links.forEach((link) => {
        if (!link.textContent.includes('>')) {
          link.textContent = link.textContent + ' >';
        }
      });
    }
  }, 500);
}

/**
 * Creates the "WATCH THE FULL VIDEO" button and moves description below hero heading
 */
function createWatchVideoButton() {
  setTimeout(() => {
    const video = document.querySelector('video');
    if (!video) return;

    const videoSrc = video.src || video.querySelector('source')?.src;
    if (!videoSrc) return;

    const section2 = document.querySelector('main > .section:nth-child(2)');
    if (!section2) return;

    const contentWrapper = section2.querySelector('.default-content-wrapper');
    if (!contentWrapper) return;

    if (contentWrapper.querySelector('.button-container')) return;

    const paragraphs = contentWrapper.querySelectorAll('p');
    const descriptionParagraph = paragraphs[2];

    if (descriptionParagraph) {
      const rideInTuneHeading = document.querySelector('#ride-in-tune-the-lg-mobility-invehicle-experience');
      if (rideInTuneHeading) {
        const descClone = descriptionParagraph.cloneNode(true);
        descClone.className = 'hero-description';
        rideInTuneHeading.parentNode.insertBefore(descClone, rideInTuneHeading.nextSibling);
        descriptionParagraph.style.display = 'none';
      }
    }

    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';

    const button = document.createElement('a');
    button.href = videoSrc;
    button.className = 'button';
    button.target = '_blank';
    button.textContent = 'Watch Video';

    buttonContainer.appendChild(button);
    contentWrapper.appendChild(buttonContainer);
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
 * Creates the Private Showcase carousel (similar to Related Contents)
 */
function createPrivateShowcaseCarousel() {
  setTimeout(() => {
    const privateShowcaseSection = document.querySelector('.section.cards-container:has(#private-showcase)');
    if (!privateShowcaseSection) return;

    const cardsWrapper = privateShowcaseSection.querySelector('.cards-wrapper');
    const cardsList = privateShowcaseSection.querySelector('.cards ul');
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

    // Hide all original cards
    cards.forEach((card) => {
      card.style.display = 'none';
    });

    // Create featured display
    const featuredDisplay = document.createElement('div');
    featuredDisplay.className = 'private-showcase-featured';
    featuredDisplay.innerHTML = `
      <div class="ps-featured-image-container">
        <img src="${cardsData[0].imgSrc}" alt="${cardsData[0].imgAlt}" class="ps-featured-image">
        <div class="ps-featured-play-btn"></div>
        <div class="ps-featured-title-overlay">${cardsData[0].imgAlt || cardsData[0].title}</div>
      </div>
      <div class="ps-featured-caption">${cardsData[0].title}</div>
    `;

    // Create carousel
    const carousel = document.createElement('div');
    carousel.className = 'private-showcase-carousel';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'private-showcase-carousel-nav prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'private-showcase-carousel-nav next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next');

    const track = document.createElement('div');
    track.className = 'private-showcase-carousel-track';

    cardsData.forEach((cardData, index) => {
      const item = document.createElement('div');
      item.className = `private-showcase-carousel-item${index === 0 ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${cardData.imgSrc}" alt="${cardData.imgAlt}">
        <div class="ps-carousel-play-btn"></div>
        <div class="ps-carousel-item-overlay">
          <div class="ps-carousel-item-title">${cardData.title}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        // Update featured display
        featuredDisplay.querySelector('.ps-featured-image').src = cardData.imgSrc;
        featuredDisplay.querySelector('.ps-featured-image').alt = cardData.imgAlt;
        featuredDisplay.querySelector('.ps-featured-title-overlay').textContent = cardData.imgAlt || cardData.title;
        featuredDisplay.querySelector('.ps-featured-caption').textContent = cardData.title;

        // Update active state
        track.querySelectorAll('.private-showcase-carousel-item').forEach((i) => i.classList.remove('active'));
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
  }, 700);
}

/**
 * Creates a secondary video carousel (10th section, 3rd child) styled like private showcase
 */
function createSecondaryVideoCarousel() {
  setTimeout(() => {
    // Target the specific element: body > main > div:nth-child(10) > div:nth-child(3)
    const targetElement = document.querySelector('body > main > div:nth-child(10) > div:nth-child(3)');
    if (!targetElement || !targetElement.classList.contains('cards-wrapper')) return;

    const cardsList = targetElement.querySelector('.cards ul');
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

    // Hide all original cards
    cards.forEach((card) => {
      card.style.display = 'none';
    });

    // Add a class to identify this section
    targetElement.classList.add('secondary-video-carousel-wrapper');

    // Create featured display
    const featuredDisplay = document.createElement('div');
    featuredDisplay.className = 'secondary-video-featured';
    featuredDisplay.innerHTML = `
      <div class="sv-featured-image-container">
        <img src="${cardsData[0].imgSrc}" alt="${cardsData[0].imgAlt}" class="sv-featured-image">
        <div class="sv-featured-play-btn"></div>
        <div class="sv-featured-title-overlay">${cardsData[0].imgAlt || cardsData[0].title}</div>
      </div>
      <div class="sv-featured-caption">${cardsData[0].title}</div>
    `;

    // Create carousel
    const carousel = document.createElement('div');
    carousel.className = 'secondary-video-carousel';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'secondary-video-carousel-nav prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'secondary-video-carousel-nav next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next');

    const track = document.createElement('div');
    track.className = 'secondary-video-carousel-track';

    cardsData.forEach((cardData, index) => {
      const item = document.createElement('div');
      item.className = `secondary-video-carousel-item${index === 0 ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${cardData.imgSrc}" alt="${cardData.imgAlt}">
        <div class="sv-carousel-play-btn"></div>
        <div class="sv-carousel-item-overlay">
          <div class="sv-carousel-item-title">${cardData.title}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        // Update featured display
        featuredDisplay.querySelector('.sv-featured-image').src = cardData.imgSrc;
        featuredDisplay.querySelector('.sv-featured-image').alt = cardData.imgAlt;
        featuredDisplay.querySelector('.sv-featured-title-overlay').textContent = cardData.imgAlt || cardData.title;
        featuredDisplay.querySelector('.sv-featured-caption').textContent = cardData.title;

        // Update active state
        track.querySelectorAll('.secondary-video-carousel-item').forEach((i) => i.classList.remove('active'));
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
    targetElement.innerHTML = '';
    targetElement.appendChild(featuredDisplay);
    targetElement.appendChild(carousel);
  }, 800);
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

    // Get header wrapper and tab nav initial position
    const headerWrapper = document.querySelector('header .nav-wrapper');
    const tabNavInitialTop = tabNav.offsetTop;
    
    // Add transition to header for smooth animation
    if (headerWrapper) {
      headerWrapper.style.transition = 'transform 0.3s ease';
    }

    // Update active tab and handle header/tab nav visibility on scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.pageYOffset;
      
      // Handle header hiding and tab nav becoming fixed
      if (scrollPos >= tabNavInitialTop - 56) {
        if (headerWrapper) headerWrapper.style.transform = 'translateY(-100%)';
        tabNav.style.position = 'fixed';
        tabNav.style.top = '0';
        tabNav.style.left = '0';
        tabNav.style.right = '0';
        tabNav.style.width = '100%';
        tabNav.style.marginLeft = '0';
      } else {
        if (headerWrapper) headerWrapper.style.transform = 'translateY(0)';
        tabNav.style.position = 'sticky';
        tabNav.style.top = '0';
        tabNav.style.width = '100vw';
        tabNav.style.marginLeft = 'calc(-50vw + 50%)';
      }

      // Update active tab
      const activeScrollPos = scrollPos + 120;
      tabs.forEach((tab) => {
        const section = document.querySelector(tab.target);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          const tabLink = document.querySelector(`.ces-tab[href="${tab.target}"]`);
          if (activeScrollPos >= sectionTop && activeScrollPos < sectionBottom) {
            document.querySelectorAll('.ces-tab').forEach((t) => t.classList.remove('active'));
            if (tabLink) tabLink.classList.add('active');
          }
        }
      });
    });
  }, 500);
}

/**
 * Creates a highlights image gallery with main image and thumbnails (CES 2025 only)
 */
function createHighlightsGallery() {
  setTimeout(() => {
    const highlightsSection = document.querySelector('.section.columns-container:has(#highlights)');
    if (!highlightsSection) return;

    const columnsWrapper = highlightsSection.querySelector('.columns-wrapper');
    if (!columnsWrapper) return;

    // Get the columns structure: first div has images, second div has text
    const columnsInner = columnsWrapper.querySelector('.columns > div');
    if (!columnsInner) return;

    const firstCol = columnsInner.querySelector('div:first-child');
    const secondCol = columnsInner.querySelector('div:last-child');
    if (!firstCol) return;

    // Get all pictures from the first column
    const pictures = firstCol.querySelectorAll('picture');
    if (pictures.length < 2) return;

    // Get caption text from second column
    const captionText = secondCol?.textContent?.trim() || '';

    // Create the gallery structure
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'highlights-gallery';

    // Main image container (left side - large)
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'highlights-main-image';

    const mainPicture = document.createElement('div');
    mainPicture.className = 'gallery-main-picture';
    mainPicture.appendChild(pictures[0].cloneNode(true));
    mainImageContainer.appendChild(mainPicture);

    // Caption below main image
    const caption = document.createElement('p');
    caption.className = 'highlights-caption';
    caption.textContent = captionText;
    mainImageContainer.appendChild(caption);

    // Thumbnails container (right side - small)
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'highlights-thumbnails';

    pictures.forEach((picture, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'highlights-thumb' + (index === 0 ? ' active' : '');
      thumb.appendChild(picture.cloneNode(true));

      thumb.addEventListener('click', () => {
        // Update main image
        mainPicture.innerHTML = '';
        mainPicture.appendChild(picture.cloneNode(true));

        // Update active state
        thumbnailsContainer.querySelectorAll('.highlights-thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      thumbnailsContainer.appendChild(thumb);
    });

    galleryContainer.appendChild(mainImageContainer);
    galleryContainer.appendChild(thumbnailsContainer);

    // Replace the columns content
    const columns = columnsWrapper.querySelector('.columns');
    if (columns) {
      columns.innerHTML = '';
      columns.appendChild(galleryContainer);
    }
  }, 600);
}

function createPublicShowcaseGallery() {
  setTimeout(() => {
    const showcaseSection = document.querySelector('.section.columns-container:has(#public-showcase)');
    if (!showcaseSection) return;

    const columnsWrapper = showcaseSection.querySelector('.columns-wrapper');
    if (!columnsWrapper) return;

    const columnsInner = columnsWrapper.querySelector('.columns > div');
    if (!columnsInner) return;

    const firstCol = columnsInner.querySelector('div:first-child');
    const secondCol = columnsInner.querySelector('div:last-child');
    if (!firstCol) return;

    const pictures = firstCol.querySelectorAll('picture');
    if (pictures.length < 2) return;

    const captionText = secondCol?.textContent?.trim() || '';

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'showcase-gallery';

    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'showcase-main-image';

    const mainPicture = document.createElement('div');
    mainPicture.className = 'gallery-main-picture';
    mainPicture.appendChild(pictures[0].cloneNode(true));
    mainImageContainer.appendChild(mainPicture);

    const caption = document.createElement('p');
    caption.className = 'showcase-caption';
    caption.textContent = captionText;
    mainImageContainer.appendChild(caption);

    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'showcase-thumbnails';

    pictures.forEach((picture, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'showcase-thumb' + (index === 0 ? ' active' : '');
      thumb.appendChild(picture.cloneNode(true));

      thumb.addEventListener('click', () => {
        mainPicture.innerHTML = '';
        mainPicture.appendChild(picture.cloneNode(true));
        thumbnailsContainer.querySelectorAll('.showcase-thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      thumbnailsContainer.appendChild(thumb);
    });

    galleryContainer.appendChild(mainImageContainer);
    galleryContainer.appendChild(thumbnailsContainer);

    const columns = columnsWrapper.querySelector('.columns');
    if (columns) {
      columns.innerHTML = '';
      columns.appendChild(galleryContainer);
    }
  }, 600);
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
    createWatchVideoButton();
    createHighlightsGallery();
    createPublicShowcaseGallery();
    createPrivateShowcaseCarousel();
    createSecondaryVideoCarousel();
  }

  // Add 'ces2026-page' class for CES 2026 event page
  if (window.location.pathname.includes('/global/mobility') && window.location.pathname.includes('ces2026')) {
    document.body.classList.add('ces2026-page');
    createCESTabNavigation();
    createEventInfoAccordion();
    createRelatedContentsCarousel();
    addAnnouncementsEyebrow();
    createWatchVideoButton();
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
