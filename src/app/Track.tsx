import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/src/store/useMockStore";
import { Search, MapPin, Package, CheckCircle2, Circle, Clock, ArrowLeft, ShieldCheck, Ship, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function Track() {
  const { shipments, shipmentSteps } = useMockStore();
  const location = useLocation();
  const [trackingId, setTrackingId] = useState("");
  const [activeShipment, setActiveShipment] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setTrackingId(q);
      const found = shipments.find(s => s.trackingNumber === q.toUpperCase());
      if (found) setActiveShipment(found);
    }
  }, [location.search, shipments]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = shipments.find(s => s.trackingNumber === trackingId.toUpperCase());
    setActiveShipment(found || null);
  };

  const steps = activeShipment ? shipmentSteps.filter(s => s.shipmentId === activeShipment.id) : [];
  const completedCount = steps.filter(s => s.status === "COMPLETED").length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col items-center text-center space-y-4 pt-6 md:pt-12 pb-4 md:pb-8">
        <div className="p-3 md:p-4 bg-[#38bdf8]/10 rounded-full">
           <MapPin className="w-8 h-8 md:w-12 md:h-12 text-[#38bdf8]" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">رهگیری محموله</h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-sm mx-auto">شماره پیگیری (مثلاً LS-9801) را وارد کنید.</p>
        
        <form onSubmit={handleTrack} className="w-full max-w-xl flex flex-col sm:flex-row gap-2 mt-4">
           <Input 
             placeholder="LS-XXXX" 
             className="h-12 md:h-14 bg-slate-900 border-slate-800 text-center text-xl md:text-2xl font-mono tracking-widest focus-visible:ring-[#38bdf8]/50 rounded-xl"
             value={trackingId}
             onChange={(e) => setTrackingId(e.target.value)}
           />
           <Button type="submit" className="h-12 md:h-14 px-8 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-black rounded-xl">رهگیری</Button>
        </form>
      </div>

      {activeShipment ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-[#0f172a] border-[#1e293b] border-t-4 border-t-[#38bdf8] shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6">
               <div className="text-center sm:text-right">
                  <Badge variant="outline" className="mb-2 text-[#38bdf8] border-[#38bdf8]/30 font-bold px-3">محموله فعال</Badge>
                  <CardTitle className="text-2xl md:text-3xl font-mono text-white leading-none">{activeShipment.trackingNumber}</CardTitle>
                  <CardDescription className="font-bold text-slate-500 text-xs mt-2 uppercase tracking-wide">Container: {activeShipment.containerNumber}</CardDescription>
               </div>
               <div className="text-center sm:text-left flex flex-col sm:items-start bg-[#1e293b]/50 p-3 rounded-xl border border-[#334155]/30">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Estimated Arrival</span>
                  <span className="text-xl font-black text-[#38bdf8]">{activeShipment.estimatedDelivery}</span>
               </div>
            </CardHeader>
            <CardContent className="space-y-8 px-4 sm:px-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-[#1e293b]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center shrink-0"><Ship className="w-5 h-5 text-slate-400" /></div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-0.5">Origin Port</span>
                        <span className="text-lg font-black text-slate-100 truncate">{activeShipment.origin}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-row-reverse">
                     <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center shrink-0"><Truck className="w-5 h-5 text-slate-400" /></div>
                     <div className="flex flex-col sm:text-left min-w-0">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-0.5">Final Destination</span>
                        <span className="text-lg font-black text-slate-100 truncate">{activeShipment.destination}</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h4 className="font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        وضعیت پیشرفت
                     </h4>
                     <span className="text-xs font-mono text-slate-400">{Math.round(progressPercent)}% تکمیل شده</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-slate-800" />
               </div>

               <div className="relative space-y-0">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="flex gap-4 min-h-[80px]">
                       <div className="flex flex-col items-center relative">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-4 flex items-center justify-center z-10",
                            step.status === "COMPLETED" ? "bg-primary border-primary/20 text-white" : 
                            step.status === "IN_PROGRESS" ? "bg-slate-900 border-primary animate-pulse" : "bg-slate-950 border-slate-800"
                          )}>
                             {step.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          {idx !== steps.length - 1 && (
                            <div className={cn("w-0.5 h-full absolute top-6", step.status === "COMPLETED" ? "bg-primary/30" : "bg-slate-800")} />
                          )}
                       </div>
                       <div className="flex-1 pb-8">
                          <h5 className={cn("text-sm font-bold", step.status === "PENDING" ? "text-slate-600" : "text-white")}>{step.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                             {step.status === "COMPLETED" ? (
                               <span className="text-[10px] text-green-500 font-bold">تکمیل شده در {step.completedAt}</span>
                             ) : step.status === "IN_PROGRESS" ? (
                               <span className="text-[10px] text-primary font-black uppercase tracking-tighter">در حال پردازش عملیاتی...</span>
                             ) : (
                               <span className="text-[10px] text-slate-700">برنامه‌ریزی شده</span>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
             <ShieldCheck className="w-4 h-4 text-slate-500" />
             <span className="text-[10px] text-slate-500 uppercase tracking-widest">Logisharp Verified Connection Service</span>
          </div>
        </div>
      ) : trackingId && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
           <div className="p-4 bg-red-500/10 rounded-xl mb-4">
              <Package className="w-12 h-12 text-red-500 opacity-50" />
           </div>
           <p className="text-xl font-bold text-red-100">محموله‌ای با این کد یافت نشد</p>
           <p className="text-sm text-slate-500 mt-2">لطفاً شماره پیگیری خود را مجدداً بررسی کنید.</p>
        </div>
      )}
    </div>
  );
}
