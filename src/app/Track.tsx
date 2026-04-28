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
    <div className="p-6 h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4 pt-12 pb-8">
        <div className="p-4 bg-primary/10 rounded-full">
           <MapPin className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">رهگیری آنلاین محموله</h1>
        <p className="text-slate-400 max-w-md mx-auto">برای مشاهده وضعیت لحظه‌ای بار، شماره پیگیری ال‌اس (مثلاً LS-9801) را وارد کنید.</p>
        
        <form onSubmit={handleTrack} className="w-full max-w-xl flex gap-3 mt-4">
           <Input 
             placeholder="شماره پیگیری (LS-XXXX)" 
             className="h-14 bg-slate-900 border-slate-800 text-center text-2xl font-mono tracking-widest focus-visible:ring-primary/50"
             value={trackingId}
             onChange={(e) => setTrackingId(e.target.value)}
           />
           <Button type="submit" className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-bold">رهگیری</Button>
        </form>
      </div>

      {activeShipment ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-slate-900 border-slate-800 border-t-4 border-t-primary shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
               <div>
                  <Badge variant="outline" className="mb-2 text-primary border-primary/30">محموله فعال</Badge>
                  <CardTitle className="text-3xl font-mono text-white">{activeShipment.trackingNumber}</CardTitle>
                  <CardDescription className="font-medium text-slate-300 mt-1">کانتینر: {activeShipment.containerNumber}</CardDescription>
               </div>
               <div className="text-left flex flex-col items-start">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Estimated Delivery</span>
                  <span className="text-xl font-bold text-primary">{activeShipment.estimatedDelivery}</span>
               </div>
            </CardHeader>
            <CardContent className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-800">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-slate-800 rounded-xl"><Ship className="w-6 h-6 text-slate-400" /></div>
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">بندر مبدا</span>
                        <span className="text-xl font-black">{activeShipment.origin}</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 md:text-right md:justify-end">
                     <div className="flex flex-col md:items-end">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">بندر مقصد</span>
                        <span className="text-xl font-black">{activeShipment.destination}</span>
                     </div>
                     <div className="p-3 bg-slate-800 rounded-xl order-first md:order-last"><Truck className="w-6 h-6 text-slate-400" /></div>
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
