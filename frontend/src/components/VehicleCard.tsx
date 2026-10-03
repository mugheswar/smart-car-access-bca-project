import React from 'react';
import { Vehicle } from '../types';
import { Lock, Unlock, Shield, Calendar, Palette, KeyRound, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDelete, canDelete = true }) => {
  const isUnlocked = vehicle.status === 'unlocked';
  const isRequested = vehicle.status === 'access_requested';

  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-cyan-950/20">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 font-semibold uppercase">
              {vehicle.brand}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">{vehicle.model}</h3>
            <div className="inline-block mt-1 font-mono text-xs px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 tracking-wider">
              {vehicle.registrationNumber}
            </div>
          </div>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase ${
              isUnlocked
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                : isRequested
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 animate-pulse'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
            }`}
          >
            {isUnlocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>UNLOCKED</span>
              </>
            ) : isRequested ? (
              <>
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>REQUESTED</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>LOCKED</span>
              </>
            )}
          </span>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Year: {vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span>Color: {vehicle.color}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Trust: {vehicle.securityScore || 92}%</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Type: {vehicle.type}</span>
          </div>
        </div>

        {vehicle.lastAccess && (
          <p className="text-[11px] font-mono text-slate-400 mb-4">
            Last Access: {new Date(vehicle.lastAccess).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(vehicle.lastAccess).toLocaleDateString()})
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          to={`/smart-access?vehicleId=${vehicle.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs tracking-wide shadow-md shadow-cyan-900/30 transition-all duration-200"
        >
          <KeyRound className="w-4 h-4" />
          <span>Smart Access Console</span>
        </Link>

        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(vehicle.id)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
            title="Remove Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
