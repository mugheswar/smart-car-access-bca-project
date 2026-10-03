import api from './api';
import { AccessLog, RiskAssessmentResult, VerificationResult } from '../types';

export const accessService = {
  async requestAccess(vehicleId: string, scenarioMode: string = 'safe') {
    const res = await api.post('/api/access/request', { vehicleId, scenarioMode });
    return res.data;
  },

  async verifyIdentity(vehicleId: string, scenarioMode: string = 'safe', customConfidence?: number) {
    const res = await api.post<{ success: boolean; vehicleId: string; verification: VerificationResult }>('/api/access/verify', {
      vehicleId,
      scenarioMode,
      customConfidence,
    });
    return res.data;
  },

  async analyzeSecurity(payload: {
    vehicleId: string;
    scenarioMode?: string;
    confidence?: number;
    failedAttempts?: number;
    accessHour?: number;
    recentRequests?: number;
    suspiciousHistory?: boolean;
  }): Promise<RiskAssessmentResult> {
    const res = await api.post<RiskAssessmentResult>('/api/access/analyze', payload);
    return res.data;
  },

  async simulateUnlock(vehicleId: string, accessLogId?: string) {
    const res = await api.post('/api/access/simulate-unlock', { vehicleId, accessLogId });
    return res.data;
  },

  async simulateLock(vehicleId: string) {
    const res = await api.post('/api/access/simulate-lock', { vehicleId });
    return res.data;
  },

  async getAccessHistory(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    riskLevel?: string;
    vehicleId?: string;
  }): Promise<{ items: AccessLog[]; total: number; page: number; limit: number; totalPages: number }> {
    const res = await api.get('/api/access/history', { params });
    return res.data;
  },
};
