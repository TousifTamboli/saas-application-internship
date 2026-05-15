// ─── USER ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Technician' | 'Viewer';
}

// ─── EQUIPMENT ────────────────────────────────────────────────────
export type EquipmentStatus = 'Active' | 'Maintenance' | 'Offline';

export type EquipmentType =
  | 'CT Scanner' | 'MRI' | 'Sonography' | 'ECG' | 'X-Ray'
  | 'Blood Analyzer' | 'Patient Monitor' | 'Ventilator'
  | 'Online Consult' | 'Defibrillator' | 'Other';

export type Department =
  | 'Radiology' | 'Cardiology' | 'Pathology Lab' | 'ICU Monitoring'
  | 'Teleconsultancy' | 'Obstetrics' | 'Diagnostic' | 'Emergency' | 'Other';

export interface Equipment {
  _id: string;
  name: string;
  serialNumber: string;
  type: EquipmentType;
  department: Department;
  status: EquipmentStatus;
  assignedTech?: string;
  lastServiced?: string;
  nextServiceDue?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFilters {
  status?: EquipmentStatus;
  department?: Department;
  type?: EquipmentType;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── MAINTENANCE LOG ──────────────────────────────────────────────
export interface MaintenanceLog {
  _id: string;
  equipment: Equipment | string;
  technicianName: string;
  type: 'Scheduled' | 'Emergency' | 'Preventive';
  description: string;
  startDate: string;
  endDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  cost?: number;
  parts?: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── SERVICE REQUEST ──────────────────────────────────────────────
export interface ServiceRequest {
  _id: string;
  equipment: Equipment | string;
  requestedBy: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── STAFF ────────────────────────────────────────────────────────
export interface Staff {
  _id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  assignedEquipment: (Equipment | string)[];
  createdAt: string;
  updatedAt: string;
}

// ─── ALERT ────────────────────────────────────────────────────────
export interface Alert {
  _id: string;
  type: 'Offline' | 'Maintenance Due' | 'Info' | 'Critical';
  equipment?: Equipment | string;
  title: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  isRead: boolean;
  createdAt: string;
}

// ─── DASHBOARD ────────────────────────────────────────────────────
export interface DashboardStats {
  totalMachines: number;
  underMaintenance: number;
  onlineConsultsToday: number;
  uptimeRate: number;
  totalMachinesChange: string;
  maintenanceChange: string;
  consultsChange: string;
  uptimeChange: string;
}

export interface UtilizationDataPoint {
  date: string;
  inUse: number;
  idle: number;
}

export interface DepartmentData {
  department: string;
  count: number;
  percentage: number;
}

export interface MachinesByDepartmentResponse {
  total: number;
  departments: DepartmentData[];
}

// ─── API RESPONSE ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// ─── ENHANCED DASHBOARD ──────────────────────────────────────────
export interface EnhancedStats {
  maintenanceCostData: { type: string; cost: number }[];
  totalMaintenanceCost: number;
  monthlyCostTrend: { month: string; cost: number }[];
  serviceRequestsByPriority: { priority: string; count: number }[];
  serviceRequestsByStatus: { status: string; count: number }[];
  totalServiceRequests: number;
  warranty: { valid: number; expiring: number; expired: number };
  equipmentByType: { type: string; count: number }[];
  staffWorkload: { name: string; role: string; department: string; assignedCount: number }[];
  recentActivity: { type: string; title: string; description: string; severity: string; timestamp: string }[];
}

// ─── CHAT ─────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  success: boolean;
  data: ChatMessage & { intent: string };
}
