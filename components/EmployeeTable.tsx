
import React, { useState } from 'react';
import { Search, UserPlus, MoreHorizontal, ArrowRightLeft, Users, X, Send, UserCheck, Clock, CalendarX, UserMinus } from 'lucide-react';
import { Employee, Client, AttendanceRecord, LeaveRequest, ApprovalStatus } from '../types';
import { MOCK_SHIFTS } from '../constants';

interface EmployeeTableProps {
  employees: Employee[];
  activeClient: Client;
  onAddEmployee: (emp: Employee) => void;
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, activeClient, onAddEmployee, attendance, leaveRequests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newBranch, setNewBranch] = useState(activeClient.branches[0]?.id || '');

  const clientEmployees = employees.filter(e => e.clientId === activeClient.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === todayStr);

  const getIsLate = (punchIn: string, employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    const shift = MOCK_SHIFTS.find(s => s.id === emp?.currentShiftId);
    if (!shift || !punchIn) return false;

    // Handle potential "01:04 AM" or "13:04" formats
    // The PunchClock uses toLocaleTimeString which usually includes AM/PM
    // Let's assume HH:mm for simple parsing if possible, or handle the 12h format
    let [time, modifier] = punchIn.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const [shiftH, shiftM] = shift.startTime.split(':').map(Number);
    
    const punchMinsTotal = hours * 60 + minutes;
    const shiftMinsTotal = shiftH * 60 + shiftM;
    const diff = punchMinsTotal - shiftMinsTotal;

    return diff > shift.graceMinutes;
  };

  const presentCount = todayAttendance.length;
  const lateCount = todayAttendance.filter(a => a.punches[0] && getIsLate(a.punches[0].in, a.employeeId)).length;
  
  const onLeaveCount = clientEmployees.filter(emp => {
    return leaveRequests.some(lr => 
      lr.employeeId === emp.id && 
      lr.status === ApprovalStatus.APPROVED &&
      todayStr >= lr.startDate && 
      todayStr <= lr.endDate
    );
  }).length;

  const absentCount = Math.max(0, clientEmployees.length - presentCount - onLeaveCount);

  // Statistics Calculation
  const stats = {
    total: clientEmployees.length,
    present: presentCount,
    late: lateCount,
    onLeave: onLeaveCount,
    absent: absentCount,
  };

  const filteredEmployees = clientEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newDesignation) return;

    const newEmp: Employee = {
      id: 'e' + Math.random().toString(36).substr(2, 5),
      name: newName,
      email: newEmail,
      clientId: activeClient.id,
      branchId: newBranch,
      joiningDate: new Date().toISOString().split('T')[0],
      designation: newDesignation,
      currentShiftId: 's1'
    };

    onAddEmployee(newEmp);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewDesignation('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Real-Time Pulse Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Staff', value: stats.total, icon: <Users size={20}/>, color: 'bg-blue-500' },
          { label: 'Present Today', value: stats.present, icon: <UserCheck size={20}/>, color: 'bg-emerald-500' },
          { label: 'Late Arrivals', value: stats.late, icon: <Clock size={20}/>, color: 'bg-amber-500' },
          { label: 'On Leave', value: stats.onLeave, icon: <CalendarX size={20}/>, color: 'bg-indigo-500' },
          { label: 'Absents', value: stats.absent, icon: <UserMinus size={20}/>, color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-3 mb-4">
               <div className={`p-2 rounded-xl ${stat.color} text-white`}>{stat.icon}</div>
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</span>
             </div>
             <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Directory</h2>
          <p className="text-slate-500 font-medium tracking-tight">Managing human capital for {activeClient.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-sm w-80 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <UserPlus size={16} /> New Onboarding
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Node</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action Hub</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 leading-tight">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{emp.designation}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-slate-700">
                    {activeClient.branches.find(b => b.id === emp.branchId)?.name || 'Global HQ'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{emp.email}</div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-emerald-100 shadow-sm tracking-widest">Active</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button title="Transfer between clients" className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                        <ArrowRightLeft size={18} />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="text-slate-100 mb-6" size={80} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No records match your query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[48px] shadow-2xl border border-slate-200 max-w-lg w-full p-12 relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 transition-colors"><X size={28} /></button>
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Onboard Talent</h3>
              <p className="text-slate-500 mb-10 font-medium">Provision new credentials for {activeClient.name}</p>
              
              <form onSubmit={handleAddSubmit} className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Identity Name</label>
                  <input 
                    type="text" 
                    required
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="e.g. Jonathan Smith"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Corporate Email</label>
                  <input 
                    type="email" 
                    required
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    placeholder="jonathan@techcorp.com"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Designation</label>
                    <input 
                      type="text" 
                      required
                      value={newDesignation} 
                      onChange={(e) => setNewDesignation(e.target.value)} 
                      placeholder="e.g. Lead Dev"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Assign Branch</label>
                    <select 
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    >
                      {activeClient.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      {activeClient.branches.length === 0 && <option value="default">Default HQ</option>}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all transform active:scale-[0.98]">
                  <Send size={16} /> Complete Onboarding
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
