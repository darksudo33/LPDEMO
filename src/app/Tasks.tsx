import React, { useState, useMemo } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
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
  Trash2, 
  Edit2, 
  Clock,
  User as UserIcon,
  Ship,
  TrendingUp,
  CheckCircle,
  Layout,
  Filter
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    HIGH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    URGENT: "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
  };
  const labels: Record<string, string> = {
    LOW: "عادی",
    MEDIUM: "متوسط",
    HIGH: "مهم",
    URGENT: "فوری",
  };
  return (
    <Badge variant="outline" className={cn(styles[priority] || "", "text-[9px] font-black px-2 py-0 h-4 border leading-none")}>
      {labels[priority] || priority}
    </Badge>
  );
};

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete,
  isOverlay = false
}: { 
  task: Task, 
  onEdit?: (task: Task) => void,
  onDelete?: (id: string) => void,
  isOverlay?: boolean
}) => {
  const users = useMockStore(state => state.users);
  const shipments = useMockStore(state => state.shipments);
  
  const assignedUser = React.useMemo(() => users.find(u => u.id === task.assignedToUserId), [users, task.assignedToUserId]);
  const linkedShipment = React.useMemo(() => shipments.find(s => s.id === task.shipmentId), [shipments, task.shipmentId]);
  
  return (
    <Card className={cn(
      "bg-[#1e293b] border-[#334155] transition-all cursor-default shadow-xl overflow-hidden group relative",
      !isOverlay && "hover:border-[#38bdf8]/40 hover:shadow-[#38bdf8]/5",
      isOverlay && "border-[#38bdf8] scale-[1.02] shadow-2xl opacity-90 shadow-[#38bdf8]/20"
    )}>
      <CardContent className="p-3.5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-[13px] font-bold leading-snug text-slate-100 group-hover:text-[#38bdf8] transition-colors line-clamp-2">
              {task.title}
            </h4>
          </div>
          <div className="shrink-0 p-1 rounded-md bg-slate-800/50 text-slate-600 opacity-60">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
        
        {task.description && (
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed opacity-80">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {linkedShipment && (
            <div className="flex items-center gap-1.5 bg-[#38bdf8]/5 px-2 py-1 rounded-lg border border-[#38bdf8]/10">
              <Ship className="w-2.5 h-2.5 text-[#38bdf8]" />
              <span className="text-[9px] font-black text-[#38bdf8]">{linkedShipment.trackingNumber}</span>
            </div>
          )}
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#334155]/50">
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5 border border-[#334155] ring-2 ring-transparent group-hover:ring-[#38bdf8]/20 transition-all">
              <AvatarImage src={assignedUser?.avatar} />
              <AvatarFallback className="bg-slate-800 text-[8px] text-slate-400 font-bold">
                {assignedUser?.name?.split?.(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || <UserIcon className="w-2 h-2" />}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-medium text-slate-400 truncate max-w-[80px]">
              {assignedUser?.name || "بدون مسئول"}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-2.5 h-2.5" />
            <span className="text-[9px] font-mono font-bold tracking-tight">{task.dueDate}</span>
          </div>
        </div>

        {!isOverlay && (
          <div className="absolute top-[35%] left-3 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 rounded-lg bg-slate-800/95 text-slate-400 hover:text-white hover:bg-slate-700 shadow-xl border border-slate-700/50 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 rounded-lg bg-slate-800/95 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 shadow-xl border border-slate-700/50 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SortableCard = (props: { 
  task: Task, 
  onEdit: (task: Task) => void,
  onDelete: (id: string) => void,
  key?: React.Key
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: props.task.id,
    data: props.task
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? 0.95 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard {...props} />
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
  key?: React.Key
}) => {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-[350px] min-w-[280px] h-full shrink-0">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "TODO" ? "bg-slate-400" : 
            status === "IN_PROGRESS" ? "bg-blue-500" : 
            "bg-emerald-500"
          )} />
          <h3 className="font-black text-[11px] text-slate-200 uppercase tracking-[0.1em]">{title}</h3>
          <Badge variant="secondary" className="bg-slate-800/50 text-slate-500 border-none text-[9px] h-4.5 px-1.5 rounded-md min-w-[1.5rem] flex justify-center font-black">
            {tasks.length}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-900/30 rounded-[2.5rem] border border-slate-800/50 p-2.5 min-h-[400px] overflow-y-auto custom-scrollbar">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {tasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableCard 
                    task={task} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-800/40 rounded-[2rem] opacity-20">
                <Layout className="w-8 h-8 mb-3" />
                <span className="text-[10px] font-bold">بدون فعالیت</span>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [allTasks, searchTerm, priorityFilter]);

  const activeTask = useMemo(() => 
    activeId ? allTasks.find(t => t.id === activeId) : null
  , [activeId, allTasks]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // Handle column drops
    if (["TODO", "IN_PROGRESS", "DONE"].includes(overId as string)) {
       updateTaskStatus(taskId, overId as TaskStatus);
       return;
    }

    // Handle dropping over another task
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
      dueDate: "۱۴۰۳/۰۵/۱۵",
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
    if (editingTask) updateTask(editingTask.id, finalData);
    else addTask(finalData);
    setIsDialogOpen(false);
  };

  const stats = [
    { label: "کل فعالیت‌ها", value: allTasks.length, icon: Layout, color: "text-slate-400", bg: "bg-slate-400/5" },
    { label: "در جریان", value: allTasks.filter(t => t.status === "IN_PROGRESS").length, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/5" },
    { label: "تکمیل شده", value: allTasks.filter(t => t.status === "DONE").length, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/5" },
    { label: "اولویت بالا", value: allTasks.filter(t => t.priority === "HIGH" || t.priority === "URGENT").length, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/5" },
  ];

  const columns: { title: string; status: TaskStatus }[] = [
    { title: "در انتظار", status: "TODO" },
    { title: "در حال پردازش", status: "IN_PROGRESS" },
    { title: "تکمیل شده", status: "DONE" },
  ];

  return (
    <div className="p-4 md:p-8 min-h-full flex flex-col gap-6 md:gap-8 font-sans bg-[#020617]" dir="rtl">
      {/* Header & Stats Dashboard */}
      <div className="flex flex-col gap-6 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">پنل مانیتورینگ وظایف</h1>
            <p className="text-slate-500 text-[10px] md:text-sm font-medium">پایش هوشمند زنجیره عملیات و پیگیری ددلاین‌ها.</p>
          </div>
          <Button onClick={handleOpenAdd} className="bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-black h-12 px-8 rounded-2xl shadow-[0_4px_20px_rgba(56,189,248,0.3)] transition-all hover:scale-105 active:scale-95 text-xs">
            <Plus className="w-5 h-5 ml-2 stroke-[3]" />
            ثبت فعالیت سیستمی
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Card className="bg-slate-900/50 border-slate-800/50 p-4 relative overflow-hidden group hover:bg-slate-800/80 transition-all border-b-2 border-b-transparent hover:border-b-[#38bdf8]/40">
                <div className={cn("absolute -right-4 -bottom-4 opacity-5 scale-150 transition-all group-hover:scale-125 group-hover:rotate-12", stat.color)}>
                  <stat.icon className="w-20 h-20" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn("p-2.5 rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 shrink-0 px-1">
        <div className="relative flex-1 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
          <Input 
            placeholder="جستجوی هوشمند در فعالیت‌ها..." 
            className="bg-slate-900 border-slate-800 h-12 pr-12 focus:ring-2 focus:ring-[#38bdf8]/20 rounded-2xl w-full border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] text-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800/50 shadow-lg">
          <div className="px-3 text-slate-500 border-l border-slate-800/50">
            <Filter className="w-4 h-4" />
          </div>
          <div className="flex gap-1">
            {["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                  priorityFilter === p 
                    ? "bg-[#38bdf8] text-slate-950 shadow-xl shadow-[#38bdf8]/20" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                )}
              >
                {p === "ALL" ? "همه" : p === "LOW" ? "عادی" : p === "MEDIUM" ? "متوسط" : p === "HIGH" ? "مهم" : "فوری"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Stage */}
      <div className="flex-1">
        <Tabs defaultValue="TODO" className="w-full flex flex-col gap-6">
          <TabsList className="lg:hidden bg-slate-900 p-1 rounded-2xl h-14 flex-row gap-2 border border-slate-800/50">
            {columns.map(col => (
              <TabsTrigger 
                key={col.status} 
                value={col.status} 
                className="flex-1 data-[state=active]:bg-[#38bdf8] data-[state=active]:text-slate-900 rounded-xl py-2 text-[11px] font-black transition-all"
              >
                {col.title}
                <span className="mr-2 opacity-50 font-mono text-[9px]">({filteredTasks.filter(t => t.status === col.status).length})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Kanban columns on Desktop */}
            <div className="hidden lg:flex gap-8 h-full overflow-x-auto pb-4 custom-scrollbar px-1">
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

            {/* Content for Mobile Tabs */}
            <div className="lg:hidden flex-1 overflow-y-auto">
              {columns.map(col => (
                <TabsContent key={col.status} value={col.status} className="mt-0 h-full">
                  <div className="flex flex-col gap-4 pb-20">
                    <SortableContext items={filteredTasks.filter(t => t.status === col.status).map(t => t.id)} strategy={verticalListSortingStrategy}>
                      {filteredTasks.filter(t => t.status === col.status).map(task => (
                        <SortableCard 
                          key={task.id} 
                          task={task} 
                          onEdit={handleEdit} 
                          onDelete={deleteTask} 
                        />
                      ))}
                    </SortableContext>
                    {filteredTasks.filter(t => t.status === col.status).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800/50">
                        <Layout className="w-10 h-10 mb-4 text-slate-700" />
                        <span className="text-xs text-slate-600 font-black">لیست خالی است</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </div>

            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: { opacity: '0.3' },
                },
              }),
            }}>
              {activeTask ? (
                <div style={{ pointerEvents: 'none' }}>
                  <TaskCard task={activeTask} isOverlay />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Tabs>
      </div>

      {/* Edit/Create Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar" dir="rtl">
          <DialogHeader className="mb-4 md:mb-6">
            <DialogTitle className="text-xl md:text-2xl font-black flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-[#38bdf8]/10 rounded-xl md:rounded-2xl">
                {editingTask ? <Edit2 className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" /> : <Plus className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" />}
              </div>
              <div className="flex flex-col text-right">
                <span>{editingTask ? "ویرایش فعالیت" : "تعریف جدید"}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-500 mt-0.5 md:mt-1 uppercase tracking-widest leading-none">Ops Management System</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 md:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">عنوان فعالیت</Label>
              <Input 
                className="bg-slate-800/50 border-slate-800 h-10 md:h-12 text-sm focus:ring-1 focus:ring-[#38bdf8]/50 rounded-xl md:rounded-2xl shadow-inner border-none" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">توضیحات تکمیلی</Label>
              <textarea 
                className="w-full bg-slate-800/50 border-none rounded-xl md:rounded-2xl p-4 text-sm min-h-[80px] md:min-h-[100px] outline-none focus:ring-1 focus:ring-[#38bdf8]/50 resize-none shadow-inner"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">اولویت</Label>
                <select 
                  className="w-full bg-slate-800/50 border-none rounded-xl md:rounded-2xl h-10 md:h-12 text-sm px-4 appearance-none focus:ring-1 focus:ring-[#38bdf8]/50 shadow-inner"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="LOW">عادی</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">مهم</option>
                  <option value="URGENT">فوری</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">مسئول انجام</Label>
                <select 
                  className="w-full bg-slate-800/50 border-none rounded-xl md:rounded-2xl h-10 md:h-12 text-sm px-4 appearance-none focus:ring-1 focus:ring-[#38bdf8]/50 shadow-inner"
                  value={formData.assignedToUserId}
                  onChange={e => setFormData({...formData, assignedToUserId: e.target.value})}
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">تاریخ ددلاین</Label>
                <Input 
                  className="bg-slate-800/50 border-none h-10 md:h-12 text-sm rounded-xl md:rounded-2xl shadow-inner" 
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">وضعیت کنونی</Label>
                <select 
                  className="w-full bg-slate-800/50 border-none rounded-xl md:rounded-2xl h-10 md:h-12 text-sm px-4 appearance-none focus:ring-1 focus:ring-[#38bdf8]/50 shadow-inner"
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
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">ارجاع به بارنامه</Label>
              <select 
                className="w-full bg-slate-800/50 border-none rounded-xl md:rounded-2xl h-10 md:h-12 text-sm px-4 appearance-none focus:ring-1 focus:ring-[#38bdf8]/50 shadow-inner"
                value={formData.shipmentId}
                onChange={e => setFormData({...formData, shipmentId: e.target.value})}
              >
                <option value="">بدون ارجاع</option>
                {shipments.map(s => (
                  <option key={s.id} value={s.id}>{s.trackingNumber} - {s.customerName}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-3 mt-6 md:mt-8">
            <Button variant="ghost" className="flex-1 text-slate-500 hover:text-white h-10 md:h-12" onClick={() => setIsDialogOpen(false)}>انصراف</Button>
            <Button className="flex-[2] bg-[#38bdf8] text-slate-950 font-black h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl shadow-[#38bdf8]/10" onClick={handleSubmit}>
              {editingTask ? "بروزرسانی نهایی" : "تایید و ثبت"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
