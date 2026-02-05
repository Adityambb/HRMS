import React, { useState } from 'react';
import { Lock, Unlock, Snowflake, CheckCircle, AlertCircle, Info, Edit2, Save, X } from 'lucide-react';
import { AttendanceCycle } from '../types';

interface AttendanceFinalizationProps {
  cycles: AttendanceCycle[];
  onToggleSpecificCycleLock?: (id: string) => void;
  onUpdateSpecificCycle?: (id: string, start: string, end: string) => void;
  onFreezeCycle?: (id: string) => void;
}

const AttendanceFinalization: React.FC<AttendanceFinalizationProps> = ({ 
  cycles, 
  onToggleSpecificCycleLock, 
  onUpdateSpecificCycle,
  onFreezeCycle 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'LOCKED': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'FROZEN': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-100';
    }
  };

  const handleStartEdit = (cycle: AttendanceCycle) => {
    setEditingId(cycle.id);
    setEditStart(cycle.startDate);
    setEditEnd(cycle.endDate);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateSpecificCycle?.(id, editStart, editEnd);
    setEditingId(null);
  };

  const handleFreeze = (cycle: AttendanceCycle) => {
    if (cycle.status !== 'LOCKED') {
      alert("Cycle must be LOCKED before it can be frozen for payroll.");
      return;
    }
    if (window.confirm("Are you sure? Freezing a cycle is permanent and blocks all further adjustments for payroll data integrity.")) {
      onFreezeCycle?.(cycle.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Attendance Finalization</h2>
          <p className="text-slate-500">Lock cycles to prevent edits and freeze for payroll readiness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cycles.map((cycle) => {
          const isCurrentlyLocked = cycle.status === 'LOCKED';
          const isFrozen = cycle.status === 'FROZEN';
          const isEditing = editingId === cycle.id;
          
          return (
            <div key={cycle.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-colors ${
                  isFrozen ? 'border-blue-200 bg-blue-50 text-blue-600' :
                  isCurrentlyLocked ? 'border-amber-200 bg-amber-50 text-amber-600' :
                  'border-emerald-200 bg-emerald-50 text-emerald-600'
                }`}>
                  {isFrozen ? <Snowflake size={28} /> :
                   isCurrentlyLocked ? <Lock size={28} /> :
                   <Unlock size={28} />}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block mb-1">Start Date</label>
                        <input 
                          type="date" 
                          value={editStart} 
                          onChange={(e) => setEditStart(e.target.value)} 
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                        />
                      </div>
                      <div className="text-slate-300 mt-4">→</div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block mb-1">End Date</label>
                        <input 
                          type="date" 
                          value={editEnd} 
                          onChange={(e) => setEditEnd(e.target.value)} 
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                        />
                      </div>
                      <div className="flex gap-1 mt-4">
                        <button onClick={() => handleSaveEdit(cycle.id)} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"><Save size={14}/></button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors"><X size={14}/></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-900 text-lg">
                        {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(cycle.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </h3>
                      {!isFrozen && (
                        <button 
                          onClick={() => handleStartEdit(cycle)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${getStatusColor(cycle.status)}`}>
                        {cycle.status}
                      </span>
                    </div>
                  )}
                  {!isEditing && (
                    <div className="flex gap-4 mt-1">
                       <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                         <CheckCircle size={12} className="text-emerald-500"/> Data Verified
                       </p>
                       <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                         <AlertCircle size={12} className="text-amber-500"/> {isFrozen ? 'Processed' : 'Ready for Payroll'}
                       </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {isFrozen ? (
                  <div className="px-6 py-3 rounded-2xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                    <Snowflake size={14} /> Archived for Payroll
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => onToggleSpecificCycleLock?.(cycle.id)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                        isCurrentlyLocked 
                          ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-slate-100' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                      }`}
                    >
                      {isCurrentlyLocked ? <><Unlock size={18} /> Unlock</> : <><Lock size={18} /> Lock Cycle</>}
                    </button>
                    <button 
                      onClick={() => handleFreeze(cycle)}
                      disabled={!isCurrentlyLocked}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                        isCurrentlyLocked 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none'
                      }`}
                    >
                      <Snowflake size={18} /> Freeze
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-6">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 shrink-0">
            <Info size={32} />
          </div>
          <div className="space-y-4">
            <h4 className="text-2xl font-black tracking-tight">Cycle Finalization Protocols</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Ensure all regularization requests are closed and roster mismatches are cleared before freezing. 
              Frozen cycles are immutable and exported to your connected payroll engine.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">L</div>
                  <p className="text-xs text-slate-400"><span className="text-white font-bold">Locking:</span> Stops employee/manager self-service edits. HR can still finalize records.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">F</div>
                  <p className="text-xs text-slate-400"><span className="text-white font-bold">Freezing:</span> Absolute data seal. No further modifications allowed by any user role.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 opacity-5 scale-[2]">
          <CheckCircle size={200} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceFinalization;
