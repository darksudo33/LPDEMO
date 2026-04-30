import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Trash2, 
  Edit3, 
  Archive, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Filter,
  ArrowLeft,
  DollarSign,
  Briefcase
} from "lucide-react";
import { format, differenceInSeconds, parse } from "date-fns-jalali";
import { useMockStore } from "@/src/store/useMockStore";
import { Cheque, ChequeStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Reuse the timer component pattern
const ChequeTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      try {
        const now = new Date();
        // date-fns-jalali parse might need exact format or just Date object if the string is compatible
        // Mock data uses YYYY/MM/DD which is generally compatible with jalali parser
        const target = new Date(); // Fallback
        
        // Simple manual diff for mock purposes if complex parsing fails
        const [year, month, day] = targetDate.split("/").map(Number);
        // This is a rough estimation for the timer UI
        const targetTime = new Date(year + 621, month - 1, day).getTime(); 
        const nowTime = new Date().getTime();
        
        setTimeLeft(Math.max(0, Math.floor((targetTime - nowTime) / 1000)));
      } catch (e) {
        setTimeLeft(0);
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft <= 0) return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-none text-[8px] font-black">زمان سپری شده</Badge>;

  const days = Math.floor(timeLeft / (24 * 3600));
  const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);

  return (
    <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/10">
      <Clock className="w-2.5 h-2.5" />
      <span>{days} روز و {hours} ساعت تا موعد</span>
    </div>
  );
};

export default function ChequeManagement() {
  const { cheques, addCheque, updateCheque, deleteCheque, archiveCheque } = useMockStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ChequeStatus | "ALL">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);

  const [formData, setFormData] = useState({
    bankName: "",
    chequeNumber: "",
    amount: "",
    dueDate: format(new Date(), "yyyy/MM/dd"),
    location: "",
    receiver: "",
    status: "ACTIVE" as ChequeStatus,
    description: ""
  });

  const filteredCheques = cheques.filter(c => {
    const matchesSearch = 
      c.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chequeNumber.includes(searchTerm) ||
      c.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "ALL" || c.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setEditingCheque(null);
    setFormData({
      bankName: "",
      chequeNumber: "",
      amount: "",
      dueDate: format(new Date(), "yyyy/MM/dd"),
      location: "",
      receiver: "",
      status: "ACTIVE",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (chq: Cheque) => {
    setEditingCheque(chq);
    setFormData({
      bankName: chq.bankName,
      chequeNumber: chq.chequeNumber,
      amount: chq.amount.toString(),
      dueDate: chq.dueDate,
      location: chq.location,
      receiver: chq.receiver,
      status: chq.status,
      description: chq.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.bankName || !formData.chequeNumber || !formData.amount) {
      toast.error("لطفا فیلدهای ضروری را پر کنید.");
      return;
    }

    const data = {
      ...formData,
      amount: parseInt(formData.amount),
    };

    if (editingCheque) {
      updateCheque(editingCheque.id, data);
      toast.success("اطلاعات چک با موفقیت بروزرسانی شد.");
    } else {
      addCheque(data);
      toast.success("چک جدید با موفقیت ثبت شد.");
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#020617] min-h-screen text-slate-100 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-[#38bdf8]/10 rounded-2xl border border-[#38bdf8]/20 shadow-lg shadow-[#38bdf8]/5">
              <CreditCard className="w-8 h-8 text-[#38bdf8]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">مدیریت چک‌های صادره</h1>
              <p className="text-slate-500 text-xs md:text-sm font-bold mt-1">سامانه پایش سررسید، مکان فیزیکی و وضعیت بازگشت چک‌ها</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleOpenAdd}
            className="bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-black rounded-2xl h-14 px-8 shadow-xl shadow-[#38bdf8]/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 ml-2" />
            ثبت چک جدید
          </Button>
        </div>
      </div>

      {/* Stats Quick Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "مجموع چک‌های فعال", val: cheques.filter(c => c.status === "ACTIVE").length, icon: CreditCard, color: "text-[#38bdf8]" },
          { label: "سررسید ماه جاری", val: cheques.filter(c => c.dueDate.includes("1403/02")).length, icon: CalendarIcon, color: "text-amber-500" },
          { label: "مبلغ کل در گردش", val: (cheques.filter(c => c.status === "ACTIVE").reduce((acc, c) => acc + c.amount, 0) / 1000000).toLocaleString() + " م", icon: DollarSign, color: "text-emerald-500" },
          { label: "نیاز به بازپس‌گیری", val: 2, icon: AlertCircle, color: "text-rose-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800/50 shadow-xl overflow-hidden group">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.val}</p>
              </div>
              <div className={cn("p-3 rounded-2xl bg-slate-800/50 group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content: Filter & List */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
            <Input 
              placeholder="جستجو در نام بانک، شماره چک، گیرنده یا محل نگهداری..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border-slate-800 pr-11 h-14 rounded-2xl text-sm focus:ring-1 focus:ring-[#38bdf8]/30 shadow-inner"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-800 h-14 rounded-2xl text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <SelectValue placeholder="فیلتر وضعیت" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="ALL">همه وضعیت‌ها</SelectItem>
                <SelectItem value="ACTIVE">در جریان (فعال)</SelectItem>
                <SelectItem value="CLEARED">پاس شده</SelectItem>
                <SelectItem value="RETURNED">منجر به برگشت</SelectItem>
                <SelectItem value="ARCHIVED">بایگانی شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCheques.map((chq) => (
              <motion.div
                key={chq.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-slate-900 border-slate-800/80 hover:border-[#38bdf8]/30 transition-all rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-[#38bdf8]/5 h-full flex flex-col">
                  <div className={cn(
                    "h-1.5 w-full",
                    chq.status === "ACTIVE" ? "bg-[#38bdf8]" : 
                    chq.status === "CLEARED" ? "bg-emerald-500" : 
                    chq.status === "RETURNED" ? "bg-rose-500" : "bg-slate-700"
                  )} />
                  
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-[#38bdf8] border border-slate-700 group-hover:scale-105 transition-transform">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-100 group-hover:text-[#38bdf8] transition-colors">{chq.bankName}</h3>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5 tracking-wider">ساعت {chq.chequeNumber}</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-lg",
                        chq.status === "ACTIVE" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                        chq.status === "CLEARED" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        chq.status === "RETURNED" && "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      )}>
                        {chq.status === "ACTIVE" ? "در جریان" : chq.status === "CLEARED" ? "پاس شده" : "برگشتی"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex-1 space-y-4">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">مبلغ چک</span>
                          <span className="text-sm font-black text-[#38bdf8]">{chq.amount.toLocaleString()} ریال</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                          <div className="bg-[#38bdf8] h-full" style={{ width: '40%' }} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                             <MapPin className="w-2.5 h-2.5" />
                             محل نگهداری
                          </label>
                          <p className="text-xs font-bold text-slate-300">{chq.location}</p>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                             <User className="w-2.5 h-2.5" />
                             در وجه / گیرنده
                          </label>
                          <p className="text-xs font-bold text-slate-300">{chq.receiver}</p>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs font-mono font-bold text-slate-400">{chq.dueDate}</span>
                       </div>
                       <ChequeTimer targetDate={chq.dueDate} />
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 bg-slate-800/20 border-t border-slate-800/40 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    {(chq.status === "CLEARED" || chq.status === "RETURNED") && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl hover:bg-amber-500/10 hover:text-amber-500" 
                        onClick={() => { archiveCheque(chq.id); toast.success("چک به بایگانی منتقل شد."); }}
                        title="انتقال به بایگانی"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#38bdf8]/10 hover:text-[#38bdf8]" onClick={() => handleOpenEdit(chq)}>
                       <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => { deleteCheque(chq.id); toast.error("چک با موفقیت حذف شد."); }}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-xl rounded-[2.5rem] p-8 shadow-2xl" dir="rtl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black flex items-center gap-4">
              <div className="p-3 bg-[#38bdf8]/10 rounded-2xl">
                {editingCheque ? <Edit3 className="w-6 h-6 text-[#38bdf8]" /> : <Plus className="w-6 h-6 text-[#38bdf8]" />}
              </div>
              <div className="flex flex-col text-right">
                <span>{editingCheque ? "ویرایش اطلاعات چک" : "ثبت چک جدید"}</span>
                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest leading-none">Financial Control System</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">بانک صادرکننده</Label>
              <Input 
                className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner" 
                value={formData.bankName}
                onChange={e => setFormData({...formData, bankName: e.target.value})}
                placeholder="مثلا: بانک ملت شعبه مرکزی"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">شماره صیادی / چک</Label>
              <Input 
                className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner font-mono text-center" 
                value={formData.chequeNumber}
                onChange={e => setFormData({...formData, chequeNumber: e.target.value})}
                placeholder="12345/6789"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">مبلغ چک (ریال)</Label>
              <div className="relative">
                <Input 
                  type="number"
                  className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner pl-12" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">تاریخ سررسید</Label>
              <div className="relative">
                <Input 
                  className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner font-mono text-center" 
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  placeholder="۱۴۰۳/۰۳/۱۵"
                />
                <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38bdf8]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">محل نگهداری فیزیکی</Label>
              <Input 
                className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="مثلا: گاوصندوق شرکت هوپاد"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">در وجه / گیرنده</Label>
              <Input 
                className="bg-slate-800/50 border-none h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-2xl shadow-inner" 
                value={formData.receiver}
                onChange={e => setFormData({...formData, receiver: e.target.value})}
                placeholder="مثلا: سازمان بنادر و دریانوردی"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">وضعیت کنونی</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as ChequeStatus})}>
                <SelectTrigger className="bg-slate-800/50 border-none h-12 rounded-2xl shadow-inner text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="ACTIVE">در جریان (فعال)</SelectItem>
                  <SelectItem value="CLEARED">پاس شده</SelectItem>
                  <SelectItem value="RETURNED">برگشت خورده</SelectItem>
                  <SelectItem value="ARCHIVED">بایگانی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">توضیحات تکمیلی</Label>
              <textarea 
                className="w-full bg-slate-800/50 border-none rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:ring-1 focus:ring-[#38bdf8]/50 resize-none shadow-inner"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 mt-8">
            <Button variant="ghost" className="flex-1 text-slate-500 hover:text-white" onClick={() => setIsDialogOpen(false)}>انصراف</Button>
            <Button className="flex-[2] bg-[#38bdf8] text-slate-950 font-black h-14 rounded-2xl shadow-xl shadow-[#38bdf8]/10" onClick={handleSubmit}>
              {editingCheque ? "بروزرسانی اطلاعات" : "تایید و ثبت چک"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
