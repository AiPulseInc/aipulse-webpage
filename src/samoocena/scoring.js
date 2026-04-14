import questionsData from './questions.json';

const MATURITY_CAP_KEY = 'developing';

export function scoreAssessment(responses) {
  const questions = questionsData.questions;
  const byCategory = groupByCategory(questions);
  const categoryScores = {};

  for (const [categoryId, categoryQuestions] of Object.entries(byCategory)) {
    const { earned, max } = sumCategory(categoryQuestions, responses);
    categoryScores[categoryId] = {
      earned,
      max,
      percentage: max > 0 ? Math.round((earned / max) * 100) : 0,
    };
  }

  const totals = Object.values(categoryScores).reduce(
    (acc, cat) => ({
      earned: acc.earned + cat.earned,
      max: acc.max + cat.max,
    }),
    { earned: 0, max: 0 }
  );

  const overallPercentage =
    totals.max > 0 ? Math.round((totals.earned / totals.max) * 100) : 0;

  const rawMaturity = deriveMaturity(overallPercentage);
  const maturity = applyCriticalGuardrail(rawMaturity, questions, responses);

  return {
    categories: categoryScores,
    overall: {
      earned: totals.earned,
      max: totals.max,
      percentage: overallPercentage,
    },
    maturity,
    guardrailTriggered: maturity.key !== rawMaturity.key,
  };
}

function groupByCategory(questions) {
  return questions.reduce((acc, q) => {
    (acc[q.category] ||= []).push(q);
    return acc;
  }, {});
}

function sumCategory(questions, responses) {
  let earned = 0;
  let max = 0;
  for (const q of questions) {
    const response = responses[q.id];
    const maxScore = Math.max(...q.options.map((o) => o.score));
    max += maxScore * q.weight;
    if (response === undefined || response === null) continue;
    const option = q.options[response];
    if (!option) continue;
    earned += option.score * q.weight;
  }
  return { earned, max };
}

function deriveMaturity(percentage) {
  const level = questionsData.maturity_levels.find(
    (l) => percentage >= l.min && percentage <= l.max
  );
  return level || questionsData.maturity_levels[0];
}

function applyCriticalGuardrail(currentMaturity, questions, responses) {
  const criticalQuestions = questions.filter((q) => q.critical);
  const allCriticalZero =
    criticalQuestions.length > 0 &&
    criticalQuestions.every((q) => {
      const r = responses[q.id];
      if (r === undefined || r === null) return false;
      return q.options[r]?.score === 0;
    });

  if (!allCriticalZero) return currentMaturity;

  const currentIndex = questionsData.maturity_levels.findIndex(
    (l) => l.key === currentMaturity.key
  );
  const capIndex = questionsData.maturity_levels.findIndex(
    (l) => l.key === MATURITY_CAP_KEY
  );

  if (currentIndex <= capIndex) return currentMaturity;

  return questionsData.maturity_levels[capIndex];
}

export function getCategoriesMeta() {
  return questionsData.categories;
}

export function getQuestions() {
  return questionsData.questions;
}

export function getMaturityLevels() {
  return questionsData.maturity_levels;
}
