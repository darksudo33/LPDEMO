import React, { useState } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  FileIcon, 
  Plus,
  Ship,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Archive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { DocumentType } from "../types";

export default function Documents() {
  const navigate = useNavigate();
  const documents = useMockStore(state => state.documents);
  const shipments = useMockStore(state => state.shipments);
  const addDocument = useMockStore(state => state.addDocument);
  const deleteDocument = useMockStore(state => state.deleteDocument);
  const archiveDocument = useMockStore(state => state.archiveDocument);
  const currentUser = useMockStore(state => state.currentUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: "",
    type: "OTHER" as DocumentType,
    shipmentId: ""
  });

  const filteredDocs = React.useMemo(() => {
    return documents.filter(doc => {
      const isNotArchived = !doc.isArchived;
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "ALL" || doc.type === typeFilter;
      return isNotArchived && matchesSearch && matchesType;
    });
  }, [documents, searchTerm, typeFilter]);

  const handleAddDoc = () => {
    if (!newDoc.name) return;
    addDocument({
      name: newDoc.name,
      type: newDoc.type,
      shipmentId: newDoc.shipmentId || undefined,
      fileSize: "1.5 MB",
      uploadedBy: currentUser?.name || "مدیر",
      url: "#"
    });
    setIsAddDialogOpen(false);
    setNewDoc({ name: "", type: "OTHER", shipmentId: "" });
  };

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BILL_OF_LADING: "بارنامه",
      INVOICE: "فاکتور",
      PACKING_LIST: "لیست عدل‌بندی",
      CUSTOMS_PERMIT: "پروانه گمرکی",
      INSURANCE: "بیمه‌نامه",
      OTHER: "سایر"
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6 font-sans text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#f8fafc]">مدیریت اسناد</h1>
          <p className="text-slate-500 text-xs mt-1">آرشیو مرکزی تمام فایل‌ها و مدارک شرکت</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-extrabold h-10 px-6 rounded-xl shadow-lg shadow-[#38bdf8]/10 gap-2">
                <Plus className="w-4 h-4" />
                افزودن سند جدید
              </Button>
            }
          />
          <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>آپلود سند جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">نام فایل</Label>
                <Input 
                  className="bg-[#1e293b] border-[#334155]" 
                  value={newDoc.name}
                  onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">نوع سند</Label>
                  <select 
                    className="w-full bg-[#1e293b] border-[#334155] rounded-md h-10 text-xs px-2"
                    value={newDoc.type}
                    onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                  >
                    <option value="BILL_OF_LADING">بارنامه</option>
                    <option value="INVOICE">فاکتور</option>
                    <option value="PACKING_LIST">لیست عدل‌بندی</option>
                    <option value="CUSTOMS_PERMIT">پروانه گمرکی</option>
                    <option value="INSURANCE">بیمه‌نامه</option>
                    <option value="OTHER">سایر</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">اتصال به محموله (اختیاری)</Label>
                  <select 
                    className="w-full bg-[#1e293b] border-[#334155] rounded-md h-10 text-xs px-2"
                    value={newDoc.shipmentId}
                    onChange={e => setNewDoc({...newDoc, shipmentId: e.target.value})}
                  >
                    <option value="">بدون اتصال</option>
                    {shipments.map(s => <option key={s.id} value={s.id}>{s.trackingNumber}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-[#38bdf8] text-[#020617] w-full font-bold" onClick={handleAddDoc}>ذخیره سند</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#0f172a] border-[#1e293b] rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="border-b border-[#1e293b]/50 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="جستجو در اسناد..." 
                className="bg-[#1e293b] border-[#334155] pr-10 text-xs h-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
               <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 text-xs px-4 rounded-lg", typeFilter === "ALL" ? "bg-[#38bdf8] text-[#020617]" : "text-slate-500")}
                onClick={() => setTypeFilter("ALL")}
               >
                 همه
               </Button>
               {["BILL_OF_LADING", "INVOICE", "PACKING_LIST", "CUSTOMS_PERMIT", "INSURANCE", "OTHER"].map(type => (
                 <Button 
                  key={type}
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 text-xs px-4 rounded-lg whitespace-nowrap", typeFilter === type ? "bg-[#38bdf8] text-[#020617]" : "text-slate-500 hover:text-white")}
                  onClick={() => setTypeFilter(type)}
                 >
                   {getDocTypeLabel(type)}
                 </Button>
               ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-right">
             <thead className="bg-[#1e293b]/50 border-b border-[#334155]/30">
                <tr>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">نام فایل</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">نوع</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">محموله مرتبط</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">حجم</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">توسط</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">تاریخ</th>
                   <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">عملیات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#1e293b]/30">
                {filteredDocs.map(doc => {
                  const linkedShipment = shipments.find(s => s.id === doc.shipmentId);
                  return (
                    <tr key={doc.id} className="hover:bg-[#1e293b]/20 transition-colors group">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#38bdf8]">
                                <FileIcon className="w-4 h-4" />
                             </div>
                             <span className="text-xs font-bold text-slate-200">{doc.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-[#1e293b]/50 border-[#334155] text-[10px] px-2 py-0.5">
                             {getDocTypeLabel(doc.type)}
                          </Badge>
                       </td>
                       <td className="px-6 py-4">
                          {linkedShipment ? (
                             <Button 
                              variant="link" 
                              className="p-0 h-auto text-[#38bdf8] text-xs font-mono group-hover:underline"
                              onClick={() => navigate(`/shipments/${linkedShipment.id}`)}
                             >
                                <Ship className="w-3 h-3 ml-1" />
                                {linkedShipment.trackingNumber}
                             </Button>
                          ) : (
                             <span className="text-[10px] text-slate-600">---</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-[11px] text-slate-500">{doc.fileSize}</td>
                       <td className="px-6 py-4 text-xs text-slate-300">{doc.uploadedBy}</td>
                       <td className="px-6 py-4 text-[11px] text-slate-500 font-mono">{doc.createdAt}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                <Download className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => { archiveDocument(doc.id); toast.success("سند با موفقیت بایگانی شد."); }}>
                                <Archive className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => { deleteDocument(doc.id); toast.error("سند حذف شد."); }}>
                                <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                       </td>
                    </tr>
                  );
                })}
             </tbody>
          </table>
          {filteredDocs.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
               <FileText className="w-12 h-12 mb-4 opacity-10" />
               <p className="text-sm">هیچ سندی با این مشخصات یافت نشد.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
