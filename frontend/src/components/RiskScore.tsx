import React from 'react';
import { motion } from 'framer-motion';

interface RiskScoreProps {
  score: number; // 0 - 100
  title?: string;
  subtitle?: string;
  size?: number; // size in px
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score = 92,
  title = 'AI SECURITY SCORE',
  subtitle,
  size = 180,
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let color = '#10b981'; // emerald
  let statusText = 'LOW RISK';
  let glowColor = 'rgba(16, 185, 129, 0.2)';

  if (score < 50) {
    color = '#ef4444'; // rose
    statusText = 'HIGH RISK';
    glowColor = 'rgba(239, 68, 68, 0.25)';
  } else if (score < 75) {
    color = '#f59e0b'; // amber
    statusText = 'MODERATE RISK';
    glowColor = 'rgba(245, 158, 11, 0.2)';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {title && <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">{title}</span>}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{ background: glowColor }}
        />
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-white font-mono"
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-400 font-mono">/ 100</span>
          <span
            className="mt-1 text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {subtitle || statusText}
          </span>
        </div>
      </div>
    </div>
  );
};
