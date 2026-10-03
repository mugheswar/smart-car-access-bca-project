import React, { useState, useEffect } from 'react';
import { securityService } from '../services/securityService';
import { SecurityEvent, NotificationItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Check,
  Clock,
  ShieldX,
  ExternalLink,
} from 'lucide-react';

export const SecurityAlertsPage: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  const fetchSecurityData = async () => {
    try {
      const [evList, alList] = await Promise.all([
        securityService.getEvents(),
        securityService.getAlerts(),
      ]);
      setEvents(evList);
      setAlerts(alList);
    } catch (err) {
      showToast('Error', 'Unable to load security events.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleReviewEvent = async (id: string) => {
    try {
      await securityService.reviewEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: 'reviewed' } : e))
      );
      showToast('Incident Reviewed', 'Security event marked as evaluated.', 'success');
    } catch (err) {
      showToast('Error', 'Could not update event status.', 'danger');
    }
  };

  const handleMarkAlertRead = async (id: string) => {
    try {
      await securityService.markAlertRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Auditing Security Anomaly Matrix..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800/80">
        <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
          Threat Intelligence Telemetry
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Security Alerts & Anomaly Incidents
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time intrusion detection and autonomous policy lockdown triggers
        </p>
      </div>

      {/* Critical Threat Alert Banner if high severity event exists */}
      {events.some((e) => e.severity === 'high' && e.status === 'active') && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-start gap-3 shadow-lg shadow-rose-950/40">
          <ShieldX className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold tracking-tight">Active High-Severity Security Alert Detected</h3>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              Autonomous immobilizer restrictions engaged. An off-hours high-risk attempt was blocked and dispatched to the administrator audit ledger.
            </p>
          </div>
        </div>
      )}

      {/* Security Incidents Feed */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Security Threat Events ({events.length})</span>
        </h2>

        {events.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Zero Security Threat Events"
            description="All telematics signals are clean. No anomalous or unauthorized access attempts recorded."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map((ev) => {
              const isHigh = ev.severity === 'high';
              const isReviewed = ev.status === 'reviewed';

              return (
                <div
                  key={ev.id}
                  className={`glass-panel rounded-2xl p-5 border transition-all ${
                    isHigh
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isHigh
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        }`}
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {ev.eventType.replace(/_/g, ' ').toUpperCase()}
                          </h4>
                          <RiskBadge level={ev.severity} score={ev.riskScore} />
                          {isReviewed && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              REVIEWED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {ev.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 mt-2">
                          <span>Target: {ev.vehicleInfo || 'Vehicle'}</span>
                          <span>•</span>
                          <span>Driver: {ev.userName || 'Unknown'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ev.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isReviewed && (
                      <button
                        onClick={() => handleReviewEvent(ev.id)}
                        className="self-end sm:self-start px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors flex items-center gap-1 border border-slate-700 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Push Notifications Log */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 mt-8">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4 font-mono">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>System Notifications Log ({alerts.length})</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {alerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No notifications stored.</p>
          ) : (
            alerts.map((a) => (
              <div
                key={a.id}
                className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        a.type === 'danger'
                          ? 'text-rose-400'
                          : a.type === 'warning'
                          ? 'text-amber-400'
                          : a.type === 'success'
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {a.title}
                    </span>
                    {!a.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{a.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!a.read && (
                    <button
                      onClick={() => handleMarkAlertRead(a.id)}
                      className="text-[10px] text-cyan-400 hover:underline mt-0.5"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
