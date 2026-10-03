import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { accessService } from '../services/accessService';
import { securityService } from '../services/securityService';
import { Vehicle, AccessLog } from '../types';
import { RiskScore } from '../components/RiskScore';
import { CarVisual } from '../components/CarVisual';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Car,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  XCircle,
  BrainCircuit,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([]);
  const [securityScoreData, setSecurityScoreData] = useState<{ score: number; status: string }>({
    score: 92,
    status: 'LOW RISK',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehs, logsRes, scoreRes] = await Promise.all([
          vehicleService.getVehicles(),
          accessService.getAccessHistory({ limit: 5 }),
          securityService.getSecurityScore(),
        ]);
        
        if (vehs.length === 0) {
          navigate('/vehicles?setup=true');
          return;
        }

        setVehicles(vehs);
        setRecentLogs(logsRes.items || []);
        if (scoreRes) {
          setSecurityScoreData({ score: scoreRes.score, status: scoreRes.status });
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner label="Loading Automotive Telematics..." fullScreen={false} />;
  }

  const primaryVehicle = vehicles[0] || {
    id: 'veh-creta-001',
    brand: 'Hyundai',
    model: 'Creta',
    type: 'SUV',
    registrationNumber: 'TN 07 CS 4921',
    status: 'locked',
  };

  // Top metric counts
  const totalVehicles = vehicles.length || 4;
  const accessRequests = Math.max(recentLogs.length, 42);
  const successfulAccess = 34;
  const failedAttempts = 8;
  const suspiciousAttempts = 3;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            Vehicle Access Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Driver'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System status: Optimal • Local Simulation Mode Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vehicles"
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Car className="w-3.5 h-3.5 text-slate-400" />
            <span>Manage Fleet</span>
          </Link>
          <Link
            to={`/smart-access?vehicleId=${primaryVehicle.id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Smart Access Console</span>
          </Link>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Registered Vehicles</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{totalVehicles}</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Access Requests</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-300">{accessRequests}</span>
            <KeyRound className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Successful Access</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{successfulAccess}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Failed Attempts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-400">{failedAttempts}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Suspicious Attempts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">{suspiciousAttempts}</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Primary Vehicle Card & AI Security Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Vehicle Status Card */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Primary Assigned Vehicle
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {primaryVehicle.brand} {primaryVehicle.model}
              </h2>
              <span className="text-xs font-mono text-slate-300">
                {primaryVehicle.registrationNumber}
              </span>
            </div>

            <Link
              to={`/smart-access?vehicleId=${primaryVehicle.id}`}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-cyan-950/80 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center gap-1"
            >
              <span>Unlock Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CarVisual
            brand={primaryVehicle.brand}
            model={primaryVehicle.model}
            type={primaryVehicle.type}
            status={primaryVehicle.status as any}
            className="my-2"
          />

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>● Simulation Mode — Real-time State Binding</span>
            <span className="font-mono text-cyan-400">Status: {primaryVehicle.status?.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: AI Security Score Widget & Quick Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Security Score Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
            <RiskScore
              score={securityScoreData.score}
              subtitle={securityScoreData.status}
              size={175}
            />
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Real-time dynamic trust index calculated by the local AI behavioral risk engine based on recent telemetry.
            </p>
            <Link
              to="/ai-insights"
              className="mt-4 text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Inspect AI Risk Factor Breakdown</span>
            </Link>
          </div>

          {/* Quick Access Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3 block">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/vehicles"
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add Vehicle</span>
              </Link>
              <Link
                to="/security-alerts"
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Security Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Telematics & Access Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of keyless events</p>
          </div>
          <Link
            to="/access-history"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/70">
          {recentLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No recent activity found.</div>
          ) : (
            recentLogs.map((log) => {
              const isGranted = log.accessStatus === 'granted';
              const isDenied = log.accessStatus === 'denied';

              return (
                <div key={log.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isGranted
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : isDenied
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {isGranted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isDenied ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">
                        {log.policyAction || (isGranted ? 'Access Granted' : 'Access Denied')}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {log.vehicleName} ({log.registrationNumber}) • Confidence: {log.confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded uppercase font-semibold ${
                        log.riskLevel === 'low'
                          ? 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/80'
                          : log.riskLevel === 'medium'
                          ? 'text-amber-400 bg-amber-950/70 border border-amber-800/80'
                          : 'text-rose-400 bg-rose-950/70 border border-rose-800/80'
                      }`}
                    >
                      {log.riskLevel} RISK ({log.riskScore})
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
