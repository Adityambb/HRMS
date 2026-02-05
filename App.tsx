
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeTable from './components/EmployeeTable';
import PolicyManager from './components/PolicyManager';
import RosterManager from './components/RosterManager';
import PunchClock from './components/PunchClock';
import Reports from './components/Reports';
import LeaveManagement from './components/LeaveManagement';
import HolidayManager from './components/HolidayManager';
import OTManagement from './components/OTManagement';
import ExemptionManager from './components/ExemptionManager';
import TaskManager from './components/TaskManager';
import EmployeeTaskHub from './components/EmployeeTaskHub';
import { 
  MOCK_CLIENTS, 
  MOCK_USER, 
  MOCK_EMPLOYEES, 
  MOCK_SHIFTS,
  MOCK_LEAVE_TYPES,
  MOCK_LEAVE_BALANCES as INITIAL_BALANCES,
  MOCK_LEAVE_REQUESTS as INITIAL_LEAVE_REQS,
  MOCK_HOLIDAYS as INITIAL_HOLIDAYS,
  MOCK_CYCLES
} from './constants';
import { 
  UserRole, 
  ApprovalStatus, 
  LeaveRequest, 
  RegularizationRequest, 
  AttendanceRecord, 
  LocationType, 
  ExemptionRequest,
  Holiday,
  Employee,
  AttendanceCycle,
  OvertimeEarnRequest,
  Task,
  TaskStatus
} from './types';
import { Bell, Search, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeClientId, setActiveClientId] = useState<string>(MOCK_USER.mappedClientIds[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isEmployeeMode, setIsEmployeeMode] = useState(false);
  
  // Global State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [cycles, setCycles] = useState<AttendanceCycle[]>(MOCK_CYCLES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQS);
  const [regRequests, setRegRequests] = useState<RegularizationRequest[]>([]);
  const [exemptionRequests, setExemptionRequests] = useState<ExemptionRequest[]>([]);
  const [otEarnRequests, setOtEarnRequests] = useState<OvertimeEarnRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [tasks, setTasks] = useState<Task[]>([]);

  const availableClients = MOCK_USER.role === UserRole.SUPER_ADMIN 
    ? MOCK_CLIENTS 
    : MOCK_CLIENTS.filter(c => MOCK_USER.mappedClientIds.includes(c.id));

  const activeClient = availableClients.find(c => c.id === activeClientId) || availableClients[0];

  const handleToggleSpecificCycleLock = (id: string) => {
    setCycles(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'OPEN' ? 'LOCKED' : 'OPEN' } : c));
  };

  const handleFreezeCycle = (id: string) => {
    setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'FROZEN' } : c));
  };

  const handleUpdateSpecificCycle = (id: string, start: string, end: string) => {
    setCycles(prev => prev.map(c => c.id === id ? { ...c, startDate: start, endDate: end } : c));
  };

  const handleApplyLeave = (typeId: string, start: string, end: string, reason: string) => {
    const newReq: LeaveRequest = {
      id: 'lr' + Math.random().toString(36).substr(2, 5),
      employeeId: 'e1', 
      leaveTypeId: typeId,
      startDate: start,
      endDate: end,
      reason,
      status: ApprovalStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setLeaveRequests(prev => [newReq, ...prev]);
  };

  const handleApplyExemption = (type: 'LATE_LOGIN' | 'EARLY_LEAVE', date: string, mins: number, reason: string) => {
    const newReq: ExemptionRequest = {
      id: 'ex' + Math.random().toString(36).substr(2, 5),
      employeeId: 'e1',
      type,
      date,
      minutes: mins,
      reason,
      status: ApprovalStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setExemptionRequests(prev => [newReq, ...prev]);
  };

  const handleAssignTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Math.random().toString(36).substr(2, 5),
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: TaskStatus.SUCCESS } : t));
  };

  const handleAddHoliday = (name: string, date: string, isFixed: boolean) => {
    const newHoliday: Holiday = {
      id: 'h' + Math.random().toString(36).substr(2, 5),
      clientId: activeClientId,
      branchIds: [],
      name,
      date,
      isFixed
    };
    setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const handleApplyOTEarn = (date: string, hours: number, reason: string) => {
    const newReq: OvertimeEarnRequest = {
      id: 'ot' + Math.random().toString(36).substr(2, 5),
      employeeId: 'e1',
      date,
      hours,
      reason,
      status: ApprovalStatus.PENDING,
      multiplier: 1,
      manDayValue: hours / 8,
      payout: 0,
      createdAt: new Date().toISOString()
    };
    setOtEarnRequests(prev => [newReq, ...prev]);
  };

  const handleApproveOTEarn = (id: string) => {
    setOtEarnRequests(prev => prev.map(req => {
      if (req.id === id) {
        const dateObj = new Date(req.date);
        const day = dateObj.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = holidays.some(h => h.date === req.date);
        
        let multiplier = 1;
        if (isHoliday) multiplier = activeClient.otPayMultipliers.HOLIDAY;
        else if (isWeekend) multiplier = activeClient.otPayMultipliers.WEEKEND;
        else multiplier = activeClient.otPayMultipliers.REGULAR;

        const emp = employees.find(e => e.id === req.employeeId);
        const dailyRate = emp?.dailyRate || 1000;
        const manDayValue = req.hours / 8;
        const payout = manDayValue * multiplier * dailyRate;

        return { ...req, status: ApprovalStatus.APPROVED, multiplier, payout };
      }
      return req;
    }));
  };

  const handleApproveRequest = (id: string, type: 'LEAVE' | 'REG' | 'EX' | 'ATTENDANCE') => {
    if (type === 'LEAVE') setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.APPROVED } : r));
    if (type === 'REG') setRegRequests(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.APPROVED } : r));
    
    if (type === 'EX') {
      setExemptionRequests(prev => prev.map(r => {
        if (r.id === id) {
          const reqDate = r.date;
          const empId = r.employeeId;
          
          setAttendance(attPrev => {
            const existingIdx = attPrev.findIndex(a => a.employeeId === empId && a.date === reqDate);
            if (existingIdx !== -1) {
              const updatedAtt = [...attPrev];
              updatedAtt[existingIdx] = { ...updatedAtt[existingIdx], status: 'PRESENT' };
              return updatedAtt;
            } else {
              return [...attPrev, {
                id: 'att-' + Math.random().toString(36).substr(2, 5),
                employeeId: empId,
                date: reqDate,
                status: 'PRESENT',
                punches: [{ id: 'p-' + Date.now(), in: '09:00', out: '18:00', locationType: LocationType.OFFICE, approvalStatus: ApprovalStatus.APPROVED }],
                totalWorkingMinutes: 540
              }];
            }
          });
          
          return { ...r, status: ApprovalStatus.APPROVED };
        }
        return r;
      }));
    }

    if (type === 'ATTENDANCE') {
      setAttendance(prev => prev.map(record => {
        if (record.id === id) {
          return {
            ...record,
            punches: record.punches.map(p => ({ ...p, approvalStatus: ApprovalStatus.APPROVED }))
          };
        }
        return record;
      }));
    }
  };

  const handleRejectRequest = (id: string, type: 'LEAVE' | 'REG' | 'EX') => {
    if (type === 'LEAVE') setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.REJECTED } : r));
    if (type === 'REG') setRegRequests(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.REJECTED } : r));
    if (type === 'EX') setExemptionRequests(prev => prev.map(r => r.id === id ? { ...r, status: ApprovalStatus.REJECTED } : r));
  };

  const handlePunch = (type: 'IN' | 'OUT', location: LocationType) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    setIsPunchedIn(type === 'IN');

    if (type === 'IN') {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 5),
        employeeId: 'e1',
        date: dateStr,
        status: 'PRESENT',
        punches: [{
          id: Math.random().toString(36).substr(2, 9),
          in: timeStr,
          locationType: location,
          approvalStatus: ApprovalStatus.PENDING
        }],
        totalWorkingMinutes: 0
      };
      setAttendance(prev => [newRecord, ...prev]);
    } else {
      setAttendance(prev => {
        const updated = [...prev];
        const recordIndex = updated.findIndex(r => r.employeeId === 'e1' && r.date === dateStr);
        if (recordIndex !== -1) {
          const record = updated[recordIndex];
          const lastPunch = record.punches[record.punches.length - 1];
          lastPunch.out = timeStr;
          
          const inTime = new Date(`${dateStr} ${lastPunch.in}`);
          const outTime = new Date(`${dateStr} ${timeStr}`);
          const diffMs = outTime.getTime() - inTime.getTime();
          record.totalWorkingMinutes = Math.floor(diffMs / 60000);
        }
        return updated;
      });
    }
  };

  const currentClientCycles = cycles.filter(c => c.clientId === activeClientId);
  const activeCycle = currentClientCycles.find(c => c.status === 'OPEN') || currentClientCycles[currentClientCycles.length - 1];
  const isCycleLocked = !activeCycle || activeCycle.status !== 'OPEN';

  const renderContent = () => {
    if (isEmployeeMode) {
      return (
        <div className="max-w-6xl mx-auto pt-10 pb-20 px-6">
          <div className="flex bg-white p-2 rounded-3xl border border-slate-200 shadow-sm w-fit mx-auto mb-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'attendance', label: 'Punch & Daily' },
              { id: 'tasks', label: 'Task Portal' },
              { id: 'leaves', label: 'My Leave Hub' },
              { id: 'holidays', label: 'Holidays 2026' },
              { id: 'regularization', label: 'Correction Hub' },
              { id: 'requests', label: 'My Requests' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="space-y-12">
            {activeTab === 'attendance' && (
               <PunchClock 
                employee={employees.find(e => e.id === 'e1') || employees[0]} 
                client={activeClient} 
                onPunchSuccess={handlePunch}
                onRegularize={(date, reason) => handleApplyExemption('LATE_LOGIN', date, 60, reason)}
                isCurrentlyPunchedIn={isPunchedIn}
              />
            )}
            {activeTab === 'tasks' && (
              <EmployeeTaskHub 
                tasks={tasks.filter(t => t.employeeId === 'e1')} 
                onCompleteTask={handleCompleteTask} 
              />
            )}
            {activeTab === 'leaves' && (
              <LeaveManagement 
                userRole={MOCK_USER.role} 
                isEmployeeMode={true} 
                leaveRequests={leaveRequests}
                balances={balances}
                otRequests={otEarnRequests.filter(r => r.employeeId === 'e1')}
                onApplyOTEarn={handleApplyOTEarn}
                activeClient={activeClient}
                onApplyLeave={handleApplyLeave}
                isCycleLocked={isCycleLocked}
              />
            )}
            {activeTab === 'holidays' && (
              <HolidayManager 
                holidays={holidays.filter(h => h.clientId === activeClientId)}
                isEmployeeMode={true}
              />
            )}
            {activeTab === 'regularization' && (
              <ExemptionManager 
                isEmployeeMode={true} 
                exemptionRequests={exemptionRequests.filter(r => r.employeeId === 'e1')}
                onApplyExemption={handleApplyExemption}
              />
            )}
            {activeTab === 'requests' && (
              <Dashboard 
                clientName={activeClient.name} 
                isEmployeeMode={true} 
                cycles={currentClientCycles}
                leaveRequests={leaveRequests.filter(r => r.employeeId === 'e1')}
                exemptionRequests={exemptionRequests.filter(r => r.employeeId === 'e1')}
              />
            )}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            clientName={activeClient.name} 
            attendance={attendance}
            leaveRequests={leaveRequests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            cycles={currentClientCycles}
            onToggleSpecificCycleLock={handleToggleSpecificCycleLock}
            onUpdateSpecificCycle={handleUpdateSpecificCycle}
            onFreezeCycle={handleFreezeCycle}
            exemptionRequests={exemptionRequests}
          />
        );
      case 'employees':
        return (
          <EmployeeTable 
            employees={employees} 
            activeClient={activeClient} 
            onAddEmployee={(e) => setEmployees(prev => [...prev, e])} 
            attendance={attendance}
            leaveRequests={leaveRequests}
          />
        );
      case 'tasks':
        return (
          <TaskManager 
            employees={employees.filter(e => e.clientId === activeClient.id)} 
            tasks={tasks.filter(t => employees.some(e => e.id === t.employeeId && e.clientId === activeClient.id))}
            onAssignTask={handleAssignTask}
          />
        );
      case 'overtime':
        return (
          <OTManagement 
            otEarnRequests={otEarnRequests} 
            onApproveOTEarn={handleApproveOTEarn}
            employees={employees}
          />
        );
      case 'leaves':
        return (
          <LeaveManagement 
            userRole={MOCK_USER.role} 
            leaveRequests={leaveRequests}
            balances={balances}
            activeClient={activeClient}
            onApprove={(id) => handleApproveRequest(id, 'LEAVE')}
          />
        );
      case 'holidays':
        return (
          <HolidayManager 
            holidays={holidays.filter(h => h.clientId === activeClientId)}
            onAddHoliday={handleAddHoliday}
            onDeleteHoliday={handleDeleteHoliday}
          />
        );
      case 'policies':
        return <PolicyManager activeClient={activeClient} />;
      case 'attendance':
        return <RosterManager employees={employees.filter(e => e.clientId === activeClient.id)} shifts={MOCK_SHIFTS} />;
      default:
        return <Dashboard clientName={activeClient.name} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {!isEmployeeMode && (
        <Sidebar 
          userRole={MOCK_USER.role}
          clients={availableClients}
          activeClientId={activeClientId}
          onClientChange={setActiveClientId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <main className={`flex-1 flex flex-col min-h-screen transition-all ${!isEmployeeMode ? 'ml-64 p-10' : 'p-6'}`}>
        <header className="flex justify-between items-center mb-12">
          {!isEmployeeMode ? (
            <div className="flex items-center gap-6 bg-white px-8 py-3.5 rounded-[32px] border border-slate-200 shadow-sm w-[550px]">
               <Search className="text-slate-400" size={20} />
               <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-slate-600 font-bold" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-[20px] flex items-center justify-center text-white font-black">OT</div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">OmniTime <span className="text-blue-600">ESS</span></span>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEmployeeMode(!isEmployeeMode)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase">
              <UserCircle size={16} /> {isEmployeeMode ? 'Admin Portal' : 'My Self-Service'}
            </button>
            <button className="relative p-3 text-slate-500 bg-white border border-slate-200 rounded-2xl">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        <div className="flex-1">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
