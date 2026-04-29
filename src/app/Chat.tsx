import React, { useState, useMemo, useEffect, useRef } from "react";
import { useMockStore } from "@/src/store/useMockStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  SearchIcon, 
  Plus, 
  MessageSquare,
  Users,
  Truck,
  CreditCard,
  Shield,
  Hash,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Channel, User } from "../types";

type ChatTarget = {
  type: "DM" | "CHANNEL";
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
};

const ChannelIcon = ({ icon, className }: { icon?: string; className?: string }) => {
  switch (icon) {
    case "Users": return <Users className={className} />;
    case "Truck": return <Truck className={className} />;
    case "CreditCard": return <CreditCard className={className} />;
    case "Shield": return <Shield className={className} />;
    default: return <Hash className={className} />;
  }
};

export default function Chat() {
  const users = useMockStore(state => state.users);
  const currentUser = useMockStore(state => state.currentUser);
  const messages = useMockStore(state => state.messages);
  const channels = useMockStore(state => state.channels);
  const addMessage = useMockStore(state => state.addMessage);

  const initialTarget: ChatTarget = channels.length > 0 
    ? { type: "CHANNEL", id: channels[0].id, name: channels[0].name }
    : { type: "DM", id: users[0].id, name: users[0].name, isOnline: users[0].isOnline };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTarget, setActiveTarget] = useState<ChatTarget>(initialTarget);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const chatMessages = useMemo(() => {
    if (activeTarget.type === "DM") {
      return messages.filter(m => 
        !m.isGroup &&
        ((m.senderId === currentUser?.id && m.receiverId === activeTarget.id) ||
        (m.senderId === activeTarget.id && m.receiverId === currentUser?.id))
      );
    } else {
      return messages.filter(m => m.isGroup && m.groupId === activeTarget.id);
    }
  }, [messages, activeTarget, currentUser]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSetTarget = (target: ChatTarget) => {
    setActiveTarget(target);
    // On mobile, close sidebar when target selected
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    if (activeTarget.type === "DM") {
      addMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: activeTarget.id,
        receiverName: activeTarget.name,
        content: newMessage,
        read: false
      });
    } else {
      addMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        groupId: activeTarget.id,
        isGroup: true,
        content: newMessage,
        read: false
      });
    }
    setNewMessage("");
  };

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    (u.name.includes(searchTerm) || u.role.includes(searchTerm))
  );

  const filteredChannels = channels.filter(c => {
    if (!currentUser) return false;
    // Simple permission check: if roleLimit is set, check if user has it OR is CEO
    if (c.roleLimit && currentUser.role !== "CEO" && currentUser.role !== c.roleLimit) {
      return false;
    }
    return c.name.includes(searchTerm);
  });

  return (
    <div className="h-full flex overflow-hidden font-sans relative bg-[#020617]" dir="rtl">
      {/* Sidebar - responsive handling */}
      <div className={cn(
        "absolute inset-0 z-30 lg:relative lg:z-0 lg:flex w-full lg:w-80 border-l border-slate-800 flex flex-col bg-[#020617] transition-all duration-300",
        isSidebarOpen ? "translate-x-0 opacity-100" : "translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
      )}>
        <div className="p-4 shrink-0 flex items-center justify-between border-b border-[#1e293b]/30">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <Input 
              placeholder="جستجو در گفتگوها..." 
              className="bg-[#0f172a] border-slate-800 pr-10 h-10 rounded-xl text-[11px] focus:ring-[#38bdf8]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden mr-2 text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <Plus className="w-5 h-5 rotate-45" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-8 space-y-6">
            {/* Channels Section */}
            <div>
              <h3 className="text-[10px] font-black text-slate-500 px-3 mb-3 uppercase tracking-widest flex items-center justify-between">
                کانال‌های سازمانی
                <Plus className="w-3 h-3 cursor-pointer hover:text-white" />
              </h3>
              <div className="space-y-1">
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleSetTarget({ type: "CHANNEL", id: channel.id, name: channel.name })}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-right group",
                      activeTarget.type === "CHANNEL" && activeTarget.id === channel.id 
                        ? "bg-[#38bdf8]/10 text-white shadow-sm" 
                        : "hover:bg-slate-800 text-slate-400"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      activeTarget.type === "CHANNEL" && activeTarget.id === channel.id ? "bg-[#38bdf8] text-[#020617]" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                    )}>
                      <ChannelIcon icon={channel.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-bold truncate",
                        activeTarget.type === "CHANNEL" && activeTarget.id === channel.id ? "text-[#38bdf8]" : "group-hover:text-slate-200"
                      )}>{channel.name}</p>
                      <p className="text-[10px] opacity-40 truncate">آخرین پیام در این کانال...</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <h3 className="text-[10px] font-black text-slate-500 px-3 mb-3 uppercase tracking-widest">گفتگوهای خصوصی</h3>
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSetTarget({ 
                      type: "DM", 
                      id: user.id, 
                      name: user.name, 
                      avatar: user.avatar,
                      isOnline: user.isOnline 
                    })}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-right group",
                      activeTarget.type === "DM" && activeTarget.id === user.id 
                        ? "bg-[#38bdf8]/10 text-white" 
                        : "hover:bg-slate-800 text-slate-400"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-10 h-10 border border-[#1e293b]">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-slate-900 text-[10px] font-bold">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#020617] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className={cn(
                        "text-xs font-bold truncate",
                        activeTarget.type === "DM" && activeTarget.id === user.id ? "text-[#38bdf8]" : "group-hover:text-slate-200"
                      )}>{user.name}</p>
                       <p className="text-[9px] opacity-40 truncate">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#020617] relative">
        {/* Header */}
        <div className="h-14 md:h-16 px-3 md:px-6 border-b border-[#1e293b] flex items-center justify-between shrink-0 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-3">
             <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-[#38bdf8] hover:bg-[#38bdf8]/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}>
               <ArrowRight className="w-5 h-5" />
             </Button>
             {activeTarget.type === "DM" ? (
               <div className="relative">
                 <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-[#1e293b]">
                    <AvatarImage src={activeTarget.avatar} />
                    <AvatarFallback className="bg-slate-900 font-bold">{activeTarget.name[0]}</AvatarFallback>
                 </Avatar>
                 {activeTarget.isOnline && (
                   <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full" />
                 )}
               </div>
             ) : (
               <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
                  <ChannelIcon icon={channels.find(c => c.id === activeTarget.id)?.icon} className="w-5 h-5" />
               </div>
             )}
             <div className="min-w-0">
                <h4 className="font-bold text-xs md:text-sm tracking-tight truncate">{activeTarget.name}</h4>
                <div className="flex items-center gap-1.5">
                   <span className="text-[9px] md:text-[10px] text-slate-500 font-medium truncate">
                     {activeTarget.type === "DM" ? (activeTarget.isOnline ? "در دسترس" : "نامشخص") : "کانال عمومی"}
                   </span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-lg h-8 w-8"><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-lg h-8 w-8 sm:flex hidden"><SearchIcon className="w-4 h-4" /></Button>
            <Separator orientation="vertical" className="h-5 bg-[#1e293b] mx-1 sm:mx-2" />
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-lg h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scroll-smooth px-4 md:px-6 pt-6 pb-4">
          <div className="flex flex-col gap-6 min-h-full">
            {chatMessages.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                  <div className="w-20 h-20 bg-[#0f172a] rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-slate-800 transition-all opacity-20">
                     <MessageSquare className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase opacity-40">آغاز گفتگو</p>
               </div>
            )}
            
            <div className="space-y-6">
              {chatMessages.map((msg, index) => {
                const isMe = msg.senderId === currentUser?.id;
                const showSender = activeTarget.type === "CHANNEL" && !isMe;
                
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                      isMe ? "items-start" : "items-end"
                    )}
                  >
                    {showSender && (
                      <span className="text-[10px] font-bold text-slate-500 mb-1 pr-1">{msg.senderName}</span>
                    )}
                    <div className="flex items-end gap-1.5 max-w-[90%] md:max-w-[70%] lg:max-w-[50%]">
                      <div
                        className={cn(
                          "px-3.5 py-2.5 md:px-5 md:py-3 rounded-2xl text-[12px] md:text-[13px] leading-relaxed shadow-sm",
                          isMe 
                            ? "bg-[#38bdf8] text-[#020617] font-black rounded-br-none" 
                            : "bg-[#0f172a] text-slate-100 border border-slate-800 rounded-bl-none font-medium"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-600 mt-2 px-1 font-mono">
                      {msg.createdAt.split(' ').slice(-1)}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Dynamic Composing Area */}
        <div className="p-4 bg-[#020617] shrink-0 border-t border-[#1e293b]">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-[#0f172a] p-2 rounded-2xl border border-slate-800/50 shadow-2xl transition-all focus-within:border-[#38bdf8]/30 group">
             <Button variant="ghost" size="icon" type="button" className="text-slate-500 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 rounded-xl h-11 w-11 transition-all">
                <Plus className="w-5 h-5" />
             </Button>
             <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`ارسال پیام به ${activeTarget.name}...`} 
                className="flex-1 bg-transparent border-none focus-visible:ring-0 placeholder:text-slate-600 h-11 text-xs" 
             />
             <Button 
               type="submit" 
               size="icon" 
               disabled={!newMessage.trim()}
               className={cn(
                 "rounded-xl h-11 w-11 transition-all shadow-lg",
                 newMessage.trim() ? "bg-[#38bdf8] text-[#020617] scale-100" : "bg-slate-800 text-slate-500 scale-95 opacity-50"
               )}
             >
                <Send className="w-5 h-5 shrink-0" />
             </Button>
          </form>
          <p className="text-[9px] text-slate-600 text-center mt-2 font-medium">Shift + Enter برای خط جدید</p>
        </div>
      </div>
    </div>
  );
}
