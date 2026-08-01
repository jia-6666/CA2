// Coordinates are % of the image's width/height, so they stay correct
      // at any screen size. These were estimated from the map screenshot you
      // shared — double check a few against your actual campus-map.jpeg and
      // nudge any that are off (open the image, hover to read pixel x/y,
      // then % = pixelX / imageWidth * 100, same for y).
      // `aliases` are extra terms that should also find this location.
      const mapLocations = [
        { id: 'gate6', label: 'Gate 6', top: 3.3, left: 10.2, aliases: [] },
        { id: 'gate7', label: 'Gate 7 (Vehicle Exit)', top: 1.6, left: 44.1, aliases: ['gate 7', 'vehicle exit'] },
        { id: 't20', label: 'T20', top: 10.6, left: 30.3, aliases: [] },
        { id: 't21', label: 'T21', top: 13.8, left: 27.8, aliases: [] },
        { id: 't22', label: 'T22', top: 19.3, left: 25.9, aliases: [] },
        { id: 't19', label: 'T19', top: 11.6, left: 35.4, aliases: [] },
        { id: 'mlt9-11', label: 'MLT 9-11', top: 12.7, left: 34.8, aliases: ['mlt', 'mlt 9', 'mlt 11'] },
        { id: 'blk210', label: 'BLK 210', top: 21.3, left: 10.9, aliases: ['block 210'] },
        { id: 'blk212', label: 'BLK 212', top: 25.3, left: 2.0, aliases: ['block 212'] },
        { id: 'staffapartments', label: 'Staff Apartments', top: 20.7, left: 14.5, aliases: [] },
        { id: 't18b', label: 'T18B', top: 13.3, left: 45.5, aliases: [] },
        { id: 't18a', label: 'T18A', top: 17.3, left: 46.7, aliases: [] },
        { id: 'aerohub', label: 'Aerohub', top: 14.0, left: 47.7, aliases: [] },
        { id: 'conventioncentre', label: 'Convention Centre', top: 19.3, left: 54.1, aliases: [] },
        { id: 'w12', label: 'W12', top: 28.4, left: 38.8, aliases: [] },
        { id: 'mscp', label: 'MSCP', top: 24.4, left: 39.7, aliases: ['multi storey car park', 'carpark'] },
        { id: 'pmw', label: 'Princess Mary Walk', top: 30.0, left: 38.3, aliases: [] },
        { id: 'w13', label: 'W13', top: 34.0, left: 39.1, aliases: [] },
        { id: 'w14', label: 'W14', top: 32.0, left: 48.4, aliases: [] },
        { id: 't17', label: 'T17', top: 32.0, left: 49.1, aliases: [] },
        { id: 't18', label: 'T18', top: 26.7, left: 51.2, aliases: [] },
        { id: 'plaza', label: 'Plaza', top: 28.0, left: 57.8, aliases: [] },
        { id: 't16', label: 'T16', top: 37.3, left: 54.7, aliases: [] },
        { id: 'dancestudio', label: 'Dance Studio', top: 40.0, left: 46.9, aliases: [] },
        { id: 't15', label: 'T15', top: 38.7, left: 57.8, aliases: [] },
        { id: 't14', label: 'T14', top: 38.7, left: 61.7, aliases: [] },
        { id: 't12a', label: 'T12A', top: 30.9, left: 58.0, aliases: [] },
        { id: 't12', label: 'T12', top: 28.0, left: 62.3, aliases: [] },
        { id: 'spectrum', label: 'Spectrum', top: 40.7, left: 58.0, aliases: [] },
        { id: 'biosteward', label: 'Bio Steward', top: 32.0, left: 67.2, aliases: [] },
        { id: 't11a', label: 'T11A', top: 37.3, left: 66.8, aliases: [] },
        { id: 't11b', label: 'T11B', top: 40.0, left: 72.7, aliases: [] },
        { id: 't11c', label: 'T11C (Eleven)', top: 42.7, left: 67.2, aliases: ['eleven'] },
        { id: 'mpf', label: 'Multi Purpose Field', top: 46.7, left: 51.6, aliases: ['multipurpose field', 'field'] },
        { id: 'basketballcourts', label: 'Basketball Courts', top: 46.0, left: 56.2, aliases: ['basketball'] },
        { id: 'fc2', label: 'FC2', top: 57.3, left: 58.6, aliases: [] },
        { id: 'fc3', label: 'FC3', top: 53.3, left: 57.8, aliases: [] },
        { id: 'fc4', label: 'FC4', top: 20.6, left: 46.4, aliases: ['food court 4'] },
        { id: 'fc5', label: 'FC5', top: 45.3, left: 45.9, aliases: [] },
        { id: 'fc6', label: 'FC6', top: 20.3, left: 31.2, aliases: ['food court 6'] },
        { id: 'kkc', label: 'Khoo Kay Chai Complex', top: 47.3, left: 39.1, aliases: ['kkc'] },
        { id: 'sportsarena', label: 'Sports Arena', top: 59.3, left: 49.2, aliases: [] },
        { id: 'sportscomplex', label: 'Sports Complex', top: 46.7, left: 32.0, aliases: ['track', 'running track'] },
        { id: 'singtel', label: 'Singtel', top: 70.4, left: 44.4, aliases: [] },
        { id: 'ntss', label: 'New Town Secondary School', top: 44.7, left: 8.2, aliases: [] },
        { id: 'spggch', label: 'SP Graduates Guild Club House', top: 40.0, left: 22.3, aliases: ['graduates guild'] },
        { id: 't10a', label: 'T10A', top: 72.7, left: 53.4, aliases: [] },
        { id: 'moberlyclose', label: 'Moberly Close', top: 66.7, left: 55.6, aliases: [] },
        { id: 'polycentre', label: 'Poly Centre', top: 57.3, left: 58.2, aliases: [] },
        { id: 't7', label: 'T7', top: 61.3, left: 58.0, aliases: [] },
        { id: 't8', label: 'T8', top: 54.0, left: 64.5, aliases: [] },
        { id: 't9', label: 'T9', top: 56.7, left: 62.1, aliases: [] },
        { id: 't6', label: 'T6', top: 60.0, left: 67.2, aliases: [] },
        { id: 't4a', label: 'T4A', top: 56.7, left: 77.0, aliases: [] },
        { id: 'libraryannex', label: 'Library Annex', top: 55.3, left: 73.0, aliases: [] },
        { id: 'library', label: 'Library', top: 62.7, left: 72.7, aliases: ['sp library', 'lib', 'school of computing library'] },
        { id: 'sanctuary', label: 'The Sanctuary', top: 66.0, left: 66.8, aliases: ['sanctuary'] },
        { id: 'colours', label: 'Colours', top: 70.4, left: 71.3, aliases: [] },
        { id: 'spavilion', label: 'SPavilion', top: 70.4, left: 75.4, aliases: ['pavilion'] },
        { id: 't10', label: 'T10', top: 66.0, left: 62.1, aliases: [] },
        { id: 't5', label: 'T5', top: 74.7, left: 74.6, aliases: [] },
        { id: 't4', label: 'T4', top: 68.0, left: 77.0, aliases: [] },
        { id: 't2', label: 'T2', top: 70.4, left: 80.9, aliases: [] },
        { id: 't1', label: 'T1', top: 68.3, left: 82.0, aliases: [] },
        { id: 'admin', label: 'Admin', top: 74.0, left: 70.1, aliases: ['administration'] },
        { id: 'tenniscourts', label: 'Tennis Courts', top: 81.3, left: 62.5, aliases: ['tennis'] },
        { id: 't3', label: 'T3', top: 78.7, left: 78.1, aliases: [] },
        { id: 't3a', label: 'T3A', top: 78.7, left: 80.9, aliases: [] },
        { id: 't3b', label: 'T3B', top: 64.0, left: 86.3, aliases: [] },
        { id: 'w1', label: 'W1', top: 67.3, left: 89.8, aliases: [] },
        { id: 'w2', label: 'W2', top: 70.7, left: 89.8, aliases: [] },
        { id: 'w3', label: 'W3', top: 74.0, left: 89.8, aliases: [] },
        { id: 'w4', label: 'W4', top: 82.7, left: 78.9, aliases: [] },
        { id: 'w5', label: 'W5', top: 86.7, left: 78.5, aliases: [] },
        { id: 'w5a', label: 'W5A', top: 92.0, left: 77.3, aliases: [] },
        { id: 'ecoasis', label: 'EcOasis', top: 58.0, left: 85.9, aliases: [] },
        { id: 'innovillage', label: 'InnoVillage', top: 55.3, left: 78.1, aliases: [] },
        { id: 'isc', label: 'ISC', top: 53.3, left: 89.5, aliases: [] },
        { id: 't1aconcourse', label: 'T1A Concourse', top: 55.3, left: 84.4, aliases: [] },
        { id: 'amec', label: 'AMEC', top: 62.7, left: 94.9, aliases: [] },
        { id: 'dovermrt', label: 'Dover MRT (EW22)', top: 12.0, left: 57.8, aliases: ['dover', 'mrt', 'ew22'] },
      ];
 
      // Normalize helper: lowercase, strip common filler prefixes
      function normalize(str) {
        return str
          .toLowerCase()
          .trim()
          .replace(/^(block|building|the)\s+/, '');
      }
 
      // Every searchable string (label + id + aliases) per entry, precomputed once
      const searchIndex = mapLocations.map((entry) => ({
        entry,
        terms: [entry.label, entry.id, ...entry.aliases].map(normalize),
      }));
 
      // Returns matches for a query, ranked: startsWith matches before plain substring matches
      function findMatches(query) {
        const q = normalize(query);
        if (!q) return [];
 
        const starts = [];
        const contains = [];
 
        searchIndex.forEach(({ entry, terms }) => {
          const hitStart = terms.some((t) => t.startsWith(q));
          const hitContain = !hitStart && terms.some((t) => t.includes(q));
          if (hitStart) starts.push(entry);
          else if (hitContain) contains.push(entry);
        });
 
        return [...starts, ...contains].slice(0, 8);
      }
 
      function highlightMatch(text, query) {
        const q = normalize(query);
        const idx = text.toLowerCase().indexOf(q);
        if (idx === -1 || !q) return text;
        return (
          text.slice(0, idx) +
          '<mark>' + text.slice(idx, idx + q.length) + '</mark>' +
          text.slice(idx + q.length)
        );
      }
 
      const searchInput = document.getElementById('searchInput');
      const marker = document.getElementById('mapMarker');
      const notFound = document.getElementById('mapNotFound');
      const mapSection = document.getElementById('mapSection');
      const suggestionsEl = document.getElementById('searchSuggestions');
      const recentChips = document.getElementById('recentChips');
 
      // Recent-search storage/rendering lives in recent-visits.js
      // (window.mapSearchHistory.save / .render) so it's alongside the
      // site's other "recent" tracking logic.
      recentChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.recent-chip');
        if (!chip) return;
        const entry = mapLocations.find((en) => en.id === chip.dataset.id);
        if (entry) selectEntry(entry);
      });
 
      let activeIndex = -1;
      let currentMatches = [];
 
      function showLocation(entry) {
        marker.style.top = entry.top + '%';
        marker.style.left = entry.left + '%';
        marker.classList.remove('d-none');
        notFound.classList.add('d-none');
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
 
      function showNotFound() {
        marker.classList.add('d-none');
        notFound.classList.remove('d-none');
      }
 
      function closeSuggestions() {
        suggestionsEl.classList.add('d-none');
        suggestionsEl.innerHTML = '';
        activeIndex = -1;
        currentMatches = [];
      }
 
      function renderSuggestions(query) {
        currentMatches = findMatches(query);
        activeIndex = -1;
 
        if (currentMatches.length === 0) {
          closeSuggestions();
          return;
        }
 
        suggestionsEl.innerHTML = currentMatches
          .map((entry, i) => `<li data-index="${i}">${highlightMatch(entry.label, query)}</li>`)
          .join('');
        suggestionsEl.classList.remove('d-none');
      }
 
      function selectEntry(entry) {
        searchInput.value = entry.label;
        closeSuggestions();
        showLocation(entry);
        window.mapSearchHistory.save(entry.id, entry.label);
      }
 
      searchInput.addEventListener('input', () => {
        renderSuggestions(searchInput.value);
      });
 
      searchInput.addEventListener('keydown', (e) => {
        if (suggestionsEl.classList.contains('d-none')) return;
 
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = Math.min(activeIndex + 1, currentMatches.length - 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = Math.max(activeIndex - 1, 0);
        } else if (e.key === 'Escape') {
          closeSuggestions();
          return;
        } else {
          return;
        }
 
        [...suggestionsEl.children].forEach((li, i) => {
          li.classList.toggle('active', i === activeIndex);
        });
      });
 
      suggestionsEl.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        selectEntry(currentMatches[Number(li.dataset.index)]);
      });
 
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrap')) closeSuggestions();
      });
 
      document.querySelector('.search-pill').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
 
        // If a suggestion is highlighted via keyboard, use it; otherwise use best match
        const chosen = activeIndex >= 0 ? currentMatches[activeIndex] : findMatches(query)[0];
 
        if (chosen) {
          searchInput.value = chosen.label;
          showLocation(chosen);
          window.mapSearchHistory.save(chosen.id, chosen.label);
        } else {
          showNotFound();
        }
        closeSuggestions();
      });
 
      // --- Route step-by-step instructions ---
      // Steps for each route, keyed by the stepper element's id. To add a
      // new route later: give its stepper the matching id and add an entry
      // here — no other JS changes needed.
      const routeStepsData = {
        stepperCarparkT22: [
          'Step 1 — When approaching T18, you will see an escalator, to the left you will see a pathway to the carpark, take it.',
          'Step 2 — Walk straight, go up the ramp and towards the right, you will see a door leading to the staircase. Go up by 1 level.',
          'Step 3 — Turn left after exiting and walk straight and you have reached T21',
          'To get to T22 — take the staircase up by 1 level, walk through the canteen all the way to the end and get to the lift area and you are at T22.',
        ],
        stepperT18AltElevator: [
          'Step 1 — When approaching T18, you will see an escalator, to the left you will see a pathway to the carpark, take it.',
          'Step 2 — Turn left as you enter the car park and you can take that elevator to other floors should the elevator at T18 be crowded.',
        ],
      };
 
      function initStepper(container, steps) {
        const contentEl = container.querySelector('.route-step-content');
        const textEl = container.querySelector('.route-step-text');
        const currentEl = container.querySelector('.route-step-counter .current');
        const totalEl = container.querySelector('.route-step-counter .total');
        const dotsEl = container.querySelector('.route-step-dots');
        const prevBtn = container.querySelector('[data-action="prev"]');
        const nextBtn = container.querySelector('[data-action="next"]');
 
        let index = 0;
        const TRANSITION_MS = 180;
 
        totalEl.textContent = steps.length;
        dotsEl.innerHTML = steps.map((_, i) => `<span data-dot="${i}"></span>`).join('');
 
        function paint() {
          textEl.textContent = steps[index];
          currentEl.textContent = index + 1;
          prevBtn.disabled = index === 0;
          nextBtn.disabled = index === steps.length - 1;
          [...dotsEl.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
        }
 
        // Only ever called from a click handler below — steps never
        // advance on their own.
        function goTo(newIndex) {
          if (newIndex < 0 || newIndex >= steps.length || newIndex === index) return;
 
          contentEl.classList.add('step-hidden');
          window.setTimeout(() => {
            index = newIndex;
            paint();
            contentEl.classList.remove('step-hidden');
          }, TRANSITION_MS);
        }
 
        prevBtn.addEventListener('click', () => goTo(index - 1));
        nextBtn.addEventListener('click', () => goTo(index + 1));
 
        paint();
      }
 
      document.querySelectorAll('.route-stepper').forEach((el) => {
        const steps = routeStepsData[el.id];
        if (steps) initStepper(el, steps);
      });