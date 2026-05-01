import { create } from "zustand";
import { User, Customer, Shipment, Task, Message, ActivityLog, Demurrage, ShipmentStep, ShipmentStatus, TaskStatus, ShipmentDocument, Channel, Notification, Appointment, AppointmentStatus, Cheque, Quote } from "../types";
import { mockUsers, mockCustomers, mockShipments, mockTasks, mockMessages, mockActivityLogs, mockDemurrage, defaultSteps, mockDocuments, mockChannels, mockNotifications, mockAppointments, mockCheques, mockQuotes } from "../lib/mockData";

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
  appointments: Appointment[];

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
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "reminderSent">) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  cheques: Cheque[];
  addCheque: (cheque: Omit<Cheque, "id" | "createdAt">) => void;
  updateCheque: (id: string, updates: Partial<Cheque>) => void;
  deleteCheque: (id: string) => void;
  archiveShipment: (id: string) => void;
  archiveCheque: (id: string) => void;
  archiveDocument: (id: string) => void;
  unarchiveShipment: (id: string) => void;
  unarchiveCheque: (id: string, originalStatus?: any) => void;
  unarchiveDocument: (id: string) => void;
  permanentDeleteShipment: (id: string) => void;
  permanentDeleteCheque: (id: string) => void;
  permanentDeleteDocument: (id: string) => void;
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, "id" | "createdAt">) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
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
  appointments: mockAppointments,
  cheques: mockCheques,
  quotes: mockQuotes,

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
  addAppointment: (appointment) => set((state) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `ap${Date.now()}`,
      createdAt: new Date().toISOString(),
      reminderSent: false
    };
    const log: ActivityLog = {
      id: `l${Date.now()}-ap-add`,
      userName: state.currentUser?.name || "System",
      action: "ثبت نوبت جدید",
      entityType: "APPOINTMENT",
      entityId: newAppointment.id,
      details: `نوبت جدید "${appointment.purpose}" برای دپارتمان ${appointment.departmentName} ثبت شد`,
      createdAt: new Date().toISOString()
    };
    return {
      appointments: [newAppointment, ...state.appointments],
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  updateAppointment: (id, updates) => set((state) => {
    const appointment = state.appointments.find(a => a.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-ap-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش نوبت",
      entityType: "APPOINTMENT",
      entityId: id,
      details: `اطلاعات نوبت "${appointment?.purpose}" بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  deleteAppointment: (id) => set((state) => {
    const appointment = state.appointments.find(a => a.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-ap-del`,
      userName: state.currentUser?.name || "System",
      action: "حذف نوبت",
      entityType: "APPOINTMENT",
      entityId: id,
      details: `نوبت "${appointment?.purpose}" از لیست حذف شد`,
      createdAt: new Date().toISOString()
    };
    return {
      appointments: state.appointments.filter(a => a.id !== id),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  addCheque: (cheque) => set((state) => {
    const newCheque: Cheque = {
      ...cheque,
      id: `chq${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const log: ActivityLog = {
      id: `l${Date.now()}-chq-add`,
      userName: state.currentUser?.name || "System",
      action: "ثبت چک جدید",
      entityType: "CHEQUE",
      entityId: newCheque.id,
      details: `چک شماره ${cheque.chequeNumber} (${cheque.bankName}) ثبت شد`,
      createdAt: new Date().toISOString()
    };
    return {
      cheques: [newCheque, ...state.cheques],
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  updateCheque: (id, updates) => set((state) => {
    const cheque = state.cheques.find(c => c.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-chq-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش اطلاعات چک",
      entityType: "CHEQUE",
      entityId: id,
      details: `اطلاعات چک ${cheque?.chequeNumber} بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      cheques: state.cheques.map(c => c.id === id ? { ...c, ...updates } : c),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  deleteCheque: (id) => set((state) => {
    const cheque = state.cheques.find(c => c.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-chq-del`,
      userName: state.currentUser?.name || "System",
      action: "حذف چک",
      entityType: "CHEQUE",
      entityId: id,
      details: `چک شماره ${cheque?.chequeNumber} از سامانه حذف شد`,
      createdAt: new Date().toISOString()
    };
    return {
      cheques: state.cheques.filter(c => c.id !== id),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
  
  archiveShipment: (id) => set((state) => {
    const shipment = state.shipments.find(s => s.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-ship-arc`,
      userName: state.currentUser?.name || "System",
      action: "بایگانی محموله",
      entityType: "SHIPMENT",
      entityId: id,
      details: `محموله ${shipment?.trackingNumber} به بایگانی منتقل شد`,
      createdAt: new Date().toISOString()
    };
    return {
      shipments: state.shipments.map(s => s.id === id ? { ...s, isArchived: true } : s),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  archiveCheque: (id) => set((state) => {
    const cheque = state.cheques.find(c => c.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-chq-arc`,
      userName: state.currentUser?.name || "System",
      action: "بایگانی چک",
      entityType: "CHEQUE",
      entityId: id,
      details: `چک شماره ${cheque?.chequeNumber} به بایگانی منتقل شد`,
      createdAt: new Date().toISOString()
    };
    return {
      cheques: state.cheques.map(c => c.id === id ? { ...c, status: "ARCHIVED" } : c),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  archiveDocument: (id) => set((state) => {
    const doc = state.documents.find(d => d.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-doc-arc`,
      userName: state.currentUser?.name || "System",
      action: "بایگانی سند",
      entityType: "DOCUMENT",
      entityId: id,
      details: `سند ${doc?.name} به بایگانی منتقل شد`,
      createdAt: new Date().toISOString()
    };
    return {
      documents: state.documents.map(d => d.id === id ? { ...d, isArchived: true } : d),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  unarchiveShipment: (id) => set((state) => {
    const shipment = state.shipments.find(s => s.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-ship-unarc`,
      userName: state.currentUser?.name || "System",
      action: "بازگردانی محموله",
      entityType: "SHIPMENT",
      entityId: id,
      details: `محموله ${shipment?.trackingNumber} از بایگانی خارج شد`,
      createdAt: new Date().toISOString()
    };
    return {
      shipments: state.shipments.map(s => s.id === id ? { ...s, isArchived: false } : s),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  unarchiveCheque: (id, originalStatus) => set((state) => {
    const cheque = state.cheques.find(c => c.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-chq-unarc`,
      userName: state.currentUser?.name || "System",
      action: "بازگردانی چک",
      entityType: "CHEQUE",
      entityId: id,
      details: `چک شماره ${cheque?.chequeNumber} از بایگانی خارج شد`,
      createdAt: new Date().toISOString()
    };
    return {
      cheques: state.cheques.map(c => c.id === id ? { ...c, status: originalStatus || "PENDING" } : c),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  unarchiveDocument: (id) => set((state) => {
    const doc = state.documents.find(d => d.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-doc-unarc`,
      userName: state.currentUser?.name || "System",
      action: "بازگردانی سند",
      entityType: "DOCUMENT",
      entityId: id,
      details: `سند ${doc?.name} از بایگانی خارج شد`,
      createdAt: new Date().toISOString()
    };
    return {
      documents: state.documents.map(d => d.id === id ? { ...d, isArchived: false } : d),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  permanentDeleteShipment: (id) => set((state) => ({
    shipments: state.shipments.filter(s => s.id !== id),
    shipmentSteps: state.shipmentSteps.filter(step => step.shipmentId !== id),
    documents: state.documents.filter(doc => doc.shipmentId !== id)
  })),

  permanentDeleteCheque: (id) => set((state) => ({
    cheques: state.cheques.filter(c => c.id !== id)
  })),

  permanentDeleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),

  addQuote: (quote) => set((state) => {
    const newQuote: Quote = {
      ...quote,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const log: ActivityLog = {
      id: `l${Date.now()}-quote-add`,
      userName: state.currentUser?.name || "System",
      action: "ثبت کوتاژ جدید",
      entityType: "QUOTE",
      entityId: newQuote.id,
      details: `استعلام قیمت برای ${quote.customerName} (مسیر: ${quote.originCity} به ${quote.destinationCity}) ثبت شد`,
      createdAt: new Date().toISOString()
    };
    return {
      quotes: [newQuote, ...state.quotes],
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  updateQuote: (id, updates) => set((state) => {
    const quote = state.quotes.find(q => q.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-quote-upd`,
      userName: state.currentUser?.name || "System",
      action: "ویرایش کوتاژ",
      entityType: "QUOTE",
      entityId: id,
      details: `اطلاعات استعلام قیمت ${quote?.id} بروزرسانی شد`,
      createdAt: new Date().toISOString()
    };
    return {
      quotes: state.quotes.map(q => q.id === id ? { ...q, ...updates } : q),
      activityLogs: [log, ...state.activityLogs]
    };
  }),

  deleteQuote: (id) => set((state) => {
    const quote = state.quotes.find(q => q.id === id);
    const log: ActivityLog = {
      id: `l${Date.now()}-quote-del`,
      userName: state.currentUser?.name || "System",
      action: "حذف کوتاژ",
      entityType: "QUOTE",
      entityId: id,
      details: `استعلام قیمت شماره ${quote?.id} از سیستم حذف شد`,
      createdAt: new Date().toISOString()
    };
    return {
      quotes: state.quotes.filter(q => q.id !== id),
      activityLogs: [log, ...state.activityLogs]
    };
  }),
}));
