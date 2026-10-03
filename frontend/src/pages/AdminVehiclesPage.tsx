import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Car, Lock, Unlock, Trash2, Search, Calendar, Shield } from 'lucide-react';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchFleet = async () => {
    try {
      const data = await adminService.getAdminVehicles();
      setVehicles(data);
    } catch (err) {
      showToast('Error', 'Unable to retrieve fleet records.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminService.deleteAdminVehicle(deleteTargetId);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTargetId));
      showToast('Vehicle Detached', 'Vehicle profile removed from administrative registry.', 'info');
    } catch (err) {
      showToast('Error', 'Failed to remove vehicle.', 'danger');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const s = search.toLowerCase();
    return (
      v.registrationNumber?.toLowerCase().includes(s) ||
      v.brand?.toLowerCase().includes(s) ||
      v.model?.toLowerCase().includes(s) ||
      v.ownerName?.toLowerCase().includes(s)
    );
  });

  if (isLoading) {
    return <LoadingSpinner label="Auditing Fleet Telematics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
            Fleet Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Global Connected Fleet
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of all Indian vehicles enrolled across the simulation platform
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by registration or brand..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Fleet Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredVehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No Fleet Vehicles Found"
            description="No vehicles match the specified criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Vehicle Identity</th>
                  <th className="py-3.5 px-4">Registration</th>
                  <th className="py-3.5 px-4">Owner Profile</th>
                  <th className="py-3.5 px-4">Type & Year</th>
                  <th className="py-3.5 px-4">Latch Status</th>
                  <th className="py-3.5 px-4">AI Trust Score</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredVehicles.map((v) => {
                  const isUnlocked = v.status === 'unlocked';

                  return (
                    <tr key={v.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {v.brand} {v.model}
                        </div>
                        <div className="text-[11px] text-slate-400">{v.color}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                        {v.registrationNumber}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {v.ownerName || 'Demo Owner'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {v.type} • {v.year}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isUnlocked
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                          }`}
                        >
                          {isUnlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-rose-400" />}
                          <span>{v.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {v.securityScore || 92}%
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteTargetId(v.id)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
                          title="Remove Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Admin Fleet Removal"
        message="Are you sure you wish to detach this vehicle from the platform fleet?"
        confirmText="Remove Vehicle"
        isDestructive={true}
      />
    </div>
  );
};
