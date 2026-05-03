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
  const { shipments, shipmentSteps, documents } = useMockStore();
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
    if (!trackingId) return;
    
    setIsSearching(true);
    setActiveShipment(null);
    
    setTimeout(() => {
      const found = shipments.find(s => s.trackingNumber === trackingId.toUpperCase());
      setActiveShipment(found || null);
      setIsSearching(false);
    }, 1200);
  };

  const steps = activeShipment ? shipmentSteps.filter(s => s.shipmentId === activeShipment.id) : [];
  const shipmentDocuments = activeShipment ? documents.filter(d => d.shipmentId === activeShipment.id && !d.isArchived) : [];
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

  const handleShare = () => {
    if (activeShipment) {
      const url = `${window.location.origin}/track?q=${activeShipment.trackingNumber}`;
      navigator.clipboard.writeText(url);
      import("sonner").then(({ toast }) => {
        toast.success("لینک رهگیری کپی شد", {
           description: "می‌توانید این لینک را برای مشتری ارسال کنید.",
           position: "bottom-right"
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 md:pb-10" dir="rtl">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden pt-12 md:pt-24 pb-16 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#38bdf8] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-[10px] font-black tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            سامانه هوشمند رهگیری لجستیک
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
          >
            مسیر محموله را <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-blue-400 to-purple-400">هوشمندانه</span> دنبال کنید
          </motion.h1>
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-medium"
          >
            دسترسی لحظه‌ای به موقعیت کانتینر، مستندات ترخیص و زمان تقریبی تحویل (ETA) با استفاده از سامانه رهگیری یکپارچه لوجی‌شارپ.
          </motion.p>
          
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleTrack} 
            className="w-full max-w-xl flex flex-col sm:flex-row gap-3 mx-auto mt-12 bg-slate-900/60 backdrop-blur-2xl p-2.5 rounded-[2.5rem] border border-slate-800/50 shadow-2xl ring-1 ring-white/5"
          >
             <div className="relative flex-1 group">
               <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
               <Input 
                 placeholder="مثال: LS-9801" 
                 className="h-16 bg-transparent border-none text-right pr-14 text-2xl font-black tracking-widest focus-visible:ring-0 text-white placeholder:text-slate-700"
                 value={trackingId}
                 onChange={(e) => setTrackingId(e.target.value)}
               />
             </div>
             <Button 
               type="submit" 
               disabled={isSearching || !trackingId}
               className="h-16 px-10 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] hover:brightness-110 text-slate-950 font-black rounded-[2rem] transition-all shadow-[0_10px_30px_rgba(56,189,248,0.3)] disabled:opacity-50 text-base"
             >
               {isSearching ? (
                 <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-3 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                   در حال پایش...
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span>رهگیری زنده</span>
                   <Layers className="w-5 h-5" />
                 </div>
               )}
             </Button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {activeShipment ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Main Status Header Card */}
              <Card className="bg-slate-900/50 border-slate-800/80 rounded-[3rem] overflow-hidden group shadow-3xl relative backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#38bdf8] via-purple-500 to-[#38bdf8] bg-[length:200%_auto] animate-gradient-scroll" />
                
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20 font-black text-[11px] px-4 py-1 rounded-full uppercase tracking-widest">
                          {activeShipment.status === 'DELIVERED' ? 'تحویل نهایی' : 'عملیات فعال'}
                        </Badge>
                        <div className="h-6 w-px bg-slate-800" />
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Clock className="w-3 h-3" />
                          آخرین بروزرسانی: زمان حال
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                        {activeShipment.trackingNumber}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-10 h-10 rounded-xl bg-slate-800/50 text-slate-500 hover:text-white"
                          onClick={handleShare}
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="text-left">
                          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">نام کشتی / شماره سفر</span>
                          <span className="block text-sm font-bold text-slate-300">MSC VALERIA / 142E</span>
                       </div>
                       <div className="w-16 h-16 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 flex items-center justify-center shadow-inner">
                         <Ship className="w-8 h-8 text-[#38bdf8]" />
                       </div>
                    </div>
                  </div>

                  {/* Route Visualization */}
                  <div className="relative py-12 px-6">
                    <div className="absolute top-1/2 left-[60px] right-[60px] h-[4px] bg-slate-800/50 -translate-y-1/2 rounded-full" />
                    
                    <div className="absolute top-1/2 left-[60px] right-[60px] h-[4px] -translate-y-1/2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute right-0 h-full bg-gradient-to-l from-[#38bdf8] via-blue-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center relative z-10">
                      {/* Origin Node */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[#020617] border-2 border-[#38bdf8] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] ring-4 ring-[#38bdf8]/10 group-hover:scale-110 transition-transform">
                          <Anchor className="w-8 h-8 text-[#38bdf8]" />
                        </div>
                        <div className="text-center space-y-1">
                          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter">بندر بارگیری</span>
                          <span className="block text-lg font-black text-white">{activeShipment.origin}</span>
                        </div>
                      </div>

                      {/* Current Status Icon (Floating) */}
                      {progressPercent > 10 && progressPercent < 90 && (
                        <motion.div 
                          className="absolute top-12 -translate-y-1/2"
                          style={{ right: `${progressPercent}%` }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative translate-x-1/2">
                            <Ship className="w-6 h-6 text-blue-600" />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                          </div>
                        </motion.div>
                      )}

                      {/* Destination Node */}
                      <div className="flex flex-col items-center gap-4">
                        <div className={cn(
                          "w-16 h-16 bg-[#020617] border-2 rounded-3xl flex items-center justify-center transition-all duration-700 ring-4 group-hover:scale-110",
                          progressPercent >= 100 
                            ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-emerald-500/10" 
                            : "border-slate-800 ring-transparent grayscale opacity-50"
                        )}>
                          <MapPin className={cn("w-8 h-8", progressPercent >= 100 ? "text-emerald-500" : "text-slate-700")} />
                        </div>
                        <div className="text-center space-y-1">
                          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter">مقصد نهایی</span>
                          <span className="block text-lg font-black text-white">{activeShipment.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Technical Specs */}
                  <div className="mt-16 pt-10 border-t border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">شماره کانتینر</span>
                       </div>
                       <span className="text-sm font-mono font-bold text-white block bg-slate-950/50 p-2 rounded-lg border border-slate-800/30">{activeShipment.containerNumber}</span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">نوع کانتینر</span>
                       </div>
                       <span className="text-sm font-bold text-slate-300 block bg-slate-950/50 p-2 rounded-lg border border-slate-800/30">{getContainerType(activeShipment.containerNumber)}</span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">وزن ناخالص</span>
                       </div>
                       <span className="text-sm font-bold text-slate-300 block bg-slate-950/50 p-2 rounded-lg border border-slate-800/30">۲۲,۴۵۰ کیلوگرم <span className="text-[9px] text-slate-600">(خالص: ۲۱,۸۰۰)</span></span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">حجم محموله</span>
                       </div>
                       <span className="text-sm font-bold text-slate-300 block bg-slate-950/50 p-2 rounded-lg border border-slate-800/30">۶۷.۸۰۰ CBM</span>
                     </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Timeline & ETA */}
                <div className="lg:col-span-8 space-y-8">
                   {/* ETA Card */}
                   <Card className="bg-gradient-to-br from-blue-600 to-[#38bdf8] border-none rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                           <span className="text-[11px] font-black uppercase tracking-widest opacity-80">تاریخ تخمینی تحویل</span>
                           <h4 className="text-5xl md:text-6xl font-black tracking-tighter">{activeShipment.estimatedDelivery}</h4>
                           <p className="text-sm font-medium opacity-70">زمان تقریبی تحویل بر اساس سرعت عملیات و فاصله کنونی برآورد شده است.</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 text-center min-w-[140px]">
                           <span className="block text-[10px] font-black uppercase opacity-70 mb-1">پیشرفت ترانزیت</span>
                           <span className="text-3xl font-black">{Math.round(progressPercent)}%</span>
                        </div>
                      </div>
                   </Card>

                   {/* Movement History */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-6">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                           <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl"><Layers className="w-5 h-5 text-[#38bdf8]" /></div>
                           تاریخچه دقیق عملیات
                        </h3>
                      </div>

                      <div className="relative pr-4">
                        {/* Timeline Vertical Line */}
                        <div className="absolute right-[33.5px] top-4 bottom-8 w-px bg-gradient-to-b from-[#38bdf8] via-slate-800 to-transparent" />
                        
                        <div className="space-y-8">
                          {steps.map((step, idx) => (
                            <motion.div 
                              key={step.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * idx }}
                              className="relative"
                            >
                               {/* Milestone Dot */}
                               <div className={cn(
                                 "absolute right-[21px] top-5 w-6.5 h-6.5 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500",
                                 step.status === "COMPLETED" ? "bg-[#38bdf8] border-[#38bdf8]/20 text-slate-950" : 
                                 step.status === "IN_PROGRESS" ? "bg-slate-950 border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "bg-slate-950 border-slate-800"
                               )}>
                                  {step.status === "COMPLETED" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <div className={cn("w-1.5 h-1.5 rounded-full", step.status === "IN_PROGRESS" ? "bg-[#38bdf8] animate-ping" : "bg-slate-800")} />
                                  )}
                               </div>

                               <div className="pr-16">
                                  <div className={cn(
                                    "p-6 rounded-[2.5rem] border transition-all duration-500 group",
                                    step.status === "COMPLETED" ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700" : 
                                    step.status === "IN_PROGRESS" ? "bg-[#38bdf8]/5 border-[#38bdf8]/30" : "bg-transparent border-transparent opacity-40"
                                  )}>
                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                        <div className="space-y-1">
                                          <h5 className={cn("text-lg font-black transition-colors", step.status === "PENDING" ? "text-slate-600" : "text-white")}>
                                            {step.name}
                                          </h5>
                                          <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">وضعیت عملیات</span>
                                            <Badge variant="ghost" className={cn(
                                              "text-[9px] font-black h-4 px-2",
                                              step.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/5" : 
                                              step.status === "IN_PROGRESS" ? "text-[#38bdf8] bg-[#38bdf8]/5" : "text-slate-600"
                                            )}>
                                              {step.status === "COMPLETED" ? "تکمیل شده" : step.status === "IN_PROGRESS" ? "در حال پردازش" : "در انتظار"}
                                            </Badge>
                                          </div>
                                        </div>
                                        {step.completedAt && (
                                          <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">زمان ثبت</span>
                                            <span className="text-xs font-mono font-bold text-[#38bdf8]">{step.completedAt}</span>
                                          </div>
                                        )}
                                     </div>
                                     
                                     {step.notes && (
                                       <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/50 text-xs text-slate-400 font-medium leading-relaxed group-hover:bg-slate-950 transition-colors">
                                         {step.notes}
                                       </div>
                                     )}
                                  </div>
                               </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Docs & QR */}
                <div className="lg:col-span-4 space-y-8">
                   <Card id="documents-section" className="bg-slate-900/30 border-slate-800/80 rounded-[3rem] p-8 space-y-8 backdrop-blur-sm sticky top-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">اسناد محموله</h4>
                          <p className="text-[10px] text-slate-500 font-medium">مستندات نهایی و فایل‌های ضمیمه</p>
                        </div>
                        <Badge className="bg-blue-500/10 text-[#38bdf8] border-none text-[11px] h-6 font-black">{shipmentDocuments.length.toLocaleString('fa-IR')} فایل</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {shipmentDocuments.length > 0 ? (
                          shipmentDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-800/20 border border-slate-800/50 hover:border-[#38bdf8]/40 hover:bg-slate-800/40 transition-all group cursor-default">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[1rem] bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform">
                                  <Download className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs font-black text-slate-200 line-clamp-1">{doc.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{doc.fileSize} • فایل {doc.type.toUpperCase()}</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-9 h-9 rounded-xl text-slate-600 hover:text-[#38bdf8] hover:bg-[#38bdf8]/5"
                                onClick={() => {
                                  import("sonner").then(({ toast }) => {
                                    toast.success("آماده‌سازی فایل...", {
                                      description: `سند ${doc.name} در حال فشرده‌سازی و دانلود است.`,
                                      position: "bottom-right"
                                    });
                                  });
                                }}
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/20">
                             <Info className="w-10 h-10 mb-3 text-slate-700" />
                             <span className="text-xs font-bold text-slate-600">هنوز سندی پیوست نشده است</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-8 border-t border-slate-800/50">
                        <div className="bg-slate-950/80 p-6 rounded-[2.5rem] space-y-6 text-center border border-slate-800 shadow-inner">
                           <div className="w-14 h-14 bg-[#38bdf8]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#38bdf8]/20">
                             <QrCode className="w-7 h-7 text-[#38bdf8]" />
                           </div>
                           <div className="space-y-1">
                             <h5 className="text-base font-black text-white">کیف پول مدارک</h5>
                             <p className="text-[10px] text-slate-500 leading-relaxed">با اسکن این کد می‌توانید تمام مدارک این محموله را در موبایل خود داشته باشید.</p>
                           </div>
                           <div className="bg-white p-3 rounded-[2rem] w-36 h-36 mx-auto group-hover:scale-105 transition-transform">
                              <div className="w-full h-full bg-slate-50 rounded-[1.5rem] border-2 border-slate-100 flex items-center justify-center">
                                 <QrCode className="w-16 h-16 text-slate-300" />
                              </div>
                           </div>
                        </div>
                      </div>
                   </Card>
                </div>
              </div>
            </motion.div>
          ) : trackingId && !isSearching ? (
            <motion.div 
              key="no-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 px-8 bg-slate-900/30 rounded-[4rem] border-2 border-dashed border-slate-800/80"
            >
               <div className="w-28 h-28 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-rose-500/5">
                  <AlertCircle className="w-14 h-14 text-rose-500/60" />
               </div>
               <h3 className="text-3xl font-black text-white mb-3">یافت نشد!</h3>
               <p className="text-slate-500 text-center max-w-sm mb-10 font-medium leading-relaxed">
                 محموله‌ای با کد <span className="text-rose-400 font-mono font-bold tracking-widest mx-1 bg-rose-500/10 px-2 py-0.5 rounded">{trackingId.toUpperCase()}</span> در سیستم یافت نشد. لطفاً شماره رهگیری را مجدداً بررسی کنید.
               </p>
               <Button 
                variant="outline" 
                onClick={() => setTrackingId("")}
                className="h-14 px-10 border-slate-800 bg-slate-900 text-slate-300 rounded-2xl font-black hover:bg-slate-800 transition-all"
               >
                 بازگشت و تلاش مجدد
               </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-10"
            >
               <div className="relative">
                 <Package className="w-48 h-48 text-slate-800/40 stroke-[0.5]" />
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                 >
                   <div className="w-4 h-4 bg-[#38bdf8] rounded-full blur-md opacity-50" />
                 </motion.div>
               </div>
               <div className="text-center space-y-3">
                 <p className="text-xl font-black text-slate-700 tracking-[0.3em] uppercase">آماده برای پایش</p>
                 <p className="text-sm text-slate-800 max-w-xs font-bold leading-relaxed">شناسه محموله را وارد کنید تا پارامترهای عملیاتی بارگزاری شود.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-4 border-t border-slate-800/40 py-12 text-center flex flex-col items-center gap-6">
         <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[#1e293b]/50" />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">بیش از ۲۰۰۰ شرکت روزانه ما را انتخاب می‌کنند</span>
         </div>
         <div className="flex items-center gap-3 opacity-50">
            <ShieldCheck className="w-6 h-6 text-[#38bdf8]" />
            <span className="text-[11px] font-black uppercase text-slate-300 tracking-[0.1em]">زیرساخت رهگیری تایید شده</span>
         </div>
         <p className="text-[11px] text-slate-700 max-w-md mx-auto leading-relaxed">
            سامانه رهگیری لوجی‌شارپ با استفاده از پروتکل‌های امنیتی روز دنیا از اطلاعات تجاری شما محافظت می‌کند. تمامی حقوق متعلق به لوجی‌شارپ است.
         </p>
      </div>
    </div>
  );
}
