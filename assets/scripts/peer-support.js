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

  /* =====================================================================
     Comment system — merged in directly (was previously a separate
     assets/styles/comments.js loaded before this file). Kept as a small
     local module (`CommentSystem`) so the rest of the file below (the Q&A
     reply panels) reads exactly the same as before.

     Public API (CommentSystem):
       - migrate(list)            upgrade old plain-string comment arrays
       - create(text)             build a new comment object
       - renderList(comments)     HTML string for the <ul class="comment-list">
       - bind(panelEl, comments, handlers)  wires up edit/delete/react/submit
       - EMOJIS                   the emoji reaction palette
     ===================================================================== */
  const CommentSystem = (() => {
    // Emoji reaction palette — deliberately wider than a single "heart" so
    // people have Instagram-style freedom in how they react to a comment.
    const EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "🎉", "👏", "💯", "🙌", "😍"];

    function escapeHtmlLocal(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    // Human readable "x ago" string for the comment timestamp.
    function timeAgo(ts) {
      const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
      if (diffSec < 5) return "just now";
      if (diffSec < 60) return `${diffSec}s ago`;
      const min = Math.floor(diffSec / 60);
      if (min < 60) return `${min}m ago`;
      const hr = Math.floor(min / 60);
      if (hr < 24) return `${hr}h ago`;
      const day = Math.floor(hr / 24);
      if (day < 7) return `${day}d ago`;
      const wk = Math.floor(day / 7);
      if (wk < 5) return `${wk}w ago`;
      const mo = Math.floor(day / 30);
      if (mo < 12) return `${mo}mo ago`;
      return `${Math.floor(day / 365)}y ago`;
    }

    let idCounter = 0;
    function newId() { return `c${Date.now()}_${idCounter++}`; }

    // Builds a brand new comment object for something the current user just typed.
    function create(text) {
      return {
        id: newId(),
        text,
        time: Date.now(),
        edited: false,
        isOwn: true,        // only the author of a comment gets edit/delete controls
        reactions: {},       // { "😂": 3, "🔥": 1, ... }
        myReaction: null,    // which emoji (if any) the current user picked
      };
    }

    // Old saved data (from before this feature existed) stored comments as
    // plain strings. This upgrades those — and fills in any missing fields on
    // partially-shaped objects — so nothing breaks for returning visitors.
    function migrate(list) {
      return (Array.isArray(list) ? list : []).map((c) => {
        if (typeof c === "string") {
          return { id: newId(), text: c, time: Date.now(), edited: false, isOwn: false, reactions: {}, myReaction: null };
        }
        return Object.assign({ id: newId(), time: Date.now(), edited: false, isOwn: false, reactions: {}, myReaction: null }, c);
      });
    }

    function reactionPillsHTML(c) {
      const entries = Object.entries(c.reactions || {}).filter(([, n]) => n > 0);
      if (!entries.length) return "";
      return `<div class="reaction-pills">${entries
        .map(([emo, n]) => `<button type="button" class="reaction-pill ${c.myReaction === emo ? "mine" : ""}" data-emo="${escapeHtmlLocal(emo)}">${emo} <b>${n}</b></button>`)
        .join("")}</div>`;
    }

    function itemHTML(c) {
      const editedTag = c.edited ? `<span class="comment-edited">(edited)</span>` : "";
      return `
      <li class="comment-item" data-cid="${c.id}">
        <div class="comment-head">
          <span class="comment-author">${c.isOwn ? "You" : "Anonymous"}</span>
          <span class="comment-dot">&middot;</span>
          <span class="comment-time" title="${new Date(c.time).toLocaleString()}">${timeAgo(c.time)}</span>
          ${editedTag}
        </div>
        <p class="comment-text">${escapeHtmlLocal(c.text)}</p>
        <div class="comment-footer">
          <button type="button" class="comment-react-btn ${c.myReaction ? "active" : ""}" aria-haspopup="true" aria-label="React with an emoji">
            ${c.myReaction ? c.myReaction : '<i class="bi bi-emoji-smile"></i>'} React
          </button>
          ${reactionPillsHTML(c)}
          <span class="comment-spacer"></span>
          ${c.isOwn ? `
            <button type="button" class="comment-edit-btn" aria-label="Edit your comment"><i class="bi bi-pencil"></i></button>
            <button type="button" class="comment-delete-btn" aria-label="Delete your comment"><i class="bi bi-trash3"></i></button>
          ` : ""}
        </div>
      </li>`;
    }

    function renderList(comments) {
      if (!comments || !comments.length) return `<li class="comment-empty">No comments yet — be the first.</li>`;
      return comments.map(itemHTML).join("");
    }

    /* ---------------- floating emoji picker (Instagram-style) ----------------
       Rendered as a fixed-position popover appended to <body> instead of being
       inline in the comment list, because the comment list scrolls
       (overflow-y:auto) and an inline popover would get clipped. */
    let currentPicker = null;
    function closePicker() {
      if (currentPicker) { currentPicker.remove(); currentPicker = null; }
    }
    function openPicker(anchorEl, onPick) {
      closePicker();
      const pop = document.createElement("div");
      pop.className = "emoji-picker-pop";
      pop.setAttribute("role", "menu");
      pop.innerHTML = EMOJIS.map((e) => `<button type="button" class="emoji-opt" data-emo="${e}" role="menuitem">${e}</button>`).join("");
      document.body.appendChild(pop);

      const rect = anchorEl.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = rect.left;
      let top = rect.top - ph - 8;
      if (top < 8) top = rect.bottom + 8; // flip below the button if there's no room above
      if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
      if (left < 8) left = 8;
      pop.style.left = `${left}px`;
      pop.style.top = `${top}px`;
      requestAnimationFrame(() => pop.classList.add("show"));

      pop.querySelectorAll(".emoji-opt").forEach((opt) => {
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          onPick(opt.dataset.emo);
          closePicker();
        });
      });
      currentPicker = pop;
    }
    document.addEventListener("click", (e) => {
      if (currentPicker && !currentPicker.contains(e.target) && !e.target.closest(".comment-react-btn")) closePicker();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePicker(); });

    // "Flood" burst effect — a handful of copies of the chosen emoji float up
    // and fade out from wherever the user tapped, similar to Instagram/TikTok
    // style reaction bursts.
    function floodEffect(originEl, emoji) {
      const rect = originEl.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const count = 9;
      for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "emoji-flood";
        span.textContent = emoji;
        const dx = (Math.random() - 0.5) * 130;
        const rot = (Math.random() - 0.5) * 70;
        const dur = 650 + Math.random() * 450;
        span.style.left = `${originX}px`;
        span.style.top = `${originY}px`;
        span.style.setProperty("--dx", `${dx}px`);
        span.style.setProperty("--rot", `${rot}deg`);
        span.style.animationDuration = `${dur}ms`;
        span.style.animationDelay = `${i * 28}ms`;
        document.body.appendChild(span);
        setTimeout(() => span.remove(), dur + i * 28 + 80);
      }
    }

    function applyReaction(c, emo, sourceEl) {
      if (c.myReaction === emo) {
        // clicking the same emoji again removes the reaction
        c.reactions[emo] = Math.max(0, (c.reactions[emo] || 1) - 1);
        c.myReaction = null;
      } else {
        if (c.myReaction) c.reactions[c.myReaction] = Math.max(0, (c.reactions[c.myReaction] || 1) - 1);
        c.reactions[emo] = (c.reactions[emo] || 0) + 1;
        c.myReaction = emo;
        if (sourceEl) floodEffect(sourceEl, emo);
      }
    }

    /**
     * Binds all interaction for one comment panel.
     * panelEl   – the wrapper element containing a `.comment-list` (<ul>) and a `.comment-form`
     * comments  – the live array of comment objects (mutated in place)
     * handlers  – { onAdd, onEdit, onDelete, onReact, onChange }
     *             each is called after the relevant mutation so the caller can
     *             re-render + persist + toast however it likes. `onChange` is
     *             used as a fallback for any handler that isn't provided.
     */
    function bind(panelEl, comments, handlers = {}) {
      const fire = (type) => (handlers[type] || handlers.onChange || (() => { }))();

      const list = panelEl.querySelector(".comment-list");
      if (list) {
        list.querySelectorAll(".comment-item").forEach((li) => {
          const id = li.dataset.cid;
          const c = comments.find((x) => x.id === id);
          if (!c) return;

          const reactBtn = li.querySelector(".comment-react-btn");
          reactBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openPicker(reactBtn, (emo) => { applyReaction(c, emo, reactBtn); fire("onReact"); });
          });

          li.querySelectorAll(".reaction-pill").forEach((pill) => {
            pill.addEventListener("click", (e) => {
              e.stopPropagation();
              applyReaction(c, pill.dataset.emo, pill);
              fire("onReact");
            });
          });

          if (c.isOwn) {
            const editBtn = li.querySelector(".comment-edit-btn");
            const delBtn = li.querySelector(".comment-delete-btn");
            editBtn.addEventListener("click", () => {
              const updated = prompt("Edit your comment:", c.text);
              if (updated === null) return; // cancelled
              const trimmed = updated.trim();
              if (!trimmed || trimmed === c.text) return;
              c.text = trimmed;
              c.edited = true;
              fire("onEdit");
            });
            delBtn.addEventListener("click", () => {
              if (!confirm("Delete this comment? This can't be undone.")) return;
              const idx = comments.findIndex((x) => x.id === id);
              if (idx > -1) comments.splice(idx, 1);
              fire("onDelete");
            });
          }
        });
      }

      const form = panelEl.querySelector(".comment-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("input");
          const text = input.value.trim();
          if (!text) return;
          comments.push(create(text));
          input.value = "";
          fire("onAdd");
        });
      }
    }

    return { EMOJIS, escapeHtml: escapeHtmlLocal, timeAgo, migrate, create, renderList, bind, floodEffect };
  })();

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
  const recommendCard = document.getElementById("recommendCard");
  const recommendToggle = document.getElementById("recommendToggle");

  /* ================= Recommendation dropdown (mobile/portrait) =================
     On narrow/portrait screens the recommendation list is long enough that it
     turns the check-in into a big scroll. recommend-toggle lets the user pick
     whether to see it at all; on wider screens CSS keeps it always expanded
     and hides the button (see peer-support.css). */
  const KEY_RECOMMEND_OPEN = "soc_wellness_recommend_open_v1";
  function isNarrowViewport() {
    return window.matchMedia("(max-width: 640px)").matches;
  }
  function setRecommendOpen(open) {
    recommendCard.classList.toggle("collapsed", !open);
    recommendToggle.setAttribute("aria-expanded", String(open));
    recommendToggle.querySelector(".recommend-toggle-label").textContent = open ? "Hide suggestions" : "Show suggestions";
    saveJSON(KEY_RECOMMEND_OPEN, open);
  }
  if (recommendToggle) {
    // Collapsed by default on mobile/portrait the first time; remembers the
    // user's last choice after that (on any screen size).
    const savedOpen = loadJSON(KEY_RECOMMEND_OPEN, !isNarrowViewport());
    setRecommendOpen(savedOpen);
    recommendToggle.addEventListener("click", () => {
      setRecommendOpen(recommendCard.classList.contains("collapsed"));
    });
  }

  const zones = [
    {
      max: 33, word: "Burnt Out", colors: ["#3A3FA0", "#22246E"],
      items: [
        { label: "Book a quiet study room", sub: "45-min slots open now", icon: `<path d="M4 4h16v16H4z"/><path d="M8 2v4M16 2v4M4 10h16"/>`, action: { type: "scroll", target: "#mapSection" } },
        { label: "Contact Student Counsellor", sub: "Free, confidential, same-day slots", icon: `<path d="M4 12a8 8 0 1 1 8 8H7l-3 3v-5.3A8 8 0 0 1 4 12z"/>`, action: { type: "link", href: "contact.html" } },
        { label: "See the Wellness resource hub", sub: "Breathing exercises & sleep tips", icon: `<path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.3 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/>`, action: { type: "external", href: "https://www.helpguide.org/mental-health/stress/stress-management" } },
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
    } else if (action.type === "external") {
      const ok = confirm("This will open an external website in a new tab. Continue?");
      if (ok) window.open(action.href, "_blank", "noopener,noreferrer");
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
  const mapViewport = document.getElementById("mapViewport");
  const mapFrame = document.getElementById("mapFrame");
  const pinsLayer = document.getElementById("pinsLayer");
  const pinList = document.getElementById("pinList");
  const pinBtn = document.getElementById("pinBtn");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");
  const mapZoomHint = document.getElementById("mapZoomHint");

  /* ---- Map zoom & pan ----
     The map image is quite small on portrait/mobile screens, so mapFrame can
     be scaled up (zoom buttons, mouse wheel, or two-finger pinch) and, once
     zoomed in, dragged around inside mapViewport (which clips overflow).
     Because mapFrame itself is what gets the CSS transform, pin placement
     (which reads mapFrame.getBoundingClientRect()) keeps working unchanged —
     the rect already reflects the current zoom/pan. */
  const MIN_SCALE = 1, MAX_SCALE = 4;
  let scale = 1, panX = 0, panY = 0;
  let justDragged = false; // suppresses the "drop a pin" click right after a drag

  function applyMapTransform() {
    mapFrame.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    mapViewport.classList.toggle("zoomed", scale > 1);
  }

  function clampPan() {
    const vpRect = mapViewport.getBoundingClientRect();
    const minX = -(vpRect.width * (scale - 1));
    const minY = -(vpRect.height * (scale - 1));
    panX = Math.min(0, Math.max(minX, panX));
    panY = Math.min(0, Math.max(minY, panY));
  }

  function setScale(newScale, anchorClientX, anchorClientY) {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
    if (clamped === scale) return;
    const vpRect = mapViewport.getBoundingClientRect();
    // keep the point under the cursor/finger stationary while zooming, like a real map
    const ax = anchorClientX != null ? anchorClientX - vpRect.left : vpRect.width / 2;
    const ay = anchorClientY != null ? anchorClientY - vpRect.top : vpRect.height / 2;
    const ratio = clamped / scale;
    panX = ax - (ax - panX) * ratio;
    panY = ay - (ay - panY) * ratio;
    scale = clamped;
    if (scale === MIN_SCALE) { panX = 0; panY = 0; }
    clampPan();
    applyMapTransform();
    if (mapZoomHint) mapZoomHint.classList.toggle("hidden", scale !== MIN_SCALE);
  }

  zoomInBtn.addEventListener("click", () => setScale(scale + 0.6));
  zoomOutBtn.addEventListener("click", () => setScale(scale - 0.6));
  zoomResetBtn.addEventListener("click", () => setScale(MIN_SCALE));

  // Mouse wheel zoom (desktop)
  mapViewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    setScale(scale + (e.deltaY < 0 ? 0.25 : -0.25), e.clientX, e.clientY);
  }, { passive: false });

  // Drag to pan once zoomed in
  let dragging = false, dragStartX = 0, dragStartY = 0, dragMoved = false;
  mapFrame.addEventListener("pointerdown", (e) => {
    if (scale <= MIN_SCALE || placing) return;
    dragging = true; dragMoved = false;
    dragStartX = e.clientX; dragStartY = e.clientY;
    mapFrame.setPointerCapture(e.pointerId);
    mapFrame.classList.add("dragging");
  });
  mapFrame.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
    panX += dx; panY += dy;
    dragStartX = e.clientX; dragStartY = e.clientY;
    clampPan();
    applyMapTransform();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    mapFrame.classList.remove("dragging");
    if (dragMoved) {
      justDragged = true;
      setTimeout(() => { justDragged = false; }, 50);
    }
  }
  mapFrame.addEventListener("pointerup", endDrag);
  mapFrame.addEventListener("pointercancel", endDrag);

  // Two-finger pinch to zoom (touchscreens)
  let pinchStartDist = null, pinchStartScale = 1;
  function touchDist(touches) {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
  mapViewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) { pinchStartDist = touchDist(e.touches); pinchStartScale = scale; }
  }, { passive: true });
  mapViewport.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && pinchStartDist) {
      e.preventDefault();
      const factor = touchDist(e.touches) / pinchStartDist;
      const t0 = e.touches[0], t1 = e.touches[1];
      setScale(pinchStartScale * factor, (t0.clientX + t1.clientX) / 2, (t0.clientY + t1.clientY) / 2);
    }
  }, { passive: false });
  mapViewport.addEventListener("touchend", () => { pinchStartDist = null; });

  const defaultPins = [
    { x: 72.7, y: 64.0, label: "Library — Level 2 quiet zone", mine: false },
    { x: 89.9, y: 56.9, label: "Group project sprint — ISC", mine: false },
    { x: 54.1, y: 74.7, label: "Python study — T10A", mine: false },
  ];
  let pins = loadJSON(KEY_PINS, defaultPins);
  // Make sure every pin has a stable id (older saved pins, from before pins
  // could be deleted, won't have one yet) so deletion can target the exact pin.
  let pinIdCounter = 0;
  pins = pins.map(p => p.id ? p : Object.assign({ id: `pin-${Date.now()}-${pinIdCounter++}` }, p));
  let placing = false;

  const PIN_BTN_DEFAULT = `<i class="bi bi-geo-alt"></i> Pin my study spot`;

  function deletePin(id) {
    pins = pins.filter(p => p.id !== id);
    renderPins();
    showToast("Pin removed from the map.");
  }

  function renderPins() {
    // Only the user's own pins ("mine") can be deleted — a small "x" on the
    // map marker and a matching remove button on its chip below the map.
    pinsLayer.innerHTML = pins.map(p => `
      <div class="pin ${p.mine ? 'mine' : ''}" style="left:${p.x}%; top:${p.y}%;" data-pin-id="${p.id}">
        <div class="pin-dot">
          <i class="bi bi-record-fill"></i>
          ${p.mine ? `<button type="button" class="pin-delete-btn" data-pin-id="${p.id}" aria-label="Delete this pin"><i class="bi bi-x-lg"></i></button>` : ""}
        </div>
        <div class="pin-tag">${escapeHtml(p.label)}</div>
      </div>
    `).join("");
    pinList.innerHTML = pins.map(p => `
      <span class="pin-chip ${p.mine ? 'mine' : ''}" data-pin-id="${p.id}">
        <i class="bi bi-geo-alt-fill"></i> ${escapeHtml(p.label)}
        ${p.mine ? `<button type="button" class="pin-chip-delete" data-pin-id="${p.id}" aria-label="Delete this pin"><i class="bi bi-x-lg"></i></button>` : ""}
      </span>
    `).join("");
    saveJSON(KEY_PINS, pins);

    pinsLayer.querySelectorAll(".pin-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("Delete this pin from the map?")) return;
        deletePin(btn.dataset.pinId);
      });
    });
    pinList.querySelectorAll(".pin-chip-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("Delete this pin from the map?")) return;
        deletePin(btn.dataset.pinId);
      });
    });
  }
  renderPins();

  pinBtn.addEventListener("click", () => {
    placing = !placing;
    pinBtn.classList.toggle("active", placing);
    mapViewport.classList.toggle("placing", placing);
    pinBtn.innerHTML = placing ? "Click the map to drop your pin…" : PIN_BTN_DEFAULT;
  });

  mapFrame.addEventListener("click", (e) => {
    if (!placing || justDragged) return;
    const rect = mapFrame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const label = prompt("What's happening here? (e.g. \"Recursion help — Lab 204\")", "Study session");
    if (label === null) return;
    pins.push({ id: `pin-${Date.now()}-${pinIdCounter++}`, x, y, label: label.slice(0, 40) || "Study session", mine: true });
    renderPins();
    placing = false;
    pinBtn.classList.remove("active");
    mapViewport.classList.remove("placing");
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
  // Upgrade any old plain-string replies saved before edit/delete/reactions existed.
  questions.forEach(q => { q.replies = CommentSystem.migrate(q.replies); });
  let qaNextId = Math.max(0, ...questions.map(q => q.id)) + 1;

  // "Replies" here are just comments on a question, so they reuse the same
  // shared CommentSystem markup/classes (.comment-list / .comment-form) that
  // feedback.js and peer-sharing.js use. "comments-light" switches the
  // shared styling to the light-background variant (see comments.css) since
  // this panel sits on a white card, not a coloured gradient one.
  function replyPanelHTML(q) {
    return `
    <div class="qa-reply-panel comments-light">
      <ul class="comment-list">${CommentSystem.renderList(q.replies)}</ul>
      <form class="comment-form">
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
        <span class="qa-subject">${escapeHtml(q.subject)}</span>
        <span class="qa-question">${escapeHtml(q.text)}</span>
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

      const replyPanel = item.querySelector(".qa-reply-panel");
      if (replyPanel) {
        CommentSystem.bind(replyPanel, q.replies, {
          onAdd: () => { renderQA(); showToast("Reply posted!"); },
          onEdit: () => { renderQA(); showToast("Reply updated!"); },
          onDelete: () => { renderQA(); showToast("Reply deleted."); },
          onReact: () => { renderQA(); },
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
