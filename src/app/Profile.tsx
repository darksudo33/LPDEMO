import React, { useState } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Camera, Check, Settings as SettingsIcon, Bell, Lock, Activity, BarChart3, Clock, MapPin, Globe, Phone, Briefcase, ChevronRight, AlertCircle, History, Ship, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const currentUser = useMockStore(state => state.currentUser);
  const updateCurrentUser = useMockStore(state => state.updateCurrentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    phone: "+98 912 345 6789",
    location: "تهران، ایران",
    bio: "کارشناس ارشد لجستیک و مدیریت زنجیره تامین با ۵ سال سابقه فعالیت در بازارهای بین‌المللی.",
  });

  const [activeTab, setActiveTab] = useState("general");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app we'd upload this. In this demo we simulate by creating a local URL
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: url }));
      toast.success("تصویر آواتار انتخاب شد. برای ذخیره نهایی روی دکمه ذخیره کلیک کنید.");
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateCurrentUser({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      });
      setIsSaving(false);
      toast.success("پروفایل با موفقیت بروزرسانی شد");
    }, 800);
  };

  const loginHistory = [
    { id: 1, device: "Chrome / Windows 11", ip: "192.168.1.1", date: "امروز - ۱۰:۴۵", status: "موفق" },
    { id: 2, device: "Safari / iPhone 15", ip: "185.22.45.10", date: "دیروز - ۲۲:۳۰", status: "موفق" },
    { id: 3, device: "Firefox / macOS", ip: "94.101.55.2", date: "۳ روز پیش", status: "ناموفق" },
  ];

  const stats = [
    { label: "محموله‌های مدیریت شده", value: "۱۴۲", icon: Ship, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "نرخ پاسخگویی", value: "۹۸٪", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "تسک‌های تکمیل شده", value: "۸۵", icon: Check, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "ساعت فعالیت (هفتگی)", value: "۴۲", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 font-sans pb-24 lg:pb-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.1)]">
              <User className="w-7 h-7" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight">تنظیمات حساب کاربری</h1>
              <p className="text-slate-500 text-sm font-medium">مدیریت اطلاعات شخصی، امنیت و پایش عملکرد</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">وضعیت اتصال: ایمن</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <Card className="bg-[#0f172a] border-[#1e293b] overflow-hidden rounded-[2.5rem] shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 blur-[50px] -mr-16 -mt-16" />
            <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
              <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#38bdf8] to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <Avatar className="w-32 h-32 border-4 border-[#0f172a] shadow-xl relative z-10">
                  <AvatarImage src={formData.avatar} className="object-cover" />
                  <AvatarFallback className="bg-slate-800 text-4xl font-black text-[#38bdf8]">{formData.name[0]}</AvatarFallback>
                </Avatar>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-[#020617]/80 backdrop-blur-sm p-3 rounded-full text-white shadow-lg">
                    <Camera className="w-6 h-6" />
                  </div>
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-1">{formData.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-blue-500/10 text-[#38bdf8] border-none text-[10px] font-black uppercase tracking-widest">{currentUser?.role}</Badge>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-slate-500 font-bold">شناسه: #USR-9942</span>
              </div>

              <div className="w-full space-y-3 mb-8">
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30 flex items-center gap-4 text-right">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase">موقعیت</p>
                    <p className="text-xs font-bold text-slate-300 truncate">{formData.location}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30 flex items-center gap-4 text-right">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase">تلفن همراه</p>
                    <p className="text-xs font-bold text-slate-300 truncate">{formData.phone}</p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-6 border-t border-slate-800/50">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">سطح دسترسی</span>
                    <span className="text-[11px] font-black text-emerald-500">پیشرفته</span>
                 </div>
                 <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-l from-[#38bdf8] to-emerald-400" 
                    />
                 </div>
                 <p className="text-[10px] text-slate-600 mt-2 text-center font-medium">۸۵٪ از قابلیت‌های سامانه فعال است</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f172a] border-[#1e293b] rounded-[2.5rem] p-6">
            <h4 className="text-sm font-black text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              خلاصه عملکرد
            </h4>
            <div className="space-y-6">
               {stats.map((stat, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                       <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div className="flex-1 text-right">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{stat.label}</p>
                       <p className="text-lg font-black text-white">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="general" className="w-full flex flex-col" onValueChange={setActiveTab}>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-t-[2.5rem] p-4 md:px-8 md:pt-8 md:pb-2 border-b-0 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <TabsList className="bg-slate-950/50 border border-slate-800/50 p-1.5 h-auto rounded-3xl flex-wrap justify-start">
                  <TabsTrigger value="general" className="rounded-2xl px-5 py-2.5 data-[state=active]:bg-[#38bdf8] data-[state=active]:text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 transition-all">
                    <User className="w-4 h-4" />
                    اطلاعات اصلی
                  </TabsTrigger>
                  <TabsTrigger value="security" className="rounded-2xl px-5 py-2.5 data-[state=active]:bg-[#38bdf8] data-[state=active]:text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 transition-all">
                    <Lock className="w-4 h-4" />
                    امنیت و ورود
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-2xl px-5 py-2.5 data-[state=active]:bg-[#38bdf8] data-[state=active]:text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 transition-all">
                    <Bell className="w-4 h-4" />
                    اعلان‌ها
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="rounded-2xl px-5 py-2.5 data-[state=active]:bg-[#38bdf8] data-[state=active]:text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 transition-all">
                    <BarChart3 className="w-4 h-4" />
                    گزارش عملکرد
                  </TabsTrigger>
                </TabsList>
                <div className="hidden xl:flex items-center gap-2 bg-slate-950/30 px-4 py-2 rounded-full border border-slate-800/50">
                  <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">پنل مدیریت یکپارچه</span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="general" key="general" className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="bg-[#0f172a] border-[#1e293b] rounded-b-[2.5rem] rounded-t-none border-t-0 shadow-2xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-800/50 bg-slate-900/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black text-white">ویرایش پروفایل</CardTitle>
                          <CardDescription className="text-xs text-slate-500 font-medium">اطلاعات عمومی و بیوگرافی حرفه‌ای خود را مدیریت کنید.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">نام و نام خانوادگی</Label>
                            <div className="relative group">
                              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
                              <Input 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-slate-950/50 border-slate-800 pr-12 focus:border-[#38bdf8]/50 focus:ring-0 rounded-2xl h-14 text-white text-sm font-bold shadow-inner" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">پست الکترونیک</Label>
                            <div className="relative">
                              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <Input 
                                value={formData.email}
                                disabled
                                className="bg-slate-950/50 border-slate-800 pr-12 opacity-50 cursor-not-allowed rounded-2xl h-14 text-slate-400 font-bold" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">موقعیت جغرافیایی</Label>
                            <div className="relative group">
                              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
                              <Input 
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="bg-slate-950/50 border-slate-800 pr-12 focus:border-[#38bdf8]/50 focus:ring-0 rounded-2xl h-14 text-white text-sm font-bold shadow-inner" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">شماره تماس</Label>
                            <div className="relative group">
                              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
                              <Input 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="bg-slate-950/50 border-slate-800 pr-12 focus:border-[#38bdf8]/50 focus:ring-0 rounded-2xl h-14 text-white text-sm font-bold shadow-inner text-left dir-ltr" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">بیوگرافی و تخصص</Label>
                          <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-sm text-white font-medium min-h-[120px] focus:border-[#38bdf8]/50 focus:ring-0 outline-none transition-all shadow-inner leading-relaxed"
                          />
                        </div>

                        <div className="pt-4 flex items-center justify-end">
                           <Button 
                            type="submit" 
                            disabled={isSaving}
                            className="bg-[#38bdf8] hover:bg-[#0284c7] text-[#020617] font-black h-14 px-10 rounded-2xl min-w-[200px] transition-all active:scale-95 shadow-xl shadow-[#38bdf8]/10"
                           >
                             {isSaving ? (
                               <div className="flex items-center gap-3">
                                 <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                                 <span>در حال ذخیره...</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2">
                                  <Check className="w-6 h-6" />
                                  ثبت تغییرات نهایی
                               </div>
                             )}
                           </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="security" key="security" className="mt-0 focus-visible:outline-none">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                >
                  <div className="bg-[#0f172a] border border-[#1e293b] border-t-0 p-6 md:p-8 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      <div className="p-8 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 hover:border-[#38bdf8]/30 transition-colors">
                         <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                            <Lock className="w-6 h-6" />
                         </div>
                         <h4 className="text-xl font-black text-white mb-2">تغییر کلمه عبور</h4>
                         <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                           برای امنیت بیشتر، پیشنهاد می‌شود هر ۳ ماه یکبار کلمه عبور خود را تغییر دهید.
                         </p>
                         <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 rounded-2xl">درخواست تغییر رمز</Button>
                      </div>

                      <div className="p-8 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 hover:border-[#38bdf8]/30 transition-colors">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                         </div>
                         <div className="flex items-center justify-between mb-2">
                           <h4 className="text-xl font-black text-white">تایید دو مرحله‌ای</h4>
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-black">فعال</Badge>
                         </div>
                         <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                           حساب شما با استفاده از تایید هویت پیامکی (SMS) محافظت می‌شود.
                         </p>
                         <Button variant="outline" className="w-full border-slate-800 text-rose-500 hover:bg-rose-500/10 rounded-2xl h-12 font-bold">غیرفعال‌سازی موقت</Button>
                      </div>
                    </div>

                    <Card className="mt-8 bg-slate-950/40 border-slate-800 rounded-[2rem] overflow-hidden relative z-10 backdrop-blur-sm">
                      <CardHeader className="p-8 border-b border-slate-800/50">
                         <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-[#38bdf8]" />
                            <CardTitle className="text-lg font-black text-white">تاریخچه فعالیت و ورودها</CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="p-0">
                         <div className="divide-y divide-slate-800/50">
                            {loginHistory.map((item) => (
                              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                 <div className="flex items-center gap-4 text-right">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                                       <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-200">{item.device}</p>
                                       <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.ip} • <span className="font-sans">{item.date}</span></p>
                                    </div>
                                 </div>
                                 <Badge variant="ghost" className="text-[10px] font-black text-emerald-500 bg-emerald-500/5">سیستم ایمن</Badge>
                              </div>
                            ))}
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="notifications" key="notifications" className="mt-0 focus-visible:outline-none">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="bg-[#0f172a] border-[#1e293b] border-t-0 rounded-b-[2.5rem] rounded-t-none p-8 shadow-2xl">
                     <div className="space-y-8">
                        <div className="border-b border-slate-800 pb-6">
                          <h4 className="text-xl font-black text-white mb-2">مدیریت اعلان‌ها</h4>
                          <p className="text-sm text-slate-500 font-medium">نحوه دریافت هشدارها و پیغام‌های سیستم را مدیریت کنید.</p>
                        </div>

                        <div className="space-y-4">
                           {[
                             { title: "تغییر وضعیت محموله‌ها", desc: "اطلاع‌رسانی هنگام پهلوگیری یا ترخیص بار", enabled: true },
                             { title: "پیام‌های جدید چت", desc: "دریافت نوتیفیکیشن هنگام دریافت پیام از همکاران", enabled: true },
                             { title: "هشدارهای امنیتی", desc: "اعلان ورودهای مشکوک یا تلاش ناموفق برای ورود", enabled: true },
                             { title: "پایان مهلت تسک‌ها", desc: "یادآوری کارهایی که به ددلاین خود نزدیک شده‌اند", enabled: false },
                             { title: "گزارش‌های هفتگی", desc: "ارسال ایمیل خلاصه عملکرد در پایان هر هفته", enabled: true },
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-5 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                                <div className="text-right">
                                   <p className="text-sm font-black text-slate-200">{item.title}</p>
                                   <p className="text-[11px] text-slate-500 font-medium mt-1">{item.desc}</p>
                                </div>
                                <div className={cn(
                                  "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors",
                                  item.enabled ? "bg-[#38bdf8]" : "bg-slate-800"
                                )}>
                                   <motion.div 
                                      animate={{ x: item.enabled ? 0 : -24 }}
                                      className="w-4 h-4 bg-white rounded-full shadow-md" 
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="stats" key="stats" className="mt-0 focus-visible:outline-none">
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                 >
                    <div className="bg-[#0f172a] border border-[#1e293b] border-t-0 rounded-b-[2.5rem] rounded-t-none p-6 md:p-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 to-transparent pointer-events-none" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                         <Card className="bg-slate-900/60 border-slate-800/50 rounded-[2rem] p-8 text-center hover:bg-slate-900/80 transition-colors">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">امتیاز تخصص</p>
                            <p className="text-4xl font-black text-white">۴.۸<span className="text-lg text-slate-600 font-medium tracking-normal">/۵</span></p>
                         </Card>
                         <Card className="bg-slate-900/60 border-slate-800/50 rounded-[2rem] p-8 text-center hover:bg-slate-900/80 transition-colors">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">دقت عملیاتی</p>
                            <p className="text-4xl font-black text-white">۹۹<span className="text-lg text-slate-600 font-medium tracking-normal">٪</span></p>
                         </Card>
                         <Card className="bg-slate-900/60 border-slate-800/50 rounded-[2rem] p-8 text-center hover:bg-slate-900/80 transition-colors">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">زمان پاسخ</p>
                            <p className="text-4xl font-black text-white">۳.۵<span className="text-lg text-slate-600 font-medium tracking-normal">m</span></p>
                         </Card>
                      </div>

                      <Card className="bg-slate-950/40 border-slate-800 rounded-[2rem] p-8 relative z-10">
                         <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black text-white">درصد مشارکت در دپارتمان</h4>
                            <span className="text-xs font-bold text-[#38bdf8]">رتبه ۱۲ از ۸۰</span>
                         </div>
                         <div className="space-y-8">
                            {[
                              { label: "مدیریت اسناد", val: 92, color: "#38bdf8" },
                              { label: "هماهنگی لجستیک", val: 85, color: "#10b981" },
                              { label: "ارتباط با مشتری", val: 78, color: "#8b5cf6" },
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-3">
                                 <div className="flex items-center justify-between font-bold">
                                    <span className="text-xs text-slate-400">{item.label}</span>
                                    <span className="text-xs text-white">{item.val}٪</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.val}%` }}
                                      transition={{ duration: 1.2, delay: idx * 0.2 }}
                                      className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                      style={{ backgroundColor: item.color }}
                                    />
                                 </div>
                              </div>
                            ))}
                         </div>
                      </Card>
                    </div>
                 </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: string }) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full text-[9px] font-black",
    variant === "ghost" ? "border border-slate-800" : "",
    className
  )}>
    {children}
  </span>
);
