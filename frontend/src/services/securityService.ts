import api from './api';
import { NotificationItem, SecurityEvent } from '../types';

export const securityService = {
  async getEvents(): Promise<SecurityEvent[]> {
    const res = await api.get<SecurityEvent[]>('/api/security/events');
    return res.data;
  },

  async reviewEvent(eventId: string) {
    const res = await api.put(`/api/security/events/${eventId}/review`);
    return res.data;
  },

  async getAlerts(): Promise<NotificationItem[]> {
    const res = await api.get<NotificationItem[]>('/api/security/alerts');
    return res.data;
  },

  async markAlertRead(alertId: string) {
    const res = await api.put(`/api/security/alerts/${alertId}/read`);
    return res.data;
  },

  async getSecurityScore() {
    const res = await api.get('/api/security/score');
    return res.data;
  },
};
