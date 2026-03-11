// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// // Import Services
// import { getWorkingHours } from "../../services/adminServices/workingHours.service";
// import { 
//   getWeeklyAvailability, 
//   createAppointment 
// } from "../../services/adminServices/Appointment.service";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface WorkingHour {
//   id: number;
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
//   active: boolean;
// }

// interface Slot {
//   appointmentId?: number;
//   startTime: string;
//   endTime: string;
//   available: boolean;
// }

// interface DayAvailability {
//   dayOfWeek: string;
//   date: string;
//   slots: Slot[];
// }

// const DAY_FULL: Record<string, string> = {
//   MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday", 
//   FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmtTime = (time: string) => {
//   if (!time) return "--:--";
//   const [h, m] = time.split(":").map(Number);
//   const ampm = h >= 12 ? "PM" : "AM";
//   const hour = h % 12 || 12;
//   return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
// };

// // ─── Main Component ───────────────
// export default function WorkingTimes() {
//   const navigate = useNavigate(); // Initialize navigate
//   const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
//   const [availability, setAvailability] = useState<DayAvailability[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [bookingLoading, setBookingLoading] = useState(false);
  
//   // Modal State
//   const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
//   const [patientId, setPatientId] = useState<number | null>(null);

//   useEffect(() => {
//     // 1. Check Authentication and Redirect if not logged in
//     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//     const id = storedUser.id || storedUser._id;

//     if (!id) {
//       navigate('/login'); // Redirect to login
//       return;
//     }

//     setPatientId(Number(id));
//     loadAllData();
//   }, [navigate]);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [hoursRes, availRes] = await Promise.all([
//         getWorkingHours(),
//         getWeeklyAvailability()
//       ]);
//       setWorkingHours(hoursRes.data.data || hoursRes.data);
//       setAvailability(availRes.data || availRes);
//     } catch (error) {
//       console.error("Data sync failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmBooking = async () => {
//     if (!selectedSlot || !patientId) return;
    
//     setBookingLoading(true);
//     const body = {
//       scheduleTimeStart: selectedSlot.time,
//       appointmentStatus: "SCHEDULED",
//       patientId: patientId,
//       appointmentDate: selectedSlot.date
//     };

//     try {
//       await createAppointment(body);
//       // UPDATED MESSAGE: Instruction to check my appointments
//       alert("Success! Your appointment is confirmed. To manage or cancel this booking, please check 'My Appointments'.");
//       setSelectedSlot(null);
//       loadAllData(); 
//     } catch (error) {
//       alert("This slot is no longer available or check u are loggedIn.");
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <i className="fas fa-circle-notch fa-spin text-blue-600 text-4xl"></i>
//       <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Clinic Schedule...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-12">
      
//       {/* HEADER SECTION */}
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//         <div>
//           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinic Schedule</h1>
//           <p className="text-slate-500 font-medium mt-1 italic">
//             <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
//             Select your preferred time slot below
//           </p>
//         </div>
//         <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
//           <div className="text-right">
//             <p className="text-[10px] font-black text-slate-400 uppercase">Emergency</p>
//             <p className="text-sm font-bold text-slate-800">24/7 Support Available</p>
//           </div>
//           <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
//             <i className="fas fa-phone-alt"></i>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        
//         {/* LEFT COLUMN: OPERATIONAL HOURS */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
//             <i className="fas fa-clock absolute -right-4 -top-4 text-white/5 text-9xl"></i>
            
//             <h2 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
//               <i className="fas fa-door-open text-blue-400"></i> Operational Hours
//             </h2>

//             <div className="space-y-4 relative z-10">
//               {workingHours.sort((a,b) => a.id - b.id).map((hour) => (
//                 <div key={hour.id} className={`flex justify-between items-center p-4 rounded-2xl border ${hour.active ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
//                   <div>
//                     <p className="text-xs font-bold text-white/80">{DAY_FULL[hour.dayOfWeek]}</p>
//                     <p className="text-[10px] text-white/40 uppercase tracking-widest">{hour.active ? 'Open' : 'Closed'}</p>
//                   </div>
//                   {hour.active ? (
//                     <p className="text-sm font-mono font-bold text-blue-400">
//                       {fmtTime(hour.startTime)} - {fmtTime(hour.endTime)}
//                     </p>
//                   ) : (
//                     <i className="fas fa-times-circle text-white/20"></i>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: APPOINTMENT BOOKING */}
//         <div className="lg:col-span-8 space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//               <i className="fas fa-calendar-check text-blue-600"></i> Book an Appointment
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//             {availability.map((day) => (
//               <div key={day.date} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm transition-all hover:shadow-md">
                
//                 <div className="mb-6 border-b border-slate-50 pb-4 flex justify-between items-end">
//                   <div>
//                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{day.dayOfWeek}</span>
//                     <h3 className="text-lg font-bold text-slate-800">{day.date}</h3>
//                   </div>
//                   <i className="fas fa-calendar-day text-slate-100 text-2xl"></i>
//                 </div>

//                 <div className="space-y-3">
//                   {day.slots.map((slot, index) => (
//                     <button
//                       key={index}
//                       disabled={!slot.available}
//                       onClick={() => setSelectedSlot({ date: day.date, time: slot.startTime })}
//                       className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${
//                         slot.available 
//                         ? 'bg-white border-slate-100 hover:border-blue-500 hover:shadow-lg cursor-pointer' 
//                         : 'bg-slate-50 border-transparent opacity-60 cursor-not-allowed'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <i className={`fas fa-clock text-xs ${slot.available ? 'text-blue-500' : 'text-slate-300'}`}></i>
//                         <span className={`text-sm font-black ${slot.available ? 'text-slate-700' : 'text-slate-400'}`}>
//                           {slot.startTime.slice(0, 5)}
//                         </span>
//                       </div>
//                       {slot.available ? (
//                         <i className="fas fa-plus-circle text-blue-200 group-hover:text-blue-600 group-hover:scale-125 transition-all"></i>
//                       ) : (
//                         <i className="fas fa-lock text-slate-200 text-xs"></i>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* BOOKING CONFIRMATION MODAL */}
//       {selectedSlot && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
//           <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="text-center space-y-4 mb-8">
//               <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
//                 <i className="fas fa-check-double"></i>
//               </div>
//               <h2 className="text-2xl font-black text-slate-900">Confirm Booking?</h2>
//               <p className="text-slate-500 text-sm">You are about to book an appointment for the following time:</p>
//             </div>

//             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-xs font-bold text-slate-400 uppercase">Date</span>
//                 <span className="text-sm font-black text-slate-800">{selectedSlot.date}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-xs font-bold text-slate-400 uppercase">Time</span>
//                 <span className="text-sm font-black text-slate-800">{fmtTime(selectedSlot.time)}</span>
//               </div>
//               {/* HIDDEN PATIENT ID ROW PER REQUEST */}
//             </div>

//             <div className="flex gap-4">
//               <button 
//                 onClick={() => setSelectedSlot(null)}
//                 className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
//               >
//                 Go Back
//               </button>
//               <button 
//                 onClick={handleConfirmBooking}
//                 disabled={bookingLoading}
//                 className="flex-[2] py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
//               >
//                 {bookingLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-calendar-check"></i>}
//                 {bookingLoading ? "Processing..." : "Confirm Now"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkingHours } from "../../services/adminServices/workingHours.service";
import {
  getWeeklyAvailability,
  createAppointment,
} from "../../services/adminServices/Appointment.service";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkingHour {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

interface Slot {
  appointmentId?: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface DayAvailability {
  dayOfWeek: string;
  date: string;
  slots: Slot[];
}

const DAY_FULL: Record<string, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (time: string) => {
  if (!time) return "--:--";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function WorkingTimes() {
  const navigate = useNavigate();
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; } | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const id = storedUser.id || storedUser._id;
    if (id) setPatientId(Number(id));
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [hoursRes, availRes] = await Promise.all([
        getWorkingHours(),
        getWeeklyAvailability(),
      ]);
      setWorkingHours(hoursRes.data.data || hoursRes.data);
      setAvailability(availRes.data || availRes);
    } catch (error) {
      console.error("Data sync failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!patientId) {
      alert("Please login to complete your booking.");
      navigate("/login");
      return;
    }
    if (!selectedSlot) return;

    setBookingLoading(true);
    const body = {
      scheduleTimeStart: selectedSlot.time,
      appointmentStatus: "SCHEDULED",
      patientId: patientId,
      appointmentDate: selectedSlot.date,
    };

    try {
      await createAppointment(body);
      alert("Success! Your appointment is confirmed. View details in 'My Appointments'.");
      setSelectedSlot(null);
      loadAllData();
    } catch (error) {
      alert("This slot is no longer available.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 animate-pulse">
          <i className="fas fa-calendar-alt text-white text-xl"></i>
        </div>
        <p className="text-blue-500 font-bold text-xs uppercase tracking-widest">Synchronizing Schedule...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .slot-btn { transition: all 0.2s ease-in-out; }
        .slot-btn:hover:not(:disabled) { transform: scale(1.03); border-color: #2563EB; background: #EFF6FF; }
      `}</style>

      {/* ─── PUBLIC HEADER ─── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-8 py-5">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="fas fa-hospital-user text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Clinic Booking Portal</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select a time to visit us</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {patientId ? (
               <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div>
                  <span className="text-xs font-bold text-blue-700">Patient Active</span>
               </div>
             ) : (
               <button onClick={() => navigate('/login')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Login to Book</button>
             )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-screen-2xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-10">
          
          {/* LEFT: CLINIC HOURS */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                Clinic Hours
              </h3>
              <div className="space-y-3">
                {workingHours.sort((a,b) => a.id - b.id).map((hour) => (
                  <div key={hour.id} className={`flex justify-between items-center px-4 py-3 rounded-2xl border ${hour.active ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-transparent opacity-40'}`}>
                    <span className="text-xs font-bold text-slate-600">{DAY_SHORT[hour.dayOfWeek]}</span>
                    {hour.active ? (
                      <span className="text-[11px] font-bold text-blue-600">{fmtTime(hour.startTime)} - {fmtTime(hour.endTime)}</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium italic">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
               <i className="fas fa-info-circle text-2xl mb-4 opacity-50"></i>
               <h4 className="font-bold mb-2">Booking Help</h4>
               <p className="text-xs text-blue-100 leading-relaxed">Select any blue time slot to begin your booking process. Logged-in users can manage appointments in their dashboard.</p>
            </div>
          </div>

          {/* RIGHT: TWO-COLUMN SLOTS GRID */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <i className="fas fa-calendar-check text-blue-600"></i>
                 Weekly Available Slots
               </h2>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Available
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span> Booked
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {availability.map((day) => (
                <div key={day.date} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm transition-all hover:shadow-md">
                  {/* Day Header */}
                  <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{day.dayOfWeek}</p>
                      <p className="text-base font-black text-slate-800">{day.date}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[9px] font-bold text-slate-400">
                       {day.slots.filter(s => s.available).length} Open
                    </div>
                  </div>
                  
                  {/* TWO COLUMN GRID FOR SLOTS */}
                  <div className="p-6 grid grid-cols-2 gap-3">
                    {day.slots.map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot({ date: day.date, time: slot.startTime })}
                        className={`slot-btn px-3 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                          slot.available 
                            ? "bg-white border-blue-50 shadow-sm hover:border-blue-500 cursor-pointer" 
                            : "bg-slate-50 border-transparent opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <span className={`text-sm font-black ${slot.available ? "text-slate-800" : "text-slate-400"}`}>
                          {slot.startTime.slice(0, 5)}
                        </span>
                        {slot.available ? (
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">Available</span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Booked</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── CONFIRMATION MODAL ─── */}
      {selectedSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 px-8 py-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <i className="fas fa-check-circle text-2xl"></i>
              </div>
              <h2 className="text-xl font-black">Confirm Booking</h2>
              <p className="text-blue-100 text-xs mt-1">Ready to secure your time slot?</p>
            </div>

            <div className="p-8 space-y-4">
               <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                  <span className="text-sm font-black text-slate-800">{selectedSlot.date}</span>
               </div>
               <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                  <span className="text-sm font-black text-slate-800">{fmtTime(selectedSlot.time)}</span>
               </div>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button onClick={() => setSelectedSlot(null)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Go Back</button>
              <button 
                onClick={handleConfirmBooking} 
                disabled={bookingLoading}
                className="flex-[2] py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                {bookingLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-calendar-check"></i>}
                {bookingLoading ? "Booking..." : "Confirm Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}