// Customer Types
export interface Customer {
  _id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  dateOfBirth?: number;
  notes?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Vehicle Types
export interface Vehicle {
  _id: string;
  organizationId: string;
  customerId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  engineType?: string;
  transmission?: string;
  mileage: number;
  lastServiceDate?: number;
  nextServiceDue?: number;
  notes?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Appointment Types
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  _id: string;
  organizationId: string;
  customerId: string;
  vehicleId: string;
  scheduledDate: number;
  duration: number;
  status: AppointmentStatus;
  serviceType: string;
  description?: string;
  assignedMechanicId?: string;
  reminderSent: boolean;
  reminderSentAt?: number;
  cancellationReason?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// Work Order Types
export type WorkOrderStatus =
  | "pending"
  | "in_progress"
  | "waiting_parts"
  | "completed"
  | "delivered"
  | "cancelled";

export type WorkOrderPriority = "low" | "normal" | "high" | "urgent";

export interface WorkOrder {
  _id: string;
  organizationId: string;
  appointmentId?: string;
  customerId: string;
  vehicleId: string;
  orderNumber: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  mileageIn: number;
  mileageOut?: number;
  assignedMechanicId?: string;
  estimatedCost: number;
  finalCost?: number;
  estimatedTime: number;
  actualTime?: number;
  description: string;
  diagnosis?: string;
  customerNotes?: string;
  mechanicNotes?: string;
  internalNotes?: string;
  startedAt?: number;
  completedAt?: number;
  deliveredAt?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
