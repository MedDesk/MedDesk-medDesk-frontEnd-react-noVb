import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Defined all available roles in the system
const ALL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT', 'STAFF'];

const navItems = [
  { name: 'Dashboard', icon: 'fa-solid fa-table-columns', path: '/dashboard', roles: ALL_ROLES },
  { name: 'Manage users', icon: 'fa-solid fa-user-shield', path: '/dashboard/users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { name: 'Manage Patients', icon: 'fa-solid fa-users', path: '/dashboard/patients', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  },
  { name: 'Manage Doctors', icon: 'fa-solid fa-user-doctor', path: '/dashboard/doctors', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  },
  { name: 'Manage working Hours', icon: 'fa-solid fa-clock', path: '/dashboard/working-hours', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  }, 
  { name: 'Manage Appointments', icon: 'fa-solid fa-calendar-check', path: '/dashboard/appointments', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  },
  { name: 'Display Appointments', icon: 'fa-solid fa-calendar-day', path: '/dashboard/appointments-display', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  },
  { name: 'Medical Records', icon: 'fa-solid fa-notes-medical', path: '/dashboard/medical-records', roles: ['ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']  },
  


  // patient-specific
  { name: 'My Appointments', icon: 'fa-solid fa-calendar-check', path: '/dashboard/myAppointments', roles: ['PATIENT'] },
  { name: 'My Medical Records', icon: 'fa-solid fa-notes-medical', path: '/dashboard/my-medical-records', roles: ['PATIENT'] },

  { name: 'Lab Results', icon: 'fa-solid fa-flask-vial', path: '/dashboard/lab', roles: ALL_ROLES },
  { name: 'Prescriptions', icon: 'fa-solid fa-capsules', path: '/dashboard/prescriptions', roles: ALL_ROLES },
  { name: 'Departments', icon: 'fa-solid fa-hospital', path: '/dashboard/departments', roles: ALL_ROLES },
];

export default function Sidebar() {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  }

  // Filter logic remains, but since ALL_ROLES is everywhere, 
  // every authenticated user will see every link.
  const filteredNavItems = navItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-400 h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-20">
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <i className="fa-solid fa-heart-pulse text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight">MedDesk</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="py-4">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4 px-3">
                {userRole?.replace('_', ' ')} Portal
            </p>
            
            {filteredNavItems.map((item) => (
            <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
                <i className={`${item.icon} w-5 text-center ${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}></i>
                <span className="text-sm font-semibold">{item.name}</span>
            </Link>
            ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button 
          className="flex items-center gap-3 text-rose-400 px-4 py-3.5 hover:bg-rose-500/10 w-full rounded-xl transition-all font-bold text-sm"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}