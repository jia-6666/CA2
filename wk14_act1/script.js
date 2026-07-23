// Initial Quiz Questions Data
let quizData = [
  {
    type: "buttons",
    question: "Which HTML element is used to insert a JavaScript script?",
    options: ["<script>", "<js>", "<javascript>", "<code>"],
    correct: "<script>"
  },
  {
    type: "slider",
    question: "In what year was JavaScript first created?",
    min: 1990,
    max: 2000,
    initial: 1995,
    correct: 1995
  },
  {
    type: "buttons",
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    correct: "font-size"
  }
];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selectedAnswer = null;

// DOM Elements
const tabPlay = document.getElementById('tab-play');
const tabAdd = document.getElementById('tab-add');
const quizCard = document.getElementById('quiz-card');
const formCard = document.getElementById('form-card');

const questionCountEl = document.getElementById('question-count');
const questionTextEl = document.getElementById('question-text');
const buttonOptionsContainer = document.getElementById('button-options');
const sliderOptionsContainer = document.getElementById('slider-options');
const sliderInput = document.getElementById('interactive-slider');
const sliderValDisplay = document.getElementById('slider-val');
const submitBtn = document.getElementById('submit-btn');
const feedbackEl = document.getElementById('feedback');
const timeLeftEl = document.getElementById('time-left');
const progressBar = document.getElementById('progress-bar');
const quizBody = document.getElementById('quiz-body');
const resultsBody = document.getElementById('results-body');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Form DOM Elements
const addQuestionForm = document.getElementById('add-question-form');
const qTypeSelect = document.getElementById('q-type');
const formButtonsGroup = document.getElementById('form-buttons-group');
const formSliderGroup = document.getElementById('form-slider-group');
const formFeedback = document.getElementById('form-feedback');

// Navigation Toggle Logic
tabPlay.addEventListener('click', () => {
  tabPlay.classList.add('active');
  tabAdd.classList.remove('active');
  quizCard.classList.remove('hide');
  formCard.classList.add('hide');
});

tabAdd.addEventListener('click', () => {
  tabAdd.classList.add('active');
  tabPlay.classList.remove('active');
  formCard.classList.remove('hide');
  quizCard.classList.add('hide');
});

// Form Field Switching
qTypeSelect.addEventListener('change', (e) => {
  if (e.target.value === 'buttons') {
    formButtonsGroup.classList.remove('hide');
    formSliderGroup.classList.add('hide');
  } else {
    formButtonsGroup.classList.add('hide');
    formSliderGroup.classList.remove('hide');
  }
});

// Upload / Add New Question Form Submission
addQuestionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = qTypeSelect.value;
  const question = document.getElementById('q-text').value.trim();

  if (type === 'buttons') {
    const rawOptions = document.getElementById('q-options').value.trim();
    const correct = document.getElementById('q-correct-button').value.trim();
    const options = rawOptions.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

    if (options.length < 2 || !options.includes(correct)) {
      formFeedback.innerText = "Please provide valid options and ensure correct answer matches one option!";
      formFeedback.className = "feedback incorrect";
      return;
    }

    quizData.push({ type, question, options, correct });
  } else if (type === 'slider') {
    const min = parseInt(document.getElementById('q-min').value);
    const max = parseInt(document.getElementById('q-max').value);
    const correct = parseInt(document.getElementById('q-correct-slider').value);

    if (isNaN(correct) || correct < min || correct > max) {
      formFeedback.innerText = "Correct answer must be a number between Min and Max!";
      formFeedback.className = "feedback incorrect";
      return;
    }

    const initial = Math.floor((min + max) / 2);
    quizData.push({ type, question, min, max, initial, correct });
  }

  formFeedback.innerText = "Question added successfully! 🎉";
  formFeedback.className = "feedback correct";
  addQuestionForm.reset();

  setTimeout(() => { formFeedback.innerText = ''; }, 3000);
});

// Start / Reset Quiz
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultsBody.classList.add('hide');
  quizBody.classList.remove('hide');
  loadQuestion();
}

// Load Question
function loadQuestion() {
  resetState();
  const currentQ = quizData[currentQuestionIndex];

  questionCountEl.innerText = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
  questionTextEl.innerText = currentQ.question;
  progressBar.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;

  if (currentQ.type === "buttons") {
    buttonOptionsContainer.classList.remove('hide');
    sliderOptionsContainer.classList.add('hide');

    currentQ.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('btn-option');
      btn.innerText = opt;
      btn.addEventListener('click', () => selectButtonOption(btn, opt));
      buttonOptionsContainer.appendChild(btn);
    });
  } else if (currentQ.type === "slider") {
    sliderOptionsContainer.classList.remove('hide');
    buttonOptionsContainer.classList.add('hide');

    sliderInput.min = currentQ.min;
    sliderInput.max = currentQ.max;
    sliderInput.value = currentQ.initial;
    sliderValDisplay.innerText = currentQ.initial;
    selectedAnswer = currentQ.initial;

    sliderInput.oninput = (e) => {
      sliderValDisplay.innerText = e.target.value;
      selectedAnswer = parseInt(e.target.value);
    };
  }

  startTimer();
}

function selectButtonOption(selectedBtn, value) {
  document.querySelectorAll('.btn-option').forEach(btn => btn.classList.remove('selected'));
  selectedBtn.classList.add('selected');
  selectedAnswer = value;
}

function startTimer() {
  timeLeft = 15;
  timeLeftEl.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      processAnswer(true);
    }
  }, 1000);
}

function resetState() {
  clearInterval(timer);
  feedbackEl.innerText = '';
  feedbackEl.className = 'feedback';
  selectedAnswer = null;
  buttonOptionsContainer.innerHTML = '';
  submitBtn.disabled = false;
}

function processAnswer(isTimeout = false) {
  clearInterval(timer);
  submitBtn.disabled = true;
  const currentQ = quizData[currentQuestionIndex];

  if (isTimeout) {
    feedbackEl.innerText = "⏰ Time's up!";
    feedbackEl.classList.add('incorrect');
  } else if (selectedAnswer === currentQ.correct) {
    feedbackEl.innerText = "✨ Correct!";
    feedbackEl.classList.add('correct');
    score += 100 + timeLeft * 10;
  } else {
    feedbackEl.innerText = `❌ Incorrect! Answer was: ${currentQ.correct}`;
    feedbackEl.classList.add('incorrect');
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 1800);
}

function showResults() {
  progressBar.style.width = '100%';
  quizBody.classList.add('hide');
  resultsBody.classList.remove('hide');
  finalScoreEl.innerText = `Your Score: ${score} Points`;
}

submitBtn.addEventListener('click', () => {
  if (selectedAnswer === null) {
    feedbackEl.innerText = "Please select an answer first!";
    feedbackEl.classList.add('incorrect');
    return;
  }
  processAnswer();
});

restartBtn.addEventListener('click', startQuiz);

startQuiz();