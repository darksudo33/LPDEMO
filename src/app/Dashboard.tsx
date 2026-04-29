import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMockStore } from "@/src/store/useMockStore";
import { Package, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    IN_TRANSIT: "bg-blue-500/10 text-blue-500",
    ARRIVED: "bg-green-500/10 text-green-500",
    CUSTOMS: "bg-orange-500/10 text-orange-500",
    CLEARED: "bg-purple-500/10 text-purple-500",
    DELIVERED: "bg-emerald-500/10 text-emerald-500",
    PENDING: "bg-slate-500/10 text-slate-500",
  };
  const labels: Record<string, string> = {
    IN_TRANSIT: "درحال حمل",
    ARRIVED: "رسیده به بندر",
    CUSTOMS: "در انتظار گمرک",
    CLEARED: "ترخیص شده",
    DELIVERED: "تحویل نهایی",
    PENDING: "در انتظار ثبت",
  };
  return <Badge className={styles[status] || ""}>{labels[status] || status}</Badge>;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const shipments = useMockStore(state => state.shipments);
  const tasks = useMockStore(state => state.tasks);
  const currentUser = useMockStore(state => state.currentUser);

  const recentShipments = React.useMemo(() => shipments.slice(0, 6), [shipments]);
  const recentTasks = React.useMemo(() => tasks.slice(0, 3), [tasks]);
  
  const myTasks = React.useMemo(() => {
    if (!currentUser) return [];
    return tasks
      .filter(task => task.assignedToUserId === currentUser.id && task.status !== "DONE")
      .sort((a, b) => {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 4);
  }, [tasks, currentUser]);

  const stats = [
    { title: "کل محموله‌های فعال", value: "۱۴۸", icon: Package, change: "↑ ۱۲٪ نسبت به ماه قبل", up: true, subtitle: "کل محموله‌های فعال" },
    { title: "در انتظار ترخیص", value: "۲۴", icon: TrendingUp, change: "۵ محموله در اولویت بالا", up: true, subtitle: "در انتظار ترخیص", color: "text-[#eab308]" },
    { title: "وظایف امروز", value: "۰۹", icon: CheckCircle, change: "۳ مورد تکمیل شده", up: true, subtitle: "وظایف امروز", color: "text-[#38bdf8]" },
    { title: "هشدار دموراژ", value: "۰۳", icon: Clock, change: "فوری: جریمه فعال", up: false, subtitle: "هشدار دموراژ", color: "text-[#ef4444]" },
  ];

  const criticalShipments = React.useMemo(() => {
    // For demo purposes, we'll assign some random "days remaining" to make it look active
    const daysMap: Record<string, number> = {
      's2': 1.5, // 1 day, 12 hours
      's3': 3.2, // 3 days, 4 hours
      's1': 5.8  // 5 days, 19 hours
    };

    return shipments
      .filter(s => ['ARRIVED', 'CUSTOMS', 'IN_TRANSIT'].includes(s.status))
      .map(s => ({
        ...s,
        daysRemaining: daysMap[s.id] || (Math.random() * 10 + 5)
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 3);
  }, [shipments]);

  return (
    <div className="p-3 md:p-5 space-y-4 font-sans">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#0f172a] border-[#1e293b] rounded-xl shadow-none overflow-hidden group">
            <CardContent className="p-3 md:p-4 flex flex-col gap-1 relative">
              <div className={cn("absolute -top-1 -left-1 w-12 h-12 opacity-10 blur-xl rounded-full transition-all group-hover:opacity-20", stat.color ? "bg-current" : "bg-emerald-500")} />
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] md:text-[11px] text-[#94a3b8] font-black uppercase tracking-wider">{stat.title}</p>
                <stat.icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4 opacity-50", stat.color || "text-[#38bdf8]")} />
              </div>
              <p className="text-xl md:text-2xl font-black text-[#f8fafc] leading-none mb-1">{stat.value}</p>
              <p className={cn("text-[9px] md:text-[10px] font-medium transition-all", stat.color || (stat.up ? "text-green-500" : "text-red-500"))}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Critical Shipments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm md:text-base font-black text-[#f8fafc] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                محموله‌های بحرانی (زمان رو به اتمام)
              </h2>
              <span className="text-[10px] text-slate-500 font-bold">بر پایه زمان فری‌تایم باقی‌مانده</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {criticalShipments.map((shipment) => {
                const days = Math.floor(shipment.daysRemaining);
                const hours = Math.floor((shipment.daysRemaining % 1) * 24);
                const progress = Math.max(10, 100 - (shipment.daysRemaining / (shipment.freeTimeDays || 14)) * 100);
                
                return (
                  <Card key={shipment.id} className="bg-[#0f172a] border-[#1e293b] rounded-2xl overflow-hidden hover:border-[#38bdf8]/30 transition-all border-b-4 border-b-[#ef4444]/20">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#1e293b] text-[#38bdf8] border-none text-[9px] font-black">{shipment.trackingNumber}</Badge>
                        <StatusBadge status={shipment.status} />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold">مشتری</p>
                        <p className="text-xs font-black text-slate-200 truncate">{shipment.customerName}</p>
                      </div>

                      <div className="bg-[#020617] rounded-xl p-3 border border-[#1e293b]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">زمان باقی‌مانده</span>
                          <Clock className="w-3 h-3 text-[#ef4444] animate-pulse" />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#f8fafc] tabular-nums">{days}</span>
                          <span className="text-[10px] font-bold text-slate-500">روز</span>
                          <span className="mx-1 text-slate-700">•</span>
                          <span className="text-xl font-black text-[#f8fafc] tabular-nums">{hours}</span>
                          <span className="text-[10px] font-bold text-slate-500">ساعت</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-slate-500">
                          <span>مصرف فری‌تایم</span>
                          <span className={cn(progress > 80 ? "text-red-500" : "text-[#38bdf8]")}>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-1000", progress > 80 ? "bg-red-500" : "bg-[#38bdf8]")}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-[10px] font-black h-8 hover:bg-[#38bdf8]/10 text-[#38bdf8] rounded-lg mt-1"
                        onClick={() => navigate(`/shipments/${shipment.id}`)}
                      >
                        بررسی وضعیت و ترخیص
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl overflow-hidden flex flex-col min-h-0">
            <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-[#f8fafc]">بارهای اخیر</CardTitle>
              <span className="text-[11px] text-[#38bdf8] font-bold cursor-pointer hover:underline" onClick={() => navigate('/shipments')}>مشاهده همه</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <table className="w-full text-right text-[11px]">
                    <thead>
                      <tr className="border-b border-[#1e293b] bg-[#1e293b]/20">
                        <th className="px-4 py-3 font-bold text-[#94a3b8]">رهگیری</th>
                        <th className="px-4 py-3 font-bold text-[#94a3b8]">مشتری</th>
                        <th className="px-4 py-3 font-bold text-[#94a3b8]">مسیر</th>
                        <th className="px-4 py-3 font-bold text-[#94a3b8]">وضعیت</th>
                        <th className="px-4 py-3 font-bold text-[#94a3b8]">بروزرسانی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]">
                      {recentShipments.map((shipment) => (
                        <tr 
                          key={shipment.id} 
                          className="hover:bg-[#1e293b]/30 transition-all cursor-pointer group"
                          onClick={() => navigate(`/shipments/${shipment.id}`)}
                        >
                          <td className="px-4 py-3 font-mono text-[#38bdf8] font-black">{shipment.trackingNumber}</td>
                          <td className="px-4 py-3 text-slate-300 font-bold">{shipment.customerName}</td>
                          <td className="px-4 py-3 text-slate-400">
                            <span className="text-slate-200">{shipment.origin}</span>
                            <span className="mx-1 opacity-30">←</span>
                            <span className="text-slate-200">{shipment.destination}</span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={shipment.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{shipment.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl flex flex-col min-h-0 shadow-lg shadow-black/20 overflow-hidden">
            <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between space-y-0 bg-[#38bdf8]/5">
              <CardTitle className="text-xs md:text-sm font-black text-[#38bdf8] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                وظایف من (امروز)
              </CardTitle>
              <Badge variant="outline" className="text-[9px] border-[#38bdf8]/30 text-[#38bdf8] h-4.5 px-1.5 font-black">
                {myTasks.length} وظیفه
              </Badge>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-2.5 overflow-y-auto">
              {myTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[10px] text-slate-600 font-medium tracking-tight">برنامه کاری شما برای امروز تکمیل است ✨</p>
                </div>
              ) : (
                myTasks.map(task => (
                  <div key={task.id} className="group relative bg-[#020617]/40 border border-[#1e293b] rounded-xl p-3 hover:border-[#38bdf8]/50 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] md:text-[12px] font-black text-slate-200 truncate leading-tight">{task.title}</p>
                        <p className="text-[9px] text-slate-500 mt-1.5 flex items-center gap-1 opacity-70">
                          <Clock className="w-3 h-3" />
                          {task.dueDate}
                        </p>
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-black h-4 px-1 border-none shadow-none shrink-0",
                        task.priority === "URGENT" ? "bg-rose-500 text-white" : 
                        task.priority === "HIGH" ? "bg-amber-500 text-black" : 
                        "bg-[#1e293b] text-slate-300"
                      )}>
                        {task.priority === "URGENT" ? "فوری" : task.priority === "HIGH" ? "بالا" : "عادی"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              <Button 
                variant="ghost" 
                className="w-full text-[10px] text-[#38bdf8] hover:bg-[#38bdf8]/10 h-8 mt-1 font-bold rounded-lg"
                onClick={() => navigate('/tasks')}
              >
                مدیریت همه کارها
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl flex flex-col min-h-0 opacity-80 hover:opacity-100 transition-all">
            <CardHeader className="p-3 md:p-4 border-b border-[#1e293b]">
              <CardTitle className="text-xs font-bold text-slate-400">پیگیری عملیاتی تیم</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-2 overflow-y-auto">
              {recentTasks.map(task => (
                <div key={task.id} className="bg-[#1e293b]/50 border border-transparent rounded-lg p-2.5 hover:border-[#38bdf8]/30 transition-all cursor-pointer flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-300 truncate">{task.title}</p>
                    <p className="text-[8px] text-slate-500 mt-0.5">{task.assignedToName}</p>
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    task.priority === "URGENT" ? "bg-red-500" : 
                    task.priority === "HIGH" ? "bg-orange-500" : 
                    "bg-blue-500"
                  )} />
                </div>
              ))}
              <div className="pt-1">
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-[#334155] text-[#94a3b8] h-9 text-[10px] font-bold hover:bg-[#1e293b] rounded-lg"
                  onClick={() => navigate('/tasks')}
                >
                  افزودن تسک مدیریتی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
