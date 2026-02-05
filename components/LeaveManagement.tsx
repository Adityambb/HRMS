
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Info, CheckCircle2, XCircle, 
  Trash2, Send, Lock, Zap, Clock
} from 'lucide-react';
import { 
  MOCK_LEAVE_TYPES, 
  MOCK_EMPLOYEES
} from '../constants';
import { ApprovalStatus, UserRole, LeaveRequest, OvertimeEarnRequest, Client } from '../types';

interface LeaveManagementProps {
  userRole: UserRole;
  isEmployeeMode?: boolean;
  leaveRequests: LeaveRequest[];
  balances?: any[];
  onApplyLeave?: (typeId: string, start: string, end: string, reason: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isCycleLocked?: boolean;
  otRequests?: OvertimeEarnRequest[];
  onApplyOTEarn?: (date: string, hours: number, reason: string) => void;
  activeClient: Client;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ 
  userRole, 
  isEmployeeMode, 
  leaveRequests, 
  balances = [], 
  onApplyLeave, 
  onApprove, 
  onReject,
  isCycleLocked,
  otRequests = [],
  onApplyOTEarn,
  activeClient
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showOTModal, setShowOTModal] = useState(false);

  // Leave Form State
  const [selectedType, setSelectedType] = useState(MOCK_LEAVE_TYPES[0].id);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // OT Form State
  const [otDate, setOtDate] = useState('');
  const [otHours, setOtHours] = useState<number>(0);
  const [otReason, setOtReason] = useState('');

  const handleApply = () => {
    if (isCycleLocked) return alert("Attendance cycle is locked.");
    if (!startDate || !endDate || !reason) return alert("Please fill all fields.");
    onApplyLeave?.(selectedType, startDate, endDate, reason);
    setShowApplyModal(false);
    setStartDate(''); setEndDate(''); setReason('');
  };

  const handleOTSubmit = () => {
    if (isCycleLocked) return alert("Attendance cycle is locked.");
    if (!otDate || otHours <= 0 || !otReason) return alert("Please provide valid details.");
    onApplyOTEarn?.(otDate, otHours, otReason);
    setShowOTModal(false);
    setOtDate(''); setOtHours(0); setOtReason('');
  };

  const renderEmployeeView = () => (
    <div className="space-y-8">
      {isCycleLocked && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-600">
          <Lock size={18} />
          <p className="text-xs font-black uppercase tracking-widest">Attendance cycle is locked</p>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {balances.map((balance, i) => {
          const type = MOCK_LEAVE_TYPES.find(t => t.id === balance.leaveTypeId);
          const total = balance.accrued;
          const used = balance.used;
          const remaining = total - used - balance.pending;
          return (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
              <div className={`absolute top-0 right-0 w-24 h-24 ${type?.color} opacity-5 -mr-8 -mt-8 rounded-full`} />
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-3 rounded-2xl ${type?.color} text-white shadow-lg`}>
                    <CalendarIcon size={20} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type?.code}</span>
              </div>
              <h4 className="font-black text-slate-900 mb-1">{type?.name}</h4>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-black text-slate-900">{remaining}</span>
                <span className="text-xs font-bold text-slate-400 mb-2">Available</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${type?.color}`} style={{ width: `${(used/total)*100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Recent Applications</h3>
              <button 
                onClick={() => !isCycleLocked && setShowApplyModal(true)}
                disabled={isCycleLocked}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isCycleLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800'}`}
              >
                <Plus size={16} /> Apply Leave
              </button>
            </div>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm divide-y divide-slate-100">
                {leaveRequests.filter(r => r.employeeId === 'e1').map(req => {
                  const type = MOCK_LEAVE_TYPES.find(t => t.id === req.leaveTypeId);
                  return (
                    <div key={req.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black ${type?.color}`}>{type?.code}</div>
                        <div>
                          <p className="font-bold text-slate-900">{type?.name}</p>
                          <p className="text-xs text-slate-500">{req.startDate} to {req.endDate}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${req.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{req.status}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 mb-6">Comp-Off (OT) Request History</h3>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm divide-y divide-slate-100">
              {otRequests.map(ot => (
                <div key={ot.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Zap size={18} /></div>
                    <div>
                      <p className="font-bold text-slate-900">{ot.date}</p>
                      <p className="text-xs text-slate-500">{ot.hours} Hours • {ot.reason}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${ot.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{ot.status}</span>
                </div>
              ))}
              {otRequests.length === 0 && <div className="p-10 text-center text-slate-400 text-xs font-black uppercase tracking-widest">No OT requests</div>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-4">OT Credits</h4>
               <p className="text-xs text-slate-400 mb-8 leading-relaxed">Earn 1 Man-Day for every 8 approved hours of extra work.</p>
               <div className="flex justify-between items-end">
                  <div className="text-4xl font-black">
                    {(otRequests.filter(r => r.status === ApprovalStatus.APPROVED).reduce((acc, curr) => acc + curr.manDayValue, 0)).toFixed(1)}
                  </div>
                  <button 
                    onClick={() => !isCycleLocked && setShowOTModal(true)}
                    className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all ${isCycleLocked ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 text-white'}`}
                  >
                    Request Earn
                  </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400"><XCircle /></button>
            <h3 className="text-2xl font-black mb-8">Apply for Leave</h3>
            <div className="space-y-6">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold">
                {MOCK_LEAVE_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold" />
              </div>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium" placeholder="Reason..." />
              <button onClick={handleApply} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px]">Submit Application</button>
            </div>
          </div>
        </div>
      )}

      {showOTModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full relative">
            <button onClick={() => setShowOTModal(false)} className="absolute top-6 right-6 text-slate-400"><XCircle /></button>
            <h3 className="text-2xl font-black mb-2">Request OT Credit</h3>
            <p className="text-xs text-slate-500 mb-8 italic">Apply for extra working hours compensation</p>
            <div className="space-y-6">
              <input type="date" value={otDate} onChange={(e) => setOtDate(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold" />
              <input type="number" step="0.5" value={otHours} onChange={(e) => setOtHours(parseFloat(e.target.value))} placeholder="Hours Worked" className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold" />
              <textarea rows={3} value={otReason} onChange={(e) => setOtReason(e.target.value)} placeholder="Describe work done..." className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium" />
              <button onClick={handleOTSubmit} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px]">Submit OT Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Leave Administration</h3>
          <p className="text-slate-500 font-medium">Managing {leaveRequests.filter(r => r.status === ApprovalStatus.PENDING).length} pending requests</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm divide-y divide-slate-100">
         {leaveRequests.filter(r => r.status === ApprovalStatus.PENDING).map(req => {
           const emp = MOCK_EMPLOYEES.find(e => e.id === req.employeeId);
           const type = MOCK_LEAVE_TYPES.find(t => t.id === req.leaveTypeId);
           return (
             <div key={req.id} className="py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">{emp?.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{emp?.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{type?.name} • {req.startDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onReject?.(req.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><XCircle size={18} /></button>
                  <button onClick={() => onApprove?.(req.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><CheckCircle2 size={18} /></button>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );

  return <div className="pb-20">{isEmployeeMode ? renderEmployeeView() : renderAdminView()}</div>;
};

export default LeaveManagement;
