(() => {
  const toast = document.getElementById("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

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

  const KEY_PROJECTS = "soc_peer_projects_v1";
  const KEY_POSTS = "soc_peer_posts_v1";

  const heartIcon = (filled) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
    <path d="M12 21s-7.5-4.6-10-9.1C0.3 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.3 4.3 3.6 7.8C19.5 16.4 12 21 12 21z"/>
  </svg>`;

  /* ================= Tabs ================= */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-showcase").hidden = tab.dataset.tab !== "showcase";
      document.getElementById("panel-life").hidden = tab.dataset.tab !== "life";
    });
  });

  /* ================= Student Projects Showcase ================= */
  const defaultProjects = [
    {
      id: 1, title: "Wander — Trip Planner", tag: "React Native", author: "Priya K.",
      preview: `<img src="https://picsum.photos/seed/wander-app/500/300" alt="Wander app screens">`,
      github: "#", demo: "#", fives: 13, likes: 6, liked: false, fived: false
    },
    {
      id: 2, title: "Skylight — Weather API", tag: "Node.js", author: "Marcus T.",
      preview: `<pre><span class="kw">import</span> fetch <span class="kw">from</span> <span class="str">'node-fetch'</span>;

<span class="kw">export async function</span> getForecast(city) {
  <span class="kw">const</span> res = <span class="kw">await</span> fetch(\`/api/\${city}\`);
  <span class="kw">return</span> res.json();
}</pre>`,
      github: "#", demo: "#", fives: 10, likes: 4, liked: false, fived: false, code: true
    },
    {
      id: 3, title: "GradeGraph — Dashboard", tag: "Vue + D3", author: "Aisyah R.",
      preview: `<img src="https://picsum.photos/seed/gradegraph/500/300" alt="Dashboard preview">`,
      github: "#", demo: "#", fives: 12, likes: 9, liked: false, fived: false
    },
    {
      id: 4, title: "QueueBot — Cafeteria Waitlist", tag: "Python · Flask", author: "Devon L.",
      preview: `<pre><span class="kw">class</span> Queue:
  <span class="kw">def</span> join(<span class="kw">self</span>, name):
    <span class="kw">self</span>.line.append(name)
    <span class="kw">return</span> <span class="str">f"You're #{len(self.line)}"</span></pre>`,
      github: "#", demo: "#", fives: 7, likes: 3, liked: false, fived: false, code: true
    },
  ];

  let projects = loadJSON(KEY_PROJECTS, defaultProjects);
  const showcaseGrid = document.getElementById("showcaseGrid");

  function projectCardHTML(p) {
    return `
    <article class="project-card" data-id="${p.id}">
      <div class="project-preview ${p.code ? '' : 'screens'}">${p.preview}</div>
      <div class="project-body">
        <span class="project-tag">${p.tag}</span>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.9 5.3.9 11.6c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.1c-3.1.7-3.8-1.5-3.8-1.5-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.6.1-.6 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.1 5.3 18.3.5 12 .5z"/></svg>
            GitHub
          </a>
          <a href="${p.demo}" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21h6M12 17v4"/></svg>
            Demo
          </a>
        </div>
        <div class="project-footer">
          <button class="highfive-btn" aria-label="High five">✋ ${p.fives}</button>
          <button class="like-btn ${p.liked ? 'liked' : ''}" aria-label="Like">${heartIcon(p.liked)} ${p.likes}</button>
        </div>
      </div>
    </article>`;
  }

  function renderShowcase() {
    saveJSON(KEY_PROJECTS, projects);
    showcaseGrid.innerHTML = projects.map(projectCardHTML).join("");
    showcaseGrid.querySelectorAll(".project-card").forEach(card => {
      const id = Number(card.dataset.id);
      const p = projects.find(x => x.id === id);
      const fiveBtn = card.querySelector(".highfive-btn");
      fiveBtn.addEventListener("click", () => {
        if (p.fived) return;
        p.fived = true;
        p.fives += 1;
        fiveBtn.textContent = `✋ ${p.fives}`;
        fiveBtn.classList.add("popped");
        setTimeout(() => fiveBtn.classList.remove("popped"), 400);
        saveJSON(KEY_PROJECTS, projects);
      });
      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", () => {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        likeBtn.classList.toggle("liked", p.liked);
        likeBtn.innerHTML = `${heartIcon(p.liked)} ${p.likes}`;
        saveJSON(KEY_PROJECTS, projects);
      });
    });
  }
  renderShowcase();

  /* ================= Life Outside Classroom ================= */
  const defaultPosts = [
    { id: 1, tag: "Photo", title: "Study view at central cafe ☕", img: "https://picsum.photos/seed/central-cafe/400/300", likes: 24, comments: 5, liked: false },
    { id: 2, tag: "Resource", title: "Best website for algorithm practice: LeetCode", likes: 31, comments: 8, liked: false, textOnly: true },
    { id: 3, tag: "Rant", title: "Exam prep in Lab 204 hits different at 2am 😅", img: "https://picsum.photos/seed/lab204/400/320", likes: 19, comments: 11, liked: false },
    { id: 4, tag: "Meme", title: "Me explaining my code to the rubber duck vs to my professor", img: "https://picsum.photos/seed/rubberduck/400/260", likes: 42, comments: 14, liked: false },
    { id: 5, tag: "Resource", title: "Free mock interview practice: Pramp + Interviewing.io", likes: 27, comments: 6, liked: false, textOnly: true },
    { id: 6, tag: "Life", title: "Finally beat my personal best at bouldering after finals 🧗", img: "https://picsum.photos/seed/bouldering/400/340", likes: 33, comments: 9, liked: false },
  ];
  let posts = loadJSON(KEY_POSTS, defaultPosts);

  const lifeFeed = document.getElementById("lifeFeed");

  function feedCardHTML(p) {
    return `
    <article class="feed-card ${p.textOnly ? 'text-only' : ''}" data-id="${p.id}">
      ${p.img ? `<img class="feed-photo" src="${p.img}" alt="">` : ""}
      <div class="feed-body">
        <span class="feed-tag">${p.tag}</span>
        <p class="feed-title">${p.title}</p>
        <div class="feed-actions">
          <button class="like-toggle ${p.liked ? 'liked' : ''}">${heartIcon(p.liked)} ${p.likes}</button>
          <button class="comment-toggle">💬 ${p.comments}</button>
          <button class="share-toggle">↗ Share</button>
        </div>
      </div>
    </article>`;
  }

  function renderFeed() {
    saveJSON(KEY_POSTS, posts);
    lifeFeed.innerHTML = posts.map(feedCardHTML).join("");
    lifeFeed.querySelectorAll(".feed-card").forEach(card => {
      const id = Number(card.dataset.id);
      const p = posts.find(x => x.id === id);
      const likeBtn = card.querySelector(".like-toggle");
      likeBtn.addEventListener("click", () => {
        p.liked = !p.liked;
        p.likes += p.liked ? 1 : -1;
        likeBtn.classList.toggle("liked", p.liked);
        likeBtn.innerHTML = `${heartIcon(p.liked)} ${p.likes}`;
        saveJSON(KEY_POSTS, posts);
      });
      card.querySelector(".comment-toggle").addEventListener("click", () => {
        const text = prompt("Add a comment:");
        if (text && text.trim()) { p.comments += 1; renderFeed(); showToast("Comment added"); }
      });
      card.querySelector(".share-toggle").addEventListener("click", () => {
        showToast("Link copied to clipboard");
      });
    });
  }
  renderFeed();

  /* ================= Composer ================= */
  let composerKind = null;
  document.querySelectorAll(".composer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isSame = composerKind === btn.dataset.kind;
      document.querySelectorAll(".composer-btn").forEach(b => b.classList.remove("selected"));
      composerKind = isSame ? null : btn.dataset.kind;
      if (composerKind) btn.classList.add("selected");
    });
  });

  document.getElementById("composerPost").addEventListener("click", () => {
    const input = document.getElementById("composerInput");
    const text = input.value.trim();
    if (!text) { showToast("Write something first!"); return; }

    const tagMap = { image: "Photo", github: "Resource", demo: "Resource" };
    posts.unshift({
      id: Date.now(), tag: tagMap[composerKind] || "Life", title: text,
      img: composerKind === "image" ? "https://picsum.photos/seed/" + Date.now() + "/400/300" : null,
      likes: 0, comments: 0, liked: false, textOnly: composerKind !== "image"
    });
    input.value = "";
    document.querySelectorAll(".composer-btn").forEach(b => b.classList.remove("selected"));
    composerKind = null;
    document.querySelector('.tab[data-tab="life"]').click();
    renderFeed();
    showToast("Posted to Life Outside Classroom!");
  });

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
