export type Role = 'user' | 'admin';
export type UserStatus = 'active' | 'disabled';
export type VehicleStatus = 'locked' | 'unlocked' | 'access_requested';
export type RiskLevel = 'low' | 'medium' | 'high';
export type AccessStatus = 'granted' | 'denied' | 'pending_verification';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  year: number;
  color: string;
  status: VehicleStatus;
  createdAt: string;
  securityScore?: number;
  lastAccess?: string | null;
}

export interface AccessLog {
  id: string;
  userId?: string;
  userName?: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  verificationStatus: string;
  confidence: number;
  riskScore: number;
  riskLevel: RiskLevel;
  accessStatus: AccessStatus;
  policyAction: string;
  timestamp: string;
  recommendation?: string;
  riskFactors?: string[];
}

export interface SecurityEvent {
  id: string;
  userId?: string;
  userName?: string;
  vehicleId?: string;
  vehicleInfo?: string;
  eventType: string;
  severity: RiskLevel;
  description: string;
  riskScore?: number;
  timestamp: string;
  status: 'active' | 'reviewed' | 'resolved';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
}

export interface VerificationResult {
  face_detected: boolean;
  image_quality: string;
  confidence: number;
  status: 'VERIFIED' | 'SUSPICIOUS' | 'FAILED' | 'ADDITIONAL_VERIFICATION';
  simulation_disclaimer: string;
  step_logs: string[];
}

export interface RiskAssessmentResult {
  accessLogId?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  accessStatus: AccessStatus;
  policyAction: string;
  recommendation: string;
  riskFactors: string[];
  confidence: number;
  timestamp: string;
  simulationDisclaimer: string;
}

export interface DemoScenario {
  id: 'safe' | 'medium' | 'high';
  name: string;
  description: string;
  confidence: number;
  failed_attempts: number;
  access_hour: number;
  recent_requests: number;
  suspicious_history: boolean;
  expected_risk: string;
  expected_outcome: string;
}
