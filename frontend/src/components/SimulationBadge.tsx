import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SimulationBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SimulationBadge: React.FC<SimulationBadgeProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5',
  };

  return (
    <div
      className={`inline-flex items-center font-medium rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-900/40 backdrop-blur-md ${sizeClasses[size]} ${className}`}
    >
      <ShieldAlert className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
      <span>🔒 Simulation Mode — No real vehicle control</span>
    </div>
  );
};
