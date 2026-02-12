export default function decorate(block) {
  // Find links to .mp4 video files and convert to background video
  const videoLinks = block.querySelectorAll('a[href$=".mp4"]');
  videoLinks.forEach((link) => {
    const video = document.createElement('video');
    video.src = link.href;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.className = 'hero-video';

    // Use the poster image if there's a picture element in the block
    const picture = block.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        video.poster = img.currentSrc || img.src;
      }
    }

    // Insert video at the beginning of the block
    block.prepend(video);

    // Remove the link paragraph
    const linkParent = link.closest('p') || link.closest('div');
    if (linkParent && linkParent !== block) {
      linkParent.remove();
    } else {
      link.remove();
    }
  });
}
