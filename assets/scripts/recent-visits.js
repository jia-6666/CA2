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
    'study-tools.html': 'Student Tools'
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

  document.addEventListener('DOMContentLoaded', () => {
    logVisit();
    renderVisits();
    setupClearButton();
  });
})();