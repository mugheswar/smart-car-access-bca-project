import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SimulationBadge } from './SimulationBadge';
import { securityService } from '../services/securityService';
import { NotificationItem } from '../types';
import {
  Car,
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      securityService
        .getAlerts()
        .then((alerts) => setNotifications(alerts))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo and Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
                SMART CAR <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">ACCESS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:block">AI Keyless Assistance Simulation</span>
            </div>
          </Link>
        </div>

        {/* Center: Prominent Permanent Simulation Badge */}
        <div className="hidden md:flex items-center justify-center">
          <SimulationBadge size="md" />
        </div>

        {/* Right Side: Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-slate-700/80 p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Security Alerts ({notifications.length})
                  </span>
                  <Link
                    to="/security-alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View All <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notifications at this time.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 text-xs hover:bg-slate-800/40 rounded-xl transition-colors">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              n.type === 'danger'
                                ? 'text-rose-400'
                                : n.type === 'warning'
                                ? 'text-amber-400'
                                : n.type === 'success'
                                ? 'text-emerald-400'
                                : 'text-cyan-400'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="text-xs font-semibold text-white block leading-tight">{user.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{user.role}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/40 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
