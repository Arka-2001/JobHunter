import React from 'react';
import { Sparkles } from 'lucide-react';

const MatchScore = ({ score = 0, category, size = 'md' }) => {
  const getBadgeStyle = () => {
    if (score >= 80) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ring: 'text-emerald-600',
        label: category || 'High Match',
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        ring: 'text-indigo-600',
        label: category || 'Good Match',
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      ring: 'text-slate-500',
      label: category || 'Potential Match',
    };
  };

  const style = getBadgeStyle();

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-2xl border ${style.bg} flex flex-col items-center justify-center text-center`}>
        <span className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 opacity-90">
          <Sparkles className="w-3.5 h-3.5" /> Compatibility
        </span>
        <div className="text-3xl font-extrabold tracking-tight">{score}%</div>
        <span className="text-xs font-semibold mt-1">{style.label}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg}`}>
      <Sparkles className="w-3.5 h-3.5" />
      <span>{score}% Match</span>
    </div>
  );
};

export default MatchScore;
