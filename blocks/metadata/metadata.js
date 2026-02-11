/**
 * Metadata Block
 * Reads key/value pairs and applies them as document metadata.
 */
export default function decorate(block) {
  const meta = {};
  [...block.children].forEach((row) => {
    if (row.children.length >= 2) {
      const key = row.children[0].textContent.trim();
      const value = row.children[1].textContent.trim();
      if (key && value) {
        meta[key] = value;
        // Apply as meta tag if not already set
        const existingMeta = document.querySelector(`meta[name="${key}"], meta[property="${key}"]`);
        if (!existingMeta) {
          const metaTag = document.createElement('meta');
          if (key.startsWith('og:')) {
            metaTag.setAttribute('property', key);
          } else {
            metaTag.setAttribute('name', key);
          }
          metaTag.setAttribute('content', value);
          document.head.appendChild(metaTag);
        }

        // Apply title
        if (key === 'title' && value) {
          document.title = value;
        }
      }
    }
  });

  // Hide the metadata block
  block.closest('.section').style.display = 'none';
}
