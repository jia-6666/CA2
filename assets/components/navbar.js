export class Navbar extends HTMLElement {
  constructor() {
    super();
    this.currentPWD = window.location.pathname.replace("/", "");
    this.pages = [
      { href: "./", title: "Home" },
      { href: "./resource.html", title: "Resource" },
      { href: "./announcement.html", title: "Announcement" },
      { href: "./study-dashboard.html", title: "Study Dashboard" },
      { href: "./navigation.html", title: "Navigation" },
      { href: "./about.html", title: "About" },
      { href: "./peer-sharing.html", title: "Peer Sharing" },
      { href: "./peer-support.html", title: "Peer Support" },
      { href: "./cca.html", title: "CCA" },
      { href: "./contact.html", title: "Contact" },
      { href: "./feedback.html", title: "Feedback" },
      { href: "./login.html", title: "Login"}
    ];
    this.firstLayerLinks = [
      { href: "./", title: "Home" },
      {
        href: "./resource.html",
        title: "Resource",
        subLinks: [
          { href: "./announcement.html", title: "Announcement" },
          { href: "./study-dashboard.html", title: "Study Dashboard" },
          { href: "./navigation.html", title: "Navigation" }
        ]
      },
      {
        href: "./about.html",
        title: "About",
        subLinks: [
          { href: "./peer-sharing.html", title: "Peer Sharing" },
          { href: "./peer-support.html", title: "Peer Support" },
          { href: "./cca.html", title: "CCA" }
        ]
      },
      {
        href: "./contact.html",
        title: "Contact",
        subLinks: [
          { href: "./feedback.html", title: "Feedback" }
        ]
      }
    ];

    this.selectedIndex = -1;
  }

  async connectedCallback() {
    this.render();
    this.setupDesktopSearch();
    this.setupSearch("searchMobile", "mobileSearchOutput");

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        this.clearSearchResults("desktopSearchOutput");
        this.clearSearchResults("mobileSearchOutput");
      }
    });

    // Global Ctrl+K / Cmd+K listener
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        
        // Target desktop search if visible, otherwise mobile
        const desktopSearch = document.getElementById("searchDesktop");
        const mobileSearch = document.getElementById("searchMobile");
        
        const isDesktopVisible = window.getComputedStyle(desktopSearch.offsetParent || desktopSearch).display !== "none";
        const targetInput = isDesktopVisible ? desktopSearch : mobileSearch;

        if (targetInput) {
          targetInput.focus();
          targetInput.select(); // Select text if any exists
        }
      }
    });
  }

  setupDesktopSearch() {
    const input = document.getElementById("searchDesktop");
    const output = document.getElementById("desktopSearchOutput");
    if (!input || !output) return;

    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      this.selectedIndex = -1;
      output.replaceChildren();

      if (!query) {
        output.classList.remove("show");
        return;
      }

      const matches = this.pages.filter((page) =>
        page.title.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        matches.forEach((page) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.className = "dropdown-item py-2 px-3 fw-semibold search-item";
          a.href = page.href;
          a.textContent = page.title;
          li.appendChild(a);
          output.appendChild(li);
        });
        output.classList.add("show");
      } else {
        const li = document.createElement("li");
        li.className = "dropdown-item text-muted disabled py-2 px-3 fs-7";
        li.textContent = "No results found";
        output.appendChild(li);
        output.classList.add("show");
      }
    });

    input.addEventListener("keydown", (e) => {
      const items = output.querySelectorAll("a.search-item");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % items.length;
        this.updateActiveItem(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
        this.updateActiveItem(items);
      } else if (e.key === "Enter") {
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
          e.preventDefault();
          items[this.selectedIndex].click();
        }
      } else if (e.key === "Escape") {
        this.clearSearchResults("desktopSearchOutput");
        input.blur();
      }
    });
  }

  updateActiveItem(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add("active");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("active");
      }
    });
  }

  setupSearch(inputId, outputId) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    if (!input || !output) return;

    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      output.replaceChildren();

      if (!query) {
        output.classList.remove("show");
        return;
      }

      const matches = this.pages.filter((page) =>
        page.title.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        matches.forEach((page) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.className = "dropdown-item py-2 px-3 fw-semibold";
          a.href = page.href;
          a.textContent = page.title;
          li.appendChild(a);
          output.appendChild(li);
        });
        output.classList.add("show");
      } else {
        const li = document.createElement("li");
        li.className = "dropdown-item text-muted disabled py-2 px-3 fs-7";
        li.textContent = "No results found";
        output.appendChild(li);
        output.classList.add("show");
      }
    });
  }

  clearSearchResults(outputId) {
    const output = document.getElementById(outputId);
    if (output) {
      output.replaceChildren();
      output.classList.remove("show");
      this.selectedIndex = -1;
    }
  }

  isActive(targetHref) {
    const cleanTarget = targetHref.replace("./", "");
    if (!cleanTarget || cleanTarget === "index.html") {
      return this.currentPWD === "" || this.currentPWD === "index.html";
    }
    return this.currentPWD.includes(cleanTarget);
  }

  renderMobileLinks() {
    return this.firstLayerLinks
      .map((link, index) => {
        const activeClass = this.isActive(link.href) ? "text-decoration-underline" : "";
        const activeHref = this.isActive(link.href) ? "javascript:void(0)" : link.href;

        if (link.subLinks && link.subLinks.length > 0) {
          const subItemsHtml = link.subLinks
            .map((sub) => {
              const isSubActive = this.isActive(sub.href);
              return `<li class="py-1"><a class="nav-link fw-bold text-white ${isSubActive ? 'text-decoration-underline' : ''}" href="${isSubActive ? "javascript:void(0)" : sub.href}">${sub.title}</a></li>`;
            })
            .join("");

          return `
            <li class="nav-item">
              <div class="d-flex w-100">
                <a class="nav-link fw-bold text-white ${activeClass}" href="${activeHref}">${link.title}</a>
                <button class="btn btn-sm text-white shadow-none p-0 ms-2 flex-grow-1 text-end" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSubMenu-${index}" aria-expanded="false">
                  <i class="bi bi-chevron-down"></i>
                </button>
              </div>
              <div class="collapse ms-3" id="mobileSubMenu-${index}">
                <ul class="list-unstyled mb-2">
                  ${subItemsHtml}
                </ul>
              </div>
            </li>
          `;
        }

        return `<li class="nav-item"><a class="nav-link fw-bold text-white ${activeClass}" href="${activeHref}">${link.title}</a></li>`;
      })
      .join("");
  }

  renderDesktopLinks() {
    return this.firstLayerLinks
      .map((link) => {
        const activeClass = this.isActive(link.href) ? "text-decoration-underline" : "";
        const activeHref = this.isActive(link.href) ? "javascript:void(0)" : link.href;

        if (link.subLinks && link.subLinks.length > 0) {
          const subItemsHtml = link.subLinks
            .map((sub) => {
              const isSubActive = this.isActive(sub.href);
              return `<li><a class="dropdown-item fw-bold text-white ${isSubActive ? 'text-decoration-underline' : ''}" href="${isSubActive ? "javascript:void(0)" : sub.href}">${sub.title}</a></li>`;
            })
            .join("");

          return `
            <li class="nav-item dropdown dropdown-hover position-relative">
              <a class="nav-link fw-bold text-white ${activeClass}" href="${activeHref}">
                ${link.title}
              </a>
              <ul class="dropdown-menu border-0">
                ${subItemsHtml}
              </ul>
            </li>
          `;
        }

        return `<li class="nav-item"><a class="nav-link fw-bold text-white ${activeClass}" href="${activeHref}">${link.title}</a></li>`;
      })
      .join("");
  }

  render() {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

    this.innerHTML = `
      <link rel="stylesheet" href="./assets/styles/global.css" />
      <nav class="navbar navbar-expand-lg" id="mainNavbar" aria-label="Main Navigation">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold text-white" href="${this.currentPWD === "" ? "javascript:void(0)" : "./"}" aria-label="Home">School Of Computing</a>
          
          <div class="d-flex align-items-center gap-2 d-lg-none">
            <a href="${this.currentPWD.includes("login.html") ? "javascript:void(0)" : "./login.html"}" 
               class="profile-btn bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center text-decoration-none">
              <i class="bi bi-person fs-3"></i>
            </a>

            <button
              class="navbar-toggler border-0 shadow-none bg-white p-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>

          <div class="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">
            
            <!-- MOBILE LAYOUT -->
            <div class="d-flex flex-column d-lg-none w-100 mt-3">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 w-100 pe-3">
                ${this.renderMobileLinks()}
              </ul>

              <div class="search-box position-relative w-100 mt-2">
                <input
                  id="searchMobile"
                  class="form-control rounded-pill pe-5 border-0 shadow-none w-100"
                  type="search"
                  placeholder="Search pages..."
                  aria-label="Search"
                  autocomplete="off"
                />
                <button class="btn position-absolute end-0 top-50 translate-middle-y border-0 pe-3 text-secondary" type="button">
                  <i class="bi bi-search"></i>
                </button>
                <ul class="search-results-dropdown dropdown-menu w-100 mt-1 shadow border-0" id="mobileSearchOutput"></ul>
              </div>
            </div>

            <!-- DESKTOP LAYOUT -->
            <div class="d-none d-lg-flex justify-content-between align-items-center w-100 ms-lg-4">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center">${this.renderDesktopLinks()}</ul>
              
              <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
                <div class="search-box position-relative">
                  <input
                    id="searchDesktop"
                    class="form-control rounded-pill pe-5 border-0 shadow-none"
                    type="search"
                    placeholder="Search pages..."
                    aria-label="Search"
                    autocomplete="off"
                  />
                  <span class="position-absolute end-0 top-50 translate-middle-y me-3 badge bg-light text-muted border border-secondary-subtle font-monospace pointer-events-none">
                    ${shortcutLabel}
                  </span>
                  <ul class="search-results-dropdown dropdown-menu w-100 mt-1 shadow border-0" id="desktopSearchOutput"></ul>
                </div>

                <a href="${this.currentPWD.includes("login.html") ? "javascript:void(0)" : "./login.html"}" class="profile-btn text-white d-inline-flex align-items-center justify-content-center text-decoration-none">
                  <i class="bi bi-person fs-3"></i>
                </a>
              </div>
            </div>

          </div>
        </div>
      </nav>`;
  }
}

customElements.define("nav-bar", Navbar);