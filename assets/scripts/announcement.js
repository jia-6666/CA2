import { BaseDB } from '/databases/db.js';

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

// async function main() {
//     try {
//         const announcementDB = await initAnnouncementDB();
//         const carouselEl = document.getElementById("carousel");

//         if (carouselEl) {
//             carouselEl.db = announcementDB; // Setting trigger automatic renders
//         }
//     } catch (error) {
//         console.error("Initialization error:", error);
//     }
// }

// // Wait for DOM content to fully load before binding custom elements
// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", main);
// } else {
//     main();
// }