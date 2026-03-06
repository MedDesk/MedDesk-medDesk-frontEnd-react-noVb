import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

interface AppointmentDto {
  id: number;
  scheduleTimeStart: string;
  scheduleTimeEnd: string;
  appointmentStatus: AppointmentStatus;
  patientId: number;
  medicalRecordId: number | null;
  appointmentDate: string;
}

interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<AppointmentStatus, { color: string; bg: string; border: string; icon: string }> = {
  SCHEDULED: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'fa-clock' },
  CONFIRMED: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-circle-check' },
  CANCELED:  { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'fa-circle-xmark' },
  COMPLETED: { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'fa-check-double' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_APPOINTMENTS: AppointmentDto[] = [
  { id: 1, scheduleTimeStart: "09:00:00", scheduleTimeEnd: "09:30:00", appointmentStatus: "SCHEDULED", patientId: 3, medicalRecordId: null, appointmentDate: "2025-10-16" },
  { id: 2, scheduleTimeStart: "10:00:00", scheduleTimeEnd: "10:30:00", appointmentStatus: "CONFIRMED", patientId: 7, medicalRecordId: null, appointmentDate: "2025-10-17" },
  { id: 3, scheduleTimeStart: "11:30:00", scheduleTimeEnd: "12:00:00", appointmentStatus: "COMPLETED", patientId: 3, medicalRecordId: 412, appointmentDate: "2025-10-12" },
  { id: 4, scheduleTimeStart: "14:00:00", scheduleTimeEnd: "14:30:00", appointmentStatus: "CANCELED", patientId: 2, medicalRecordId: null, appointmentDate: "2025-10-18" },
];

const MOCK_SLOTS: Slot[] = [
  { startTime: "09:00:00", endTime: "09:30:00", available: true },
  { startTime: "09:30:00", endTime: "10:00:00", available: false },
  { startTime: "10:00:00", endTime: "10:30:00", available: true },
  { startTime: "10:30:00", endTime: "11:00:00", available: true },
  { startTime: "11:00:00", endTime: "11:30:00", available: true },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>(INITIAL_APPOINTMENTS);
  const [filter, setFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper: Simple Time Format
  const fmtT = (t: string) => t.slice(0, 5);

  // Filter Logic
  const filtered = appointments.filter(a => filter === "ALL" || a.appointmentStatus === filter);

  // Stats
  const getCount = (status: AppointmentStatus) => appointments.filter(a => a.appointmentStatus === status).length;

  // Confirm appointment — changes status SCHEDULED → CONFIRMED
  // Accessible by: receptionist, admin, and doctor to valid appointment
  const handleConfirm = (id: number) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, appointmentStatus: 'CONFIRMED' } : a)
    );
  };

  // Mark as Completed — changes status CONFIRMED → COMPLETED
  // this icon is for appointments that are finished
  const handleComplete = (id: number) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, appointmentStatus: 'COMPLETED' } : a)
    );
  };

  // Cancel appointment — changes status to CANCELED
  // only admin and reception and patient itself can cancel that appointment
  const handleCancel = (id: number) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, appointmentStatus: 'CANCELED' } : a)
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500 text-sm font-medium">Clinic Schedule Management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> Book Appointment
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Scheduled" val={getCount('SCHEDULED')} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Confirmed" val={getCount('CONFIRMED')} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Canceled" val={getCount('CANCELED')} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Completed" val={getCount('COMPLETED')} color="text-slate-500" bg="bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: List View */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            {['ALL', 'SCHEDULED', 'CONFIRMED', 'CANCELED', 'COMPLETED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Time & Date</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(apt => (
                  <tr key={apt.id} className={`group transition-colors ${apt.appointmentStatus === 'COMPLETED' ? 'bg-slate-50/50' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-5">
                      <div className="font-bold text-slate-800">{fmtT(apt.scheduleTimeStart)} - {fmtT(apt.scheduleTimeEnd)}</div>
                      <div className="text-xs text-slate-400 font-medium">{apt.appointmentDate}</div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-700">Patient #{apt.patientId}</div>
                      <div className="text-[10px] font-bold text-blue-500/60 uppercase">Record: {apt.medicalRecordId || 'N/A'}</div>
                    </td>
                    <td className="p-5">
                      <StatusBadge status={apt.appointmentStatus} />
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        
                        {/* Status: SCHEDULED */}
                        {apt.appointmentStatus === 'SCHEDULED' && (
                          <>
                            {/* this button for reception and admin and doctor to valid appointment */}
                            <button
                              onClick={() => handleConfirm(apt.id)}
                              title="Confirm appointment"
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center"
                            >
                              <i className="fa-solid fa-circle-check text-xs"></i>
                            </button>
                            {/* only admin and reception and patient itself can cancel */}
                            <button
                              onClick={() => handleCancel(apt.id)}
                              title="Cancel appointment"
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center"
                            >
                              <i className="fa-solid fa-circle-xmark text-xs"></i>
                            </button>
                          </>
                        )}

                        {/* Status: CONFIRMED */}
                        {apt.appointmentStatus === 'CONFIRMED' && (
                          <>
                            {/* Icon for appointments that are confirmed to mark as completed */}
                            <button
                              onClick={() => handleComplete(apt.id)}
                              title="Mark as Completed"
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
                            >
                              <i className="fa-solid fa-square-check text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center"
                            >
                              <i className="fa-solid fa-circle-xmark text-xs"></i>
                            </button>
                          </>
                        )}

                        {/* Status: COMPLETED (Terminé) */}
                        {apt.appointmentStatus === 'COMPLETED' && (
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <i className="fa-solid fa-notes-medical"></i>
                            Medical Record
                          </button>
                        )}

                        {/* Status: CANCELED */}
                        {apt.appointmentStatus === 'CANCELED' && (
                           <span className="text-[10px] font-black text-slate-300 uppercase italic">Canceled</span>
                        )}

                        {/* General actions for active appointments */}
                        {(apt.appointmentStatus !== 'COMPLETED' && apt.appointmentStatus !== 'CANCELED') && (
                          <>
                            <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center">
                              <i className="fa-solid fa-pen-to-square text-xs"></i>
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center">
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Availability */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800">Quick Availability</h3>
              <i className="fa-solid fa-calendar-check text-blue-500 bg-blue-50 p-3 rounded-2xl"></i>
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Today's Slots</p>
            <div className="space-y-3">
              {MOCK_SLOTS.map(slot => (
                <div key={slot.startTime} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${slot.available ? 'bg-white border-slate-100 hover:border-blue-300 cursor-pointer' : 'bg-slate-50 border-transparent opacity-50 cursor-not-allowed'}`}>
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid fa-clock text-xs ${slot.available ? 'text-blue-500' : 'text-slate-300'}`}></i>
                    <span className={`text-sm font-bold ${slot.available ? 'text-slate-700' : 'text-slate-400'}`}>{fmtT(slot.startTime)}</span>
                  </div>
                  {slot.available ? (
                    <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded-lg">Available</span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-400 uppercase">Taken</span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="w-full mt-6 bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">
              View All Time Slots
            </button>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Book Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-circle-xmark text-2xl"></i>
              </button>
            </div>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient ID</label>
                <input type="number" placeholder="Enter patient ID..." className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input type="date" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-bold text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Cancel</button>
                <button type="submit" className="py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StatCard({ label, val, color, bg }: any) {
  return (
    <div className={`p-5 rounded-3xl border border-slate-100 bg-white flex flex-col gap-1 shadow-sm`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-2xl font-black ${color}`}>{val}</span>
      <div className={`h-1 w-8 rounded-full ${bg.replace('bg-', 'bg-')}`}></div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color} ${cfg.border} text-[10px] font-black uppercase tracking-tight`}>
      <i className={`fa-solid ${cfg.icon}`}></i>
      {status}
    </div>
  );
}