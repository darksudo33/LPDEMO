import { User, Customer, Shipment, Task, Message, ActivityLog, Demurrage, ShipmentStep, ShipmentDocument, Channel, Notification, Appointment, Cheque } from "../types";
import { addDays, format } from "date-fns-jalali";

export const mockNotifications: Notification[] = [
  { id: "n1", title: "تغییر وضعیت محموله", message: "محموله LS-9801 به مرحله 'در حال حمل' تغییر یافت.", type: "INFO", isRead: false, createdAt: "1403/02/01 10:00", link: "/shipments/s1" },
  { id: "n2", title: "وظیفه جدید", message: "وظیفه جدیدی برای شما توسط علیرضا احمدی تعریف شد.", type: "URGENT", isRead: false, createdAt: "1403/02/01 11:30", link: "/tasks" },
  { id: "n3", title: "سند جدید", message: "سند جدیدی به محموله LS-9803 اضافه شد.", type: "SUCCESS", isRead: true, createdAt: "1403/01/31 09:15", link: "/shipments/s3" },
  { id: "n4", title: "هشدار دمیج", message: "فری‌تایم محموله LS-9802 به اتمام رسیده است.", type: "WARNING", isRead: false, createdAt: "1403/02/01 08:00", link: "/shipments/s2" },
];

export const mockUsers: User[] = [
  { id: "u1", name: "علیرضا احمدی", email: "ahmadi@logisharp.ir", role: "CEO", isOnline: true },
  { id: "u2", name: "سارا رضایی", email: "rezaei@logisharp.ir", role: "MANAGER", isOnline: true },
  { id: "u3", name: "محمد تهرانی", email: "tehrani@logisharp.ir", role: "OPERATIONS", isOnline: false },
  { id: "u4", name: "نازنین حسینی", email: "hosseini@logisharp.ir", role: "FINANCE", isOnline: true },
  { id: "u5", name: "بابک راد", email: "rad@logisharp.ir", role: "CUSTOMER_SERVICE", isOnline: false },
];

export const mockCustomers: Customer[] = [
  { id: "c1", name: "علی کریمی", company: "آرین سیستم", phone: "021-88776655", email: "info@arian.com", address: "تهران، خیابان ولیعصر", shipmentsCount: 12, createdAt: "1402/10/01" },
  { id: "c2", name: "مریم صدری", company: "صادرات پارس", phone: "021-44332211", email: "sales@pars.ir", address: "اصفهان، شهرک صنعتی", shipmentsCount: 5, createdAt: "1402/11/15" },
  { id: "c3", name: "جعفر همتی", company: "فراز لجستیک", phone: "031-11223344", email: "admin@faraz.ir", address: "مشهد، بلوار سجاد", shipmentsCount: 8, createdAt: "1403/01/20" },
  { id: "c4", name: "ندا ناصری", company: "دنیای دیجیتال", phone: "021-99887766", email: "info@digital.ir", address: "تبریز، خیابان آزادی", shipmentsCount: 3, createdAt: "1403/02/10" },
];

export const mockShipments: Shipment[] = [
  { id: "s1", trackingNumber: "LS-9801", containerNumber: "MEDU876251", customerId: "c1", customerName: "آرین سیستم", origin: "شانگهای", destination: "بندرعباس", status: "IN_TRANSIT", createdAt: "1403/01/05", estimatedDelivery: "1403/02/15", freeTimeDays: 14 },
  { id: "s2", trackingNumber: "LS-9802", containerNumber: "MSKU112233", customerId: "c2", customerName: "صادرات پارس", origin: "دبی", destination: "بوشهر", status: "ARRIVED", createdAt: "1403/01/10", estimatedDelivery: "1403/02/05", freeTimeDays: 10 },
  { id: "s3", trackingNumber: "LS-9803", containerNumber: "CMAU445566", customerId: "c3", customerName: "فراز لجستیک", origin: "هامبورگ", destination: "بندر امام", status: "CUSTOMS", createdAt: "1403/01/12", estimatedDelivery: "1403/02/20", freeTimeDays: 20 },
  { id: "s4", trackingNumber: "LS-9804", containerNumber: "COSU778899", customerId: "c1", customerName: "آرین سیستم", origin: "پکن", destination: "تهران (گمرک)", status: "CLEARED", createdAt: "1403/01/20", estimatedDelivery: "1403/02/10", freeTimeDays: 7 },
];

export const defaultSteps = [
  "ثبت اولیه", "رزرو کانتینر", "بارگیری در مبدا", "حرکت کشتی", "در حال حمل دریایی", "تخلیه در بندر مقصد", "ورود به محوطه گمرکی", "ترخیص کالا", "بارگیری برای حمل داخلی", "تحویل نهایی"
];

export const mockTasks: Task[] = [
  { id: "t1", title: "بررسی اسناد گمرکی LS-9803", description: "مدارک ترخیص هنوز تکمیل نشده است. نیاز به اسناد حمل اصلی داریم.", assignedToUserId: "u3", assignedToName: "محمد تهرانی", assignedByName: "علیرضا احمدی", status: "TODO", priority: "HIGH", dueDate: "1403/02/01", shipmentId: "s3", createdAt: "1403/01/25" },
  { id: "t2", title: "هماهنگی با راننده برای LS-9804", description: "کالای ترخیص شده نیاز به ارسال فوری دارد. ۲ دستگاه تریلی لازم است.", assignedToUserId: "u3", assignedToName: "محمد تهرانی", assignedByName: "سارا رضایی", status: "IN_PROGRESS", priority: "URGENT", dueDate: "1403/02/02", shipmentId: "s4", createdAt: "1403/01/26" },
  { id: "t3", title: "تایید فاکتور انبارداری", description: "فاکتورهای مربوط به ماه فروردین بررسی شود. مطابقت با لیست ورود کالا انجام شود.", assignedToUserId: "u4", assignedToName: "نازنین حسینی", assignedByName: "علیرضا احمدی", status: "DONE", priority: "MEDIUM", dueDate: "1403/01/30", createdAt: "1403/01/20" },
  { id: "t4", title: "استعلام نرخ جدید کانتینر", description: "قیمت‌های حمل از تیانجین به بندرعباس برای هفته آینده دریافت شود.", assignedToUserId: "u2", assignedToName: "سارا رضایی", assignedByName: "علیرضا احمدی", status: "TODO", priority: "MEDIUM", dueDate: "1403/02/05", createdAt: "1403/02/01" },
  { id: "t5", title: "بروزرسانی پروفایل مشتری آرین", description: "شماره تماس‌های جدید در سیستم ثبت شود.", assignedToUserId: "u5", assignedToName: "بابک راد", assignedByName: "سارا رضایی", status: "TODO", priority: "LOW", dueDate: "1403/02/10", createdAt: "1403/02/01" },
  { id: "t6", title: "پیگیری بیمه‌نامه LS-9801", description: "بیمه‌نامه الحاقی برای تغییرات اعلامی صادر شود.", assignedToUserId: "u4", assignedToName: "نازنین حسینی", assignedByName: "محمد تهرانی", status: "IN_PROGRESS", priority: "HIGH", dueDate: "1403/02/03", shipmentId: "s1", createdAt: "1403/02/01" },
  { id: "t7", title: "جلسه با ترخیص‌کار (بندرعباس)", description: "بررسی مشکلات اخیر در خروج کالا از درب خروج.", assignedToUserId: "u3", assignedToName: "محمد تهرانی", assignedByName: "علیرضا احمدی", status: "TODO", priority: "HIGH", dueDate: "1403/02/06", createdAt: "1403/02/01" },
  { id: "t8", title: "ارسال یادآوری دمیج به مشتری سدر", description: "دوره فری‌تایم محموله LS-9802 رو به اتمام است.", assignedToUserId: "u5", assignedToName: "بابک راد", assignedByName: "سارا رضایی", status: "DONE", priority: "URGENT", dueDate: "1403/02/01", shipmentId: "s2", createdAt: "1403/01/28" },
  { id: "t9", title: "تهیه گزارش عملکرد ماهانه", description: "گزارش تعداد کانتینرهای حمل شده و ترخیصی در فروردین ماه.", assignedToUserId: "u2", assignedToName: "سارا رضایی", assignedByName: "علیرضا احمدی", status: "IN_PROGRESS", priority: "MEDIUM", dueDate: "1403/02/07", createdAt: "1403/02/01" },
  { id: "t10", title: "بررسی تداخل وزن LS-9803", description: "وزن اعلامی مانیفست با توزین باسکول مغایرت دارد.", assignedToUserId: "u3", assignedToName: "محمد تهرانی", assignedByName: "محمد تهرانی", status: "TODO", priority: "URGENT", dueDate: "1403/02/04", shipmentId: "s3", createdAt: "1403/02/01" },
  { id: "t11", title: "واریز حق‌العمل ترخیص", description: "تسویه حساب نهایی محموله ترخیص شده.", assignedToUserId: "u4", assignedToName: "نازنین حسینی", assignedByName: "سارا رضایی", status: "TODO", priority: "MEDIUM", dueDate: "1403/02/08", createdAt: "1403/02/02" },
  { id: "t12", title: "هماهنگی تست استاندارد", description: "نمونه‌برداری برای آزمایشگاه استاندارد انجام شود.", assignedToUserId: "u3", assignedToName: "محمد تهرانی", assignedByName: "علیرضا احمدی", status: "DONE", priority: "HIGH", dueDate: "1403/01/29", shipmentId: "s3", createdAt: "1403/01/25" },
];

export const mockChannels: Channel[] = [
  { id: "ch-general", name: "گفتگوی عمومی", description: "گفتگوی آزاد برای تمام پرسنل شرکت", icon: "Users" },
  { id: "ch-ops", name: "تیم عملیات", description: "هماهنگی محموله‌ها و ترخیص کاران", roleLimit: "OPERATIONS", icon: "Truck" },
  { id: "ch-finance", name: "امور مالی", description: "هماهنگی فاکتورها و پرداخت‌ها", roleLimit: "FINANCE", icon: "CreditCard" },
  { id: "ch-mgmt", name: "مدیریت ارشد", description: "تصمیم‌گیری‌های کلان و استراتژیک", roleLimit: "CEO", icon: "Shield" },
];

export const mockMessages: Message[] = [
  { id: "m1", senderId: "u1", senderName: "علیرضا احمدی", receiverId: "u2", receiverName: "سارا رضایی", content: "سلام، وضعیت محموله شانگهای چیه؟", read: true, createdAt: "1403/01/28 10:00" },
  { id: "m2", senderId: "u2", senderName: "سارا رضایی", receiverId: "u1", receiverName: "علیرضا احمدی", content: "در حال حاضر در مرحله حمل دریایی هست و مشکلی نداره.", read: true, createdAt: "1403/01/28 10:05" },
  { id: "m-g1", senderId: "u1", senderName: "علیرضا احمدی", groupId: "ch-general", isGroup: true, content: "سلام به همگی، جلسه هفتگی ساعت ۳ برگزار میشه.", read: true, createdAt: "1403/02/01 09:00" },
  { id: "m-g2", senderId: "u3", senderName: "محمد تهرانی", groupId: "ch-ops", isGroup: true, content: "بارنامه LS-9801 تایید شد، آماده ترخیص هستیم.", read: true, createdAt: "1403/02/01 10:30" },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: "l1", userName: "سارا رضایی", action: "تغییر وضعیت", entityType: "Shipment", entityId: "s1", details: "تغییر وضعیت به در حال حمل", createdAt: "1403/01/28 09:30", shipmentId: "s1" },
  { id: "l2", userName: "محمد تهرانی", action: "ایجاد وظیفه", entityType: "Task", entityId: "t2", details: "وظیفه هماهنگی با راننده ایجاد شد", createdAt: "1403/01/28 11:15" },
];

export const mockDemurrage: Demurrage[] = [
  { id: "d1", shipmentId: "s1", freeTimeDays: 14, freeTimeEnd: "1403/02/29", dailyCharge: 500000, totalCharge: 0, status: "ACTIVE" },
  { id: "d2", shipmentId: "s2", freeTimeDays: 10, freeTimeEnd: "1403/02/15", dailyCharge: 800000, totalCharge: 4000000, status: "ACTIVE" },
];

export const mockDocuments: ShipmentDocument[] = [
  { id: "doc1", shipmentId: "s1", name: "پیش‌فاکتور (Proforma Invoice)", type: "INVOICE", fileSize: "1.2 MB", uploadedBy: "سارا رضایی", createdAt: "1403/01/06", url: "#" },
  { id: "doc2", shipmentId: "s1", name: "بارنامه دریایی", type: "BILL_OF_LADING", fileSize: "2.5 MB", uploadedBy: "محمد تهرانی", createdAt: "1403/01/10", url: "#" },
  { id: "doc3", shipmentId: "s2", name: "لیست عدل‌بندی", type: "PACKING_LIST", fileSize: "850 KB", uploadedBy: "سارا رضایی", createdAt: "1403/01/11", url: "#" },
  { id: "doc4", shipmentId: "s3", name: "گواهی مبدا", type: "OTHER", fileSize: "1.1 MB", uploadedBy: "نازنین حسینی", createdAt: "1403/01/13", url: "#" },
  { id: "doc5", name: "قرارداد کلی شرکت - ۱۴۰۳", type: "OTHER", fileSize: "5.4 MB", uploadedBy: "علیرضا احمدی", createdAt: "1403/01/01", url: "#" },
];

export const mockAppointments: Appointment[] = [
  {
    id: "ap1",
    dateTime: "1403/02/15 09:00",
    departmentName: "لجستیک و حمل و نقل",
    purpose: "بررسی قراردادهای جدید حمل دریایی با کشتیرانی دریای خزر",
    requiredDocuments: [
      { id: "ad1", name: "کپی قرارداد سال گذشته", required: true, completed: true },
      { id: "ad2", name: "لیست نرخ‌های پیشنهادی", required: true, completed: false },
      { id: "ad3", name: "معرفی‌نامه نماینده", required: false, completed: true },
    ],
    assignedPersonId: "u2",
    assignedPersonName: "سارا رضایی",
    status: "SCHEDULED",
    reminderSent: false,
    createdAt: "1403/02/01"
  },
  {
    id: "ap2",
    dateTime: "1403/02/20 11:30",
    departmentName: "گمرک و مالیات",
    purpose: "رسیدگی به پرونده تداخل وزن محموله LS-9803",
    requiredDocuments: [
      { id: "ad4", name: "بارنامه اصلی", required: true, completed: true },
      { id: "ad5", name: "فیش واریزی کارورزی", required: true, completed: true },
    ],
    assignedPersonId: "u3",
    assignedPersonName: "محمد تهرانی",
    status: "IN_PROGRESS",
    reminderSent: false,
    createdAt: "1403/02/02"
  }
];

export const mockCheques: Cheque[] = [
  {
    id: "chq1",
    bankName: "بانک ملت",
    chequeNumber: "12345/6789",
    amount: 150000000,
    dueDate: "1403/03/15",
    location: "شرکت هوپاد",
    receiver: "شرکت بازرگانی آریا",
    status: "ACTIVE",
    description: "بابت تسویه فاکتور شماره ۹۸۰",
    createdAt: "1403/01/10"
  },
  {
    id: "chq2",
    bankName: "بانک صادرات",
    chequeNumber: "98765/4321",
    amount: 75000000,
    dueDate: "1403/02/25",
    location: "اسپاد",
    receiver: "سازمان بنادر",
    status: "ACTIVE",
    description: "ضمانت ترخیص محموله LS-9802",
    createdAt: "1403/01/15"
  },
  {
    id: "chq3",
    bankName: "بانک ملی",
    chequeNumber: "11122/3344",
    amount: 320000000,
    dueDate: "1403/01/20",
    location: "بایگانی",
    receiver: "کشتیرانی جمهوری اسلامی",
    status: "CLEARED",
    description: "تسویه قرارداد حمل زمینی",
    createdAt: "1402/12/20"
  }
];
