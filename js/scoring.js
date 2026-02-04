/**
 * FlowScore - Scoring Engine
 * Calculates scores across 5 dimensions based on answers
 */

const DIMENSIONS = {
  financial_impact: {
    name: "Impact Financiar",
    description: "Cât de mult vă costă procesele actuale",
    color: "blue",
    icon: "currency"
  },
  time_waste: {
    name: "Timp Pierdut",
    description: "Cât timp se pierde pe activități ineficiente",
    color: "orange",
    icon: "clock"
  },
  risk_control: {
    name: "Risc & Control",
    description: "Cât de expuși sunteți la erori și pierderi de date",
    color: "red",
    icon: "shield"
  },
  digital_maturity: {
    name: "Maturitate Digitală",
    description: "Cât de digitalizate sunt procesele",
    color: "green",
    icon: "chip"
  },
  automatable_score: {
    name: "Potențial Automatizare",
    description: "Cât de mult se poate automatiza",
    color: "purple",
    icon: "cog"
  }
};

const RECOMMENDATIONS = {
  web_app: {
    title: "Aplicație Web / Mobile",
    description: "Aveți nevoie de digitalizare de bază înainte de automatizare.",
    details: "Recomandăm să începeți cu o aplicație simplă pentru colectare date, urmărire comenzi, sau management clienți.",
    icon: "device-mobile"
  },
  automation: {
    title: "Automatizare Procese",
    description: "Procesele sunt clare și pot fi automatizate direct.",
    details: "Puteți implementa automatizări pentru email-uri, rapoarte, sincronizare date între sisteme.",
    icon: "cog"
  },
  hybrid: {
    title: "Digitalizare + Automatizare",
    description: "O combinație de aplicație și automatizări.",
    details: "Recomandăm o aplicație de bază cu automatizări integrate pentru procesele repetitive.",
    icon: "sparkles"
  }
};

const PRIORITIES = {
  documents: {
    trigger: (scores, answers) => scores.risk_control > 50 && hasAnswer(answers, 'q01', ['whatsapp_email', 'paper']),
    title: "Organizare Documente",
    description: "Migrați documentele într-un sistem organizat (Google Drive, OneDrive)",
    impact: "high",
    effort: "low"
  },
  tracking: {
    trigger: (scores, answers) => scores.time_waste > 40 && hasAnswer(answers, 'q09', ['memory', 'nothing', 'paper']),
    title: "Sistem de Tracking",
    description: "Implementați un tool simplu pentru urmărirea taskurilor (Trello, Notion)",
    impact: "high",
    effort: "low"
  },
  crm: {
    trigger: (scores, answers) => hasAnswer(answers, 'q16', ['phone', 'paper', 'memory']),
    title: "CRM Simplu",
    description: "Centralizați datele clienților într-un CRM (HubSpot gratuit, Notion)",
    impact: "high",
    effort: "medium"
  },
  automation_email: {
    trigger: (scores, answers) => scores.automatable_score > 50 && scores.time_waste > 40,
    title: "Automatizare Email/Notificări",
    description: "Automatizați email-uri de confirmare, remindere, follow-up",
    impact: "medium",
    effort: "low"
  },
  reporting: {
    trigger: (scores, answers) => hasAnswer(answers, 'q17', ['manual_data', 'no_reports']),
    title: "Raportare Automată",
    description: "Configurați rapoarte automate din sistemele existente",
    impact: "medium",
    effort: "medium"
  },
  data_integration: {
    trigger: (scores, answers) => hasAnswer(answers, 'q19', ['many_duplicates', 'chaos']),
    title: "Integrare Date",
    description: "Conectați sistemele pentru a elimina introducerea duplicată",
    impact: "high",
    effort: "high"
  },
  process_standardization: {
    trigger: (scores, answers) => hasAnswer(answers, 'q15', ['noticed_late', 'not_noticed']),
    title: "Standardizare Procese",
    description: "Documentați și standardizați procesele cu checklisturi",
    impact: "high",
    effort: "medium"
  },
  communication: {
    trigger: (scores, answers) => scores.risk_control > 50 && hasAnswer(answers, 'q06', ['phone_calls', 'whatsapp_group']),
    title: "Canal Comunicare Organizat",
    description: "Migrați pe un tool cu canale (Slack/Teams) pentru trasabilitate",
    impact: "medium",
    effort: "medium"
  }
};

/**
 * Helper function to check if an answer contains specific values
 */
function hasAnswer(answers, questionId, values) {
  const answer = answers.find(a => a.questionId === questionId);
  if (!answer) return false;

  if (Array.isArray(answer.value)) {
    return answer.value.some(v => values.includes(v));
  }
  return values.includes(answer.value);
}

/**
 * Calculate scores for all dimensions
 * @param {Array} answers - Array of {questionId, value} objects
 * @returns {Object} Scores object with each dimension
 */
function calculateScores(answers) {
  const scores = {
    financial_impact: 0,
    time_waste: 0,
    risk_control: 0,
    digital_maturity: 0,
    automatable_score: 0
  };

  const maxScores = {
    financial_impact: 0,
    time_waste: 0,
    risk_control: 0,
    digital_maturity: 0,
    automatable_score: 0
  };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question || !question.weights) return;

    // Skip text and context-only questions
    if (question.type === 'text' || Object.keys(question.weights).length === 0) return;

    Object.keys(scores).forEach(dimension => {
      const weights = question.weights[dimension];
      if (!weights) return;

      // Handle scale questions (array of weights)
      if (question.type === 'scale' && Array.isArray(weights)) {
        const index = Math.max(0, Math.min(answer.value - 1, weights.length - 1));
        scores[dimension] += weights[index];
        maxScores[dimension] += Math.max(...weights);
      }
      // Handle number questions with formulas
      else if (question.type === 'number' && typeof weights === 'string') {
        const hours = answer.value || 0;
        try {
          const value = eval(weights.replace('hours', hours));
          scores[dimension] += Math.min(value, 50); // Cap contribution
          maxScores[dimension] += 50;
        } catch (e) {
          console.error('Error evaluating weight formula:', e);
        }
      }
      // Handle single/multi choice questions (object of weights)
      else if (typeof weights === 'object' && !Array.isArray(weights)) {
        if (Array.isArray(answer.value)) {
          // Multi-select: sum weights, take max possible
          answer.value.forEach(v => {
            scores[dimension] += weights[v] || 0;
          });
          maxScores[dimension] += Math.max(...Object.values(weights)) * answer.value.length;
        } else {
          // Single select
          scores[dimension] += weights[answer.value] || 0;
          maxScores[dimension] += Math.max(...Object.values(weights));
        }
      }
    });
  });

  // Normalize to 0-100
  Object.keys(scores).forEach(dim => {
    if (maxScores[dim] > 0) {
      scores[dim] = Math.round((scores[dim] / maxScores[dim]) * 100);
    }
    // Clamp between 0 and 100
    scores[dim] = Math.max(0, Math.min(100, scores[dim]));
  });

  return scores;
}

/**
 * Get recommendation based on scores
 * @param {Object} scores - Scores object
 * @returns {Object} Recommendation object
 */
function getRecommendation(scores) {
  // Low digital maturity = needs basic digitalization first
  if (scores.digital_maturity < 35) {
    return {
      type: 'web_app',
      ...RECOMMENDATIONS.web_app
    };
  }

  // High automation potential + moderate digital maturity = direct automation
  if (scores.automatable_score > 55 && scores.digital_maturity >= 50) {
    return {
      type: 'automation',
      ...RECOMMENDATIONS.automation
    };
  }

  // Default: hybrid approach
  return {
    type: 'hybrid',
    ...RECOMMENDATIONS.hybrid
  };
}

/**
 * Get prioritized list of improvements
 * @param {Object} scores - Scores object
 * @param {Array} answers - Answers array
 * @returns {Array} Sorted list of priorities
 */
function getPriorities(scores, answers) {
  const activePriorities = [];

  Object.entries(PRIORITIES).forEach(([key, priority]) => {
    if (priority.trigger(scores, answers)) {
      activePriorities.push({
        id: key,
        title: priority.title,
        description: priority.description,
        impact: priority.impact,
        effort: priority.effort,
        score: calculatePriorityScore(priority.impact, priority.effort)
      });
    }
  });

  // Sort by score (high impact + low effort first)
  activePriorities.sort((a, b) => b.score - a.score);

  return activePriorities.slice(0, 5); // Return top 5
}

/**
 * Calculate priority score (higher = better to do first)
 */
function calculatePriorityScore(impact, effort) {
  const impactScores = { high: 3, medium: 2, low: 1 };
  const effortScores = { low: 3, medium: 2, high: 1 };

  return impactScores[impact] * effortScores[effort];
}

/**
 * Generate summary text based on scores
 */
function generateSummary(scores, recommendation) {
  let summary = '';

  // Highest problem area
  const problemAreas = [
    { dim: 'financial_impact', name: 'impact financiar', score: scores.financial_impact },
    { dim: 'time_waste', name: 'timp pierdut', score: scores.time_waste },
    { dim: 'risk_control', name: 'risc și control', score: scores.risk_control }
  ].sort((a, b) => b.score - a.score);

  if (problemAreas[0].score > 60) {
    summary += `Aveți un nivel ridicat de ${problemAreas[0].name} (${problemAreas[0].score}%). `;
  }

  // Digital maturity assessment
  if (scores.digital_maturity < 30) {
    summary += 'Nivelul de digitalizare este scăzut - recomandăm să începeți cu pași simpli. ';
  } else if (scores.digital_maturity > 70) {
    summary += 'Aveți o bună maturitate digitală - sunteți pregătiți pentru automatizări avansate. ';
  }

  // Automation potential
  if (scores.automatable_score > 60) {
    summary += 'Potențialul de automatizare este ridicat - multe procese pot fi optimizate.';
  }

  return summary || 'Analiza indică oportunități de îmbunătățire în mai multe zone.';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateScores,
    getRecommendation,
    getPriorities,
    generateSummary,
    DIMENSIONS,
    RECOMMENDATIONS
  };
}
