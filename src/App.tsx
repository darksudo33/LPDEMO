/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Sidebar, TopBar } from "./components/layout/Navbar";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { useMockStore } from "./store/useMockStore";
import LoginPage from "./app/LoginPage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import Dashboard from "./app/Dashboard";
import Shipments from "./app/Shipments";
import Customers from "./app/Customers";
import Tasks from "./app/Tasks";
import Chat from "./app/Chat";
import Track from "./app/Track";
import Profile from "./app/Profile";
import Settings from "./app/Settings";
import UserManagement from "./app/UserManagement";
import ShipmentDetail from "./app/ShipmentDetail";
import Documents from "./app/Documents";
import { ShipmentEdit } from "./app/ShipmentEdit";
import ChangeLog from "./app/ChangeLog";
import Compliance from "./app/Compliance";
import ChequeManagement from "./app/ChequeManagement";
import ArchivePage from "./app/Archive";
import QuotageManagement from "./app/QuotageManagement";
import CustomerDetail from "./app/CustomerDetail";

import { format } from "date-fns-jalali";

const ComplianceSync = () => {
  const currentUser = useMockStore(state => state.currentUser);
  const appointments = useMockStore(state => state.appointments);
  const updateAppointment = useMockStore(state => state.updateAppointment);
  const addNotification = useMockStore(state => state.addNotification);

  React.useEffect(() => {
    if (!currentUser) return;

    const todayStr = format(new Date(), "yyyy/MM/dd");
    
    // Check for today's appointments for current user that haven't sent a reminder
    const todayApps = appointments.filter(app => 
      app.assignedPersonId === currentUser.id && 
      app.dateTime.startsWith(todayStr) && 
      !app.reminderSent
    );

    if (todayApps.length > 0) {
      todayApps.forEach(app => {
        addNotification({
          title: "یادآوری جلسه امروز",
          message: `شما امروز یک جلسه دارید: ${app.purpose} (ساعت ${app.dateTime.split(' ')[1]})`,
          type: "URGENT",
          link: "/compliance"
        });
        updateAppointment(app.id, { reminderSent: true });
      });
    }
  }, [currentUser, appointments, updateAppointment, addNotification]);

  return null;
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useMockStore(state => state.currentUser);
  const { pathname } = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden" dir="rtl">
      <ComplianceSync />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopBar />
        <main ref={mainRef} className="flex-1 overflow-y-auto w-full pb-16 lg:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};


export default function App() {
  return (
    <TooltipProvider>
      <Toaster position="top-center" dir="rtl" />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/shipments" element={<ProtectedLayout><Shipments /></ProtectedLayout>} />
          <Route path="/shipments/:id" element={<ProtectedLayout><ShipmentDetail /></ProtectedLayout>} />
          <Route path="/shipments/:id/edit" element={<ProtectedLayout><ShipmentEdit /></ProtectedLayout>} />
          <Route path="/changelog" element={<ProtectedLayout><ChangeLog /></ProtectedLayout>} />
          <Route path="/customers" element={<ProtectedLayout><Customers /></ProtectedLayout>} />
          <Route path="/customers/:id" element={<ProtectedLayout><CustomerDetail /></ProtectedLayout>} />
          <Route path="/tasks" element={<ProtectedLayout><Tasks /></ProtectedLayout>} />
          <Route path="/documents" element={<ProtectedLayout><Documents /></ProtectedLayout>} />
          <Route path="/compliance" element={<ProtectedLayout><Compliance /></ProtectedLayout>} />
          <Route path="/cheques" element={<ProtectedLayout><ChequeManagement /></ProtectedLayout>} />
          <Route path="/quotage" element={<ProtectedLayout><QuotageManagement /></ProtectedLayout>} />
          <Route path="/archive" element={<ProtectedLayout><ArchivePage /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><Chat /></ProtectedLayout>} />
          <Route path="/track" element={<ProtectedLayout><Track /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
          <Route path="/management" element={<ProtectedLayout><UserManagement /></ProtectedLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

