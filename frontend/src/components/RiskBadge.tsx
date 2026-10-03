import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, className = '' }) => {
  const normLevel = (level || 'low').toLowerCase();

  if (normLevel === 'low') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        LOW RISK {score !== undefined && `(${score})`}
      </span>
    );
  }

  if (normLevel === 'medium') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        MEDIUM RISK {score !== undefined && `(${score})`}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/40 text-rose-300 ${className}`}
    >
      <ShieldX className="w-3.5 h-3.5 text-rose-400" />
      HIGH RISK {score !== undefined && `(${score})`}
    </span>
  );
};
