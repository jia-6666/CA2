document.addEventListener('DOMContentLoaded', () => {
    pomodoroTimerSetup();
    gpaCalculatorSetup();
});

function pomodoroTimerSetup() {
    let seconds = 25 * 60; // 25 minutes default
    let timerInterval = null;
    let isRunning = false;

    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startBtn');
    const decreaseBtn = document.getElementById('decreaseTime');
    const increaseBtn = document.getElementById('increaseTime');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskMenu = document.getElementById('addTaskMenu');

    // Format time in HH:MM:SS
    const formatTime = () => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const updateDisplay = () => {
        timerDisplay.textContent = formatTime();
    };

    document.getElementById('cancelTaskBtn').addEventListener('click', () => addTaskMenu.close());
    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('taskTitleInput');
        if (input.value.trim()) {
            createTask(input.value.trim());
            input.value = '';
            addTaskMenu.close();
        }
    });


    const createTask = (taskTitle) => {
        const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const taskComponent = document.createElement("div");
        taskComponent.className = "form-check d-flex align-items-center justify-content-between mb-2";

        taskComponent.innerHTML = `
            <div>
                <input class="form-check-input me-2" type="checkbox" id="${taskId}">
                <label class="form-check-label text-white text-decoration-line-through-checked" for="${taskId}">${taskTitle}</label>
            </div>
            <button class="btn btn-link text-danger btn-sm p-0 ms-2 delete-task-btn" title="Delete Task">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        taskList.prepend(taskComponent);
    };

    // Event Delegation for Deleting & Toggling Tasks
    taskList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-task-btn');
        if (deleteBtn) {
            deleteBtn.closest('.form-check').remove();
        }
    });

    increaseBtn.addEventListener('click', () => {
        seconds += 5 * 60;
        updateDisplay();
    });

    decreaseBtn.addEventListener('click', () => {
        if (seconds > 5 * 60) {
            seconds -= 5 * 60;
            updateDisplay();
        }
    });

    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = 'Pause';

            timerInterval = setInterval(() => {
                if (seconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    alert('Timer finished!');
                    return;
                }
                seconds--;
                updateDisplay();
            }, 1000);
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.textContent = 'Start';
        }
    });

    addTaskBtn.addEventListener('click', () => {
        addTaskMenu.showModal();
    });

    updateDisplay();
}

function gpaCalculatorSetup() {
    const ca1Input = document.getElementById('ca1');
    const ca2Input = document.getElementById('ca2');
    const ca3Input = document.getElementById('ca3');

    if (!ca1Input || !ca2Input || !ca3Input) return;

    // Convert Grade/Marks into numerical GPA score (scale 0 - 5.0)
    const calculateWeightedGPA = () => {
        const ca1 = parseFloat(ca1Input.value) || 0;
        const ca2 = parseFloat(ca2Input.value) || 0;
        const ca3 = parseFloat(ca3Input.value) || 0;

        // Weighted Average (40% CA1, 40% CA2, 20% CA3)
        const finalScore = (ca1 * 0.4) + (ca2 * 0.4) + (ca3 * 0.2);
        return finalScore;
    };

    [ca1Input, ca2Input, ca3Input].forEach(input => {
        input.addEventListener('input', calculateWeightedGPA);
    });
}