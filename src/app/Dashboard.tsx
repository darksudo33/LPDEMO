import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMockStore } from "@/src/store/useMockStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Package, TrendingUp, CheckCircle, Users, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
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
  const customers = useMockStore(state => state.customers);
  const tasks = useMockStore(state => state.tasks);

  const recentShipments = React.useMemo(() => shipments.slice(0, 6), [shipments]);
  const recentTasks = React.useMemo(() => tasks.slice(0, 3), [tasks]);

  const chartData = [
    { name: "فروردین", value: 12 },
    { name: "اردیبهشت", value: 19 },
    { name: "خرداد", value: 15 },
    { name: "تیر", value: 22 },
    { name: "مرداد", value: 30 },
  ];

  const stats = [
    { title: "کل محموله‌های فعال", value: "۱۴۸", icon: Package, change: "↑ ۱۲٪ نسبت به ماه قبل", up: true, subtitle: "کل محموله‌های فعال" },
    { title: "در انتظار ترخیص", value: "۲۴", icon: TrendingUp, change: "۵ محموله در اولویت بالا", up: true, subtitle: "در انتظار ترخیص", color: "text-[#eab308]" },
    { title: "وظایف امروز", value: "۰۹", icon: CheckCircle, change: "۳ مورد تکمیل شده", up: true, subtitle: "وظایف امروز", color: "text-[#38bdf8]" },
    { title: "هشدار دموراژ", value: "۰۳", icon: Clock, change: "فوری: جریمه فعال", up: false, subtitle: "هشدار دموراژ", color: "text-[#ef4444]" },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#0f172a] border-[#1e293b] rounded-xl shadow-none">
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-[12px] text-[#94a3b8] font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-[#f8fafc]">{stat.value}</p>
              <p className={cn("text-[11px] mt-1", stat.color || (stat.up ? "text-green-500" : "text-red-500"))}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-[#0f172a] border-[#1e293b] rounded-xl overflow-hidden flex flex-col min-h-0">
          <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-[#f8fafc]">آخرین وضعیت محموله‌ها</CardTitle>
            <span className="text-xs text-[#38bdf8] cursor-pointer hover:underline">مشاهده همه</span>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-right text-[12px]">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-4 py-3 font-medium text-[#94a3b8]">شماره پیگیری</th>
                  <th className="px-4 py-3 font-medium text-[#94a3b8]">مشتری</th>
                  <th className="px-4 py-3 font-medium text-[#94a3b8]">مبدا / مقصد</th>
                  <th className="px-4 py-3 font-medium text-[#94a3b8]">وضعیت</th>
                  <th className="px-4 py-3 font-medium text-[#94a3b8]">آخرین بروزرسانی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {recentShipments.map((shipment) => (
                  <tr 
                    key={shipment.id} 
                    className="hover:bg-[#1e293b]/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-slate-100 font-bold text-[#38bdf8]">{shipment.trackingNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{shipment.customerName}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {shipment.origin} ← {shipment.destination}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">{shipment.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl flex flex-col min-h-0">
          <CardHeader className="p-4 border-b border-[#1e293b]">
            <CardTitle className="text-sm font-semibold text-[#f8fafc]">وظایف اولویت‌دار</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 overflow-y-auto">
            {recentTasks.map(task => (
              <div key={task.id} className="bg-[#1e293b] border border-[#334155] rounded-lg p-3 hover:border-[#38bdf8]/30 transition-all cursor-pointer">
                <p className="text-[13px] font-medium text-[#f8fafc] mb-2">{task.title}</p>
                <div className="flex justify-between items-center text-[10px] text-[#94a3b8]">
                  <span>{task.dueDate}</span>
                  <Badge className={cn(
                    "text-[8px] font-bold py-0 h-4 border-none",
                    task.priority === "URGENT" ? "bg-red-500/10 text-red-500" : 
                    task.priority === "HIGH" ? "bg-orange-500/10 text-orange-500" : 
                    "bg-blue-500/10 text-blue-500"
                  )}>
                    {task.priority === "URGENT" ? "فوری" : task.priority === "HIGH" ? "بالا" : "متوسط"}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <button className="w-full bg-transparent border border-dashed border-[#334155] text-[#94a3b8] py-2 rounded-lg text-[12px] hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all" onClick={() => navigate('/tasks')}>
                + تعریف وظیفه جدید
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
