document.addEventListener("DOMContentLoaded", () => {
  // --- TIMER CONSTANTS & STATE ---
  const MIN_MINUTES = 1;
  const MAX_MINUTES = 45;

  let selectedMinutes = 25; // default 25 mins
  let timerDuration = selectedMinutes * 60;
  let timeRemaining = timerDuration;
  let timerInterval = null;
  let isRunning = false;

  // --- DOM ELEMENTS ---
  const timerDisplay = document.getElementById("timerDisplay");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const timeSlider = document.getElementById("timeSlider");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  const canvas = document.getElementById("plantCanvas");
  const ctx = canvas.getContext("2d");

  // --- INITIALIZE CANVAS ---
  drawPlant(0); // 0% growth

  // --- TIMER FUNCTIONS ---
  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function setTimerMinutes(mins) {
    // Clamp between 5 and 45 minutes
    selectedMinutes = Math.min(Math.max(mins, MIN_MINUTES), MAX_MINUTES);
    timerDuration = selectedMinutes * 60;
    timeRemaining = timerDuration;

    // Update Slider UI
    timeSlider.value = selectedMinutes;

    updateDisplay();
    drawPlant(0);
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
    setControlsDisabled(true); // Disable adjustment controls while running

    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
        drawPlant(getProgress());
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        setControlsDisabled(false);
        drawPlant(1); // 100% full growth
        alert("Time is up! Your tree has fully grown.");
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

  // --- EVENT LISTENERS FOR ADJUSTMENTS ---
  increaseBtn.addEventListener("click", () => {
    if (!isRunning) {
      setTimerMinutes(selectedMinutes + 5);
    }
  });

  decreaseBtn.addEventListener("click", () => {
    if (!isRunning) {
      setTimerMinutes(selectedMinutes - 5);
    }
  });

  timeSlider.addEventListener("input", (e) => {
    if (!isRunning) {
      setTimerMinutes(parseInt(e.target.value, 10));
    }
  });

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // --- CANVAS GROWING PLANT DRAWING LOGIC ---
  function drawPlant(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground / Hill
    ctx.fillStyle = "#8d5b4c";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height + 40, 200, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height + 40, 190, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    if (progress <= 0) return;

    const startX = canvas.width / 2;
    const startY = canvas.height - 20;

    // Trunk growth calculated from progress
    const maxTrunkHeight = 120;
    const trunkHeight = maxTrunkHeight * progress;
    const endY = startY - trunkHeight;

    // Draw Trunk
    ctx.strokeStyle = "#5c3d2e";
    ctx.lineWidth = Math.max(4, 14 * progress);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX - 10, startY - trunkHeight / 2, startX, endY);
    ctx.stroke();

    // Draw Foliage / Tree Canopy based on progress threshold
    if (progress > 0.3) {
      const foliageProgress = (progress - 0.3) / 0.7; // Normalized from 0 to 1
      const maxRadius = 60;
      const radius = maxRadius * foliageProgress;

      ctx.fillStyle = "#22c55e";

      // Center Foliage
      ctx.beginPath();
      ctx.arc(startX, endY - radius / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Side Foliage Clusters
      if (progress > 0.5) {
        ctx.fillStyle = "#16a34a";
        ctx.beginPath();
        ctx.arc(startX - radius * 0.7, endY, radius * 0.7, 0, Math.PI * 2);
        ctx.arc(startX + radius * 0.7, endY, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // --- NOTES UI HANDLER ---
  const noteInput = document.getElementById("noteInput");
  const addNoteBtn = document.getElementById("addNoteBtn");
  const notesList = document.getElementById("notesList");

  addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-light border mb-2 rounded";
    li.innerHTML = `
      <span>${text}</span>
      <button class="btn btn-sm btn-outline-danger border-0 delete-btn"><i class="bi bi-trash"></i></button>
    `;
    li.querySelector(".delete-btn").addEventListener("click", () => li.remove());

    notesList.appendChild(li);
    noteInput.value = "";
  });

  // --- TASK UI HANDLER ---
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-light border mb-2 rounded";
    li.innerHTML = `
      <div class="form-check m-0">
        <input class="form-check-input me-2" type="checkbox" id="task-check">
        <label class="form-check-label">${text}</label>
      </div>
      <button class="btn btn-sm btn-outline-danger border-0 delete-btn"><i class="bi bi-trash"></i></button>
    `;

    const checkbox = li.querySelector(".form-check-input");
    const label = li.querySelector(".form-check-label");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        label.classList.add("text-decoration-line-through", "text-muted");
      } else {
        label.classList.remove("text-decoration-line-through", "text-muted");
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => li.remove());

    taskList.appendChild(li);
    taskInput.value = "";
  });
});