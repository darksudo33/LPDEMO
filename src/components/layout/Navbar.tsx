/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ship, Users, CheckSquare, MessageSquare, MapPin, ChevronRight, ChevronLeft, LogOut, Search, Bell, FileText, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMockStore } from "@/src/store/useMockStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  { icon: Ship, label: "محموله‌ها", path: "/shipments" },
  { icon: Users, label: "مشتریان", path: "/customers" },
  { icon: CheckSquare, label: "وظایف", path: "/tasks" },
  { icon: FileText, label: "اسناد", path: "/documents" },
  { icon: MessageSquare, label: "چت", path: "/chat" },
  { icon: MapPin, label: "رهگیری", path: "/track" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentUser = useMockStore(state => state.currentUser);

  const menuItems = [...sidebarItems];
  if (currentUser?.role === "CEO") {
    menuItems.push({ icon: History, label: "لاگ تغییرات", path: "/changelog" });
  }

  return (
    <div className={cn(
      "h-screen bg-[#0f172a] border-l border-[#1e293b] transition-all duration-300 flex flex-col pt-4",
      collapsed ? "w-20" : "w-[220px]"
    )}>
      <div className="px-6 mb-8 flex items-center justify-between">
        {!collapsed && <span className="text-lg font-bold text-[#38bdf8] tracking-tight">⚓ لوژی‌شارپ</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-slate-400">
          {collapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 px-0 space-y-0">
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

      <div className="p-4 border-t border-[#1e293b]">
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) navigate(link);
  };

  return (
    <header className="h-16 bg-[#0f172a] border-b border-[#1e293b] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="جستجو در محموله‌ها، مشتریان و کد پیگیری..." className="bg-[#1e293b] border-[#334155] pr-10 focus-visible:ring-[#38bdf8]/50 h-9 text-xs text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[13px] text-slate-500 hidden md:block">پنجشنبه، ۲۴ خرداد</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="text-slate-400 h-9 w-9 relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-[#ef4444] text-[8px] text-white animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <DropdownMenuContent className="w-80 bg-slate-900 border-slate-800 text-right p-0" align="end">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">اعلان‌ها</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-[10px] text-[#38bdf8] h-auto p-0 hover:bg-transparent"
                  onClick={markAllNotificationsRead}
                >
                  همه به عنوان خوانده شده
                </Button>
              )}
            </div>
            <ScrollArea className="h-80">
              <div className="flex flex-col">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">اعلانی وجود ندارد.</div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.link)}
                      className={cn(
                        "w-full p-4 border-b border-slate-800/50 hover:bg-slate-800 transition-colors text-right flex flex-col gap-1",
                        !notification.isRead && "bg-[#38bdf8]/5 border-r-2 border-[#38bdf8]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                          notification.type === "INFO" && "bg-blue-500/10 text-blue-400",
                          notification.type === "WARNING" && "bg-amber-500/10 text-amber-400",
                          notification.type === "SUCCESS" && "bg-emerald-500/10 text-emerald-400",
                          notification.type === "URGENT" && "bg-rose-500/10 text-rose-400"
                        )}>
                          {notification.type === "INFO" && "اطلاعیه"}
                          {notification.type === "WARNING" && "هشدار"}
                          {notification.type === "SUCCESS" && "موفقیت"}
                          {notification.type === "URGENT" && "فوری"}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{notification.createdAt.split(' ')[1]}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-200">{notification.title}</p>
                      <p className="text-[10px] text-slate-500 truncate leading-relaxed">{notification.message}</p>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-slate-800">
              <Button variant="ghost" className="w-full h-8 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800">
                مشاهده همه اعلان‌ها
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-[1px] bg-slate-800 mx-2" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">{(currentUser?.name || "U")[0]}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal font-sans">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-slate-500">{currentUser?.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-xs">نمایش پروفایل</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-xs">تنظیمات</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-400/10 cursor-pointer text-xs">
              <LogOut className="w-3 h-3 ml-2" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
