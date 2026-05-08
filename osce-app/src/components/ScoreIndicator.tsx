import React from 'react';
import { scoreColor, RAGColor } from '../scoring';

interface Props {
  pct: number;
  label?: string;
  size?: 'sm' | 'lg';
}

const COLOR_CLASSES: Record<RAGColor, string> = {
  green: 'bg-green-500 text-white',
  amber: 'bg-amber-400 text-white',
  red: 'bg-red-500 text-white',
};

export default function ScoreIndicator({ pct, label, size = 'sm' }: Props) {
  const color = scoreColor(pct);
  const base = size === 'lg'
    ? 'inline-flex flex-col items-center justify-center rounded-full w-20 h-20 text-lg font-bold shadow'
    : 'inline-flex items-center justify-center rounded-full w-8 h-8 text-xs font-bold';
  return (
    <span className={`${base} ${COLOR_CLASSES[color]}`} title={label}>
      {size === 'lg' ? (
        <>
          <span>{pct.toFixed(0)}%</span>
          {label && <span className="text-xs font-normal mt-0.5 opacity-90">{label}</span>}
        </>
      ) : (
        <span>{pct.toFixed(0)}</span>
      )}
    </span>
  );
}
