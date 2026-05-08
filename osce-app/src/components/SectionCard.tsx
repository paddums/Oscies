import React, { useState } from 'react';
import { SectionDef } from '../rubric';
import { StudentScores } from '../types';
import { SectionResult } from '../scoring';
import ScoreButton from './ScoreButton';

interface Props {
  section: SectionDef;
  result: SectionResult;
  scores: StudentScores;
  onScore: (criterionId: string, value: number) => void;
}

const SECTION_HEADER_COLORS: Record<SectionDef['color'], string> = {
  blue: 'bg-blue-600 text-white',
  teal: 'bg-teal-600 text-white',
  orange: 'bg-orange-500 text-white',
  brown: 'bg-amber-800 text-white',
  green: 'bg-green-600 text-white',
};

const SUBSECTION_HEADER_COLORS: Record<SectionDef['color'], string> = {
  blue: 'bg-blue-100 text-blue-800',
  teal: 'bg-teal-100 text-teal-800',
  orange: 'bg-orange-100 text-orange-800',
  brown: 'bg-amber-100 text-amber-900',
  green: 'bg-green-100 text-green-800',
};

const PCT_BAR_COLORS: Record<SectionDef['color'], string> = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  brown: 'bg-amber-700',
  green: 'bg-green-500',
};

export default function SectionCard({ section, result, scores, onScore }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pct = result.max > 0 ? (result.raw / result.max) * 100 : 0;

  const ragDot =
    pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white">
      {/* Section header */}
      <button
        className={`w-full flex items-center justify-between px-4 py-3 ${SECTION_HEADER_COLORS[section.color]} font-bold text-left`}
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="flex items-center gap-2 text-base">
          <span className={`w-3 h-3 rounded-full ${ragDot}`} />
          {section.label}
          {section.weight !== null && (
            <span className="ml-2 text-xs font-normal opacity-80">
              (weight: {section.weight}%)
            </span>
          )}
        </span>
        <span className="flex items-center gap-3 text-sm font-normal">
          <span>{result.raw} / {result.max} pts</span>
          {result.weightedScore !== null && (
            <span className="font-semibold">
              {result.weightedScore.toFixed(2)}%
            </span>
          )}
          <span className="ml-1 opacity-70">{collapsed ? '▶' : '▼'}</span>
        </span>
      </button>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-100">
        <div
          className={`h-full transition-all ${PCT_BAR_COLORS[section.color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Criteria rows */}
      {!collapsed && (
        <div>
          {section.subsections.map(sub => (
            <div key={sub.id}>
              {sub.label && (
                <div
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${SUBSECTION_HEADER_COLORS[section.color]}`}
                >
                  {sub.label}
                </div>
              )}
              {sub.criteria.map((criterion, idx) => (
                <div
                  key={criterion.id}
                  className={`flex items-center justify-between px-4 py-2.5 gap-3 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="text-sm text-gray-700 flex-1">{criterion.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{criterion.scoreType}</span>
                    <ScoreButton
                      value={scores[criterion.id] ?? 0}
                      scoreType={criterion.scoreType}
                      onChange={v => onScore(criterion.id, v)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
