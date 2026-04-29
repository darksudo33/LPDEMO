import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Smartphone, 
  Mail, 
  Moon, 
  Globe, 
  ShieldCheck, 
  Eye, 
  Database,
  ArrowLeft,
  Settings as SettingsIcon,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: false,
    darkMode: true,
    compactMode: false,
    autoTrack: true,
    publicProfile: true,
    persianCalendar: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("تنظیمات با موفقیت ذخیره شد");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans" dir="rtl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
              <SettingsIcon className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight">تنظیمات اصلی سیستم</h1>
              <p className="text-slate-500 text-sm">شخصی‌سازی رابط کاربری و عملکرد سامانه</p>
           </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="border-slate-800 text-slate-400 hover:text-white rounded-xl gap-2 h-10 px-4"
        >
          <ArrowLeft className="w-4 h-4 ml-1" />
          بازگشت
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="bg-[#0f172a] border-[#1e293b] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#38bdf8]" />
              اطلاع‌رسانی
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500 mt-1">مدیریت کانال‌های دریافت اعلان محموله‌ها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between group">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">اعلان‌های مرورگر</Label>
                <p className="text-[10px] text-slate-500">دریافت هشدار مستقیم روی دسکتاپ</p>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={() => toggleSetting('pushNotifications')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
            <Separator className="bg-[#1e293b]/50" />
            <div className="flex items-center justify-between group">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">گزارش‌های ایمیلی</Label>
                <p className="text-[10px] text-slate-500">خلاصه روزانه وضعیت محموله‌های فعال</p>
              </div>
              <Switch 
                checked={settings.emailAlerts} 
                onCheckedChange={() => toggleSetting('emailAlerts')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-[#0f172a] border-[#1e293b] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#38bdf8]" />
              ظاهر و نمایش
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500 mt-1">شخصی‌سازی تم و تراکم اطلاعات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">حالت تاریک (Dark Mode)</Label>
                <p className="text-[10px] text-slate-500">بهینه‌سازی برای محیط‌های کم‌نور</p>
              </div>
              <Switch 
                checked={settings.darkMode} 
                onCheckedChange={() => toggleSetting('darkMode')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
            <Separator className="bg-[#1e293b]/50" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">نمایش فشرده</Label>
                <p className="text-[10px] text-slate-500">کاهش فواصل برای مشاهده اطلاعات بیشتر</p>
              </div>
              <Switch 
                checked={settings.compactMode} 
                onCheckedChange={() => toggleSetting('compactMode')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Operational Settings */}
        <Card className="bg-[#0f172a] border-[#1e293b] shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#38bdf8]" />
              عملیاتی و داده‌ها
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500 mt-1">تنظیمات پیش‌فرض بخش لجستیک</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">رهگیری خودکار</Label>
                <p className="text-[10px] text-slate-500">بروزرسانی وضعیت کانتینرها هر ۱ ساعت</p>
              </div>
              <Switch 
                checked={settings.autoTrack} 
                onCheckedChange={() => toggleSetting('autoTrack')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
            <Separator className="bg-[#1e293b]/50" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-200">استفاده از تقویم خورشیدی</Label>
                <p className="text-[10px] text-slate-500">نمایش تاریخ‌ها به صورت جلالی</p>
              </div>
              <Switch 
                checked={settings.persianCalendar} 
                onCheckedChange={() => toggleSetting('persianCalendar')}
                className="data-[state=checked]:bg-[#38bdf8]" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Summary */}
        <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-[#38bdf8]/20 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all scale-150 rotate-12">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <CardContent className="p-8">
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#38bdf8]" />
              وضعیت امنیتی حساب
            </h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              تمامی داده‌های شما در لایه انتقال (SSL) و همچنین در پایگاه داده با استاندارد AES-256 رمزنگاری می‌شوند. 
              حساب شما با تایید هویت چندعاملی محافظت شده است.
            </p>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-[#38bdf8] w-[92%]" />
              </div>
              <span className="text-[10px] font-bold text-[#38bdf8]">۹۲٪ ایمن</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave}
          className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-black h-12 px-10 rounded-xl shadow-lg shadow-[#38bdf8]/10 flex items-center gap-2 group transition-all"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ذخیره تمامی تنظیمات
        </Button>
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] w-full ${className}`} />;
}
