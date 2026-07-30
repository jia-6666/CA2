export class PomodoroTimer extends HTMLElement {
    constructor() {
        super();
        this.seconds = 25 * 60;
        this.timeCap = 2 * 60 * 60;
        this.timerInterval = null;
        this.isRunning = false;

        // Element references
        this.timerDisplay = null;
        this.startBtn = null;
    }

    connectedCallback() {
        this.render();

        // Cache DOM elements within this component instance
        this.timerDisplay = this.querySelector("#timerDisplay");
        this.startBtn = this.querySelector("#startBtn");

        this.attachEventListeners();
        this.updateDisplay();
    }

    disconnectedCallback() {
        // Clean up intervals to prevent memory leaks when removed from DOM
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    attachEventListeners() {
        this.querySelector("#increaseTime")?.addEventListener("click", () => this.updateTime("increase"));
        this.querySelector("#decreaseTime")?.addEventListener("click", () => this.updateTime("decrease"));

        // Properly bind 'this' using an arrow function
        this.startBtn?.addEventListener("click", () => this.toggleTimer());
    }

    formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    updateDisplay() {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = this.formatTime(this.seconds);
        }
    }

    updateTime(direction = "increase") {
        if (this.isRunning) return; // Prevent time adjustments while running

        if (direction === "increase" && this.seconds + 5 < this.timeCap) {
            this.seconds += 5 * 60;
        } else if (direction === "decrease" && this.seconds > 5 * 60) {
            this.seconds -= 5 * 60;
        }
        this.updateDisplay();
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.startTimer();
        } else {
            this.pauseTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        if (this.startBtn) this.startBtn.textContent = 'Pause';

        this.timerInterval = setInterval(() => {
            if (this.seconds <= 0) {
                this.pauseTimer();
                alert('Timer finished!');
                return;
            }
            this.seconds--;
            this.updateDisplay();
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isRunning = false;
        if (this.startBtn) this.startBtn.textContent = 'Start';
    }

    renderTasks() {
        const taskComponent = document.createElement("div");
        taskComponent.classList.add("form-check mb-2");
        taskComponent.innerHTML = `
                          <input class="form-check-input" type="checkbox" id="task1">
                  <label class="form-check-label" for="task1">Task 1</label>
                  `
    }

    render() {
        this.innerHTML = `
        <section class="mb-5">
          <h1 class="section-title mb-4">Pomodoro Timer</h1>
          <div class="tool-card p-4">
            <div class="row align-items-center">

              <!-- Left Side: Timer Controls -->
              <div class="col-md-8 border-end-md pe-md-4">
                <div class="d-flex align-items-center justify-content-center gap-3 my-4">
                  <button class="btn btn-timer-control" id="decreaseTime">-</button>
                  <div class="timer-display" id="timerDisplay">00:25:00</div>
                  <button class="btn btn-timer-control" id="increaseTime">+</button>
                </div>

                <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
                  <div class="form-check form-switch custom-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="dndSwitch">
                    <label class="form-check-label text-white fw-semibold" for="dndSwitch">Do Not Disturb</label>
                  </div>
                </div>

                <div class="d-flex justify-content-center">
                  <button class="btn btn-start w-50 py-2 fs-5" id="startBtn">Start</button>
                </div>
              </div>

              <!-- Right Side: Task List -->
              <div class="col-md-4 ps-md-4 mt-4 mt-md-0">
                <div class="task-list text-white">
                ${this.renderTasks}
                  <button class="btn btn-add-task d-flex align-items-center gap-2 text-white p-0 border-0 bg-transparent"
                    id="addTaskBtn">
                    <span class="badge bg-primary-dark p-2"><i class="bi bi-plus"></i></span>
                    <span>Add new task</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
        `;
    }
}

customElements.define("pomodoro-timer", PomodoroTimer);