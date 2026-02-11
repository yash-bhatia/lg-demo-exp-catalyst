var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-lg-tech-hub-article.js
  var import_lg_tech_hub_article_exports = {};
  __export(import_lg_tech_hub_article_exports, {
    default: () => import_lg_tech_hub_article_default
  });

  // tools/importer/parsers/table.js
  function parse(element, { document }) {
    const rows = element.querySelectorAll("tbody tr");
    if (!rows || rows.length === 0) return;
    const cells = [];
    rows.forEach((row) => {
      const rowCells = row.querySelectorAll("td, th");
      const rowContent = [];
      rowCells.forEach((cell) => {
        const cellDiv = document.createElement("div");
        cellDiv.innerHTML = cell.innerHTML;
        rowContent.push(cellDiv);
      });
      cells.push(rowContent);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Table (striped, bordered)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const imageContainer = element.querySelector(
      ".imagesliderandtext-image.mobile-hidden img[data-src], .imagesliderandtext-image.mobile-hidden img[src]"
    );
    const textContent = element.querySelector(".imagesliderandtext-text .editable-content");
    if (!imageContainer && !textContent) return;
    const flexContainer = element.querySelector(".desktop-flex");
    const firstChild = flexContainer ? flexContainer.firstElementChild : null;
    const isImageFirst = firstChild && firstChild.classList.contains("component-item");
    let imageEl = null;
    if (imageContainer) {
      const img = document.createElement("img");
      const src = imageContainer.getAttribute("data-src") || imageContainer.getAttribute("src");
      if (src) {
        const absoluteSrc = src.startsWith("/") ? `https://www.lg.com${src}` : src;
        img.setAttribute("src", absoluteSrc);
        const alt = imageContainer.getAttribute("alt") || "";
        img.setAttribute("alt", alt);
        imageEl = img;
      }
    }
    let textEl = null;
    if (textContent) {
      textEl = document.createElement("div");
      textEl.innerHTML = textContent.innerHTML;
      textEl.querySelectorAll('a[href^="/"]').forEach((link) => {
        link.href = `https://www.lg.com${link.getAttribute("href")}`;
      });
    }
    const cells = [];
    if (isImageFirst) {
      cells.push([imageEl || "", textEl || ""]);
    } else {
      cells.push([textEl || "", imageEl || ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".lg-tile-box.lg-article");
    if (!cards || cards.length === 0) return;
    const cells = [];
    cards.forEach((card) => {
      const imgEl = card.querySelector(".image-container img[data-src], .image-container img[src]");
      let imageCell = "";
      if (imgEl) {
        const img = document.createElement("img");
        const src = imgEl.getAttribute("data-src") || imgEl.getAttribute("src");
        if (src) {
          const absoluteSrc = src.startsWith("/") ? `https://www.lg.com${src}` : src;
          img.setAttribute("src", absoluteSrc);
          const alt = imgEl.getAttribute("alt") || "";
          img.setAttribute("alt", alt);
          imageCell = img;
        }
      }
      const textCell = document.createElement("div");
      const titleEl = card.querySelector(".tile-content-container h3");
      if (titleEl) {
        const titleLink = titleEl.querySelector("a");
        const h3 = document.createElement("h3");
        if (titleLink) {
          const a = document.createElement("a");
          let href = titleLink.getAttribute("href") || "#";
          if (href.startsWith("/")) href = `https://www.lg.com${href}`;
          a.setAttribute("href", href);
          a.textContent = titleLink.textContent.trim();
          const strong = document.createElement("strong");
          strong.appendChild(a);
          h3.appendChild(strong);
        } else {
          h3.textContent = titleEl.textContent.trim();
        }
        textCell.appendChild(h3);
      }
      const descEl = card.querySelector(".tile-content-container p.intro-copy");
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        textCell.appendChild(p);
      }
      const categoryEl = card.querySelector(".tile-content-container p.category-tag");
      if (categoryEl && !descEl) {
        const p = document.createElement("p");
        p.textContent = categoryEl.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lg-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".gnb-wrap",
        ".footer-wrap",
        ".breadcrumb",
        ".floating-menu",
        ".quickmenu",
        ".al-quick",
        ".skip_nav",
        ".broswe-check-popup-layer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="onetrust"]',
        ".c-pop-msg"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".lg-article-nav"
      ]);
      const socialShare = element.querySelector(".page-header .social-share, .page-header .share-button");
      if (socialShare) socialShare.remove();
      const lazyImages = element.querySelectorAll("img[data-src]");
      lazyImages.forEach((img) => {
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc && !img.getAttribute("src")) {
          img.setAttribute("src", dataSrc);
        }
      });
      WebImporter.DOMUtils.remove(element, [
        ".show-mobile"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "source"
      ]);
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("data-link-name");
        el.removeAttribute("data-log");
        el.removeAttribute("data-sc-item");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/import-lg-tech-hub-article.js
  var parsers = {
    "table": parse,
    "columns": parse2,
    "cards": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "lg-tech-hub-article",
    description: "LG Tech Hub blog article template with hero image, article body sections, product comparison table, product spotlight columns, FAQ section, featured products and related articles card grids",
    urls: [
      "https://www.lg.com/fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree"
    ],
    blocks: [
      {
        name: "table",
        instances: ["table.rounded-corners"]
      },
      {
        name: "columns",
        instances: ["div.imagesliderandtext"]
      },
      {
        name: "cards",
        instances: ["div.lg-article-related div.more-articles-container div.lg-tile-container"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_lg_tech_hub_article_default = {
    /**
     * Main transformation function using the 'one input / multiple outputs' pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_lg_tech_hub_article_exports);
})();
