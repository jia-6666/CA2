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
     local module (`CommentSystem`) so the rest of the file below reads
     exactly the same as before.

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

  const KEY_PROJECTS = "soc_peer_projects_v3";
  const KEY_POSTS = "soc_peer_posts_v3";

  const heartIcon = (filled) => `<i class="bi ${filled ? 'bi-heart-fill' : 'bi-heart'}"></i>`;

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

  /* ================= Tabs ================= */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-showcase").hidden = tab.dataset.tab !== "showcase";
      document.getElementById("panel-life").hidden = tab.dataset.tab !== "life";
    });
  });

  /* ================= Lightbox (click an image to enlarge it) =================
     Delegated on document so it keeps working after every re-render — no need
     to re-bind listeners each time a card is redrawn. */
  const lightboxOverlay = document.getElementById("lightboxOverlay");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Enlarged image";
    lightboxOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightboxOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxOverlay.addEventListener("click", (e) => { if (e.target === lightboxOverlay) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".feed-photo, .project-preview img");
    if (img) openLightbox(img.src, img.alt);
  });

  // which comment panels are currently expanded (ephemeral, not persisted)
  const openComments = new Set();

  // Comment panel markup + interaction (add / edit / delete / emoji react)
  // is shared across both sections of this page via the CommentSystem above.
  function commentPanelHTML(type, id, comments) {
    return `
    <div class="comment-panel" data-ctype="${type}" data-cid="${id}">
      <ul class="comment-list">${CommentSystem.renderList(comments)}</ul>
      <form class="comment-form">
        <input type="text" placeholder="Add a comment…" maxlength="140" required>
        <button type="submit"><i class="bi bi-send"></i></button>
      </form>
    </div>`;
  }

  // Wires a rendered comment panel up to CommentSystem. `onAdd`/`onEdit`/etc
  // let each caller decide how to re-render + toast after each kind of change.
  function bindCommentPanel(root, type, id, item, handlers) {
    const panel = root.querySelector(`.comment-panel[data-ctype="${type}"][data-cid="${id}"]`);
    if (!panel) return;
    CommentSystem.bind(panel, item.comments, handlers);
  }

  /* ================= Standardised reaction row =================
     Used by BOTH the Student Projects Showcase and the Life Outside
     Classroom cards: like, comment, copy-link (only if the post actually
     has a link attached), and pin. No "raise hands" button anymore. */
  function reactionsRowHTML(item, cid) {
    return `
    <div class="feed-actions">
      <button class="like-toggle ${item.liked ? 'liked' : ''}" aria-label="Like">${heartIcon(item.liked)} ${item.likes}</button>
      <button class="comment-toggle" aria-label="Comments"><i class="bi bi-chat-dots"></i> ${item.comments.length}</button>
      ${item.linkUrl ? `<button class="copylink-btn" data-link="${escapeHtml(item.linkUrl)}" aria-label="Copy link"><i class="bi bi-link-45deg"></i></button>` : ""}
      <button class="pin-toggle ${item.pinned ? 'pinned' : ''}" aria-label="Pin"><i class="bi ${item.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i></button>
    </div>`;
  }

  // Small edit/delete controls shown only on posts the current "user" made.
  function ownerControlsHTML() {
    return `
    <div class="owner-controls">
      <button type="button" class="owner-edit-btn" aria-label="Edit post"><i class="bi bi-pencil"></i></button>
      <button type="button" class="owner-delete-btn" aria-label="Delete post"><i class="bi bi-trash3"></i></button>
    </div>`;
  }

  function copyLinkToClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast("Link copied to clipboard"),
        () => showToast("Couldn't copy — link: " + url)
      );
    } else {
      showToast("Link copied to clipboard");
    }
  }

  /* ================= Student Projects Showcase ================= */
  const defaultProjects = [
    {
      id: 1, title: "Wander — Trip Planner", tag: "React Native", author: "Priya K.",
      preview: `<img src="https://picsum.photos/seed/wander-app/500/300" alt="Wander app screens">`,
      linkType: null, linkUrl: null, likes: 6, liked: false, comments: [], pinned: false, isOwn: false
    },
    {
      id: 2, title: "Skylight — Weather API", tag: "Node.js", author: "Marcus T.",
      preview: `<pre><span class="kw">import</span> fetch <span class="kw">from</span> <span class="str">'node-fetch'</span>;

<span class="kw">export async function</span> getForecast(city) {
  <span class="kw">const</span> res = <span class="kw">await</span> fetch(\`/api/\${city}\`);
  <span class="kw">return</span> res.json();
}</pre>`,
      linkType: null, linkUrl: null, likes: 4, liked: false, code: true, comments: [], pinned: false, isOwn: false
    },
    {
      id: 3, title: "GradeGraph — Dashboard", tag: "Vue + D3", author: "Aisyah R.",
      preview: `<img src="https://picsum.photos/seed/gradegraph/500/300" alt="Dashboard preview">`,
      linkType: null, linkUrl: null, likes: 9, liked: false, comments: [], pinned: false, isOwn: false
    },
    {
      id: 4, title: "QueueBot — Cafeteria Waitlist", tag: "Python · Flask", author: "Devon L.",
      preview: `<pre><span class="kw">class</span> Queue:
  <span class="kw">def</span> join(<span class="kw">self</span>, name):
    <span class="kw">self</span>.line.append(name)
    <span class="kw">return</span> <span class="str">f"You're #{len(self.line)}"</span></pre>`,
      linkType: null, linkUrl: null, likes: 3, liked: false, code: true, comments: [], pinned: false, isOwn: false
    },
  ];

  let projects = loadJSON(KEY_PROJECTS, defaultProjects);
  // Upgrade any old plain-string comments saved before edit/delete/reactions existed.
  projects.forEach(p => { p.comments = CommentSystem.migrate(p.comments); });
  const showcaseGrid = document.getElementById("showcaseGrid");

  function projectCardHTML(p) {
    const cid = `project-${p.id}`;
    const linkBtn = p.linkUrl
      ? `<a class="project-link-btn" href="${escapeHtml(p.linkUrl)}" target="_blank" rel="noopener">
          <i class="bi ${p.linkType === 'github' ? 'bi-github' : 'bi-display'}"></i> ${p.linkType === 'github' ? 'View on GitHub' : 'View Demo'}
        </a>`
      : "";
    return `
    <article class="project-card" data-id="${p.id}">
      ${p.isOwn ? ownerControlsHTML() : ""}
      <div class="project-preview ${p.code ? '' : 'screens'}">${p.preview}</div>
      <div class="project-body">
        <span class="project-tag">${p.tag}</span>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        ${linkBtn}
        ${reactionsRowHTML(p, cid)}
        ${openComments.has(cid) ? commentPanelHTML("project", p.id, p.comments) : ""}
      </div>
    </article>`;
  }

  function renderShowcase() {
    saveJSON(KEY_PROJECTS, projects);
    showcaseGrid.innerHTML = projects.map(projectCardHTML).join("");
    showcaseGrid.querySelectorAll(".project-card").forEach(card => {
      const id = Number(card.dataset.id);
      const p = projects.find(x => x.id === id);
      const cid = `project-${id}`;

      card.querySelector(".like-toggle").addEventListener("click", () => {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        renderShowcase();
      });

      card.querySelector(".comment-toggle").addEventListener("click", () => {
        if (openComments.has(cid)) openComments.delete(cid); else openComments.add(cid);
        renderShowcase();
      });

      const copyBtn = card.querySelector(".copylink-btn");
      if (copyBtn) copyBtn.addEventListener("click", () => copyLinkToClipboard(copyBtn.dataset.link));

      card.querySelector(".pin-toggle").addEventListener("click", () => {
        p.pinned = !p.pinned;
        renderShowcase();
        renderPinnedList();
        showToast(p.pinned ? "Pinned to sidebar" : "Unpinned");
      });

      const editBtn = card.querySelector(".owner-edit-btn");
      if (editBtn) editBtn.addEventListener("click", () => {
        const updated = prompt("Edit your project title:", p.title);
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        p.title = trimmed;
        renderShowcase();
        showToast("Project updated!");
      });
      const deleteBtn = card.querySelector(".owner-delete-btn");
      if (deleteBtn) deleteBtn.addEventListener("click", () => {
        if (!confirm("Delete this project post? This can't be undone.")) return;
        projects = projects.filter(x => x.id !== id);
        renderShowcase();
        renderPinnedList();
        showToast("Project deleted.");
      });

      bindCommentPanel(card, "project", id, p, {
        onAdd: () => { renderShowcase(); showToast("Comment added!"); },
        onEdit: () => { renderShowcase(); showToast("Comment updated!"); },
        onDelete: () => { renderShowcase(); showToast("Comment deleted."); },
        onReact: () => { renderShowcase(); },
      });
    });
  }
  renderShowcase();

  /* ================= Life Outside Classroom ================= */
  const defaultPosts = [
    { id: 1, tag: "Photo", title: "Study view at central cafe ☕", img: "https://picsum.photos/seed/central-cafe/400/300", linkType: null, linkUrl: null, likes: 24, comments: [], liked: false, pinned: false, isOwn: false },
    { id: 2, tag: "Resource", title: "Best website for algorithm practice: LeetCode", linkType: null, linkUrl: null, likes: 31, comments: [], liked: false, textOnly: true, pinned: false, isOwn: false },
    { id: 3, tag: "Rant", title: "Exam prep in Lab 204 hits different at 2am 😅", img: "https://picsum.photos/seed/lab204/400/320", linkType: null, linkUrl: null, likes: 19, comments: [], liked: false, pinned: false, isOwn: false },
    { id: 4, tag: "Meme", title: "Me explaining my code to the rubber duck vs to my professor", img: "https://picsum.photos/seed/rubberduck/400/260", linkType: null, linkUrl: null, likes: 42, comments: [], liked: false, pinned: false, isOwn: false },
    { id: 5, tag: "Resource", title: "Free mock interview practice: Pramp + Interviewing.io", linkType: null, linkUrl: null, likes: 27, comments: [], liked: false, textOnly: true, pinned: false, isOwn: false },
    { id: 6, tag: "Life", title: "Finally beat my personal best at bouldering after finals 🧗", img: "https://picsum.photos/seed/bouldering/400/340", linkType: null, linkUrl: null, likes: 33, comments: [], liked: false, pinned: false, isOwn: false },
  ];
  let posts = loadJSON(KEY_POSTS, defaultPosts);
  // Upgrade any old plain-string comments saved before edit/delete/reactions existed.
  posts.forEach(p => { p.comments = CommentSystem.migrate(p.comments); });
  const lifeFeed = document.getElementById("lifeFeed");

  function feedCardHTML(p) {
    const cid = `post-${p.id}`;
    const linkBtn = p.linkUrl
      ? `<a class="feed-link-btn" href="${escapeHtml(p.linkUrl)}" target="_blank" rel="noopener">
          <i class="bi ${p.linkType === 'github' ? 'bi-github' : 'bi-display'}"></i> ${p.linkType === 'github' ? 'View on GitHub' : 'View Demo'}
        </a>`
      : "";
    // No image → keep the card compact (no reserved empty photo space).
    const noImage = !p.img;
    return `
    <article class="feed-card ${p.textOnly || noImage ? 'text-only' : ''} ${noImage ? 'no-image' : ''}" data-id="${p.id}">
      ${p.isOwn ? ownerControlsHTML() : ""}
      ${p.img ? `<img class="feed-photo" src="${p.img}" alt="">` : ""}
      <div class="feed-body">
        <span class="feed-tag">${p.tag}</span>
        <p class="feed-title">${escapeHtml(p.title)}</p>
        ${linkBtn}
        ${reactionsRowHTML(p, cid)}
        ${openComments.has(cid) ? commentPanelHTML("post", p.id, p.comments) : ""}
      </div>
    </article>`;
  }

  function renderFeed() {
    saveJSON(KEY_POSTS, posts);
    lifeFeed.innerHTML = posts.map(feedCardHTML).join("");
    lifeFeed.querySelectorAll(".feed-card").forEach(card => {
      const id = Number(card.dataset.id);
      const p = posts.find(x => x.id === id);
      const cid = `post-${id}`;

      card.querySelector(".like-toggle").addEventListener("click", () => {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        renderFeed();
      });
      card.querySelector(".comment-toggle").addEventListener("click", () => {
        if (openComments.has(cid)) openComments.delete(cid); else openComments.add(cid);
        renderFeed();
      });
      const copyBtn = card.querySelector(".copylink-btn");
      if (copyBtn) copyBtn.addEventListener("click", () => copyLinkToClipboard(copyBtn.dataset.link));

      card.querySelector(".pin-toggle").addEventListener("click", () => {
        p.pinned = !p.pinned;
        renderFeed();
        renderPinnedList();
        showToast(p.pinned ? "Pinned to sidebar" : "Unpinned");
      });

      const editBtn = card.querySelector(".owner-edit-btn");
      if (editBtn) editBtn.addEventListener("click", () => {
        const updated = prompt("Edit your post:", p.title);
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        p.title = trimmed;
        renderFeed();
        showToast("Post updated!");
      });
      const deleteBtn = card.querySelector(".owner-delete-btn");
      if (deleteBtn) deleteBtn.addEventListener("click", () => {
        if (!confirm("Delete this post? This can't be undone.")) return;
        posts = posts.filter(x => x.id !== id);
        renderFeed();
        renderPinnedList();
        showToast("Post deleted.");
      });

      bindCommentPanel(card, "post", id, p, {
        onAdd: () => { renderFeed(); showToast("Comment added!"); },
        onEdit: () => { renderFeed(); showToast("Comment updated!"); },
        onDelete: () => { renderFeed(); showToast("Comment deleted."); },
        onReact: () => { renderFeed(); },
      });
    });
  }
  renderFeed();

  /* ================= Pinned sidebar list ================= */
  const pinnedList = document.getElementById("pinnedList");
  function renderPinnedList() {
    const pinnedProjects = projects.filter(p => p.pinned).map(p => ({ type: "project", id: p.id, title: p.title }));
    const pinnedPosts = posts.filter(p => p.pinned).map(p => ({ type: "post", id: p.id, title: p.title }));
    const all = [...pinnedProjects, ...pinnedPosts];

    pinnedList.innerHTML = all.map(item => `
      <li>
        <i class="bi bi-pin-angle-fill"></i>
        <span>${escapeHtml(item.title)}</span>
        <button data-type="${item.type}" data-id="${item.id}" aria-label="Unpin"><i class="bi bi-x-lg"></i></button>
      </li>
    `).join("");

    pinnedList.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        const id = Number(btn.dataset.id);
        if (type === "project") {
          const p = projects.find(x => x.id === id);
          if (p) p.pinned = false;
          renderShowcase();
        } else {
          const p = posts.find(x => x.id === id);
          if (p) p.pinned = false;
          renderFeed();
        }
        renderPinnedList();
      });
    });
  }
  renderPinnedList();

  /* ================= Composer =================
     Users can now attach an image AND a link (GitHub or Project Demo) to the
     same post, and choose whether it goes to the Student Projects Showcase
     or Life Outside Classroom. */
  let composerHasImage = false;
  let composerLinkType = null; // 'github' | 'demo' | null — mutually exclusive with each other, independent of image
  let pendingImageData = null;
  // Kept in JS (not just the DOM) because toggling the image option on/off
  // re-renders the whole composer-detail block, which would otherwise wipe
  // out whatever the user already typed into the link field.
  let pendingUrlValue = "";
  const composerDetail = document.getElementById("composerDetail");
  const composerFileInput = document.getElementById("composerFileInput");
  const composerHint = document.getElementById("composerHint");
  const composerDest = document.getElementById("composerDest");

  function renderComposerDetail() {
    const parts = [];

    if (composerHasImage) {
      parts.push(pendingImageData
        ? `<div class="file-pick-row"><div class="image-preview"><img src="${pendingImageData}" alt=""><span>Photo attached</span><button type="button" class="remove-chip" id="removeImageBtn" aria-label="Remove photo"><i class="bi bi-x-lg"></i></button></div></div>`
        : `<div class="file-pick-row"><button type="button" class="file-pick-btn" id="filePickBtn"><i class="bi bi-upload"></i> Choose a photo…</button></div>`);
    }
    if (composerLinkType) {
      parts.push(`<input type="url" class="url-input" id="composerUrl" placeholder="${composerLinkType === 'github' ? 'Paste your GitHub repo link…' : 'Paste your live demo link…'}" value="${escapeHtml(pendingUrlValue)}">`);
    }

    if (!parts.length) {
      composerDetail.hidden = true;
      composerDetail.innerHTML = "";
      return;
    }
    composerDetail.hidden = false;
    composerDetail.innerHTML = parts.join("");

    const pickBtn = document.getElementById("filePickBtn");
    if (pickBtn) pickBtn.addEventListener("click", () => composerFileInput.click());
    const removeBtn = document.getElementById("removeImageBtn");
    if (removeBtn) removeBtn.addEventListener("click", () => {
      pendingImageData = null;
      composerFileInput.value = "";
      renderComposerDetail();
    });
    const urlInput = document.getElementById("composerUrl");
    if (urlInput) urlInput.addEventListener("input", () => { pendingUrlValue = urlInput.value; });
  }

  document.querySelectorAll(".composer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.kind;
      if (kind === "image") {
        composerHasImage = !composerHasImage;
        if (!composerHasImage) pendingImageData = null;
        btn.classList.toggle("selected", composerHasImage);
      } else {
        // GitHub / Demo are mutually exclusive with each other, but independent of the image toggle.
        composerLinkType = composerLinkType === kind ? null : kind;
        if (!composerLinkType) pendingUrlValue = "";
        document.querySelectorAll('.composer-btn[data-kind="github"], .composer-btn[data-kind="demo"]').forEach(b => {
          b.classList.toggle("selected", b.dataset.kind === composerLinkType);
        });
      }
      renderComposerDetail();
    });
  });

  composerFileInput.addEventListener("change", () => {
    const file = composerFileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingImageData = reader.result;
      renderComposerDetail();
    };
    reader.readAsDataURL(file);
  });

  function genericProjectPreview() {
    return `<div class="project-preview screens" style="align-items:center;justify-content:center;">
      <i class="bi bi-code-square" style="font-size:40px;color:rgba(255,255,255,.85);"></i>
    </div>`;
  }

  document.getElementById("composerPost").addEventListener("click", () => {
    const input = document.getElementById("composerInput");
    const text = input.value.trim();
    composerHint.hidden = true;

    if (!text) {
      composerHint.hidden = false;
      composerHint.textContent = "Write something first!";
      return;
    }
    if (composerHasImage && !pendingImageData) {
      composerHint.hidden = false;
      composerHint.textContent = "Choose a photo, or turn off the image option.";
      return;
    }

    let fullUrl = null;
    if (composerLinkType) {
      const urlInput = document.getElementById("composerUrl");
      const url = urlInput ? urlInput.value.trim() : "";
      if (!url) {
        composerHint.hidden = false;
        composerHint.textContent = "Paste your link, or turn off the link option.";
        return;
      }
      fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }

    const dest = composerDest.value; // 'showcase' | 'life'

    if (dest === "showcase") {
      projects.unshift({
        id: Date.now(),
        title: text,
        tag: "Community",
        author: "You",
        preview: pendingImageData ? `<img src="${pendingImageData}" alt="">` : genericProjectPreview(),
        linkType: composerLinkType, linkUrl: fullUrl,
        likes: 0, liked: false, comments: [], pinned: false, isOwn: true
      });
      resetComposer();
      document.querySelector('.tab[data-tab="showcase"]').click();
      renderShowcase();
      showToast("Project posted to the Showcase!");
      return;
    }

    posts.unshift({
      id: Date.now(),
      tag: pendingImageData ? "Photo" : "Life",
      title: text,
      img: pendingImageData || null,
      linkType: composerLinkType, linkUrl: fullUrl,
      likes: 0, comments: [], liked: false, pinned: false, isOwn: true
    });
    resetComposer();
    document.querySelector('.tab[data-tab="life"]').click();
    renderFeed();
    showToast("Posted to Life Outside Classroom!");
  });

  function resetComposer() {
    document.getElementById("composerInput").value = "";
    document.querySelectorAll(".composer-btn").forEach(b => b.classList.remove("selected"));
    composerHasImage = false;
    composerLinkType = null;
    pendingImageData = null;
    pendingUrlValue = "";
    composerFileInput.value = "";
    composerDest.value = "life";
    renderComposerDetail();
  }

  /* ================= Leaderboard ================= */
  const leaderboard = document.getElementById("leaderboard");
  const lbData = [
    { name: "Priya K.", count: 18 },
    { name: "Marcus T.", count: 14 },
    { name: "Aisyah R.", count: 11 },
    { name: "Devon L.", count: 8 },
  ];
  leaderboard.innerHTML = lbData.map((p, i) => `
    <li><span class="rank">${i + 1}</span><span class="lb-name">${p.name}</span><span class="lb-count">${p.count} shares</span></li>
  `).join("");
})();
