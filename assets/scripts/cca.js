// ---------------------------------------------------------------------------
// CCA data — sourced from https://www.sp.edu.sg/student-life/ccas
// category: "constituent" | "arts" | "service" | "special" | "sports"
// waterSport / soc are extra tags used by the quick-filter checkboxes
// img: path to a photo in your assets/images/CCA/<Category>/ folders
// url: the club's official SP page (used as the "Sign up" fallback link)
// instagram: verified Instagram handle, shown as a quick-contact icon
//   when known — only filled in for clubs confirmed via each club's own
//   "Contact Us" section on sp.edu.sg. Not every club has these yet; the
//   Sign up link is always shown so every club stays reachable regardless.
// ---------------------------------------------------------------------------
const CCA_DATA = [

  // Constituent Clubs
  { name: "School of Computing Club", category: "constituent", soc: true, img: "assets/images/CCA/Constituent/soc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/school-of-computing-club", instagram: "spsocclub", desc: "Represents SOC students and organises school-wide events and activities." },

  { name: "Singapore Maritime Academy Club", category: "constituent", img: "assets/images/CCA/Constituent/sma.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/singapore-maritime-academy-club", instagram: "smaclub", desc: "Represents SMA students and organises school-wide events and activities." },

  { name: "Singapore Polytechnic Students' Union", category: "constituent", img: "assets/images/CCA/Constituent/spsu.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/singapore-polytechnic-students-union", instagram: "spstudentsunion", desc: "Champions student interests and represents the student body at large." },

  { name: "Community Service & Cultural Club", category: "constituent", img: "assets/images/CCA/Constituent/csc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/community-service-cultural-club", instagram: "spcscc", desc: "Champions community service and cultural initiatives across campus." },

  { name: "SP Students Sports Club", category: "constituent", img: "assets/images/CCA/Constituent/spss.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/sp-students-sports-club", instagram: "sp.sportsclub", desc: "Oversees student sports activities and inter-school competitions." },
  
  // Arts & Culture
  { name: "SP Chinese Music & Cultural Club", category: "arts", img: "assets/images/CCA/Arts/cmc.jpeg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-chinese-music-cultural-club", instagram: "spcmcc", desc: "Explore Chinese music and cultural traditions with fellow enthusiasts." },

  { name: "SP Chinese Orchestra", category: "arts", img: "assets/images/CCA/Arts/co.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-chinese-orchestra", instagram: "spcotv", desc: "Perform traditional Chinese instrumental music as an ensemble." },

  { name: "SP Comperes", category: "arts", img: "assets/images/CCA/Arts/comperes.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-comperes", instagram: "spcomperes", desc: "Sharpen your hosting and public speaking skills for campus events." },

  { name: "SP Dance Sport", category: "arts", img: "assets/images/CCA/Arts/dance.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-dance-sport", instagram: "dancesport.sp", desc: "Learn ballroom and Latin dance styles, from social to competitive level." },

  { name: "SP Deejays", category: "arts", img: "assets/images/CCA/Arts/deejays.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-deejays", instagram: "spdeejays", desc: "Learn the craft of DJing and music mixing." },

  // Service-Learning
  { name: "SP Environment Club", category: "service", img: "assets/images/CCA/Service-Learning/env.jpg", instagram: "sp_env", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-environment-club", desc: "Champion sustainability and environmental causes on campus." },

  { name: "SP Leo Club", category: "service", img: "assets/images/CCA/Service-Learning/leo.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-leo-club", instagram: "sp_leo_club", desc: "Give back to the community through youth-led service projects." },

  { name: "SP Mentoring Club", category: "service", img: "assets/images/CCA/Service-Learning/mentoring.jpeg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-mentoring-club", instagram: "spmentoring", desc: "Mentor younger students and give back through guidance programmes." },

  { name: "SP Primers", category: "service", img: "assets/images/CCA/Service-Learning/primers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-primers", instagram: "sp.primers", desc: "Support outreach and mentoring programmes for the community." },

  { name: "SP Red Cross", category: "service", img: "assets/images/CCA/Service-Learning/rx.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-red-cross", instagram: "spredcross", desc: "Support humanitarian causes and first-aid outreach initiatives." },

  // Special Interests
  { name: "SP Ambassadors", category: "special", img: "assets/images/CCA/Special/spa.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-ambassadors", instagram: "sp_ambassadors", desc: "Represent SP at events and welcome visitors to the campus." },

  { name: "SP Infocomm Club", category: "special", soc: true, img: "assets/images/CCA/Special/spic.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-infocomm-club", instagram: "spinfocomm", desc: "Explore infocomm technology projects and interest groups." },

  { name: "SP Robotics, Innovation, Technology & Enterprise", category: "special", soc: true, img: "assets/images/CCA/Special/robo.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-robotics-innovation-technology-enterprise", instagram: "sp.riteclub", desc: "Build robotics and tech projects with like-minded innovators." },

  { name: "SP Student Exchange Club", category: "special", img: "assets/images/CCA/Special/se.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-student-exchange-club", instagram: "sp.sec", desc: "Support incoming and outgoing student exchange experiences." },

  { name: "SP Visual Media", category: "special", img: "assets/images/CCA/Special/vm.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-visualmedia", instagram: "sp.vm", desc: "Create photography, videography and visual media content." },

  // Sports & Adventure
  { name: "SP Bowling", category: "sports", img: "assets/images/CCA/Sports/bowling.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-bowling", instagram: "spbowlers", desc: "Train and compete in tenpin bowling." },

  { name: "SP Canoe Polo", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/cp.jpeg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-canoe-polo", instagram: "spcanoepolo", desc: "Train and compete in the water sport of canoe polo." },

  { name: "SP Canoe Sprint", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/cs.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-canoe-sprint", instagram: "spcanoesprint", desc: "Train and compete in flatwater canoe sprint racing." },

  { name: "SP Cyclists", category: "sports", img: "assets/images/CCA/Sports/cyclists.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-cyclists", instagram: "spcyclists", desc: "Ride and train together as a competitive cycling team." },
  
  { name: "SP Dragon Boat", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/db.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-dragon-boat", instagram: "spdragonboat", desc: "Train and compete in the water sport of dragon boat racing." },

  { name: "SP Lifesavers", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/ls.jpeg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-lifesavers", instagram: "splifesavers", desc: "Train in the water sport and skill of lifesaving." },

  { name: "SP Swimming", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/swimming.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-swimming", instagram: "sp_swimming_team", desc: "Train and compete in the water sport of swimming." },];

const CATEGORY_LABELS = {
  constituent: "Constituent Club",
  arts: "Arts & Culture",
  service: "Service-Learning",
  special: "Special Interest",
  sports: "Sports & Adventure",
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("ccaGrid");
  const searchInput = document.getElementById("ccaSearch");
  const searchLabel = document.getElementById("ccaSearchLabel");
  const emptyState = document.getElementById("ccaEmptyState");
  const resultCount = document.getElementById("ccaResultCount");
  const filterInputs = Array.from(document.querySelectorAll(".cca-filter"));

  if (!grid) return;

  function activeFilters() {
    return filterInputs.filter((el) => el.checked).map((el) => el.dataset.filter);
  }

  function matchesFilters(cca, filters) {
    if (filters.length === 0) return true;
    return filters.some((f) => {
      if (f === "soc") return !!cca.soc;
      if (f === "watersport") return !!cca.waterSport;
      return cca.category === f;
    });
  }

  function contactIcons(cca) {
    const icons = [];
    if (cca.instagram) {
      icons.push(`
        <a
          class="cca-contact-icon"
          href="https://instagram.com/${cca.instagram}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${cca.name} on Instagram"
          title="@${cca.instagram}"
        >
          <i class="bi bi-instagram" aria-hidden="true"></i>
        </a>`);
    }
    return icons.join("");
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const filters = activeFilters();

    const results = CCA_DATA.filter((cca) => {
      const matchesQuery = !query || cca.name.toLowerCase().includes(query);
      return matchesQuery && matchesFilters(cca, filters);
    });

    searchLabel.textContent = query ? `"${searchInput.value.trim()}"` : "all CCAs";
    resultCount.textContent = `${results.length} CCA${results.length === 1 ? "" : "s"} found`;
    emptyState.classList.toggle("d-none", results.length !== 0);

    grid.innerHTML = results
      .map(
        (cca) => `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="cca-card h-100">
            <div class="cca-card-media">
              <img
                src="${cca.img}"
                alt="${cca.name}"
                loading="lazy"
                onerror="this.closest('.cca-card-media').classList.add('cca-media-fallback')"
              />
              <div class="cca-card-media-fallback">
                <i class="bi bi-image" aria-hidden="true"></i>
                <span>Img of CCA</span>
              </div>
            </div>
            <div class="cca-card-body">
              <span class="cca-card-tag">${CATEGORY_LABELS[cca.category]}</span>
              <h3 class="cca-card-title">${cca.name}</h3>
              <p class="cca-card-desc">${cca.desc}</p>
            </div>
            <div class="cca-card-footer">
              <div class="cca-contact-icons">${contactIcons(cca)}</div>
              <a
                class="cca-card-signup"
                href="${cca.url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            </div>
          </article>
        </div>`
      )
      .join("");
  }

  searchInput.addEventListener("input", render);
  filterInputs.forEach((el) => el.addEventListener("change", render));

  render();
});