export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      {/* <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-lg shadow-blue-200">
        <div className="relative z-10">
          <p className="text-blue-100 mb-2">Hi Dr.,</p>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-500/80 text-sm mb-6 max-w-xs">Have you reviewed today's patient reports?</p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm">View Reports</button>
            <button className="bg-blue-500/30 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Check Schedule</button>
          </div>
        </div>
        <i className="fa-solid fa-stethoscope absolute right-10 bottom-[-20px] text-[12rem] opacity-10 rotate-12"></i>
      </div> */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 transition-all duration-500 hover:shadow-blue-300">
  
  {/* --- UNIQUE ELEMENTS: Background Decorative Blobs --- */}
  <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
  <div className="absolute bottom-[-20%] left-[20%] w-32 h-32 bg-cyan-300/20 rounded-full blur-2xl"></div>

  <div className="relative z-10 flex flex-col h-full justify-center">
    
    {/* --- UNIQUE ELEMENT: Status Badge --- */}
    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full w-fit mb-6 animate-pulse">
      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
      <span className="text-[10px] font-bold uppercase tracking-widest">System Online</span>
    </div>

    {/* --- TYPOGRAPHY --- */}
    <div className="space-y-1">
      <p className="text-blue-100 text-lg font-medium tracking-wide opacity-90">
        Hi Dr. Mansouri,
      </p>
      <h2 className="text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
        Welcome <span className="text-cyan-100">Back!</span>
      </h2>
    </div>

    <p className="text-white/80 text-sm mt-4 mb-8 max-w-sm leading-relaxed font-light">
      Your schedule looks busy today. You have <span className="font-bold text-white">12 patients</span> waiting for review. Stay focused!
    </p>

    {/* --- INTERACTIVE BUTTONS --- */}
    <div className="flex flex-wrap gap-4">
      <button className="group/btn bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
        <i className="fa-solid fa-chart-pie"></i>
        View Reports
      </button>
      
      <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-white/20 hover:border-white/40 transition-all flex items-center gap-2">
        <i className="fa-solid fa-calendar-days text-cyan-200"></i>
        Check Schedule
      </button>
    </div>
  </div>

  {/* --- UNIQUE ELEMENT: Enhanced Background Icon --- */}
  <div className="absolute right-8 bottom-[-20px] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
    <i className="fa-solid fa-stethoscope text-[15rem] text-white opacity-10 drop-shadow-2xl"></i>
  </div>
  
  {/* Sublte extra icon for detail */}
  <i className="fa-solid fa-notes-medical absolute right-40 top-10 text-4xl text-white opacity-5"></i>
</div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: Stats & Metrics */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Patients', val: '1,284', trend: '+12%', color: 'blue', icon: 'fa-users' },
              { label: 'New Today', val: '47', trend: '+8%', color: 'green', icon: 'fa-user-plus' },
              { label: 'Appointments', val: '93', trend: '+5%', color: 'orange', icon: 'fa-calendar' },
              { label: 'Doctors Available', val: '28', trend: '', color: 'sky', icon: 'fa-stethoscope' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-5 rounded-2xl border-l-4 shadow-sm ${
                stat.color === 'blue' ? 'border-blue-500' : 
                stat.color === 'green' ? 'border-emerald-500' : 
                stat.color === 'orange' ? 'border-amber-500' : 'border-sky-400'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
                  <div className={`p-2 rounded-lg bg-slate-50 text-slate-400`}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{stat.val}</h3>
                {stat.trend && <p className="text-[10px] text-emerald-500 font-bold mt-1"><i className="fa-solid fa-arrow-trend-up mr-1"></i>{stat.trend}</p>}
              </div>
            ))}
          </div>

          {/* 3 Metric Cards (Heart, etc) */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Heart Rate', val: '80 beats/min', icon: 'fa-heart', color: 'text-rose-500', bg: 'bg-rose-50' },
              { label: 'Lung Capacity', val: '4.75 liters', icon: 'fa-wind', color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Blood Cells', val: '5 million/ml', icon: 'fa-droplet', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                <div className={`${m.bg} ${m.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
                  <i className={`fa-solid ${m.icon}`}></i>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">{m.label}</p>
                  <p className="text-sm font-bold text-slate-700">{m.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Placeholders */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm h-80">
               <h4 className="font-bold text-slate-800 mb-6">Patient Gender Distribution</h4>
               <div className="h-48 flex items-end justify-around gap-2">
                 {[40, 70, 45, 90, 65, 80].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} className="w-8 bg-blue-500/20 rounded-t-md relative group">
                      <div className="absolute inset-0 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom rounded-t-md"></div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm h-80 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold text-slate-800">Age Group Distribution</h4>
                 <button className="text-blue-500 text-xs font-bold">View Report</button>
               </div>
               <div className="flex-1 flex items-center justify-center">
                 <div className="w-40 h-40 rounded-full border-[16px] border-blue-500 border-r-emerald-500 border-b-slate-100"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar & Activity */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-800">Upcoming Check Up</h4>
              <div className="flex gap-2">
                <button className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 text-[10px]"><i className="fa-solid fa-chevron-left"></i></button>
                <button className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 text-[10px]"><i className="fa-solid fa-chevron-right"></i></button>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-800 mb-4">March 2026</p>
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <span key={d} className="text-[10px] font-bold text-slate-300 uppercase">{d}</span>)}
              {Array.from({length: 31}).map((_, i) => (
                <span key={i} className={`text-xs font-bold p-2 rounded-lg cursor-pointer ${i === 15 ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {i+1}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6">Your Last Activity</h4>
            <div className="space-y-6">
              {[
                { label: 'Dental Health', time: '08:00 AM', icon: 'fa-tooth', color: 'text-sky-500', bg: 'bg-sky-50' },
                { label: 'Brain Scan', time: '10:30 AM', icon: 'fa-brain', color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`${act.bg} ${act.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <i className={`fa-solid ${act.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{act.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}