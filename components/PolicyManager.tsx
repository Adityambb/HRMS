
import React, { useState } from 'react';
import { Sparkles, Save, Info, AlertCircle, Clock, Scale, ShieldCheck, UserCheck } from 'lucide-react';
import { Client } from '../types';
import { generatePolicyDraft } from '../services/gemini';

interface PolicyManagerProps {
  activeClient: Client;
}

const PolicyManager: React.FC<PolicyManagerProps> = ({ activeClient }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'approvals' | 'late'>('status');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiDraft = async () => {
    setIsGenerating(true);
    const draft = await generatePolicyDraft(activeClient.name, activeTab);
    console.log(draft); // Set drafted text in a real app
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Advanced Policy Config</h2>
          <p className="text-slate-500">Global rules engine for {activeClient.name}</p>
        </div>
        <button onClick={handleAiDraft} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
          <Sparkles size={18} /> AI Policy Advisor
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-1.5 flex gap-1">
          {[
            { id: 'status', label: 'Status Rules', icon: <Scale size={16}/> },
            { id: 'approvals', label: 'Approval Flow', icon: <UserCheck size={16}/> },
            { id: 'late', label: 'Late Criteria', icon: <Clock size={16}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all rounded-xl ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeTab === 'status' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="text-blue-500" size={18} /> Working Hour Thresholds
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Present (Full Day)</p>
                        <p className="text-[10px] text-slate-500">Minimum total hours worked</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={8} className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-center font-bold" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Hrs</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-700">Half Day</p>
                        <p className="text-[10px] text-slate-500">Minimum hours for partial credit</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={4} className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-center font-bold" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-3">Absence Management</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-blue-900 pr-4">Enable HR to convert unapproved absences to LOP or adjust against leave.</p>
                    <input type="checkbox" defaultChecked className="w-6 h-6 accent-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                <h4 className="text-lg font-bold mb-2">Priority Logic</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">System-calculated priority for overlapping events.</p>
                <div className="space-y-3">
                  {[
                    { rank: 1, label: 'Approved Holiday', color: 'bg-emerald-500' },
                    { rank: 2, label: 'Weekly Off', color: 'bg-emerald-500' },
                    { rank: 3, label: 'Approved Leave', color: 'bg-blue-500' },
                    { rank: 4, label: 'Physical Attendance', color: 'bg-amber-500' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black bg-slate-700 rounded-lg">{item.rank}</span>
                      <span className="text-sm font-bold">{item.label}</span>
                      <div className={`ml-auto w-2 h-2 rounded-full ${item.color}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-10">
                <h3 className="text-xl font-black text-slate-900">Location Approval Workflows</h3>
                <p className="text-sm text-slate-500 mt-2">Configure when a manager's verification is required for a punch-in.</p>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'rem', label: 'All Non-Office Punches', sub: 'Includes WFH, Travelling, and External locations' },
                  { id: 'unp', label: 'Unplanned WFH', sub: 'WFH selected when not scheduled in roster' },
                  { id: 'out', label: 'Outside Geo-fence', sub: 'Punches from office but outside defined radius' },
                ].map((item) => (
                  <div key={item.id} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.id === 'rem'} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-3">
             <button className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">Discard Changes</button>
             <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
               <Save size={18} /> Update Rules Engine
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
