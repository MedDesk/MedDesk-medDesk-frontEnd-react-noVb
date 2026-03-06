import React, { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkingHour {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_SHORT: Record<string, string> = {
  MONDAY: "MON", TUESDAY: "TUE", WEDNESDAY: "WED", THURSDAY: "THU", FRIDAY: "FRI", SATURDAY: "SAT", SUNDAY: "SUN",
};
const DAY_FULL: Record<string, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SEED: WorkingHour[] = [
  { id: 1, dayOfWeek: "MONDAY", startTime: "09:00:00", endTime: "17:00:00", active: true },
  { id: 2, dayOfWeek: "TUESDAY", startTime: "09:00:00", endTime: "17:00:00", active: true },
  { id: 3, dayOfWeek: "WEDNESDAY", startTime: "08:30:00", endTime: "16:30:00", active: true },
  { id: 4, dayOfWeek: "THURSDAY", startTime: "09:00:00", endTime: "15:30:00", active: false },
  { id: 5, dayOfWeek: "FRIDAY", startTime: "09:00:00", endTime: "14:00:00", active: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const calculateDuration = (start: string, end: string) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  const h = Math.floor(mins / 60), m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkingHoursPage() {
  const [hours, setHours] = useState<WorkingHour[]>(SEED);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<WorkingHour | null>(null);

  const activeCount = hours.filter(h => h.active).length;
  const configuredDays = hours.map(h => h.dayOfWeek);

  return (
    <div className="min-h-screen bg-[#F0F2F8] p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Working Hours</h1>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {activeCount} / {hours.length} Active
            </span>
          </div>
          <p className="text-slate-500 text-sm">Configure your hospital's operational schedule for each day.</p>
        </div>
        <button 
          onClick={() => { setSelectedDay(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs"></i> Add Schedule
        </button>
      </div>

      {/* Week Timeline Strip */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 flex gap-2 overflow-x-auto border border-slate-100">
        {ALL_DAYS.map((day) => {
          const entry = hours.find(h => h.dayOfWeek === day);
          const isActive = entry?.active;
          const hasEntry = !!entry;
          
          return (
            <div key={day} className="flex flex-col items-center gap-2 flex-1 min-w-[50px]">
              <span className={`text-[10px] font-bold tracking-widest ${hasEntry && isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {DAY_SHORT[day]}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                hasEntry ? (isActive ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-slate-300') : 'bg-slate-100 border-2 border-dashed border-slate-300'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hours.sort((a,b) => ALL_DAYS.indexOf(a.dayOfWeek) - ALL_DAYS.indexOf(b.dayOfWeek)).map((item) => (
          <DayCard 
            key={item.id} 
            item={item} 
            onEdit={() => { setSelectedDay(item); setIsModalOpen(true); }}
          />
        ))}

        {/* Ghost Cards for missing days */}
        {ALL_DAYS.filter(d => !configuredDays.includes(d)).map((day) => (
          <div key={day} className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50">
             <span className="text-[10px] font-mono font-bold text-slate-300 tracking-tighter uppercase">{DAY_SHORT[day]}</span>
             <h3 className="text-lg font-bold text-slate-300">{DAY_FULL[day]}</h3>
             <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-slate-400 hover:text-blue-600 text-xs font-bold flex items-center gap-2 transition-colors"
             >
               <i className="fa-solid fa-circle-plus"></i> Configure
             </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ScheduleModal 
          item={selectedDay} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function DayCard({ item, onEdit }: { item: WorkingHour; onEdit: () => void }) {
  const duration = calculateDuration(item.startTime, item.endTime);
  
  return (
    <div className={`group rounded-[2rem] p-6 border transition-all duration-300 ${
      item.active ? 'bg-white border-blue-100 shadow-md hover:shadow-xl' : 'bg-slate-50 border-slate-200 opacity-80'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">{DAY_SHORT[item.dayOfWeek]}</p>
          <h3 className={`text-xl font-black ${item.active ? 'text-slate-800' : 'text-slate-400'}`}>{DAY_FULL[item.dayOfWeek]}</h3>
        </div>
        <div className={`w-11 h-6 rounded-full relative p-1 transition-colors duration-300 cursor-pointer ${item.active ? 'bg-blue-500' : 'bg-slate-300'}`}>
          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${item.active ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight mb-6 ${
        item.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
        {item.active ? 'Operational' : 'Closed'}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Opens</p>
          <p className={`text-sm font-mono font-bold ${item.active ? 'text-slate-700' : 'text-slate-400'}`}>{formatTime(item.startTime)}</p>
        </div>
        <i className="fa-solid fa-arrow-right-long text-slate-200"></i>
        <div className="flex-1 text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Closes</p>
          <p className={`text-sm font-mono font-bold ${item.active ? 'text-slate-700' : 'text-slate-400'}`}>{formatTime(item.endTime)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full bg-blue-500 transition-all duration-1000 ${item.active ? 'w-2/3' : 'w-0'}`} />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-slate-400">
          <i className="fa-solid fa-clock text-[10px]"></i>
          <span className="text-[10px] font-bold uppercase">{duration} shift</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onEdit} className="flex-1 bg-white border border-slate-200 hover:border-blue-200 hover:text-blue-600 p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-slate-600">
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button className="w-10 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 rounded-xl transition-all flex items-center justify-center text-slate-400">
          <i className="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    </div>
  );
}



function ScheduleModal({ item, onClose }: { item: WorkingHour | null; onClose: () => void }) {
  // 1. Create Refs for the time inputs
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">{item ? 'Edit' : 'Add'} Schedule</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form className="space-y-6">
          {/* Day Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Day of Week</label>
            <div className="relative">
              <i className="fa-solid fa-calendar-day absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <select className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
                {ALL_DAYS.map(d => <option key={d} value={d}>{DAY_FULL[d]}</option>)}
              </select>
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Opening Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Opening</label>
              <div 
                className="relative cursor-pointer group"
                onClick={() => startTimeRef.current?.showPicker()} // Trigger picker on div click
              >
                <i className="fa-solid fa-door-open absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-hover:text-blue-500 transition-colors"></i>
                <input 
                  ref={startTimeRef}
                  type="time" 
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-bold text-sm cursor-pointer block" 
                  defaultValue="09:00" 
                />
              </div>
            </div>

            {/* Closing Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Closing</label>
              <div 
                className="relative cursor-pointer group"
                onClick={() => endTimeRef.current?.showPicker()} // Trigger picker on div click
              >
                <i className="fa-solid fa-door-closed absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-hover:text-blue-500 transition-colors"></i>
                <input 
                  ref={endTimeRef}
                  type="time" 
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-bold text-sm cursor-pointer block" 
                  defaultValue="17:00" 
                />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
            <div>
              <span className="block text-sm font-bold text-slate-700">Active Status</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Accepting appointments</span>
            </div>
            <div className="w-12 h-6 rounded-full bg-blue-500 p-1 flex justify-end cursor-pointer shadow-inner">
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}