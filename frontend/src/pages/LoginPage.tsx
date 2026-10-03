import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimulationBadge } from '../components/SimulationBadge';
import { Lock, Mail, Eye, EyeOff, LogIn, Car, ShieldAlert, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, quickDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('easyLoginEmail');
    const savedPassword = sessionStorage.getItem('easyLoginPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      sessionStorage.removeItem('easyLoginEmail');
      sessionStorage.removeItem('easyLoginPassword');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Authentication Successful', 'Welcome to the Smart Car Access portal.', 'success');
      
      // Check if user has vehicles
      try {
        const { vehicleService } = await import('../services/vehicleService');
        const vehicles = await vehicleService.getVehicles();
        if (vehicles.length === 0) {
          navigate('/vehicles?setup=true');
        } else {
          navigate('/dashboard');
        }
      } catch (e) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid login credentials. Please verify your email and password.';
      setErrorMsg(msg);
      showToast('Authentication Failed', msg, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = async () => {
    setEmail('user@smartcar.local');
    setPassword('User@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen cyber-bg flex flex-col justify-center items-center p-4">
      {/* Simulation Badge */}
      <div className="mb-6">
        <SimulationBadge size="md" />
      </div>

      <div className="w-full max-w-md rounded-2xl glass-panel-glow border border-slate-700/80 p-8 shadow-2xl relative">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 mb-3">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Access Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Smart Keyless Automotive Management Simulation</p>
        </div>

        {/* Quick Demo Examiner Fill Buttons */}
        <div className="p-3.5 mb-6 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Quick Examiner Auto-Fill:
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fillCredentials()}
              className="w-full py-1.5 px-2.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-300 font-mono text-[11px] transition-colors text-center"
            >
              Demo User
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@smartcar.local"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline font-medium">
            Register New Account
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
