(() => {
  const now = Date.now();
  const day = 86400000;

  /* Wrapped in try/catch: sandboxed previews may block localStorage —
     the page still works, it just won't remember state between refreshes.
     On your live site (opened normally in a browser) this persists fine. */
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  const KEY_SUGGESTIONS = "soc_suggestions_v1";

  const defaultSuggestions = [
    { id: 1, title: "Add more power sockets in the library", category: "Facilities", votes: 132, hearts: 41, comments: 18, status: "planned", created: now - 6 * day, userVote: 0, hearted: false },
    { id: 2, title: "24-hour access to the Computing Building during finals week", category: "Facilities", votes: 118, hearts: 37, comments: 24, status: "review", created: now - 4 * day, userVote: 0, hearted: false },
    { id: 3, title: "Record every lecture and upload it within 24 hours", category: "Academics", votes: 96, hearts: 29, comments: 12, status: "review", created: now - 9 * day, userVote: 0, hearted: false },
    { id: 4, title: "Free 10-minute chair massages during exam season", category: "Wellness", votes: 88, hearts: 52, comments: 9, status: "review", created: now - 2 * day, userVote: 0, hearted: false },
    { id: 5, title: "A booking system for the shared GPU cluster", category: "Tech", votes: 74, hearts: 20, comments: 15, status: "review", created: now - 1 * day, userVote: 0, hearted: false },
    { id: 6, title: "Bring back the Hackathon x Career Fair combo weekend", category: "Events", votes: 65, hearts: 31, comments: 7, status: "implemented", created: now - 20 * day, userVote: 0, hearted: false },
    { id: 7, title: "At least one standing desk in every study room", category: "Facilities", votes: 59, hearts: 18, comments: 4, status: "review", created: now - 12 * day, userVote: 0, hearted: false },
    { id: 8, title: "An open archive of past exam solutions, with permission", category: "Academics", votes: 47, hearts: 22, comments: 11, status: "review", created: now - 3 * day, userVote: 0, hearted: false },
  ];

  let suggestions = loadJSON(KEY_SUGGESTIONS, defaultSuggestions);

  let activeFilter = "all";
  let activeSort = "top";
  let searchTerm = "";
  let nextId = Math.max(0, ...suggestions.map(s => s.id)) + 1;

  const board = document.getElementById("board");
  const emptyState = document.getElementById("emptyState");
  const toast = document.getElementById("toast");

  const statusLabel = { review: "Under Review", planned: "Planned", implemented: "Implemented" };

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function persist() { saveJSON(KEY_SUGGESTIONS, suggestions); }

  function heartIcon(filled) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
      <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.3 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/>
    </svg>`;
  }

  function cardHTML(s) {
    return `
    <article class="card" data-id="${s.id}">
      <div class="card-top">
        <span class="card-tag">${s.category}</span>
        <span class="card-status ${s.status}">${statusLabel[s.status]}</span>
      </div>
      <div class="card-body">
        <div class="vote-col">
          <button class="vote-btn up ${s.userVote === 1 ? 'voted-up' : ''}" aria-label="Upvote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
          <span class="vote-count">${s.votes}</span>
          <button class="vote-btn down ${s.userVote === -1 ? 'voted-down' : ''}" aria-label="Downvote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </button>
        </div>
        <p class="card-title">${s.title}</p>
      </div>
      <div class="card-bottom">
        <div class="card-meta">
          <button class="comment-btn" aria-label="Add a comment">💬 ${s.comments}</button>
          <span>${s.hearts + (s.hearted ? 1 : 0)}</span>
        </div>
        <button class="heart-btn ${s.hearted ? 'hearted' : ''}" aria-label="Like">${heartIcon(s.hearted)}</button>
      </div>
    </article>`;
  }

  function getVisible() {
    let list = suggestions.filter(s => activeFilter === "all" || s.category === activeFilter);
    if (searchTerm) list = list.filter(s => s.title.toLowerCase().includes(searchTerm));
    if (activeSort === "top") list = [...list].sort((a, b) => b.votes - a.votes);
    else if (activeSort === "new") list = [...list].sort((a, b) => b.created - a.created);
    else if (activeSort === "discussed") list = [...list].sort((a, b) => b.comments - a.comments);
    return list;
  }

  function render(animate) {
    const visible = getVisible();
    emptyState.hidden = visible.length !== 0;
    persist();

    if (!animate) {
      board.innerHTML = visible.map(cardHTML).join("");
      bindCardEvents();
      updateStats();
      return;
    }

    // FLIP animation for reordering
    const first = {};
    board.querySelectorAll(".card").forEach(el => { first[el.dataset.id] = el.getBoundingClientRect(); });

    board.innerHTML = visible.map(cardHTML).join("");
    bindCardEvents();
    updateStats();

    board.querySelectorAll(".card").forEach(el => {
      const f = first[el.dataset.id];
      if (!f) return;
      const last = el.getBoundingClientRect();
      const dx = f.left - last.left;
      const dy = f.top - last.top;
      if (dx || dy) {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "transform 0s";
        requestAnimationFrame(() => {
          el.style.transition = "transform .4s cubic-bezier(.2,.8,.2,1)";
          el.style.transform = "translate(0,0)";
        });
      }
    });
  }

  function updateStats() {
    document.getElementById("statTotal").textContent = suggestions.length;
    document.getElementById("statImplemented").textContent = suggestions.filter(s => s.status === "implemented").length;
    document.getElementById("statVotes").textContent = suggestions.reduce((sum, s) => sum + s.votes, 0);
  }

  function bindCardEvents() {
    board.querySelectorAll(".card").forEach(el => {
      const id = Number(el.dataset.id);
      const s = suggestions.find(x => x.id === id);

      el.querySelector(".vote-btn.up").addEventListener("click", () => {
        const wasBelow = s.votes < 100;
        if (s.userVote === 1) { s.votes -= 1; s.userVote = 0; }
        else { s.votes += (s.userVote === -1 ? 2 : 1); s.userVote = 1; }
        render(true);
        if (wasBelow && s.votes >= 100) {
          setTimeout(() => {
            const card = board.querySelector(`.card[data-id="${id}"]`);
            if (card) { card.classList.add("milestone"); showToast(`"${s.title.slice(0, 34)}…" just crossed 100 votes 🎉`); }
          }, 20);
        }
      });

      el.querySelector(".vote-btn.down").addEventListener("click", () => {
        if (s.userVote === -1) { s.votes += 1; s.userVote = 0; }
        else { s.votes -= (s.userVote === 1 ? 2 : 1); s.userVote = -1; }
        render(true);
      });

      el.querySelector(".heart-btn").addEventListener("click", () => {
        s.hearted = !s.hearted;
        render(false);
      });

      el.querySelector(".comment-btn").addEventListener("click", () => {
        const text = prompt("Add a comment:");
        if (text && text.trim()) {
          s.comments += 1;
          render(true);
          showToast("Comment added!");
        }
      });
    });
  }

  // Filters
  document.getElementById("filterChips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render(true);
  });

  // Sort
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    activeSort = e.target.value;
    render(true);
  });

  // Search
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render(true);
  });

  // Composer
  document.getElementById("composerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("composerInput");
    const category = document.getElementById("composerCategory").value;
    const title = input.value.trim();
    if (!title) return;
    suggestions.unshift({
      id: nextId++, title, category, votes: 1, hearts: 0, comments: 0,
      status: "review", created: Date.now(), userVote: 1, hearted: false
    });
    input.value = "";
    activeSort = "new";
    document.getElementById("sortSelect").value = "new";
    render(true);
    showToast("Your idea is live on the board!");
  });

  render(false);
})();
