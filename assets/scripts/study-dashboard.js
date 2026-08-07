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
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const timeSlider = document.getElementById("timeSlider");
  const plantSelect = document.getElementById("plantSelect");

  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  const plantVideo = document.getElementById('plantVideo');

  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {

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
  });

  startBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);
});
