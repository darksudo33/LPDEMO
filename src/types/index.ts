/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "CEO" | "MANAGER" | "OPERATIONS" | "CUSTOMER_SERVICE" | "FINANCE";
export type ShipmentStatus = "PENDING" | "BOOKED" | "IN_TRANSIT" | "ARRIVED" | "CUSTOMS" | "CLEARED" | "DELIVERED" | "CLOSED";
export type StepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type DemurrageStatus = "ACTIVE" | "PAID" | "WAIVED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isOnline?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  shipmentsCount: number;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  containerNumber: string;
  customerId: string;
  customerName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  createdAt: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  freeTimeDays: number;
}

export interface ShipmentStep {
  id: string;
  shipmentId: string;
  name: string;
  order: number;
  status: StepStatus;
  completedAt?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedByName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  shipmentId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  receiverName?: string;
  groupId?: string;
  isGroup?: boolean;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  createdAt: string;
  shipmentId?: string;
}

export interface Demurrage {
  id: string;
  shipmentId: string;
  freeTimeDays: number;
  freeTimeEnd: string;
  dailyCharge: number;
  totalCharge: number;
  status: DemurrageStatus;
}

export type DocumentType = "BILL_OF_LADING" | "INVOICE" | "PACKING_LIST" | "CUSTOMS_PERMIT" | "INSURANCE" | "OTHER";

export interface ShipmentDocument {
  id: string;
  shipmentId?: string;
  name: string;
  type: DocumentType;
  fileSize: string;
  uploadedBy: string;
  createdAt: string;
  url: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  roleLimit?: UserRole;
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "URGENT";
  isRead: boolean;
  createdAt: string;
  link?: string;
}
