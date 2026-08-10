import { BaseDB } from './db.js';

async function initAnnouncementDB() {
    const db = new BaseDB("Announcement", 1, "announcements");

    const defaultAnnouncements = [
        {
            title: "Tech Insights Series: Inside the World of Cloud Computing",
            organizer: "Singapore Computer Society ",
            description: "Explore how cloud computing continues to shape the future of technology and careers. Hear directly from industry professionals from the SCS Cloud Computing Chapter as they share valuable insights into working in the cloud industry, emerging trends and opportunities for students entering the workforce",
            time: new Date("2026-08-15T09:00:00").toISOString(),
            location: "AWS 2 Central Boulevard IOI Central Boulevard Towers Singapore 018916",
            redirectURI: "https://www.scs.org.sg/events/details/tech-insights-series-inside-the-world-of-cloud-computing",
            postTime: new Date("2026-08-07T16:14:00").toISOString(),
            mobileImage: "SCS_poster_v.jpg",
            desktopImage: "SCS_poster_h.jpg"
        },
        {
            title: "How To React Workshop",
            organizer: "SEED",
            description: "Want to catch a glimpse of the React world? We got you! Join us for How to React, an interactive workshop where we introduce this fascinating web development framework through a dedicated project!",
            time: new Date("2026-08-12T15:30:00").toISOString(),
            location: "T2147",
            itinerary: "Laptop",
            redirectURI: "https://forms.gle/zY372heXcWAdn3xo7",
            postTime: new Date("2026-08-05T12:05:00").toISOString(),
            mobileImage: "HowToReact_poster_v.png",
            desktopImage: "HowToReact_poster_h.png"
        },
        {
            title: "Ice-Cream Candle Making Workshop",
            organizer: "Student Services",
            description: "Take a break from the semester and learn a simple grounding technique through a hands-on candle-making activity. You'll create your own ice cream-inspired candle that you can use beyond the workshop.",
            location: "INNOLAB 1 @ L4A, SP LIBRARY",
            time: new Date("2026-08-12T15:00:00").toISOString(),
            redirectURI: "https://for.edu.sg/librarycandle",
            postTime: new Date("2026-08-05T12:34:00").toISOString(),
            mobileImage: "Icecream_poster_v.png",
            desktopImage: "Icecream_poster_h.png"
        }
    ];

    db.onUpgrade = (database, transaction) => {
        if (database.objectStoreNames.contains("announcements")) {
            database.deleteObjectStore("announcements");
        }

        const store = database.createObjectStore("announcements", {
            keyPath: "id",
            autoIncrement: true
        });

        store.createIndex("title", "title", { unique: false });
        store.createIndex("postTime", "postTime", { unique: false });

        defaultAnnouncements.forEach((item) => store.add(item));
    };

    await db.connect("Announcement", 1);
    return db;
}
function renderEvents(events, eventContainer) {
    // Remove existing event cards while keeping section header controls
    const existingCards = eventContainer.querySelectorAll('.event-card-wrapper');
    existingCards.forEach(card => card.remove());

    events.forEach((event) => {
        const div = document.createElement('div');
        div.className = "container py-5 event-card-wrapper";
        div.innerHTML = `
<div class="card event-card border-0 rounded-4 overflow-hidden shadow-sm">
    <div class="row g-0 align-items-stretch min-vh-25">
      <!-- Mobile Image (visible on screens smaller than md) -->
      <img 
        class="col-12 img-container d-block d-md-none bg-white border-bottom border-light-subtle"
        src="assets/images/announcements/${event.desktopImage}"
        alt="${event.title}" />

      <!-- Desktop Image (visible on md screens and above) -->
      <img 
        class="col-md-4 col-lg-3 img-container d-none d-md-block bg-white border-end border-light-subtle"
        src="assets/images/announcements/${event.mobileImage}"
        alt="${event.title}" />

      <!-- Right Content Section -->
      <div class="col-md-8 col-lg-9 gradient-bg p-4 p-md-5 d-flex flex-column justify-content-between text-white">
        <div>
          <h2 class="card-title fw-bold mb-2">${event.title}</h2>
          <p class="card-text fs-4 fw-medium text-white-50 line-clamp-3">${event.description}</p>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <a class="btn btn-signup text-white px-4 py-2 rounded-pill fw-semibold" href="${event.redirectURI}" target="_blank" rel="noopener noreferrer">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
        `;
        eventContainer.appendChild(div);
    });
}

function sortEvents(events, sortType) {
    const sorted = [...events];
    if (sortType === 'asc') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'desc') {
        sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === 'date') {
        sorted.sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    return sorted;
}

async function main() {
    try {
        const announcementDB = await initAnnouncementDB();
        const carouselEl = document.getElementById("carousel");

        if (carouselEl) {
            carouselEl.db = announcementDB;
        }

        const rawEvents = await announcementDB.getAll();
        const eventContainer = document.getElementById("events-container");
        const sortBtn = document.getElementById("sortDropdownBtn");
        const dropdownItems = document.querySelectorAll("#sortDropdownMenu .dropdown-item");

        // Initial render (default: Title Ascending)
        let currentSort = "asc";
        let displayedEvents = sortEvents(rawEvents, currentSort);
        renderEvents(displayedEvents, eventContainer);

        // Bind click listener to dropdown options
        dropdownItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const sortType = item.getAttribute("data-sort");

                // Update UI button label and active class
                sortBtn.textContent = item.textContent;
                dropdownItems.forEach((i) => i.classList.remove("active"));
                item.classList.add("active");

                // Sort and re-render events
                displayedEvents = sortEvents(rawEvents, sortType);
                renderEvents(displayedEvents, eventContainer);
            });
        });

    } catch (error) {
        console.error("Initialization error:", error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}