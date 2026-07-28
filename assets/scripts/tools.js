document.addEventListener('DOMContentLoaded', () => {
  // Pomodoro Timer Logic
  let minutes = 25;
  let seconds = 0;
  let timerInterval = null;
  let isRunning = false;

  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const decreaseBtn = document.getElementById('decreaseTime');
  const increaseBtn = document.getElementById('increaseTime');

  function updateDisplay() {
    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');
    timerDisplay.textContent = `${minStr}:${secStr}`;
  }

  increaseBtn.addEventListener('click', () => {
    minutes += 5;
    updateDisplay();
  });

  decreaseBtn.addEventListener('click', () => {
    if (minutes > 5) {
      minutes -= 5;
      updateDisplay();
    }
  });

  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      startBtn.textContent = 'Pause';
      timerInterval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.textContent = 'Start';
            alert('Timer finished!');
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        updateDisplay();
      }, 1000);
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
    }
  });
});