import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/src/store/useMockStore";
import { Progress } from "@/components/ui/progress";
import { Search, Ship, Filter, Plus, Eye, MoreHorizontal, Calendar, MapPin, Truck, Check, ListChecks, CheckCircle2, Clock, MoreVertical, Share2, Edit, ArrowUpDown, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ShipmentStatus } from "../types";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    IN_TRANSIT: "bg-sky-500/10 text-sky-400",
    ARRIVED: "bg-green-500/10 text-green-400",
    CUSTOMS: "bg-yellow-500/10 text-yellow-400",
    CLEARED: "bg-purple-500/10 text-purple-400",
    DELIVERED: "bg-emerald-500/10 text-emerald-400",
    PENDING: "bg-slate-500/10 text-slate-500",
    BOOKED: "bg-indigo-500/10 text-indigo-400",
    CLOSED: "bg-rose-500/10 text-rose-400",
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
  return <Badge className={`${styles[status] || ""} border-none py-0.5 px-2 text-[10px] font-bold`}>{labels[status] || status}</Badge>;
};

export default function Shipments() {
  const navigate = useNavigate();
  const shipments = useMockStore(state => state.shipments);
  const shipmentSteps = useMockStore(state => state.shipmentSteps);
  const addShipment = useMockStore(state => state.addShipment);
  const updateShipmentStatus = useMockStore(state => state.updateShipmentStatus);
  const customers = useMockStore(state => state.customers);
  const tasks = useMockStore(state => state.tasks);
  const updateTaskStatus = useMockStore(state => state.updateTaskStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    trackingNumber: "",
    containerNumber: "",
    customerId: "",
    customerName: "",
    origin: "",
    destination: "",
    estimatedDelivery: "",
  });

  const handleAddShipment = () => {
    const customer = customers.find(c => c.id === newShipment.customerId);
    addShipment({
      ...newShipment,
      customerName: customer?.name || "مشتری متفرقه",
      status: "PENDING",
      createdAt: new Date().toLocaleDateString("fa-IR"),
      freeTimeDays: 7
    });
    setIsAddDialogOpen(false);
    setNewShipment({
      trackingNumber: "",
      containerNumber: "",
      customerId: "",
      customerName: "",
      origin: "",
      destination: "",
      estimatedDelivery: "",
    });
  };

  const processedShipments = React.useMemo(() => {
    return [...shipments]
      .filter(s => {
        const matchesSearch = s.trackingNumber.includes(searchTerm) || s.containerNumber.includes(searchTerm);
        const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a: any, b: any) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [shipments, searchTerm, statusFilter, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#38bdf8]" /> : <ArrowDown className="w-3 h-3 text-[#38bdf8]" />;
  };

  const handleViewDetails = (shipment: any) => {
    navigate(`/shipments/${shipment.id}`);
  };

  const statusOptions = [
    { value: "ALL", label: "همه وضعیت‌ها" },
    { value: "PENDING", label: "در انتظار ثبت" },
    { value: "BOOKED", label: "رزرو شده" },
    { value: "IN_TRANSIT", label: "در حال حمل" },
    { value: "ARRIVED", label: "رسیده به بندر" },
    { value: "CUSTOMS", label: "در انتظار گمرک" },
    { value: "CLEARED", label: "ترخیص شده" },
    { value: "DELIVERED", label: "تحویل نهایی" },
  ];

  return (
    <div className="p-5 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">مدیریت محموله‌ها</h1>
          <p className="text-[12px] text-slate-400">لیست کامل و وضعیت جزئی بارهای در جریان.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] gap-2 h-10 w-full sm:w-auto text-xs font-bold px-4 rounded-xl">
                <Plus className="w-3.5 h-3.5" />
                ثبت محموله جدید
              </Button>
            }
          />
          <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">افزودن محموله جدید</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs text-right">
                جزئیات محموله جدید را برای رهگیری در سیستم وارد کنید.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tracking" className="text-xs text-slate-400">شماره رهگیری (B/L)</Label>
                  <Input 
                    id="tracking" 
                    placeholder="LGS-123456" 
                    className="bg-[#1e293b] border-[#334155] text-xs h-9 ltr" 
                    value={newShipment.trackingNumber}
                    onChange={e => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="container" className="text-xs text-slate-400">شماره کانتینر</Label>
                  <Input 
                    id="container" 
                    placeholder="MSKU1234567" 
                    className="bg-[#1e293b] border-[#334155] text-xs h-9 ltr" 
                    value={newShipment.containerNumber}
                    onChange={e => setNewShipment({...newShipment, containerNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer" className="text-xs text-slate-400">مشتری</Label>
                <select 
                  id="customer"
                  className="w-full bg-[#1e293b] border-[#334155] text-xs h-9 rounded-md px-3 outline-none focus:ring-1 focus:ring-[#38bdf8]/50"
                  value={newShipment.customerId}
                  onChange={e => setNewShipment({...newShipment, customerId: e.target.value})}
                >
                  <option value="">انتخاب مشتری...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="origin" className="text-xs text-slate-400">مبداء</Label>
                  <Input 
                    id="origin" 
                    className="bg-[#1e293b] border-[#334155] text-xs h-9" 
                    value={newShipment.origin}
                    onChange={e => setNewShipment({...newShipment, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="destination" className="text-xs text-slate-400">مقصد (بندر)</Label>
                  <Input 
                    id="destination" 
                    className="bg-[#1e293b] border-[#334155] text-xs h-9" 
                    value={newShipment.destination}
                    onChange={e => setNewShipment({...newShipment, destination: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eta" className="text-xs text-slate-400">تاریخ تحویل تخمینی (ETA)</Label>
                <Input 
                  id="eta" 
                  placeholder="۱۴۰۳/۰۴/۱۵"
                  className="bg-[#1e293b] border-[#334155] text-xs h-9" 
                  value={newShipment.estimatedDelivery}
                  onChange={e => setNewShipment({...newShipment, estimatedDelivery: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddShipment} className="w-full bg-[#38bdf8] text-[#020617] font-bold h-10">
                ایجاد محموله
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0f172a] p-3 rounded-xl border border-[#1e293b]">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <Input 
            placeholder="جستجو با شماره پیگیری یا کانتینر..." 
            className="bg-[#1e293b] border-[#334155] pr-10 h-10 text-xs focus-visible:ring-[#38bdf8]/50 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="border-[#1e293b] bg-[#1e293b] gap-2 h-10 text-xs text-slate-300 hover:bg-[#334155] rounded-xl">
                <Filter className="w-3.5 h-3.5" />
                {statusOptions.find(o => o.value === statusFilter)?.label || "فیلتر"}
              </Button>
            }
          />
          <DropdownMenuContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] text-slate-500">فیلتر بر اساس وضعیت</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#1e293b]" />
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                {statusOptions.map(option => (
                  <DropdownMenuRadioItem 
                    key={option.value} 
                    value={option.value}
                    className="text-xs cursor-pointer focus:bg-[#1e293b]"
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="md:hidden space-y-4">
        {processedShipments.length > 0 ? (
          processedShipments.map((shipment) => {
            const stepsForShipment = shipmentSteps.filter(s => s.shipmentId === shipment.id);
            const totalSteps = stepsForShipment.length;
            const completedSteps = stepsForShipment.filter(s => s.status === 'COMPLETED').length;
            let progressValue = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
            
            if (shipment.status === 'DELIVERED') progressValue = 100;
            else if (shipment.status === 'CLEARED' && progressValue < 80) progressValue = 85;
            else if (shipment.status === 'ARRIVED' && progressValue < 50) progressValue = 60;
            
            return (
              <Card key={shipment.id} className="bg-[#0f172a] border-[#1e293b] rounded-2xl overflow-hidden shadow-lg p-4">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1">
                     <span className="font-mono text-sm font-black text-[#38bdf8]">{shipment.trackingNumber}</span>
                     <span className="text-[10px] text-slate-500 font-mono">{shipment.containerNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#38bdf8] bg-[#38bdf8]/10 h-10 w-10 hover:bg-[#38bdf8]/20 rounded-xl shadow-lg shadow-[#38bdf8]/5"
                      onClick={() => handleViewDetails(shipment)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="text-slate-500 h-9 w-9 hover:text-white hover:bg-[#1e293b] rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] w-52 shadow-2xl" align="end" dir="rtl">
                         <DropdownMenuItem 
                           className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center gap-2 rounded-lg"
                           onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
                         >
                           <Edit className="w-3.5 h-3.5" />
                           ویرایش محموله
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                           className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center gap-2 text-[#38bdf8] font-bold rounded-lg"
                           onClick={() => {
                             const link = `${window.location.origin}/track?q=${shipment.trackingNumber}`;
                             navigator.clipboard.writeText(link);
                             alert("لینک رهگیری مشتری در حافظه کپی شد:\n" + link);
                           }}
                         >
                           <Share2 className="w-3.5 h-3.5" />
                           اشتراک‌گذاری با مشتری
                         </DropdownMenuItem>
                         <DropdownMenuSeparator className="bg-[#1e293b]" />
                         <DropdownMenuGroup>
                           <DropdownMenuLabel className="text-[10px] text-slate-500 font-black px-2 py-1">تغییر وضعیت</DropdownMenuLabel>
                         </DropdownMenuGroup>
                         {statusOptions.filter(o => o.value !== "ALL").map(status => (
                           <DropdownMenuItem 
                             key={status.value} 
                             className="text-xs cursor-pointer hover:bg-[#1e293b] flex justify-between items-center rounded-lg"
                             onClick={() => updateShipmentStatus(shipment.id, status.value as ShipmentStatus)}
                           >
                             <span className="font-medium">{status.label}</span>
                             {shipment.status === status.value && <Check className="w-3 h-3 text-[#38bdf8]" />}
                           </DropdownMenuItem>
                         ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-950/30 p-3 rounded-xl border border-[#1e293b]/50">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">مشتری</span>
                     <span className="text-[11px] text-slate-200 font-bold truncate">{shipment.customerName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">تحویل تخمینی</span>
                     <span className="text-[11px] text-slate-200 font-mono">{shipment.estimatedDelivery}</span>
                  </div>
               </div>

               <div className="mb-4 space-y-1.5 px-1">
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-slate-500">پیشرفت فرآیند</span>
                    <span className="text-[#38bdf8]">
                      {Math.round(progressValue)}%
                    </span>
                  </div>
                  <Progress 
                    value={progressValue} 
                    className="h-1 bg-slate-800" 
                  />
               </div>

               <div className="flex items-center justify-between border-t border-[#1e293b]/30 pt-4">
                  <div className="flex items-center gap-2">
                     <div className="flex flex-col">
                        <span className="text-[11px] text-slate-300 font-bold">{shipment.origin}</span>
                        <span className="text-[9px] text-slate-500">مبدأ</span>
                     </div>
                     <ArrowUpDown className="w-3 h-3 text-slate-600 rotate-90 opacity-50" />
                     <div className="flex flex-col">
                        <span className="text-[11px] text-slate-300 font-bold">{shipment.destination}</span>
                        <span className="text-[9px] text-slate-500">مقصد</span>
                     </div>
                  </div>
                  <StatusBadge status={shipment.status} />
               </div>
            </Card>
            );
          })
        ) : (
          <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-[#1e293b]">
            <p className="text-xs text-slate-500">موردی یافت نشد.</p>
          </div>
        )}
      </div>

      <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl overflow-hidden hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[12px] min-w-[800px]">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#1e293b]/20">
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">شماره رهگیری</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">کانتینر</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">مبدأ</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">مقصد</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">مشتری</th>
                  <th 
                    className="px-5 py-4 font-medium text-[#94a3b8] cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      وضعیت
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-5 py-4 font-medium text-[#94a3b8] cursor-pointer hover:text-white transition-colors"
                    onClick={() => requestSort('estimatedDelivery')}
                  >
                    <div className="flex items-center gap-2">
                      تحویل تخمینی
                      {getSortIcon('estimatedDelivery')}
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {processedShipments.length > 0 ? (
                  processedShipments.map((shipment) => {
                    const stepsForShipment = shipmentSteps.filter(s => s.shipmentId === shipment.id);
                    const totalSteps = stepsForShipment.length;
                    const completedSteps = stepsForShipment.filter(s => s.status === 'COMPLETED').length;
                    let progressValue = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                    
                    if (shipment.status === 'DELIVERED') progressValue = 100;
                    else if (shipment.status === 'CLEARED' && progressValue < 80) progressValue = 85;
                    else if (shipment.status === 'ARRIVED' && progressValue < 50) progressValue = 60;

                    return (
                      <tr key={shipment.id} className="hover:bg-[#1e293b]/30 transition-colors group">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-bold text-[#38bdf8]">{shipment.trackingNumber}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-400">{shipment.containerNumber}</td>
                        <td className="px-5 py-4 text-slate-300">{shipment.origin}</td>
                        <td className="px-5 py-4 text-slate-300">{shipment.destination}</td>
                        <td className="px-5 py-4 font-medium text-slate-200">{shipment.customerName}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 min-w-[120px]">
                            <div className="flex justify-between items-center text-[10px]">
                              <StatusBadge status={shipment.status} />
                              <span className="font-bold text-[#38bdf8]">
                                {Math.round(progressValue)}%
                              </span>
                            </div>
                            <Progress 
                              value={progressValue} 
                              className="h-1.5 bg-slate-800" 
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono">{shipment.estimatedDelivery}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-[#38bdf8] bg-[#38bdf8]/5 h-9 w-9 hover:bg-[#38bdf8]/20 border border-[#38bdf8]/10 shadow-lg shadow-[#38bdf8]/5"
                              onClick={() => handleViewDetails(shipment)}
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button variant="ghost" size="icon" className="text-slate-500 h-8 w-8 hover:text-white hover:bg-[#1e293b]">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] w-48 shadow-2xl" align="end" dir="rtl">
                                 <DropdownMenuItem 
                                   className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center gap-2 rounded-lg"
                                   onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
                                 >
                                   <Edit className="w-3.5 h-3.5" />
                                   ویرایش محموله
                                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                                   className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center gap-2 text-[#38bdf8] font-bold rounded-lg"
                                   onClick={() => {
                                     const link = `${window.location.origin}/track?q=${shipment.trackingNumber}`;
                                     navigator.clipboard.writeText(link);
                                     alert("لینک رهگیری مشتری در حافظه کپی شد:\n" + link);
                                   }}
                                 >
                                   <Share2 className="w-3.5 h-3.5" />
                                   اشتراک‌گذاری با مشتری
                                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                                   className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center gap-2 rounded-lg"
                                   onClick={() => navigate(`/shipments/${shipment.id}`)}
                                 >
                                   <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
                                   تغییر وضعیت جزئی
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator className="bg-[#1e293b]" />
                                 <DropdownMenuGroup>
                                   <DropdownMenuLabel className="text-[10px] text-slate-500">تغییر وضعیت</DropdownMenuLabel>
                                 </DropdownMenuGroup>
                                 {statusOptions.filter(o => o.value !== "ALL").map(status => (
                                   <DropdownMenuItem 
                                     key={status.value} 
                                     className="text-xs cursor-pointer hover:bg-[#1e293b] flex justify-between items-center rounded-lg"
                                     onClick={() => updateShipmentStatus(shipment.id, status.value as ShipmentStatus)}
                                   >
                                     {status.label}
                                     {shipment.status === status.value && <Check className="w-3 h-3 text-[#38bdf8]" />}
                                   </DropdownMenuItem>
                                 ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                      <p className="text-sm">موردی یافت نشد.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
