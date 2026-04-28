import React from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  History, 
  User, 
  Clock, 
  Package, 
  FileText, 
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Search,
  Filter,
  ArrowDownCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChangeLog() {
  const { activityLogs, currentUser } = useMockStore();
  const [searchTerm, setSearchTerm] = React.useState("");

  if (currentUser?.role !== "CEO") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" dir="rtl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-2">عدم دسترسی</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          متأسفیم، بخش لاگ تغییرات سیستمی تنها برای مدیریت کل (CEO) قابل مشاهده است. 
          در صورت نیاز به دسترسی با بخش پشتیبانی فنی تماس بگیرید.
        </p>
      </div>
    );
  }

  const filteredLogs = activityLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLogIcon = (entityType: string) => {
    switch (entityType) {
      case "SHIPMENT": return <Package className="w-4 h-4" />;
      case "DOCUMENT": return <FileText className="w-4 h-4" />;
      case "TASK": return <CheckCircle className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      SHIPMENT: "محموله",
      DOCUMENT: "مدرک",
      TASK: "وظیفه",
      USER: "کاربر",
      CUSTOMER: "مشتری"
    };
    return labels[entityType] || entityType;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f8fafc] flex items-center gap-3">
            <History className="w-8 h-8 text-[#38bdf8]" />
            لاگ تغییرات سیستم
          </h1>
          <p className="text-slate-500 text-xs mt-1">رهگیری تمامی فعالیت‌های کاربران و تغییرات وضعیت دیتا در لحظه</p>
        </div>
        <Badge variant="outline" className="bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20 px-3 py-1 font-bold">
          سطح دسترسی: مدیریت کل
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="جستجو در فعالیت‌ها..." 
            className="bg-[#0f172a] border-[#1e293b] pr-10 focus:ring-[#38bdf8] h-12 rounded-xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 border-[#1e293b] bg-[#0f172a] text-slate-400 gap-2 px-6 rounded-xl">
          <Filter className="w-4 h-4" />
          فیلتر پیشرفته
        </Button>
      </div>

      <Card className="bg-[#0f172a] border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#1e293b]/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-[#1e293b]">
                <tr>
                  <th className="px-6 py-4">کاربر</th>
                  <th className="px-6 py-4">عملیات</th>
                  <th className="px-6 py-4">موضوع</th>
                  <th className="px-6 py-4">جزئیات تغییرات</th>
                  <th className="px-6 py-4 text-left">زمان ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1e293b]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-[#334155]">
                          <AvatarFallback className="bg-[#1e293b] text-[10px] text-slate-300">
                            {log.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-slate-200">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-[#1e293b] border-none text-[10px] font-bold py-1 px-2">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="p-1.5 bg-[#1e293b] rounded-lg">
                          {getLogIcon(log.entityType)}
                        </div>
                        <span className="text-[11px] font-medium">{getEntityLabel(log.entityType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                        {log.details || "بدون جزئیات ثبت شده"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-500">
                          {log.createdAt.split(/[T ]/)[0]}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600">
                          {log.createdAt.split(/[T ]/)[1]?.substring(0, 5) || "00:00"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-600">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">هیچ لاگی یافت نشد.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center pt-6">
        <Button variant="ghost" className="text-[#38bdf8] text-xs font-bold gap-2">
          <ArrowDownCircle className="w-4 h-4" />
          مشاهده موارد بیشتر
        </Button>
      </div>
    </div>
  );
}
