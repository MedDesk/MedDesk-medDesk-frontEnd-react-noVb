import React, { useState, useEffect } from 'react';
// Changed deleteAppointment to updateAvailability
import { getWeeklyAvailability, createAppointment, updateAvailability } from '../../../services/adminServices/Appointment.service';

// ─── Types ─────────────────
interface Slot {
  appointmentId?: number; // Matches backend DTO
  startTime: string;
  endTime: string;
  available: boolean;     // Matches backend JSON key
  status?: string;        // Optional status string
}

interface DayAvailability {
  dayOfWeek: string;
  date: string;
  slots: Slot[];
}

export default function DisplayAppointments() {
  const [weeklyData, setWeeklyData] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [patientId, setPatientId] = useState("");

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await getWeeklyAvailability();
      // Handle the data whether it's wrapped in response.data or direct
      setWeeklyData(response.data || response); 
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !patientId) return;

    const body = {
      scheduleTimeStart: selectedSlot.time,
      appointmentStatus: "SCHEDULED",
      patientId: Number(patientId),
      appointmentDate: selectedSlot.date
    };

    try {
      await createAppointment(body);
      alert("Appointment booked successfully!");
      setIsModalOpen(false);
      setPatientId("");
      fetchAvailability(); 
    } catch (error) {
      alert("Failed to book appointment.");
    }
  };

  // ─── Fixed: Handle Availability Toggle Logic ────────────────────────────────
  const handleCancelAppointment = async (appointmentId: number) => {
    if (!window.confirm("Are you sure you want to cancel this appointment and make the slot available?")) return;

    try {
      // available: true makes the slot available again (sets status to CANCELED in DB)
      await updateAvailability(appointmentId, true);
      alert("Appointment cancelled and slot is now available.");
      fetchAvailability(); // Refresh UI to see the slot turn blue/available
    } catch (error) {
      console.error(error);
      alert("Failed to cancel appointment.");
    }
  };

  const openBooking = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    setIsModalOpen(true);
  };

  const fmt = (time: string) => time.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Weekly Availability</h1>
        <p className="text-slate-500 text-sm font-medium italic">Select an available time slot or manage existing bookings</p>
      </div>

      {loading ? (
        <div className="text-center p-20 text-slate-400 font-bold animate-pulse uppercase tracking-widest">
          Synchronizing Calendar...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {weeklyData.map((day) => (
            <div key={day.date} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
              
              <div className="mb-6 border-b border-slate-50 pb-4">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{day.dayOfWeek}</span>
                <h3 className="text-lg font-bold text-slate-800">{day.date}</h3>
              </div>

              <div className="space-y-3">
                {day.slots.map((slot, index) => {
                  const isAvailable = slot.available;

                  // If NOT available, show the "Booked" row with a "Cancel" button
                  if (!isAvailable) {
                    return (
                      <div
                        key={index}
                        className="w-full p-4 rounded-2xl border border-transparent bg-slate-50 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-clock text-xs text-slate-300"></i>
                          <span className="text-sm font-black text-slate-400">
                            {fmt(slot.startTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Booked</span>
                           
                           {/* Fixed: Use appointmentId instead of id */}
                           {slot.appointmentId && (
                             <button 
                               onClick={() => handleCancelAppointment(slot.appointmentId!)}
                               className="ml-2 p-2 rounded-xl bg-white text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all group/btn"
                               title="Cancel Appointment"
                             >
                                <i className="fa-solid fa-unlock text-[12px]"></i>
                             </button>
                           )}
                        </div>
                      </div>
                    );
                  }

                  // If available, show the booking button (original logic)
                  return (
                    <button
                      key={index}
                      onClick={() => openBooking(day.date, slot.startTime)}
                      className="w-full p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-clock text-xs text-blue-500"></i>
                        <span className="text-sm font-black text-slate-700">
                          {fmt(slot.startTime)}
                        </span>
                      </div>
                      <i className="fa-solid fa-plus text-[10px] text-blue-300 group-hover:text-blue-600 group-hover:scale-125 transition-all"></i>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal (remains same) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Finalize Booking</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 mb-8">
              <div className="flex items-center gap-4 mb-2">
                <i className="fa-solid fa-calendar-day text-blue-600"></i>
                <span className="text-sm font-bold text-slate-700">{selectedSlot?.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-clock text-blue-600"></i>
                <span className="text-sm font-bold text-slate-700">{selectedSlot ? fmt(selectedSlot.time) : ''}</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter Patient ID</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                  <input 
                    type="number" 
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Cancel</button>
                <button type="submit" className="flex-[2] py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm active:scale-95">Confirm Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}