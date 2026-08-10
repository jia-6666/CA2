document.addEventListener("DOMContentLoaded", () => {
  // Config & Constants
  const MIN_MINUTES = 5;
  const MAX_MINUTES = 45;
  const PLANT_VIDEOS = {
    tree: "assets/videos/tree_growing.webm",
    rose: "assets/videos/rose_growing.webm",
    "sun-flower": "assets/videos/sunflower_growing.webm"
  };
  const MUSICS = ["bubblegum.mp3", "ditto.mp3", "supernatural.mp3"];

  // State Variables
  let selectedMinutes = 25;
  let timerDuration = selectedMinutes * 60;
  let timeRemaining = timerDuration;
  let timerInterval = null;
  let isRunning = false;
  let currentPlant = "tree";

  // Elements
  const timerDisplay = document.getElementById("timerDisplay");
  const timerDisplayMobile = document.getElementById("timerDisplayMobile");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const timeSlider = document.getElementById("timeSlider");
  const plantSelect = document.getElementById("plantSelect");
  const toggleTrigger = document.getElementById("toggle-trigger");
  const musicControl = document.getElementById("music");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const plantVideo = document.getElementById("plantVideo");
  const plantVideoSource = document.getElementById("plantVideoSource");
  const taskList = document.getElementById("taskList");
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");

  // Audio Initialization
  const randomMusic = MUSICS[Math.floor(Math.random() * MUSICS.length)];
  const audioSource = musicControl.querySelector("source");
  if (audioSource) {
    audioSource.src = `assets/audio/${randomMusic}`;
    musicControl.load();
  }

  plantVideo.playbackRate = 0.5;

  // Functions
  function updateVideo() {
    if (PLANT_VIDEOS[currentPlant]) {
      plantVideoSource.src = PLANT_VIDEOS[currentPlant];
      plantVideo.load();
    }
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  function updateDisplay() {
    const timeFormatted = formatTime(timeRemaining);
    timerDisplay.textContent = timeFormatted;
    if (window.innerWidth < 991) {
      timerDisplayMobile.textContent = timeFormatted;
    }
  }

  function setTimerMinutes(mins) {
    selectedMinutes = Math.min(Math.max(mins, MIN_MINUTES), MAX_MINUTES);
    timerDuration = selectedMinutes * 60;
    timeRemaining = timerDuration;
    timeSlider.value = selectedMinutes;
    updateDisplay();
  }

  function setControlsDisabled(disabled) {
    increaseBtn.disabled = disabled;
    decreaseBtn.disabled = disabled;
    timeSlider.disabled = disabled;
  }

  function tick() {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = "Start";
      startBtn.classList.replace("btn-danger", "btn-success");
      alert("Pomodoro completed! Your plant has fully grown!");
    }
  }

  function toggleTimer() {
    if (isRunning) {
      plantVideo.pause();
      musicControl.pause();
      setControlsDisabled(false);
      clearInterval(timerInterval);
      startBtn.textContent = "Start";
      startBtn.classList.replace("btn-danger", "btn-success");
    } else {
      plantVideo.play().catch(() => { });
      musicControl.play().catch(() => { });
      setControlsDisabled(true);
      timerInterval = setInterval(tick, 1000);
      startBtn.textContent = "Pause";
      startBtn.classList.replace("btn-success", "btn-danger");
    }
    isRunning = !isRunning;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    setControlsDisabled(false);
    startBtn.textContent = "Start";
    startBtn.classList.replace("btn-danger", "btn-success");
    setTimerMinutes(selectedMinutes);
    plantVideo.pause();
    musicControl.pause();
    plantVideo.currentTime = 0;
    musicControl.currentTime = 0;
  }

  // Task Store & Storage Handling
  const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
  const saveTasks = (tasks) => localStorage.setItem("tasks", JSON.stringify(tasks));

  function renderTaskItem(task) {
    const li = document.createElement("li");
    li.className = "form-check mb-2 d-flex align-items-center gap-2 task-item";
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input task-checkbox mt-0";
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;

    const label = document.createElement("label");
    // Added text-wrap and text-break classes
    label.className = "form-check-label text-decoration-line-through-checked mb-0 fs-5 text-wrap text-break";
    label.htmlFor = `task-${task.id}`;
    label.textContent = task.task;

    const removeIcon = document.createElement("i");
    removeIcon.className = "bi bi-x remove-task ms-auto flex-shrink-0"; // flex-shrink-0 keeps the icon fixed in place

    li.append(checkbox, label, removeIcon);
    return li;
  }

  function loadTasks() {
    taskList.innerHTML = "";
    const tasks = getTasks();
    const fragment = document.createDocumentFragment();
    tasks.forEach(task => fragment.appendChild(renderTaskItem(task)));
    taskList.appendChild(fragment);
  }

  // Event Listeners
  increaseBtn.addEventListener("click", () => !isRunning && setTimerMinutes(selectedMinutes + 5));
  decreaseBtn.addEventListener("click", () => !isRunning && setTimerMinutes(selectedMinutes - 5));
  timeSlider.addEventListener("input", (e) => !isRunning && setTimerMinutes(parseInt(e.target.value, 10)));

  plantSelect.addEventListener("change", (e) => {
    currentPlant = e.target.value;
    updateVideo();
  });

  startBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);

  toggleTrigger.addEventListener("change", (e) => {
    musicControl.volume = e.target.checked ? 1 : 0;
  });

  // Task Form Submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      task: taskText,
      completed: false
    };

    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    taskList.appendChild(renderTaskItem(newTask));
    taskInput.value = "";
  });

  // Delegated Task Actions (Toggle & Delete)
  taskList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const taskId = li.dataset.id;
    let tasks = getTasks();

    if (e.target.classList.contains("remove-task")) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks(tasks);
      li.remove();
    } else if (e.target.classList.contains("task-checkbox")) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = e.target.checked;
        saveTasks(tasks);
      }
    }
  });

  // Initial Load
  loadTasks();
});