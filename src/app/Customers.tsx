import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/src/store/useMockStore";
import { Search, UserPlus, Phone, Mail, Building2, Calendar, MoreVertical, ExternalLink, Share2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Customers() {
  const navigate = useNavigate();
  const customers = useMockStore(state => state.customers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = React.useMemo(() => {
    return customers.filter(c => 
      c.name.includes(searchTerm) || (c as any).company?.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">پایگاه مشتریان</h1>
          <p className="text-[12px] text-slate-400">مدیریت اطلاعات و تاریخچه همکاری با شرکای تجاری.</p>
        </div>
        
        <Dialog>
          <DialogTrigger
            render={
              <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] gap-2 h-10 w-full sm:w-auto text-xs font-bold px-4 flex items-center justify-center rounded-xl">
                <UserPlus className="w-3.5 h-3.5" />
                مشتری جدید
              </Button>
            }
          />
          <DialogContent className="bg-[#0f172a] border-[#1e293b] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#f8fafc]">ثبت مشتری جدید</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">اطلاعات مشتری را برای ثبت در سیستم وارد کنید.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-xs text-slate-400">نام و نام خانوادگی</Label>
                <Input id="name" className="bg-[#1e293b] border-[#334155] text-xs h-9" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="company" className="text-xs text-slate-400">نام شرکت</Label>
                <Input id="company" className="bg-[#1e293b] border-[#334155] text-xs h-9" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs text-slate-400">ایمیل</Label>
                <Input id="email" type="email" className="bg-[#1e293b] border-[#334155] text-xs h-9 ltr text-left" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full bg-[#38bdf8] text-[#020617] font-bold h-9 text-xs">ذخیره مشتری</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0f172a] p-3 rounded-xl border border-[#1e293b]">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <Input 
            placeholder="جستجوی نام مشتری یا شرکت..." 
            className="bg-[#1e293b] border-[#334155] pr-10 h-10 text-xs focus-visible:ring-[#38bdf8]/50 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-[#0f172a] border-[#1e293b] rounded-xl overflow-hidden shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[12px] min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#1e293b]/20">
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">نام کامل</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">شرکت</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">اطلاعات تماس</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">تعداد محموله</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">تاریخ ایجاد</th>
                  <th className="px-5 py-4 font-medium text-[#94a3b8]">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#1e293b]/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#f8fafc]">{customer.name}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-medium">{(customer as any).company}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#38bdf8]">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge className="bg-[#38bdf8]/10 text-[#38bdf8] border-none h-5 px-2 py-0 text-[10px] font-bold">
                        {(customer as any).shipmentsCount || 0}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{customer.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[#38bdf8] hover:text-white hover:bg-[#38bdf8]/20" 
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          title="مشاهده جزئیات کامل"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-[#1e293b]" onClick={() => window.open(`/track/${customer.id}`, '_blank')}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-[#1e293b]">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right shadow-2xl" align="end" dir="rtl">
                            <DropdownMenuItem 
                              className="text-xs cursor-pointer hover:bg-[#1e293b] flex items-center justify-between gap-2 text-[#38bdf8] font-bold rounded-lg"
                              onClick={() => {
                                const link = `${window.location.origin}/track`;
                                navigator.clipboard.writeText(link);
                                alert("لینک پورتال رهگیری مشتری کپی شد:\n" + link);
                              }}
                            >
                              <span>اشتراک‌گذاری پنل رهگیری</span>
                              <Share2 className="w-3.5 h-3.5" />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs cursor-pointer hover:bg-[#1e293b] rounded-lg">مشاهده تاریخچه</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs cursor-pointer hover:bg-[#1e293b] text-red-400 rounded-lg">حذف مشتری</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
