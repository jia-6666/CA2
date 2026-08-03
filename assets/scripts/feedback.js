(() => {
  const now = Date.now();
  const day = 86400000;

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  const KEY_SUGGESTIONS = "soc_suggestions_v2";
  const KEY_VOTES_CAST = "soc_suggestions_votescast_v1";

  /* ================= Mobile nav ================= */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
  }

  const defaultSuggestions = [
    { id: 1, title: "Add more power sockets in the library", category: "Facilities", votes: 132, hearts: 41, comments: [], status: "planned", created: now - 6 * day, userVote: 0, hearted: false },
    { id: 2, title: "24-hour access to the Computing Building during finals week", category: "Facilities", votes: 118, hearts: 37, comments: [], status: "review", created: now - 4 * day, userVote: 0, hearted: false },
    { id: 3, title: "Record every lecture and upload it within 24 hours", category: "Academics", votes: 96, hearts: 29, comments: [], status: "review", created: now - 9 * day, userVote: 0, hearted: false },
    { id: 4, title: "Free 10-minute chair massages during exam season", category: "Wellness", votes: 88, hearts: 52, comments: [], status: "review", created: now - 2 * day, userVote: 0, hearted: false },
    { id: 5, title: "A booking system for the shared GPU cluster", category: "Tech", votes: 74, hearts: 20, comments: [], status: "review", created: now - 1 * day, userVote: 0, hearted: false },
    { id: 6, title: "Bring back the Hackathon x Career Fair combo weekend", category: "Events", votes: 65, hearts: 31, comments: [], status: "implemented", created: now - 20 * day, userVote: 0, hearted: false },
    { id: 7, title: "At least one standing desk in every study room", category: "Facilities", votes: 59, hearts: 18, comments: [], status: "review", created: now - 12 * day, userVote: 0, hearted: false },
    { id: 8, title: "An open archive of past exam solutions, with permission", category: "Academics", votes: 47, hearts: 22, comments: [], status: "review", created: now - 3 * day, userVote: 0, hearted: false },
  ];
  // "Votes cast" is a running total of every up/down click ever made — it only
  // ever goes up, unlike the net score shown on each card. Seeded to match the
  // sum of the default cards so the number lines up with what's already "live".
  const defaultVotesCast = defaultSuggestions.reduce((sum, s) => sum + s.votes, 0);

  let suggestions = loadJSON(KEY_SUGGESTIONS, defaultSuggestions);
  let totalVotesCast = loadJSON(KEY_VOTES_CAST, defaultVotesCast);

  let activeFilter = "all";
  let activeSort = "top";
  let searchTerm = "";
  let nextId = Math.max(0, ...suggestions.map(s => s.id)) + 1;

  // which comment panels are open (ephemeral UI state, not persisted)
  const openComments = new Set();

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

  function persist() {
    saveJSON(KEY_SUGGESTIONS, suggestions);
    saveJSON(KEY_VOTES_CAST, totalVotesCast);
  }

  function commentPanelHTML(s) {
    const list = s.comments.length
      ? s.comments.map(c => `<li>${escapeHtml(c)}</li>`).join("")
      : `<li class="comment-empty">No comments yet — be the first.</li>`;
    return `
    <div class="comment-panel">
      <ul class="comment-list">${list}</ul>
      <form class="comment-form">
        <input type="text" placeholder="Add a comment…" maxlength="140" required>
        <button type="submit"><i class="bi bi-send"></i></button>
      </form>
    </div>`;
  }

  function cardHTML(s) {
    const open = openComments.has(s.id);
    return `
    <article class="card" data-id="${s.id}">
      <div class="card-top">
        <span class="card-tag">${s.category}</span>
        <span class="card-status ${s.status}">${statusLabel[s.status]}</span>
      </div>
      <div class="card-body">
        <div class="vote-col">
          <button class="vote-btn up ${s.userVote === 1 ? 'voted-up' : ''}" aria-label="Upvote">
            <i class="bi ${s.userVote === 1 ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}"></i>
          </button>
          <span class="vote-count">${s.votes}</span>
          <button class="vote-btn down ${s.userVote === -1 ? 'voted-down' : ''}" aria-label="Downvote">
            <i class="bi ${s.userVote === -1 ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}"></i>
          </button>
        </div>
        <p class="card-title">${s.title}</p>
      </div>
      <div class="card-bottom">
        <div class="card-meta">
          <button class="comment-btn" aria-label="Comments"><i class="bi bi-chat-dots"></i> ${s.comments.length}</button>
          <span><i class="bi bi-star-fill" style="font-size:11px;"></i> ${s.hearts + (s.hearted ? 1 : 0)}</span>
        </div>
        <button class="favorite-btn ${s.hearted ? 'favorited' : ''}" aria-label="Save this idea">
          <i class="bi ${s.hearted ? 'bi-star-fill' : 'bi-star'}"></i>
        </button>
      </div>
      ${open ? commentPanelHTML(s) : ""}
    </article>`;
  }

  function getVisible() {
    let list = suggestions.filter(s => activeFilter === "all" || s.category === activeFilter);
    if (searchTerm) list = list.filter(s => s.title.toLowerCase().includes(searchTerm));
    if (activeSort === "top") list = [...list].sort((a, b) => b.votes - a.votes);
    else if (activeSort === "new") list = [...list].sort((a, b) => b.created - a.created);
    else if (activeSort === "discussed") list = [...list].sort((a, b) => b.comments.length - a.comments.length);
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
    document.getElementById("statVotes").textContent = totalVotesCast;
  }

  function bindCardEvents() {
    board.querySelectorAll(".card").forEach(el => {
      const id = Number(el.dataset.id);
      const s = suggestions.find(x => x.id === id);

      el.querySelector(".vote-btn.up").addEventListener("click", () => {
        const wasBelow = s.votes < 100;
        const prev = s.userVote;
        if (prev === 1) { s.votes -= 1; s.userVote = 0; }
        else { s.votes += (prev === -1 ? 2 : 1); s.userVote = 1; totalVotesCast++; }
        render(true);
        if (wasBelow && s.votes >= 100) {
          setTimeout(() => {
            const card = board.querySelector(`.card[data-id="${id}"]`);
            if (card) { card.classList.add("milestone"); showToast(`"${s.title.slice(0, 34)}…" just crossed 100 votes 🎉`); }
          }, 20);
        }
      });

      el.querySelector(".vote-btn.down").addEventListener("click", () => {
        const prev = s.userVote;
        if (prev === -1) { s.votes += 1; s.userVote = 0; }
        else { s.votes -= (prev === 1 ? 2 : 1); s.userVote = -1; totalVotesCast++; }
        render(true);
      });

      el.querySelector(".favorite-btn").addEventListener("click", () => {
        s.hearted = !s.hearted;
        render(false);
      });

      el.querySelector(".comment-btn").addEventListener("click", () => {
        if (openComments.has(id)) openComments.delete(id); else openComments.add(id);
        render(false);
      });

      const form = el.querySelector(".comment-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("input");
          const text = input.value.trim();
          if (!text) return;
          s.comments.push(text);
          render(true);
          showToast("Comment added!");
        });
      }
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

  // Composer
  document.getElementById("composerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("composerInput");
    const category = document.getElementById("composerCategory").value;
    const title = input.value.trim();
    if (!title) return;
    suggestions.unshift({
      id: nextId++, title, category, votes: 1, hearts: 0, comments: [],
      status: "review", created: Date.now(), userVote: 1, hearted: false
    });
    totalVotesCast++;
    input.value = "";
    activeSort = "new";
    document.getElementById("sortSelect").value = "new";
    render(true);
    showToast("Your idea is live on the board!");
  });

  render(false);
})();
