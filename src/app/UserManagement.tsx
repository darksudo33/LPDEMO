import React, { useState } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  MoreHorizontal, 
  Mail, 
  UserCheck, 
  UserX,
  Search,
  Filter,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "../types";
import { cn } from "@/lib/utils";

export default function UserManagement() {
  const users = useMockStore(state => state.users);
  const currentUser = useMockStore(state => state.currentUser);
  const addUser = useMockStore(state => state.addUser);
  const updateUser = useMockStore(state => state.updateUser);
  const deleteUser = useMockStore(state => state.deleteUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "OPERATIONS" as UserRole,
  });

  const filteredUsers = React.useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.includes(searchTerm) || u.email.includes(searchTerm);
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("لطفا تمامی فیلدها را تکمیل کنید");
      return;
    }
    addUser({
      ...newUser,
      isOnline: false,
      avatar: "",
    });
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", role: "OPERATIONS" });
    toast.success("کاربر جدید با موفقیت اضافه شد");
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUser(userId, { role: newRole });
    toast.success("سطح دسترسی کاربر تغییر یافت");
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
       toast.error("شما نمی‌توانید حساب کاربری خودتان را حذف کنید");
       return;
    }
    deleteUser(userId);
    toast.success("کاربر با موفقیت حذف شد");
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 font-sans" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/20 shadow-xl shadow-[#38bdf8]/5 shrink-0">
            <Users className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">مدیریت پرسنل</h1>
            <p className="text-slate-500 text-[10px] md:text-sm mt-0.5">مدیریت دسترسی‌ها و نقش‌ها</p>
          </div>
        </div>

        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-black h-12 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#38bdf8]/10 group transition-all">
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                افزودن کاربر جدید
              </Button>
            }
          />
          <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">تعریف همکار جدید</DialogTitle>
              <DialogDescription className="text-slate-500">اطلاعات پایه و سطح دسترسی کاربر را مشخص کنید.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400">نام و نام خانوادگی</Label>
                <Input 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-slate-950 border-slate-800 rounded-xl h-11" 
                  placeholder="مثال: مرتضی کریمی"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400">ایمیل سازمانی</Label>
                <Input 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="bg-slate-950 border-slate-800 rounded-xl h-11" 
                  placeholder="m.karimi@logisharp.ir"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400">نقش سازمانی</Label>
                <Select value={newUser.role} onValueChange={(val: any) => setNewUser({...newUser, role: val})}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-[#1e293b] text-white">
                    <SelectItem value="CEO">مدیر ارشد (CEO)</SelectItem>
                    <SelectItem value="MANAGER">مدیر عملیات</SelectItem>
                    <SelectItem value="OPERATIONS">کارشناس لجستیک</SelectItem>
                    <SelectItem value="FINANCE">امور مالی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser} className="w-full bg-[#38bdf8] text-[#020617] font-black h-12 rounded-xl">
                تایید و ارسال دعوت‌نامه
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
         <Card className="bg-[#0f172a] border-[#1e293b] p-4 md:p-5 flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">کل پرسنل</span>
            <span className="text-xl md:text-3xl font-black text-white">{users.length} نفر</span>
         </Card>
         <Card className="bg-[#0f172a] border-[#1e293b] p-4 md:p-5 flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">آنلاین</span>
            <span className="text-xl md:text-3xl font-black text-emerald-500">{users.filter(u => u.isOnline).length} نفر</span>
         </Card>
         <Card className="bg-[#0f172a] border-[#1e293b] p-4 md:p-5 flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">دسترسی ادمین</span>
            <span className="text-xl md:text-3xl font-black text-[#38bdf8]">{users.filter(u => u.role === "CEO" || u.role === "MANAGER").length} نفر</span>
         </Card>
         <Card className="bg-[#0f172a] border-[#1e293b] p-4 md:p-5 flex flex-col gap-1 border-dashed border-slate-800">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ظرفیت تیم</span>
            <span className="text-xl md:text-3xl font-black text-slate-700">۸ / ۲۵</span>
         </Card>
      </div>

      <Card className="bg-[#0f172a] border-[#1e293b] overflow-hidden">
        <div className="p-4 border-b border-[#1e293b] bg-[#1e293b]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="جستجو بر اساس نام یا ایمیل..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950/50 border-slate-800 pr-10 focus:ring-[#38bdf8] h-10 rounded-xl text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 sm:block hidden" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-slate-950/50 border-slate-800 h-10 rounded-xl text-xs">
                <SelectValue placeholder="فیلتر نقش" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f172a] border-[#1e293b] text-white" dir="rtl">
                <SelectItem value="ALL">همه نقش‌ها</SelectItem>
                <SelectItem value="CEO">مدیر ارشد</SelectItem>
                <SelectItem value="MANAGER">مدیر</SelectItem>
                <SelectItem value="OPERATIONS">عملیات</SelectItem>
                <SelectItem value="FINANCE">مالی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0f172a] text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-[#1e293b]">
                <th className="px-6 py-4">کاربر</th>
                <th className="px-6 py-4">ایمیل و شناسه</th>
                <th className="px-6 py-4">نقش سازمانی</th>
                <th className="px-6 py-4">وضعیت</th>
                <th className="px-6 py-4">تاریخ عضویت</th>
                <th className="px-6 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#1e293b]/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 border border-slate-800">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-slate-900 text-xs font-bold">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#38bdf8] transition-colors">{user.name}</span>
                        {user.id === currentUser?.id && <span className="text-[9px] text-[#38bdf8] font-bold">شما</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 font-mono">{user.email}</span>
                      <span className="text-[9px] text-slate-600 font-mono">ID: {user.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <Badge className={cn(
                       "bg-[#38bdf8]/10 text-[#38bdf8] border-none text-[10px] font-bold px-2 py-1",
                       user.role === "CEO" && "bg-orange-500/10 text-orange-400",
                       user.role === "MANAGER" && "bg-purple-500/10 text-purple-400",
                       user.role === "FINANCE" && "bg-emerald-500/10 text-emerald-400"
                     )}>
                       {user.role}
                     </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Switch 
                        checked={true} // Default active for mock
                        className="data-[state=checked]:bg-emerald-500 scale-75"
                       />
                       <span className="text-[10px] text-slate-400 font-bold">فعال</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono tracking-tighter">
                    ۱۴۰۳/۰۱/۱۲
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent className="bg-[#0f172a] border-[#1e293b] text-white w-48 text-right grow-0 shadow-2xl" align="end" dir="rtl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] text-slate-500">مدیریت دسترسی</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "CEO")} className="rounded-lg">تغییر به مدیر ارشد</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "MANAGER")} className="rounded-lg">تغییر به مدیر عملیات</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "OPERATIONS")} className="rounded-lg">تغییر به کارشناس</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "FINANCE")} className="rounded-lg">تغییر به مالی</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-[#1e293b]" />
                        <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 rounded-lg" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="w-3 h-3 ml-2" />
                          حذف کامل حساب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
