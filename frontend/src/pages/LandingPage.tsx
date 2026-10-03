import React from 'react';
import { Link } from 'react-router-dom';
import { SimulationBadge } from '../components/SimulationBadge';
import { CarVisual } from '../components/CarVisual';
import {
  ShieldCheck,
  Cpu,
  KeyRound,
  History,
  Activity,
  Lock,
  ArrowRight,
  Database,
  Smartphone,
  Radio,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen cyber-bg text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-900/40">
            <KeyRound className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-sans">
            SMART CAR <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">ACCESS</span>
          </span>
        </div>

        <div className="hidden md:block">
          <SimulationBadge size="sm" />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-900/30 transition-all flex items-center gap-1.5"
          >
            <span>Launch Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>BCA Final Year Project Demonstration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Smart Car Access</span> and Keyless Assistance
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Intelligent, secure and contactless vehicle access through AI-driven identity verification and risk analysis. Designed as a complete local software simulation with deterministic safety architecture.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
              <span>Academic Demonstration Platform — 100% Local Simulation (No real vehicle control)</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-cyan-950/50 flex items-center gap-2 transition-all group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/smart-access"
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-colors flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Explore Simulation</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual: CarVisual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <CarVisual
              brand="Hyundai"
              model="Creta"
              type="SUV"
              status="locked"
              className="w-full max-w-md"
            />
            <p className="text-[11px] font-mono text-slate-500 text-center mt-3">
              Interactive Virtual Telematics Simulation • Polar White Hyundai Creta
            </p>
          </div>
        </div>

        {/* How It Works Workflow Steps */}
        <section className="mt-24 pt-12 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              How the Smart Access Simulation Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              A 5-stage deterministic security verification pipeline modeled after modern automotive keyless entry architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Login', desc: 'Secure JWT role-based access' },
              { step: '02', title: 'Select Vehicle', desc: 'Pick registered vehicle profile' },
              { step: '03', title: 'Verify Identity', desc: 'Simulated biometric mesh check' },
              { step: '04', title: 'AI Risk Analysis', desc: 'Contextual risk assessment score' },
              { step: '05', title: 'Access Decision', desc: 'Simulated door latch unlock' },
            ].map((s, idx) => (
              <div
                key={s.step}
                className="glass-panel rounded-2xl p-5 relative border border-slate-800 hover:border-cyan-500/40 transition-colors"
              >
                <span className="text-2xl font-mono font-black text-cyan-500/30 block mb-2">{s.step}</span>
                <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ChevronRight className="w-5 h-5 text-cyan-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Core System Features */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineered for Comprehensive Academic Demonstration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 w-fit mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Smart Access Simulation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step keyless access sequencing with state-reactive simulated vehicle lock status, door latches, and immobilizer state updates.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Simulated Identity Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local rule-based biometric verification simulation displaying facial landmark analysis, optical sharpness checks, and confidence percentage.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-400 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Intelligent Risk Assessment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contextual risk evaluation algorithm classifying access attempts into Low, Medium, and High risk tiers based on access hours and historical patterns.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 w-fit mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Security Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant anomaly detection for repeated failures, off-hours access, and high-risk intrusion attempts with automated incident logging.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 w-fit mb-4">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Audit Logs & History</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Searchable, filterable, and paginated audit trail of all access requests with verification scores and policy actions.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 w-fit mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Administrator Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated administration portal featuring Recharts time-series data, fleet distribution, user access controls, and security auditing.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack & Architecture */}
        <section className="mt-20 p-8 rounded-3xl glass-panel-glow border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">100% Local Technology</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1 mb-4">
                Zero Cloud Dependencies • Student Laptop Friendly
              </h2>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Frontend:</strong> React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Backend:</strong> Python 3.13, FastAPI, Uvicorn, Pydantic, JWT Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Database:</strong> High-performance Local File Storage engine (no external database daemon required)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>AI Engine:</strong> Local rule-based simulated intelligence pipeline (0 GPU requirements)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-slate-500">// Academic Architecture Overview</div>
              <div className="text-cyan-400">Frontend [localhost:5173]</div>
              <div className="pl-4 text-slate-400">└── REST API (Axios + JWT Auth)</div>
              <div className="text-blue-400">FastAPI Backend [localhost:8000]</div>
              <div className="pl-4 text-slate-400">├── Auth & RBAC Middleware</div>
              <div className="pl-4 text-slate-400">├── Vehicle Telematics Management</div>
              <div className="pl-4 text-slate-400">├── AI Risk Assessment Engine</div>
              <div className="pl-4 text-slate-400">└── Local File Storage DB [./data/*.json]</div>
            </div>
          </div>
        </section>

        {/* Future Scope Section */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Roadmap</span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Future Scope (Post-Academic Deployment)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Physical automotive features identified for future enterprise implementation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: Smartphone, label: 'Digital Car Keys' },
              { icon: Radio, label: 'BLE & NFC Actuation' },
              { icon: Cpu, label: 'CAN Bus / OBD-II Hardware' },
              { icon: ShieldCheck, label: 'Advanced Neural Biometrics' },
              { icon: Database, label: 'Multi-Region Cloud Sync' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center justify-center gap-2"
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">{f.label}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
                    Future Scope
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
