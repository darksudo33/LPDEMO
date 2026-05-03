/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Clock, 
  FileCheck, 
  Plus, 
  Search, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  FileText, 
  CheckSquare, 
  Square,
  Timer,
  Bell,
  ArrowLeft,
  ShieldCheck,
  Users
} from "lucide-react";
import { 
  format, 
  parse, 
  differenceInSeconds, 
  isSameDay,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getDay,
  addMonths,
  subMonths
} from "date-fns-jalali";
import { useMockStore } from "@/src/store/useMockStore";
import { Appointment, AppointmentStatus, AppointmentDocument } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Components ---

const AppointmentTimer = ({ targetDate }: { targetDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft("--:--:--");
      return;
    }
    const timer = setInterval(() => {
      try {
        const target = parse(targetDate, "yyyy/MM/dd HH:mm", new Date());
        const now = new Date();
        const diff = differenceInSeconds(target, now);
        
        if (diff <= 0) {
          setTimeLeft("برگزار شده");
          clearInterval(timer);
        } else {
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          setTimeLeft(`${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
        }
      } catch (e) {
        setTimeLeft("--:--:--");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-[#38bdf8]">
      <Timer className="w-4 h-4" />
      <span>{timeLeft}</span>
    </div>
  );
};

export default function Compliance() {
  const appointments = useMockStore(state => state.appointments);
  const addAppointment = useMockStore(state => state.addAppointment);
  const updateAppointment = useMockStore(state => state.updateAppointment);
  const deleteAppointment = useMockStore(state => state.deleteAppointment);
  const addTask = useMockStore(state => state.addTask);
  const addNotification = useMockStore(state => state.addNotification);
  const currentUser = useMockStore(state => state.currentUser);
  const users = useMockStore(state => state.users);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Deriving selected appointment from store to keep it reactive
  const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId) || null;

  // View state
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Form states
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy/MM/dd"),
    hour: "09",
    minute: "00",
    departmentName: "",
    customDepartment: "",
    purpose: "",
    assignedPersonId: "",
  });

  const [documentChecklist, setDocumentChecklist] = useState<AppointmentDocument[]>([
    { id: "d1", name: "بارنامه اصلی", required: true, completed: false },
    { id: "d2", name: "فاکتور تجاری", required: true, completed: false },
    { id: "d3", name: "گواهی مبدا", required: false, completed: false },
  ]);

  const filteredAppointments = appointments.filter(a => 
    (a.departmentName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (a.purpose?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingAppointment(null);
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (app: Appointment) => {
    setEditingAppointment(app);
    const [datePart, timePart] = app.dateTime.split(" ");
    const [hour, minute] = timePart.split(":");
    
    setFormData({
      date: datePart,
      hour,
      minute,
      departmentName: departments.some(d => d.value === app.departmentName) ? app.departmentName : "CUSTOM",
      customDepartment: departments.some(d => d.value === app.departmentName) ? "" : app.departmentName,
      purpose: app.purpose,
      assignedPersonId: app.assignedPersonId,
    });
    setDocumentChecklist(app.requiredDocuments);
    setIsAddOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!formData.date || !formData.purpose) {
      toast.error("لطفا فیلدهای ضروری را پر کنید.");
      return;
    }

    const assignedUser = users.find(u => u.id === formData.assignedPersonId);
    const fullDateTime = `${formData.date} ${formData.hour}:${formData.minute}`;
    
    const appData = {
      dateTime: fullDateTime,
      departmentName: formData.departmentName === "CUSTOM" ? formData.customDepartment : formData.departmentName,
      purpose: formData.purpose,
      assignedPersonId: formData.assignedPersonId,
      assignedPersonName: assignedUser?.name || "نامشخص",
      status: editingAppointment?.status || "SCHEDULED",
      requiredDocuments: documentChecklist,
    };

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appData);
      toast.success("نوبت با موفقیت بروزرسانی شد.");
    } else {
      addAppointment(appData);
      
      // Auto-add Task for the assigned employee
      addTask({
        title: `جلسه: ${formData.purpose}`,
        description: `مراجعه حضوری در دپارتمان ${appData.departmentName}. مستندات مورد نیاز: ${appData.requiredDocuments.map(d => d.name).join('، ')}`,
        assignedToUserId: formData.assignedPersonId,
        assignedToName: appData.assignedPersonName,
        assignedByName: currentUser?.name || "سیستم",
        status: "TODO",
        priority: "HIGH",
        dueDate: formData.date,
        deadline: `${formData.hour}:${formData.minute}`
      });

      // Send Notification to alert the employee
      addNotification({
        title: "نوبت مراجعه جدید",
        message: `یک نوبت مراجعه حضوری برای شما در تاریخ ${formData.date} ثبت شد: ${formData.purpose}`,
        type: "INFO",
        link: "/compliance"
      });

      toast.success("نوبت با موفقیت ثبت شد و وظیفه مربوطه ایجاد گردید.");
    }

    setIsAddOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), "yyyy/MM/dd"),
      hour: "09",
      minute: "00",
      departmentName: "",
      customDepartment: "",
      purpose: "",
      assignedPersonId: "",
    });
    setDocumentChecklist([
      { id: "d1", name: "بارنامه اصلی", required: true, completed: false },
      { id: "d2", name: "فاکتور تجاری", required: true, completed: false },
      { id: "d3", name: "گواهی مبدا", required: false, completed: false },
    ]);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingDocId, setUploadingDocId] = useState<{appId: string, docId: string} | null>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingDocId) {
      const appointment = appointments.find(a => a.id === uploadingDocId.appId);
      if (!appointment) return;

      const newDocs = appointment.requiredDocuments.map(d => 
        d.id === uploadingDocId.docId ? { ...d, completed: true, fileName: file.name } : d
      );
      
      updateAppointment(uploadingDocId.appId, { requiredDocuments: newDocs });
      toast.success(`فایل "${file.name}" با موفقیت بارگذاری شد.`);
      setUploadingDocId(null);
    }
  };

  const triggerUpload = (appId: string, docId: string) => {
    setUploadingDocId({ appId, docId });
    fileInputRef.current?.click();
  };

  const toggleDocument = (appId: string, docId: string) => {
    const appointment = appointments.find(a => a.id === appId);
    if (!appointment) return;

    const newDocs = appointment.requiredDocuments.map(d => 
      d.id === docId ? { ...d, completed: !d.completed } : d
    );
    
    updateAppointment(appId, { requiredDocuments: newDocs });
  };

  const updateOutcome = (appId: string, outcome: string) => {
    updateAppointment(appId, { outcome });
  };

  const departments = [
    { value: "لجستیک و حمل و نقل", label: "دپارتمان لجستیک" },
    { value: "گمرک و ترخیص", label: "دپارتمان گمرک" },
    { value: "امور مالیاتی", label: "امور مالیاتی" },
    { value: "بیمه", label: "بیمه" },
    { value: "CUSTOM", label: "دپارتمان سفارشی..." },
  ];

  // Real Jalali Month Grid
  const renderCalendar = () => {
    const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
    
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const daysInMonth = getDaysInMonth(viewDate);
    
    // Sat=6, Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
    // Adjusted: Sat=0, Sun=1, ..., Fri=6
    const startDay = (getDay(monthStart) + 1) % 7; 

    return (
      <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setViewDate(subMonths(viewDate, 1))}>
             <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold text-[#38bdf8]">{format(viewDate, "MMMM yyyy")}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setViewDate(addMonths(viewDate, 1))}>
             <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map(d => <div key={d} className="text-[10px] font-black text-slate-600 pb-2">{d}</div>)}
          
          {/* Empty cells for start padding */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentDate = new Date(monthStart);
            currentDate.setDate(monthStart.getDate() + i);
            const dateStr = format(currentDate, "yyyy/MM/dd");
            const isTodayString = format(new Date(), "yyyy/MM/dd") === dateStr;
            const hasApp = appointments.some(a => a.dateTime.startsWith(dateStr));
            
            return (
              <div 
                key={day} 
                className={cn(
                  "h-8 flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all relative cursor-pointer",
                  isTodayString ? "bg-[#38bdf8] text-slate-950 scale-105 shadow-lg shadow-[#38bdf8]/20" : "text-slate-400 hover:bg-slate-800",
                  hasApp && !isTodayString && "after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-[#38bdf8] after:rounded-full"
                )}
                onClick={() => setFormData(prev => ({ ...prev, date: dateStr }))}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100 font-sans" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[#38bdf8]" />
            مدیریت مراجعات حضوری
          </h1>
          <p className="text-slate-400 text-sm mt-1">پایگاه داده ثبت نوبت‌های ملاقات و مستندات قانونی</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button onClick={handleOpenAdd} className="bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-bold rounded-xl gap-2 h-11 px-6 shadow-lg shadow-[#38bdf8]/20 transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                ثبت نوبت جدید
              </Button>
            }
          />
          <DialogContent className="bg-slate-900 border-slate-800 text-white w-[95vw] sm:max-w-2xl font-sans rounded-2xl sm:rounded-3xl p-3 sm:p-8 overflow-y-auto max-h-[92vh] scroll-smooth" dir="rtl">
            <DialogHeader className="sm:mb-4">
              <DialogTitle className="text-base sm:text-xl font-black flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-[#38bdf8]/10 rounded-xl sm:rounded-2xl shrink-0">
                  {editingAppointment ? <Edit3 className="w-4 h-4 sm:w-6 sm:h-6 text-[#38bdf8]" /> : <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-[#38bdf8]" />}
                </div>
                <div className="flex flex-col">
                  <span>{editingAppointment ? "ویرایش نوبت" : "فرم رزرو نوبت مراجعات"}</span>
                  <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Compliance & Meeting Protocol</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 py-2 sm:py-6 text-right">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">تاریخ (روز/ماه/سال)</Label>
                <div className="flex gap-2 items-center bg-slate-800/50 rounded-xl sm:rounded-2xl px-3 h-11 sm:h-12 border border-slate-700/50 focus-within:border-[#38bdf8]/50 transition-all shadow-inner">
                   <Calendar className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                   <Input 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-transparent border-none p-0 h-full text-center font-mono text-xs sm:text-sm shadow-none focus-visible:ring-0" 
                    placeholder="۱۴۰۳/۰۲/۱۵"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">ساعت جلسه</Label>
                <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                   <Select value={formData.hour} onValueChange={(v) => setFormData({...formData, hour: v})}>
                    <SelectTrigger className="bg-slate-800/50 border-none h-11 sm:h-12 rounded-xl sm:rounded-2xl shadow-inner font-mono text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[180px]">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : `${i}`}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                   <span className="flex items-center text-slate-600 font-bold">:</span>
                   <Select value={formData.minute} onValueChange={(v) => setFormData({...formData, minute: v})}>
                    <SelectTrigger className="bg-slate-800/50 border-none h-11 sm:h-12 rounded-xl sm:rounded-2xl shadow-inner font-mono text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      {["00", "15", "30", "45"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                   </Select>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">دپارتمان مسئول</Label>
                <Select value={formData.departmentName} onValueChange={(val) => setFormData({...formData, departmentName: val})}>
                  <SelectTrigger className="bg-slate-800/50 border-none h-11 sm:h-12 rounded-xl sm:rounded-2xl shadow-inner text-right text-xs sm:text-sm">
                    <SelectValue placeholder="انتخاب دپارتمان" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white text-right">
                    {departments.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.departmentName === "CUSTOM" && (
                  <Input 
                    placeholder="نام دپارتمان سفارشی" 
                    className="mt-2 bg-slate-800/50 border-none h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-inner text-xs px-4" 
                    value={formData.customDepartment}
                    onChange={(e) => setFormData({...formData, customDepartment: e.target.value})}
                  />
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">مخاطب (تایید کننده)</Label>
                <Select value={formData.assignedPersonId} onValueChange={(val) => setFormData({...formData, assignedPersonId: val})}>
                  <SelectTrigger className="bg-slate-800/50 border-none h-11 sm:h-12 rounded-xl sm:rounded-2xl shadow-inner text-right text-xs sm:text-sm">
                    <SelectValue placeholder="انتخاب مسئول" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white text-right">
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">هدف از مراجعه (شرح مختصر)</Label>
                <Input 
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="bg-slate-800/50 border-none h-12 sm:h-14 rounded-xl sm:rounded-2xl shadow-inner text-[11px] sm:text-sm px-4" 
                  placeholder="مثلا: پیگیری ترخیص محموله LS-9801"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label className="text-[10px] font-black text-[#38bdf8] uppercase tracking-widest mr-1 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                پروتکل مستندات همراه
              </Label>
              <div className="bg-slate-800/30 p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] space-y-2.5 sm:space-y-3 border border-slate-800/50">
                {documentChecklist.map((doc, idx) => (
                  <div key={doc.id} className="flex items-center gap-2 sm:gap-4 group/doc">
                    <Checkbox id={`check-${doc.id}`} checked={doc.required} onCheckedChange={(checked) => {
                       const newDocs = [...documentChecklist];
                       newDocs[idx].required = !!checked;
                       setDocumentChecklist(newDocs);
                    }} className="data-[state=checked]:bg-[#38bdf8] border-slate-700 h-4.5 w-4.5 rounded-md" />
                    <Input 
                      value={doc.name} 
                      onChange={(e) => {
                        const newDocs = [...documentChecklist];
                        newDocs[idx].name = e.target.value;
                        setDocumentChecklist(newDocs);
                      }}
                      className="h-8 sm:h-10 bg-slate-900/50 border-none text-[10px] sm:text-xs text-slate-100 px-3 rounded-lg sm:rounded-xl shadow-sm focus:bg-slate-900 transition-all flex-1"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700 hover:text-rose-500" onClick={() => setDocumentChecklist(documentChecklist.filter((_, i) => i !== idx))}>
                       <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[9px] sm:text-[10px] font-black text-slate-600 p-0 hover:bg-transparent h-6 hover:text-[#38bdf8] transition-colors"
                  onClick={() => setDocumentChecklist([...documentChecklist, { id: `d${Date.now()}`, name: "عنوان مدرک جدید", required: false, completed: false }])}
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1.5" />
                  افزودن پارامتر کنترلی
                </Button>
              </div>
            </div>

            <DialogFooter className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button onClick={handleSaveAppointment} className="w-full sm:flex-[2] bg-[#38bdf8] text-slate-950 font-black hover:bg-[#38bdf8]/90 h-12 sm:h-14 rounded-xl sm:rounded-2xl shadow-xl shadow-[#38bdf8]/10 text-xs sm:text-sm order-1 sm:order-2">
                {editingAppointment ? "بروزرسانی نوبت" : "تایید و ثبت نوبت در سیستم"}
              </Button>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="w-full sm:flex-1 text-slate-500 h-12 sm:h-14 font-black text-xs sm:text-sm order-2 sm:order-1 transition-all hover:bg-slate-800/50">لغو</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Calendar & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {renderCalendar()}
          
          <Card className="bg-slate-900/50 border-slate-800 rounded-3xl overflow-hidden">
             <CardHeader className="p-5 pb-0">
               <CardTitle className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">آمار انطباق تیم</CardTitle>
             </CardHeader>
             <CardContent className="p-5 pt-0 space-y-6">
                {[
                  { label: "نرخ تکمیل مدارک", val: 82, color: "bg-[#38bdf8]" },
                  { label: "جلسات با خروجی مثبت", val: 68, color: "bg-emerald-500" },
                  { label: "انحراف از ددلاین", val: 12, color: "bg-rose-500" },
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-slate-400">{s.label}</span>
                       <span className="text-white">{s.val}%</span>
                    </div>
                    <Progress value={s.val} className={cn("h-1 bg-slate-800", `[&>div]:${s.color}`)} />
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>

        {/* Center: Appointment List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-800 border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/40 p-8">
              <div>
                <CardTitle className="text-xl font-black">مانیتورینگ نوبت‌ها</CardTitle>
                <CardDescription className="text-[10px] font-bold">پایش جلسات برنامه‌ریزی شده در دپارتمان‌های مختلف</CardDescription>
              </div>
              <div className="relative w-full max-w-[240px] group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
                <Input 
                  placeholder="جستجو در فعالیت‌ها..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/50 border-none pr-11 h-11 text-[11px] rounded-2xl shadow-inner border-transparent focus:ring-1 focus:ring-[#38bdf8]/30" 
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[650px] custom-scrollbar">
                <div className="divide-y divide-slate-800/30">
                  {filteredAppointments.length === 0 ? (
                    <div className="p-24 text-center">
                      <Calendar className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                      <p className="text-sm text-slate-700 font-bold">فعالیتی برای نمایش در این بازه زمانی وجود ندارد.</p>
                    </div>
                  ) : (
                    filteredAppointments.map((app) => (
                      <div 
                        key={app.id} 
                        className={cn(
                          "p-8 hover:bg-slate-800/30 transition-all cursor-pointer group relative",
                          selectedAppointmentId === app.id && "bg-[#38bdf8]/5 shadow-[inset_4px_0_0_#38bdf8]"
                        )}
                        onClick={() => setSelectedAppointmentId(app.id)}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-[#38bdf8]/10 flex flex-col items-center justify-center text-[#38bdf8] font-black border border-[#38bdf8]/20 group-hover:scale-105 transition-transform">
                              <span className="text-[9px] leading-none mb-1 opacity-50">اردیبهشت</span>
                              <span className="text-xl leading-none">{app.dateTime?.split('/')?.[2]?.split?.(' ')?.[0] || "--"}</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-slate-100 group-hover:text-[#38bdf8] transition-colors mb-1">{app.purpose}</h3>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-slate-800/50 text-slate-400 border-none text-[9px] py-0.5 font-bold">
                                  {app.departmentName}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold">
                                   <Clock className="w-3 h-3" />
                                   {app.dateTime?.split?.(' ')?.[1] || "--:--"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <Badge className={cn(
                               "text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-tight",
                               app.status === "SCHEDULED" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                               app.status === "IN_PROGRESS" && "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
                               app.status === "COMPLETED" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                             )}>
                               {app.status === "SCHEDULED" && "آتی"}
                               {app.status === "IN_PROGRESS" && "درحال اجرا"}
                               {app.status === "COMPLETED" && "تکمیل"}
                             </Badge>
                             <AppointmentTimer targetDate={app.dateTime} />
                          </div>
                        </div>
  
                        <div className="flex items-center justify-between text-[10px]">
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-slate-400 font-bold">
                                <User className="w-4 h-4 text-[#38bdf8]/40" />
                                <span>{app.assignedPersonName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 font-bold">
                                <FileCheck className="w-4 h-4 text-emerald-500/40" />
                                <span>{app.requiredDocuments.filter(d => d.completed).length}/{app.requiredDocuments.length} مدارک تایید شده</span>
                              </div>
                           </div>
                           <div className="flex gap-2 opacity-100 transition-all translate-x-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-[#38bdf8]/10 hover:text-[#38bdf8]" onClick={(e) => { e.stopPropagation(); handleOpenEdit(app); }}>
                                 <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={(e) => { e.stopPropagation(); deleteAppointment(app.id); toast.error("حذف نوبت قطعی شد."); }}>
                                 <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedAppointment ? (
              <motion.div
                key={selectedAppointment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 lg:sticky lg:top-6"
              >
                <Card className="bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden rounded-[2.5rem]">
                   <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#38bdf8] shadow-[0_2px_10px_rgba(56,189,248,0.2)]" />
                   <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                     <div>
                       <CardTitle className="text-lg font-black text-white">جزئیات عملیاتی</CardTitle>
                       <p className="text-[10px] text-slate-500 font-bold mt-1">Audit & Review Panel</p>
                     </div>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:bg-slate-800 rounded-2xl" onClick={() => setSelectedAppointmentId(null)}>
                       <ArrowLeft className="w-5 h-5 rotate-180" />
                     </Button>
                   </CardHeader>
                   <CardContent className="p-8 pt-4 space-y-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mr-1">وضعیت مستندات جلسه</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleDocumentUpload}
                    />
                    <div className="space-y-3 bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                      {selectedAppointment.requiredDocuments.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between group/item py-2"
                        >
                           <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleDocument(selectedAppointment.id, doc.id)}>
                              <div className={cn(
                                 "w-5 h-5 rounded-lg flex items-center justify-center transition-all border",
                                 doc.completed ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "border-slate-700 bg-slate-900 group-hover/item:border-[#38bdf8]/40"
                              )}>
                                {doc.completed && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                              </div>
                              <div className="flex flex-col">
                                <span className={cn(
                                  "text-xs font-bold transition-all",
                                  doc.completed ? "text-slate-500 line-through opacity-50" : "text-slate-100"
                                )}>{doc.name}</span>
                                {doc.completed && doc.fileName && (
                                  <span className="text-[9px] text-[#38bdf8] font-mono mt-0.5">{doc.fileName}</span>
                                )}
                              </div>
                           </div>
                           
                           {!doc.completed ? (
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-slate-500 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 rounded-lg"
                               onClick={(e) => { e.stopPropagation(); triggerUpload(selectedAppointment.id, doc.id); }}
                             >
                               <Plus className="w-4 h-4" />
                             </Button>
                           ) : (
                             <div className="flex items-center gap-2">
                               <FileCheck className="w-4 h-4 text-emerald-500/50" />
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                         <div className="px-2 space-y-2">
                           <div className="flex justify-between text-[9px] font-black text-[#38bdf8]">
                              <span>میزان پیشرفت مستندات</span>
                              <span>{Math.round((selectedAppointment.requiredDocuments.filter(d => d.completed).length / selectedAppointment.requiredDocuments.length) * 100)}%</span>
                           </div>
                           <Progress 
                            value={(selectedAppointment.requiredDocuments.filter(d => d.completed).length / selectedAppointment.requiredDocuments.length) * 100} 
                            className="h-1.5 bg-slate-800 [&>div]:bg-[#38bdf8] shadow-sm"
                           />
                         </div>
                      </div>
  
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mr-1">گزارش و خروجی جلسه</label>
                         <textarea 
                          className="w-full h-32 bg-slate-900 border border-slate-700/60 rounded-[1.5rem] p-5 text-[11px] text-slate-200 focus:ring-2 focus:ring-[#38bdf8]/20 transition-all resize-none outline-none shadow-inner leading-relaxed"
                          placeholder="ثبت وقایع، توافقات و نتایج نهایی جلسات..."
                          value={selectedAppointment.outcome || ""}
                          onChange={(e) => updateOutcome(selectedAppointment.id, e.target.value)}
                         />
                      </div>
  
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mr-1 flex items-center gap-2">
                            <CheckSquare className="w-3 h-3" />
                            لیست اقدامات آتی (Next Steps)
                         </label>
                         <textarea 
                          className="w-full h-24 bg-slate-900 border border-slate-700/60 rounded-[1.5rem] p-5 text-[11px] text-slate-200 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none outline-none shadow-inner leading-relaxed"
                          placeholder="وظایف محول شده و پیگیری‌های بعدی..."
                          value={selectedAppointment.nextActionItems || ""}
                          onChange={(e) => updateAppointment(selectedAppointment.id, { nextActionItems: e.target.value })}
                         />
                      </div>
  
                      <div className="pt-2 flex flex-col gap-3">
                         <Button 
                          className={cn(
                            "w-full font-black h-14 rounded-2xl transition-all relative overflow-hidden group/btn",
                            selectedAppointment.status === "COMPLETED" ? "bg-slate-800 text-slate-400 cursor-default" : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-600/10"
                          )}
                          onClick={() => {
                            if (selectedAppointment.status === "COMPLETED") return;
                            updateAppointment(selectedAppointment.id, { status: "COMPLETED" });
                            toast.success("جلسه با موفقیت بایگانی شد.");
                          }}
                         >
                           {selectedAppointment.status === "COMPLETED" ? (
                             <span className="flex items-center gap-2 justify-center">
                               <ShieldCheck className="w-5 h-5" />
                               پایان یافته و ممیزی شده
                             </span>
                           ) : (
                             <span className="flex items-center gap-2 justify-center">
                               تکمیل و بستن نوبت
                             </span>
                           )}
                         </Button>
                      </div>
                   </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 bg-slate-900/20 border-2 border-dashed border-slate-800/50 rounded-[3rem] p-12 text-center opacity-40">
                 <div className="p-8 bg-slate-900 rounded-full border border-slate-800">
                    <FileText className="w-12 h-12 text-slate-700" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-500 mb-2">انتخاب برای مشاهده جزئیات</h4>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
                       جهت مدیریت چک‌لیست‌ها، ثبت خروجی جلسات و تعیین اقدامات آتی، یکی از نوبت‌ها را از لیست میانی انتخاب کنید.
                    </p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
