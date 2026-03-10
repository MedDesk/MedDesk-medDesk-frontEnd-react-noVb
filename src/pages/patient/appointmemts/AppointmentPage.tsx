import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  getByPatientId, 
  updateAppointmentStatus, 
  getDayAvailability,
  createAppointment 
} from '../../../services/adminServices/Appointment.service';
import { getCurrentUser } from '../../../services/adminServices/Auth.service'; // Added AuthService

// ─── Types
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

const STATUS_MAP: Record<AppointmentStatus, { color: string; bg: string; border: string; icon: string }> = {
  SCHEDULED: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'fa-clock' },
  CONFIRMED: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-circle-check' },
  CANCELED:  { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'fa-circle-xmark' },
  COMPLETED: { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'fa-check-double' },
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedDaySlots, setSelectedDaySlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [sidebarDate, setSidebarDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: "", time: "09:00:00" });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // ─── Data Loading ───

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user && user.id) {
        const [apptRes, slotRes] = await Promise.all([
          getByPatientId(user.id),
          getDayAvailability(sidebarDate)
        ]);
        setAppointments(apptRes || []);
        setSelectedDaySlots(slotRes || []);
      }
    } catch (error) {
      console.error("Error loading patient dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [sidebarDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Actions ───

  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel your appointment?")) return;
    try {
      await updateAppointmentStatus(id, 'CANCELED');
      loadData();
    } catch (error) {
      alert("Cancellation failed. Please contact the clinic.");
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({
        patientId: currentUser.id,
        appointmentDate: formData.date,
        scheduleTimeStart: formData.time,
        appointmentStatus: "SCHEDULED"
      });
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("This slot is no longer available.");
    }
  };

  // ─── Helpers ───
  const fmtT = (t: string) => t?.slice(0, 5) || "--:--";
  const getCount = (status: AppointmentStatus) => appointments.filter(a => a.appointmentStatus === status).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 selection:bg-blue-100">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">My Schedule</h1>
          <p className="text-slate-500 font-medium">View and manage your clinical visits</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-bold text-sm shadow-xl transition-all flex items-center gap-3 active:scale-95"
        >
          <i className="fa-solid fa-calendar-plus"></i> New Appointment
        </button>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Scheduled" val={getCount('SCHEDULED') + getCount('CONFIRMED')} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Completed" val={getCount('COMPLETED')} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Canceled" val={getCount('CANCELED')} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Total Visits" val={appointments.length} color="text-slate-500" bg="bg-slate-100" />
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-300 font-black tracking-widest animate-pulse uppercase">Fetching your medical timeline...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Main List */}
          <div className="xl:col-span-2">
            <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Appointment Details</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.length > 0 ? appointments.map(apt => (
                    <tr key={apt.id} className="group hover:bg-blue-50/20 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-slate-800 text-lg">{fmtT(apt.scheduleTimeStart)} - {fmtT(apt.scheduleTimeEnd)}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tight">{apt.appointmentDate}</div>
                      </td>
                      <td className="p-6">
                        <StatusBadge status={apt.appointmentStatus} />
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          {(apt.appointmentStatus === 'SCHEDULED' || apt.appointmentStatus === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleCancel(apt.id)}
                              className="px-4 py-2 rounded-xl border border-rose-100 text-rose-500 text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                              Cancel Booking
                            </button>
                          )}
                          
                          {apt.appointmentStatus === 'COMPLETED' && apt.medicalRecordId && (
                            <Link 
                              to={`/dashboard/medical-records/${apt.medicalRecordId}`}
                              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                            >
                              View Report
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="p-24 text-center text-slate-400 font-medium italic">You don't have any appointments in our records yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Availability */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover/card:bg-blue-500/30 transition-all duration-700"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
                  Clinic Slots
                  <i className="fa-solid fa-clock-rotate-left text-blue-400 opacity-50"></i>
                </h3>
                
                <input 
                  type="date" 
                  value={sidebarDate}
                  onChange={(e) => setSidebarDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all mb-8"
                />

                <div className="space-y-3">
                  {slotsLoading ? (
                    <div className="py-10 text-center text-blue-400 animate-pulse text-[10px] font-black uppercase tracking-widest">Syncing Availability...</div>
                  ) : selectedDaySlots.slice(0, 6).map(slot => (
                    <div key={slot.startTime} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-sm font-bold text-blue-100">{fmtT(slot.startTime)}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${slot.available ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/20'}`}>
                        {slot.available ? 'Free' : 'Taken'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Integration */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Booking</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
                <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700 transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
                <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-6 py-5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white outline-none font-bold text-slate-700 appearance-none cursor-pointer">
                   <option value="09:00:00">09:00 AM</option>
                   <option value="10:00:00">10:00 AM</option>
                   <option value="11:00:00">11:00 AM</option>
                   <option value="14:00:00">02:00 PM</option>
                   <option value="15:00:00">03:00 PM</option>
                </select>
              </div>

              <button type="submit" className="w-full py-5 rounded-3xl font-black text-white bg-blue-600 hover:bg-slate-900 shadow-2xl shadow-blue-200 transition-all text-sm uppercase tracking-widest">
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ───

function StatCard({ label, val, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col gap-2 hover:shadow-lg transition-shadow">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-3xl font-black ${color}`}>{val}</span>
      <div className={`h-1.5 w-10 rounded-full ${bg.replace('bg-', 'bg-')}`}></div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${cfg.bg} ${cfg.color} ${cfg.border} text-[10px] font-black uppercase tracking-tight`}>
      <i className={`fa-solid ${cfg.icon}`}></i>
      {status}
    </div>
  );
}