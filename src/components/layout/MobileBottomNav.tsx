/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Ship, CheckSquare, MessageSquare, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "داشبورد", path: "/dashboard" },
  { icon: Ship, label: "محموله‌ها", path: "/shipments" },
  { icon: CheckSquare, label: "وظایف", path: "/tasks" },
  { icon: MessageSquare, label: "چت", path: "/chat" },
  { icon: MapPin, label: "رهگیری", path: "/track" },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f172a] border-t border-[#1e293b] flex items-center justify-around px-2 pb-safe z-40 font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
              isActive ? "text-[#38bdf8]" : "text-slate-500"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
            <span className="text-[10px] font-bold">{item.label}</span>
            {isActive && <div className="absolute -bottom-0.5 w-1 h-1 bg-[#38bdf8] rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
};
