import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
const questionsData = JSON.parse(await readFile(new URL('src/samoocena/questions.json', root), 'utf8'));
const funnelData = JSON.parse(await readFile(new URL('src/samoocena/funnel-stages.json', root), 'utf8'));

const expectedCounts = [3, 4, 10];
const actualCounts = funnelData.stages.map((stage) => stage.questionIds.length);
assert(
  JSON.stringify(actualCounts) === JSON.stringify(expectedCounts),
  `Etapy muszą mieć kolejno 3, 4 i 10 pytań; otrzymano ${actualCounts.join(', ')}`
);

const questionIds = new Set(questionsData.questions.map((question) => question.id));
const stagedIds = funnelData.stages.flatMap((stage) => stage.questionIds);
assert(new Set(stagedIds).size === stagedIds.length, 'Pytania w etapach nie mogą się powtarzać');

for (const id of stagedIds) {
  assert(questionIds.has(id), `Nieznane pytanie w lejku: ${id}`);
}

for (const stage of funnelData.stages) {
  assert(stage.checkpointCopy?.length > 40, `Etap ${stage.id} musi mieć własny komunikat checkpointu`);
}

assert(stagedIds.includes('C1'), 'Pierwszy lejek musi obejmować krytyczne pytanie o MFA (C1)');
assert(stagedIds.includes('B1'), 'Pierwszy lejek musi obejmować krytyczne pytanie o backup (B1)');

const representedCategories = new Set(
  questionsData.questions.filter((question) => stagedIds.includes(question.id)).map((question) => question.category)
);
assert(representedCategories.size === 5, 'Diagnoza przesiewowa musi reprezentować wszystkie 5 kategorii');
assert(questionIds.size - stagedIds.length === 18, 'Po diagnozie przesiewowej powinno zostać 18 pytań pełnego audytu');

const scoringModule = await bundleAndImport('src/samoocena/scoring.js');
const recommendationsModule = await bundleAndImport('src/samoocena/recommendations.js');

{
  const { scoreAssessment } = scoringModule;
  const { allGaps } = recommendationsModule;
  const signalResponses = Object.fromEntries(
    funnelData.stages[0].questionIds.map((id) => [id, 1])
  );
  const signalScore = scoreAssessment(signalResponses);
  const scoredAnswers = Object.values(signalScore.categories).reduce((sum, category) => sum + category.answered, 0);
  const expectedSignalMax = questionsData.questions
    .filter((question) => signalResponses[question.id] !== undefined)
    .reduce((sum, question) => sum + Math.max(...question.options.map((option) => option.score)) * question.weight, 0);

  assert(scoredAnswers === 3, `Scoring częściowy powinien liczyć 3 odpowiedzi; otrzymano ${scoredAnswers}`);
  assert(signalScore.overall.max === expectedSignalMax, 'Scoring częściowy nie może używać mianownika pełnych 35 pytań');
  assert(allGaps(signalResponses).every((gap) => signalResponses[gap.questionId] !== undefined), 'Rekomendacje nie mogą obejmować pytań bez odpowiedzi');

  for (const stage of funnelData.stages) {
    const stageResponses = Object.fromEntries(stage.questionIds.map((id) => [id, 1]));
    const stageTopGap = allGaps(stageResponses)[0];
    assert(
      !stageTopGap || stage.questionIds.includes(stageTopGap.questionId),
      `Checkpoint ${stage.id} może rekomendować tylko pytania z bieżącego etapu`
    );
  }
}

console.log(`OK: lejek ${actualCounts.join(' → ')} + opcjonalne 18 pytań; ${representedCategories.size} kategorii; ${questionIds.size} pytań łącznie.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function bundleAndImport(relativePath) {
  const result = await build({
    entryPoints: [fileURLToPath(new URL(relativePath, root))],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const source = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}
