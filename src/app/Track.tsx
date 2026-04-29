import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  Search, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Ship, 
  Truck, 
  Anchor, 
  Globe, 
  Info,
  Layers,
  PhoneCall,
  Download,
  QrCode,
  Share2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";

export default function Track() {
  const { shipments, shipmentSteps } = useMockStore();
  const location = useLocation();
  const [trackingId, setTrackingId] = useState("");
  const [activeShipment, setActiveShipment] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setTrackingId(q);
      const found = shipments.find(s => s.trackingNumber === q.toUpperCase());
      if (found) {
        setIsSearching(true);
        setTimeout(() => {
          setActiveShipment(found);
          setIsSearching(false);
        }, 800);
      }
    }
  }, [location.search, shipments]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setActiveShipment(null);
    
    setTimeout(() => {
      const found = shipments.find(s => s.trackingNumber === trackingId.toUpperCase());
      setActiveShipment(found || null);
      setIsSearching(false);
    }, 800);
  };

  const steps = activeShipment ? shipmentSteps.filter(s => s.shipmentId === activeShipment.id) : [];
  const completedCount = steps.filter(s => s.status === "COMPLETED").length;
  let progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (activeShipment?.status === 'DELIVERED') progressPercent = 100;
  else if (activeShipment?.status === 'CLEARED' && progressPercent < 85) progressPercent = 85;
  else if (activeShipment?.status === 'ARRIVED' && progressPercent < 60) progressPercent = 60;
  else if (activeShipment?.status === 'CUSTOMS' && progressPercent < 70) progressPercent = 75;

  const containerTypes: Record<string, string> = {
    "COSU": "40ft High Cube",
    "MSCU": "20ft Standard",
    "MAEU": "40ft Reefer",
    "ONEU": "20ft Open Top",
  };

  const getContainerType = (num: string) => {
    const prefix = num?.substring(0, 4);
    return containerTypes[prefix] || "Standard Container";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 md:pb-10" dir="rtl">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#38bdf8] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-[10px] font-black tracking-widest uppercase mb-4"
          >
            <Globe className="w-3 h-3" />
            Global Logistics Tracking System
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            محموله خود را در <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-purple-400">یک چشم بهم زدن</span> ببینید
          </motion.h1>
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium"
          >
            شماره رهگیری (Tracking Number) را وارد کنید تا از آخرین وضعیت عملیاتی، لوکیشن و زمان تحویل مطلع شوید.
          </motion.p>
          
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleTrack} 
            className="w-full max-w-xl flex flex-col sm:flex-row gap-3 mx-auto mt-10 bg-[#0f172a]/80 backdrop-blur-xl p-2 rounded-2xl border border-[#1e293b] shadow-2xl"
          >
             <div className="relative flex-1">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
               <Input 
                 placeholder="مثال: LS-9801" 
                 className="h-14 bg-transparent border-none text-right pr-12 text-xl font-black tracking-widest focus-visible:ring-0 text-white placeholder:text-slate-600"
                 value={trackingId}
                 onChange={(e) => setTrackingId(e.target.value)}
               />
             </div>
             <Button 
               type="submit" 
               disabled={isSearching}
               className="h-14 px-10 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] hover:from-[#0ea5e9] hover:to-[#38bdf8] text-[#020617] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50"
             >
               {isSearching ? (
                 <div className="flex items-center gap-2 text-xs">
                   <div className="w-4 h-4 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
                   در حال جستجو...
                 </div>
               ) : "رهگیری محموله"}
             </Button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {activeShipment ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Main Status Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Route Card */}
                <Card className="lg:col-span-2 bg-[#0f172a] border-[#1e293b] rounded-[2.5rem] overflow-hidden group shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38bdf8] via-purple-500 to-[#38bdf8] bg-[length:200%_auto] animate-gradient-x" />
                  
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-10">
                      <div className="space-y-1">
                        <Badge className="bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20 font-black text-[10px] px-3">
                          {activeShipment.status === 'DELIVERED' ? 'تحویل شده' : 'درحال حمل'}
                        </Badge>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                          {activeShipment.trackingNumber}
                          <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                        </h3>
                      </div>
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                         <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-[#1e293b] flex items-center justify-center"><Ship className="w-5 h-5 text-[#38bdf8]" /></div>
                         <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-[#1e293b] flex items-center justify-center"><Truck className="w-5 h-5 text-purple-400" /></div>
                      </div>
                    </div>

                    <div className="relative py-12 px-6">
                      {/* Background Line */}
                      <div className="absolute top-1/2 left-[48px] right-[48px] h-[2px] bg-slate-800 -translate-y-1/2" />
                      
                      {/* Active Progress Line */}
                      <div className="absolute top-1/2 left-[48px] right-[48px] h-[3px] -translate-y-1/2">
                        <div 
                          className="h-full bg-gradient-to-l from-[#38bdf8] to-purple-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between relative z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-[#020617] border-2 border-[#38bdf8] rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                            <Anchor className="w-6 h-6 text-[#38bdf8]" />
                          </div>
                          <div className="text-center">
                            <span className="block text-[11px] font-black text-slate-400 uppercase">مبداء</span>
                            <span className="block text-sm font-bold text-white">{activeShipment.origin}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 bg-[#020617] border-2 rounded-2xl flex items-center justify-center transition-all duration-500",
                            progressPercent >= 100 ? "border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "border-slate-800"
                          )}>
                            <MapPin className={cn("w-6 h-6", progressPercent >= 100 ? "text-[#38bdf8]" : "text-slate-700")} />
                          </div>
                          <div className="text-center">
                            <span className="block text-[11px] font-black text-slate-400 uppercase">مقصد نهایی</span>
                            <span className="block text-sm font-bold text-white">{activeShipment.destination}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#1e293b]/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="space-y-1">
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Container NO</span>
                         <span className="text-xs font-mono font-bold text-slate-300">{activeShipment.containerNumber}</span>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Type</span>
                         <span className="text-xs font-bold text-slate-300">{getContainerType(activeShipment.containerNumber)}</span>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Weight</span>
                         <span className="text-xs font-bold text-slate-300">22,450 KG</span>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Volume</span>
                         <span className="text-xs font-bold text-slate-300">67.8 CBM</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] border-none rounded-[2.5rem] p-8 text-[#020617] shadow-[0_10px_40px_rgba(56,189,248,0.2)]">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#020617]/10 rounded-xl"><Clock className="w-6 h-6" /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">زمان تحویل</span>
                      </div>
                      <div className="space-y-1">
                         <span className="text-5xl font-black">{activeShipment.estimatedDelivery}</span>
                      </div>
                      <div className="pt-4 border-t border-[#020617]/10 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>پیشرفت کلی</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2 bg-[#020617]/10" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#0f172a] border-[#1e293b] rounded-[2.5rem] p-6 shadow-xl space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">دسترسی سریع</h4>
                     <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex-col h-20 border-[#1e293b] bg-transparent hover:bg-[#38bdf8]/5 rounded-2xl gap-1 group">
                           <PhoneCall className="w-4 h-4 text-[#38bdf8]" />
                           <span className="text-[10px] font-black">پشتیبانی</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-20 border-[#1e293b] bg-transparent hover:bg-purple-500/5 rounded-2xl gap-1 group">
                           <Download className="w-4 h-4 text-purple-400" />
                           <span className="text-[10px] font-black">اسناد حمل</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-20 border-[#1e293b] bg-transparent hover:bg-emerald-500/5 rounded-2xl gap-1 group">
                           <QrCode className="w-4 h-4 text-emerald-400" />
                           <span className="text-[10px] font-black">پاسپورت</span>
                        </Button>
                        <Button variant="outline" className="flex-col h-20 border-[#1e293b] bg-transparent hover:bg-orange-500/5 rounded-2xl gap-1 group">
                           <Share2 className="w-4 h-4 text-orange-400" />
                           <span className="text-[10px] font-black">اشتراک‌گذاری</span>
                        </Button>
                     </div>
                  </Card>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
                <div className="lg:col-span-8 space-y-8">
                   <div className="flex items-center justify-between px-4">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                         <div className="p-2 bg-[#1e293b] rounded-xl"><Layers className="w-5 h-5 text-[#38bdf8]" /></div>
                         تاریخچه جابجایی
                      </h3>
                   </div>

                   <div className="relative px-2">
                     <div className="absolute right-[31px] top-6 bottom-0 w-px bg-gradient-to-b from-[#38bdf8]/50 via-[#1e293b] to-transparent" />
                     
                     <div className="space-y-8">
                       {steps.map((step, idx) => (
                         <motion.div 
                           key={step.id}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.1 * idx }}
                           className="relative"
                         >
                            <div className={cn(
                              "absolute right-[19.5px] top-4 w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500",
                              step.status === "COMPLETED" ? "bg-[#38bdf8] border-[#38bdf8]/20 text-[#020617]" : 
                              step.status === "IN_PROGRESS" ? "bg-[#020617] border-[#38bdf8] animate-pulse" : "bg-slate-900 border-slate-800"
                            )}>
                               {step.status === "COMPLETED" ? (
                                 <CheckCircle2 className="w-3 h-3" />
                               ) : (
                                 <div className={cn("w-1.5 h-1.5 rounded-full", step.status === "IN_PROGRESS" ? "bg-[#38bdf8]" : "bg-slate-700")} />
                               )}
                            </div>

                            <div className="pr-16">
                               <div className={cn(
                                 "p-6 rounded-[2rem] border transition-all duration-500 group",
                                 step.status === "COMPLETED" ? "bg-[#1e293b]/40 border-[#1e293b]" : 
                                 step.status === "IN_PROGRESS" ? "bg-[#38bdf8]/5 border-[#38bdf8]/30 border-dashed" : "bg-transparent border-transparent opacity-50"
                               )}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                     <h5 className={cn("text-base font-black transition-colors", step.status === "PENDING" ? "text-slate-600" : "text-white group-hover:text-[#38bdf8]")}>
                                       {step.name}
                                     </h5>
                                     {step.completedAt && (
                                       <span className="text-[10px] font-mono text-slate-500">
                                         {step.completedAt}
                                       </span>
                                     )}
                                  </div>
                                  
                                  {step.notes && (
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed bg-[#020617]/30 p-4 rounded-xl mt-3 border border-[#1e293b]/50">
                                      {step.notes}
                                    </p>
                                  )}
                               </div>
                            </div>
                         </motion.div>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                   <Card className="bg-[#0f172a] border-[#1e293b] rounded-[2.5rem] p-8 space-y-6">
                      <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#334155]/50">
                        <QrCode className="w-8 h-8 text-[#38bdf8]" />
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="text-lg font-black text-white">پاسپورت دیجیتال</h4>
                        <p className="text-xs text-slate-500 font-medium">برای دریافت نسخه چاپی این کد را اسکن کنید.</p>
                      </div>
                      <div className="bg-white p-4 rounded-3xl w-40 h-40 mx-auto shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                         <div className="w-full h-full bg-slate-100 rounded-2xl border-4 border-slate-200 flex items-center justify-center">
                            <QrCode className="w-20 h-20 text-slate-400" />
                         </div>
                      </div>
                   </Card>
                </div>
              </div>
            </motion.div>
          ) : trackingId && !isSearching ? (
            <motion.div 
              key="no-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-8 bg-[#0f172a]/50 rounded-[3rem] border-2 border-dashed border-[#1e293b]"
            >
               <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
                  <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">محموله یافت نشد</h3>
               <p className="text-slate-500 text-center max-w-sm mb-8 font-medium">
                 لطفاً از صحت شماره رهگیری اطمینان حاصل کنید.
               </p>
               <Button 
                variant="outline" 
                onClick={() => setTrackingId("")}
                className="h-12 px-8 border-[#1e293b] bg-[#0f172a] text-slate-400 rounded-xl font-bold"
               >
                 تلاش مجدد
               </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-20">
               <Package className="w-32 h-32 text-slate-600" />
               <p className="text-lg font-black text-slate-600 mt-6 tracking-widest uppercase">Waiting for ID</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-5xl mx-auto px-4 border-t border-[#1e293b]/30 py-10 text-center flex flex-col items-center gap-4">
         <div className="flex items-center gap-2 opacity-40">
            <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
            <span className="text-[10px] font-black uppercase text-slate-300">Logisharp Verified Service</span>
         </div>
         <p className="text-[10px] text-slate-600 max-w-md mx-auto">
           تمامی حقوق مادی و معنوی این سامانه متعلق به شرکت لوجی‌شارپ می‌باشد.
         </p>
      </div>
    </div>
  );
}
