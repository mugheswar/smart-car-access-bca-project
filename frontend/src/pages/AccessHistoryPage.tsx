import React, { useState, useEffect } from 'react';
import { accessService } from '../services/accessService';
import { vehicleService } from '../services/vehicleService';
import { AccessLog, Vehicle } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export const AccessHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await accessService.getAccessHistory({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter,
        riskLevel: riskFilter,
        vehicleId: vehicleFilter,
      });
      setLogs(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      showToast('Error', 'Unable to fetch access audit records.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    vehicleService.getVehicles().then((data) => setVehicles(data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter, riskFilter, vehicleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            Telematics Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Access Logs & History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable system logs of all keyless entry requests, AI risk scores, and telematics outcomes
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration or user..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="granted">Granted</option>
            <option value="denied">Denied</option>
            <option value="pending_verification">Review Required</option>
          </select>

          {/* Risk Tier Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">All Risk Tiers</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => {
              setVehicleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.registrationNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner label="Querying Telematics Database..." />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Matching Access Logs"
            description="No access entries match your current search query or filter settings."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Driver / User</th>
                  <th className="py-3.5 px-4">Vehicle Profile</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">AI Risk Tier</th>
                  <th className="py-3.5 px-4">Policy Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {logs.map((log) => {
                  const isGranted = log.accessStatus === 'granted';
                  const isDenied = log.accessStatus === 'denied';

                  return (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                        {log.userName || 'Driver'}
                      </td>

                      {/* Vehicle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{log.vehicleName}</div>
                        <div className="text-[10px] font-mono text-cyan-400">
                          {log.registrationNumber}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono uppercase font-semibold text-slate-300">
                          {log.verificationStatus}
                        </span>
                      </td>

                      {/* Match Confidence */}
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                        {log.confidence.toFixed(1)}%
                      </td>

                      {/* Risk Tier Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <RiskBadge level={log.riskLevel} score={log.riskScore} />
                      </td>

                      {/* Access Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${
                            isGranted
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                              : isDenied
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                          }`}
                        >
                          {isGranted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isDenied ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{log.accessStatus.replace('_', ' ')}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="py-3 px-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Showing {logs.length} of {total} total records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
