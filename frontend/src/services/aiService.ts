import api from './api';
import { DemoScenario, VerificationResult } from '../types';

export const aiService = {
  async getScenarios(): Promise<DemoScenario[]> {
    const res = await api.get<DemoScenario[]>('/api/ai/scenarios');
    return res.data;
  },

  async simulateVerify(payload: {
    scenarioMode?: string;
    customConfidence?: number;
    imageMetadata?: any;
  }): Promise<VerificationResult> {
    const res = await api.post<VerificationResult>('/api/ai/verify', payload);
    return res.data;
  },

  async predictRisk(features: {
    confidence: number;
    failed_attempts: number;
    access_hour: number;
    recent_requests: number;
    suspicious_history: boolean;
  }) {
    const res = await api.post('/api/ai/risk-predict', features);
    return res.data;
  },

  async getStatistics() {
    const res = await api.get('/api/ai/statistics');
    return res.data;
  },
};
