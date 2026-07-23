// Initial State
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [
  {
    id: 'quiz-a',
    title: 'QUIZ A',
    questions: [
      {
        type: 'mcq',
        text: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Text Machine Language',
          'Hyper Transfer Mark Language',
          'Home Tool Markup Language'
        ],
        correct: 0,
        timeLimit: 15,
        media: null
      },
      {
        type: 'open',
        text: 'What keyword defines a constant variable in JavaScript?',
        correctAnswer: 'const',
        timeLimit: 20,
        media: null
      }
    ]
  }
];

let activeQuiz = null;
let currentQuestionIndex = 0;
let userScore = 0;
let userResponse = null;
let editingQuizId = null;

// Timer State
let timerInterval = null;
let timeRemaining = 0;

// DOM Elements
const homeView = document.getElementById('home-view');
const createView = document.getElementById('create-view');
const playView = document.getElementById('play-view');
const resultsView = document.getElementById('results-view');

const quizGrid = document.getElementById('quiz-grid');
const modalTitle = document.getElementById('modal-title');
const btnOpenCreate = document.getElementById('btn-open-create');
const btnCancelCreate = document.getElementById('btn-cancel-create');
const btnSaveQuiz = document.getElementById('btn-save-quiz');
const btnAddQuestion = document.getElementById('btn-add-question');
const navCreateBtn = document.getElementById("nav-create-btn");
const questionsContainer = document.getElementById('questions-container');
const quizTitleInput = document.getElementById('quiz-title-input');

const playQuizTitle = document.getElementById('play-quiz-title');
const questionProgress = document.getElementById('question-progress');
const playQuestionText = document.getElementById('play-question-text');
const playInputContainer = document.getElementById('play-input-container');
const playMediaContainer = document.getElementById('play-media-container');
const timerDisplay = document.getElementById('timer-display');
const btnNextQuestion = document.getElementById('btn-next-question');
const btnExitQuiz = document.getElementById('btn-exit-quiz');

const scoreDisplay = document.getElementById('score-display');
const btnBackHome = document.getElementById('btn-back-home');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  attachEventListeners();
});

function saveQuizzes() {
  localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

function switchView(viewToShow) {
  [homeView, createView, playView, resultsView].forEach(view => view.classList.add('hidden'));
  viewToShow.classList.remove('hidden');
}

// --- HOME VIEW ---
function renderHome() {
  clearInterval(timerInterval);
  const existingCards = quizGrid.querySelectorAll('.quiz-card');
  existingCards.forEach(card => card.remove());

  quizzes.forEach(quiz => {
    const card = document.createElement('div');
    card.className = 'quiz-card relative group w-48 h-48 rounded-3xl border-2 border-gray-300 hover:border-black flex items-center justify-center p-4 transition-all duration-200 bg-white shadow-sm hover:shadow-md cursor-pointer';
    
    card.innerHTML = `
      <span class="text-xl font-bold tracking-wider text-gray-700 uppercase break-words text-center select-none">${quiz.title}</span>
      
      <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button class="btn-edit-quiz p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black" title="Edit Quiz">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button class="btn-delete-quiz p-1.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600" title="Delete Quiz">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;

    card.onclick = (e) => {
      if (e.target.closest('.btn-edit-quiz') || e.target.closest('.btn-delete-quiz')) return;
      startQuiz(quiz);
    };

    card.querySelector('.btn-edit-quiz').onclick = (e) => {
      e.stopPropagation();
      openEditModal(quiz);
    };

    card.querySelector('.btn-delete-quiz').onclick = (e) => {
      e.stopPropagation();
      deleteQuiz(quiz.id);
    };
    
    quizGrid.insertBefore(card, btnOpenCreate);
  });

  switchView(homeView);
}

function deleteQuiz(quizId) {
  if (confirm('Are you sure you want to delete this quiz?')) {
    quizzes = quizzes.filter(q => q.id !== quizId);
    saveQuizzes();
    renderHome();
  }
}

// --- CREATE / EDIT QUIZ MODAL ---
function openCreateModal() {
  editingQuizId = null;
  modalTitle.textContent = 'Create New Quiz';
  quizTitleInput.value = '';
  questionsContainer.innerHTML = '';
  addQuestionField();
  switchView(homeView);
  createView.classList.remove('hidden');
}

function openEditModal(quiz) {
  editingQuizId = quiz.id;
  modalTitle.textContent = 'Edit Quiz';
  quizTitleInput.value = quiz.title;
  questionsContainer.innerHTML = '';

  quiz.questions.forEach(qData => {
    addQuestionField(qData);
  });

  switchView(homeView);
  createView.classList.remove('hidden');
}

function reindexQuestions() {
  const questionBlocks = Array.from(questionsContainer.children);
  questionBlocks.forEach((block, index) => {
    const titleSpan = block.querySelector('.question-num');
    if (titleSpan) titleSpan.textContent = `Question ${index + 1}`;
    
    const radios = block.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.name = `correct-${index}`);
  });
}

function addQuestionField(data = null) {
  const qIndex = questionsContainer.children.length;
  const qDiv = document.createElement('div');
  qDiv.className = 'q-block p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3 relative';
  
  const qType = data ? (data.type || 'mcq') : 'mcq';
  const questionText = data ? data.text : '';
  const options = data && data.options ? data.options : ['', '', '', ''];
  const correctIdx = data && data.correct !== undefined ? data.correct : 0;
  const openAnswer = data && data.correctAnswer ? data.correctAnswer : '';
  const timeLimit = data ? (data.timeLimit || 15) : 15;
  let mediaData = data ? (data.media || null) : null;

  qDiv.innerHTML = `
    <div class="flex flex-wrap justify-between items-center gap-2">
      <span class="question-num font-semibold text-sm text-gray-700">Question ${qIndex + 1}</span>
      <div class="flex items-center gap-3">
        <select class="q-type text-xs border rounded p-1 font-medium bg-white">
          <option value="mcq" ${qType === 'mcq' ? 'selected' : ''}>Multiple Choice</option>
          <option value="open" ${qType === 'open' ? 'selected' : ''}>Open Ended</option>
        </select>
        <div class="flex items-center gap-1">
          <label class="text-xs text-gray-500 font-medium">Timer (s):</label>
          <input type="number" class="q-time w-14 border border-gray-300 rounded p-1 text-xs text-center" value="${timeLimit}" min="5" max="300">
        </div>
        <button type="button" class="btn-delete-question text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
      </div>
    </div>
    
    <input type="text" class="q-text w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="Enter question string" value="${questionText}">
    
    <!-- Drag and Drop Media Area -->
    <div class="drag-zone border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-gray-400 transition-colors bg-white">
      <input type="file" class="file-input hidden" accept="image/*,video/*,.gif">
      <div class="media-preview-area">
        ${renderMediaPreview(mediaData)}
      </div>
    </div>

    <!-- Dynamic Options Container based on question type -->
    <div class="answer-space">
      ${renderAnswerInputs(qType, qIndex, options, correctIdx, openAnswer)}
    </div>
  `;

  // Attach Media Drag and Drop Logic
  const dragZone = qDiv.querySelector('.drag-zone');
  const fileInput = qDiv.querySelector('.file-input');
  const previewArea = qDiv.querySelector('.media-preview-area');

  dragZone.onclick = (e) => {
    if (!e.target.closest('.btn-remove-media')) fileInput.click();
  };

  dragZone.ondragover = (e) => { e.preventDefault(); dragZone.classList.add('dragover'); };
  dragZone.ondragleave = () => dragZone.classList.remove('dragover');
  dragZone.ondrop = (e) => {
    e.preventDefault();
    dragZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  fileInput.onchange = () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  };

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      mediaData = { type, src: e.target.result };
      previewArea.innerHTML = renderMediaPreview(mediaData);
      attachRemoveMedia();
    };
    reader.readAsDataURL(file);
  }

  function attachRemoveMedia() {
    const btnRemove = previewArea.querySelector('.btn-remove-media');
    if (btnRemove) {
      btnRemove.onclick = (e) => {
        e.stopPropagation();
        mediaData = null;
        fileInput.value = '';
        previewArea.innerHTML = renderMediaPreview(null);
      };
    }
  }
  attachRemoveMedia();

  // Type Switch Handler
  const typeSelect = qDiv.querySelector('.q-type');
  const answerSpace = qDiv.querySelector('.answer-space');

  typeSelect.onchange = () => {
    const newType = typeSelect.value;
    answerSpace.innerHTML = renderAnswerInputs(newType, qIndex, ['', '', '', ''], 0, '');
  };

  // Delete question
  const deleteBtn = qDiv.querySelector('.btn-delete-question');
  deleteBtn.onclick = () => {
    if (questionsContainer.children.length === 1) {
      return alert('A quiz must have at least one question.');
    }
    qDiv.remove();
    reindexQuestions();
  };

  // Store current media context on node
  qDiv.getMedia = () => mediaData;

  questionsContainer.appendChild(qDiv);
}

function renderMediaPreview(media) {
  if (!media) {
    return `<p class="text-xs text-gray-500 font-medium">Drag & drop image, video, or GIF here, or <span class="text-black underline">browse</span></p>`;
  }
  
  if (media.type === 'video') {
    return `
      <div class="relative inline-block max-h-36">
        <video src="${media.src}" class="max-h-36 rounded-lg mx-auto" controls></video>
        <button type="button" class="btn-remove-media absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow hover:bg-red-700">✕</button>
      </div>`;
  }
  return `
    <div class="relative inline-block max-h-36">
      <img src="${media.src}" class="max-h-36 rounded-lg mx-auto object-contain" />
      <button type="button" class="btn-remove-media absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow hover:bg-red-700">✕</button>
    </div>`;
}

function renderAnswerInputs(type, qIndex, options, correctIdx, openAnswer) {
  if (type === 'mcq') {
    return `
      <div class="space-y-2">
        ${[0, 1, 2, 3].map(i => `
          <div class="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded-lg">
            <input type="radio" name="correct-${qIndex}" value="${i}" ${i === correctIdx ? 'checked' : ''} class="w-4 h-4 accent-black cursor-pointer">
            <input type="text" class="q-opt-${i} flex-1 text-sm focus:outline-none" placeholder="Option ${i + 1}" value="${options[i] || ''}">
          </div>
        `).join('')}
      </div>`;
  } else {
    return `
      <div class="bg-white p-3 border border-gray-200 rounded-lg">
        <label class="block text-xs text-gray-500 font-medium mb-1">Expected Correct Answer String:</label>
        <input type="text" class="q-open-ans w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="e.g. const" value="${openAnswer}">
      </div>`;
  }
}

function saveQuiz() {
  const title = quizTitleInput.value.trim();
  if (!title) return alert('Please enter a quiz title.');

  const questionBlocks = Array.from(questionsContainer.children);
  const questions = [];

  for (let block of questionBlocks) {
    const type = block.querySelector('.q-type').value;
    const text = block.querySelector('.q-text').value.trim();
    const timeLimit = parseInt(block.querySelector('.q-time').value) || 15;
    const media = block.getMedia ? block.getMedia() : null;

    if (!text) return alert('Please fill in all question strings.');

    if (type === 'mcq') {
      const options = [0, 1, 2, 3].map(i => block.querySelector(`.q-opt-${i}`).value.trim());
      const correctRadio = block.querySelector(`input[type="radio"]:checked`);
      
      if (!correctRadio) return alert('Please select a correct option for multiple choice questions.');
      if (options.some(opt => !opt)) return alert('Please fill in all multiple choice options.');

      questions.push({
        type: 'mcq',
        text,
        options,
        correct: parseInt(correctRadio.value),
        timeLimit,
        media
      });
    } else {
      const correctAnswer = block.querySelector('.q-open-ans').value.trim();
      if (!correctAnswer) return alert('Please specify the expected answer for open-ended questions.');

      questions.push({
        type: 'open',
        text,
        correctAnswer,
        timeLimit,
        media
      });
    }
  }

  if (questions.length === 0) return alert('Add at least one question.');

  if (editingQuizId) {
    const quizIdx = quizzes.findIndex(q => q.id === editingQuizId);
    if (quizIdx !== -1) {
      quizzes[quizIdx] = { id: editingQuizId, title, questions };
    }
  } else {
    const newQuiz = {
      id: 'quiz-' + Date.now(),
      title,
      questions
    };
    quizzes.push(newQuiz);
  }

  saveQuizzes();
  createView.classList.add('hidden');
  renderHome();
}

// --- PLAY QUIZ VIEW ---
function startQuiz(quiz) {
  activeQuiz = quiz;
  currentQuestionIndex = 0;
  userScore = 0;
  playQuizTitle.textContent = quiz.title;
  switchView(playView);
  renderQuestion();
}

function startTimer(duration) {
  clearInterval(timerInterval);
  timeRemaining = duration;
  timerDisplay.textContent = `${timeRemaining}s`;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = `${timeRemaining}s`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function renderQuestion() {
  userResponse = null;
  const q = activeQuiz.questions[currentQuestionIndex];
  
  questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${activeQuiz.questions.length}`;
  playQuestionText.textContent = q.text;
  playInputContainer.innerHTML = '';

  // Render Media if Present
  if (q.media) {
    playMediaContainer.classList.remove('hidden');
    if (q.media.type === 'video') {
      playMediaContainer.innerHTML = `<video src="${q.media.src}" class="max-h-52 rounded-xl mx-auto border" controls autoPlay></video>`;
    } else {
      playMediaContainer.innerHTML = `<img src="${q.media.src}" class="max-h-52 rounded-xl mx-auto border object-contain" />`;
    }
  } else {
    playMediaContainer.classList.add('hidden');
    playMediaContainer.innerHTML = '';
  }

  // Render Answers based on Type
  if (q.type === 'mcq') {
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 font-medium text-sm transition-all duration-150';
      btn.textContent = opt;
      btn.onclick = () => {
        userResponse = idx;
        Array.from(playInputContainer.children).forEach(c => c.classList.remove('border-black', 'bg-gray-100'));
        btn.classList.add('border-black', 'bg-gray-100');
      };
      playInputContainer.appendChild(btn);
    });
  } else {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your answer here...';
    input.className = 'w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm';
    input.oninput = (e) => {
      userResponse = e.target.value.trim();
    };
    playInputContainer.appendChild(input);
  }

  startTimer(q.timeLimit || 15);
}

function nextQuestion() {
  clearInterval(timerInterval);
  const q = activeQuiz.questions[currentQuestionIndex];

  // Evaluate Score
  if (q.type === 'mcq') {
    if (userResponse !== null && userResponse === q.correct) {
      userScore++;
    }
  } else {
    if (userResponse && userResponse.toLowerCase() === q.correctAnswer.toLowerCase()) {
      userScore++;
    }
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < activeQuiz.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// --- RESULTS VIEW ---
function showResults() {
  clearInterval(timerInterval);
  scoreDisplay.textContent = `${userScore} / ${activeQuiz.questions.length}`;
  switchView(resultsView);
}

// Event Listeners
function attachEventListeners() {
  btnOpenCreate.onclick = openCreateModal;
  navCreateBtn.onclick = openCreateModal;
  btnCancelCreate.onclick = () => createView.classList.add('hidden');
  btnAddQuestion.onclick = () => addQuestionField();
  btnSaveQuiz.onclick = saveQuiz;

  btnNextQuestion.onclick = nextQuestion;
  btnExitQuiz.onclick = () => {
    clearInterval(timerInterval);
    renderHome();
  };
  btnBackHome.onclick = renderHome;
}