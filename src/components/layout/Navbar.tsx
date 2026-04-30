/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ship, Users, CheckSquare, MessageSquare, MapPin, ChevronRight, ChevronLeft, LogOut, Search, Bell, FileText, History, Settings as SettingsIcon, Menu, ShieldCheck, CreditCard, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { icon: LayoutDashboard, label: "داشبورد", path: "/dashboard" },
  { icon: Users, label: "مراجعات حضوری", path: "/compliance" },
  { icon: CreditCard, label: "مدیریت چک‌ها", path: "/cheques" },
  { icon: Ship, label: "محموله‌ها", path: "/shipments" },
  { icon: Users, label: "مشتریان", path: "/customers" },
  { icon: Archive, label: "بایگانی", path: "/archive" },
  { icon: ShieldCheck, label: "مدیریت کاربران", path: "/management", ceoOnly: true },
  { icon: CheckSquare, label: "وظایف", path: "/tasks" },
  { icon: FileText, label: "اسناد", path: "/documents" },
  { icon: History, label: "تغییرات", path: "/changelog" },
  { icon: MessageSquare, label: "چت", path: "/chat" },
  { icon: MapPin, label: "رهگیری", path: "/track" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentUser = useMockStore(state => state.currentUser);

  const menuItems = sidebarItems.filter(item => {
    if ((item as any).ceoOnly && currentUser?.role !== "CEO") return false;
    return true;
  });

  return (
    <div className={cn(
      "h-screen bg-[#0f172a] border-l border-[#1e293b] transition-all duration-300 hidden lg:flex flex-col pt-4",
      collapsed ? "w-20" : "w-[220px]"
    )}>
      <div className="px-6 mb-8 flex items-center justify-between font-sans">
        {!collapsed && <span className="text-lg font-bold text-[#38bdf8] tracking-tight">⚓ لجستیک پلاس</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-slate-400">
          {collapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 px-0 space-y-0 font-sans">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-6 py-3 transition-colors text-sm",
              location.pathname.startsWith(item.path)
                ? "bg-[#1e293b] text-white border-r-4 border-[#38bdf8]"
                : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-100"
            )}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e293b] font-sans">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar className="w-8 h-8 rounded-full bg-[#38bdf8] flex items-center justify-center font-bold text-[10px] text-[#020617] border-none">
              <AvatarFallback className="bg-transparent">{currentUser?.name ? currentUser.name.substring(0, 2) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-[#f8fafc]">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 truncate lowercase">{currentUser?.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TopBar = () => {
  const currentUser = useMockStore(state => state.currentUser);
  const setCurrentUser = useMockStore(state => state.setCurrentUser);
  const notifications = useMockStore(state => state.notifications);
  const markNotificationRead = useMockStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useMockStore(state => state.markAllNotificationsRead);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) navigate(link);
  };

  const menuItems = sidebarItems.filter(item => {
    if ((item as any).ceoOnly && currentUser?.role !== "CEO") return false;
    return true;
  });

  return (
    <header className="h-16 bg-[#0f172a] border-b border-[#1e293b] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
              <Menu className="w-5 h-5" />
            </Button>
          } />
          <SheetContent side="right" className="bg-[#0f172a] border-[#1e293b] p-0 w-[240px] text-right font-sans" dir="rtl">
            <SheetHeader className="p-6 border-b border-[#1e293b]">
              <SheetTitle className="text-lg font-bold text-[#38bdf8] text-right">⚓ لجستیک پلاس</SheetTitle>
            </SheetHeader>
            <nav className="p-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm",
                    location.pathname.startsWith(item.path)
                      ? "bg-[#38bdf8]/10 text-[#38bdf8] font-bold"
                      : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-100"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1e293b] bg-[#020617]/50">
               <div className="flex items-center gap-3 px-2">
                  <Avatar className="w-9 h-9 border border-slate-700">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-slate-800 text-[10px] font-bold">{currentUser?.name?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser?.role}</p>
                  </div>
               </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Global Search - Hidden on very small screens */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="جستجو پیشرفته..." className="bg-[#1e293b] border-[#334155] pr-10 focus-visible:ring-[#38bdf8]/50 h-9 text-[11px] text-slate-400 rounded-lg" />
        </div>
        
        {/* Mobile Search Icon only */}
        <Button variant="ghost" size="icon" className="sm:hidden text-slate-400">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-[11px] text-slate-500 hidden xl:block">شنبه، ۷ اردیبهشت ۱۴۰۳</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="text-slate-400 h-9 w-9 relative hover:bg-[#1e293b] rounded-xl">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute top-1 right-1 w-2 h-2 p-0 flex items-center justify-center bg-[#ef4444] border-none animate-pulse">
                  </Badge>
                )}
              </Button>
            }
          />
          <DropdownMenuContent className="w-80 bg-slate-900 border-slate-800 text-right p-0 shadow-2xl" align="end">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">اعلان‌های سیستم</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-[10px] text-[#38bdf8] h-auto p-0 hover:bg-transparent"
                  onClick={markAllNotificationsRead}
                >
                  حذف همه
                </Button>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 text-xs font-medium">اعلانی وجود ندارد.</div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.link)}
                      className={cn(
                        "w-full p-4 border-b border-slate-800/50 hover:bg-slate-800 transition-all text-right flex flex-col gap-1.5",
                        !notification.isRead && "bg-[#38bdf8]/5 border-r-2 border-[#38bdf8]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Badge className={cn(
                          "text-[8px] font-black px-1.5 py-0 border-none rounded-full h-4",
                          notification.type === "INFO" && "bg-blue-500 text-blue-950",
                          notification.type === "WARNING" && "bg-amber-500 text-amber-950",
                          notification.type === "SUCCESS" && "bg-emerald-500 text-emerald-950",
                          notification.type === "URGENT" && "bg-rose-500 text-rose-950"
                        )}>
                          {notification.type === "INFO" && "اطلاعیه"}
                          {notification.type === "WARNING" && "هشدار"}
                          {notification.type === "SUCCESS" && "تایید"}
                          {notification.type === "URGENT" && "فوری"}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono opacity-60">۱۴:۳{notification.id[1]}</span>
                      </div>
                      <p className="text-[11px] font-black text-slate-200 leading-snug">{notification.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{notification.message}</p>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-[1px] bg-slate-800 mx-1 md:mx-2 hidden sm:block" />
        
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 px-1 md:px-2 rounded-xl flex items-center gap-2 hover:bg-[#1e293b]">
                <Avatar className="h-7 w-7 border border-slate-700">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-slate-800 text-slate-300 text-[10px]">{(currentUser?.name || "U")[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-[11px] font-bold text-white leading-none mb-1">{currentUser?.name}</span>
                  <span className="text-[9px] text-slate-500 leading-none">{currentUser?.role}</span>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 p-1" align="end">
             <DropdownMenuGroup className="p-2 border-b border-slate-800">
                <p className="text-[11px] font-bold text-slate-200">{currentUser?.name}</p>
                <p className="text-[9px] text-slate-500">{currentUser?.email}</p>
             </DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/profile")} className="focus:bg-slate-800 cursor-pointer text-xs text-right w-full flex items-center justify-between rounded-lg h-9 mt-1">
              <span>مشاهده پروفایل</span>
              <Users className="w-3 h-3 text-[#38bdf8]" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="focus:bg-slate-800 cursor-pointer text-xs text-right w-full flex items-center justify-between rounded-lg h-9">
              <span>تنظیمات حساب</span>
              <SettingsIcon className="w-3 h-3 text-[#38bdf8]" />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-400/10 cursor-pointer text-xs rounded-lg h-9">
              <LogOut className="w-3 h-3 ml-2" />
              <span>خروج از سامانه</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
