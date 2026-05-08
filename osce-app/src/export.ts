import { RUBRIC } from './rubric';
import { AssessmentData } from './types';
import { calcSectionResults, calcTotalWeightedScore, TOTAL_WEIGHT } from './scoring';

export function exportJSON(data: AssessmentData): void {
  const results = calcSectionResults(data.scores);
  const payload = {
    ...data,
    sectionResults: results.map(r => ({
      section: r.section.label,
      raw: r.raw,
      max: r.max,
      percentage: r.percentage.toFixed(1),
      weightedScore: r.weightedScore?.toFixed(2) ?? 'N/A',
    })),
    totalWeightedScore: calcTotalWeightedScore(data.scores).toFixed(2),
    totalPossibleWeight: TOTAL_WEIGHT,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `OSCE_${data.studentName.replace(/\s+/g, '_')}_${data.date}.json`);
}

export function exportCSV(data: AssessmentData): void {
  const rows: string[][] = [];
  rows.push(['OSCE Assessment Export']);
  rows.push(['Student', data.studentName]);
  rows.push(['Date', data.date]);
  rows.push(['Assessor', data.assessorName]);
  rows.push([]);
  rows.push(['Section', 'Subsection', 'Criterion', 'Score', 'Max', 'Score Type']);

  for (const section of RUBRIC) {
    for (const sub of section.subsections) {
      for (const criterion of sub.criteria) {
        rows.push([
          section.label,
          sub.label,
          criterion.label,
          String(data.scores[criterion.id] ?? 0),
          criterion.scoreType === '0/1/2' ? '2' : '1',
          criterion.scoreType,
        ]);
      }
    }
  }

  rows.push([]);
  rows.push(['Section Totals']);
  rows.push(['Section', 'Raw Score', 'Max', 'Percentage', 'Weight (%)', 'Weighted Score']);
  const results = calcSectionResults(data.scores);
  for (const r of results) {
    rows.push([
      r.section.label,
      String(r.raw),
      String(r.max),
      r.percentage.toFixed(1) + '%',
      r.section.weight !== null ? String(r.section.weight) + '%' : 'N/A',
      r.weightedScore !== null ? r.weightedScore.toFixed(2) + '%' : 'N/A',
    ]);
  }

  rows.push([]);
  rows.push(['Total Weighted Score', calcTotalWeightedScore(data.scores).toFixed(2) + '%', 'out of ' + TOTAL_WEIGHT + '%']);

  const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  triggerDownload(blob, `OSCE_${data.studentName.replace(/\s+/g, '_')}_${data.date}.csv`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
