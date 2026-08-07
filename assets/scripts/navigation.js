// Coordinates are % of the image's width/height, so they stay correct
      // at any screen size. These were estimated from the map screenshot you
      // shared — double check a few against your actual campus-map.jpeg and
      // nudge any that are off (open the image, hover to read pixel x/y,
      // then % = pixelX / imageWidth * 100, same for y).
      // `aliases` are extra terms that should also find this location.
      const mapLocations = [
        { id: 'gate6', label: 'Gate 6', top: 5.4, left: 25.6, aliases: [] },
        { id: 'gate7', label: 'Gate 7 (Vehicle Exit)', top: 4.9, left: 43.5, aliases: ['gate 7', 'vehicle exit'] },
        { id: 't20', label: 'T20', top: 11.5, left: 30.8, aliases: [] },
        { id: 't21', label: 'T21', top: 14.6, left: 28.6, aliases: [] },
        { id: 't22', label: 'T22', top: 18.9, left: 26.6, aliases: [] },
        { id: 't19', label: 'T19', top: 12.3, left: 35.6, aliases: [] },
        { id: 'mlt9-11', label: 'MLT 9-11', top: 15.8, left: 33.9, aliases: ['mlt', 'mlt 9', 'mlt 11'] },
        { id: 'blk210', label: 'BLK 210', top: 22.8, left: 11.7, aliases: ['block 210'] },
        { id: 'blk212', label: 'BLK 212', top: 24.7, left: 6.7, aliases: ['block 212'] },
        { id: 'staffapartments', label: 'Staff Apartments', top: 20.1, left: 16.2, aliases: [] },
        { id: 't18b', label: 'T18B', top: 13.9, left: 47.3, aliases: [] },
        { id: 't18a', label: 'T18A', top: 15.7, left: 47.7, aliases: [] },
        { id: 'aerohub', label: 'Aerohub', top: 12.3, left: 47.7, aliases: [] },
        { id: 'conventioncentre', label: 'Convention Centre', top: 20.7, left: 52.0, aliases: [] },
        { id: 'w12', label: 'W12', top: 26.3, left: 39.0, aliases: [] },
        { id: 'mscp', label: 'MSCP', top: 22.0, left: 40.2, aliases: ['multi storey car park', 'carpark'] },
        { id: 'pmw', label: 'Princess Mary Walk', top: 29.6, left: 39.4, aliases: [] },
        { id: 'w13', label: 'W13', top: 31.9, left: 39.4, aliases: [] },
        { id: 'w14', label: 'W14', top: 34.6, left: 46.5, aliases: [] },
        { id: 't17', label: 'T17', top: 30.2, left: 48.1, aliases: [] },
        { id: 't18', label: 'T18', top: 24.7, left: 50.3, aliases: [] },
        { id: 'plaza', label: 'Plaza', top: 26.5, left: 56.4, aliases: [] },
        { id: 't16', label: 'T16', top: 35.2, left: 52.4, aliases: [] },
        { id: 'dancestudio', label: 'Dance Studio', top: 39.3, left: 46.5, aliases: [] },
        { id: 't15', label: 'T15', top: 37.7, left: 56.4, aliases: [] },
        { id: 't14', label: 'T14', top: 37.7, left: 61.0, aliases: [] },
        { id: 't12a', label: 'T12A', top: 28.1, left: 57.2, aliases: [] },
        { id: 't12', label: 'T12', top: 23.8, left: 60.2, aliases: [] },
        { id: 'spectrum', label: 'Spectrum', top: 39.3, left: 57.2, aliases: [] },
        { id: 'biosteward', label: 'Bio Steward', top: 28.1, left: 66.6, aliases: [] },
        { id: 't11a', label: 'T11A', top: 35.2, left: 66.1, aliases: [] },
        { id: 't11b', label: 'T11B', top: 39.3, left: 69.4, aliases: [] },
        { id: 't11c', label: 'T11C (Eleven)', top: 37.7, left: 67.0, aliases: ['eleven'] },
        { id: 'mpf', label: 'Multi Purpose Field', top: 45.1, left: 51.3, aliases: ['multipurpose field', 'field'] },
        { id: 'basketballcourts', label: 'Basketball Courts', top: 43.8, left: 55.6, aliases: ['basketball'] },
        { id: 'fc2', label: 'FC2', top: 51.2, left: 83.2, aliases: [] },
        { id: 'fc3', label: 'FC3', top: 51.2, left: 58.0, aliases: [] },
        { id: 'fc4', label: 'FC4', top: 21.5, left: 46.0, aliases: ['food court 4'] },
        { id: 'fc5', label: 'FC5', top: 45.1, left: 46.0, aliases: [] },
        { id: 'fc6', label: 'FC6', top: 20.0, left: 31.9, aliases: ['food court 6'] },
        { id: 'kkc', label: 'Khoo Kay Chai Complex', top: 48.1, left: 42.2, aliases: ['kkc'] },
        { id: 'sportsarena', label: 'Sports Arena', top: 56.8, left: 49.3, aliases: [] },
        { id: 'sportscomplex', label: 'Sports Complex', top: 45.1, left: 32.7, aliases: ['track', 'running track'] },
        { id: 'singtel', label: 'Singtel', top: 62.7, left: 44.0, aliases: [] },
        { id: 'ntss', label: 'New Town Secondary School', top: 42.0, left: 9.5, aliases: [] },
        { id: 'spggch', label: 'SP Graduates Guild Club House', top: 37.7, left: 23.3, aliases: ['graduates guild'] },
        { id: 't10a', label: 'T10A', top: 67.7, left: 52.7, aliases: [] },
        { id: 'moberlyclose', label: 'Moberly Close', top: 61.7, left: 55.2, aliases: [] },
        { id: 'polycentre', label: 'Poly Centre', top: 53.1, left: 56.4, aliases: [] },
        { id: 't7', label: 'T7', top: 57.8, left: 58.8, aliases: [] },
        { id: 't8', label: 'T8', top: 49.8, left: 63.7, aliases: [] },
        { id: 't9', label: 'T9', top: 53.1, left: 62.5, aliases: [] },
        { id: 't6', label: 'T6', top: 56.2, left: 67.7, aliases: [] },
        { id: 't4a', label: 'T4A', top: 54.3, left: 76.1, aliases: [] },
        { id: 'libraryannex', label: 'Library Annex', top: 53.1, left: 72.4, aliases: [] },
        { id: 'library', label: 'Library', top: 59.3, left: 71.6, aliases: ['sp library', 'lib', 'school of computing library'] },
        { id: 'sanctuary', label: 'The Sanctuary', top: 61.7, left: 65.9, aliases: ['sanctuary'] },
        { id: 'colours', label: 'Colours', top: 64.2, left: 70.6, aliases: [] },
        { id: 'spavilion', label: 'SPavilion', top: 65.4, left: 74.1, aliases: ['pavilion'] },
        { id: 't10', label: 'T10', top: 61.1, left: 61.9, aliases: [] },
        { id: 't5', label: 'T5', top: 69.1, left: 73.7, aliases: [] },
        { id: 't4', label: 'T4', top: 63.0, left: 75.3, aliases: [] },
        { id: 't2', label: 'T2', top: 65.4, left: 78.9, aliases: [] },
        { id: 't1', label: 'T1', top: 63.0, left: 80.4, aliases: [] },
        { id: 'admin', label: 'Admin', top: 68.9, left: 69.0, aliases: ['administration'] },
        { id: 'tenniscourts', label: 'Tennis Courts', top: 74.7, left: 62.3, aliases: ['tennis'] },
        { id: 't3', label: 'T3', top: 72.8, left: 78.5, aliases: [] },
        { id: 't3a', label: 'T3A', top: 72.8, left: 81.6, aliases: [] },
        { id: 't3b', label: 'T3B', top: 59.9, left: 84.0, aliases: [] },
        { id: 'w1', label: 'W1', top: 60.2, left: 89.1, aliases: [] },
        { id: 'w2', label: 'W2', top: 64.0, left: 88.3, aliases: [] },
        { id: 'w3', label: 'W3', top: 67.3, left: 88.3, aliases: [] },
        { id: 'w4', label: 'W4', top: 77.2, left: 78.9, aliases: [] },
        { id: 'w5', label: 'W5', top: 80.9, left: 78.1, aliases: [] },
        { id: 'w5a', label: 'W5A', top: 85.8, left: 76.9, aliases: [] },
        { id: 'ecoasis', label: 'EcOasis', top: 57.4, left: 82.3, aliases: [] },
        { id: 'innovillage', label: 'InnoVillage', top: 51.2, left: 76.9, aliases: [] },
        { id: 'isc', label: 'ISC', top: 53.1, left: 87.8, aliases: [] },
        { id: 't1aconcourse', label: 'T1A Concourse', top: 51.2, left: 83.2, aliases: [] },
        { id: 'amec', label: 'AMEC', top: 60.5, left: 94.2, aliases: [] },
        { id: 'dovermrt', label: 'Dover MRT (EW22)', top: 16.7, left: 58.0, aliases: ['dover', 'mrt', 'ew22'] },
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
      const dimOverlay = document.getElementById('mapDimOverlay');
      const resetBtn = document.getElementById('mapResetBtn');
      const notFound = document.getElementById('mapNotFound');
      const mapSection = document.getElementById('mapSection');
      const mapViewport = document.getElementById('mapViewport');
      const mapWrap = document.getElementById('mapWrap');
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
 
      // --- Mobile pinch-zoom / pan ---
      // mapWrap is the element that actually gets scaled/translated;
      // mapViewport just clips it. Only active on small screens — on
      // desktop the map stays static like before.
      const MOBILE_QUERY = window.matchMedia('(pointer: coarse)');
      function isMobile() {
        return MOBILE_QUERY.matches;
      }
 
      let zoomScale = 1;
      let panX = 0;
      let panY = 0;
      const MIN_SCALE = 1;
      const MAX_SCALE = 4;
      const SEARCH_ZOOM_SCALE = 2.4;

      // True if there's anywhere to drag to — either because we're
      // zoomed in, or because the map's natural height exceeds the
      // (height-capped) viewport even at 1x, so the cropped-off bottom
      // can still be reached by dragging.
      function isPannable() {
        return zoomScale > 1 || mapWrap.scrollHeight > mapViewport.clientHeight;
      }
 
      function clampPan(scale, x, y) {
        // mapWrap.scrollWidth/Height reflect its natural, un-transformed
        // size — since transform doesn't affect layout, this stays
        // correct even though the viewport itself is height-capped and
        // therefore smaller than the full map.
        const contentW = mapWrap.scrollWidth;
        const contentH = mapWrap.scrollHeight;
        const w = mapViewport.clientWidth;
        const h = mapViewport.clientHeight;
        const minX = Math.min(0, w - scale * contentW);
        const minY = Math.min(0, h - scale * contentH);
        return {
          x: Math.min(0, Math.max(minX, x)),
          y: Math.min(0, Math.max(minY, y)),
        };
      }
 
      // The location currently shown by the marker/overlay, if any. Kept
      // separate from mapWrap's transform so the marker/overlay stay a
      // constant on-screen size regardless of zoom level — only their
      // position is recalculated as panX/panY/zoomScale change.
      let activeEntry = null;

      function updateHighlightPosition() {
        if (!activeEntry) return;
        const baseX = (activeEntry.left / 100) * mapWrap.scrollWidth;
        const baseY = (activeEntry.top / 100) * mapWrap.scrollHeight;
        const screenX = panX + zoomScale * baseX;
        const screenY = panY + zoomScale * baseY;

        marker.style.left = screenX + 'px';
        marker.style.top = screenY + 'px';
        dimOverlay.style.setProperty('--spot-x', screenX + 'px');
        dimOverlay.style.setProperty('--spot-y', screenY + 'px');
      }

      function applyTransform(animated) {
        mapWrap.style.transition = animated ? 'transform 0.3s ease' : 'none';
        mapWrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
        mapViewport.classList.toggle('is-zoomed', isPannable());
        // Reset button reflects the actual zoom state now, not just
        // whether a search result is showing — so manual +/-/pinch
        // zoom (with no search involved) can still be reset.
        resetBtn.classList.toggle('d-none', zoomScale <= 1 && !activeEntry);
        updateHighlightPosition();
      }
 
      function resetZoom(animated) {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyTransform(animated);
      }
 
      // Zooms + pans so the given map-percentage point ends up centred
      // in the viewport, at SEARCH_ZOOM_SCALE.
      function zoomToPoint(leftPercent, topPercent) {
        const w = mapViewport.clientWidth;
        const h = mapViewport.clientHeight;
        const px = (leftPercent / 100) * mapWrap.scrollWidth;
        const py = (topPercent / 100) * mapWrap.scrollHeight;
 
        zoomScale = SEARCH_ZOOM_SCALE;
        const target = clampPan(
          zoomScale,
          w / 2 - zoomScale * px,
          h / 2 - zoomScale * py
        );
        panX = target.x;
        panY = target.y;
        applyTransform(true);
      }
 
      // Pinch-to-zoom and single-finger pan (once zoomed in), via the
      // Pointer Events API so touch, pen, etc. all work the same way.
      const activePointers = new Map();
      let pinchStartDist = 0;
      let pinchStartScale = 1;
      let panStart = null;
 
      function pointerDistance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
      }
 
      mapViewport.addEventListener('pointerdown', (e) => {
        // Allowed on any pointer type now (mouse drag included) —
        // pinch still only ever happens with two simultaneous pointers,
        // which a mouse can't produce, so it stays touch-only naturally.
        if (e.pointerType === 'mouse' && !isPannable()) return; // nothing to drag to
        e.preventDefault(); // stop native image-drag ghost on mouse
        mapViewport.setPointerCapture(e.pointerId);
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
 
        if (activePointers.size === 1) {
          panStart = { x: e.clientX, y: e.clientY, panX, panY };
          mapViewport.classList.add('is-panning');
        } else if (activePointers.size === 2) {
          const pts = [...activePointers.values()];
          pinchStartDist = pointerDistance(pts[0], pts[1]);
          pinchStartScale = zoomScale;
          panStart = null;
        }
      });
 
      mapViewport.addEventListener('pointermove', (e) => {
        if (!activePointers.has(e.pointerId)) return;
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
 
        if (activePointers.size === 2 && pinchStartDist > 0) {
          const pts = [...activePointers.values()];
          const dist = pointerDistance(pts[0], pts[1]);
          const newScale = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, pinchStartScale * (dist / pinchStartDist))
          );
 
          const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
          const rect = mapViewport.getBoundingClientRect();
          const localX = mid.x - rect.left;
          const localY = mid.y - rect.top;
 
          // keep the point under the fingers fixed while scaling
          const worldX = (localX - panX) / zoomScale;
          const worldY = (localY - panY) / zoomScale;
          const target = clampPan(
            newScale,
            localX - worldX * newScale,
            localY - worldY * newScale
          );
 
          zoomScale = newScale;
          panX = target.x;
          panY = target.y;
          applyTransform(false);
        } else if (activePointers.size === 1 && panStart) {
          const target = clampPan(
            zoomScale,
            panStart.panX + (e.clientX - panStart.x),
            panStart.panY + (e.clientY - panStart.y)
          );
          panX = target.x;
          panY = target.y;
          applyTransform(false);
        }
      });
 
      function endPointer(e) {
        activePointers.delete(e.pointerId);
        pinchStartDist = 0;
        if (activePointers.size === 1) {
          const remaining = [...activePointers.values()][0];
          panStart = { x: remaining.x, y: remaining.y, panX, panY };
        } else {
          panStart = null;
          mapViewport.classList.remove('is-panning');
        }
      }
 
      mapViewport.addEventListener('pointerup', endPointer);
      mapViewport.addEventListener('pointercancel', endPointer);
 
      let activeIndex = -1;
      let currentMatches = [];
 
      function showLocation(entry) {
        activeEntry = entry;
        marker.classList.remove('d-none');
        dimOverlay.classList.remove('d-none');
        notFound.classList.add('d-none');

        // Zoom in on search on both desktop and mobile now; also
        // repositions the marker/overlay and toggles the reset button
        // via applyTransform.
        zoomToPoint(entry.left, entry.top);

        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
 
      function showNotFound() {
        activeEntry = null;
        marker.classList.add('d-none');
        dimOverlay.classList.add('d-none');
        notFound.classList.remove('d-none');
        resetZoom(true); // also hides the reset button via applyTransform
      }
 
      function resetMap() {
        activeEntry = null;
        marker.classList.add('d-none');
        dimOverlay.classList.add('d-none');
        notFound.classList.add('d-none');
        searchInput.value = '';
        closeSuggestions();
        resetZoom(true); // also hides the reset button via applyTransform
      }
 
      resetBtn.addEventListener('click', resetMap);

      // Manual zoom controls (mainly for desktop, which has no pinch
      // gesture — mobile can use these too as a fine-adjustment on top
      // of pinch/search-zoom).
      const zoomInBtn = document.getElementById('zoomInBtn');
      const zoomOutBtn = document.getElementById('zoomOutBtn');
      const ZOOM_STEP = 0.4;

      function zoomBy(delta) {
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, zoomScale + delta));
        if (newScale === zoomScale) return;

        const w = mapViewport.clientWidth;
        const h = mapViewport.clientHeight;
        const centerX = w / 2;
        const centerY = h / 2;

        // keep whatever's currently centred in view fixed while scaling
        const worldX = (centerX - panX) / zoomScale;
        const worldY = (centerY - panY) / zoomScale;
        const target = clampPan(
          newScale,
          centerX - worldX * newScale,
          centerY - worldY * newScale
        );

        zoomScale = newScale;
        panX = target.x;
        panY = target.y;
        applyTransform(true);
      }

      zoomInBtn.addEventListener('click', () => zoomBy(ZOOM_STEP));
      zoomOutBtn.addEventListener('click', () => zoomBy(-ZOOM_STEP));
 
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