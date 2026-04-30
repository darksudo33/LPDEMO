import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  History, 
  User, 
  Clock, 
  Package, 
  FileText, 
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Search,
  Filter,
  ArrowDownCircle,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function ChangeLog() {
  const navigate = useNavigate();
  const { activityLogs, currentUser } = useMockStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (currentUser?.role !== "CEO") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" dir="rtl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20"
        >
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-100 mb-3">عدم دسترسی کافی</h2>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
          متأسفیم، بخش لاگ تغییرات سیستمی تنها برای مدیریت کل (CEO) قابل مشاهده است. 
          در صورت نیاز به دسترسی با بخش پشتیبانی فنی تماس بگیرید.
        </p>
      </div>
    );
  }

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter) {
      return matchesSearch && log.entityType === activeFilter;
    }
    return matchesSearch;
  });

  const getLogIcon = (entityType: string) => {
    switch (entityType) {
      case "SHIPMENT": return <Package className="w-4 h-4" />;
      case "DOCUMENT": return <FileText className="w-4 h-4" />;
      case "TASK": return <CheckCircle className="w-4 h-4" />;
      case "USER": return <User className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case "SHIPMENT": return "text-[#38bdf8] bg-[#38bdf8]/10";
      case "DOCUMENT": return "text-purple-400 bg-purple-400/10";
      case "TASK": return "text-emerald-400 bg-emerald-400/10";
      case "USER": return "text-orange-400 bg-orange-400/10";
      default: return "text-slate-400 bg-slate-400/10";
    }
  };

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      SHIPMENT: "محموله",
      DOCUMENT: "مدرک",
      TASK: "وظیفه",
      USER: "کاربر",
      CUSTOMER: "مشتری"
    };
    return labels[entityType] || entityType;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 px-4 md:px-8 max-w-[1600px] mx-auto" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-[#f8fafc] flex items-center gap-3">
            <div className="p-2 bg-[#38bdf8]/10 rounded-2xl">
              <History className="w-8 h-8 text-[#38bdf8]" />
            </div>
            تاریخچه سیستم
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mr-1.5 opacity-80">رهگیری تمامی فعالیت‌های امنیتی و تغییرات عملیاتی</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1e293b]/50 p-2 rounded-2xl border border-[#1e293b] w-fit">
          <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
          <span className="text-[11px] font-bold text-slate-300">CEO ACCESS ONLY</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input 
            placeholder="جستجوی کاربر، عملیات یا جزئیات..." 
            className="bg-[#0f172a]/80 backdrop-blur-xl border-[#1e293b] pr-12 focus:ring-[#38bdf8] h-14 rounded-2xl text-sm font-medium transition-all focus:border-[#38bdf8]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <Button variant="outline" className="flex-1 h-14 border-[#1e293b] bg-[#0f172a] text-slate-400 gap-2 px-4 rounded-2xl hover:text-white transition-all group">
            <Filter className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">فیلترهای زمانی</span>
          </Button>
          <Button variant="outline" className="w-14 h-14 border-[#1e293b] bg-[#0f172a] flex items-center justify-center rounded-2xl hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/50 transition-all">
            <Calendar className="w-5 h-5 text-[#38bdf8]" />
          </Button>
        </div>
      </div>

      {/* Entity Type Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button 
          variant={activeFilter === null ? "default" : "outline"}
          onClick={() => setActiveFilter(null)}
          className={cn(
            "rounded-full h-9 px-5 text-xs font-black whitespace-nowrap transition-all shrink-0",
            activeFilter === null ? "bg-[#38bdf8] text-[#020617]" : "border-[#1e293b] bg-transparent text-slate-400 hover:text-white"
          )}
        >
          همه فعالیت‌ها
        </Button>
        {["SHIPMENT", "TASK", "DOCUMENT", "USER"].map((type) => (
          <Button
            key={type}
            variant={activeFilter === type ? "default" : "outline"}
            onClick={() => setActiveFilter(type)}
            className={cn(
              "rounded-full h-9 px-5 text-xs font-black whitespace-nowrap transition-all shrink-0",
              activeFilter === type ? "bg-[#38bdf8] text-[#020617]" : "border-[#1e293b] bg-transparent text-slate-400 hover:text-emerald-400"
            )}
          >
            {getEntityLabel(type)}
          </Button>
        ))}
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Continuous Line (Desktop Only) */}
        <div className="absolute right-[45px] top-0 bottom-0 w-px bg-gradient-to-b from-[#38bdf8]/50 via-[#1e293b] to-transparent hidden md:block" />

        <div className="space-y-4 md:space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="relative group px-1"
              >
                {/* Timeline Marker (Desktop Only) */}
                <div className="absolute right-[33px] top-8 w-6 h-6 rounded-full bg-[#020617] border-2 border-[#1e293b] group-hover:border-[#38bdf8] transition-colors z-10 hidden md:flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#38bdf8] transition-colors" />
                </div>

                <Card className="bg-[#0f172a]/40 backdrop-blur-md border-[#1e293b] rounded-[2rem] hover:border-[#38bdf8]/40 transition-all hover:bg-[#0f172a]/80 shadow-lg md:mr-16">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                      {/* Left Side: User & Meta */}
                      <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                        <div className="relative">
                          <Avatar className="w-12 h-12 md:w-14 md:h-14 border-2 border-[#1e293b] ring-4 ring-[#020617]">
                            <AvatarFallback className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-lg font-black text-[#38bdf8]">
                              {log.userName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute -bottom-1 -left-1 w-6 h-6 rounded-lg flex items-center justify-center ring-2 ring-[#020617] shadow-lg",
                            getEntityColor(log.entityType)
                          )}>
                            {getLogIcon(log.entityType)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white">{log.userName}</span>
                          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
                            <Clock className="w-3 h-3" />
                            {log.createdAt?.split?.(/[T ]/)?.[0]} • {log.createdAt?.split?.(/[T ]/)?.[1]?.substring(0, 5)}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Action & Details */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#1e293b] text-[#f8fafc] border-none text-[10px] md:text-xs font-black px-3 py-1 rounded-lg">
                            {log.action}
                          </Badge>
                          <div className="h-4 w-px bg-[#1e293b] hidden sm:block mx-1" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                            {getEntityLabel(log.entityType)} ID: #{log.entityId.slice(-4).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed bg-[#1e293b]/20 p-4 rounded-2xl border border-[#1e293b]/50 group-hover:border-[#38bdf8]/20 transition-colors">
                          {log.details || "جزئیات خاصی برای این فعالیت ثبت نشده است."}
                        </p>
                      </div>

                      {/* Right: Interaction */}
                      <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex gap-2">
                         {log.entityType === 'TASK' && (
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="flex-1 md:flex-none h-10 px-4 text-[11px] font-black border-[#1e293b] text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400 rounded-xl transition-all"
                             onClick={() => {
                               const task = useMockStore.getState().tasks.find(t => t.id === log.entityId);
                               if (task && task.status !== 'DONE') {
                                 useMockStore.getState().updateTaskStatus(log.entityId, 'DONE');
                               }
                             }}
                           >
                             <CheckCircle className="w-3.5 h-3.5 ml-2" />
                             تکمیل فوری
                           </Button>
                         )}
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="flex-1 md:flex-none h-10 px-5 text-[11px] font-black text-slate-400 hover:bg-[#38bdf8]/10 hover:text-[#38bdf8] rounded-xl border border-[#1e293b] md:border-transparent group/btn whitespace-nowrap"
                           onClick={() => {
                             if (log.entityType === 'SHIPMENT') navigate(`/shipments/${log.entityId}`);
                             if (log.entityType === 'TASK') navigate(`/tasks`);
                             if (log.entityType === 'USER') navigate(`/management`);
                             if (log.entityType === 'DOCUMENT') navigate(`/documents`);
                             if (log.entityType === 'CUSTOMER') navigate(`/customers`);
                           }}
                         >
                           {log.entityType === 'SHIPMENT' ? 'مشاهده محموله' : 
                            log.entityType === 'TASK' ? 'مدیریت وظایف' : 
                            log.entityType === 'USER' ? 'پروفایل کاربر' : 'بررسی جزئیات'}
                           <ArrowRight className="w-3.5 h-3.5 mr-2 -rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredLogs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 flex flex-col items-center justify-center text-slate-700 bg-[#0f172a]/40 rounded-[3rem] border border-dashed border-[#1e293b]"
          >
            <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-lg font-bold">موردی برای نمایش یافت نشد</p>
            <p className="text-xs mt-2 opacity-60">جستجو یا فیلترهای خود را تغییر دهید</p>
          </motion.div>
        )}
      </div>

      {filteredLogs.length > 5 && (
        <div className="flex items-center justify-center pt-8">
          <Button variant="outline" className="h-14 px-8 border-[#38bdf8]/30 bg-transparent text-[#38bdf8] text-sm font-black gap-3 rounded-2xl hover:bg-[#38bdf8]/10 hover:border-[#38bdf8] transition-all">
            <ArrowDownCircle className="w-5 h-5 animate-bounce" />
            بارگذاری ۲۰ لاگ قدیمی‌تر
          </Button>
        </div>
      )}
    </div>
  );
}

