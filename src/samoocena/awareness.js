// Compliance literacy quiz — scoring i breakdown.
// Quiz NIE wpływa na overall_score samooceny. Osobna metryka awareness_score (0-4).

import data from './awareness-questions.json';

export function getAwarenessQuestions() {
  return data.questions;
}

export function getAwarenessMeta() {
  return {
    title: data.title,
    subtitle: data.subtitle,
    intro: data.intro,
    total: data.questions.length,
  };
}

/**
 * Score quiz answers.
 * @param {Object<string, string>} answers — { questionId: optionId }
 * @returns {{ correct: number, total: number, breakdown: Array, level: object }}
 */
export function scoreAwareness(answers) {
  const breakdown = data.questions.map((q) => {
    const userAnswerId = answers?.[q.id] ?? null;
    const userOption = userAnswerId ? q.options.find((o) => o.id === userAnswerId) : null;
    const correctOption = q.options.find((o) => o.correct);
    const isCorrect = !!userOption?.correct;
    const isUnknown = userAnswerId?.endsWith('_idk');
    return {
      questionId: q.id,
      questionText: q.text,
      userAnswerId,
      userAnswerLabel: userOption?.label ?? null,
      correctAnswerId: correctOption.id,
      correctAnswerLabel: correctOption.label,
      isCorrect,
      isUnknown,
      reference: q.reference,
      explanation: q.explanation,
    };
  });

  const correct = breakdown.filter((b) => b.isCorrect).length;
  const level = data.scoring_levels.find((l) => correct >= l.min && correct <= l.max) || data.scoring_levels[0];

  return {
    correct,
    total: data.questions.length,
    breakdown,
    level,
  };
}
