import api from './api';
import { User } from '../types';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const res = await api.get<User[]>('/api/admin/users');
    return res.data;
  },

  async toggleUserStatus(userId: string) {
    const res = await api.put(`/api/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  async getAdminVehicles() {
    const res = await api.get('/api/admin/vehicles');
    return res.data;
  },

  async deleteAdminVehicle(vehicleId: string) {
    const res = await api.delete(`/api/admin/vehicles/${vehicleId}`);
    return res.data;
  },

  async getAdminLogs() {
    const res = await api.get('/api/admin/access-logs');
    return res.data;
  },

  async getStatistics() {
    const res = await api.get('/api/admin/statistics');
    return res.data;
  },
};
