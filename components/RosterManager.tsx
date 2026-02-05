
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Clock, MapPin } from 'lucide-react';
import { Employee, Shift, LocationType } from '../types';

interface RosterManagerProps {
  employees: Employee[];
  shifts: Shift[];
}

const RosterManager: React.FC<RosterManagerProps> = ({ employees, shifts }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Logic for a basic 7-day view
  const getDaysOfWeek = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() - d.getDay() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysOfWeek(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employee Roster</h2>
          <p className="text-slate-500">Plan and map shifts, weekly offs, and WFH days</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={20}/></button>
          <div className="px-4 text-sm font-bold text-slate-700">Week of {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 w-64 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">Employee</th>
                {days.map((day, i) => (
                  <th key={i} className="px-4 py-4 text-center border-l border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg font-black text-slate-900">{day.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="px-6 py-6 sticky left-0 bg-white z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{emp.designation}</div>
                      </div>
                    </div>
                  </td>
                  {days.map((day, i) => {
                    const isSunday = day.getDay() === 0;
                    const isSaturday = day.getDay() === 6;
                    const isWeekend = isSunday || isSaturday;
                    
                    return (
                      <td key={i} className="px-2 py-4 border-l border-slate-100">
                        <div className="flex flex-col gap-1">
                          <select 
                            className={`text-[10px] font-bold p-1 rounded border-none outline-none cursor-pointer ${
                              isWeekend ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                            }`}
                            defaultValue={isWeekend ? 'OFF' : 's1'}
                          >
                            <option value="OFF">WEEKLY OFF</option>
                            {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <select 
                            className="text-[9px] font-bold p-1 bg-slate-50 text-slate-400 rounded border-none outline-none cursor-pointer"
                            defaultValue="OFFICE"
                          >
                            <option value="OFFICE">🏢 OFFICE</option>
                            <option value="WFH">🏠 WFH</option>
                          </select>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl text-white">
          <h4 className="font-bold flex items-center gap-2 mb-4">
            <Clock size={18} className="text-blue-400" /> Auto-Scheduler
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">Automatically assign shifts based on workload demand and previous patterns for {employees.length} employees.</p>
          <button className="w-full py-2 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Generate Plan</button>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <User size={18} className="text-slate-400" /> Roster Summary
          </h4>
          <div className="space-y-3">
             <div className="flex justify-between text-xs">
               <span className="text-slate-500 font-medium">On-Duty Daily Avg</span>
               <span className="text-slate-900 font-bold">12 Staff</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-slate-500 font-medium">WFH Requests</span>
               <span className="text-amber-600 font-bold">4 Pending</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterManager;
