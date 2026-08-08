/* =====================================================================
   comments.js — shared comment engine used by feedback.js, peer-support.js
   and peer-sharing.js.

   Why this file exists: all three pages had their own copy/paste comment
   list + comment form logic. Rather than tripling the new edit/delete/
   reactions/timestamp work, this file centralises it so every "comment"
   feature on the site (suggestion comments, Q&A replies, project
   comments, life-feed comments) behaves the same way and only needs to
   be fixed in one place.

   Public API (window.CommentSystem):
     - migrate(list)            upgrade old plain-string comment arrays
     - create(text)             build a new comment object
     - renderList(comments)     HTML string for the <ul class="comment-list">
     - bind(panelEl, comments, handlers)  wires up edit/delete/react/submit
     - EMOJIS                   the emoji reaction palette
   ===================================================================== */
(() => {
  // Emoji reaction palette — deliberately wider than a single "heart" so
  // people have Instagram-style freedom in how they react to a comment.
  const EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "🎉", "👏", "💯", "🙌", "😍"];

  function escapeHtml(str) {
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
      .map(([emo, n]) => `<button type="button" class="reaction-pill ${c.myReaction === emo ? "mine" : ""}" data-emo="${escapeHtml(emo)}">${emo} <b>${n}</b></button>`)
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
      <p class="comment-text">${escapeHtml(c.text)}</p>
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
    const fire = (type) => (handlers[type] || handlers.onChange || (() => {}))();

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

  window.CommentSystem = { EMOJIS, escapeHtml, timeAgo, migrate, create, renderList, bind, floodEffect };
})();
