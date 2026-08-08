export class Navbar extends HTMLElement {
  constructor() {
    super();
    // Normalize path to clean relative filename (e.g., 'about.html' or '')
    this.currentPWD = window.location.pathname.split("/").pop();

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
        subLinks: [{ href: "./feedback.html", title: "Feedback" }]
      }
    ];
  }

  connectedCallback() {
    this.render();
  }

  // Pure Helper: Checks active path state
  isActive(targetHref) {
    const cleanTarget = targetHref.replace("./", "");
    if (!cleanTarget || cleanTarget === "index.html") {
      return this.currentPWD === "" || this.currentPWD === "index.html";
    }
    return this.currentPWD.includes(cleanTarget);
  }

  // Pure Helper: Returns template attributes for active vs inactive link
  getLinkProps(link) {
    const active = this.isActive(link.href);
    return {
      href: active ? "javascript:void(0)" : link.href,
      class: active ? "text-decoration-underline" : ""
    };
  }

  renderSubLinks(subLinks, isMobile = false) {
    if (!subLinks?.length) return "";

    return subLinks
      .map((sub) => {
        const props = this.getLinkProps(sub);
        const cssClass = isMobile
          ? `nav-link fw-bold text-white ${props.class}`
          : `dropdown-item fw-bold text-white ${props.class}`;

        return `<li><a class="${cssClass}" href="${props.href}">${sub.title}</a></li>`;
      })
      .join("");
  }

  renderNavItems(isMobile = false) {
    return this.firstLayerLinks
      .map((link, index) => {
        const props = this.getLinkProps(link);

        if (link.subLinks?.length) {
          const subItemsHtml = this.renderSubLinks(link.subLinks, isMobile);

          if (isMobile) {
            return `
              <li class="nav-item">
                <div class="d-flex w-100">
                  <a class="nav-link fw-bold text-white ${props.class}" href="${props.href}">${link.title}</a>
                  <button class="btn btn-sm text-white shadow-none p-0 ms-2 flex-grow-1 text-end" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSubMenu-${index}" aria-expanded="false">
                    <i class="bi bi-chevron-down"></i>
                  </button>
                </div>
                <div class="collapse ms-3" id="mobileSubMenu-${index}">
                  <ul class="list-unstyled mb-2">${subItemsHtml}</ul>
                </div>
              </li>`;
          }

          return `
            <li class="nav-item dropdown dropdown-hover position-relative">
              <a class="nav-link fw-bold text-white ${props.class}" href="${props.href}">${link.title}</a>
              <ul class="dropdown-menu border-0">${subItemsHtml}</ul>
            </li>`;
        }

        return `<li class="nav-item"><a class="nav-link fw-bold text-white ${props.class}" href="${props.href}">${link.title}</a></li>`;
      })
      .join("");
  }

  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const isLoginActive = this.isActive("./login.html");
    const isHomeActive = this.isActive("./");

    shadow.innerHTML = `
      <link rel="stylesheet" href="./assets/styles/global.css" />
      <nav class="navbar navbar-expand-lg" id="mainNavbar">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold text-white" href="${isHomeActive ? "javascript:void(0)" : "./"}">School Of Computing</a>
          
          <div class="d-flex align-items-center gap-2 d-lg-none">
            <a href="${isLoginActive ? "javascript:void(0)" : "./login.html"}" 
               class="profile-btn bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center text-decoration-none">
              <i class="bi bi-person fs-3"></i>
            </a>

            <button class="navbar-toggler border-0 shadow-none bg-white p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>

          <div class="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">
            <!-- MOBILE LAYOUT -->
            <div class="d-flex flex-column d-lg-none w-100 mt-3">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 w-100 pe-3">
                ${this.renderNavItems(true)}
              </ul>
              <div class="search-box position-relative w-100 mt-2">
                <input class="form-control rounded-pill pe-5 border-0 shadow-none w-100" type="search" placeholder="" aria-label="Search" />
                <button class="btn position-absolute end-0 top-50 translate-middle-y border-0 pe-3 text-secondary" type="submit">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>

            <!-- DESKTOP LAYOUT -->
            <div class="d-none d-lg-flex justify-content-between align-items-center w-100 ms-lg-4">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center">
                ${this.renderNavItems(false)}
              </ul>
              <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
                <div class="search-box position-relative">
                  <input class="form-control rounded-pill pe-5 border-0 shadow-none" type="search" placeholder="" aria-label="Search" />
                  <button class="btn position-absolute end-0 top-50 translate-middle-y border-0 pe-3 text-secondary" type="submit">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                <a href="${isLoginActive ? "javascript:void(0)" : "./login.html"}" class="profile-btn text-white d-inline-flex align-items-center justify-content-center text-decoration-none">
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