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

  const KEY_PROJECTS = "soc_peer_projects_v2";
  const KEY_POSTS = "soc_peer_posts_v2";

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

  // which comment panels are currently expanded (ephemeral, not persisted)
  const openComments = new Set();

  function commentPanelHTML(type, id, comments) {
    const list = comments.length
      ? comments.map(c => `<li>${escapeHtml(c)}</li>`).join("")
      : `<li class="comment-empty">No comments yet — be the first.</li>`;
    return `
    <div class="comment-panel" data-ctype="${type}" data-cid="${id}">
      <ul class="comment-list">${list}</ul>
      <form class="comment-form">
        <input type="text" placeholder="Add a comment…" maxlength="140" required>
        <button type="submit"><i class="bi bi-send"></i></button>
      </form>
    </div>`;
  }

  function bindCommentPanel(root, type, id, item, onChange) {
    const panel = root.querySelector(`.comment-panel[data-ctype="${type}"][data-cid="${id}"]`);
    if (!panel) return;
    panel.querySelector(".comment-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = e.target.querySelector("input");
      const text = input.value.trim();
      if (!text) return;
      item.comments.push(text);
      onChange();
    });
  }

  /* ================= Student Projects Showcase ================= */
  const defaultProjects = [
    {
      id: 1, title: "Wander — Trip Planner", tag: "React Native", author: "Priya K.",
      preview: `<img src="https://picsum.photos/seed/wander-app/500/300" alt="Wander app screens">`,
      github: "#", demo: "#", fives: 13, likes: 6, liked: false, fived: false, comments: [], pinned: false
    },
    {
      id: 2, title: "Skylight — Weather API", tag: "Node.js", author: "Marcus T.",
      preview: `<pre><span class="kw">import</span> fetch <span class="kw">from</span> <span class="str">'node-fetch'</span>;

<span class="kw">export async function</span> getForecast(city) {
  <span class="kw">const</span> res = <span class="kw">await</span> fetch(\`/api/\${city}\`);
  <span class="kw">return</span> res.json();
}</pre>`,
      github: "#", demo: "#", fives: 10, likes: 4, liked: false, fived: false, code: true, comments: [], pinned: false
    },
    {
      id: 3, title: "GradeGraph — Dashboard", tag: "Vue + D3", author: "Aisyah R.",
      preview: `<img src="https://picsum.photos/seed/gradegraph/500/300" alt="Dashboard preview">`,
      github: "#", demo: "#", fives: 12, likes: 9, liked: false, fived: false, comments: [], pinned: false
    },
    {
      id: 4, title: "QueueBot — Cafeteria Waitlist", tag: "Python · Flask", author: "Devon L.",
      preview: `<pre><span class="kw">class</span> Queue:
  <span class="kw">def</span> join(<span class="kw">self</span>, name):
    <span class="kw">self</span>.line.append(name)
    <span class="kw">return</span> <span class="str">f"You're #{len(self.line)}"</span></pre>`,
      github: "#", demo: "#", fives: 7, likes: 3, liked: false, fived: false, code: true, comments: [], pinned: false
    },
  ];

  let projects = loadJSON(KEY_PROJECTS, defaultProjects);
  const showcaseGrid = document.getElementById("showcaseGrid");

  function projectCardHTML(p) {
    const cid = `project-${p.id}`;
    return `
    <article class="project-card" data-id="${p.id}">
      <div class="project-preview ${p.code ? '' : 'screens'}">${p.preview}</div>
      <div class="project-body">
        <span class="project-tag">${p.tag}</span>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener"><i class="bi bi-github"></i> GitHub</a>
          <a href="${p.demo}" target="_blank" rel="noopener"><i class="bi bi-display"></i> Demo</a>
        </div>
        <div class="project-footer">
          <button class="highfive-btn" aria-label="High five">✋ ${p.fives}</button>
          <button class="like-btn ${p.liked ? 'liked' : ''}" aria-label="Like">${heartIcon(p.liked)} ${p.likes}</button>
          <button class="comment-btn-inline" aria-label="Comments"><i class="bi bi-chat-dots"></i> ${p.comments.length}</button>
          <button class="pin-toggle ${p.pinned ? 'pinned' : ''}" aria-label="Pin"><i class="bi ${p.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i></button>
        </div>
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

      card.querySelector(".highfive-btn").addEventListener("click", (e) => {
        if (p.fived) return;
        p.fived = true;
        p.fives += 1;
        e.target.closest(".highfive-btn").textContent = `✋ ${p.fives}`;
        e.target.closest(".highfive-btn").classList.add("popped");
        setTimeout(() => e.target.closest(".highfive-btn") && e.target.closest(".highfive-btn").classList.remove("popped"), 400);
        saveJSON(KEY_PROJECTS, projects);
      });

      card.querySelector(".like-btn").addEventListener("click", () => {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        renderShowcase();
      });

      card.querySelector(".comment-btn-inline").addEventListener("click", () => {
        if (openComments.has(cid)) openComments.delete(cid); else openComments.add(cid);
        renderShowcase();
      });

      card.querySelector(".pin-toggle").addEventListener("click", () => {
        p.pinned = !p.pinned;
        renderShowcase();
        renderPinnedList();
        showToast(p.pinned ? "Pinned to sidebar" : "Unpinned");
      });

      bindCommentPanel(card, "project", id, p, () => { renderShowcase(); showToast("Comment added!"); });
    });
  }
  renderShowcase();

  /* ================= Life Outside Classroom ================= */
  const defaultPosts = [
    { id: 1, tag: "Photo", title: "Study view at central cafe ☕", img: "https://picsum.photos/seed/central-cafe/400/300", likes: 24, comments: [], liked: false, pinned: false },
    { id: 2, tag: "Resource", title: "Best website for algorithm practice: LeetCode", likes: 31, comments: [], liked: false, textOnly: true, pinned: false },
    { id: 3, tag: "Rant", title: "Exam prep in Lab 204 hits different at 2am 😅", img: "https://picsum.photos/seed/lab204/400/320", likes: 19, comments: [], liked: false, pinned: false },
    { id: 4, tag: "Meme", title: "Me explaining my code to the rubber duck vs to my professor", img: "https://picsum.photos/seed/rubberduck/400/260", likes: 42, comments: [], liked: false, pinned: false },
    { id: 5, tag: "Resource", title: "Free mock interview practice: Pramp + Interviewing.io", likes: 27, comments: [], liked: false, textOnly: true, pinned: false },
    { id: 6, tag: "Life", title: "Finally beat my personal best at bouldering after finals 🧗", img: "https://picsum.photos/seed/bouldering/400/340", likes: 33, comments: [], liked: false, pinned: false },
  ];
  let posts = loadJSON(KEY_POSTS, defaultPosts);
  const lifeFeed = document.getElementById("lifeFeed");

  function feedCardHTML(p) {
    const cid = `post-${p.id}`;
    return `
    <article class="feed-card ${p.textOnly ? 'text-only' : ''}" data-id="${p.id}">
      ${p.img ? `<img class="feed-photo" src="${p.img}" alt="">` : ""}
      <div class="feed-body">
        <span class="feed-tag">${p.tag}</span>
        <p class="feed-title">${p.title}</p>
        <div class="feed-actions">
          <button class="like-toggle ${p.liked ? 'liked' : ''}">${heartIcon(p.liked)} ${p.likes}</button>
          <button class="comment-toggle"><i class="bi bi-chat-dots"></i> ${p.comments.length}</button>
          <button class="share-toggle"><i class="bi bi-share"></i></button>
          <button class="pin-toggle ${p.pinned ? 'pinned' : ''}" aria-label="Pin"><i class="bi ${p.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}"></i></button>
        </div>
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
      card.querySelector(".share-toggle").addEventListener("click", () => {
        showToast("Link copied to clipboard");
      });
      card.querySelector(".pin-toggle").addEventListener("click", () => {
        p.pinned = !p.pinned;
        renderFeed();
        renderPinnedList();
        showToast(p.pinned ? "Pinned to sidebar" : "Unpinned");
      });

      bindCommentPanel(card, "post", id, p, () => { renderFeed(); showToast("Comment added!"); });
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
        <span>${item.title}</span>
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

  /* ================= Composer ================= */
  let composerKind = null;
  let pendingImageData = null;
  const composerDetail = document.getElementById("composerDetail");
  const composerFileInput = document.getElementById("composerFileInput");
  const composerHint = document.getElementById("composerHint");

  function renderComposerDetail() {
    if (!composerKind) {
      composerDetail.hidden = true;
      composerDetail.innerHTML = "";
      return;
    }
    composerDetail.hidden = false;
    if (composerKind === "image") {
      composerDetail.innerHTML = pendingImageData
        ? `<div class="file-pick-row"><div class="image-preview"><img src="${pendingImageData}" alt=""><span>Photo attached</span></div></div>`
        : `<div class="file-pick-row"><button type="button" class="file-pick-btn" id="filePickBtn"><i class="bi bi-upload"></i> Choose a photo…</button></div>`;
      const btn = document.getElementById("filePickBtn");
      if (btn) btn.addEventListener("click", () => composerFileInput.click());
    } else if (composerKind === "github") {
      composerDetail.innerHTML = `<input type="url" class="url-input" id="composerUrl" placeholder="Paste your GitHub repo link…">`;
    } else if (composerKind === "demo") {
      composerDetail.innerHTML = `<input type="url" class="url-input" id="composerUrl" placeholder="Paste your live demo link…">`;
    }
  }

  document.querySelectorAll(".composer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isSame = composerKind === btn.dataset.kind;
      document.querySelectorAll(".composer-btn").forEach(b => b.classList.remove("selected"));
      composerKind = isSame ? null : btn.dataset.kind;
      pendingImageData = null;
      if (composerKind) btn.classList.add("selected");
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

    if (composerKind === "github" || composerKind === "demo") {
      const urlInput = document.getElementById("composerUrl");
      const url = urlInput ? urlInput.value.trim() : "";
      if (!text || !url) {
        composerHint.hidden = false;
        composerHint.textContent = "Add a project title and paste the link before posting.";
        return;
      }
      const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      projects.unshift({
        id: Date.now(),
        title: text,
        tag: "Community",
        author: "You",
        preview: genericProjectPreview(),
        github: composerKind === "github" ? fullUrl : "#",
        demo: composerKind === "demo" ? fullUrl : "#",
        fives: 0, likes: 0, liked: false, fived: false, comments: [], pinned: false
      });
      resetComposer();
      document.querySelector('.tab[data-tab="showcase"]').click();
      renderShowcase();
      showToast("Project posted to the Showcase!");
      return;
    }

    if (composerKind === "image") {
      if (!pendingImageData) {
        composerHint.hidden = false;
        composerHint.textContent = "Choose a photo to upload first.";
        return;
      }
      posts.unshift({
        id: Date.now(), tag: "Photo", title: text || "Untitled photo",
        img: pendingImageData, likes: 0, comments: [], liked: false, pinned: false
      });
      resetComposer();
      document.querySelector('.tab[data-tab="life"]').click();
      renderFeed();
      showToast("Posted to Life Outside Classroom!");
      return;
    }

    // No kind selected — plain text update
    if (!text) {
      composerHint.hidden = false;
      composerHint.textContent = "Write something first!";
      return;
    }
    posts.unshift({ id: Date.now(), tag: "Life", title: text, likes: 0, comments: [], liked: false, textOnly: true, pinned: false });
    resetComposer();
    document.querySelector('.tab[data-tab="life"]').click();
    renderFeed();
    showToast("Posted to Life Outside Classroom!");
  });

  function resetComposer() {
    document.getElementById("composerInput").value = "";
    document.querySelectorAll(".composer-btn").forEach(b => b.classList.remove("selected"));
    composerKind = null;
    pendingImageData = null;
    composerFileInput.value = "";
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
