import React, { useState, useEffect } from 'react';
import { getDashboardStatistics } from '../../services/DashbaordStatistics';
import { getAppointments } from '../../services/AppointmentService';
import { getCurrentUser } from '../../services/Auth.service';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const [statsData, apptData] = await Promise.all([
          getDashboardStatistics(),
          getAppointments(0, 100)
        ]);
        setStats(statsData);
        setAppointments(apptData.content || []);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    return isAdmin 
      ? `Dr. ${currentUser.firstName} ${currentUser.lastName}` 
      : `${currentUser.firstName} ${currentUser.lastName}`;
  };

  const getRoleLabel = () => {
    if (currentUser?.role === 'SUPER_ADMIN') return 'Super Administrator';
    if (currentUser?.role === 'ADMIN') return 'Administrator';
    return currentUser?.role?.replace('_', ' ') || 'Staff';
  };

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const getApptCountForDay = (day: number) => {
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.appointmentDate === dateString).length;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-slate-300 font-bold tracking-widest animate-pulse">
          INITIALIZING CLINIC SYSTEMS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`relative group overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl transition-all duration-500 
        ${isAdmin ? 'bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 shadow-blue-200' : 'bg-gradient-to-br from-violet-600 via-purple-500 to-teal-400 shadow-purple-200'}`}>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Medical Network Online</span>
            </div>

            <div className="space-y-2">
              <p className="text-blue-50 text-xl font-medium opacity-90">Welcome back,</p>
              <h2 className="text-6xl font-black tracking-tight drop-shadow-md">
                {getDisplayName()}
              </h2>
            </div>

            <p className="text-white/80 text-lg max-w-md leading-relaxed font-medium">
              {isAdmin ? (
                <>Your clinic is active. You have <span className="text-white font-bold underline decoration-white/40 underline-offset-8">{stats?.appointmentsToday ?? 0} patients</span> scheduled for today.</>
              ) : (
                <>Ready for your shift? There are <span className="text-white font-bold underline decoration-white/40 underline-offset-8">{stats?.appointmentsToday ?? 0} appointments</span> currently in the queue.</>
              )}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95">
                View Analytics
              </button>
              <button className="bg-black/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                My Schedule
              </button>
            </div>
          </div>

          {/* Secure Role Icon - Positioned Right and Big */}
          <div className="relative">
            <div className="w-48 h-48 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center rotate-6 group-hover:rotate-0 transition-all duration-700 shadow-2xl">
              <i className={`fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-id-badge'} text-8xl text-white/40`}></i>
            </div>
            <div className="absolute -bottom-4 -right-2 bg-amber-400 text-amber-950 px-4 py-2 rounded-xl shadow-xl font-black text-[10px] tracking-tighter uppercase rotate-[-12deg] animate-bounce">
              {getRoleLabel()}
            </div>
          </div>
        </div>

        {/* Large Background Stethoscope decoration */}
        <div className="absolute right-[-50px] bottom-[-60px] opacity-10 pointer-events-none">
          <i className={`fa-solid ${isAdmin ? 'fa-stethoscope' : 'fa-user-tie'} text-[22rem] text-white`}></i>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Patients" val={stats?.totalPatients} trend="+12%" color="blue" icon="fa-users" />
            <StatCard label="Total Doctors" val={stats?.totalDoctors} trend="+2%" color="green" icon="fa-user-doctor" />
            <StatCard label="Appointments" val={stats?.appointmentsToday} trend="Today" color="orange" icon="fa-calendar-check" />
            <StatCard label="Med Records" val={stats?.totalMedicalRecords} trend="" color="sky" icon="fa-file-medical" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="System Vital" val="80 bpm" icon="fa-heartpulse" color="text-rose-500" bg="bg-rose-50" />
            <MetricCard label="Confirmed" val={stats?.appointmentStatusBreakdown?.CONFIRMED} icon="fa-check-circle" color="text-blue-500" bg="bg-blue-50" />
            <MetricCard label="Scheduled" val={stats?.appointmentStatusBreakdown?.SCHEDULED} icon="fa-clock" color="text-emerald-500" bg="bg-emerald-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
               <h4 className="font-bold text-slate-800 mb-8 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> 
                 Patient Demographics
               </h4>
               <div className="h-48 flex items-end justify-around gap-10 px-6">
                  <div className="flex flex-col items-center flex-1 max-w-[60px]">
                    <div style={{ height: `${stats?.patientGenderBreakdown?.MALE || 0}%` }} className="w-full bg-blue-500 rounded-t-xl transition-all duration-1000"></div>
                    <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase">Male</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 max-w-[60px]">
                    <div style={{ height: `${stats?.patientGenderBreakdown?.FEMALE || 0}%` }} className="w-full bg-rose-400 rounded-t-xl transition-all duration-1000"></div>
                    <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase">Female</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-8">
                 <h4 className="font-bold text-slate-800">Clinic Capacity</h4>
                 <div className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Active Status</div>
               </div>
               <div className="flex-1 flex items-center justify-center">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[18px] border-slate-50"></div>
                    <div className="absolute inset-0 rounded-full border-[18px] border-blue-600 border-t-transparent rotate-45"></div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-800">{stats?.totalPatients || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">In-Care</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-800">Schedule Tracker</h4>
              <i className="fa-solid fa-calendar-check text-blue-500"></i>
            </div>
            <p className="text-lg font-black text-slate-800 mb-6">
                {today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}
            </p>
            <div className="grid grid-cols-7 gap-y-3 text-center">
              {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</span>)}
              {Array.from({length: daysInMonth}).map((_, i) => {
                const day = i + 1;
                const count = getApptCountForDay(day);
                const isToday = day === today.getDate();

                return (
                  <div key={i} className="relative group p-1 flex justify-center">
                    <div className={`text-xs font-bold w-10 h-10 flex items-center justify-center rounded-2xl transition-all
                      ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}
                      ${count > 0 && !isToday ? 'bg-blue-50 text-blue-600' : ''}
                    `}>
                      {day}
                    </div>
                    {count > 0 && (
                        <span className={`absolute -top-1 -right-1 w-5 h-5 text-[9px] flex items-center justify-center rounded-lg font-bold shadow-md
                            ${isToday ? 'bg-amber-400 text-amber-950' : 'bg-blue-500 text-white'}
                        `}>
                            {count}
                        </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm">
            <h4 className="font-bold text-slate-800 mb-8">Recent Queue</h4>
            <div className="space-y-6">
              {stats?.upcomingAppointments?.slice(0, 4).map((appt: any, i: number) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110
                    ${appt.status === 'CANCELED' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'}
                  `}>
                    <i className={`fa-solid ${appt.status === 'CANCELED' ? 'fa-user-xmark' : 'fa-user-clock'}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{appt.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{appt.time} • {appt.status}</p>
                  </div>
                  <i className="fa-solid fa-angle-right text-slate-200 group-hover:translate-x-1 transition-all"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, trend, color, icon }: any) {
    const colorClasses: any = {
        blue: 'border-blue-600 shadow-blue-50',
        green: 'border-emerald-500 shadow-emerald-50',
        orange: 'border-amber-500 shadow-amber-50',
        sky: 'border-cyan-400 shadow-cyan-50'
    };
    return (
        <div className={`bg-white p-6 rounded-[2rem] border-l-[6px] shadow-sm hover:shadow-lg transition-all ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300"><i className={`fa-solid ${icon}`}></i></div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{val || 0}</h3>
            {trend && <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1"><i className="fa-solid fa-arrow-trend-up"></i>{trend}</p>}
        </div>
    );
}

function MetricCard({ label, val, icon, color, bg }: any) {
    return (
        <div className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center gap-5 hover:bg-slate-50 transition-colors group">
            <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
                <p className="text-base font-black text-slate-800">{val || 0}</p>
            </div>
        </div>
    );
}