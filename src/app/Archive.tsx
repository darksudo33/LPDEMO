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
  ExternalLink
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

  // Unified filtering across all categories since tabs are removed
  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    
    const s = archivedShipments.filter(item => 
      item.trackingNumber.toLowerCase().includes(term) ||
      item.customerName.toLowerCase().includes(term)
    ).map(item => ({ ...item, type: "SHIPMENT" }));

    const c = archivedCheques.filter(item => 
      item.bankName.toLowerCase().includes(term) ||
      item.chequeNumber.includes(term)
    ).map(item => ({ ...item, type: "CHEQUE" }));

    const d = archivedDocuments.filter(item => 
      item.name.toLowerCase().includes(term)
    ).map(item => ({ ...item, type: "DOCUMENT" }));

    return [...s, ...c, ...d].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20" dir="rtl">
      {/* 1. Hero Section (Like Track.tsx) */}
      <div className="relative overflow-hidden pt-12 md:pt-20 pb-12 px-4 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-5 bg-amber-500/10 rounded-full border border-amber-500/20 shadow-xl shadow-amber-500/5 w-fit mx-auto mb-2"
          >
            <Archive className="w-10 h-10 text-amber-500" />
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
            >
              بایگانی <span className="text-amber-500">مرکزی</span> لوجی‌شارپ
            </motion.h1>
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium"
            >
              مدیریت و دسترسی سریع به تمامی اطلاعات، چک‌ها و اسناد بایگانی شده سالیان گذشته با سیستم جستجوی هوشمند
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative group w-full max-w-2xl mx-auto"
          >
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            <Input 
              placeholder="جستجو در آرشیو (شماره رهگیری، نام مشتری، مبلغ یا نام سند)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/80 backdrop-blur-xl border-slate-800 h-20 rounded-[2.5rem] pr-16 text-lg focus:ring-2 focus:ring-amber-500/30 transition-all font-bold shadow-2xl placeholder:text-slate-600"
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col items-center gap-8">
          {/* Info Box */}
          <div className="flex items-center gap-3 text-xs font-black text-slate-500 px-6 py-2.5 bg-slate-900/40 rounded-full border border-slate-800/50 shadow-lg">
            <History className="w-4 h-4 text-amber-500" />
            <span>آخرین بازدید آرشیو: لحظاتی پیش</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full mx-1" />
            <span>تعداد کل موارد: {archivedShipments.length + archivedCheques.length + archivedDocuments.length}</span>
          </div>

          {/* List Content - Unified Stream */}
          <div className="w-full min-h-full">
            <div className="flex flex-col gap-4 pb-20">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-slate-900/40 border-slate-800/80 hover:border-amber-500/20 transition-all rounded-3xl overflow-hidden group shadow-lg flex items-center p-3 md:p-5 relative">
                      {/* Left Accent Bar (now on the right for RTL) */}
                      <div className={cn(
                        "absolute right-0 top-0 bottom-0 w-1.5",
                        item.type === "SHIPMENT" ? "bg-amber-500/40" : 
                        item.type === "CHEQUE" ? "bg-emerald-500/40" : "bg-blue-500/40"
                      )} />
                      
                      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 flex-1 w-full">
                        {/* Icon Container */}
                        <div className={cn(
                          "w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner",
                          item.type === "SHIPMENT" ? "bg-amber-500/5 border-amber-500/10 text-amber-500" :
                          item.type === "CHEQUE" ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" :
                          "bg-blue-500/5 border-blue-500/10 text-blue-500"
                        )}>
                          {item.type === "SHIPMENT" && <Ship className="w-6 h-6" />}
                          {item.type === "CHEQUE" && <CreditCard className="w-6 h-6" />}
                          {item.type === "DOCUMENT" && <FileText className="w-6 h-6" />}
                        </div>

                        {/* Title and ID */}
                        <div className="text-center md:text-right flex-1 min-w-0">
                          <h3 className="text-lg font-black text-slate-100 truncate flex items-center justify-center md:justify-start gap-3">
                            {item.type === "SHIPMENT" ? item.trackingNumber : 
                             item.type === "CHEQUE" ? item.bankName : item.name}
                            <Badge variant="outline" className="hidden sm:inline-flex text-[9px] font-black border-slate-800 text-slate-500 py-0 px-2 h-5">
                              {item.type === "SHIPMENT" ? "محموله" : item.type === "CHEQUE" ? "چک" : "سند"}
                            </Badge>
                          </h3>
                          <p className="text-xs text-slate-500 font-bold mt-1.5 truncate">
                            {item.type === "SHIPMENT" ? item.customerName :
                             item.type === "CHEQUE" ? `چک شماره ${item.chequeNumber}` :
                             `سایز ${item.fileSize}`}
                          </p>
                        </div>

                        {/* Stats/Details Desktop Only */}
                        <div className="hidden lg:flex flex-row items-center gap-10 text-slate-400 font-bold shrink-0">
                           <div className="flex flex-col items-center gap-1">
                             <span className="text-[9px] text-slate-600 uppercase tracking-widest">تاریخ ثبت</span>
                             <span className="text-xs">{item.createdAt.split('T')[0]}</span>
                           </div>
                           {item.type === "CHEQUE" && (
                             <div className="flex flex-col items-center gap-1">
                               <span className="text-[9px] text-slate-600 uppercase tracking-widest">مبلغ نهایی</span>
                               <span className="text-xs text-emerald-500">{item.amount?.toLocaleString()}</span>
                             </div>
                           )}
                           <div className="flex flex-col items-center gap-1">
                             <span className="text-[9px] text-slate-600 uppercase tracking-widest">شناسه</span>
                             <span className="text-[10px] font-mono text-slate-500">{item.id.slice(0, 8)}</span>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-r border-slate-800/50 pt-4 md:pt-0 md:pr-4 w-full md:w-auto justify-center md:justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors" 
                            title="بازگردانی به سیستم"
                            onClick={() => {
                              if (item.type === "SHIPMENT") {
                                unarchiveShipment(item.id);
                                toast.success("محموله بازگردانی شد");
                              } else if (item.type === "CHEQUE") {
                                unarchiveCheque(item.id, "CLEARED");
                                toast.success("چک بازگردانی شد");
                              } else if (item.type === "DOCUMENT") {
                                unarchiveDocument(item.id);
                                toast.success("سند بازگردانی شد");
                              }
                            }}
                          >
                            <RotateCcw className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors" 
                            title="حذف دائمی"
                            onClick={() => {
                              if (window.confirm("آیا از حذف دائمی این مورد اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
                                if (item.type === "SHIPMENT") {
                                  permanentDeleteShipment(item.id);
                                } else if (item.type === "CHEQUE") {
                                  permanentDeleteCheque(item.id);
                                } else if (item.type === "DOCUMENT") {
                                  permanentDeleteDocument(item.id);
                                }
                                toast.error("مورد به صورت دائمی حذف شد");
                              }
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" className="h-10 px-4 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-slate-800/50">
                            جزئیات
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredItems.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto mb-10 flex flex-col items-center justify-center p-12 bg-slate-900/20 border-2 border-dashed border-slate-800/50 rounded-[3rem] text-center w-full max-w-2xl mx-auto"
              >
                <Archive className="w-16 h-16 text-slate-800 mb-6 opacity-20" />
                <p className="text-slate-600 font-bold">هیچ موردی در بایگانی یافت نشد.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
