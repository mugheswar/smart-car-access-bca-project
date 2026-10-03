import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading System...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="relative">
        <Loader2 className={`${sizeMap[size]} text-cyan-400 animate-spin`} />
        <div className="absolute inset-0 blur-md bg-cyan-500/20 rounded-full" />
      </div>
      {label && <p className="text-xs font-mono text-slate-400 tracking-wider uppercase animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b14]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
