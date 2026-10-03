import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Users, Shield, CheckCircle2, XCircle, Search, Power } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      showToast('Error', 'Unable to fetch user directory.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;

    if (toggleTarget.id === currentUser?.id) {
      showToast('Action Prohibited', 'Administrators cannot deactivate their own active account.', 'warning');
      setToggleTarget(null);
      return;
    }

    try {
      const res = await adminService.toggleUserStatus(toggleTarget.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === toggleTarget.id ? { ...u, status: res.newStatus } : u))
      );
      showToast('Status Updated', res.message, 'success');
    } catch (err: any) {
      showToast('Action Failed', err.response?.data?.detail || 'Could not update user status.', 'danger');
    } finally {
      setToggleTarget(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
    );
  });

  if (isLoading) {
    return <LoadingSpinner label="Auditing User Accounts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
            Identity Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            User Account Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role assignments, authentication status, and active session governance
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="No user accounts match the specified search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Access Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Enrolled Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredUsers.map((u) => {
                  const isActive = u.status === 'active';
                  const isCurrent = u.id === currentUser?.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {u.phone || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${
                            u.role === 'admin'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                            isActive
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>{u.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setToggleTarget(u)}
                          disabled={isCurrent}
                          className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
                            isCurrent
                              ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                              : isActive
                              ? 'bg-slate-900 border-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400'
                              : 'bg-slate-900 border-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-400'
                          }`}
                          title={isCurrent ? 'Self-deactivation disabled' : isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          <Power className="w-4 h-4" />
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(toggleTarget)}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleConfirmToggle}
        title={toggleTarget?.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
        message={`Are you sure you want to ${
          toggleTarget?.status === 'active' ? 'deactivate' : 'reactivate'
        } user "${toggleTarget?.name}" (${toggleTarget?.email})?`}
        confirmText={toggleTarget?.status === 'active' ? 'Deactivate' : 'Reactivate'}
        isDestructive={toggleTarget?.status === 'active'}
      />
    </div>
  );
};
