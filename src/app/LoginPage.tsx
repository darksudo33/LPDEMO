import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMockStore } from "@/src/store/useMockStore";
import { mockUsers } from "@/src/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(true);
  const navigate = useNavigate();
  const { setCurrentUser } = useMockStore();

  useEffect(() => {
    // Auto login demo user after a short delay
    const timer = setTimeout(() => {
      const demoUser = mockUsers[0];
      setCurrentUser(demoUser);
      navigate("/dashboard");
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate, setCurrentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === email) || mockUsers[0];
    setCurrentUser(user);
    navigate("/dashboard");
  };

  if (isAutoLoggingIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-4 font-sans rtl">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <span className="text-4xl">⚓</span>
           <div className="flex flex-col items-center gap-2 text-center">
             <h1 className="text-2xl font-bold text-[#38bdf8] tracking-tighter">لوژی‌شارپ</h1>
             <p className="text-slate-400 text-sm">در حال ورود به نسخه دموی سیستم...</p>
           </div>
           <Loader2 className="w-6 h-6 text-[#38bdf8] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary tracking-tighter">لوژی‌شارپ</CardTitle>
          <CardDescription className="text-slate-400">سیستم مدیریت لجستیک و حمل و نقل</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2 text-right">
              <Label htmlFor="email">ایمیل</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.ir"
                  className="bg-slate-950 border-slate-800 pr-10 focus-visible:ring-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  className="bg-slate-950 border-slate-800 pr-10 focus-visible:ring-primary/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12">
              ورود به پنل
            </Button>
            <p className="text-xs text-slate-500 text-center">
              تمامی اطلاعات ورود شبیه‌سازی شده هستند.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
