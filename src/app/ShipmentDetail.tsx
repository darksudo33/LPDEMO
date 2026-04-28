import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Ship, 
  MapPin, 
  Calendar, 
  Truck, 
  UserPlus, 
  Users,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Info,
  Package,
  Anchor,
  FileText,
  Download,
  Trash2,
  FileIcon,
  Plus,
  Search,
  FilePlus,
  FileCheck,
  ExternalLink,
  ChevronLeft,
  Edit,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ShipmentStatus, StepStatus, TaskStatus, DocumentType } from "../types";

const DocumentView = ({ shipmentId }: { shipmentId: string }) => {
  const documents = useMockStore(state => state.documents);
  const addDocument = useMockStore(state => state.addDocument);
  const deleteDocument = useMockStore(state => state.deleteDocument);
  const currentUser = useMockStore(state => state.currentUser);
  
  const shipmentDocs = React.useMemo(() => 
    documents.filter(d => d.shipmentId === shipmentId),
    [documents, shipmentId]
  );
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDoc, setNewDoc] = useState({
    name: "",
    type: "OTHER" as DocumentType,
  });

  const filteredDocs = shipmentDocs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoc = () => {
    if (!newDoc.name) return;
    addDocument({
      name: newDoc.name,
      type: newDoc.type,
      shipmentId,
      fileSize: "0.5 MB",
      uploadedBy: currentUser?.name || "کاربر سیستمی",
      url: "#"
    });
    setIsAddDocOpen(false);
    setNewDoc({ name: "", type: "OTHER" });
  };

  const getDocTypeInfo = (type: string) => {
    const info: Record<string, { label: string; color: string; icon: any }> = {
      BILL_OF_LADING: { label: "بارنامه", color: "text-blue-400", icon: FileText },
      INVOICE: { label: "فاکتور", color: "text-emerald-400", icon: FileCheck },
      PACKING_LIST: { label: "لیست عدل‌بندی", color: "text-amber-400", icon: Package },
      CUSTOMS_PERMIT: { label: "پروانه گمرکی", color: "text-purple-400", icon: Info },
      INSURANCE: { label: "بیمه‌نامه", color: "text-rose-400", icon: CheckCircle2 },
      OTHER: { label: "سایر", color: "text-slate-400", icon: FileIcon }
    };
    return info[type] || info.OTHER;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200">مدیریت مستندات</h3>
            <p className="text-[10px] text-slate-500 font-medium">مجموع مقالات: {shipmentDocs.length} فایل</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <Input 
              placeholder="جستجو در اسناد..." 
              className="bg-[#1e293b]/50 border-[#334155] pr-9 h-9 text-[11px] w-48 rounded-lg outline-none focus:ring-1 focus:ring-[#38bdf8]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
            <DialogTrigger
              render={
                <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] text-[11px] font-bold gap-2 h-9 rounded-lg px-4">
                  <FilePlus className="w-3.5 h-3.5" />
                  بارگذاری مدرک
                </Button>
              }
            />
            <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">بارگذاری سند جدید</DialogTitle>
                <DialogDescription className="text-xs text-slate-400">فایل‌های معتبر: PDF, JPG, PNG (حداکثر ۱۰ مگابایت)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-[#1e293b]/50 border-2 border-dashed border-[#334155] rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#38bdf8]/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center text-slate-500 mb-3 group-hover:text-[#38bdf8] transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">انتخاب فایل از سیستم</p>
                  <p className="text-[10px] text-slate-500 mt-1">یا فایل را به اینجا بکشید</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-400 pr-1">عنوان سند</Label>
                    <Input 
                      placeholder="مثال: بارنامه اصلی"
                      className="bg-[#1e293b] border-[#334155] h-10 text-xs focus:ring-[#38bdf8]" 
                      value={newDoc.name}
                      onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-400 pr-1">نوع طبقه‌بندی</Label>
                    <select 
                      className="w-full bg-[#1e293b] border-[#334155] rounded-lg h-10 text-xs px-3 outline-none focus:ring-1 focus:ring-[#38bdf8]"
                      value={newDoc.type}
                      onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                    >
                      <option value="BILL_OF_LADING">بارنامه دریایی / هوایی</option>
                      <option value="INVOICE">فاکتور تجاری (Invoice)</option>
                      <option value="PACKING_LIST">لیست عدل‌بندی (Packing List)</option>
                      <option value="CUSTOMS_PERMIT">پروانه سبز گمرکی</option>
                      <option value="INSURANCE">بیمه‌نامه محموله</option>
                      <option value="OTHER">سایر ضمائم</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" className="flex-1 border-[#334155] hover:bg-[#1e293b] text-xs h-11" onClick={() => setIsAddDocOpen(false)}>انصراف</Button>
                <Button className="flex-1 bg-[#38bdf8] text-[#020617] font-extrabold text-xs h-11" onClick={handleAddDoc}>تایید و نهایی‌سازی</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          const typeInfo = getDocTypeInfo(doc.type);
          const Icon = typeInfo.icon;
          return (
            <div key={doc.id} className="bg-[#1e293b]/20 p-4 rounded-2xl border border-[#334155]/20 hover:border-[#38bdf8]/40 hover:bg-[#1e293b]/40 transition-all group relative">
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className={cn("w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center", typeInfo.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white rounded-lg">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 rounded-lg" onClick={() => deleteDocument(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-100 group-hover:text-[#38bdf8] transition-colors line-clamp-1">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("bg-transparent border-none p-0 text-[10px] font-bold", typeInfo.color)}>
                      {typeInfo.label}
                    </Badge>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] text-slate-500 font-medium">{doc.fileSize}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#334155]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                      <Plus className="w-2 h-2 text-slate-500" />
                    </div>
                    <span className="text-[9px] text-slate-500 truncate">توسط: {doc.uploadedBy}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">{doc.createdAt}</span>
                </div>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-600 hover:text-[#38bdf8]">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#0f172a]/30 border-2 border-dashed border-[#1e293b] rounded-3xl group cursor-pointer hover:border-[#38bdf8]/30 transition-all">
            <div className="w-20 h-20 rounded-full bg-[#1e293b]/50 flex items-center justify-center text-slate-700 mb-4 group-hover:scale-110 transition-transform">
              <FilePlus className="w-10 h-10" />
            </div>
            <h4 className="text-sm font-bold text-slate-400">هنوز سندی بارگذاری نشده است</h4>
            <p className="text-[11px] text-slate-600 mt-1">برای شروع، اولین مدرک را بارگذاری کنید</p>
            <Button 
              variant="outline" 
              className="mt-6 border-[#1e293b] text-[#38bdf8] text-xs h-9 px-6 rounded-xl hover:bg-[#38bdf8] hover:text-[#020617] font-bold"
              onClick={() => setIsAddDocOpen(true)}
            >
              افزودن مدرک
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    IN_TRANSIT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ARRIVED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    CUSTOMS: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    CLEARED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PENDING: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    BOOKED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    CLOSED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  const labels: Record<string, string> = {
    IN_TRANSIT: "درحال حمل",
    ARRIVED: "رسیده به بندر",
    CUSTOMS: "در انتظار گمرک",
    CLEARED: "ترخیص شده",
    DELIVERED: "تحویل نهایی",
    PENDING: "در انتظار ثبت",
    BOOKED: "رزرو شده",
    CLOSED: "بسته شده",
  };
  return <Badge variant="outline" className={cn(styles[status] || "", "py-0.5 px-2 text-[10px] font-bold")}>{labels[status] || status}</Badge>;
};

export default function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shipments = useMockStore(state => state.shipments);
  const shipmentSteps = useMockStore(state => state.shipmentSteps);
  const tasks = useMockStore(state => state.tasks);
  const users = useMockStore(state => state.users);
  const addTask = useMockStore(state => state.addTask);
  const updateShipmentStep = useMockStore(state => state.updateShipmentStep);
  const documents = useMockStore(state => state.documents);
  const customers = useMockStore(state => state.customers);
  
  const shipment = React.useMemo(() => shipments.find(s => s.id === id), [shipments, id]);
  const steps = React.useMemo(() => 
    shipmentSteps.filter(s => s.shipmentId === id).sort((a, b) => a.order - b.order),
    [shipmentSteps, id]
  );
  const shipmentTasks = React.useMemo(() => 
    tasks.filter(t => t.shipmentId === id),
    [tasks, id]
  );

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [assignForm, setAssignForm] = useState({
    userId: users[0]?.id || "",
    priority: "MEDIUM" as const,
    dueDate: "۱۴۰۳/۰۵/۰۱",
    description: ""
  });

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-slate-500 font-sans">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <h2 className="text-xl font-bold">محموله مورد نظر یافت نشد.</h2>
        <Button variant="link" onClick={() => navigate("/shipments")} className="text-[#38bdf8] mt-2">
          بازگشت به لیست محموله‌ها
        </Button>
      </div>
    );
  }

  const completedSteps = steps.filter(s => s.status === "COMPLETED").length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  const EMPLOYEE_MANAGED_STEPS = ["ثبت اولیه", "رزرو کانتینر", "بارگیری در مبدا", "ورود به محوطه گمرکی", "ترخیص کالا", "بارگیری برای حمل داخلی", "تحویل نهایی"];

  const handleAssignTask = () => {
    const user = users.find(u => u.id === assignForm.userId);
    addTask({
      title: `پیگیری مرحله: ${selectedStep.name} - ${shipment.trackingNumber}`,
      description: assignForm.description || `انجام امور مربوط به ${selectedStep.name} برای محموله ${shipment.trackingNumber}`,
      assignedToUserId: assignForm.userId,
      assignedToName: user?.name || "",
      assignedByName: "مدیر سیستم",
      status: "TODO",
      priority: assignForm.priority,
      dueDate: assignForm.dueDate,
      shipmentId: shipment.id
    });
    
    // Optionally update step status
    if (selectedStep.status === "PENDING") {
      updateShipmentStep(selectedStep.id, { status: "IN_PROGRESS" });
    }

    setIsAssignDialogOpen(false);
    setAssignForm({
      userId: users[0]?.id || "",
      priority: "MEDIUM",
      dueDate: "۱۴۰۳/۰۵/۰۱",
      description: ""
    });
  };

  const customer = React.useMemo(() => customers.find(c => c.id === shipment?.customerId), [customers, shipment?.customerId]);
  const customerShipments = React.useMemo(() => shipments.filter(s => s.customerId === shipment?.customerId), [shipments, shipment?.customerId]);
  const [isCustomerSummaryOpen, setIsCustomerSummaryOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-[#1e293b] text-slate-400 hover:text-white rounded-xl"
            onClick={() => navigate("/shipments")}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-[#f8fafc]">{shipment.trackingNumber}</h1>
              <StatusBadge status={shipment.status} />
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <span className="flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" /> {shipment.customerName}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1 font-mono tracking-wider">{shipment.containerNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCustomerSummaryOpen} onOpenChange={setIsCustomerSummaryOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" className="border-[#1e293b] bg-[#1e293b]/50 text-slate-300 gap-2 font-bold h-10 px-6 rounded-xl hover:bg-[#38bdf8] hover:text-[#020617] transition-all">
                  <Users className="w-4 h-4" />
                  خلاصه وضعیت مشتری
                </Button>
              }
            />
            <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right sm:max-w-2xl" dir="rtl">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
                      <Users className="w-6 h-6" />
                   </div>
                   <div>
                      <DialogTitle className="text-xl font-black">{customer?.name || shipment.customerName}</DialogTitle>
                      <DialogDescription className="text-slate-400 text-xs">{customer?.company || "شرکت بازرگانی مربوطه"}</DialogDescription>
                   </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                <div className="bg-[#1e293b]/50 p-4 rounded-2xl border border-[#334155]/30">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">کل محموله‌ها</p>
                  <p className="text-2xl font-black text-[#38bdf8]">{customerShipments.length}</p>
                </div>
                <div className="bg-[#10192c] p-4 rounded-2xl border border-[#334155]/30">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">در جریان</p>
                  <p className="text-2xl font-black text-amber-400">
                    {customerShipments.filter(s => s.status !== 'DELIVERED' && s.status !== 'CLOSED').length}
                  </p>
                </div>
                <div className="bg-[#10192c] p-4 rounded-2xl border border-[#334155]/30">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">تکمیل شده</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {customerShipments.filter(s => s.status === 'DELIVERED').length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Ship className="w-4 h-4 text-[#38bdf8]" />
                    محموله فعلی: {shipment.trackingNumber}
                 </h4>
                 <div className="bg-[#1e293b]/20 p-4 rounded-2xl border border-[#334155]/20">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-xs text-slate-400">وضعیت فرآیند</span>
                       <StatusBadge status={shipment.status} />
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-[#0f172a]" />
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold">
                       <span>{shipment.origin}</span>
                       <span>{progressPercent}% تکمیل شده</span>
                       <span>{shipment.destination}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1e293b]">
                <h4 className="text-xs font-bold text-slate-500 mb-4">سایر محموله‌های اخیر</h4>
                <div className="space-y-2">
                   {customerShipments.filter(s => s.id !== shipment.id).slice(0, 3).map(s => (
                     <div key={s.id} className="flex items-center justify-between p-3 bg-[#1e293b]/10 rounded-xl hover:bg-[#1e293b]/30 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center text-slate-500">
                              <Package className="w-4 h-4" />
                           </div>
                           <span className="text-xs font-mono font-bold text-slate-300">{s.trackingNumber}</span>
                        </div>
                        <StatusBadge status={s.status} />
                     </div>
                   ))}
                   {customerShipments.length <= 1 && (
                     <p className="text-xs text-slate-600 text-center py-4 italic">مورد دیگری یافت نشد.</p>
                   )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button className="w-full bg-[#38bdf8] text-[#020617] font-extrabold h-12 rounded-xl" onClick={() => navigate(`/customers`)}>
                   مشاهده پرونده کامل مشتری
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-extrabold h-10 px-8 rounded-xl shadow-lg shadow-[#38bdf8]/10"
            onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
          >
            <Edit className="w-4 h-4 ml-2" />
            ویرایش اطلاعات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0f172a] border-[#1e293b] rounded-3xl shadow-2xl border-t-4 border-t-[#38bdf8] overflow-hidden">
            <CardContent className="p-6">
              <DocumentView shipmentId={shipment.id} />
            </CardContent>
          </Card>

          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="bg-[#0f172a] border border-[#1e293b] p-1 rounded-xl mb-4">
              <TabsTrigger value="steps" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#020617] rounded-lg px-6 text-xs font-bold">
                مراحل عملیاتی
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#020617] rounded-lg px-6 text-xs font-bold">
                جزییات بار
              </TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="space-y-6 focus-visible:outline-none">
              {/* Progress Overview */}
              <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl overflow-hidden shadow-xl border-t-2 border-t-[#38bdf8]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#38bdf8]" />
                      <h3 className="font-bold text-slate-200">وضعیت پیشرفت لجستیک</h3>
                    </div>
                    <span className="text-2xl font-black text-[#38bdf8]">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-[#1e293b]" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-[#334155]/30">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">مبداء</p>
                      <p className="text-sm font-bold truncate">{shipment.origin}</p>
                    </div>
                    <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-[#334155]/30">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">مقصد</p>
                      <p className="text-sm font-bold truncate">{shipment.destination}</p>
                    </div>
                    <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-[#334155]/30">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">تاریخ ثبت</p>
                      <p className="text-sm font-bold truncate">{shipment.createdAt}</p>
                    </div>
                    <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-[#334155]/30">
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold text-[#38bdf8]">زمان تقریبی تحویل</p>
                      <p className="text-sm font-bold truncate text-[#38bdf8]">{shipment.estimatedDelivery}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Timeline / Steps */}
              <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-xl">
                <CardHeader className="border-b border-[#1e293b]/50">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Package className="w-5 h-5 text-slate-400" />
                    مراحل فرآیند حمل و ترخیص
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-[#1e293b]" />
                    
                    <div className="space-y-8 relative">
                      {steps.map((step, index) => {
                        const linkedTasks = shipmentTasks.filter(t => t.title.includes(step.name));
                        return (
                          <div key={step.id} className="flex gap-6">
                            <div className="relative flex flex-col items-center">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-[#0f172a]",
                                step.status === "COMPLETED" ? "bg-emerald-500 text-white" : 
                                step.status === "IN_PROGRESS" ? "bg-[#38bdf8] text-[#020617] animate-pulse" : 
                                "bg-slate-800 text-slate-500"
                              )}>
                                {step.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4" /> : 
                                 step.status === "IN_PROGRESS" ? <Clock className="w-4 h-4" /> : 
                                 <div className="w-2 h-2 rounded-full bg-current" />}
                              </div>
                            </div>
                            <div className="flex-1 bg-[#1e293b]/30 rounded-2xl p-4 border border-[#334155]/20 hover:border-[#38bdf8]/30 transition-all group">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className={cn(
                                      "font-bold text-sm",
                                      step.status === "COMPLETED" ? "text-slate-200" : 
                                      step.status === "IN_PROGRESS" ? "text-[#38bdf8]" : 
                                      "text-slate-500"
                                    )}>
                                      {step.name}
                                    </h4>
                                    {step.completedAt && (
                                      <span className="text-[10px] text-slate-600 font-mono">{step.completedAt}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                                    {step.notes || `فرآیند عملیاتی مربوط به مرحله ${step.name} در محموله لجستیکی.`}
                                  </p>
                                  
                                  {linkedTasks.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {linkedTasks.map(task => (
                                        <Badge key={task.id} variant="outline" className="bg-[#0f172a]/50 text-[10px] gap-1.5 py-1 px-2 border-[#334155]">
                                          <div className={cn("w-1.5 h-1.5 rounded-full", task.status === "DONE" ? "bg-emerald-500" : "bg-[#38bdf8]")} />
                                          {task.assignedToName}: {task.status === "DONE" ? "تکمیل شده" : "درحال انجام"}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                   {EMPLOYEE_MANAGED_STEPS.includes(step.name) && step.status !== "COMPLETED" && (
                                     <Button 
                                       variant="ghost" 
                                       size="sm" 
                                       className="h-8 text-[11px] font-bold text-[#38bdf8] hover:bg-[#38bdf8]/10 px-3 rounded-lg"
                                       onClick={() => {
                                         setSelectedStep(step);
                                         setIsAssignDialogOpen(true);
                                       }}
                                     >
                                       <UserPlus className="w-3.5 h-3.5 ml-1.5" />
                                       ارجاع وظیفه
                                     </Button>
                                   )}
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-white">
                                     <MoreVertical className="w-4 h-4" />
                                   </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="focus-visible:outline-none">
              <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-[#38bdf8] border-r-2 border-[#38bdf8] pr-3">مشخصات کانتینر و کالا</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1e293b]/20 p-3 rounded-xl border border-[#334155]/20">
                          <p className="text-[10px] text-slate-500 mb-1">نوع کانتینر</p>
                          <p className="text-xs font-bold text-slate-200">40ft High Cube</p>
                        </div>
                        <div className="bg-[#1e293b]/20 p-3 rounded-xl border border-[#334155]/20">
                          <p className="text-[10px] text-slate-500 mb-1">تعداد واحد</p>
                          <p className="text-xs font-bold text-slate-200">۲ دستگاه</p>
                        </div>
                        <div className="bg-[#1e293b]/20 p-3 rounded-xl border border-[#334155]/20">
                          <p className="text-[10px] text-slate-500 mb-1">وزن کل</p>
                          <p className="text-xs font-bold text-slate-200">۱۲,۴۰۰ کیلوگرم</p>
                        </div>
                        <div className="bg-[#1e293b]/20 p-3 rounded-xl border border-[#334155]/20">
                          <p className="text-[10px] text-slate-500 mb-1">حجم (CBM)</p>
                          <p className="text-xs font-bold text-slate-200">۱۲۰ متر مکعب</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-[#38bdf8] border-r-2 border-[#38bdf8] pr-3">اطلاعات ترخیص و گمرک</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#1e293b]/20 rounded-xl border border-[#334155]/20">
                          <span className="text-xs text-slate-400">کد تعرفه (HS Code)</span>
                          <span className="text-xs font-mono font-bold text-slate-200">8471.30.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#1e293b]/20 rounded-xl border border-[#334155]/20">
                          <span className="text-xs text-slate-400">کشور سازنده</span>
                          <span className="text-xs font-bold text-slate-200">چین</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#1e293b]/20 rounded-xl border border-[#334155]/20">
                          <span className="text-xs text-slate-400">ارزش اظهاری</span>
                          <span className="text-xs font-bold text-emerald-400">$۴۵,۰۰۰ USD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Info Bar */}
        <div className="space-y-6">
          <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-xl overflow-hidden">
             <div className="bg-[#38bdf8] p-4 text-[#020617] h-24 relative overflow-hidden">
                < Ship className="w-32 h-32 absolute -bottom-8 -left-8 opacity-10" />
                <h3 className="font-black text-lg">اطلاعات حمل</h3>
                <p className="text-[11px] opacity-70 font-bold uppercase tracking-widest">Logistic Core Info</p>
             </div>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1e293b] flex items-center justify-center text-slate-400">
                         <Anchor className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-500 mb-0.5">بندر بارگیری (POL)</p>
                         <p className="text-xs font-bold text-slate-200">{shipment.origin}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1e293b] flex items-center justify-center text-slate-400">
                         <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-500 mb-0.5">بندر تخلیه (POD)</p>
                         <p className="text-xs font-bold text-slate-200">{shipment.destination}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1e293b] flex items-center justify-center text-slate-400">
                         <Clock className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-500 mb-0.5">فری تایم مقصد</p>
                         <p className="text-xs font-bold text-emerald-400">{shipment.freeTimeDays} روز کانتینری</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-[#1e293b]">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">تیم عملیاتی</h4>
                  <div className="space-y-3">
                     {users.slice(0, 3).map(user => (
                       <div key={user.id} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-[#1e293b]">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-slate-800 text-[10px]">{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-300">{user.name}</p>
                            <p className="text-[9px] text-slate-600">{user.role}</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       </div>
                     ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full border-[#1e293b] hover:bg-[#1e293b] text-slate-400 text-xs font-bold gap-2 rounded-xl py-6">
                  <Info className="w-4 h-4" />
                  مشاهده پروفایل مشتری
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Task Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#38bdf8]" />
              ارجاع وظیفه عملیاتی
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs text-right">
              تعریف تسک برای مدیریت مرحله <span className="text-[#38bdf8] font-bold">{selectedStep?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">کارمند مسئول</Label>
              <select 
                className="w-full bg-[#1e293b] border-[#334155] rounded-xl h-10 text-xs px-3 outline-none focus:ring-1 focus:ring-[#38bdf8]"
                value={assignForm.userId}
                onChange={e => setAssignForm({...assignForm, userId: e.target.value})}
              >
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">اولویت</Label>
                <select 
                  className="w-full bg-[#1e293b] border-[#334155] rounded-xl h-10 text-xs px-3 outline-none focus:ring-1 focus:ring-[#38bdf8]"
                  value={assignForm.priority}
                  onChange={e => setAssignForm({...assignForm, priority: e.target.value as any})}
                >
                  <option value="LOW">پایین</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">بالا</option>
                  <option value="URGENT">فوری</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">تاریخ سررسید</Label>
                <input 
                  type="text"
                  placeholder="۱۴۰۳/۰۵/۰۱"
                  className="w-full bg-[#1e293b] border-[#334155] rounded-xl h-10 text-xs px-3 outline-none focus:ring-1 focus:ring-[#38bdf8]"
                  value={assignForm.dueDate}
                  onChange={e => setAssignForm({...assignForm, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-400">توضیحات تکمیلی</Label>
              <textarea 
                className="w-full bg-[#1e293b] border-[#334155] rounded-xl p-3 text-xs min-h-[100px] outline-none focus:ring-1 focus:ring-[#38bdf8]"
                placeholder="جزئیات تسک را اینجا بنویسید..."
                value={assignForm.description}
                onChange={e => setAssignForm({...assignForm, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1 border-[#334155] hover:bg-[#1e293b] rounded-xl h-11" onClick={() => setIsAssignDialogOpen(false)}>
              انصراف
            </Button>
            <Button className="flex-1 bg-[#38bdf8] text-[#020617] font-extrabold rounded-xl h-11" onClick={handleAssignTask}>
              ثبت و ارجاع وظیفه
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
