import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMockStore } from "@/src/store/useMockStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Phone, MapPin, Calendar, Ship, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { label: string; className: string }> = {
    PENDING: { label: "در انتظار", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    BOOKED: { label: "رزرو شده", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    IN_TRANSIT: { label: "در حال حمل", className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    ARRIVED: { label: "رسیده به مقصد", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    CUSTOMS: { label: "در گمرک", className: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    CLEARED: { label: "ترخیص شده", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    DELIVERED: { label: "تحویل شده", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    CLOSED: { label: "مختومه", className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
  };

  const config = configs[status] || { label: status, className: "bg-slate-500/10 text-slate-500 border-slate-500/20" };

  return (
    <Badge variant="outline" className={cn("px-2 py-0 text-[10px] font-bold rounded-full border", config.className)}>
      {config.label}
    </Badge>
  );
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customers = useMockStore(state => state.customers);
  const shipments = useMockStore(state => state.shipments);

  const customer = customers.find(c => c.id === id);
  const customerShipments = shipments.filter(s => s.customerId === id);

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">مشتری مورد نظر یافت نشد</h2>
        <Button 
          variant="link" 
          onClick={() => navigate("/customers")}
          className="text-[#38bdf8] mt-4"
        >
          بازگشت به لیست مشتریان
        </Button>
      </div>
    );
  }

  const activeShipments = customerShipments.filter(s => s.status !== "DELIVERED" && s.status !== "CLOSED" && !s.isArchived);

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/customers")}
          className="h-9 w-9 bg-[#1e293b] text-slate-400 hover:text-white rounded-xl"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">{customer.name}</h1>
          <p className="text-[12px] text-slate-400">{customer.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information Card */}
        <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-[#f8fafc]">اطلاعات تماس و آدرس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#1e293b]/40 rounded-xl">
              <Mail className="w-4 h-4 text-[#38bdf8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">ایمیل</span>
                <span className="text-xs text-slate-200">{customer.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1e293b]/40 rounded-xl">
              <Phone className="w-4 h-4 text-[#38bdf8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">تلفن تماس</span>
                <span className="text-xs text-slate-200">{customer.phone}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#1e293b]/40 rounded-xl">
              <MapPin className="w-4 h-4 text-[#38bdf8] mt-1" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">آدرس</span>
                <span className="text-xs text-slate-200 leading-relaxed">{customer.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1e293b]/40 rounded-xl">
              <Calendar className="w-4 h-4 text-[#38bdf8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">عضویت از</span>
                <span className="text-xs text-slate-200">{customer.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-none p-5 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
               <Package className="w-6 h-6 text-blue-500" />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">کل محموله‌ها</span>
             <span className="text-3xl font-black text-white">{customerShipments.length}</span>
          </Card>
          
          <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-none p-5 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3">
               <CheckCircle2 className="w-6 h-6 text-emerald-500" />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">تحویل شده</span>
             <span className="text-3xl font-black text-white">{customerShipments.filter(s => s.status === "DELIVERED").length}</span>
          </Card>

          <Card className="bg-[#38bdf8] border-none rounded-2xl shadow-lg p-5 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
               <Clock className="w-6 h-6 text-[#0f172a]" />
             </div>
             <span className="text-[10px] font-black text-[#0f172a]/70 uppercase tracking-widest mb-1">محموله فعال</span>
             <span className="text-3xl font-black text-[#0f172a]">{activeShipments.length}</span>
          </Card>

          {/* Active Shipments List */}
          <Card className="md:col-span-3 bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-none overflow-hidden">
            <CardHeader className="border-b border-[#1e293b] py-4">
              <CardTitle className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#38bdf8]" />
                محموله‌های فعال و در جریان
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-[12px]">
                  <thead>
                    <tr className="border-b border-[#1e293b] bg-[#1e293b]/20">
                      <th className="px-5 py-4 font-medium text-[#94a3b8]">شناسه / رهگیری</th>
                      <th className="px-5 py-4 font-medium text-[#94a3b8]">مسیر (مبدا - مقصد)</th>
                      <th className="px-5 py-4 font-medium text-[#94a3b8]">وضعیت فعلی</th>
                      <th className="px-5 py-4 font-medium text-[#94a3b8]">تحویل تخمینی</th>
                      <th className="px-5 py-4 font-medium text-[#94a3b8]">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]">
                    {activeShipments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-20 text-center text-slate-500">
                          هیچ محموله فعالی در حال حاضر وجود ندارد.
                        </td>
                      </tr>
                    ) : (
                      activeShipments.map((shipment) => (
                        <tr key={shipment.id} className="hover:bg-[#1e293b]/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#f8fafc]">#{shipment.trackingNumber}</span>
                              <span className="text-[10px] text-slate-500 font-mono italic">Container: {shipment.containerNumber}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300">{shipment.origin}</span>
                              <ArrowRight className="w-3 h-3 text-slate-600 rotate-180" />
                              <span className="text-[#38bdf8] font-bold">{shipment.destination}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={shipment.status} />
                          </td>
                          <td className="px-5 py-4 text-slate-400 font-medium">
                            {shipment.estimatedDelivery}
                          </td>
                          <td className="px-5 py-4">
                            <Button 
                              variant="outline" 
                              className="border-[#1e293b] hover:bg-[#1e293b] text-slate-400 hover:text-[#38bdf8] text-[10px] h-7 px-3 rounded-lg"
                              onClick={() => navigate(`/shipments/${shipment.id}`)}
                            >
                              مشاهده جزئیات
                            </Button>
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
      </div>
    </div>
  );
}
