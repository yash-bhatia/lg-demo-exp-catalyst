export default function decorate(block) {
  // Find links to video files (.mp4 or -mp4 URL patterns) within the hero block
  const videoLinks = block.querySelectorAll('a[href$=".mp4"], a[href$="-mp4"], a[href*="mp4"]');
  videoLinks.forEach((link) => {
    createHeroVideo(block, link);
  });

  // For CES2026 page, check if there's a video link in the next section
  if (window.location.pathname.includes('ces2026')) {
    // Wait for DOM to be ready
    setTimeout(() => {
      const heroSection = block.closest('.section');
      if (heroSection) {
        const nextSection = heroSection.nextElementSibling;
        if (nextSection) {
          const videoLink = nextSection.querySelector('a[href*="mp4"]');
          if (videoLink && !block.querySelector('.hero-video')) {
            createHeroVideo(block, videoLink, true);
          }
        }
      }
    }, 100);
  }
}

function createHeroVideo(block, link, removeFromParent = false) {
  // Convert -mp4 URLs to .mp4 format
  let videoUrl = link.href;
  if (videoUrl.endsWith('-mp4')) {
    videoUrl = videoUrl.replace(/-mp4$/, '.mp4');
  }

  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'hero-video-container';

  // Create video element
  const video = document.createElement('video');
  video.src = videoUrl;
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
    // Hide the static image
    picture.style.display = 'none';
  }

  // Create play/pause button
  const playPauseBtn = document.createElement('button');
  playPauseBtn.className = 'hero-video-play-btn';
  playPauseBtn.innerHTML = '<span class="pause-icon">❚❚</span><span class="play-icon" style="display:none;">▶</span>';
  playPauseBtn.setAttribute('aria-label', 'Pause video');

  // Toggle play/pause
  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseBtn.querySelector('.pause-icon').style.display = 'inline';
      playPauseBtn.querySelector('.play-icon').style.display = 'none';
      playPauseBtn.setAttribute('aria-label', 'Pause video');
    } else {
      video.pause();
      playPauseBtn.querySelector('.pause-icon').style.display = 'none';
      playPauseBtn.querySelector('.play-icon').style.display = 'inline';
      playPauseBtn.setAttribute('aria-label', 'Play video');
    }
  });

  // Assemble video container
  videoContainer.appendChild(video);
  videoContainer.appendChild(playPauseBtn);

  // Insert video container at the beginning of the block
  block.prepend(videoContainer);

  // Remove the link
  if (removeFromParent) {
    const linkParent = link.closest('.button-container') || link.closest('p');
    if (linkParent) {
      linkParent.remove();
    }
  } else {
    const linkParent = link.closest('p') || link.closest('div');
    if (linkParent && linkParent !== block) {
      linkParent.remove();
    } else {
      link.remove();
    }
  }
}
