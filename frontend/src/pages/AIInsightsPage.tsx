import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScore } from '../components/RiskScore';
import { ChartCard } from '../components/ChartCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  BrainCircuit,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Cpu,
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Interactive AI Sandbox state for Examiner
  const [sandboxConfidence, setSandboxConfidence] = useState(94);
  const [sandboxFailures, setSandboxFailures] = useState(0);
  const [sandboxHour, setSandboxHour] = useState(14);
  const [sandboxRequests, setSandboxRequests] = useState(1);
  const [sandboxSuspicious, setSandboxSuspicious] = useState(false);
  const [liveRiskResult, setLiveRiskResult] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const data = await aiService.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load AI statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLiveScore = async () => {
    try {
      const result = await aiService.predictRisk({
        confidence: sandboxConfidence,
        failed_attempts: sandboxFailures,
        access_hour: sandboxHour,
        recent_requests: sandboxRequests,
        suspicious_history: sandboxSuspicious,
      });
      setLiveRiskResult(result);
    } catch (err) {
      console.error('Live calculation error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    calculateLiveScore();
  }, [sandboxConfidence, sandboxFailures, sandboxHour, sandboxRequests, sandboxSuspicious]);

  if (isLoading) {
    return <LoadingSpinner label="Loading AI Telematics Analytics..." />;
  }

  const pieData = stats?.riskDistribution || [
    { name: 'Low Risk', count: 18, color: '#10b981' },
    { name: 'Medium Risk', count: 4, color: '#f59e0b' },
    { name: 'High Risk', count: 2, color: '#ef4444' },
  ];

  const confidenceData = stats?.confidenceBuckets || [
    { range: '90-100%', count: 16 },
    { range: '75-89%', count: 5 },
    { range: '60-74%', count: 2 },
    { range: '<60%', count: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-3 border-b border-slate-800/80">
        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
          Machine Learning Telematics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          AI Risk Engine & Intelligence Insights
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Academic demonstration of rule-based behavioral risk classification and confidence synthesis
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Evaluation Risk</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-300">
                {stats?.averageRiskScore || 24}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 100</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-1 block">
              ● NOMINAL BASELINE
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Mean Verification Confidence</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">
                {stats?.averageConfidence || 92.5}%
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-1 block">
              ● HIGH MATCH FIDELITY
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Evaluated Events</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">
                {stats?.totalEvaluations || 42}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-1 block">
              Logged in Local File DB
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-950/80 border border-blue-800 text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Examiner Sandbox */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>LIVE AI RISK ASSESSMENT SIMULATOR</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive test bench: adjust contextual telematics variables and observe real-time risk scoring
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            REAL-TIME PARAMETER BINDING
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
          {/* Controls Left */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Biometric Verification Confidence:</span>
                <span className="text-cyan-400 font-bold">{sandboxConfidence}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="99"
                value={sandboxConfidence}
                onChange={(e) => setSandboxConfidence(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Consecutive Failed Access Retries:</span>
                <span className="text-cyan-400 font-bold">{sandboxFailures} attempts</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={sandboxFailures}
                onChange={(e) => setSandboxFailures(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Access Time (24h Window):</span>
                  <span className="text-cyan-400 font-bold">{sandboxHour}:00 hrs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={sandboxHour}
                  onChange={(e) => setSandboxHour(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Request Frequency Burst:</span>
                  <span className="text-cyan-400 font-bold">{sandboxRequests} reqs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sandboxRequests}
                  onChange={(e) => setSandboxRequests(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={sandboxSuspicious}
                  onChange={(e) => setSandboxSuspicious(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Vehicle flagged in previous suspicious alert history (+20 risk)</span>
              </label>
            </div>
          </div>

          {/* Computed Output Right */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            {liveRiskResult ? (
              <>
                <RiskScore
                  score={liveRiskResult.risk_score}
                  subtitle={liveRiskResult.risk_level.toUpperCase()}
                  size={160}
                />
                <h4 className="text-sm font-bold text-white mt-2">
                  {liveRiskResult.policy_action}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {liveRiskResult.recommendation}
                </p>
                <div className="mt-3 w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">
                    Calculated Factors:
                  </span>
                  {liveRiskResult.risk_factors.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-400">Computing...</span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <ChartCard
          title="Risk Level Distribution"
          subtitle="Proportion of access sessions categorized by risk tier"
        >
          <div className="w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {pieData.map((entry: any, index: number) => (
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
          </div>
          <div className="flex justify-center gap-4 text-xs font-mono mt-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High
            </span>
          </div>
        </ChartCard>

        {/* Verification Confidence Breakdown */}
        <ChartCard
          title="Biometric Match Confidence Buckets"
          subtitle="Frequency distribution of simulated identity confidence"
        >
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
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
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Academic Methodology Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
        <span className="text-cyan-400 font-bold block mb-1">
          // Academic Methodology Statement:
        </span>
        "A simulated AI-based identity verification and risk assessment module developed for academic demonstration. The system calculates a deterministic multi-factor risk index across temporal, historical, and confidence dimensions."
      </div>
    </div>
  );
};
