import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  KeyRound,
  BrainCircuit,
  History,
  ShieldAlert,
  User,
  ShieldCheck,
  Users,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  const userNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/smart-access', label: 'Smart Access Console', icon: KeyRound },
    { to: '/ai-insights', label: 'AI Risk Engine', icon: BrainCircuit },
    { to: '/access-history', label: 'Access Logs', icon: History },
    { to: '/security-alerts', label: 'Security Alerts', icon: ShieldAlert },
    { to: '/profile', label: 'User Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0f1d]/95 lg:bg-[#0a0f1d]/80 lg:backdrop-blur-xl border-r border-slate-800/80 pt-16 lg:pt-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 py-2 overflow-y-auto flex-1">
          {/* Main User Navigation */}
          <div className="mb-6">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
              Vehicle Telematics
            </span>
            <nav className="space-y-1">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Simulation Warning */}
        <div className="p-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-cyan-400 font-semibold block mb-0.5">LOCAL SIMULATOR</span>
            <span>BCA Final Year Project</span>
          </div>
        </div>
      </aside>
    </>
  );
};
