import { BaseDB } from './BaseDB.js';

export class AnnouncementDB extends BaseDB {
  constructor() {
    // Pass specific dbName, version, and storeName to parent
    super("AnnouncementDb", 1, "announcements");

    this.defaultAnnouncements = [
      {
        title: "Welcome to School of Computing",
        organizer: "SOC Admin",
        description: "Orientation briefing for all new students.",
        time: new Date("2026-08-15T09:00:00").toISOString(),
        location: "Main Auditorium",
        itinerary: "09:00 AM - Welcome Address",
        link: "assets/images/announcements/SCS_poster_h.png"
      },
      {
        title: "How To React Workshop",
        organizer: "Computing Society",
        description: "Learn modern frontend development principles.",
        time: new Date("2026-09-20T10:00:00").toISOString(),
        location: "Innovation Lab",
        itinerary: "10:00 AM - Keynote",
        link: "assets/images/announcements/HowToReact_poster_v.png"
      }
    ];
  }

  // Override schema creation & seed initial defaults on upgrade
  onUpgrade(db, transaction) {
    if (db.objectStoreNames.contains(this.storeName)) {
      db.deleteObjectStore(this.storeName);
    }

    const store = db.createObjectStore(this.storeName, {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("title", "title", { unique: false });
    store.createIndex("time", "time", { unique: false });

    // Seed default records once during initial setup
    this.defaultAnnouncements.forEach((item) => store.add(item));
  }

  // Override save to add domain-specific transformations (e.g. Date parsing)
  async save(announcement) {
    const formatted = {
      ...announcement,
      time: announcement.time instanceof Date ? announcement.time.toISOString() : announcement.time
    };
    return super.save(formatted);
  }
}