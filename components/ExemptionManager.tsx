
import React, { useState } from 'react';
import { LogIn, LogOut, Info, Clock, AlertCircle, CheckCircle2, MoreVertical, XCircle, Send, Lock, History } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { ApprovalStatus, ExemptionRequest } from '../types';

interface ExemptionManagerProps {
  isEmployeeMode?: boolean;
  exemptionRequests?: ExemptionRequest[];
  onApplyExemption?: (type: 'LATE_LOGIN' | 'EARLY_LEAVE', date: string, mins: number, reason: string) => void;
  onApproveExemption?: (id: string) => void;
  onRejectExemption?: (id: string) => void;
}

const ExemptionManager: React.FC<ExemptionManagerProps> = ({ 
  isEmployeeMode, 
  exemptionRequests = [], 
  onApplyExemption,
  onApproveExemption,
  onRejectExemption
}) => {
  const activeClient = MOCK_CLIENTS[0];
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [type, setType] = useState<'LATE_LOGIN' | 'EARLY_LEAVE'>('LATE_LOGIN');
  const [date, setDate] = useState('');
  const [mins, setMins] = useState(30);
  const [reason, setReason] = useState('');

  const handleApply = () => {
    if (!date || !reason) return;
    onApplyExemption?.(type, date, mins, reason);
    setShowApplyModal(false);
    setDate('');
    setReason('');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Attendance Regularization</h2>
          <p className="text-slate-500 font-medium">Independent regularization tracking for {activeClient.name}</p>
        </div>
        {isEmployeeMode && (
          <button 
            onClick={() => {
              setShowApplyModal(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <History size={16} /> Request Regularization
          </button>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 max-w-lg w-full p-10 relative">
              <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><XCircle /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-8">Attendance Regularization</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Request Type</label>
                  <div className="flex gap-2">
                     <button onClick={() => setType('LATE_LOGIN')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'LATE_LOGIN' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>Late Login</button>
                     <button onClick={() => setType('EARLY_LEAVE')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'EARLY_LEAVE' ? 'bg-rose-600 text-white shadow-xl shadow-rose-100' : 'bg-slate-100 text-slate-400'}`}>Early Leave</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mins Requested</label>
                    <input type="number" value={mins} onChange={(e) => setMins(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reason</label>
                  <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="State your emergency/reason..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none" />
                </div>
                <button onClick={handleApply} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                  <Send size={14} /> Send for Approval
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">Regularization Requests</h2>
          <div className="overflow-hidden border border-slate-100 rounded-3xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Req ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mins Requested</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  {!isEmployeeMode && <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exemptionRequests.map((req, idx) => (
                  <tr key={req.id}>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{idx + 7}</td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">Alice Smith</td>
                    <td className="px-6 py-5 text-sm text-slate-600 text-center">{req.date}</td>
                    <td className="px-6 py-5 text-sm font-bold text-blue-600 uppercase">{req.type === 'LATE_LOGIN' ? 'Late Login' : 'Early Leave'}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">{req.minutes} mins</td>
                    <td className="px-6 py-5 text-sm text-slate-500 italic">"{req.reason}"</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : req.status === ApprovalStatus.REJECTED ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{req.status}</span>
                    </td>
                    {!isEmployeeMode && (
                      <td className="px-6 py-5 text-right">
                         {req.status === ApprovalStatus.PENDING && (
                           <button onClick={() => onApproveExemption?.(req.id)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                         )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
           <div className="bg-slate-900 p-10 rounded-[40px] text-white">
              <h4 className="text-xl font-black mb-6">Policy Constraints</h4>
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-black">1</div>
                    <div>
                      <p className="text-sm font-bold">L1 Sign-off</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct manager approval is sufficient for rapid processing.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-black">2</div>
                    <div>
                      <p className="text-sm font-bold">Limit: {activeClient.exemptionLimitPerCycle}/cycle</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Exceeding limits requires HR override and may impact payroll.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExemptionManager;
