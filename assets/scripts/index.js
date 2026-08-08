// assets/scripts/index.js
document.addEventListener('DOMContentLoaded', () => {
  const bookmark = document.getElementById('intro-bookmark');
  const toggleBtn = document.getElementById('intro-bookmark-toggle');
  const tab = document.getElementById('intro-bookmark-tab');
  if (!bookmark || !toggleBtn || !tab) return;

  let autoCloseTimer = null;

  function startAutoCloseTimer() {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
      minimizePanel();
    }, 7000);
  }

  function openPanel() {
    bookmark.classList.add('is-open');
    bookmark.classList.add('is-expanded'); // automatically show the description whenever the panel opens
    startAutoCloseTimer();
  }

  function minimizePanel() {
    clearTimeout(autoCloseTimer);
    bookmark.classList.remove('is-open');
    bookmark.classList.remove('is-expanded'); // also collapse the description when minimized
  }

  function toggleOpenState() {
    if (bookmark.classList.contains('is-open')) {
      minimizePanel();
    } else {
      openPanel();
    }
  }

  function toggleDescription() {
    bookmark.classList.toggle('is-expanded');
  }

  // The hamburger icon (always visible, whether open or minimized) toggles open/minimized
  toggleBtn.addEventListener('click', toggleOpenState);

  // Clicking the title bar toggles the short description open/closed
  tab.addEventListener('click', toggleDescription);

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