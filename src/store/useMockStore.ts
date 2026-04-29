import { create } from "zustand";
import { User, Customer, Shipment, Task, Message, ActivityLog, Demurrage, ShipmentStep, ShipmentStatus, TaskStatus, ShipmentDocument, Channel, Notification } from "../types";
import { mockUsers, mockCustomers, mockShipments, mockTasks, mockMessages, mockActivityLogs, mockDemurrage, defaultSteps, mockDocuments, mockChannels, mockNotifications } from "../lib/mockData";

interface MockStore {
  currentUser: User | null;
  users: User[];
  customers: Customer[];
  shipments: Shipment[];
  tasks: Task[];
  messages: Message[];
  activityLogs: ActivityLog[];
  demurrageRecords: Demurrage[];
  shipmentSteps: ShipmentStep[];
  documents: ShipmentDocument[];
  channels: Channel[];
  notifications: Notification[];

  setCurrentUser: (user: User | null) => void;
  addShipment: (shipment: Omit<Shipment, "id">) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => void;
  addActivity: (log: Omit<ActivityLog, "id" | "createdAt">) => void;
  updateShipmentStep: (id: string, updates: Partial<ShipmentStep>) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addDocument: (document: Omit<ShipmentDocument, "id" | "createdAt">) => void;
  deleteDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

export const useMockStore = create<MockStore>((set) => ({
  currentUser: null,
  users: mockUsers,
  customers: mockCustomers,
  shipments: mockShipments,
  tasks: mockTasks,
  messages: mockMessages,
  activityLogs: mockActivityLogs,
  demurrageRecords: mockDemurrage,
  shipmentSteps: mockShipments.flatMap(s => 
    defaultSteps.map((name, i) => ({
      id: `step-${s.id}-${i}`,
      shipmentId: s.id,
      name,
      order: i,
      status: i < 3 ? "COMPLETED" : i === 3 ? "IN_PROGRESS" : "PENDING",
      completedAt: i < 3 ? s.createdAt : undefined
    }))
  ),
  documents: mockDocuments,
  channels: mockChannels,
  notifications: mockNotifications,

  setCurrentUser: (user) => set({ currentUser: user }),

  addShipment: (shipment) => {
    const id = `s${Math.random().toString(36).substr(2, 5)}`;
    const newShipment = { ...shipment, id };
    const newSteps = defaultSteps.map((name, i) => ({
      id: `step-${id}-${i}`,
      shipmentId: id,
      name,
      order: i,
      status: i === 0 ? "IN_PROGRESS" : "PENDING" as any
    }));

    set((state) => ({
      shipments: [newShipment, ...state.shipments],
      shipmentSteps: [...state.shipmentSteps, ...newSteps]
    }));
  },

  updateShipment: (id, updates) => set((state) => {
    const shipment = state.shipments.find(s => s.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-ship-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش اطلاعات محموله",
      entityType: "SHIPMENT",
      entityId: id,
      details: `اطلاعات محموله ${shipment?.trackingNumber} بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      shipments: state.shipments.map(s => s.id === id ? { ...s, ...updates } : s),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  updateShipmentStatus: (id, status) => set((state) => {
    const shipment = state.shipments.find(s => s.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}`,
      userName: state.currentUser?.name || "System",
      action: "تغییر وضعیت محموله",
      entityType: "SHIPMENT",
      entityId: id,
      details: `وضعیت محموله ${shipment?.trackingNumber} به ${status} تغییر یافت`,
      createdAt: new Date().toISOString()
    };
    return {
      shipments: state.shipments.map(s => s.id === id ? { ...s, status } : s),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  addTask: (task) => set((state) => {
    const newTask = { ...task, id: `t${Date.now()}`, createdAt: new Date().toISOString() };
    const log: ActivityLog = {
      id: `l${Date.now()}-task`,
      userName: state.currentUser?.name || "System",
      action: "ثبت وظیفه جدید",
      entityType: "TASK",
      entityId: newTask.id,
      details: `وظیفه "${task.title}" برای ${task.assignedToName} تعریف شد`,
      createdAt: new Date().toISOString()
    };
    return {
      tasks: [newTask, ...state.tasks],
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  updateTask: (id, updates) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-task-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش وظیفه",
      entityType: "TASK",
      entityId: id,
      details: `اطلاعات وظیفه "${task?.title}" بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  updateTaskStatus: (id, status) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-task-status`,
      userName: state.currentUser?.name || "System",
      action: "تغییر وضعیت وظیفه",
      entityType: "TASK",
      entityId: id,
      details: `وضعیت وظیفه "${task?.title}" به ${status} تغییر یافت`,
      createdAt: new Date().toISOString()
    };
    return {
      tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  deleteTask: (id) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-task-del`,
      userName: state.currentUser?.name || "System",
      action: "حذف وظیفه",
      entityType: "TASK",
      entityId: id,
      details: `وظیفه "${task?.title}" از سیستم حذف شد`,
      createdAt: new Date().toISOString()
    };
    return {
      tasks: state.tasks.filter(t => t.id !== id),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: `m${Date.now()}`, createdAt: new Date().toISOString() }]
  })),

  addActivity: (log) => set((state) => ({
    activityLogs: [{ ...log, id: `l${Date.now()}`, createdAt: new Date().toISOString() }, ...state.activityLogs]
  })),
  updateShipmentStep: (id, updates) => set((state) => {
    const step = state.shipmentSteps.find(s => s.id === id);
    const shipment = state.shipments.find(s => s.id === step?.shipmentId);
    const log: ActivityLog = {
      id: `l${Date.now()}-step`,
      userName: state.currentUser?.name || "System",
      action: "بروزرسانی مرحله محموله",
      entityType: "SHIPMENT",
      entityId: step?.shipmentId || id,
      details: `مرحله "${step?.name}" برای محموله ${shipment?.trackingNumber} ${updates.status === 'COMPLETED' ? 'تکمیل شد' : 'بروزرسانی شد'}`,
      createdAt: new Date().toISOString()
    };
    return {
      shipmentSteps: state.shipmentSteps.map(step => step.id === id ? { ...step, ...updates } : step),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  addDocument: (doc) => set((state) => {
    const newDoc = { ...doc, id: `doc${Date.now()}`, createdAt: new Date().toISOString() };
    const log: ActivityLog = {
      id: `l${Date.now()}-doc`,
      userName: state.currentUser?.name || "System",
      action: "بارگذاری سند",
      entityType: "DOCUMENT",
      entityId: newDoc.id,
      details: `فایل "${doc.name}" برای محموله ${doc.shipmentId || "عمومی"} بارگذاری شد`,
      createdAt: new Date().toISOString()
    };
    return {
      documents: [newDoc, ...state.documents],
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
  addUser: (user) => set((state) => {
    const freshUser = { ...user, id: `u${Date.now()}` };
    const log: ActivityLog = {
      id: `l${Date.now()}-user-add`,
      userName: state.currentUser?.name || "System",
      action: "افزودن کاربر جدید",
      entityType: "USER",
      entityId: freshUser.id,
      details: `کاربر جدید "${user.name}" با نقش ${user.role} به سیستم اضافه شد`,
      createdAt: new Date().toISOString()
    };
    return {
      users: [...state.users, freshUser],
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  updateUser: (id, updates) => set((state) => {
    const user = state.users.find(u => u.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-user-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش اطلاعات کاربر",
      entityType: "USER",
      entityId: id,
      details: `اطلاعات کاربر "${user?.name}" بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  deleteUser: (id) => set((state) => {
    const user = state.users.find(u => u.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-user-del`,
      userName: state.currentUser?.name || "System",
      action: "حذف کاربر",
      entityType: "USER",
      entityId: id,
      details: `دسترسی کاربر "${user?.name}" به سیستم مسدود شد`,
      createdAt: new Date().toISOString()
    };
    return {
      users: state.users.filter(u => u.id !== id),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  updateCurrentUser: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, ...updates } : u)
  })),
}));
