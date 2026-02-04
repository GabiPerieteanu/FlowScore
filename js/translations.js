/**
 * FlowScore - Translations
 * Romanian (RO) and English (EN)
 */

const TRANSLATIONS = {
  ro: {
    // Header & Navigation
    appName: 'FlowScore',
    questionOf: 'Întrebarea {current} din {total}',

    // Welcome Screen
    welcomeTitle: 'Bine ați venit la FlowScore',
    welcomeSubtitle: 'Assessment de Procese pentru IMM-uri',
    welcomeDescription: 'Acest chestionar vă va ajuta să identificați oportunitățile de îmbunătățire și automatizare din afacerea dumneavoastră.',
    welcomeTime: '⏱️ Durată estimată: 5-7 minute',
    welcomePrivacy: '🔒 Răspunsurile sunt confidențiale',
    startButton: 'Începe Evaluarea',

    // Access Denied Screen
    accessDeniedTitle: 'Acces Restricționat',
    accessDeniedMessage: 'Acest assessment este disponibil doar pe bază de invitație.',
    accessDeniedHelp: 'Dacă ați primit un link de invitație, verificați că l-ați copiat corect.',
    accessDeniedContact: 'Aveți nevoie de acces? Contactați-ne pentru o invitație.',

    // Question Navigation
    prevButton: 'Înapoi',
    nextButton: 'Continuă',
    finishButton: 'Finalizează',
    helpButton: 'Nu știu / Ajută-mă să răspund',

    // Helper Modal
    helperTitle: 'Ajutor pentru această întrebare',
    helperExplanation: 'Explicație:',
    helperExamples: 'Exemple:',
    helperTip: 'Sfat:',
    helperClose: 'Am înțeles',

    // Results Screen
    resultsTitle: 'Rezultatele Evaluării',
    resultsSubtitle: 'Iată o imagine de ansamblu a proceselor din organizația dumneavoastră',
    scoreFinancial: 'Impact Financiar',
    scoreTime: 'Timp Pierdut',
    scoreRisk: 'Risc & Control',
    scoreDigital: 'Maturitate Digitală',
    scoreAutomation: 'Potențial Automatizare',
    recommendationTitle: 'Recomandarea Noastră',
    prioritiesTitle: 'Priorități de Acțiune',
    impactHigh: 'Ridicat',
    impactMedium: 'Mediu',
    impactLow: 'Scăzut',
    effortLow: 'Mic',
    effortMedium: 'Mediu',
    effortHigh: 'Mare',
    downloadReport: 'Descarcă Raportul PDF',
    scheduleCall: 'Programează o Consultație',

    // Footer
    footerText: '© 2024 FlowScore. Assessment de Procese pentru IMM-uri.',

    // Sections
    sections: {
      1: { name: 'Documente & Informații', color: 'blue' },
      2: { name: 'Comunicare & Coordonare', color: 'green' },
      3: { name: 'Procese Operaționale', color: 'purple' },
      4: { name: 'Date & Raportare', color: 'orange' },
      5: { name: 'Evaluare Generală', color: 'red' }
    }
  },

  en: {
    // Header & Navigation
    appName: 'FlowScore',
    questionOf: 'Question {current} of {total}',

    // Welcome Screen
    welcomeTitle: 'Welcome to FlowScore',
    welcomeSubtitle: 'Process Assessment for SMEs',
    welcomeDescription: 'This questionnaire will help you identify improvement and automation opportunities in your business.',
    welcomeTime: '⏱️ Estimated time: 5-7 minutes',
    welcomePrivacy: '🔒 Your answers are confidential',
    startButton: 'Start Assessment',

    // Access Denied Screen
    accessDeniedTitle: 'Access Restricted',
    accessDeniedMessage: 'This assessment is available by invitation only.',
    accessDeniedHelp: 'If you received an invitation link, please verify you copied it correctly.',
    accessDeniedContact: 'Need access? Contact us for an invitation.',

    // Question Navigation
    prevButton: 'Back',
    nextButton: 'Continue',
    finishButton: 'Finish',
    helpButton: "I don't know / Help me answer",

    // Helper Modal
    helperTitle: 'Help for this question',
    helperExplanation: 'Explanation:',
    helperExamples: 'Examples:',
    helperTip: 'Tip:',
    helperClose: 'Got it',

    // Results Screen
    resultsTitle: 'Assessment Results',
    resultsSubtitle: "Here's an overview of your organization's processes",
    scoreFinancial: 'Financial Impact',
    scoreTime: 'Time Waste',
    scoreRisk: 'Risk & Control',
    scoreDigital: 'Digital Maturity',
    scoreAutomation: 'Automation Potential',
    recommendationTitle: 'Our Recommendation',
    prioritiesTitle: 'Action Priorities',
    impactHigh: 'High',
    impactMedium: 'Medium',
    impactLow: 'Low',
    effortLow: 'Low',
    effortMedium: 'Medium',
    effortHigh: 'High',
    downloadReport: 'Download PDF Report',
    scheduleCall: 'Schedule a Consultation',

    // Footer
    footerText: '© 2024 FlowScore. Process Assessment for SMEs.',

    // Sections
    sections: {
      1: { name: 'Documents & Information', color: 'blue' },
      2: { name: 'Communication & Coordination', color: 'green' },
      3: { name: 'Operational Processes', color: 'purple' },
      4: { name: 'Data & Reporting', color: 'orange' },
      5: { name: 'General Assessment', color: 'red' }
    }
  }
};

// Current language (default: Romanian)
let currentLanguage = localStorage.getItem('flowscore_lang') || 'ro';

/**
 * Get translation for a key
 */
function t(key, replacements = {}) {
  let text = TRANSLATIONS[currentLanguage][key] || TRANSLATIONS['ro'][key] || key;

  // Replace placeholders like {current} with values
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });

  return text;
}

/**
 * Get section info
 */
function getSection(sectionNumber) {
  return TRANSLATIONS[currentLanguage].sections[sectionNumber] ||
         TRANSLATIONS['ro'].sections[sectionNumber];
}

/**
 * Switch language
 */
function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('flowscore_lang', lang);
  updatePageLanguage();
}

/**
 * Get current language
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Update all text on the page
 */
function updatePageLanguage() {
  // Update static elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
  });

  // Re-render current question if on question screen
  if (typeof state !== 'undefined' && state.currentScreen === 'question') {
    renderQuestion();
  }

  // Update progress text
  if (typeof state !== 'undefined' && typeof updateProgress === 'function') {
    updateProgress();
  }
}

// Expose globally
window.t = t;
window.getSection = getSection;
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updatePageLanguage = updatePageLanguage;
window.TRANSLATIONS = TRANSLATIONS;
