import React, { useState, useEffect } from 'react';
import { getDashboardStatistics } from '../../services/DashbaordStatistics';
import { getAppointments } from '../../services/AppointmentService';

export default function DashboardPage() {
  // --- 1. STATES ---
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both statistics and the list of appointments
        const [statsData, apptData] = await Promise.all([
          getDashboardStatistics(),
          getAppointments(0, 100) // Get first 100 appointments to populate calendar
        ]);
        setStats(statsData);
        setAppointments(apptData.content || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- 3. CALENDAR LOGIC (Simple for beginners) ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // This helper finds how many appointments are on a specific day of the current month
  const getApptCountForDay = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.appointmentDate === dateString).length;
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">LOADING MEDICAL DASHBOARD...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 transition-all duration-500 hover:shadow-blue-300">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full w-fit mb-6 animate-pulse">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">System Online</span>
          </div>
          <div className="space-y-1">
            <p className="text-blue-100 text-lg font-medium tracking-wide opacity-90">Hi Dr. Mansouri,</p>
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              Welcome <span className="text-cyan-100">Back!</span>
            </h2>
          </div>
          <p className="text-white/80 text-sm mt-4 mb-8 max-w-sm leading-relaxed font-light">
            Your schedule looks busy today. You have <span className="font-bold text-white">{stats?.appointmentsToday} patients</span> waiting for review. Stay focused!
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="group/btn bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <i className="fa-solid fa-chart-pie"></i> View Reports
            </button>
            <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-white/20 hover:border-white/40 transition-all flex items-center gap-2">
              <i className="fa-solid fa-calendar-days text-cyan-200"></i> Check Schedule
            </button>
          </div>
        </div>
        <div className="absolute right-8 bottom-[-20px] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
          <i className="fa-solid fa-stethoscope text-[15rem] text-white opacity-10 drop-shadow-2xl"></i>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: Stats & Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Top 4 Stat Cards - FETCHED FROM API */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Patients" val={stats?.totalPatients} trend="+12%" color="blue" icon="fa-users" />
            <StatCard label="Total Doctors" val={stats?.totalDoctors} trend="+2%" color="green" icon="fa-user-doctor" />
            <StatCard label="Appointments" val={stats?.appointmentsToday} trend="Today" color="orange" icon="fa-calendar-check" />
            <StatCard label="Med Records" val={stats?.totalMedicalRecords} trend="" color="sky" icon="fa-file-medical" />
          </div>

          {/* 3 Metric Cards (Heart, etc) - HYBRID DATA */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Heart Rate" val="80 bpm" icon="fa-heart" color="text-rose-500" bg="bg-rose-50" />
            <MetricCard label="Confirmed" val={stats?.appointmentStatusBreakdown?.CONFIRMED} icon="fa-check-circle" color="text-blue-500" bg="bg-blue-50" />
            <MetricCard label="Scheduled" val={stats?.appointmentStatusBreakdown?.SCHEDULED} icon="fa-clock" color="text-emerald-500" bg="bg-emerald-50" />
          </div>

          {/* Chart Placeholders - ANIMATED BY DATA */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm h-80">
               <h4 className="font-bold text-slate-800 mb-6">Patient Gender Distribution</h4>
               <div className="h-48 flex items-end justify-around gap-10 px-10">
                  {/* Male Bar */}
                  <div className="flex flex-col items-center flex-1">
                    <div style={{ height: `${stats?.patientGenderBreakdown?.MALE}%` }} className="w-full bg-blue-500 rounded-t-xl transition-all duration-1000"></div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2">MALE ({stats?.patientGenderBreakdown?.MALE}%)</span>
                  </div>
                  {/* Female Bar */}
                  <div className="flex flex-col items-center flex-1">
                    <div style={{ height: `${stats?.patientGenderBreakdown?.FEMALE}%` }} className="w-full bg-rose-400 rounded-t-xl transition-all duration-1000"></div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2">FEMALE ({stats?.patientGenderBreakdown?.FEMALE}%)</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm h-80 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold text-slate-800">Clinic Load Overview</h4>
                 <button className="text-blue-500 text-xs font-bold">View Report</button>
               </div>
               <div className="flex-1 flex items-center justify-center">
                 {/* Creative representation of total vs completed */}
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[16px] border-slate-50"></div>
                    <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-t-transparent rotate-45"></div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-slate-800">{stats?.totalPatients}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Total Capacity</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar & Activity */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* CREATIVE CALENDAR - Highlights days with appointments */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-800">Appointment Tracker</h4>
              <i className="fa-solid fa-calendar-check text-blue-500"></i>
            </div>
            <p className="text-sm font-bold text-slate-800 mb-4 capitalize">
                {today.toLocaleString('default', { month: 'long' })} {currentYear}
            </p>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>)}
              {Array.from({length: daysInMonth}).map((_, i) => {
                const day = i + 1;
                const count = getApptCountForDay(day);
                const isToday = day === today.getDate();

                return (
                  <div key={i} className="relative group p-1">
                    <div className={`text-xs font-bold w-9 h-9 flex items-center justify-center rounded-xl transition-all
                      ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-blue-50'}
                      ${count > 0 && !isToday ? 'border-2 border-blue-100' : ''}
                    `}>
                      {day}
                    </div>
                    {/* Creative "Dot" or Badge for appointments */}
                    {count > 0 && (
                        <span className={`absolute top-0 right-0 w-4 h-4 text-[8px] flex items-center justify-center rounded-full font-bold shadow-sm
                            ${isToday ? 'bg-amber-400 text-amber-900' : 'bg-blue-500 text-white'}
                        `}>
                            {count}
                        </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LAST ACTIVITY - FETCHED FROM UPCOMING APPOINTMENTS */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6">Latest Appointments</h4>
            <div className="space-y-6">
              {stats?.upcomingAppointments?.map((appt: any, i: number) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                    ${appt.status === 'CANCELED' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}
                  `}>
                    <i className={`fa-solid ${appt.status === 'CANCELED' ? 'fa-user-xmark' : 'fa-user-clock'}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{appt.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{appt.time} • {appt.status}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-200"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components to keep code clean ---

function StatCard({ label, val, trend, color, icon }: any) {
    const colorClasses: any = {
        blue: 'border-blue-500',
        green: 'border-emerald-500',
        orange: 'border-amber-500',
        sky: 'border-sky-400'
    };
    return (
        <div className={`bg-white p-5 rounded-2xl border-l-4 shadow-sm ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-400"><i className={`fa-solid ${icon}`}></i></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{val || 0}</h3>
            {trend && <p className="text-[10px] text-emerald-500 font-bold mt-1"><i className="fa-solid fa-arrow-trend-up mr-1"></i>{trend}</p>}
        </div>
    );
}

function MetricCard({ label, val, icon, color, bg }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className={`${bg} ${color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-700">{val || 0}</p>
            </div>
        </div>
    );
}