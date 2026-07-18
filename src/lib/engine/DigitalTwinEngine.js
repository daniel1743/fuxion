import {
  calculateBMI,
  classifyBMI,
  calculateMifflinStJeor,
  calculateTDEE,
  calculateProteinNeeds,
  calculateWaterRequirement,
  evaluateBristolScale,
  calculateSleepQuality,
  calculateIIBScore,
} from '../wellnessAlgorithms';

import rules from './recommendationRules.json';

// Evaluate a single condition against the answers
function evaluateCondition(condition, answers) {
  const { field, operator, value } = condition;
  const answerVal = answers[field];

  if (answerVal === undefined) return false;

  switch (operator) {
    case '<': return Number(answerVal) < Number(value);
    case '>': return Number(answerVal) > Number(value);
    case '<=': return Number(answerVal) <= Number(value);
    case '>=': return Number(answerVal) >= Number(value);
    case '===': return answerVal === value;
    case '!==': return answerVal !== value;
    case 'in': return Array.isArray(value) && value.includes(answerVal);
    default: return false;
  }
}

// Generate the Digital Twin State and Recommendations
export function generateDigitalTwin(answers) {
  // 1. Biometrics & Base Calculations
  const bmi = calculateBMI(answers.weight, answers.height);
  const bmiClass = classifyBMI(bmi);
  const ger = calculateMifflinStJeor(answers.weight, answers.height, answers.age, answers.gender);
  const tdee = calculateTDEE(ger, answers.activityLevel);
  const protein = calculateProteinNeeds(answers.weight, answers.activityLevel, answers.goal);
  const waterL = calculateWaterRequirement(answers.weight, answers.activityLevel) / 1000;
  
  const sleepScore = calculateSleepQuality(
    answers.sleepHours || 7,
    answers.sleepQuality || 3,
    answers.awakeningsPerNight || 0
  );
  
  const bristolEval = evaluateBristolScale(answers.bristolType);
  const iib = calculateIIBScore(answers, bmi, sleepScore, bristolEval);

  // 2. Evaluate Rule Engine
  let matchedRules = [];
  
  rules.forEach(rule => {
    // Check if all conditions for this rule are met
    const isMatch = rule.conditions.every(cond => evaluateCondition(cond, answers));
    if (isMatch) {
      // Calculate dynamic priority score if needed, for now use base priority_weight
      let finalScore = rule.priority_weight;
      
      // We can boost score if the domain is exceptionally low in IIB
      if (iib.domains[rule.domain] < 40) finalScore += 10;
      else if (iib.domains[rule.domain] < 60) finalScore += 5;

      matchedRules.push({
        ...rule,
        finalScore
      });
    }
  });

  // Sort by highest priority
  matchedRules.sort((a, b) => b.finalScore - a.finalScore);
  
  // Pick top 3 recommendations
  const topRecommendations = matchedRules.slice(0, 3);

  // 3. Construct Digital Twin Data Structure
  return {
    twin_version: "1.0",
    created_from: "web_questionnaire",
    last_evaluation: new Date().toISOString(),
    // En el futuro, next_recommended_review se puede calcular dinámicamente
    next_recommended_review: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    
    twin_state: {
      biometrics: {
        bmi,
        bmiClass,
        ger,
        tdee,
        protein,
        waterL,
        sleepScore,
        bristolEval
      },
      domains: iib.domains,
      iib: {
        score: iib.score,
        level: iib.level
      }
    },
    
    behavior_profile: {
      activity_level: answers.activityLevel,
      goal: answers.goal,
      known_conditions: answers.knownConditions || null,
      stress_level: answers.stressLevel
    },

    recommendations: topRecommendations,
    
    // Almacenamos el raw answers temporalmente por seguridad / historial
    raw_answers: answers
  };
}
