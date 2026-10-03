import api from './api';
import { Vehicle } from '../types';

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const res = await api.get<Vehicle[]>('/api/vehicles');
    return res.data;
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const res = await api.get<Vehicle>(`/api/vehicles/${id}`);
    return res.data;
  },

  async createVehicle(data: {
    registrationNumber: string;
    brand: string;
    model: string;
    type?: string;
    year?: number;
    color?: string;
  }): Promise<Vehicle> {
    const res = await api.post<Vehicle>('/api/vehicles', data);
    return res.data;
  },

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const res = await api.put<Vehicle>(`/api/vehicles/${id}`, data);
    return res.data;
  },

  async deleteVehicle(id: string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(`/api/vehicles/${id}`);
    return res.data;
  },
};
