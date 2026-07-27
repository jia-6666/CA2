export class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.currentPWD = window.location.pathname.replace("/", "");
    this.firstLayerLinks = [
      {
        href: "./",
        title: "Home"
      },
      {
        href: "./resource.html",
        title: "Resource",
        subLinks: [
          {
            href: "./study-tools.html",
            title: "Study Tools"
          }
        ]
      },
      {
        href: "./about.html",
        title: "About",
        subLinks: [
          {
            href: "./peer-sharing.html",
            title: "Peer Sharing"
          },
          {
            href: "./peer-support.html",
            title: "Peer Support"
          }
        ]
      },
      {
        href: "./contact.html",
        title: "Contact",
        subLinks: [
          {
            href: "./feedback.html",
            title: "Feedback"
          }
        ]
      },
    ];
    this.renderLinks = this.firstLayerLinks
      .map((link) => {
        console.log(this.currentPWD, this.currentPWD.length);
        return this.currentPWD.includes(link.href)
          ? `<li class="nav-item"><a class="nav-link fw-bold text-decoration-underline">${link.title}</a></li>` // current page, insert underline
          : `<li class="nav-item"><a class="nav-link fw-bold" href="${link.href}">${link.title}</a></li>`; // not current page insert link
      })
      .join("");
  }

  async connectedCallback() {
    // 2. Build DOM content synchronously once styles are ready
    this.render();
  }

  // Generates mobile-specific links (with accordion-style toggle arrow for sub-links)
  renderMobileLinks() {
    return this.firstLayerLinks
      .map((link, index) => {
        const isActive = this.currentPWD === "" ? link.href === "/" : (link.href !== "/" && this.currentPWD.includes(link.href));
        const activeClass = isActive ? "text-decoration-underline" : "";

        if (link.subLinks && link.subLinks.length > 0) {
          const subItemsHtml = link.subLinks
            .map((sub) => {
              const isSubActive = this.currentPWD.includes(sub.href);
              return `<li class="py-1"><a class="nav-link fw-bold text-white ${isSubActive ? 'text-decoration-underline' : ''}" href="${sub.href}">${sub.title}</a></li>`;
            })
            .join("");

          return `
            <li class="nav-item">
              <div class="d-flex align-items-center justify-content-between">
                <a class="nav-link fw-bold text-white ${activeClass}" href="${link.href}">${link.title}</a>
                <button class="btn btn-sm text-white shadow-none p-0 ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSubMenu-${index}" aria-expanded="false">
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

        return `<li class="nav-item"><a class="nav-link fw-bold text-white ${activeClass}" href="${link.href}">${link.title}</a></li>`;
      })
      .join("");
  }

  // Generates desktop-specific links (with hover dropdown menus)
  renderDesktopLinks() {
    return this.firstLayerLinks
      .map((link) => {
        const isActive = this.currentPWD === "" ? link.href === "/" : (link.href !== "/" && this.currentPWD.includes(link.href));
        const activeClass = isActive ? "text-decoration-underline" : "";

        if (link.subLinks && link.subLinks.length > 0) {
          const subItemsHtml = link.subLinks
            .map((sub) => {
              const isSubActive = this.currentPWD.includes(sub.href);
              return `<li><a class="dropdown-item fw-bold text-white ${isSubActive ? 'text-decoration-underline' : ''}" href="${sub.href}">${sub.title}</a></li>`;
            })
            .join("");

          return `
            <li class="nav-item dropdown dropdown-hover position-relative">
              <a class="nav-link fw-bold text-white ${activeClass}" href="${link.href}">
                ${link.title}
              </a>
              <ul class="dropdown-menu border-0">
                ${subItemsHtml}
              </ul>
            </li>
          `;
        }

        return `<li class="nav-item"><a class="nav-link fw-bold text-white ${activeClass}" href="${link.href}">${link.title}</a></li>`;
      })
      .join("");
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="./assets/styles/global.css" />
      <nav class="navbar navbar-expand-lg" id="mainNavbar">
        <div class="container-fluid">
          <!-- Brand / Logo (Stays Left) -->
          <a class="navbar-brand fw-bold" href="${this.currentPWD == "" ? "javascript:void(0)" : "./"}">School Of Computing</a>
          <!-- Mobile Toggler -->
          <button
            class="navbar-toggler border-0 shadow-none bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <!-- Collapsible Content -->
          <div class="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">
            
            <!-- START MOBILE LAYOUT -->
            <div class="d-flex flex-column d-lg-none w-100 mt-3">
              <div class="d-flex justify-content-between align-items-start w-100">
                <!-- Mobile Links -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 w-100 pe-3">
                  ${this.renderMobileLinks()}
                </ul>

                <!-- Mobile Profile Icon Button -->
                <a href="${this.currentPWD.includes("login.html") ? "javascript:void(0)" : "./login.html"}" class="profile-btn text-white d-inline-flex align-items-center justify-content-center text-decoration-none">
                  <i class="bi bi-person fs-4"></i>
                </a>
              </div>

              <!-- Mobile Search Bar -->
              <div class="search-box position-relative w-100 mt-2">
                <input
                  class="form-control rounded-pill pe-5 border-0 shadow-none w-100"
                  type="search"
                  placeholder=""
                  aria-label="Search"
                />
                <button
                  class="btn position-absolute end-0 top-50 translate-middle-y border-0 pe-3 text-secondary"
                  type="submit"
                >
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            <!-- END MOBILE LAYOUT -->

            <!-- START DESKTOP LAYOUT -->
            <div class="d-none d-lg-flex justify-content-between align-items-center w-100 ms-lg-4">
              <!-- Nav Links (mx-auto centers these links visually) -->
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center">${this.renderDesktopLinks()}</ul>
              <!-- Right Side Controls (Stays Right) -->
              <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
                
                <!-- Search BAR -->
                <div class="search-box position-relative">
                  <input
                    class="form-control rounded-pill pe-5 border-0 shadow-none"
                    type="search"
                    placeholder=""
                    aria-label="Search"
                    />
                  <button
                    class="btn position-absolute end-0 top-50 translate-middle-y border-0 pe-3 text-secondary" 
                    type="submit">
                    <i class="bi bi-search"></i>
                  </button>
                </div>

                <!-- User Profile Icon Button -->
                <a href="${this.currentPWD.includes("login.html") ? "javascript:void(0)" : "./login.html"}" class="profile-btn text-white d-inline-flex align-items-center justify-content-center text-decoration-none">
                  <i class="bi bi-person fs-4"></i>
                </a>

            </div>
            <!-- END DESKTOP LAYOUT -->
          </div>
        </div>
      </div>
    </nav>`;
  }
}

customElements.define("nav-bar", NavbarComponent);
