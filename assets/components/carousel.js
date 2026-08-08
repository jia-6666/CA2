export class Carousel extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
    this.direction = 1;
    this.autoScrollTimer = null;
    this.pauseTimeout = null;
    this.pauseTime = 3000;
    this.slideDuration = 2000;
    this._db = null;
    this.items = [];

    this.shadowRootRef = this.attachShadow({ mode: 'open' });
    this.className = "carousel";
    this.id = "carousel";

    // Bind event callbacks
    this.scrollToNext = this.scrollToNext.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
  }

  // Reactive DB setter to trigger render when assigned externally
  get db() {
    return this._db;
  }

  set db(databaseInstance) {
    this._db = databaseInstance;
    if (this.isConnected) {
      this.initAndRender();
    }
  }

  generateChildElements(announcements = []) {
    if (!announcements.length) {
      return `<slot></slot>`;
    }

    return announcements
      .map((announcement) => `
        <figure class="item" data-id="${announcement.id}">
          <div class="details">
          <figcaption>${announcement.title}</figcaption> 
          ${announcement.organizer ? `<span>Organizer: ${announcement.organizer}</span>` : ''}
          ${announcement.description ? `<p class="mb-2 line-clamp-3">${announcement.description}</p>` : ''}
          ${announcement.location ? `<p class="mb-1"><strong>Location:</strong> ${announcement.location}</p>` : ''}
          ${announcement.time ? `<p class="mb-1"><strong>Time:</strong> ${new Date(announcement.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
          ${announcement.itinerary ? `<p class="mb-0"><strong>What to bring:</strong> ${announcement.itinerary}</p>` : ''}
          </div>
   
          <img class="desktop" src="assets/images/announcements/${announcement.desktopImage}" alt="${announcement.title}" />
          <img class="mobile" src="assets/images/announcements/${announcement.mobileImage}" alt="${announcement.title}" />
          <a href="${announcement.redirectURI || '#'}" target="_blank" rel="noopener noreferrer" class="position-absolute btn btn-primary rounded-pill px-4 py-2 fw-semibold border-0" style="background-color: #2b44b8;">
                Click here to sign up
              </a>
        </figure>
      `)
      .join('');
  }

  async initAndRender() {
    if (!this._db) return;

    try {
      const announcements = await this._db.getByDate(new Date("2026-08-01"), new Date().toLocaleDateString('en-CA'));
      this.shadowRootRef.innerHTML = `
      <link rel="stylesheet" href="assets/styles/announcement.css">
        ${this.generateChildElements(announcements)}
      `;
      this.items = Array.from(this.shadowRootRef.querySelectorAll('.item'));
      if (this.items.length) {
        this.startTimer();
      }
    } catch (error) {
      console.error("Failed to load carousel database items:", error);

    }
  }

  connectedCallback() {
    this.addEventListener('scroll', this.handleScroll, { passive: true });
    this.addEventListener('pointerdown', this.handlePointerDown);
    if (this._db) this.initAndRender();
    else {
      this.shadowRootRef.innerHTML = `
        <slot></slot>
      `;
      this.items = Array.from(this.querySelectorAll('.item'));
      this.startTimer();
    }
  }

  disconnectedCallback() {
    this.stopTimer();
    this.removeEventListener('scroll', this.handleScroll);
    this.removeEventListener('pointerdown', this.handlePointerDown);
  }

  scrollToNext() {
    if (!this.items.length) return;

    this.index += this.direction;

    if (this.index >= this.items.length - 1) {
      this.index = this.items.length - 1;
      this.direction = -1;
    } else if (this.index <= 0) {
      this.index = 0;
      this.direction = 1;
    }

    const targetItem = this.items[this.index];
    if (targetItem) {
      this.scrollTo({
        left: targetItem.offsetLeft,
        behavior: 'smooth'
      });
    }
  }

  startTimer() {
    this.stopTimer();
    this.autoScrollTimer = setInterval(this.scrollToNext, this.slideDuration);
  }

  stopTimer() {
    if (this.autoScrollTimer) clearInterval(this.autoScrollTimer);
    if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
  }

  pauseForDuration(ms = this.pauseTime) {
    this.stopTimer();
    this.pauseTimeout = setTimeout(() => {
      this.startTimer();
    }, ms);
  }

  handleScroll() {
    if (!this.clientWidth) return;
    const newIndex = Math.round(this.scrollLeft / this.clientWidth);

    if (newIndex !== this.index) {
      this.index = newIndex;
      this.pauseForDuration();
    }
  }

  handlePointerDown() {
    this.pauseForDuration();
  }
}

customElements.define("custom-carousel", Carousel);