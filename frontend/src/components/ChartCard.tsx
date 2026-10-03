import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`glass-panel rounded-2xl p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            {badge && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full flex-1 min-h-[220px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
