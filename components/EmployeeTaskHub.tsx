
import React from 'react';
import { 
  ClipboardList, Calendar, CheckCircle2, Clock, 
  FileText, Download, AlertCircle, TrendingUp,
  Info
} from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface EmployeeTaskHubProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

const EmployeeTaskHub: React.FC<EmployeeTaskHubProps> = ({ tasks, onCompleteTask }) => {
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const successCount = tasks.filter(t => t.status === TaskStatus.SUCCESS).length;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Hub</h2>
          <p className="text-slate-500 font-medium">Manage your deliverables and reporting</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black text-xs">{pendingCount}</div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">In Progress</span>
           </div>
           <div className="px-6 py-3 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs">{successCount}</div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Completed</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList size={24} className="text-blue-600" /> Active Assignments
          </h3>
          <div className="space-y-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                <div className="p-10">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                         <div className="flex items-center gap-3 mb-2">
                           <h4 className="text-2xl font-black text-slate-900">{task.title}</h4>
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             task.status === TaskStatus.SUCCESS 
                             ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                             : 'bg-amber-50 text-amber-700 border-amber-100'
                           }`}>
                             {task.status}
                           </span>
                         </div>
                         <div className="flex items-center gap-6 text-slate-400">
                           <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Assigned: {task.createdAt.split('T')[0]}</span>
                           </div>
                           <div className="flex items-center gap-2 text-rose-500">
                              <Clock size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Deadline: {task.deadline}</span>
                           </div>
                         </div>
                      </div>
                      {task.fileName && (
                        <button className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                           <Download size={14} /> {task.fileName}
                        </button>
                      )}
                   </div>
                   <p className="text-slate-600 font-medium leading-relaxed mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                     "{task.description || 'No additional instructions provided.'}"
                   </p>
                   <div className="flex justify-end">
                      {task.status === TaskStatus.PENDING ? (
                        <button 
                          onClick={() => onCompleteTask(task.id)}
                          className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 flex items-center gap-3 hover:bg-slate-800 transition-all transform active:scale-95"
                        >
                          <CheckCircle2 size={18} /> Mark as Done
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                           <CheckCircle2 size={20} /> Verified Complete
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[48px] text-center">
                 <ClipboardList size={64} className="text-slate-100 mx-auto mb-6" />
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No assignments found in your queue</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
             <TrendingUp size={24} className="text-emerald-600" /> Productivity Stat
           </h3>
           <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-6">Execution Efficiency</h4>
                 <div className="flex items-end gap-3 mb-8">
                    <span className="text-5xl font-black">100%</span>
                    <span className="text-[10px] font-black uppercase text-emerald-400 mb-2 tracking-widest">On-time rate</span>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Average Closure</span>
                       <span className="text-xs font-black">2.4 Days</span>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Quarterly Target</span>
                       <span className="text-xs font-black">15 / 20</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 scale-150">
                 <TrendingUp size={160} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-start gap-5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                 <Info size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Help Center</h4>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed">If you have issues with a deadline, please contact your manager directly.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskHub;
