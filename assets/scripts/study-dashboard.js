document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. POMODORO TIMER & PLANT CANVAS LOGIC
  // ==========================================
  const MIN_MINUTES = 1;
  const MAX_MINUTES = 45;

  let selectedMinutes = 25;
  let timerDuration = selectedMinutes * 60;
  let timeRemaining = timerDuration;
  let timerInterval = null;
  let isRunning = false;
  let currentPlant = "tree"; // Default: tree, wheat, or flower

  const timerDisplay = document.getElementById("timerDisplay");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const timeSlider = document.getElementById("timeSlider");
  const plantSelect = document.getElementById("plantSelect");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  const canvas = document.getElementById("plantCanvas");
  const ctx = canvas.getContext("2d");

  // Canvas Resolution DPI Adjustment for Crisp Rendering
  function setupCanvasDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || 500) * dpr;
    canvas.height = (rect.height || 350) * dpr;
    ctx.scale(dpr, dpr);
  }

  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function setTimerMinutes(mins) {
    selectedMinutes = Math.min(Math.max(mins, MIN_MINUTES), MAX_MINUTES);
    timerDuration = selectedMinutes * 60;
    timeRemaining = timerDuration;

    timeSlider.value = selectedMinutes;
    updateDisplay();
    renderCurrentPlant(getProgress());
  }

  function getProgress() {
    return 1 - timeRemaining / timerDuration;
  }

  function setControlsDisabled(disabled) {
    increaseBtn.disabled = disabled;
    decreaseBtn.disabled = disabled;
    timeSlider.disabled = disabled;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    setControlsDisabled(true);

    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
        renderCurrentPlant(getProgress());
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        setControlsDisabled(false);
        renderCurrentPlant(1);
        alert(`Time is up! Your ${currentPlant} is fully grown! 🎉`);
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function resetTimer() {
    pauseTimer();
    setTimerMinutes(selectedMinutes);
    setControlsDisabled(false);
  }

  increaseBtn.addEventListener("click", () => {
    if (!isRunning) setTimerMinutes(selectedMinutes + 5);
  });

  decreaseBtn.addEventListener("click", () => {
    if (!isRunning) setTimerMinutes(selectedMinutes - 5);
  });

  timeSlider.addEventListener("input", (e) => {
    if (!isRunning) setTimerMinutes(parseInt(e.target.value, 10));
  });

  plantSelect.addEventListener("change", (e) => {
    currentPlant = e.target.value;
    renderCurrentPlant(getProgress());
  });

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // ==========================================
  // 2. BEAUTIFIED CANVAS DRAWING ROUTINES
  // ==========================================

  function renderCurrentPlant(progress) {
    const width = canvas.getBoundingClientRect().width || 500;
    const height = canvas.getBoundingClientRect().height || 350;

    ctx.clearRect(0, 0, width, height);

    // Soft Ambient Radial Background
    const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 220);
    bgGlow.addColorStop(0, "rgba(238, 242, 255, 0.9)");
    bgGlow.addColorStop(1, "rgba(241, 245, 249, 0.2)");
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, width, height);

    // Draw Decorative Pot/Soil Base
    drawPotAndSoil(width, height);

    // Render Chosen Plant
    if (currentPlant === "tree") {
      drawTree(width, height, progress);
    } else if (currentPlant === "wheat") {
      drawWheat(width, height, progress);
    } else if (currentPlant === "flower") {
      drawFlower(width, height, progress);
    }
  }

  // Common Base: Terracotta Pot and Rich Soil
  function drawPotAndSoil(width, height) {
    const potCenterX = width / 2;
    const potTopY = height - 50;

    // Pot Lip
    ctx.fillStyle = "#c2410c";
    ctx.beginPath();
    ctx.roundRect(potCenterX - 75, potTopY - 12, 150, 16, 6);
    ctx.fill();

    // Pot Body
    ctx.fillStyle = "#ea580c";
    ctx.beginPath();
    ctx.moveTo(potCenterX - 70, potTopY + 4);
    ctx.lineTo(potCenterX + 70, potTopY + 4);
    ctx.lineTo(potCenterX + 52, potTopY + 45);
    ctx.lineTo(potCenterX - 52, potTopY + 45);
    ctx.closePath();
    ctx.fill();

    // Soil Layer
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.ellipse(potCenterX, potTopY - 8, 68, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- 🌳 TREE DRAWING ---
  function drawTree(width, height, progress) {
    const startX = width / 2;
    const startY = height - 58;

    if (progress <= 0) return;

    // Trunk Growth
    const maxTrunkHeight = 120;
    const trunkHeight = maxTrunkHeight * Math.min(progress * 1.2, 1);
    const endY = startY - trunkHeight;

    // Trunk Texture Gradient
    const trunkGrad = ctx.createLinearGradient(startX - 10, startY, startX + 10, endY);
    trunkGrad.addColorStop(0, "#78350f");
    trunkGrad.addColorStop(1, "#a16207");

    ctx.strokeStyle = trunkGrad;
    ctx.lineWidth = Math.max(5, 16 * Math.min(progress + 0.2, 1));
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX - 12, startY - trunkHeight / 2, startX, endY);
    ctx.stroke();

    // Side Branch
    if (progress > 0.3) {
      ctx.lineWidth = 6 * progress;
      ctx.beginPath();
      ctx.moveTo(startX - 2, endY + 30);
      ctx.quadraticCurveTo(startX - 25, endY + 20, startX - 35, endY + 10);
      ctx.stroke();
    }

    // Layered Lush Canopy
    if (progress > 0.2) {
      const foliageScale = (progress - 0.2) / 0.8;
      const r = 55 * foliageScale;

      // Outer Dark Leaves
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.arc(startX, endY - r * 0.4, r, 0, Math.PI * 2);
      ctx.arc(startX - r * 0.7, endY + 5, r * 0.75, 0, Math.PI * 2);
      ctx.arc(startX + r * 0.7, endY + 5, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Inner Light Leaves (Depth)
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(startX - r * 0.2, endY - r * 0.6, r * 0.7, 0, Math.PI * 2);
      ctx.arc(startX + r * 0.3, endY - r * 0.2, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fruit / Golden Apples when fully grown
    if (progress > 0.85) {
      const fruits = [
        { x: startX - 25, y: endY - 15 },
        { x: startX + 20, y: endY - 25 },
        { x: startX - 5, y: endY - 45 },
        { x: startX + 30, y: endY + 5 }
      ];

      fruits.forEach((f) => {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // --- 🌾 WHEAT DRAWING ---
  function drawWheat(width, height, progress) {
    const startX = width / 2;
    const startY = height - 58;

    if (progress <= 0) return;

    const stems = [
      { angle: -0.25, heightMult: 1.1, delay: 0 },
      { angle: 0, heightMult: 1.25, delay: 0.1 },
      { angle: 0.25, heightMult: 1.05, delay: 0.2 }
    ];

    stems.forEach((stem) => {
      const p = Math.max(0, (progress - stem.delay) / (1 - stem.delay));
      if (p <= 0) return;

      const currentH = 110 * stem.heightMult * p;
      const endX = startX + Math.sin(stem.angle) * currentH;
      const endY = startY - Math.cos(stem.angle) * currentH;

      // Stem Color transition (Green -> Golden Wheat)
      ctx.strokeStyle = p > 0.7 ? "#d97706" : "#65a30d";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + stem.angle * 20, startY - currentH / 2, endX, endY);
      ctx.stroke();

      // Leaves
      if (p > 0.3) {
        ctx.fillStyle = p > 0.7 ? "#b45309" : "#84cc16";
        ctx.beginPath();
        ctx.ellipse(startX + stem.angle * 10, startY - currentH * 0.35, 12 * p, 4 * p, stem.angle + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Grain Head & Whisker Awns
      if (p > 0.4) {
        const grainCount = 7;
        for (let i = 0; i < grainCount; i++) {
          const gy = endY + i * 6;
          const gx = endX + stem.angle * i * 2;

          ctx.fillStyle = p > 0.7 ? "#f59e0b" : "#a3e635";

          // Grains
          ctx.beginPath();
          ctx.ellipse(gx - 4, gy, 5, 3, -0.4, 0, Math.PI * 2);
          ctx.ellipse(gx + 4, gy, 5, 3, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Fine Whiskers (Awns)
          ctx.strokeStyle = "#d97706";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx - 4, gy);
          ctx.lineTo(gx - 12, gy - 8);
          ctx.moveTo(gx + 4, gy);
          ctx.lineTo(gx + 12, gy - 8);
          ctx.stroke();
        }
      }
    });
  }

  // --- 🌸 FLOWER DRAWING ---
  function drawFlower(width, height, progress) {
    const startX = width / 2;
    const startY = height - 58;

    if (progress <= 0) return;

    // Stem Growth
    const stemHeight = 110 * progress;
    const endY = startY - stemHeight;

    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + 10, startY - stemHeight / 2, startX, endY);
    ctx.stroke();

    // Curved Leaves
    if (progress > 0.25) {
      const leafScale = (progress - 0.25) / 0.75;

      ctx.fillStyle = "#22c55e";
      // Left Leaf
      ctx.beginPath();
      ctx.ellipse(startX - 14 * leafScale, startY - stemHeight * 0.4, 18 * leafScale, 7 * leafScale, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Right Leaf
      ctx.beginPath();
      ctx.ellipse(startX + 16 * leafScale, startY - stemHeight * 0.6, 18 * leafScale, 7 * leafScale, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blooming Flower Petals
    if (progress > 0.45) {
      const bloomProgress = (progress - 0.45) / 0.55;
      const petalCount = 8;
      const petalRadius = 24 * bloomProgress;

      ctx.save();
      ctx.translate(startX, endY);

      // Layered Petals
      for (let i = 0; i < petalCount; i++) {
        const angle = ((Math.PI * 2) / petalCount) * i;
        ctx.rotate(angle);

        const petalGrad = ctx.createLinearGradient(0, 0, 0, -petalRadius);
        petalGrad.addColorStop(0, "#f43f5e");
        petalGrad.addColorStop(1, "#fb7185");

        ctx.fillStyle = petalGrad;
        ctx.beginPath();
        ctx.ellipse(0, -petalRadius / 1.2, 9 * bloomProgress, petalRadius, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Flower Center (Pollen Core)
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(startX, endY, 12 * bloomProgress, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(startX, endY, 8 * bloomProgress, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initial DPI & Canvas Render setup
  setupCanvasDPI();
  renderCurrentPlant(0);

  // Re-scale canvas gracefully if browser window resizes
  window.addEventListener("resize", () => {
    setupCanvasDPI();
    renderCurrentPlant(getProgress());
  });
  // ==========================================
  // 2. NOTES UI & MODAL MANAGEMENT
  // ==========================================
  let notes = [];
  let currentMode = "create";

  const openNoteModalBtn = document.getElementById("openNoteModalBtn");
  const noteModal = document.getElementById("note-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const noteForm = document.getElementById("note-form");
  const notesList = document.getElementById("notesList");

  const modalTitle = document.getElementById("modal-title");
  const titleInput = document.getElementById("note-title-input");
  const textInput = document.getElementById("note-text-input");
  const imageInput = document.getElementById("note-image-input");
  const videoInput = document.getElementById("note-video-input");
  const mediaInputs = document.getElementById("media-inputs");
  const mediaPreview = document.getElementById("media-preview");
  const saveNoteBtn = document.getElementById("save-note-btn");

  openNoteModalBtn.addEventListener("click", openModalForCreate);
  closeModalBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === noteModal) closeModal();
  });

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentMode !== "create") return;

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    const imageFile = imageInput.files[0];
    const videoFile = videoInput.files[0];

    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    const videoUrl = videoFile ? URL.createObjectURL(videoFile) : null;

    const newNote = {
      id: Date.now(),
      title,
      text,
      imageUrl,
      videoUrl
    };

    notes.push(newNote);
    renderNotesPanel();
    closeModal();
  });

  function openModalForCreate() {
    currentMode = "create";
    modalTitle.textContent = "Create Note";

    noteForm.reset();
    mediaPreview.innerHTML = "";

    titleInput.disabled = false;
    textInput.disabled = false;
    mediaInputs.style.display = "block";
    saveNoteBtn.style.display = "block";

    noteModal.classList.remove("hidden");
  }

  function openModalForView(note) {
    currentMode = "view";
    modalTitle.textContent = "View Note";

    titleInput.value = note.title;
    textInput.value = note.text;

    titleInput.disabled = true;
    textInput.disabled = true;
    mediaInputs.style.display = "none";
    saveNoteBtn.style.display = "none";

    mediaPreview.innerHTML = "";

    if (note.imageUrl) {
      const img = document.createElement("img");
      img.src = note.imageUrl;
      img.alt = "Note Image";
      mediaPreview.appendChild(img);
    }

    if (note.videoUrl) {
      const video = document.createElement("video");
      video.src = note.videoUrl;
      video.controls = true;
      mediaPreview.appendChild(video);
    }

    noteModal.classList.remove("hidden");
  }

  function closeModal() {
    noteModal.classList.add("hidden");
  }

  function renderNotesPanel() {
    notesList.innerHTML = "";

    notes.forEach((note) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded mb-2 border";
      li.style.cursor = "pointer";
      li.innerHTML = `
        <span class="fw-medium text-truncate me-2">${note.title}</span>
        <button class="btn btn-sm btn-outline-danger border-0 delete-btn"><i class="bi bi-trash"></i></button>
      `;

      li.addEventListener("click", (e) => {
        if (!e.target.closest(".delete-btn")) {
          openModalForView(note);
        }
      });

      li.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        notes = notes.filter((n) => n.id !== note.id);
        renderNotesPanel();
      });

      notesList.appendChild(li);
    });
  }

  // ==========================================
  // 3. TASK UI MANAGEMENT
  // ==========================================
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-light border mb-2 rounded";
    li.innerHTML = `
      <div class="form-check m-0">
        <input class="form-check-input me-2" type="checkbox">
        <label class="form-check-label">${text}</label>
      </div>
      <button class="btn btn-sm btn-outline-danger border-0 delete-btn"><i class="bi bi-trash"></i></button>
    `;

    const checkbox = li.querySelector(".form-check-input");
    const label = li.querySelector(".form-check-label");

    checkbox.addEventListener("change", () => {
      label.classList.toggle("text-decoration-line-through", checkbox.checked);
      label.classList.toggle("text-muted", checkbox.checked);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => li.remove());

    taskList.appendChild(li);
    taskInput.value = "";
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
});