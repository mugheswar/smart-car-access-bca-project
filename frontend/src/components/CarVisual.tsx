import React from 'react';
import { Lock, Unlock, ShieldCheck, Key } from 'lucide-react';
import { VehicleStatus } from '../types';

interface CarVisualProps {
  brand?: string;
  model?: string;
  type?: string;
  color?: string;
  status: VehicleStatus;
  className?: string;
}

export const CarVisual: React.FC<CarVisualProps> = ({
  brand = 'Hyundai',
  model = 'Creta',
  type = 'SUV',
  status = 'locked',
  className = '',
}) => {
  const isUnlocked = status === 'unlocked';
  const isRequested = status === 'access_requested';

  const glowColor = isUnlocked ? '#10b981' : isRequested ? '#06b6d4' : '#ef4444';
  const glowShadow = isUnlocked
    ? 'shadow-emerald-500/20'
    : isRequested
    ? 'shadow-cyan-500/30'
    : 'shadow-rose-500/20';

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl transition-all duration-500 ${glowShadow} ${className}`}
    >
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Underglow Ground Effect */}
      <div
        className="absolute bottom-6 w-3/4 h-12 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-50"
        style={{ backgroundColor: glowColor }}
      />

      {/* Status Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-md transition-all duration-300 ${
            isUnlocked
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
              : isRequested
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 animate-pulse'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
          }`}
        >
          {isUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIMULATED UNLOCKED</span>
            </>
          ) : isRequested ? (
            <>
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACCESS REQUESTED</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>SIMULATED LOCKED</span>
            </>
          )}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 text-right">
        <span className="text-[11px] font-mono text-slate-400 block">{type.toUpperCase()}</span>
        <span className="text-xs font-bold text-white tracking-wide">{brand} {model}</span>
      </div>

      {/* SVG Automotive Vehicle Illustration */}
      <div className="relative w-full max-w-[400px] my-4 flex items-center justify-center">
        <svg
          viewBox="0 0 420 180"
          className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vehicle Ground Shadow */}
          <ellipse cx="210" cy="145" rx="180" ry="8" fill="#000" fillOpacity="0.8" />

          {/* Main Chassis Silhouette (Sleek Sports Sedan) */}
          <path
            d="
              M 35 120
              C 30 110, 30 95, 45 85
              C 60 75, 90 70, 130 60
              C 160 50, 185 30, 220 30
              L 260 30
              C 300 30, 340 45, 370 70
              C 385 80, 390 100, 390 120
              Z
            "
            fill="url(#carBodyGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Wheel Well Cutouts */}
          <circle cx="100" cy="120" r="28" fill="#070b14" />
          <circle cx="310" cy="120" r="28" fill="#070b14" />

          {/* Wheels */}
          <g>
            {/* Front Wheel */}
            <circle cx="100" cy="120" r="24" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <circle cx="100" cy="120" r="16" fill="#1e293b" />
            <circle cx="100" cy="120" r="7" fill="#475569" />
            <circle cx="100" cy="120" r="2.5" fill={glowColor} />

            {/* Rear Wheel */}
            <circle cx="310" cy="120" r="24" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <circle cx="310" cy="120" r="16" fill="#1e293b" />
            <circle cx="310" cy="120" r="7" fill="#475569" />
            <circle cx="310" cy="120" r="2.5" fill={glowColor} />
          </g>

          {/* Dark Interior Hole (Visible when animated door opens) */}
          <path
            d="M 130 120 L 140 60 C 170 40, 190 35, 230 35 L 230 120 Z"
            fill="#020617"
          />

          {/* Rear Passenger Window */}
          <path
            d="M 235 35 L 265 35 C 295 35, 320 45, 340 55 L 340 65 L 235 60 Z"
            fill="url(#windowGrad)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Side Contour Character Line (Rear) */}
          <path
            d="M 230 75 C 300 75, 350 80, 385 85"
            stroke="#64748b"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Animated Front Door */}
          <g
            style={{
              transformOrigin: '135px 80px',
              transition: 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isUnlocked ? 'perspective(1200px) rotateY(-65deg)' : 'perspective(1200px) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Front Door Panel */}
            <path
              d="M 130 120 L 140 60 C 170 40, 190 35, 230 35 L 230 120 Z"
              fill="url(#carBodyGrad)"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            {/* Front Door Window */}
            <path
              d="M 145 55 C 170 40, 190 35, 225 35 L 225 60 L 145 60 Z"
              fill="url(#windowGrad)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            {/* Side Contour Character Line (Front Door) */}
            <path
              d="M 135 72 L 230 75"
              stroke="#64748b"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Flush Door Handle */}
            <rect x="205" y="70" width="16" height="4" rx="2" fill="#94a3b8" />
            
            {/* Smart Sensor Ring */}
            <circle cx="219" cy="72" r="4.5" fill={glowColor} className="animate-pulse" />
            <circle
              cx="219"
              cy="72"
              r="9"
              stroke={glowColor}
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
              className="animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </g>

          {/* Glowing Headlight */}
          <path
            d="M 35 95 L -10 90 L -10 115 Z"
            fill="url(#headlightBeam)"
            opacity={isUnlocked ? "0.8" : isRequested ? "0.9" : "0.2"}
          />
          <path d="M 35 95 L 45 92 L 45 98 Z" fill="#38bdf8" />
          <circle cx="38" cy="95" r="2" fill="#fff" className="animate-pulse" />

          {/* Futuristic LED Taillight */}
          <path d="M 388 95 L 390 95 L 390 105 L 385 102 Z" fill="#f43f5e" />
          <ellipse cx="388" cy="98" rx="2" ry="5" fill="#f43f5e" className="animate-pulse" />
          <ellipse cx="388" cy="98" rx="1" ry="3" fill="#fff" />

          {/* Defs / Gradients */}
          <defs>
            <linearGradient id="carBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="45%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#050812" />
            </linearGradient>
            <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Latch Telemetry Status Footer */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: glowColor }}
          />
          IMMOBILIZER: {isUnlocked ? 'BYPASSED (SIM)' : 'ENGAGED'}
        </span>
        <span className="text-cyan-400/90 font-medium">KEYLESS SENSOR ACTIVE</span>
      </div>
    </div>
  );
};
