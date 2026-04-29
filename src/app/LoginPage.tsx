import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockStore } from "@/src/store/useMockStore";
import { mockUsers } from "@/src/lib/mockData";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  Layout,
  MessageSquare,
  Ship,
  ChevronRight,
  Anchor,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useMockStore();

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = mockUsers[0];
      setCurrentUser(demoUser);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans rtl" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Animated Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-[#38bdf8]/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-20 w-[600px] h-[600px] bg-[#38bdf8]/5 rounded-full blur-[120px]" 
        />

        {/* Moving Grid Lines (Simulating digital logistics flow) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 8 + i * 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2 
              }}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#38bdf8]/40 to-transparent"
              style={{ top: `${12 + i * 12}%` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "200%", opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 12 + i * 4, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2.5 
              }}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#38bdf8]/20 to-transparent"
              style={{ right: `${10 + i * 12}%` }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side: Brand & Vibe */}
        <div className="hidden lg:flex flex-col space-y-8 pr-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-[#38bdf8] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#38bdf8]/20"
            >
              <Anchor className="w-8 h-8 text-[#020617]" />
            </motion.div>
            <h1 className="text-5xl font-black text-[#f8fafc] tracking-tighter leading-tight">
              مدیریت هوشمند <br /> 
              <span className="text-[#38bdf8]">لجستیک و حمل و نقل</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              پلتفرم جامع "لجستیک پلاس" برای بهینه‌سازی زنجیره تأمین، پیگیری محموله‌ها و مدیریت دقیق انبارداری.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: TrendingUp, label: "داشبورد تحلیلی", desc: "گزارش‌های زنده و تحلیل روندهای حمل و نقل." },
              { icon: Ship, label: "رهگیری محموله", desc: "پیگیری وضعیت دقیق بار، گمرک و اسناد." },
              { icon: Layout, label: "برد کانبان", desc: "مدیریت وظایف تیم با رابط کاربری پویا." },
              { icon: MessageSquare, label: "چت داخلی", desc: "ارتباط مستقیم و سریع با تیم کالبان و رانندگان." },
            ].map((feature, i) => (
              <motion.div 
                key={feature.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-[#0f172a]/40 backdrop-blur-md border border-[#1e293b] p-5 rounded-3xl hover:border-[#38bdf8]/40 transition-all hover:bg-[#0f172a]/60 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1e293b] flex items-center justify-center mb-4 group-hover:bg-[#38bdf8]/10 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#38bdf8]" />
                </div>
                <h3 className="text-white font-black text-sm mb-1">{feature.label}</h3>
                <p className="text-slate-500 text-[10px] leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>


        {/* Right Side: Login Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[440px] bg-[#0f172a] border border-[#1e293b] rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="lg:hidden mb-6">
               <div className="w-12 h-12 bg-[#38bdf8] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Anchor className="w-6 h-6 text-[#020617]" />
               </div>
               <h2 className="text-2xl font-black text-white tracking-tighter">لجستیک پلاس</h2>
            </div>

            <div className="space-y-2 mb-10">
              <h3 className="text-xl md:text-2xl font-black text-[#f8fafc]">خوش آمدید</h3>
              <p className="text-sm text-slate-400">سیستم آماده بررسی و مدیریت داده‌های لوجستیک است.</p>
            </div>

            <div className="w-full space-y-6 relative z-10">
              <Button 
                onClick={handleDemoLogin}
                disabled={isLoading}
                className={cn(
                  "w-full h-16 rounded-2xl font-black text-lg transition-all relative overflow-hidden group shadow-xl shadow-[#38bdf8]/10",
                  isLoading ? "bg-[#1e293b] text-slate-500" : "bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال راه اندازی پنل...</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="static"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <span>ورود به نسخه دمو</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
              
              <div className="flex flex-col gap-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">محیط تست و ارزیابی</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex -space-x-2 space-x-reverse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0f172a] bg-slate-800" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">پیوستن به +۵۰ مدیر دیگر</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#1e293b] w-full text-center">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                این یک نسخه نمایشی (MVP) است. تمامی داده‌ها به صورت محلی ذخیره شده و پس از رفرش صفحه پاک خواهند شد.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Footer Credit */}
      <div className="absolute bottom-6 left-0 right-0 text-center lg:hidden z-10 px-4">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Logistic Plus v2.4 • Logistics Management Ecosystem</p>
      </div>
    </div>
  );
}
