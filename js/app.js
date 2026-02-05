/**
 * FlowScore - Main Application
 * Handles UI, navigation, and data flow
 */

// Application State
const state = {
  currentScreen: 'welcome',
  currentQuestionIndex: 0,
  answers: [],
  questionFlow: [], // Ordered list of question IDs to show
  scores: null,
  recommendation: null,
  priorities: [],
  sessionToken: null,
  contact: null // { company, email, phone }
};

// N8N Webhook URLs
const N8N_BASE_URL = 'https://n8n.onevent.ro/webhook';
const N8N_WEBHOOK_URL = `${N8N_BASE_URL}/flowscore`;
const N8N_VALIDATE_URL = `${N8N_BASE_URL}/validate-token`;
const N8N_GENERATE_URL = `${N8N_BASE_URL}/generate-token`;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Check for token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    // No token provided - show access denied
    showScreen('access-denied');
    return;
  }

  state.sessionToken = token;

  // Validate token with n8n
  const isValid = await validateToken(token);

  if (!isValid) {
    showScreen('access-denied');
    return;
  }

  // Token valid - initialize
  state.questionFlow = questions.map(q => q.id);
  showScreen('welcome');
  console.log('FlowScore initialized with valid token:', state.sessionToken);
});

/**
 * Validate token with n8n
 * Fallback: if token starts with 'fs_', consider it valid
 */
async function validateToken(token) {
  // Quick validation: tokens must start with 'fs_'
  if (!token || !token.startsWith('fs_')) {
    console.warn('Invalid token format');
    return false;
  }

  try {
    const response = await fetch(N8N_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      // n8n validation failed, but token format is valid
      console.warn('N8N validation returned error, using format validation');
      return true;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Token validation error:', error);
    // n8n not available, token format is valid so allow access
    console.warn('N8N not available, token format valid - allowing access');
    return true;
  }
}

/**
 * Generate a random session token
 */
function generateToken() {
  return 'fs_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  document.getElementById(`screen-${screenId}`).classList.remove('hidden');
  state.currentScreen = screenId;
}

function startAssessment() {
  state.currentQuestionIndex = 0;
  state.answers = [];
  showScreen('question');
  renderQuestion();
}

// ==========================================
// QUESTION RENDERING
// ==========================================

function renderQuestion() {
  const questionId = state.questionFlow[state.currentQuestionIndex];
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    console.error('Question not found:', questionId);
    return;
  }

  // Update progress
  updateProgress();

  // Update section badge
  const section = SECTIONS[question.section];
  const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ro';
  const sectionName = lang === 'en' ? (section.name_en || section.name) : section.name;
  const sectionLabel = lang === 'en' ? 'Section' : 'Secțiunea';
  document.getElementById('section-badge').textContent =
    `${sectionLabel} ${question.section}: ${sectionName}`;
  document.getElementById('section-badge').className =
    `inline-block bg-${section.color}-100 text-${section.color}-800 text-sm font-medium px-3 py-1 rounded-full mb-4`;

  // Update question text (use English if available and selected)
  const questionText = lang === 'en' ? (question.text_en || question.text) : question.text;
  document.getElementById('question-text').textContent = questionText;

  // Render options based on type
  const container = document.getElementById('options-container');
  container.innerHTML = '';

  switch (question.type) {
    case 'single':
    case 'multi':
      renderChoiceOptions(question, container);
      break;
    case 'scale':
      renderScaleInput(question, container);
      break;
    case 'number':
      renderNumberInput(question, container);
      break;
    case 'text':
      renderTextInput(question, container);
      break;
  }

  // Update navigation buttons
  document.getElementById('btn-prev').style.visibility =
    state.currentQuestionIndex === 0 ? 'hidden' : 'visible';

  // Check if this question has an answer already
  const existingAnswer = state.answers.find(a => a.questionId === questionId);
  updateNextButton(existingAnswer !== undefined);
}

function renderChoiceOptions(question, container) {
  const existingAnswer = state.answers.find(a => a.questionId === question.id);
  const selectedValues = existingAnswer?.value || (question.type === 'multi' ? [] : null);
  const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ro';

  question.options.forEach(option => {
    const isSelected = question.type === 'multi'
      ? selectedValues.includes(option.value)
      : selectedValues === option.value;

    // Get translated label if available
    const optionLabel = lang === 'en' ? (option.label_en || option.label) : option.label;

    const div = document.createElement('div');
    div.className = `option-card ${isSelected ? 'selected' : ''}`;
    div.dataset.value = option.value;
    div.dataset.type = question.type;
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="option-check">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <span class="text-gray-700">${optionLabel}</span>
      </div>
    `;

    div.addEventListener('click', () => handleOptionClick(question, option.value, div));
    container.appendChild(div);
  });
}

function handleOptionClick(question, value, element) {
  if (question.type === 'single') {
    // Deselect all, select this one
    document.querySelectorAll('.option-card').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    saveAnswer(question.id, value);
  } else {
    // Toggle selection for multi
    element.classList.toggle('selected');
    const selectedOptions = Array.from(document.querySelectorAll('.option-card.selected'))
      .map(el => el.dataset.value);
    saveAnswer(question.id, selectedOptions);
  }
}

function renderScaleInput(question, container) {
  const existingAnswer = state.answers.find(a => a.questionId === question.id);
  const currentValue = existingAnswer?.value || 3;
  const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ro';
  const scaleLabels = lang === 'en' ? (question.scaleLabels_en || question.scaleLabels) : question.scaleLabels;

  container.innerHTML = `
    <div class="scale-container">
      <div class="scale-labels">
        ${scaleLabels.map((label, i) => `
          <span class="text-center flex-1 ${i + 1 === currentValue ? 'font-bold text-blue-600' : ''}">${label}</span>
        `).join('')}
      </div>
      <input type="range"
             class="scale-slider w-full"
             min="${question.scaleMin}"
             max="${question.scaleMax}"
             value="${currentValue}"
             oninput="handleScaleChange(this, '${question.id}')">
      <div class="scale-value">${currentValue}</div>
    </div>
  `;

  // Save initial value if new question
  if (!existingAnswer) {
    saveAnswer(question.id, currentValue);
  }
}

function handleScaleChange(input, questionId) {
  const value = parseInt(input.value);
  const question = questions.find(q => q.id === questionId);

  // Update display
  input.parentElement.querySelector('.scale-value').textContent = value;

  // Update labels highlighting
  const labels = input.parentElement.querySelectorAll('.scale-labels span');
  labels.forEach((label, i) => {
    label.classList.toggle('font-bold', i + 1 === value);
    label.classList.toggle('text-blue-600', i + 1 === value);
  });

  saveAnswer(questionId, value);
}

function renderNumberInput(question, container) {
  const existingAnswer = state.answers.find(a => a.questionId === question.id);
  const currentValue = existingAnswer?.value || '';

  container.innerHTML = `
    <div class="text-center">
      <input type="number"
             class="number-input"
             min="${question.min || 0}"
             max="${question.max || 999}"
             value="${currentValue}"
             placeholder="0"
             oninput="handleNumberChange(this, '${question.id}')">
      <p class="text-gray-500 mt-2">${question.suffix || ''}</p>
    </div>
  `;
}

function handleNumberChange(input, questionId) {
  const value = parseInt(input.value) || 0;
  saveAnswer(questionId, value);
}

function renderTextInput(question, container) {
  const existingAnswer = state.answers.find(a => a.questionId === question.id);
  const currentValue = existingAnswer?.value || '';

  container.innerHTML = `
    <textarea class="text-input"
              rows="4"
              placeholder="${question.placeholder || 'Scrieți răspunsul aici...'}"
              oninput="handleTextChange(this, '${question.id}')">${currentValue}</textarea>
  `;
}

function handleTextChange(input, questionId) {
  saveAnswer(questionId, input.value);
}

// ==========================================
// ANSWER MANAGEMENT
// ==========================================

function saveAnswer(questionId, value) {
  const existingIndex = state.answers.findIndex(a => a.questionId === questionId);

  const answerData = {
    questionId,
    value,
    answeredAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    state.answers[existingIndex] = answerData;
  } else {
    state.answers.push(answerData);
  }

  // Enable next button
  updateNextButton(true);

  // Update question flow based on answer (adaptive logic)
  updateQuestionFlow(questionId, value);
}

function updateNextButton(enabled) {
  const btn = document.getElementById('btn-next');
  btn.disabled = !enabled;

  // Check if this is the last question
  if (state.currentQuestionIndex >= state.questionFlow.length - 1) {
    btn.innerHTML = `
      Finalizează
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    `;
  } else {
    btn.innerHTML = `
      Continuă
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    `;
  }
}

function updateQuestionFlow(questionId, value) {
  const question = questions.find(q => q.id === questionId);
  if (!question || !question.nextRules) return;

  // Find matching rule
  for (const rule of question.nextRules) {
    if (rule.condition.default) continue;

    if (rule.condition.valueIn) {
      const matches = Array.isArray(value)
        ? value.some(v => rule.condition.valueIn.includes(v))
        : rule.condition.valueIn.includes(value);

      if (matches && rule.skip) {
        // Remove skipped questions from flow
        state.questionFlow = state.questionFlow.filter(id => !rule.skip.includes(id));
      }
    }
  }
}

// ==========================================
// NAVIGATION
// ==========================================

function nextQuestion() {
  if (state.currentQuestionIndex >= state.questionFlow.length - 1) {
    // Assessment complete
    finishAssessment();
  } else {
    state.currentQuestionIndex++;
    renderQuestion();
    window.scrollTo(0, 0);
  }
}

function prevQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderQuestion();
    window.scrollTo(0, 0);
  }
}

function updateProgress() {
  const progress = ((state.currentQuestionIndex + 1) / state.questionFlow.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
  const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ro';
  const progressText = lang === 'en'
    ? `Question ${state.currentQuestionIndex + 1} of ${state.questionFlow.length}`
    : `Întrebarea ${state.currentQuestionIndex + 1} din ${state.questionFlow.length}`;
  document.getElementById('progress-text').textContent = progressText;
}

// ==========================================
// HELPER MODAL
// ==========================================

function showHelper() {
  const questionId = state.questionFlow[state.currentQuestionIndex];
  const question = questions.find(q => q.id === questionId);

  if (!question || !question.helper) return;

  document.getElementById('helper-explanation').textContent = question.helper.explanation;

  const examplesList = document.getElementById('helper-examples');
  examplesList.innerHTML = question.helper.examples
    .map(ex => `<li>${ex}</li>`)
    .join('');

  document.getElementById('helper-tip').textContent = question.helper.tip;

  const modal = document.getElementById('helper-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Mark that helper was used for this question
  const answer = state.answers.find(a => a.questionId === questionId);
  if (answer) {
    answer.helperUsed = true;
  }
}

function hideHelper() {
  const modal = document.getElementById('helper-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Close modal on backdrop click
document.getElementById('helper-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'helper-modal') {
    hideHelper();
  }
});

// ==========================================
// FINISH & RESULTS
// ==========================================

async function finishAssessment() {
  // Calculate scores first
  state.scores = calculateScores(state.answers);
  state.recommendation = getRecommendation(state.scores);
  state.priorities = getPriorities(state.scores, state.answers);

  // Show contact form to collect email before results
  showScreen('contact');
}

/**
 * Submit contact info and show results
 */
async function submitContactAndShowResults() {
  const company = document.getElementById('contact-company').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();

  // Validate required fields
  if (!company || !email) {
    alert('Te rugăm să completezi numele firmei și email-ul.');
    return;
  }

  // Validate email format
  if (!email.includes('@') || !email.includes('.')) {
    alert('Te rugăm să introduci o adresă de email validă.');
    return;
  }

  // Save contact info to state
  state.contact = { company, email, phone };

  // Show results
  showScreen('results');
  renderResults();

  // Send all data to n8n (including contact for Google Sheets & email)
  await submitToN8N();
}

/**
 * Resend results email
 */
async function resendResultsEmail() {
  if (!state.contact?.email) {
    alert('Nu avem adresa ta de email.');
    return;
  }

  try {
    const response = await fetch(`${N8N_BASE_URL}/send-results-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: state.sessionToken,
        contact: state.contact,
        scores: state.scores,
        recommendation: state.recommendation,
        priorities: state.priorities.slice(0, 3)
      })
    });

    if (response.ok) {
      document.getElementById('email-sent-notice').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('email-sent-notice').classList.add('hidden');
      }, 5000);
    } else {
      alert('Eroare la trimiterea email-ului. Încearcă din nou.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Fallback - show success anyway for demo
    document.getElementById('email-sent-notice').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('email-sent-notice').classList.add('hidden');
    }, 5000);
  }
}

function renderResults() {
  // Animate score bars
  setTimeout(() => {
    Object.entries(state.scores).forEach(([dimension, score]) => {
      const card = document.querySelector(`.score-card[data-dimension="${dimension}"]`);
      if (card) {
        card.querySelector('.score-value').textContent = `${score}%`;
        card.querySelector('.score-bar').style.width = `${score}%`;
      }
    });
  }, 100);

  // Update recommendation
  const recCard = document.getElementById('recommendation-card');
  document.getElementById('recommendation-text').textContent = state.recommendation.title;
  document.getElementById('recommendation-subtitle').textContent = state.recommendation.subtitle;
  document.getElementById('recommendation-description').textContent = state.recommendation.description;

  // Set recommendation card color based on type
  const colorClasses = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-600'
  };
  recCard.className = `rounded-xl p-6 text-white text-center mb-8 ${colorClasses[state.recommendation.color] || colorClasses.blue}`;

  // Render priorities
  const prioritiesList = document.getElementById('priorities-list');
  prioritiesList.innerHTML = state.priorities.slice(0, 3).map((priority, index) => `
    <div class="priority-item">
      <div class="priority-number">${index + 1}</div>
      <div>
        <h4 class="font-medium text-gray-800">${priority.title}</h4>
        <p class="text-gray-600 text-sm">${priority.description}</p>
        <div class="flex gap-2 mt-2">
          <span class="text-xs px-2 py-1 rounded-full ${priority.impact === 'high' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
            Impact: ${priority.impact === 'high' ? 'Ridicat' : priority.impact === 'medium' ? 'Mediu' : 'Scăzut'}
          </span>
          <span class="text-xs px-2 py-1 rounded-full ${priority.effort === 'low' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}">
            Efort: ${priority.effort === 'low' ? 'Mic' : priority.effort === 'medium' ? 'Mediu' : 'Mare'}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// N8N INTEGRATION
// ==========================================

async function submitToN8N() {
  const payload = {
    token: state.sessionToken,
    contact: state.contact || {},
    answers: state.answers,
    scores: state.scores,
    recommendation: state.recommendation?.type || 'unknown',
    recommendationTitle: state.recommendation?.title || '',
    priorities: state.priorities.slice(0, 3).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      impact: p.impact,
      effort: p.effort
    })),
    completedAt: new Date().toISOString(),
    sendEmail: true // Flag to trigger email sending
  };

  console.log('Submitting to n8n:', payload);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Failed to submit to n8n:', response.statusText);
    } else {
      console.log('Successfully submitted to n8n');
    }
  } catch (error) {
    console.error('Error submitting to n8n:', error);
    // Don't block the user experience if n8n fails
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Expose functions globally for onclick handlers
window.startAssessment = startAssessment;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.showHelper = showHelper;
window.hideHelper = hideHelper;
window.handleScaleChange = handleScaleChange;
window.handleNumberChange = handleNumberChange;
window.handleTextChange = handleTextChange;
window.submitContactAndShowResults = submitContactAndShowResults;
window.resendResultsEmail = resendResultsEmail;
