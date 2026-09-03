export interface QuizQuestion {
  question: string;
  pics?: string;
  answers: string[];
  percentage: Record<string, Record<string, number>>;
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  qid: number;
}

export interface HouseResult {
  house: string;
  score: number;
  percentage: number;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateQuiz(questions: QuizQuestion[][], count = 8): Omit<QuizQuestion, 'percentage'>[] {
  return Array.from({ length: count }, (_, i) => {
    const group = questions[i];
    const q = pickRandom(group);
    return {
      question: q.question,
      pics: q.pics,
      answers: q.answers,
    };
  });
}

export function calculateResult(
  allGroups: QuizQuestion[][],
  selectedQuestions: Omit<QuizQuestion, 'percentage'>[],
  answers: number[]
): HouseResult[] {
  const scores: Record<string, number> = {
    gryffindor: 0,
    ravenclaw: 0,
    hufflepuff: 0,
    slytherin: 0,
  };

  selectedQuestions.forEach((q, i) => {
    const qid = answers[i];
    if (qid === undefined) return;

    // Find the original question in allGroups to get percentages
    for (const group of allGroups) {
      for (const orig of group) {
        if (orig.question === q.question && orig.percentage) {
          for (const [house, pcts] of Object.entries(orig.percentage)) {
            const key = String(qid);
            if (pcts[key] !== undefined) {
              scores[house] += pcts[key];
            }
          }
          return;
        }
      }
    }
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(scores)
    .map(([house, score]) => ({
      house,
      score,
      percentage: Math.round((score / total) * 100),
    }))
    .sort((a, b) => b.score - a.score);
}
