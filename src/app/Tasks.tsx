import React, { useState, useMemo } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Calendar, 
  AlertCircle, 
  GripVertical, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  CheckCircle2,
  Clock,
  MoreVertical,
  User as UserIcon,
  Ship
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    LOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
  };
  const labels: Record<string, string> = {
    LOW: "پایین",
    MEDIUM: "متوسط",
    HIGH: "بالا",
    URGENT: "فوری",
  };
  return (
    <Badge variant="outline" className={cn(styles[priority] || "", "text-[10px] font-bold px-1.5 py-0")}>
      {labels[priority] || priority}
    </Badge>
  );
};

const SortableTaskCard = ({ 
  task, 
  onEdit, 
  onDelete 
}: { 
  task: Task, 
  onEdit: (task: Task) => void,
  onDelete: (id: string) => void,
  key?: string
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const users = useMockStore(state => state.users);
  const shipments = useMockStore(state => state.shipments);
  
  const assignedUser = React.useMemo(() => users.find(u => u.id === task.assignedToUserId), [users, task.assignedToUserId]);
  const linkedShipment = React.useMemo(() => shipments.find(s => s.id === task.shipmentId), [shipments, task.shipmentId]);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group", isDragging && "opacity-50")}>
      <Card className="bg-[#1e293b] border-[#334155] hover:border-[#38bdf8]/50 transition-all cursor-default shadow-lg overflow-hidden">
        <CardContent className="p-3 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-[13px] font-medium leading-tight text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors line-clamp-2">
              {task.title}
            </h4>
            <div {...attributes} {...listeners} className="p-1 -mt-1 -mr-1 text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          </div>
          
          {task.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {linkedShipment && (
            <div className="flex items-center gap-1.5 bg-[#0f172a]/40 px-2 py-1 rounded-lg border border-[#334155]/30 w-fit">
              <Ship className="w-2.5 h-2.5 text-[#38bdf8]" />
              <span className="text-[9px] font-mono font-bold text-[#38bdf8]">{linkedShipment.trackingNumber}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-[#334155]/50">
            <div className="flex items-center gap-2 ltr">
              <Avatar className="w-6 h-6 border border-[#334155]">
                <AvatarImage src={assignedUser?.avatar} />
                <AvatarFallback className="bg-[#334155] text-[10px] text-slate-300 font-bold">
                  {assignedUser?.name 
                    ? assignedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                    : <UserIcon className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-bold text-slate-400 truncate max-w-[100px]">
                {assignedUser?.name || "بدون مسئول"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {task.dueDate}
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <div className="flex justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-slate-500 hover:text-white hover:bg-slate-800"
              onClick={() => onEdit(task)}
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-slate-500 hover:text-red-500 hover:bg-red-500/10"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KanbanColumn = ({ 
  title, 
  status, 
  tasks,
  onEdit,
  onDelete
}: { 
  title: string, 
  status: TaskStatus, 
  tasks: Task[],
  onEdit: (task: Task) => void,
  onDelete: (id: string) => void,
  key?: string
}) => {
  return (
    <div className="flex flex-col gap-3 min-w-[300px] w-full lg:w-1/3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === "TODO" ? "bg-slate-400" : status === "IN_PROGRESS" ? "bg-blue-500" : "bg-green-500"
          )} />
          <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">{title}</h3>
          <span className="bg-[#1e293b] px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-bold">{tasks.length}</span>
        </div>
      </div>
      
      <div className="flex-1 bg-[#0f172a]/60 border border-[#1e293b] rounded-2xl p-4 min-h-[600px] scrollbar-thin">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {tasks.map(task => (
              <SortableTaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#1e293b] rounded-xl opacity-20">
                <AlertCircle className="w-6 h-6 mb-2" />
                <span className="text-xs">خالی است</span>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default function Tasks() {
  const allTasks = useMockStore(state => state.tasks);
  const updateTaskStatus = useMockStore(state => state.updateTaskStatus);
  const addTask = useMockStore(state => state.addTask);
  const updateTask = useMockStore(state => state.updateTask);
  const deleteTask = useMockStore(state => state.deleteTask);
  const users = useMockStore(state => state.users);
  const shipments = useMockStore(state => state.shipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as const,
    assignedToUserId: "",
    dueDate: "",
    status: "TODO" as TaskStatus,
    shipmentId: ""
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [allTasks, searchTerm, priorityFilter]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // Check if dragging over a column
    if (["TODO", "IN_PROGRESS", "DONE"].includes(overId as string)) {
       updateTaskStatus(taskId, overId as TaskStatus);
       return;
    }

    // Check if dragging over another task
    const overTask = allTasks.find(t => t.id === overId);
    if (overTask && overTask.status !== (active.data.current?.status || "")) {
       updateTaskStatus(taskId, overTask.status);
    }
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedToUserId: users[0]?.id || "",
      dueDate: "۱۴۰۳/۰۵/۰۱",
      status: "TODO",
      shipmentId: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority as any,
      assignedToUserId: task.assignedToUserId || "",
      dueDate: task.dueDate || "",
      status: task.status,
      shipmentId: task.shipmentId || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title) return;
    
    const assignedUser = users.find(u => u.id === formData.assignedToUserId);
    const finalData = {
      ...formData,
      assignedToName: assignedUser?.name || "",
      assignedByName: "مدیر سیستم"
    };

    if (editingTask) {
      updateTask(editingTask.id, finalData);
    } else {
      addTask(finalData);
    }
    setIsDialogOpen(false);
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: "در انتظار", status: "TODO" },
    { title: "در حال انجام", status: "IN_PROGRESS" },
    { title: "تکمیل شده", status: "DONE" },
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#f8fafc]">مدیریت وظایف</h1>
          <p className="text-slate-400 text-sm">پیگیری و مدیریت کارهای جاری تیم لوجستیک.</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] font-bold px-6 shadow-lg shadow-[#38bdf8]/10 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4 ml-2" />
          وظیفه جدید
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-[#1e293b]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="جستجوی وظایف..." 
            className="bg-[#1e293b] border-[#334155] text-xs h-10 pr-10 focus:ring-[#38bdf8]/50" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">اولویت:</span>
          <div className="flex bg-[#1e293b] rounded-lg p-0.5 border border-[#334155]">
            {["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                  priorityFilter === p 
                    ? "bg-[#38bdf8] text-[#020617]" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {p === "ALL" ? "همه" : p === "LOW" ? "پایین" : p === "MEDIUM" ? "متوسط" : p === "HIGH" ? "بالا" : "فوری"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
          <div className="flex gap-6 h-full min-w-max pr-1">
            {columns.map(col => (
              <KanbanColumn 
                key={col.status} 
                title={col.title} 
                status={col.status} 
                tasks={filteredTasks.filter(t => t.status === col.status)}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0f172a] border-[#1e293b] text-[#f8fafc] text-right sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingTask ? <Edit2 className="w-5 h-5 text-[#38bdf8]" /> : <Plus className="w-5 h-5 text-[#38bdf8]" />}
              {editingTask ? "ویرایش وظیفه" : "تعریف وظیفه جدید"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs text-slate-400">عنوان وظیفه</Label>
              <Input 
                id="title" 
                className="bg-[#1e293b] border-[#334155] focus:ring-[#38bdf8]/50" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-xs text-slate-400">توضیحات</Label>
              <textarea 
                id="desc" 
                className="w-full bg-[#1e293b] border-[#334155] rounded-md p-3 text-sm min-h-[80px] outline-none focus:ring-1 focus:ring-[#38bdf8]/50"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">اولویت</Label>
                <select 
                  className="w-full bg-[#1e293b] border-[#334155] rounded-md h-9 text-xs px-2"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="LOW">پایین</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">بالا</option>
                  <option value="URGENT">فوری</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">مسئول انجام</Label>
                <select 
                  className="w-full bg-[#1e293b] border-[#334155] rounded-md h-9 text-xs px-2"
                  value={formData.assignedToUserId}
                  onChange={e => setFormData({...formData, assignedToUserId: e.target.value})}
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">تاریخ سررسید</Label>
                <Input 
                  className="bg-[#1e293b] border-[#334155] h-9 text-xs" 
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  placeholder="۱۴۰۳/۰۵/۰۱"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">وضعیت</Label>
                <select 
                  className="w-full bg-[#1e293b] border-[#334155] rounded-md h-9 text-xs px-2"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="TODO">در انتظار</option>
                  <option value="IN_PROGRESS">در حال انجام</option>
                  <option value="DONE">تکمیل شده</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentId" className="text-xs text-slate-400">لینک به محموله (اختیاری)</Label>
              <select 
                id="shipmentId"
                className="w-full bg-[#1e293b] border-[#334155] rounded-md h-9 text-xs px-2"
                value={formData.shipmentId}
                onChange={e => setFormData({...formData, shipmentId: e.target.value})}
              >
                <option value="">بدون محموله</option>
                {shipments.map(s => (
                  <option key={s.id} value={s.id}>{s.trackingNumber} - {s.customerName}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1 border-[#334155] hover:bg-[#1e293b]" onClick={() => setIsDialogOpen(false)}>
              انصراف
            </Button>
            <Button className="flex-1 bg-[#38bdf8] text-[#020617] font-bold" onClick={handleSubmit}>
              {editingTask ? "بروزرسانی" : "ایجاد وظیفه"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
