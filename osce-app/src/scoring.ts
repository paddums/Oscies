import { RUBRIC, SectionDef, sectionMax } from './rubric';
import { StudentScores } from './types';

export interface SectionResult {
  section: SectionDef;
  raw: number;
  max: number;
  weightedScore: number | null; // null when section has no weight
  percentage: number;
}

export function calcSectionResults(scores: StudentScores): SectionResult[] {
  return RUBRIC.map(section => {
    const raw = section.subsections.reduce((total, sub) => {
      return total + sub.criteria.reduce((t, c) => t + (scores[c.id] ?? 0), 0);
    }, 0);
    const max = sectionMax(section);
    const percentage = max > 0 ? (raw / max) * 100 : 0;
    const weightedScore = section.weight !== null ? (raw / max) * section.weight : null;
    return { section, raw, max, weightedScore, percentage };
  });
}

export function calcTotalWeightedScore(scores: StudentScores): number {
  return calcSectionResults(scores).reduce((total, r) => {
    return total + (r.weightedScore ?? 0);
  }, 0);
}

/** Sum of all section weights (used to show score out of X%) */
export const TOTAL_WEIGHT = RUBRIC.reduce((t, s) => t + (s.weight ?? 0), 0);

export type RAGColor = 'green' | 'amber' | 'red';

/** Red < 50, Amber 50–74, Green >= 75 */
export function scoreColor(pct: number): RAGColor {
  if (pct >= 75) return 'green';
  if (pct >= 50) return 'amber';
  return 'red';
}
