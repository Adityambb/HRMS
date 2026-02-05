
import React from 'react';
import { Clock, TrendingUp, CheckCircle, ShieldAlert, DollarSign, Zap } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Employee, OvertimeEarnRequest, ApprovalStatus } from '../types';

interface OTManagementProps {
  otEarnRequests: OvertimeEarnRequest[];
  onApproveOTEarn: (id: string) => void;
  employees: Employee[];
}

const OTManagement: React.FC<OTManagementProps> = ({ otEarnRequests, onApproveOTEarn, employees }) => {
  const activeClient = MOCK_CLIENTS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compensation Hub</h2>
          <p className="text-slate-500 font-medium">Verify extra-hours deployment and credit man-days</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-2xl text-[10px] font-black border border-emerald-100 flex items-center gap-2 uppercase tracking-widest">
          <CheckCircle size={14} /> OT Engine Verified
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6 shadow-lg shadow-blue-500/10"><TrendingUp size={24} /></div>
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Active Man-Days</h4>
          <div className="text-4xl font-black text-slate-900">
            {otEarnRequests.filter(r => r.status === ApprovalStatus.APPROVED).reduce((acc, curr) => acc + curr.manDayValue, 0).toFixed(1)}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-6 shadow-lg shadow-amber-500/10"><ShieldAlert size={24} /></div>
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Awaiting Review</h4>
          <div className="text-4xl font-black text-slate-900">
            {otEarnRequests.filter(r => r.status === ApprovalStatus.PENDING).length}
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6"><DollarSign size={20} className="text-emerald-400" /><h4 className="text-lg font-black uppercase text-slate-400">Multipliers</h4></div>
              <div className="space-y-3">
                 {Object.entries(activeClient.otPayMultipliers).map(([type, val]) => (
                   <div key={type} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
                      <span className="text-sm font-black text-white">{val}.0x</span>
                   </div>
                 ))}
              </div>
           </div>
           <Zap size={140} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Earn Request Lifecycle</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50/50">
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Profile</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Log</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Decision Hub</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {otEarnRequests.map((row) => {
                 const emp = employees.find(e => e.id === row.employeeId);
                 return (
                   <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">{emp?.name.charAt(0)}</div>
                           <div>
                              <div className="font-black text-slate-900 text-sm leading-tight">{emp?.name}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5">{emp?.designation}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <div className="font-black text-slate-700 text-sm">{row.date}</div>
                        <div className="text-[10px] font-medium text-slate-400 truncate max-w-[250px] mt-1 italic">"{row.reason}"</div>
                     </td>
                     <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-black text-[11px] uppercase border border-slate-200"><Clock size={14} /> {row.hours} hrs</div>
                     </td>
                     <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${row.status === ApprovalStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'}`}>{row.status}</span>
                         {row.status === ApprovalStatus.PENDING && (
                           <button onClick={() => onApproveOTEarn(row.id)} className="p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-lg transition-all transform active:scale-95"><CheckCircle size={18} /></button>
                         )}
                       </div>
                     </td>
                   </tr>
                 );
               })}
               {otEarnRequests.length === 0 && (
                 <tr><td colSpan={4} className="px-10 py-32 text-center text-slate-300 text-sm font-black uppercase tracking-[0.3em]">No deployment logs</td></tr>
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OTManagement;
