import { getQuestions } from './scoring.js';
import funnelData from './funnel-stages.json';

// Kolejność jest celowa: najpierw trzy zabezpieczenia o najwyższej sile
// diagnostycznej, potem cztery pytania doprecyzowujące i dziesięć pytań
// przekrojowych. Pozostałe pytania są opcjonalnym pogłębieniem do pełnego audytu.
export const FUNNEL_STAGES = funnelData.stages;

const stagedIds = new Set(FUNNEL_STAGES.flatMap((stage) => stage.questionIds));
const remainingIds = getQuestions()
  .map((question) => question.id)
  .filter((id) => !stagedIds.has(id));

export const FULL_STAGE = {
  id: 'full',
  title: 'Pełna samoocena',
  eyebrow: 'Pogłębienie audytowe',
  questionIds: remainingIds,
  timeLabel: '~5 min',
};

const ALL_STAGES = [...FUNNEL_STAGES, FULL_STAGE];
const questionsById = new Map(getQuestions().map((question) => [question.id, question]));
const orderedIds = ALL_STAGES.flatMap((stage) => stage.questionIds);

export function getFunnelQuestions() {
  return orderedIds.map((id) => questionsById.get(id)).filter(Boolean);
}

export function getFunnelStages() {
  return ALL_STAGES;
}

export function getFunnelStageForIndex(index) {
  let offset = 0;
  for (const stage of ALL_STAGES) {
    const end = offset + stage.questionIds.length;
    if (index >= offset && index < end) {
      return {
        ...stage,
        index: ALL_STAGES.indexOf(stage),
        startIndex: offset,
        endIndex: end - 1,
        localIndex: index - offset,
      };
    }
    offset = end;
  }
  return null;
}

export function getScreeningQuestionCount() {
  return FUNNEL_STAGES.reduce((sum, stage) => sum + stage.questionIds.length, 0);
}

export function getFullQuestionCount() {
  return orderedIds.length;
}
