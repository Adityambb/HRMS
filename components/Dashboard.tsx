
import React, { useState } from 'react';
import { 
  Users, Clock, CheckCircle2, AlertCircle, MapPin, 
  Timer, Send, Calendar, Zap, LogIn, Lock, Unlock, Edit2, X, Snowflake, ChevronDown, ChevronUp, History, ClipboardCheck, Save
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_LEAVE_TYPES, MOCK_SHIFTS } from '../constants';
import { ApprovalStatus, AttendanceRecord, ExemptionRequest, AttendanceCycle, LeaveRequest } from '../types';

interface DashboardProps {
  clientName: string;
  isEmployeeMode?: boolean;
  attendance?: AttendanceRecord[];
  regRequests?: any[];
  leaveRequests?: LeaveRequest[];
  exemptionRequests?: ExemptionRequest[];
  cycles?: AttendanceCycle[];
  onApproveRequest?: (id: string, type: 'LEAVE' | 'REG' | 'EX' | 'ATTENDANCE') => void;
  onRejectRequest?: (id: string, type: 'LEAVE' | 'REG' | 'EX') => void;
  onToggleSpecificCycleLock?: (id: string) => void;
  onUpdateSpecificCycle?: (id: string, start: string, end: string) => void;
  onFreezeCycle?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  clientName, 
  isEmployeeMode, 
  attendance = [],
  regRequests = [], 
  leaveRequests = [], 
  exemptionRequests = [],
  cycles = [],
  onApproveRequest, 
  onRejectRequest,
  onToggleSpecificCycleLock,
  onUpdateSpecificCycle,
  onFreezeCycle
}) => {
  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const activeCycle = cycles?.find(c => c.status === 'OPEN') || cycles?.[0];
  
  const [tempStart, setTempStart] = useState(activeCycle?.startDate || '');
  const [tempEnd, setTempEnd] = useState(activeCycle?.endDate || '');

  const calculateDynamicStatus = (minutes: number, hasOutPunch: boolean) => {
    if (!hasOutPunch) return 'PRESENT';
    if (minutes < 240) return 'ABSENT'; 
    if (minutes < 480) return 'HALF_DAY'; 
    return 'PRESENT'; 
  };

  const getLateInfo = (punchIn: string, employeeId: string) => {
    // Calculate based on current time - 10 AM
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const currentMinsTotal = currentH * 60 + currentM;
    const shiftMinsTotal = 10 * 60; // 10 AM
    const diff = currentMinsTotal - shiftMinsTotal;

    if (diff < 0) {
      // Early
      const h = Math.floor(Math.abs(diff) / 60);
      const m = Math.abs(diff) % 60;
      return `EARLY (${h}h ${m}m)`;
    } else if (diff <= 15) { // 15 minute grace
      // On time (within grace period)
      return 'ACCURATE';
    } else {
      // Late
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `LATE (${h}h ${m}m)`;
    }
  };

  const handleSaveCycle = () => {
    if (activeCycle) {
      onUpdateSpecificCycle?.(activeCycle.id, tempStart, tempEnd);
      setIsEditingCycle(false);
    }
  };

  if (isEmployeeMode) {
    const isLocked = activeCycle?.status === 'LOCKED' || activeCycle?.status === 'FROZEN';
    const allRequests = [
      ...leaveRequests.map(r => ({ ...r, category: 'LEAVE' as const, sortDate: r.createdAt })),
      ...exemptionRequests.map(r => ({ ...r, category: 'REG' as const, sortDate: r.createdAt || r.date }))
    ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request Hub</h2>
            <p className="text-slate-500 font-medium">Real-time status of your applications</p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className={`w-3 h-3 rounded-full ${isLocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              System {isLocked ? 'Locked' : 'Open'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3"><History size={24} className="text-blue-600" /> Recent Activity</h3>
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {allRequests.map(req => {
                const isLeave = req.category === 'LEAVE';
                const typeInfo = isLeave ? MOCK_LEAVE_TYPES.find(t => t.id === (req as LeaveRequest).leaveTypeId)?.code : 'REG';
                return (
                  <div key={req.id} className="p-8 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLeave ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {isLeave ? <Calendar size={24} /> : <Zap size={24} />}
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isLeave ? `Leave (${typeInfo})` : 'Regularization'}</p>
                          <h4 className="text-lg font-black text-slate-900">{isLeave ? (req as LeaveRequest).startDate : (req as ExemptionRequest).date}</h4>
                          <p className="text-xs text-slate-500 italic mt-1">"{req.reason || 'No reason'}"</p>
                       </div>
                    </div>
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest ${
                      req.status === ApprovalStatus.APPROVED ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                      req.status === ApprovalStatus.PENDING ? 'text-amber-700 bg-amber-50 border-amber-100' : 
                      'text-rose-700 bg-rose-50 border-rose-100'
                    }`}>{req.status}</span>
                  </div>
                );
              })}
              {allRequests.length === 0 && <div className="text-center py-24 text-slate-400 uppercase text-xs font-black">No requests found</div>}
            </div>
          </div>
          <div className="bg-slate-900 rounded-[48px] p-10 text-white relative h-fit">
             <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${isLocked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {isLocked ? <Lock size={28} /> : <Unlock size={28} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cycle Status</p>
                  <p className="text-xl font-black">{activeCycle?.status || 'OPEN'}</p>
                </div>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">Cycle: {activeCycle?.startDate} to {activeCycle?.endDate}</p>
             <p className="text-[10px] mt-4 font-black uppercase text-amber-400">Important Info</p>
             <p className="text-[11px] text-slate-400 mt-1">During the locked period, leave applications are strictly disabled.</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Enhanced Cycle Bar from Screenshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
         <div className="flex items-center gap-8">
            {isEditingCycle ? (
              <div className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-300">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={tempStart} 
                    onChange={(e) => setTempStart(e.target.value)} 
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="text-slate-300 mt-5">→</div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={tempEnd} 
                    onChange={(e) => setTempEnd(e.target.value)} 
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="flex gap-2 mt-5">
                   <button onClick={handleSaveCycle} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"><Save size={16}/></button>
                   <button onClick={() => setIsEditingCycle(false)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"><X size={16}/></button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-700">Cycle Period: <span className="text-slate-900 font-black">{activeCycle?.startDate} to {activeCycle?.endDate}</span></p>
                  <button 
                    onClick={() => {
                      setTempStart(activeCycle?.startDate || '');
                      setTempEnd(activeCycle?.endDate || '');
                      setIsEditingCycle(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={14}/>
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">Status: <span className={`font-black ${activeCycle?.status === 'OPEN' ? 'text-emerald-600' : 'text-rose-600'}`}>{activeCycle?.status === 'OPEN' ? 'UNLOCKED' : 'LOCKED'}</span></p>
              </div>
            )}
         </div>
         <button 
           onClick={() => onToggleSpecificCycleLock?.(activeCycle?.id || '')}
           className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-100 transition-all"
         >
           {activeCycle?.status === 'OPEN' ? <Lock size={16}/> : <Unlock size={16}/>}
           {activeCycle?.status === 'OPEN' ? 'Lock Cycle' : 'Unlock Cycle'}
         </button>
      </div>

      <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">Daily Attendance Overview</h2>
        <div className="overflow-hidden border border-slate-100 rounded-3xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Punch In</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Punch Out</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Mins</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Late Info</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Approval</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.map((record, idx) => {
                const emp = MOCK_EMPLOYEES.find(e => e.id === record.employeeId);
                const punch = record.punches[0];
                const dynamicStatus = calculateDynamicStatus(record.totalWorkingMinutes, !!punch.out);
                return (
                  <tr key={record.id}>
                    <td className="px-4 py-5 text-xs text-slate-500 font-bold">{idx + 33}</td>
                    <td className="px-4 py-5 text-sm font-black text-slate-900">{emp?.name || 'Employee User'}</td>
                    <td className="px-4 py-5 text-sm font-medium">{record.date}</td>
                    <td className="px-4 py-5 text-sm font-black">{punch.in}</td>
                    <td className="px-4 py-5 text-sm text-slate-500">{punch.out || '-'}</td>
                    <td className="px-4 py-5 text-center font-bold">{record.totalWorkingMinutes}</td>
                    <td className="px-4 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${dynamicStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : dynamicStatus === 'HALF_DAY' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700'}`}>{dynamicStatus}</span>
                    </td>
                    <td className="px-4 py-5 text-xs font-bold">{getLateInfo(punch.in, record.employeeId)}</td>
                    <td className="px-4 py-5 text-center uppercase text-[9px] font-black text-slate-400">{punch.approvalStatus}</td>
                    <td className="px-4 py-5 text-right">
                       {punch.approvalStatus === ApprovalStatus.PENDING && (
                         <button onClick={() => onApproveRequest?.(record.id, 'ATTENDANCE')} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">Regularization Requests</h2>
        <div className="overflow-hidden border border-slate-100 rounded-3xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Req ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exemptionRequests.map((req, idx) => {
                const emp = MOCK_EMPLOYEES.find(e => e.id === req.employeeId);
                return (
                  <tr key={req.id}>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{idx + 7}</td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">{emp?.name || 'Employee User'}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 text-center">{req.date}</td>
                    <td className="px-6 py-5 text-sm text-slate-500 italic">"{req.reason}"</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       {req.status === ApprovalStatus.PENDING && (
                         <button onClick={() => onApproveRequest?.(req.id, 'EX')} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">Leave Requests</h2>
        <div className="overflow-hidden border border-slate-100 rounded-3xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Leave Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map((req, idx) => {
                const emp = MOCK_EMPLOYEES.find(e => e.id === req.employeeId);
                const type = MOCK_LEAVE_TYPES.find(t => t.id === req.leaveTypeId);
                return (
                  <tr key={req.id}>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{idx + 14}</td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">{emp?.name || 'Employee User'}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 text-center">{req.startDate}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-blue-600 uppercase">{type?.code || 'SICK'}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 italic">"{req.reason}"</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       {req.status === ApprovalStatus.PENDING && (
                         <button onClick={() => onApproveRequest?.(req.id, 'LEAVE')} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Approve</button>
                       )}
                    </td>
                  </tr>
                );
              })}
              {leaveRequests.length === 0 && <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-400 uppercase text-xs font-black">No leave records found</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
         <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-600">
            <X size={14}/> Reset Demo Data
         </button>
      </div>
    </div>
  );
};

export default Dashboard;
