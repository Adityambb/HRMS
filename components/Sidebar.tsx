
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Settings, 
  ShieldCheck, 
  Building2,
  ChevronDown,
  CalendarDays,
  Gem,
  Zap,
  ClipboardList
} from 'lucide-react';
import { Client, UserRole } from '../types';

interface SidebarProps {
  userRole: UserRole;
  clients: Client[];
  activeClientId: string;
  onClientChange: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userRole, 
  clients, 
  activeClientId, 
  onClientChange, 
  activeTab, 
  setActiveTab 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'tasks', label: 'Task Management', icon: <ClipboardList size={20} /> },
    { id: 'employees', label: 'Employees', icon: <Users size={20} /> },
    { id: 'attendance', label: 'Roster & Shifts', icon: <Clock size={20} /> },
    { id: 'holidays', label: 'Holiday Calendar', icon: <Gem size={20} /> },
    { id: 'leaves', label: 'Leave Admin', icon: <CalendarDays size={20} /> },
    { id: 'overtime', label: 'Overtime & Man-Days', icon: <Zap size={20} /> },
    { id: 'policies', label: 'Policy Config', icon: <Settings size={20} /> },
  ];

  if (userRole === UserRole.SUPER_ADMIN) {
    menuItems.push({ id: 'clients', label: 'Client Management', icon: <Building2 size={20} /> });
  }

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tighter">
          <ShieldCheck className="text-blue-500" size={28} />
          OmniTime
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-[0.2em]">Enterprise HRMS</p>
      </div>

      <div className="p-4 border-b border-slate-800">
        <label className="text-[9px] text-slate-600 uppercase font-black px-3 mb-2 block tracking-widest">Active Instance</label>
        <div className="relative">
          <select 
            value={activeClientId}
            onChange={(e) => onClientChange(e.target.value)}
            className="w-full bg-slate-800/50 text-slate-100 px-4 py-2.5 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 text-sm font-bold"
          >
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all mb-1 ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 bg-slate-950/30 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
            {userRole.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate">Internal Admin</p>
            <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
