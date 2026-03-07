import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: 'fa-solid fa-table-columns', path: '/dashboard' },
  { name: 'Manage Patients', icon: 'fa-solid fa-users', path: '/dashboard/patients' },
  { name: 'Manage Doctors', icon: 'fa-solid fa-user-doctor', path: '/dashboard/doctors' },
   { name: 'Manage working Hours', icon: 'fa-solid fa-clock', path: '/dashboard/working-hours' }, 
  { name: 'Manage Appointments', icon: 'fa-solid fa-calendar-check', path: '/dashboard/appointments' },
  { name: 'Display Appointments', icon: 'fa-solid fa-calendar-check', path: '/dashboard/appointments-display' },
  { name: 'Medical Records', icon: 'fa-solid fa-notes-medical', path: '/dashboard/medical-records' },
  { name: 'Lab Results', icon: 'fa-solid fa-flask-vial', path: '/dashboard/lab' },
  { name: 'Prescriptions', icon: 'fa-solid fa-capsules', path: '/dashboard/prescriptions' },
  { name: 'Departments', icon: 'fa-solid fa-hospital', path: '/dashboard/departments' },
  { name: 'Medical Records', icon: 'fa-solid fa-notes-medical', path: '/dashboard/records' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-400 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="bg-blue-500 p-2 rounded-lg">
          <i className="fa-solid fa-heart-pulse text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight">MedDesk</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-4 px-2">Main</p>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' 
                : 'hover:bg-slate-800'
            }`}
          >
            <i className={`${item.icon} w-5`}></i>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-red-400 px-4 py-3 hover:bg-red-500/10 w-full rounded-xl transition-all">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}