import React from 'react';
import { SectionResult, TOTAL_WEIGHT, calcTotalWeightedScore, scoreColor, RAGColor } from '../scoring';
import { StudentScores } from '../types';

interface Props {
  results: SectionResult[];
  scores: StudentScores;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onClearScores: () => void;
}

const DOT_COLORS: Record<RAGColor, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
};

const BADGE_COLORS: Record<RAGColor, string> = {
  green: 'bg-green-100 text-green-800 border-green-300',
  amber: 'bg-amber-100 text-amber-800 border-amber-300',
  red: 'bg-red-100 text-red-800 border-red-300',
};

export default function ScoreSummary({ results, scores, onExportCSV, onExportJSON, onExportPDF, onClearScores }: Props) {
  const total = calcTotalWeightedScore(scores);
  const totalPct = TOTAL_WEIGHT > 0 ? (total / TOTAL_WEIGHT) * 100 : 0;
  const color = scoreColor(totalPct);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Section pills */}
        <div className="flex flex-wrap gap-2">
          {results.map(r => {
            const pct = r.max > 0 ? (r.raw / r.max) * 100 : 0;
            const c = scoreColor(pct);
            return (
              <div
                key={r.section.id}
                className={`flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 ${BADGE_COLORS[c]}`}
              >
                <span className={`w-2 h-2 rounded-full ${DOT_COLORS[c]}`} />
                <span className="font-medium">{r.section.label.split(' ')[0]}</span>
                <span>{r.raw}/{r.max}</span>
                {r.section.weight !== null && (
                  <span className="opacity-70">({r.weightedScore?.toFixed(1)}%)</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Total score */}
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 border font-bold text-lg ${BADGE_COLORS[color]}`}>
          <span className={`w-3 h-3 rounded-full ${DOT_COLORS[color]}`} />
          <span>Total: {total.toFixed(1)}% / {TOTAL_WEIGHT}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
        >
          \u2193 Export PDF
        </button>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          \u2193 Export CSV
        </button>
        <button
          onClick={onExportJSON}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          \u2193 Export JSON
        </button>
        <button
          onClick={onClearScores}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
        >
          \u2715 Clear Scores
        </button>
      </div>
    </div>
  );
}
