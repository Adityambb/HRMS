
import React, { useState } from 'react';
import { 
  ClipboardList, User, Calendar, FileUp, Send, 
  CheckCircle2, Clock, Search, X, Briefcase, Mail, Info
} from 'lucide-react';
import { Employee, Task, TaskStatus } from '../types';

interface TaskManagerProps {
  employees: Employee[];
  tasks: Task[];
  onAssignTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ employees, tasks, onAssignTask }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [fileName, setFileName] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !title || !deadline) return;

    onAssignTask({
      employeeId: selectedEmployee.id,
      title,
      description,
      deadline,
      fileName
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setDeadline('');
    setFileName('');
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Task Command Center</h2>
          <p className="text-slate-500 font-medium">Assign work items and monitor execution status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Employee List */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Active Staff
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find an employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredEmployees.map(emp => (
              <button 
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                  selectedEmployee?.id === emp.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                  selectedEmployee?.id === emp.id ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  {emp.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-black text-sm">{emp.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    selectedEmployee?.id === emp.id ? 'text-slate-400' : 'text-slate-400'
                  }`}>{emp.designation}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assign Section */}
        <div className="lg:col-span-2 space-y-8">
          {selectedEmployee ? (
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-lg">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{selectedEmployee.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedEmployee.designation}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} /> Corporate Email
                    </p>
                    <p className="text-sm font-bold text-slate-700">{selectedEmployee.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={12} /> Joined
                    </p>
                    <p className="text-sm font-bold text-slate-700">{selectedEmployee.joiningDate}</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                    <ClipboardList size={20} className="text-blue-600" /> New Assignment
                  </h4>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Task Title</label>
                        <input 
                          type="text" 
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Q1 Performance Review"
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Due Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="date" 
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Project Description</label>
                      <textarea 
                        rows={4} 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed instructions for the employee..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-6">
                       <label className="flex-1 cursor-pointer group">
                          <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm">
                                <FileUp size={24} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-900">{fileName || 'Upload Attachment'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">PDF, JPG, DOCX up to 10MB</p>
                             </div>
                          </div>
                          <input type="file" className="hidden" onChange={handleFileChange} />
                       </label>
                       <button type="submit" className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 flex items-center gap-3 hover:bg-slate-800 transition-all">
                         <Send size={16} /> Deploy Task
                       </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[48px] p-20 text-center">
              <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl flex items-center justify-center text-slate-200 mb-8">
                <ClipboardList size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-2">Workspace Idle</h3>
              <p className="text-slate-400 font-medium max-w-xs">Select an employee from the left panel to begin task orchestration</p>
            </div>
          )}

          {/* Task Status Table */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Assignment Tracker</h3>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                   Active Logs
                </span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Employee</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Details</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Deadline</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map(task => {
                      const emp = employees.find(e => e.id === task.employeeId);
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-black text-slate-900 text-sm">{emp?.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{emp?.designation}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-black text-slate-700 text-sm">{task.title}</div>
                            <div className="text-[10px] font-medium text-slate-400 truncate max-w-[200px]">{task.description}</div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-600">
                                <Clock size={12} />
                                <span className="text-[11px] font-black">{task.deadline}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                               task.status === TaskStatus.SUCCESS 
                               ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                               : 'bg-amber-50 text-amber-700 border-amber-100'
                             }`}>
                               {task.status}
                             </span>
                          </td>
                        </tr>
                      );
                    })}
                    {tasks.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest">No tasks deployed yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
