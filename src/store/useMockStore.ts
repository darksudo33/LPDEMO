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

  updateShipment: (id, updates) => set((state) => ({
    shipments: state.shipments.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

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

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: `m${Date.now()}`, createdAt: new Date().toISOString() }]
  })),

  addActivity: (log) => set((state) => ({
    activityLogs: [{ ...log, id: `l${Date.now()}`, createdAt: new Date().toISOString() }, ...state.activityLogs]
  })),
  updateShipmentStep: (id, updates) => set((state) => ({
    shipmentSteps: state.shipmentSteps.map(step => step.id === id ? { ...step, ...updates } : step)
  })),
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
  addUser: (user) => set((state) => ({
    users: [...state.users, { ...user, id: `u${state.users.length + 1}` }]
  })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  updateCurrentUser: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, ...updates } : u)
  })),
}));
