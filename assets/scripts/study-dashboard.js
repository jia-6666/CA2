document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. POMODORO TIMER & PLANT CANVAS LOGIC
  // ==========================================
  const MIN_MINUTES = 1;
  const MAX_MINUTES = 45;

  let selectedMinutes = 25;
  let timerDuration = selectedMinutes * 60;
  let timeRemaining = timerDuration;
  let twentySeconds = 0;
  let timerInterval = null;
  let isRunning = false;
  let currentPlant = "tree"; // Default: tree, wheat, or flower

  const timerDisplay = document.getElementById("timerDisplay");
  const timerDisplayMobile = document.getElementById("timerDisplayMobile");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const timeSlider = document.getElementById("timeSlider");
  const plantSelect = document.getElementById("plantSelect");

  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  const plantVideo = document.getElementById('plantVideo');
  plantVideo.playbackRate = 0.5;

  const updateVideo = () => {
    const plantVideoSource = document.getElementById("plantVideoSource");
    switch (currentPlant) {
      case "tree":
        plantVideoSource.src = "assets/videos/tree_growing.webm";
        break;
      case "rose":
        plantVideoSource.src = "assets/videos/rose_growing.webm";
        break;
      case "sun-flower":
        plantVideoSource.src = "assets/videos/sunflower_growing.webm";
        break;
    }
    plantVideo.load();
  }

  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    if (window.innerWidth < 991) {
      timerDisplayMobile.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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

  // Timer Controls
  function toggleTimer() {
    if (isRunning) {
      plantVideo.pause();
      setControlsDisabled(false);
      clearInterval(timerInterval);
      startBtn.textContent = 'Start';
      startBtn.classList.replace('btn-danger', 'btn-success');
    } else {
      plantVideo.play();
      setControlsDisabled(true);
      timerInterval = setInterval(tick, 1000);
      startBtn.textContent = 'Pause';
      startBtn.classList.replace('btn-success', 'btn-danger');
    }
    isRunning = !isRunning;
  }

  function tick() {
    if (timeRemaining > 0) {
      timeRemaining--;
      twentySeconds++;
      if (twentySeconds == 20) {
        twentySeconds = 0;
      }
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
      startBtn.classList.replace('btn-danger', 'btn-success');
      alert('Pomodoro completed! Your plant has fully grown!');
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    setControlsDisabled(false);
    startBtn.textContent = 'Start';
    startBtn.classList.replace('btn-danger', 'btn-success');
    setTimerMinutes(selectedMinutes);
    timeRemaining = timerDuration;
    updateDisplay();
    plantVideo.pause();
    plantVideo.currentTime = 0;
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
    updateVideo();
  });

  startBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);

  const taskList = document.getElementById("taskList");
  const taskForm = document.getElementById("taskForm");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updateStatus = (id) => {
    tasks.find(task => task.id == id).completed = !tasks.find(task => task.id == id).completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  const removeTask = (id) => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task.id != id);
    const taskLi = document.getElementById(id).parentElement;
    taskList.removeChild(taskLi);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }
  // Task Adding
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    let uuid;
    if (taskInput.value) {
      const currentDateTime = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '-');
      uuid = currentDateTime.concat(Math.floor(Math.random() * 1000)).concat(taskInput.value.replaceAll(' ', ''))
      const newTask = document.createElement("li");
      newTask.classList = "form-check mb-2";
      newTask.innerHTML = `
      <input class="form-check-input" type="checkbox" id="${uuid}">
      <label class="form-check-label text-decoration-line-through-checked" for="${uuid}">${taskInput.value}</label>
      <i class="bi bi-x remove-task" id="${uuid}-remove"></i>
      `;
      taskList.appendChild(newTask);
      const newTaskJson = {
        id: uuid,
        task: taskInput.value,
        completed: false
      }
      tasks.push(newTaskJson);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskInput.value = "";
    }
    if (uuid) {
      const taskInput = document.getElementById(uuid);
      taskInput.addEventListener("click", () => removeTask(uuid));
      const taskRemove = document.getElementById(`${uuid}-remove`);
      taskRemove.addEventListener("click", () => removeTask(uuid));
    }
  });

  if (taskList.children.length == 0) {
    tasks.forEach((task) => {
      console.log(task)
      const newTask = document.createElement("li");
      newTask.classList = "form-check mb-2";
      newTask.innerHTML = `
      <input class="form-check-input" type="checkbox" id="${task.id}" ${task.completed && "checked"}>
      <label class="form-check-label text-decoration-line-through-checked" for="${task.id}"}>${task.task}</label>
      <i class="bi bi-x remove-task" id="${task.id}-remove"></i>
      `;
      taskList.appendChild(newTask);
      const taskInput = document.getElementById(task.id);
      taskInput.addEventListener("click", () => updateStatus(task.id));
      const taskRemove = document.getElementById(`${task.id}-remove`);
      taskRemove.addEventListener("click", () => removeTask(task.id));
    });
  }
});
