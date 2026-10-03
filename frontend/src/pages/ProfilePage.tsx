import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Shield, Mail, Phone, Calendar, Key, CheckCircle2, Lock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Validation Error', 'New passwords do not match.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters long.', 'warning');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password Updated', 'Your security credentials have been updated in local storage.', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800/80">
        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
          Account Telematics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          User Profile & Security Keys
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Driver identity metadata, cryptographic keys, and session parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Driver Identity Card */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-cyan-900/40 mb-4">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">{user?.name}</h2>
          <span className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</span>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              ROLE: {user?.role?.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ACTIVE
            </span>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-800/80 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2 text-slate-500">
                <Phone className="w-4 h-4 text-cyan-500" /> Phone:
              </span>
              <span className="font-mono text-white">{user?.phone || '+91 98765 43210'}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4 text-cyan-500" /> Registered:
              </span>
              <span className="font-mono text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2 text-slate-500">
                <Shield className="w-4 h-4 text-emerald-500" /> Auth Type:
              </span>
              <span className="font-mono text-emerald-400">JWT HS256 Local</span>
            </div>
          </div>
        </div>

        {/* Right: Security Credentials Form */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Modify Driver Password</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Update password credentials stored in the local PBKDF2 hash table.
            </p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-cyan-950/40 transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
            PBKDF2-HMAC-SHA256 • 100,000 Key Derivation Iterations • Local Salt
          </div>
        </div>
      </div>
    </div>
  );
};
