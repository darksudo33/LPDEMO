import React, { useState, useMemo } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  Calculator, 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileJson, 
  Printer,
  History,
  TrendingUp,
  Percent,
  Fuel,
  Truck,
  User,
  Phone,
  MapPin,
  Calendar,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  Trash2,
  Edit,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quote, QuoteStatus, CargoType } from "@/src/types";
import { format } from "date-fns-jalali";

const CargoTypeBadge = ({ type }: { type: CargoType }) => {
  const styles: Record<CargoType, string> = {
    GENERAL: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    REFRIGERATED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    HAZARDOUS: "bg-red-500/10 text-red-500 border-red-500/20",
    OVERSIZED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  const labels: Record<CargoType, string> = {
    GENERAL: "کالای عمومی",
    REFRIGERATED: "یخچالی",
    HAZARDOUS: "خطرناک",
    OVERSIZED: "فوق سنگین",
  };
  return (
    <Badge variant="outline" className={cn("text-[9px] font-black h-5", styles[type])}>
      {labels[type]}
    </Badge>
  );
};

const QuoteStatusBadge = ({ status }: { status: QuoteStatus }) => {
  const styles: Record<QuoteStatus, string> = {
    PENDING: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    ACCEPTED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    EXPIRED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  const labels: Record<QuoteStatus, string> = {
    PENDING: "در انتظار",
    ACCEPTED: "پذیرفته شده",
    REJECTED: "رد شده",
    EXPIRED: "منقضی شده",
  };
  const Icon = {
    PENDING: Clock,
    ACCEPTED: CheckCircle2,
    REJECTED: AlertCircle,
    EXPIRED: AlertCircle,
  }[status];

  return (
    <Badge variant="outline" className={cn("text-[10px] font-black h-6 gap-1.5", styles[status])}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </Badge>
  );
};

export default function QuotageManagement() {
  const { quotes, addQuote, updateQuote, deleteQuote, currentUser } = useMockStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<QuoteStatus | "ALL">("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Form State
  const initialQuoteState: Partial<Quote> = {
    customerName: "",
    customerPhone: "",
    originCity: "",
    destinationCity: "",
    cargoType: "GENERAL",
    weight: 0,
    dimensions: "",
    requirements: [],
    baseRate: 0,
    fuelSurcharge: 0,
    loadingFees: 0,
    tollFees: 0,
    insurancePercentage: 1,
    profitMargin: 10,
    status: "PENDING",
  };

  const [newQuote, setNewQuote] = useState<Partial<Quote>>(initialQuoteState);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = 
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.originCity.includes(searchTerm) ||
        q.destinationCity.includes(searchTerm);
      const matchesStatus = activeTab === "ALL" || q.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, activeTab]);

  const stats = useMemo(() => {
    const total = quotes.length;
    const accepted = quotes.filter(q => q.status === "ACCEPTED").length;
    const pending = quotes.filter(q => q.status === "PENDING").length;
    const winRate = total > 0 ? (accepted / total) * 100 : 0;
    const avgValue = total > 0 ? quotes.reduce((acc, q) => acc + q.totalPrice, 0) / total : 0;

    return [
      { title: "کل استعلام‌ها", value: total, icon: FileText, color: "text-blue-500" },
      { title: "نرخ موفقیت", value: `${Math.round(winRate)}%`, icon: TrendingUp, color: "text-emerald-500" },
      { title: "در انتظار پاسخ", value: pending, icon: Clock, color: "text-amber-500" },
      { title: "متوسط ارزش (میلیون)", value: `${(avgValue / 1000000).toFixed(1)}`, icon: Calculator, color: "text-purple-500" },
    ];
  }, [quotes]);

  const calculateTotal = (q: Partial<Quote>) => {
    const base = Number(q.baseRate) || 0;
    const fuel = Number(q.fuelSurcharge) || 0;
    const loading = Number(q.loadingFees) || 0;
    const toll = Number(q.tollFees) || 0;
    const insuranceMult = 1 + (Number(q.insurancePercentage) || 0) / 100;
    const profitMult = 1 + (Number(q.profitMargin) || 0) / 100;

    const subtotal = base + fuel + loading + toll;
    return Math.round(subtotal * insuranceMult * profitMult);
  };

  const handleEditClick = (quote: Quote) => {
    setNewQuote(quote);
    setEditingQuoteId(quote.id);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingQuoteId(null);
    setNewQuote(initialQuoteState);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = calculateTotal(newQuote);
    
    if (editingQuoteId) {
      updateQuote(editingQuoteId, {
        customerName: newQuote.customerName,
        customerPhone: newQuote.customerPhone,
        originCity: newQuote.originCity,
        destinationCity: newQuote.destinationCity,
        cargoType: newQuote.cargoType,
        weight: Number(newQuote.weight),
        dimensions: newQuote.dimensions,
        requirements: newQuote.requirements,
        baseRate: Number(newQuote.baseRate),
        fuelSurcharge: Number(newQuote.fuelSurcharge),
        loadingFees: Number(newQuote.loadingFees),
        tollFees: Number(newQuote.tollFees),
        insurancePercentage: Number(newQuote.insurancePercentage),
        profitMargin: Number(newQuote.profitMargin),
        totalPrice,
        notes: newQuote.notes,
      });
    } else {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7);

      addQuote({
        customerName: newQuote.customerName || "",
        customerPhone: newQuote.customerPhone || "",
        originCity: newQuote.originCity || "",
        destinationCity: newQuote.destinationCity || "",
        cargoType: newQuote.cargoType as CargoType,
        weight: Number(newQuote.weight) || 0,
        dimensions: newQuote.dimensions || "",
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        requirements: newQuote.requirements || [],
        baseRate: Number(newQuote.baseRate) || 0,
        fuelSurcharge: Number(newQuote.fuelSurcharge) || 0,
        loadingFees: Number(newQuote.loadingFees) || 0,
        tollFees: Number(newQuote.tollFees) || 0,
        insurancePercentage: Number(newQuote.insurancePercentage) || 0,
        profitMargin: Number(newQuote.profitMargin) || 0,
        totalPrice,
        validUntil: validUntil.toISOString(),
        status: "PENDING",
        notes: newQuote.notes,
      });
    }
    handleCloseForm();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans rtl">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-500" />
            مدیریت کوتاژ (استعلام قیمت)
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-1">مدیریت، محاسبه و پیگیری نرخ‌های اعلامی به مشتریان</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 px-8 rounded-2xl shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5 ml-2" />
          ثبت استعلام جدید
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#0f172a] border-[#1e293b] rounded-2xl border-b-4 border-b-emerald-500/20 shadow-none overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{stat.title}</p>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl overflow-hidden shadow-none">
          <CardHeader className="p-4 md:p-6 border-b border-[#1e293b]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="جستجو در مشتریان یا مسیرها..." 
                  className="bg-[#020617] border-[#1e293b] pr-10 h-11 text-xs font-bold text-slate-300 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full md:w-auto">
                <TabsList className="bg-[#020617] border-[#1e293b] p-1 h-11 rounded-xl">
                  <TabsTrigger value="ALL" className="text-[10px] font-black rounded-lg px-4 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white text-slate-500">همه</TabsTrigger>
                  <TabsTrigger value="PENDING" className="text-[10px] font-black rounded-lg px-4 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white text-slate-500">در انتظار</TabsTrigger>
                  <TabsTrigger value="ACCEPTED" className="text-[10px] font-black rounded-lg px-4 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white text-slate-500">پذیرفته شده</TabsTrigger>
                  <TabsTrigger value="REJECTED" className="text-[10px] font-black rounded-lg px-4 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white text-slate-500">رد شده</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-[#38bdf8]/5 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">مشتری و مسیر</th>
                    <th className="px-6 py-4">نوع کالا / وزن</th>
                    <th className="px-6 py-4">قیمت نهایی</th>
                    <th className="px-6 py-4">اعتبار / تاریخ ثبت</th>
                    <th className="px-6 py-4">وضعیت</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-xs font-bold font-sans">
                        هیچ استعلام قیمتی یافت نشد.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-[#1e293b]/30 transition-all group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black text-white">{quote.customerName}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                              <MapPin className="w-3 h-3" />
                              {quote.originCity}
                              <ArrowRightLeft className="w-2.5 h-2.5 mx-0.5 opacity-50" />
                              {quote.destinationCity}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <CargoTypeBadge type={quote.cargoType} />
                            <span className="text-[10px] text-slate-400 font-bold">{quote.weight} تن</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-black text-emerald-500">{quote.totalPrice.toLocaleString('fa-IR')} <span className="text-[10px] text-slate-500 mr-0.5">ریال</span></span>
                            <span className="text-[9px] text-slate-500 font-bold">حاشیه سود: {quote.profitMargin}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded bg-[#1e293b] w-fit", 
                              new Date(quote.validUntil) < new Date() ? "text-red-400" : "text-blue-400")}>
                              اعتبار تا: {format(new Date(quote.validUntil), "yyyy/MM/dd")}
                            </span>
                            <span className="text-[9px] text-slate-600 font-bold">ثبت: {format(new Date(quote.createdAt), "yyyy/MM/dd")}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <QuoteStatusBadge status={quote.status} />
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-[#1e293b] text-slate-400 hover:text-white">
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-[#1e293b] text-slate-400 hover:text-white"
                              onClick={() => handleEditClick(quote)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500"
                              onClick={() => deleteQuote(quote.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f172a] border border-[#1e293b] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#38bdf8]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    {editingQuoteId ? <Edit className="w-6 h-6 text-emerald-500" /> : <Plus className="w-6 h-6 text-emerald-500" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      {editingQuoteId ? "ویرایش استعلام قیمت" : "ثبت استعلام قیمت جدید"}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5 tracking-tight uppercase opacity-70">
                      {editingQuoteId ? "Edit Freight Quotation" : "New Freight Quotation"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl hover:bg-white/5 text-slate-500"
                  onClick={handleCloseForm}
                >
                  <Trash2 className="w-5 h-5 rotate-45" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <form id="quote-form" onSubmit={handleSubmitQuote} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Customer & Route */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#38bdf8] uppercase flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        اطلاعات مشتری
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">نام مشتری / شرکت</label>
                          <Input 
                            className="bg-[#020617] border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl"
                            required
                            value={newQuote.customerName}
                            onChange={(e) => setNewQuote({...newQuote, customerName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">شماره تماس</label>
                          <Input 
                            className="bg-[#020617] border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl text-left font-mono"
                            required
                            value={newQuote.customerPhone}
                            onChange={(e) => setNewQuote({...newQuote, customerPhone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#38bdf8] uppercase flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        اطلاعات مسیر
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">مبدأ</label>
                          <Input 
                            className="bg-[#020617] border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl"
                            required
                            value={newQuote.originCity}
                            onChange={(e) => setNewQuote({...newQuote, originCity: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">مقصد</label>
                          <Input 
                            className="bg-[#020617] border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl"
                            required
                            value={newQuote.destinationCity}
                            onChange={(e) => setNewQuote({...newQuote, destinationCity: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#38bdf8] uppercase flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5" />
                        مشخصات محموله
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">نوع کالا</label>
                          <select 
                            className="w-full bg-[#020617] border border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl px-3 outline-none"
                            value={newQuote.cargoType}
                            onChange={(e) => setNewQuote({...newQuote, cargoType: e.target.value as CargoType})}
                          >
                            <option value="GENERAL">کالای عمومی</option>
                            <option value="REFRIGERATED">یخچالی</option>
                            <option value="HAZARDOUS">خطرناک (DG)</option>
                            <option value="OVERSIZED">فوق سنگین / ترافیکی</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">وزن (تن)</label>
                          <Input 
                            type="number"
                            className="bg-[#020617] border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl"
                            value={newQuote.weight}
                            onChange={(e) => setNewQuote({...newQuote, weight: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 px-1">وضعیت استعلام</label>
                      <select 
                        className="w-full bg-[#020617] border border-[#1e293b] h-11 text-xs font-bold text-slate-200 rounded-xl px-3 outline-none"
                        value={newQuote.status}
                        onChange={(e) => setNewQuote({...newQuote, status: e.target.value as QuoteStatus})}
                      >
                        <option value="PENDING">در انتظار</option>
                        <option value="ACCEPTED">پذیرفته شده</option>
                        <option value="REJECTED">رد شده</option>
                        <option value="EXPIRED">منقضی شده</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column: Calculations */}
                  <div className="space-y-6">
                    <div className="bg-[#020617] border border-[#1e293b] rounded-2xl p-5 space-y-4 shadow-inner">
                      <h3 className="text-[11px] font-black text-emerald-500 uppercase flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5" />
                        محاسبات هزینه و سود
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">نرخ پایه (ریال)</label>
                          <Input 
                            type="number"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-mono text-slate-200 rounded-lg"
                            value={newQuote.baseRate}
                            onChange={(e) => setNewQuote({...newQuote, baseRate: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">سوخت (ریال)</label>
                          <Input 
                            type="number"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-mono text-slate-200 rounded-lg"
                            value={newQuote.fuelSurcharge}
                            onChange={(e) => setNewQuote({...newQuote, fuelSurcharge: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">بارگیری/تخلیه</label>
                          <Input 
                            type="number"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-mono text-slate-200 rounded-lg"
                            value={newQuote.loadingFees}
                            onChange={(e) => setNewQuote({...newQuote, loadingFees: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">عوارض و جاده</label>
                          <Input 
                            type="number"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-mono text-slate-200 rounded-lg"
                            value={newQuote.tollFees}
                            onChange={(e) => setNewQuote({...newQuote, tollFees: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">بیمه (%)</label>
                          <Input 
                            type="number"
                            step="0.1"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-bold text-slate-200 rounded-lg"
                            value={newQuote.insurancePercentage}
                            onChange={(e) => setNewQuote({...newQuote, insurancePercentage: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 px-1">سود مدیریت (%)</label>
                          <Input 
                            type="number"
                            className="bg-[#0f172a] border-[#1e293b] h-10 text-xs font-bold text-slate-200 rounded-lg text-emerald-400"
                            value={newQuote.profitMargin}
                            onChange={(e) => setNewQuote({...newQuote, profitMargin: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-[#1e293b]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-slate-500">قیمت تخمینی نهایی</span>
                          <span className="text-xl font-black text-white tabular-nums">
                            {calculateTotal(newQuote).toLocaleString('fa-IR')} <span className="text-[10px] text-slate-600 mr-1 italic">ریال</span>
                          </span>
                        </div>
                        <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 px-1">توضیحات و نیازمندی‌های خاص</label>
                      <textarea 
                        className="w-full bg-[#020617] border border-[#1e293b] min-h-[100px] text-xs font-bold text-slate-200 rounded-xl p-3 outline-none resize-none"
                        value={newQuote.notes}
                        onChange={(e) => setNewQuote({...newQuote, notes: e.target.value})}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-[#1e293b] flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  اعتبار استعلام صادر شده ۷ روز می‌باشد.
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    className="h-12 px-6 rounded-xl text-slate-400 font-black text-xs"
                    onClick={handleCloseForm}
                  >
                    انصراف
                  </Button>
                  <Button 
                    form="quote-form"
                    className="h-12 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20"
                  >
                    {editingQuoteId ? "بروزرسانی استعلام" : "تأیید و صدور استعلام"}
                    {editingQuoteId ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
