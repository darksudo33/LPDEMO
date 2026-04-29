import React, { useState } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Camera, Check, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const currentUser = useMockStore(state => state.currentUser);
  const updateCurrentUser = useMockStore(state => state.updateCurrentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateCurrentUser(formData);
      setIsSaving(false);
      toast.success("پروفایل با موفقیت بروزرسانی شد");
    }, 800);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans" dir="rtl">
      <div className="flex items-center gap-4 mb-2">
         <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
            <User className="w-6 h-6" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-white tracking-tight">تنظیمات حساب کاربری</h1>
            <p className="text-slate-500 text-sm">مدیریت اطلاعات شخصی و دسترسی‌ها</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="bg-[#0f172a] border-[#1e293b] overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4">
                <Avatar className="w-24 h-24 border-4 border-[#1e293b] ring-2 ring-[#38bdf8]/20 transition-all group-hover:opacity-80">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="bg-slate-800 text-2xl font-bold">{formData.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#020617]/80 p-2 rounded-full text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">{formData.name}</h2>
              <p className="text-sm text-[#38bdf8] font-medium mb-4">{currentUser?.role}</p>
              <div className="w-full flex flex-col gap-2">
                <div className="bg-[#1e293b]/50 px-3 py-2 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">وضعیت</span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    آنلاین
                  </span>
                </div>
                <div className="bg-[#1e293b]/50 px-3 py-2 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">عضویت</span>
                  <span className="text-[10px] text-slate-300 font-bold">۱۴۰۲/۱۰/۱۲</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader className="border-b border-[#1e293b]/50">
              <CardTitle className="text-base font-bold text-white">اطلاعات کاربری</CardTitle>
              <CardDescription className="text-xs text-slate-500">این اطلاعات در تمام بخش‌های سیستم برای همکاران نمایش داده می‌شود.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 pr-1">نام و نام خانوادگی</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-slate-950/50 border-slate-800 pr-10 focus:ring-[#38bdf8] rounded-xl h-11" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 pr-1">پست الکترونیک (قابل تغییر نیست)</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={formData.email}
                        disabled
                        className="bg-slate-950/50 border-slate-800 pr-10 opacity-50 cursor-not-allowed rounded-xl h-11" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 pr-1">سمت سازمانی</Label>
                    <div className="relative">
                      <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={currentUser?.role || ""}
                        disabled
                        className="bg-slate-950/50 border-slate-800 pr-10 opacity-50 cursor-not-allowed rounded-xl h-11" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 pr-1">تصویر آواتار (URL)</Label>
                    <div className="relative">
                      <Camera className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={formData.avatar}
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        className="bg-slate-950/50 border-slate-800 pr-10 focus:ring-[#38bdf8] rounded-xl h-11" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                   <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-black h-12 px-8 rounded-xl min-w-[200px] transition-all active:scale-95"
                   >
                     {isSaving ? (
                       <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <div className="flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          ذخیره تغییرات
                       </div>
                     )}
                   </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-[#1e293b] border-dashed">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-[#38bdf8]" />
                تنظیمات امنیتی
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="flex items-center justify-between p-4 bg-[#1e293b]/20 rounded-xl border border-[#1e293b]">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">تغییر کلمه عبور</h4>
                    <p className="text-[10px] text-slate-500 mt-1">آخرین تغییر: ۲ ماه پیش</p>
                  </div>
                  <Button variant="outline" className="border-slate-800 text-xs h-9 rounded-lg">تغییر</Button>
               </div>
               <div className="flex items-center justify-between p-4 bg-[#1e293b]/20 rounded-xl border border-[#1e293b]">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">تایید دو مرحله‌ای (2FA)</h4>
                    <p className="text-[10px] text-emerald-500 mt-1">فعال شده است</p>
                  </div>
                  <Button variant="outline" className="border-slate-800 text-xs h-9 rounded-lg text-rose-500 hover:text-rose-600">غیرفعال‌سازی</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
