
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Download, Filter, Calendar, Users, AlertTriangle } from 'lucide-react';

const lateData = [
  { week: 'Week 1', lateCount: 12, avgDelay: 15 },
  { week: 'Week 2', lateCount: 8, avgDelay: 10 },
  { week: 'Week 3', lateCount: 15, avgDelay: 25 },
  { week: 'Week 4', lateCount: 10, avgDelay: 12 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Attendance Intelligence</h2>
          <p className="text-slate-500">Analyze patterns, late-coming, and workforce metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-slate-900">Late Coming Trends</h3>
              <p className="text-xs text-slate-500 font-medium">Count of employees arriving after grace period</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Late Count</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="lateCount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2">Deduction Alerts</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">System identified employees nearing the late-deduction threshold.</p>
            <div className="space-y-4">
              {[
                { name: 'Alice Smith', count: 2, limit: 3, alert: '1 more late = 1 day deduction' },
                { name: 'Mike Ross', count: 1, limit: 3, alert: 'Within grace threshold' }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-xs font-black text-amber-400">{item.count}/{item.limit} Lates</span>
                  </div>
                  <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400" 
                      style={{ width: `${(item.count/item.limit)*100}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 mt-3 flex items-center gap-1 uppercase tracking-tight">
                    <AlertTriangle size={10} /> {item.alert}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-5">
             <AlertTriangle size={180} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Monthly Performance Table</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Calendar size={14} /> May 2024
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Users size={14} /> TechCorp HQ
            </div>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Employee</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Present</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Half Days</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Absents</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Lates</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">HR Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Alice Smith', p: 20, hd: 1, a: 0, l: 2, adj: '-' },
              { name: 'Bob Jones', p: 18, hd: 2, a: 1, l: 4, adj: '1 LOP' },
              { name: 'Charlie B.', p: 21, hd: 0, a: 0, l: 0, adj: '-' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-sm text-slate-900">{row.name}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.p}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.hd}</td>
                <td className="px-6 py-4 text-sm font-medium text-rose-600">{row.a}</td>
                <td className="px-6 py-4 text-sm font-medium text-amber-600">{row.l}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${row.adj !== '-' ? 'bg-slate-100 text-slate-600' : 'text-slate-300'}`}>
                    {row.adj}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
