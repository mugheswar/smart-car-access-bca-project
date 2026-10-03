import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { ChartCard } from '../components/ChartCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RiskBadge } from '../components/RiskBadge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Users,
  Car,
  KeyRound,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const stats = await adminService.getStatistics();
      setData(stats);
    } catch (err) {
      console.error('Failed to load admin statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Compiling Administrative Telematics Dashboard..." />;
  }

  const overview = data?.overview || {
    totalUsers: 2,
    totalVehicles: 4,
    totalAccessRequests: 42,
    successfulRequests: 34,
    failedRequests: 8,
    suspiciousEvents: 3,
  };

  const dailyTrend = data?.dailyTrend || [];
  const riskDistribution = data?.riskDistribution || [];
  const vehicleFrequency = data?.vehicleFrequency || [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
              Administration Central
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              AUDIT CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            System Telematics & Fleet Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fleet-wide access telematics, user verification metrics, and intrusion threat radar
          </p>
        </div>

        <button
          onClick={fetchAdminStats}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Overview Stat Cards (6 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Total Users</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{overview.totalUsers}</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Enrolled Fleet</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-300">{overview.totalVehicles}</span>
            <Car className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Total Access Logs</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{overview.totalAccessRequests}</span>
            <KeyRound className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Successful Unlocks</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {overview.successfulRequests}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Failed Attempts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-400">{overview.failedRequests}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Suspicious Events</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">{overview.suspiciousEvents}</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Daily Access Requests Area Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Daily Access Request Trend"
            subtitle="Volume of simulated keyless unlock sequences over the past 7 days"
            badge="LIVE TELEMATICS"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrend}>
                  <defs>
                    <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="succGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name="Total Requests"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#reqGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    name="Authorized Access"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#succGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Chart 2: Risk Tier Distribution */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Risk Tier Categorization"
            subtitle="Autonomous AI policy outcome distribution"
          >
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] font-mono mt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> High
                </span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Chart 3 & Recent Events Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicle Access Frequency */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Vehicle Fleet Utilization"
            subtitle="Access attempt frequency by Indian vehicle registration"
          >
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleFrequency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="vehicle" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar
                    dataKey="accessCount"
                    name="Total Sequences"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent High-Priority Security Events */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>High-Priority Security Interceptions</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest threat signals flagged by the AI engine
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {recentEvents.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No alerts logged.</p>
              ) : (
                recentEvents.slice(0, 4).map((ev: any) => (
                  <div key={ev.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate">{ev.vehicleInfo}</span>
                      <RiskBadge level={ev.severity} score={ev.riskScore} />
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{ev.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      {new Date(ev.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 text-right">
            Autonomous Incident Mitigation Protocol: ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};
