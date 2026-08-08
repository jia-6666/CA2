// assets/scripts/index.js
document.addEventListener('DOMContentLoaded', () => {
  const bookmark = document.getElementById('intro-bookmark');
  const toggleBtn = document.getElementById('intro-bookmark-toggle');
  if (!bookmark || !toggleBtn) return;

  let autoCloseTimer = null;

  function startAutoCloseTimer() {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
      minimizePanel();
    }, 5000);
  }

  function openPanel() {
    bookmark.classList.add('is-open');
    startAutoCloseTimer();
  }

  function minimizePanel() {
    clearTimeout(autoCloseTimer);
    bookmark.classList.remove('is-open');
  }

  function toggleOpenState() {
    if (bookmark.classList.contains('is-open')) {
      minimizePanel();
    } else {
      openPanel();
    }
  }

  // The hamburger icon (always visible, whether open or minimized) toggles open/minimized
  toggleBtn.addEventListener('click', toggleOpenState);

  // Pause the auto-close countdown while the mouse is hovering the panel,
  // and restart a fresh countdown once the mouse leaves
  const panel = bookmark.querySelector('.intro-bookmark-panel');
  if (panel) {
    panel.addEventListener('mouseenter', () => {
      clearTimeout(autoCloseTimer);
    });

    panel.addEventListener('mouseleave', () => {
      if (bookmark.classList.contains('is-open')) {
        startAutoCloseTimer();
      }
    });
  }

  // Auto-open on page load
  openPanel();

  // ===== Carousel rapid-click fix =====
  // Clicking prev/next again before a slide transition finishes can leave
  // two slides marked "active" at once, causing an overlap/flicker.
  // Block extra clicks until the current transition has fully completed.
  const carouselEl = document.getElementById('soc-carousel');
  if (carouselEl) {
    let isSliding = false;

    carouselEl.addEventListener('slide.bs.carousel', () => {
      isSliding = true;
      carouselEl.classList.add('is-sliding');
    });

    carouselEl.addEventListener('slid.bs.carousel', () => {
      isSliding = false;
      carouselEl.classList.remove('is-sliding');
    });

    const controls = carouselEl.querySelectorAll(
      '.carousel-control-prev, .carousel-control-next, .carousel-indicators button'
    );

    controls.forEach((btn) => {
      btn.addEventListener(
        'click',
        (e) => {
          if (isSliding) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        },
        true // capture phase, so this runs before Bootstrap's own click handler
      );

      // Remove focus after clicking so no leftover focus styling sticks
      // once the mouse moves away from the button
      btn.addEventListener('click', () => {
        btn.blur();
      });
    });
  }
});