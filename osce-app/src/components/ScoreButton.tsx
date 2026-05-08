import React from 'react';
import { ScoreType } from '../rubric';

interface Props {
  value: number;
  scoreType: ScoreType;
  onChange: (v: number) => void;
}

const OPTIONS: Record<ScoreType, number[]> = {
  '0/1': [0, 1],
  '0/1/2': [0, 1, 2],
};

const ACTIVE_COLORS = [
  'bg-red-500 text-white border-red-600',    // 0
  'bg-amber-400 text-white border-amber-500', // 1
  'bg-green-500 text-white border-green-600', // 2
];

const INACTIVE = 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50';

export default function ScoreButton({ value, scoreType, onChange }: Props) {
  const options = OPTIONS[scoreType];
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-8 h-8 rounded border font-semibold text-sm transition-colors ${
            value === opt ? ACTIVE_COLORS[opt] : INACTIVE
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
