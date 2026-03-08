import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getDisplayName = () => {
    if (!user) return "Guest";
    const prefix = user.role === 'DOCTOR' ? 'Dr. ' : '';
    return `${prefix}${user.lastName || user.firstName}`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
      <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search for patients or records..." 
            className="bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm w-72 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-blue-500 transition-colors">
            <i className="fa-solid fa-bell text-xl"></i>
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all flex items-center justify-center">
            <i className="fa-solid fa-plus"></i>
          </button>
          
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer group hover:bg-slate-50 py-1 px-2 rounded-2xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{user?.role?.replace('_', ' ') || 'Staff'}</p>
              <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">{getDisplayName()}</p>
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden bg-blue-50">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className={`fa-solid ${user?.role === 'DOCTOR' ? 'fa-user-doctor' : 'fa-user'} text-blue-600`}></i>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-300 group-hover:text-blue-500 transition-all"></i>
          </div>
        </div>
      </div>
    </header>
  );
}