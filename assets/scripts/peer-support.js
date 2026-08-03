(() => {
  const toast = document.getElementById("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

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

  const KEY_MOOD = "soc_wellness_mood_v1";
  const KEY_PINS = "soc_wellness_pins_v1";
  const KEY_QA = "soc_wellness_qa_v2";

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

  /* ================= Mood gauge ================= */
  const slider = document.getElementById("moodSlider");
  const sliderFill = document.getElementById("sliderFill");
  const moodWord = document.getElementById("moodWord");
  const gaugeCard = document.getElementById("gaugeCard");
  const recommendItems = document.getElementById("recommendItems");

  const zones = [
    {
      max: 33, word: "Burnt Out", colors: ["#3A3FA0", "#22246E"],
      items: [
        { label: "Book a quiet study room", sub: "45-min slots open now", icon: `<path d="M4 4h16v16H4z"/><path d="M8 2v4M16 2v4M4 10h16"/>`, action: { type: "scroll", target: "#mapSection" } },
        { label: "Contact Student Counsellor", sub: "Free, confidential, same-day slots", icon: `<path d="M4 12a8 8 0 1 1 8 8H7l-3 3v-5.3A8 8 0 0 1 4 12z"/>`, action: { type: "link", href: "mailto:counselling@sp.edu.sg" } },
        { label: "See the Wellness resource hub", sub: "Breathing exercises & sleep tips", icon: `<path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.3 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/>`, action: { type: "link", href: "resources.html" } },
      ]
    },
    {
      max: 66, word: "Cruising", colors: ["#4152D9", "#2F3EB0"],
      items: [
        { label: "Join a study group nearby", sub: "3 groups active right now", icon: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M14.5 14.8c2.6.3 4.5 2.3 4.5 5.2"/>`, action: { type: "scroll", target: "#mapSection" } },
        { label: "Book a quiet study room", sub: "For focused deep-work blocks", icon: `<path d="M4 4h16v16H4z"/><path d="M8 2v4M16 2v4M4 10h16"/>`, action: { type: "scroll", target: "#mapSection" } },
        { label: "Browse this week's events", sub: "Workshops, demo days & socials", icon: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`, action: { type: "link", href: "announcement.html" } },
      ]
    },
    {
      max: 100, word: "Thriving", colors: ["#2FA6BE", "#2F3EB0"],
      items: [
        { label: "Mentor a junior student", sub: "Peer mentoring signups open", icon: `<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`, action: { type: "scroll", target: "#qaSection" } },
        { label: "Share your project on Peer Sharing", sub: "Show off what you've been building", icon: `<path d="M12 2v20M2 12h20"/>`, action: { type: "link", href: "peer-sharing.html" } },
        { label: "Answer a Blockers Q&A post", sub: "Someone's stuck on recursion", icon: `<path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.3 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/>`, action: { type: "scroll", target: "#qaSection" } },
      ]
    }
  ];

  function runAction(action) {
    if (!action) return;
    if (action.type === "scroll") {
      const el = document.querySelector(action.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action.type === "link") {
      window.location.href = action.href;
    }
  }

  function renderZone(zone) {
    moodWord.textContent = zone.word;
    gaugeCard.style.setProperty("--mood-a", zone.colors[0]);
    gaugeCard.style.setProperty("--mood-b", zone.colors[1]);
    recommendItems.innerHTML = zone.items.map((it, i) => `
      <button type="button" class="recommend-item" data-idx="${i}">
        <span class="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${it.icon}</svg></span>
        <div><strong>${it.label}</strong><span>${it.sub}</span></div>
      </button>
    `).join("");
    recommendItems.querySelectorAll(".recommend-item").forEach(btn => {
      btn.addEventListener("click", () => runAction(zone.items[Number(btn.dataset.idx)].action));
    });
  }

  let lastZoneIdx = null;
  function updateGauge(persist) {
    const val = Number(slider.value);
    sliderFill.style.width = val + "%";
    const idx = val <= zones[0].max ? 0 : (val <= zones[1].max ? 1 : 2);
    if (idx !== lastZoneIdx) { renderZone(zones[idx]); lastZoneIdx = idx; }
    if (persist) saveJSON(KEY_MOOD, val);
  }
  slider.value = loadJSON(KEY_MOOD, Number(slider.value));
  slider.addEventListener("input", () => updateGauge(true));
  updateGauge(false);
  saveJSON(KEY_MOOD, Number(slider.value));

  /* ================= Study group map ================= */
  const mapFrame = document.getElementById("mapFrame");
  const pinsLayer = document.getElementById("pinsLayer");
  const pinList = document.getElementById("pinList");
  const pinBtn = document.getElementById("pinBtn");

  const defaultPins = [
    { x: 72.7, y: 64.0, label: "Library — Level 2 quiet zone", mine: false },
    { x: 89.9, y: 56.9, label: "Group project sprint — ISC", mine: false },
    { x: 54.1, y: 74.7, label: "Python study — T10A", mine: false },
  ];
  let pins = loadJSON(KEY_PINS, defaultPins);
  let placing = false;

  const PIN_BTN_DEFAULT = `<i class="bi bi-geo-alt"></i> Pin my study spot`;

  function renderPins() {
    pinsLayer.innerHTML = pins.map(p => `
      <div class="pin ${p.mine ? 'mine' : ''}" style="left:${p.x}%; top:${p.y}%;">
        <div class="pin-dot"><i class="bi bi-record-fill"></i></div>
        <div class="pin-tag">${p.label}</div>
      </div>
    `).join("");
    pinList.innerHTML = pins.map(p => `<span class="pin-chip"><i class="bi bi-geo-alt-fill"></i> ${p.label}</span>`).join("");
    saveJSON(KEY_PINS, pins);
  }
  renderPins();

  pinBtn.addEventListener("click", () => {
    placing = !placing;
    pinBtn.classList.toggle("active", placing);
    pinBtn.innerHTML = placing ? "Click the map to drop your pin…" : PIN_BTN_DEFAULT;
  });

  mapFrame.addEventListener("click", (e) => {
    if (!placing) return;
    const rect = mapFrame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const label = prompt("What's happening here? (e.g. \"Recursion help — Lab 204\")", "Study session");
    if (label === null) return;
    pins.push({ x, y, label: label.slice(0, 40) || "Study session", mine: true });
    renderPins();
    placing = false;
    pinBtn.classList.remove("active");
    pinBtn.innerHTML = PIN_BTN_DEFAULT;
    showToast("Your study spot is live on the map!");
  });

  /* ================= Q&A ================= */
  const qaList = document.getElementById("qaList");
  const qaForm = document.getElementById("qaForm");
  let qaSort = "top";
  const openReplies = new Set(); // ephemeral UI state

  const defaultQuestions = [
    { id: 1, subject: "Python", text: "Need help with recursion — base case keeps looping!", votes: 4, replies: [], solved: false, created: Date.now() - 3 * 3600000, userVoted: false },
    { id: 2, subject: "Algorithms", text: "When do we use DP over plain recursion?", votes: 3, replies: [], solved: true, created: Date.now() - 8 * 3600000, userVoted: false },
    { id: 3, subject: "Algorithms", text: "Merge sort vs quicksort — which for near-sorted data?", votes: 2, replies: [], solved: false, created: Date.now() - 1 * 3600000, userVoted: false },
  ];
  let questions = loadJSON(KEY_QA, defaultQuestions);
  let qaNextId = Math.max(0, ...questions.map(q => q.id)) + 1;

  function replyPanelHTML(q) {
    const list = q.replies.length
      ? q.replies.map(r => `<li>${escapeHtml(r)}</li>`).join("")
      : `<li class="reply-empty">No replies yet — be the first to help.</li>`;
    return `
    <div class="qa-reply-panel">
      <ul class="qa-reply-list">${list}</ul>
      <form class="qa-reply-form">
        <input type="text" placeholder="Write a reply…" maxlength="200" required>
        <button type="submit"><i class="bi bi-send"></i></button>
      </form>
    </div>`;
  }

  function qaRowHTML(q) {
    const open = openReplies.has(q.id);
    return `
    <div class="qa-item" data-id="${q.id}">
      <div class="qa-row">
        <span class="qa-subject">${q.subject}</span>
        <span class="qa-question">${q.text}</span>
        <div class="qa-meta">
          ${q.solved ? '<span class="qa-solved">Solved</span>' : ''}
          <button class="qa-replies-btn" aria-label="View replies"><i class="bi bi-chat-dots"></i> ${q.replies.length}</button>
          <button class="qa-upvote ${q.userVoted ? 'voted' : ''}"><i class="bi bi-caret-up-fill"></i> ${q.votes}</button>
        </div>
      </div>
      ${open ? replyPanelHTML(q) : ""}
    </div>`;
  }

  function renderQA() {
    saveJSON(KEY_QA, questions);
    let list = [...questions];
    if (qaSort === "top") list.sort((a, b) => b.votes - a.votes);
    else if (qaSort === "unanswered") list = list.filter(q => q.replies.length === 0).concat(list.filter(q => q.replies.length > 0));
    else if (qaSort === "new") list.sort((a, b) => b.created - a.created);

    qaList.innerHTML = list.map(qaRowHTML).join("");
    qaList.querySelectorAll(".qa-item").forEach(item => {
      const id = Number(item.dataset.id);
      const q = questions.find(x => x.id === id);

      item.querySelector(".qa-upvote").addEventListener("click", () => {
        q.userVoted = !q.userVoted;
        q.votes += q.userVoted ? 1 : -1;
        renderQA();
      });

      item.querySelector(".qa-replies-btn").addEventListener("click", () => {
        if (openReplies.has(id)) openReplies.delete(id); else openReplies.add(id);
        renderQA();
      });

      const form = item.querySelector(".qa-reply-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("input");
          const text = input.value.trim();
          if (!text) return;
          q.replies.push(text);
          renderQA();
          showToast("Reply posted!");
        });
      }
    });
  }
  renderQA();

  document.querySelectorAll("[data-qa-sort]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-qa-sort]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      qaSort = btn.dataset.qaSort;
      renderQA();
    });
  });

  qaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("qaInput");
    const subject = document.getElementById("qaSubject").value;
    const text = input.value.trim();
    if (!text) return;
    questions.unshift({ id: qaNextId++, subject, text, votes: 1, replies: [], solved: false, created: Date.now(), userVoted: true });
    input.value = "";
    qaSort = "new";
    document.querySelectorAll("[data-qa-sort]").forEach(b => b.classList.toggle("active", b.dataset.qaSort === "new"));
    renderQA();
    showToast("Question posted — the cohort's on it.");
  });
})();
