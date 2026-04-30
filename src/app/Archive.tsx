import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Archive, 
  Ship, 
  CreditCard, 
  FileText, 
  Search, 
  ArrowLeft,
  Filter,
  Calendar,
  Layers,
  History,
  MoreVertical,
  RotateCcw,
  Trash2,
  ExternalLink,
  Lock,
  Shield,
  Zap
} from "lucide-react";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ArchivePage() {
  const { 
    shipments, 
    cheques, 
    documents, 
    unarchiveShipment, 
    unarchiveCheque, 
    unarchiveDocument, 
    permanentDeleteShipment, 
    permanentDeleteCheque, 
    permanentDeleteDocument 
  } = useMockStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("shipments");

  const archivedShipments = shipments.filter(s => s.isArchived);
  const archivedCheques = cheques.filter(c => c.status === "ARCHIVED");
  const archivedDocuments = documents.filter(d => d.isArchived);

  const totalArchivedCount = archivedShipments.length + archivedCheques.length + archivedDocuments.length;

  const getFilteredItems = () => {
    switch(activeCategory) {
      case "shipments":
        return archivedShipments.filter(s => 
          s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.containerNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "cheques":
        return archivedCheques.filter(c => 
          c.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.chequeNumber.includes(searchTerm) ||
          c.receiver.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "documents":
        return archivedDocuments.filter(d => 
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="relative p-2 md:p-8 space-y-6 md:space-y-10 bg-[#020617] min-h-screen text-slate-100 font-sans overflow-hidden" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header with Glassmorphism */}
      <div className="relative group z-10 mx-2 md:mx-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[1.5rem] md:rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 md:p-8 bg-slate-900/40 border border-slate-800/50 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-xl">
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-all">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-slate-400 rotate-180 md:rotate-0" />
              </Button>
            </Link>
            <div className="relative ring-1 ring-amber-500/30 p-3 md:p-5 bg-amber-500/5 rounded-2xl md:rounded-3xl shadow-2xl shadow-amber-500/10">
              <Archive className="w-6 h-6 md:w-10 md:h-10 text-amber-500" />
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-7 md:h-7 bg-amber-500 text-slate-950 text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 md:border-4 border-[#020617] shadow-lg">
                {totalArchivedCount}
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-5xl font-black tracking-tighter text-white mb-0.5 md:mb-2 italic">بایگانی <span className="text-amber-500">سرد</span></h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[7px] md:text-[9px] font-black h-5 md:h-6 flex gap-1 items-center px-1 md:px-2">
                  <Shield className="w-2 md:w-3 h-2 md:h-3" />
                  VAULT v2.4
                </Badge>
                <p className="text-slate-500 text-[10px] md:text-sm font-bold truncate max-w-[120px] md:max-w-none">مدیریت دارایی‌های لجستیکی</p>
              </div>
            </div>
          </div>

          <div className="relative group w-full md:max-w-md">
            <div className="absolute inset-0 bg-amber-500/5 rounded-2xl md:rounded-3xl blur-md group-focus-within:bg-amber-500/10 transition-all" />
            <Search className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-500 group-focus-within:text-amber-500 transition-all duration-300 z-10" />
            <Input 
              placeholder="جستجوی پیشرفته..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative bg-slate-950/50 border-slate-800 h-12 md:h-16 rounded-2xl md:rounded-3xl pr-11 md:pr-14 text-xs md:text-sm font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all shadow-inner z-20 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories & Actions */}
      <Tabs defaultValue="shipments" onValueChange={setActiveCategory} className="w-full space-y-6 md:space-y-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-8 mx-2 md:mx-0">
          <TabsList className="bg-slate-900/30 p-1 md:p-2 rounded-2xl md:rounded-[2rem] h-14 md:h-20 border border-slate-800/50 grid grid-cols-3 gap-2 md:gap-3 w-full lg:max-w-2xl">
            {[
              { val: "shipments", label: "محموله", icon: Ship, count: archivedShipments.length, color: "text-blue-400" },
              { val: "cheques", label: "چک", icon: CreditCard, count: archivedCheques.length, color: "text-emerald-400" },
              { val: "documents", label: "اسناد", icon: FileText, count: archivedDocuments.length, color: "text-amber-400" },
            ].map(tab => (
              <TabsTrigger 
                key={tab.val}
                value={tab.val}
                className="rounded-xl md:rounded-2xl flex items-center justify-center gap-1.5 md:gap-3 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 transition-all duration-500 font-black text-[10px] md:text-xs hover:bg-slate-800/50 px-1"
              >
                <tab.icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4", tab.color, "data-[state=active]:text-slate-950")} />
                <span className="truncate">{tab.label}</span>
                <Badge className="mr-0.5 md:mr-1 h-4 md:h-6 min-w-[16px] md:min-w-[24px] px-1 md:px-1.5 flex items-center justify-center text-[8px] md:text-[10px] bg-slate-950/40 text-slate-400 border-slate-800 group-data-[state=active]:bg-slate-950 group-data-[state=active]:text-white">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
             <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-black text-slate-400 bg-slate-900/60 px-3 md:pl-5 md:pr-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-slate-800 shadow-xl">
                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <span>پایدار</span>
             </div>
             <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-black text-slate-400 bg-slate-900/60 px-3 md:pl-5 md:pr-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-slate-800 shadow-xl">
                <History className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                <span>پاکسازی شده</span>
             </div>
          </div>
        </div>

        {/* Categories Content with improved Card Layout */}
        <div className="min-h-[400px] px-2 md:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
            >
              {filteredItems.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-32 px-6 bg-slate-900/10 border border-slate-800/50 rounded-[2rem] md:rounded-[4rem] text-center backdrop-blur-sm">
                  <div className="relative mb-6 md:mb-10 overflow-hidden rounded-full p-6 md:p-8 bg-slate-950 ring-1 ring-slate-800">
                    <Archive className="w-12 h-12 md:w-20 md:h-20 text-slate-800 opacity-30 animate-pulse" />
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-amber-500/5 to-transparent"></div>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-200 mb-1 md:mb-2">موردی یافت نشد</h3>
                  <p className="text-slate-500 font-bold text-xs md:text-sm max-w-xs mx-auto">جستجوی خود را تغییر دهید.</p>
                </div>
              ) : (
                filteredItems.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card className="group relative bg-[#0f172a]/40 border-slate-800 hover:border-amber-500/30 transition-all duration-500 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-amber-500/10 h-full flex flex-col backdrop-blur-md">
                      <div className="absolute top-0 right-1/2 translate-x-1/2 w-16 md:w-32 h-1 bg-amber-500/10 rounded-full group-hover:bg-amber-500/40 transition-colors" />
                      
                      <CardHeader className="p-5 md:p-8 relative">
                        <div className="flex items-start justify-between gap-3 md:gap-4">
                          <div className="flex items-center gap-3 md:gap-5">
                            <div className={cn(
                                "w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] border flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg bg-slate-900/80",
                                activeCategory === "shipments" ? "border-blue-500/20 text-blue-400" :
                                activeCategory === "cheques" ? "border-emerald-500/20 text-emerald-400" :
                                "border-amber-500/20 text-amber-500"
                            )}>
                              {activeCategory === "shipments" && <Ship className="w-5 h-5 md:w-8 md:h-8" />}
                              {activeCategory === "cheques" && <CreditCard className="w-5 h-5 md:w-8 md:h-8" />}
                              {activeCategory === "documents" && <FileText className="w-5 h-5 md:w-8 md:h-8" />}
                            </div>
                            <div className="space-y-0.5 md:space-y-1.5">
                              <h3 className="font-black text-white text-base md:text-xl group-hover:text-amber-500 transition-colors leading-tight">
                                {activeCategory === "shipments" ? item.trackingNumber : 
                                 activeCategory === "cheques" ? item.bankName : item.name}
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/10 text-[6px] md:text-[7px] font-black px-1 md:px-1.5 h-3.5 md:h-4 uppercase tracking-tighter">Sealed</Badge>
                                <p className="text-[8px] md:text-[10px] text-slate-500 font-bold tracking-tighter uppercase line-clamp-1">
                                  {activeCategory === "shipments" ? item.customerName :
                                   activeCategory === "cheques" ? `ID: ${item.chequeNumber}` :
                                   `${item.type}`}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                             <Lock className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-5 md:px-8 py-1 md:py-2 flex-1 space-y-4 md:space-y-6 relative">
                        <div className="grid grid-cols-2 gap-3 md:gap-6 bg-slate-950/40 p-3 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800/30">
                           <div className="space-y-0.5 md:space-y-1.5 border-l border-slate-800/50 pl-2">
                              <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                 <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                 تاریخ
                              </span>
                              <p className="text-[10px] md:text-xs font-black text-slate-300">{item.createdAt.split('T')[0]}</p>
                           </div>
                           <div className="space-y-0.5 md:space-y-1.5 pr-2">
                              <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                 <Layers className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                 شناسه
                              </span>
                              <p className="text-[9px] md:text-[10px] font-mono font-bold text-slate-500 truncate">{item.id}</p>
                           </div>
                        </div>

                        {activeCategory === "cheques" && (
                          <div className="p-3 md:p-5 bg-emerald-500/5 rounded-2xl md:rounded-3xl border border-emerald-500/10 flex flex-col items-center gap-0.5 md:gap-1">
                             <span className="text-[8px] md:text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">ارزش نهایی</span>
                             <span className="text-sm md:text-lg font-black text-emerald-400">{item.amount?.toLocaleString()} <span className="text-[9px] md:text-[10px] text-emerald-600 mr-1">ريال</span></span>
                          </div>
                        )}
                      </CardContent>

                      <div className="p-4 md:p-6 bg-slate-950/60 border-t border-slate-800/30 flex items-center justify-between">
                         <div className="flex gap-1.5 md:gap-2.5">
                            <Button 
                             variant="outline" 
                             size="icon" 
                             className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-2xl bg-emerald-500/5 hover:bg-emerald-500 hover:text-slate-950 border-emerald-500/20 text-emerald-500 transition-all" 
                             onClick={() => {
                               if (activeCategory === "shipments") unarchiveShipment(item.id);
                               else if (activeCategory === "cheques") unarchiveCheque(item.id, "CLEARED");
                               else if (activeCategory === "documents") unarchiveDocument(item.id);
                               toast.success("بازگردانی شد");
                             }}
                            >
                               <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                            <Button 
                             variant="outline" 
                             size="icon" 
                             className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-2xl bg-rose-500/5 hover:bg-rose-500 hover:text-slate-950 border-rose-500/20 text-rose-500 transition-all" 
                             onClick={() => {
                               if (window.confirm("حذف دائمی غیرقابل بازگشت است. ادامه می‌دهید؟")) {
                                 if (activeCategory === "shipments") permanentDeleteShipment(item.id);
                                 else if (activeCategory === "cheques") permanentDeleteCheque(item.id);
                                 else if (activeCategory === "documents") permanentDeleteDocument(item.id);
                                 toast.error("حذف دائمی شد");
                               }
                             }}
                            >
                               <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                         </div>
                         <Button variant="ghost" className="h-8 md:h-10 text-[9px] md:text-[10px] font-black text-slate-400 hover:text-amber-500 flex items-center gap-1.5 md:gap-2 hover:bg-amber-500/5 rounded-lg md:rounded-xl px-2 md:px-4 transition-all">
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span className="hidden xs:inline">جزئیات</span>
                         </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      {/* Security Info Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-6 md:pt-10 border-t border-slate-800/50 gap-4 md:gap-6 pb-20 md:pb-0 mx-2 md:mx-0">
        <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest text-center md:text-right">© ۱۴۰۳ سیستم بایگانی هوشمند | پروتکل VAULT</p>
        <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
                بک‌آپ: بروز
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold text-slate-500">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                سرور: متصل
            </div>
        </div>
      </div>
    </div>
  );
}
