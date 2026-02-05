
import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Star, Settings, Trash2, Edit3, Filter, XCircle, Send, Gem, Info } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Holiday } from '../types';

interface HolidayManagerProps {
  holidays: Holiday[];
  onAddHoliday?: (name: string, date: string, isFixed: boolean) => void;
  onDeleteHoliday?: (id: string) => void;
  isEmployeeMode?: boolean;
}

const HolidayManager: React.FC<HolidayManagerProps> = ({ holidays, onAddHoliday, onDeleteHoliday, isEmployeeMode }) => {
  const activeClient = MOCK_CLIENTS[0];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isFixed, setIsFixed] = useState(true);

  const handleAdd = () => {
    if (!newName || !newDate) {
      alert("Please fill in both holiday name and date.");
      return;
    }
    onAddHoliday?.(newName, newDate, isFixed);
    setShowAddModal(false);
    setNewName('');
    setNewDate('');
  };

  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (isEmployeeMode) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Holiday Calendar <span className="text-blue-600">2026</span></h2>
          <p className="text-slate-500 font-medium mt-2">Planned corporate downtime and optional festivals for the upcoming year</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHolidays.map((h) => {
            const dateObj = new Date(h.date);
            const isPast = dateObj < new Date();
            return (
              <div key={h.id} className={`bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all ${isPast ? 'opacity-50 grayscale' : ''}`}>
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${h.isFixed ? 'bg-blue-600' : 'bg-amber-500'} text-white shadow-lg`}>
                       <Gem size={24} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${h.isFixed ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                       {h.isFixed ? 'Fixed Holiday' : 'Optional/Flexi'}
                    </span>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 mb-2">{h.name}</h4>
                 <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Calendar size={16} />
                    <span>{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                 </div>
                 {isPast && (
                   <div className="absolute top-10 right-10 rotate-12 opacity-10 font-black text-4xl uppercase tracking-widest text-slate-400">Past</div>
                 )}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 p-10 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-500/20 rounded-3xl text-blue-400">
                 <Info size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black">Flexi Holiday Policy</h4>
                 <p className="text-slate-400 text-sm mt-1 max-w-lg">Employees are entitled to select up to 2 Optional Holidays from the Flexi pool. Please apply at least 7 days in advance through the Leave Hub.</p>
              </div>
           </div>
           <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-blue-900">
             Read Full Policy
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Holiday Calendar 2026</h2>
          <p className="text-slate-500 font-medium">Independent client calendar for {activeClient.name}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={16} /> Add Holiday
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 max-w-lg w-full p-10 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><XCircle /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-8">Define New Holiday</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Holiday Name</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Founder's Day" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Date (2026 Preferred)</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type:</label>
                  <div className="flex gap-2">
                     <button onClick={() => setIsFixed(true)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isFixed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>Fixed</button>
                     <button onClick={() => setIsFixed(false)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${!isFixed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>Flexi</button>
                  </div>
                </div>
                <button onClick={handleAdd} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all">
                  <Send size={14} /> Add to Calendar
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Holiday Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedHolidays.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-900">{h.name}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${h.isFixed ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {h.isFixed ? 'Fixed' : 'Flexi'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button 
                        onClick={() => onDeleteHoliday?.(h.id)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                       ><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedHolidays.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-8 py-20 text-center text-slate-400 uppercase text-xs font-black tracking-widest">No holidays defined for this client</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden">
            <Settings className="text-blue-400 mb-6 relative z-10" size={24} />
            <h4 className="text-lg font-black mb-2 relative z-10">Calendar Settings</h4>
            <p className="text-xs text-slate-500 font-medium mb-8 relative z-10">Rule changes apply instantly across all branches.</p>
            <div className="space-y-4 relative z-10">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase">Flexi Limit</p>
                 <p className="text-xs font-black">{activeClient.flexiHolidayLimit} Days</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase">Year Type</p>
                 <p className="text-xs font-black">{activeClient.holidayYearType}</p>
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5">
               <Calendar size={180} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayManager;
