import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { FileText, Search, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdminLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const s = search.toLowerCase();
    return (
      l.registrationNumber?.toLowerCase().includes(s) ||
      l.userName?.toLowerCase().includes(s) ||
      l.vehicleName?.toLowerCase().includes(s) ||
      l.riskLevel?.toLowerCase().includes(s)
    );
  });

  if (isLoading) {
    return <LoadingSpinner label="Auditing Global Telematics Records..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
            Ledger Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            System Audit & Access Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable telematics audit logs captured by local file database
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by vehicle, user or risk..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing {filteredLogs.length} Records
        </span>
      </div>

      {/* Global Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Records Found"
            description="No audit records match the search filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Audit Timestamp</th>
                  <th className="py-3.5 px-4">Driver Profile</th>
                  <th className="py-3.5 px-4">Target Vehicle</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Risk Evaluation</th>
                  <th className="py-3.5 px-4">Policy Result</th>
                  <th className="py-3.5 px-4">Contributing Factors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredLogs.map((l) => (
                  <tr key={l._id || l.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {l.userName || 'Driver'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{l.vehicleName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">{l.registrationNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                      {l.confidence}%
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge level={l.riskLevel} score={l.riskScore} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          l.accessStatus === 'granted'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : l.accessStatus === 'denied'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {l.accessStatus === 'granted' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : l.accessStatus === 'denied' ? (
                          <XCircle className="w-3 h-3 text-rose-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        )}
                        <span>{l.policyAction || l.accessStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-400 max-w-xs truncate">
                      {l.riskFactors?.join(', ') || 'Nominal telemetry bounds'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
