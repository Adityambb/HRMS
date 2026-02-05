
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Home, Briefcase, Camera, Clock, AlertCircle, CheckCircle2, History, Send, LogOut, TrendingUp, Lock } from 'lucide-react';
import { Client, Employee, LocationType } from '../types';

interface PunchClockProps {
  employee: Employee;
  client: Client;
  onPunchSuccess: (type: 'IN' | 'OUT', location: LocationType) => void;
  onRegularize: (date: string, reason: string, data: any) => void;
  isCurrentlyPunchedIn: boolean;
}

const PunchClock: React.FC<PunchClockProps> = ({ employee, client, onPunchSuccess, onRegularize, isCurrentlyPunchedIn }) => {
  const [step, setStep] = useState<'LOCATION' | 'SELFIE' | 'STATUS' | 'REGULARIZE'>('LOCATION');
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPunching, setIsPunching] = useState(false);
  const [punchTime, setPunchTime] = useState<Date | null>(null);
  const [calculatedStatus, setCalculatedStatus] = useState<string>('');
  const [totalHoursDisplay, setTotalHoursDisplay] = useState<string>('');

  // Local storage used to simulate punch-in persistence for duration calculation in UI
  const PUNCH_IN_KEY = `punch_in_time_${employee.id}`;

  // For Regularization Form
  const [regDate, setRegDate] = useState('');
  const [regIn, setRegIn] = useState('');
  const [regOut, setRegOut] = useState('');
  const [regReason, setRegReason] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Camera access required for attendance validation.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream.getTracks) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  const handleLocationSelect = (type: LocationType) => {
    if (type !== LocationType.OFFICE) {
      const isAllowed = client.allowedRemoteDesignations.includes(employee.designation);
      if (!isAllowed) {
        setError(`Your designation is not authorized for ${type} work.`);
        return;
      }
    }
    setSelectedType(type);
    setStep('SELFIE');
    startCamera();
  };

  const handlePunchSubmit = async () => {
    setIsPunching(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    const now = new Date();
    
    if (!isCurrentlyPunchedIn) {
      // Logic for Punch In: Store start time
      localStorage.setItem(PUNCH_IN_KEY, now.toISOString());
      setCalculatedStatus('');
      setTotalHoursDisplay('');
    } else {
      // Logic for Punch Out: Calculate duration and status
      const storedInStr = localStorage.getItem(PUNCH_IN_KEY);
      // Fallback to a mock 9 hours ago if the local storage is empty (e.g. for demo purposes)
      const punchIn = storedInStr ? new Date(storedInStr) : new Date(now.getTime() - 8.5 * 60 * 60 * 1000);
      
      const diffMs = now.getTime() - punchIn.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      setTotalHoursDisplay(`${hours}h ${mins}m`);

      // Business Rule Calculation from Client config
      const presentThresholdMins = client.presentThresholdHours * 60;
      const halfDayThresholdMins = client.halfDayThresholdHours * 60;

      if (diffMins >= presentThresholdMins) {
        setCalculatedStatus('PRESENT - FULL DAY');
      } else if (diffMins >= halfDayThresholdMins) {
        setCalculatedStatus('HALF DAY CREDIT');
      } else {
        setCalculatedStatus('ABSENT - INSUFFICIENT HOURS');
      }

      // Cleanup
      localStorage.removeItem(PUNCH_IN_KEY);
    }

    setPunchTime(now);
    setIsPunching(false);
    setStep('STATUS');
    stopCamera();
    onPunchSuccess(isCurrentlyPunchedIn ? 'OUT' : 'IN', selectedType || LocationType.OFFICE);
  };

  const handleRegSubmit = () => {
    if (!regDate || !regReason) {
      alert("Please fill date and reason.");
      return;
    }
    onRegularize(regDate, regReason, { in: regIn, out: regOut });
    setStep('LOCATION');
    setRegDate('');
    setRegReason('');
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden max-w-md mx-auto relative">
      <div className={`p-8 text-white text-center transition-colors duration-500 ${isCurrentlyPunchedIn ? 'bg-rose-600' : 'bg-slate-900'}`}>
        <h3 className="text-2xl font-black tracking-tight">
          {isCurrentlyPunchedIn ? 'End Your Shift' : 'Punch Attendance'}
        </h3>
        <p className="text-white/60 text-xs mt-1 font-bold uppercase tracking-widest">
          {isCurrentlyPunchedIn ? 'Currently Clocked In' : 'Daily Checkpoint'}
        </p>
      </div>

      <div className="p-10">
        {step === 'LOCATION' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: LocationType.OFFICE, icon: <MapPin size={24} />, label: 'Office' },
                { type: LocationType.WFH, icon: <Home size={24} />, label: 'WFH' },
                { type: LocationType.TRAVELLING, icon: <Briefcase size={24} />, label: 'Travel' },
                { type: LocationType.EXTERNAL, icon: <MapPin size={24} />, label: 'Client' },
              ].map(item => (
                <button 
                  key={item.label}
                  onClick={() => handleLocationSelect(item.type)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-[32px] border-2 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                    isCurrentlyPunchedIn ? 'border-rose-50 hover:border-rose-500 hover:bg-rose-50' : 'border-slate-50 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl transition-all ${
                    isCurrentlyPunchedIn 
                    ? 'bg-rose-50 text-rose-400 group-hover:bg-rose-100 group-hover:text-rose-600' 
                    : 'bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {isCurrentlyPunchedIn ? <LogOut size={24} /> : item.icon}
                  </div>
                  <span className="text-sm font-black text-slate-700">{isCurrentlyPunchedIn ? `Exit ${item.label}` : item.label}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setStep('REGULARIZE');
              }}
              className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-colors border-t border-slate-100 mt-4 text-slate-400 hover:text-blue-600"
            >
              <History size={14} /> Regularize Missed Swipe
            </button>
            
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </div>
            )}
          </div>
        )}

        {step === 'SELFIE' && (
          <div className="flex flex-col items-center gap-8">
             <div className="relative w-full aspect-square bg-slate-900 rounded-[40px] overflow-hidden border-8 border-slate-100 shadow-2xl">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
               <div className="absolute inset-0 border-[60px] border-black/20 rounded-full scale-95 opacity-50" />
             </div>
             <div className="flex gap-4 w-full">
               <button onClick={() => { stopCamera(); setStep('LOCATION'); }} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-3xl font-black uppercase text-[10px] tracking-widest">Back</button>
               <button onClick={handlePunchSubmit} disabled={isPunching} className={`flex-[2] px-8 py-4 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-lg ${
                 isCurrentlyPunchedIn ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
               }`}>
                 {isPunching ? 'Verifying...' : isCurrentlyPunchedIn ? 'Punch Out' : 'Punch In'}
               </button>
             </div>
          </div>
        )}

        {step === 'STATUS' && (
          <div className="flex flex-col items-center text-center py-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isCurrentlyPunchedIn ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">
              {isCurrentlyPunchedIn ? 'Punch Out Successful' : 'Punch In Successful'}
            </h4>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Logged at {punchTime?.toLocaleTimeString()}
            </p>
            
            {calculatedStatus && (
              <div className="w-full p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Status</span>
                  <span className="text-xs font-black text-emerald-600">{calculatedStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Duration</span>
                  <span className="text-sm font-black text-slate-900">{totalHoursDisplay}</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => setStep('LOCATION')} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
            >
              Done
            </button>
          </div>
        )}

        {step === 'REGULARIZE' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h4 className="text-lg font-black text-slate-900">Request Regularization</h4>
              <p className="text-xs text-slate-500 font-medium">For missing or incorrect punch data</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date</label>
                <input 
                  type="date" 
                  value={regDate} 
                  onChange={(e) => setRegDate(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time In</label>
                  <input 
                    type="time" 
                    value={regIn} 
                    onChange={(e) => setRegIn(e.target.value)} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time Out</label>
                  <input 
                    type="time" 
                    value={regOut} 
                    onChange={(e) => setRegOut(e.target.value)} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reason</label>
                <textarea 
                  rows={3} 
                  value={regReason} 
                  onChange={(e) => setRegReason(e.target.value)} 
                  placeholder="Why is this correction needed?" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none" 
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep('LOCATION')} 
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleRegSubmit} 
                className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <Send size={14} /> Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PunchClock;
