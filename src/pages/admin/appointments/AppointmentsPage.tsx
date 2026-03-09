import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  deleteAppointment, 
  getDayAvailability,
  createAppointment 
} from '../../../services/adminServices/Appointment.service';

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

// ─── Status UI Config ─────────────────────────────────────────────────────────
const STATUS_MAP: Record<AppointmentStatus, { color: string; bg: string; border: string; icon: string }> = {
  SCHEDULED: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'fa-clock' },
  CONFIRMED: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-circle-check' },
  CANCELED:  { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'fa-circle-xmark' },
  COMPLETED: { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'fa-check-double' },
};

export default function AppointmentsPage() {
  // Data States
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedDaySlots, setSelectedDaySlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Sidebar Date Filter (Defaults to today)
  const [sidebarDate, setSidebarDate] = useState(new Date().toISOString().split('T')[0]);
  
  // UI States
  const [filter, setFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Booking Form State
  const [formData, setFormData] = useState({ patientId: "", date: "" });

  // ─── API Logic ───

  const loadMainList = useCallback(async () => {
    try {
      const apptRes = await getAppointments(0, 100); // Fetching 100 records
      setAppointments(apptRes.content || []);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  }, []);

  const loadSidebarSlots = useCallback(async (date: string) => {
    setSlotsLoading(true);
    try {
      const slotRes = await getDayAvailability(date);
      setSelectedDaySlots(slotRes || []);
    } catch (error) {
      console.error("Failed to fetch slots", error);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Effect: Initial Load and Sidebar Refresh on date change
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadMainList(), loadSidebarSlots(sidebarDate)]);
      setLoading(false);
    };
    init();
  }, [loadMainList, loadSidebarSlots, sidebarDate]);

  // Handlers
  const handleStatusChange = async (id: number, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status);
      loadMainList(); // Refresh the table
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Permanent delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      loadMainList();
    } catch (error) {
      alert("Error deleting record");
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({
        patientId: Number(formData.patientId),
        appointmentDate: formData.date,
        scheduleTimeStart: "09:00:00", // Simplified for this demo
        appointmentStatus: "SCHEDULED"
      });
      setIsModalOpen(false);
      loadMainList();
      if(formData.date === sidebarDate) loadSidebarSlots(sidebarDate);
    } catch (error) {
      alert("Booking failed");
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const fmtT = (t: string) => t?.slice(0, 5) || "--:--";
  const filtered = appointments.filter(a => filter === "ALL" || a.appointmentStatus === filter);
  const getCount = (status: AppointmentStatus) => appointments.filter(a => a.appointmentStatus === status).length;

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

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold animate-pulse">SYNCHRONIZING RECORDS...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left: Appointments List */}
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
                        {/* Navigate to Patient Details */}
                        <Link to={`/patients/${apt.patientId}`} className="block hover:translate-x-1 transition-transform group/link">
                          <div className="font-bold text-slate-700 group-hover/link:text-blue-600 transition-colors">Patient #{apt.patientId}</div>
                          <div className="text-[10px] font-bold text-blue-500/60 uppercase">Record: {apt.medicalRecordId || 'N/A'}</div>
                        </Link>
                      </td>
                      <td className="p-5">
                        <StatusBadge status={apt.appointmentStatus} />
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          
                          {apt.appointmentStatus === 'SCHEDULED' && (
                            <>
                              <button onClick={() => handleStatusChange(apt.id, 'CONFIRMED')} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center">
                                <i className="fa-solid fa-circle-check text-xs"></i>
                              </button>
                              <button onClick={() => handleStatusChange(apt.id, 'CANCELED')} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center">
                                <i className="fa-solid fa-circle-xmark text-xs"></i>
                              </button>
                            </>
                          )}

                          {apt.appointmentStatus === 'CONFIRMED' && (
                            <>
                              <button onClick={() => handleStatusChange(apt.id, 'COMPLETED')} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center">
                                <i className="fa-solid fa-square-check text-xs"></i>
                              </button>
                              <button onClick={() => handleStatusChange(apt.id, 'CANCELED')} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center">
                                <i className="fa-solid fa-circle-xmark text-xs"></i>
                              </button>
                            </>
                          )}

                          {apt.appointmentStatus === 'COMPLETED' && (
                            <Link to={`/medical-records/${apt.medicalRecordId}`} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                               <i className="fa-solid fa-notes-medical"></i> Record
                            </Link>
                          )}

                          {apt.appointmentStatus === 'CANCELED' && <span className="text-[10px] font-black text-slate-300 uppercase italic">Canceled</span>}

                          {(apt.appointmentStatus !== 'COMPLETED' && apt.appointmentStatus !== 'CANCELED') && (
                            <button onClick={() => handleDelete(apt.id)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center">
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar: Quick Availability */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-black text-slate-800">Quick Availability</h3>
                   <i className="fa-solid fa-calendar-check text-blue-500 bg-blue-50 p-3 rounded-2xl"></i>
                </div>
                
                {/* Date Picker Input */}
                <div className="relative">
                  <i className="fa-solid fa-calendar-day absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-xs"></i>
                  <input 
                    type="date" 
                    value={sidebarDate}
                    onChange={(e) => setSidebarDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-700 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Slots Available</p>
              
              <div className="space-y-3">
                {slotsLoading ? (
                  <div className="py-10 text-center text-slate-300 animate-pulse text-[10px] font-black uppercase">Updating...</div>
                ) : selectedDaySlots.length > 0 ? (
                  selectedDaySlots.slice(0, 8).map(slot => (
                    <div key={slot.startTime} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${slot.available ? 'bg-white border-slate-100 hover:border-blue-300' : 'bg-slate-50 border-transparent opacity-50'}`}>
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid fa-clock text-xs ${slot.available ? 'text-blue-500' : 'text-slate-300'}`}></i>
                        <span className={`text-sm font-bold ${slot.available ? 'text-slate-700' : 'text-slate-400'}`}>{fmtT(slot.startTime)}</span>
                      </div>
                      {slot.available ? (
                        <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded-lg">Free</span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-400 uppercase">Taken</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-400 text-xs italic font-medium">No slots found.</div>
                )}
              </div>

              <Link to="/availability" className="block text-center w-full mt-6 bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-50">
                View Detailed Schedule
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Book Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-circle-xmark text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient ID</label>
                <input required type="number" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} placeholder="Patient ID (e.g. 3)" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-bold text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Cancel</button>
                <button type="submit" className="py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



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