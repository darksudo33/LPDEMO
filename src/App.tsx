/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Sidebar, TopBar } from "./components/layout/Navbar";
import { useMockStore } from "./store/useMockStore";
import LoginPage from "./app/LoginPage";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard from "./app/Dashboard";
import Shipments from "./app/Shipments";
import Customers from "./app/Customers";
import Tasks from "./app/Tasks";
import Chat from "./app/Chat";
import Track from "./app/Track";
import ShipmentDetail from "./app/ShipmentDetail";
import Documents from "./app/Documents";
import { ShipmentEdit } from "./app/ShipmentEdit";
import ChangeLog from "./app/ChangeLog";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useMockStore(state => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/shipments" element={<ProtectedLayout><Shipments /></ProtectedLayout>} />
          <Route path="/shipments/:id" element={<ProtectedLayout><ShipmentDetail /></ProtectedLayout>} />
          <Route path="/shipments/:id/edit" element={<ProtectedLayout><ShipmentEdit /></ProtectedLayout>} />
          <Route path="/changelog" element={<ProtectedLayout><ChangeLog /></ProtectedLayout>} />
          <Route path="/customers/*" element={<ProtectedLayout><Customers /></ProtectedLayout>} />
          <Route path="/tasks" element={<ProtectedLayout><Tasks /></ProtectedLayout>} />
          <Route path="/documents" element={<ProtectedLayout><Documents /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><Chat /></ProtectedLayout>} />
          <Route path="/track" element={<ProtectedLayout><Track /></ProtectedLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

