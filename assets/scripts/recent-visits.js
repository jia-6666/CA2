// assets/scripts/recent-visits.js
(function () {
  const PAGE_NAMES = {
    'about.html': 'About',
    'announcement.html': 'Announcements',
    'cca.html': 'CCA',
    'contact.html': 'Contact',
    'feedback.html': 'Feedback',
    'login.html': 'Login',
    'navigation.html': 'Navigation',
    'peer-sharing.html': 'Peer Sharing',
    'peer-support.html': 'Peer Support',
    'resource.html': 'Resources',
    'tools.html': 'Study Dashboard'
  };

  const STORAGE_KEY = 'recentVisits';
  const MAX_ITEMS = 5;

  function logVisit() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage && PAGE_NAMES[currentPage]) {
      const visits = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filtered = visits.filter(v => v.href !== currentPage);

      filtered.unshift({
        name: PAGE_NAMES[currentPage],
        href: currentPage,
        timestamp: Date.now()
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    }
  }

  function renderVisits() {
    const list = document.getElementById('recent-visits-list');
    const clearBtn = document.getElementById('clear-visits-btn');
    if (!list) return; // not on index.html, nothing to render

    const visits = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (visits.length === 0) {
      list.innerHTML = '<li>No recent visits yet</li>';
      if (clearBtn) clearBtn.style.display = 'none'; // hide clear button when there's nothing to clear
      return;
    }

    list.innerHTML = visits
      .map(v => `<li><a href="${v.href}">${v.name}</a></li>`)
      .join('');

    if (clearBtn) clearBtn.style.display = 'inline-block';
  }

  function setupClearButton() {
    const clearBtn = document.getElementById('clear-visits-btn');
    if (!clearBtn) return; // not on index.html

    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEY);
      renderVisits(); // re-render immediately instead of reloading the page
    });
  }

  // --- Map search history (used on navigation.html) ---
  const MAP_RECENT_KEY = 'mapRecentSearches';
  const MAP_RECENT_MAX = 6;

  function getMapRecent() {
    try {
      return JSON.parse(localStorage.getItem(MAP_RECENT_KEY)) || [];
    } catch {
      return [];
    }
  }

  function renderMapRecent() {
    const row = document.getElementById('recentRow');
    const chips = document.getElementById('recentChips');
    if (!row || !chips) return; // not on navigation.html

    const recent = getMapRecent();

    if (recent.length === 0) {
      row.classList.add('d-none');
      return;
    }

    row.classList.remove('d-none');
    chips.innerHTML = recent
      .map(r => `<button type="button" class="recent-chip" data-id="${r.id}">${r.label}</button>`)
      .join('');
  }

  function saveMapRecent(id, label) {
    let recent = getMapRecent().filter(r => r.id !== id);
    recent.unshift({ id, label });
    localStorage.setItem(MAP_RECENT_KEY, JSON.stringify(recent.slice(0, MAP_RECENT_MAX)));
    renderMapRecent();
  }

  function setupMapRecentClear() {
    const clearBtn = document.getElementById('recentClear');
    if (!clearBtn) return; // not on navigation.html

    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(MAP_RECENT_KEY);
      renderMapRecent();
    });
  }

  // Exposed so navigation.html's map-search script can record a selection
  window.mapSearchHistory = {
    save: saveMapRecent,
    render: renderMapRecent
  };

  document.addEventListener('DOMContentLoaded', () => {
    logVisit();
    renderVisits();
    setupClearButton();
    renderMapRecent();
    setupMapRecentClear();
  });
})();