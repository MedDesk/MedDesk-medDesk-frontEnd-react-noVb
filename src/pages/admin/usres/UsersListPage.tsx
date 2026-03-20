import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../../../services/adminServices/user.service';
import { Link } from 'react-router-dom';

// Helper function to get colors based on Role
function getRoleBadgeStyles(role: string) {
  const styles: Record<string, string> = {
    'SUPER_ADMIN': 'bg-purple-100 text-purple-700 border-purple-200',
    'ADMIN': 'bg-purple-100 text-purple-700 border-purple-200',
    'DOCTOR': 'bg-blue-100 text-blue-700 border-blue-200',
    'RECEPTIONIST': 'bg-amber-100 text-amber-700 border-amber-200',
    'PATIENT': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'STAFF': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return styles[role] || 'bg-slate-100 text-slate-600 border-slate-200';
}

export default function UsersListPage() {
  //  STATE MANAGEMENT
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New User Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'OTHER',
    gender: 'MALE'
  });

  // 2. FETCH DATA FROM API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(0, 100);
      if (response.success) {
        setUsers(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. ACTIONS (Delete & Create)
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const response = await deleteUser(id);
        if (response && response.success === false) {
          handleDeletionError(response.message);
          return;
        }
        alert("User deleted successfully");
        fetchUsers();
      } catch (error: any) {
        const serverMessage = error.response?.data?.message || error.message || "";
        handleDeletionError(serverMessage);
      }
    }
  };

  const handleDeletionError = (message: string) => {
    if (message.toLowerCase().includes("foreign key constraint") || message.toLowerCase().includes("referenced")) {
      alert(
        "🚫 CANNOT DELETE USER\n\n" +
        "This user is currently linked to other records.\n\n" +
        "To delete this user, you must first delete or re-assign their related files."
      );
    } else {
      alert("System Error: " + message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      if(response.success) {
        setIsModalOpen(false);
        fetchUsers();
        setFormData({ firstName: '', lastName: '', username: '', email: '', password: '', role: 'OTHER', gender: 'MALE' });
      } else {
        alert(response.message);
      }
    } catch (error: any) {
      alert("Error creating user: " + (error.response?.data?.message || "Check your input"));
    }
  };

  // 4. FILTER LOGIC
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeFilter === 'All' || u.role === activeFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">System Users</h1>
          <p className="text-slate-500 text-sm">Manage access for doctors, staff, and patients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <i className="fa-solid fa-plus mr-2"></i> Add New User
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT', 'STAFF'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveFilter(role)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeFilter === role ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest">Loading system data...</td></tr>
                ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">No users found matching your criteria.</td></tr>
                ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100 shadow-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                        <div className="text-sm font-black text-slate-800">{user.firstName} {user.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-bold">@{user.username}</div>
                        </div>
                    </div>
                    </td>
                    <td className="p-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getRoleBadgeStyles(user.role)}`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600">
                    {user.email}
                    <div className="text-[10px] text-slate-400 font-bold">{user.phone || 'No phone provided'}</div>
                    </td>
                    
                    {/* UPDATED ACTIONS LOGIC */}
                    <td className="p-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                        {/* 1. If role is SUPER_ADMIN or ADMIN -> Badge Only */}
                        {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? (
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 italic">
                                <i className="fa-solid fa-lock mr-1"></i> Protected
                            </span>
                        ) : user.role === 'PATIENT' ? (
                            // 2. If role is PATIENT -> Link Only (Icons Hidden)
                            <Link to={`/dashboard/patients/${user.id}`}>
                                <button 
                                    className="px-3 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                                    title="Check Patient Sections"
                                >
                                    <i className="fa-solid fa-folder-open"></i>
                                    <span className="hidden lg:inline">Patient Sections</span>
                                </button>
                            </Link>
                        ) : (
                            // 3. For DOCTOR, STAFF, etc. -> Show Edit/Delete Icons
                            <>
                                <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center">
                                    <i className="fa-solid fa-pen text-xs"></i>
                                </button>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                    title="Delete User"
                                >
                                    <i className="fa-solid fa-trash text-xs"></i>
                                </button>
                            </>
                        )}
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">New System User</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">First Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-bold focus:border-blue-500" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Last Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-bold focus:border-blue-500" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Username</label>
                <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-bold focus:border-blue-500" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-bold focus:border-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Password</label>
                <input required type="password" placeholder="Min. 8 characters" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-bold focus:border-blue-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Role Type</label>
                  <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-xs font-bold focus:border-blue-500 appearance-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    {['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT', 'STAFF', 'OTHER'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Gender</label>
                  <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none text-xs font-bold focus:border-blue-500 appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Save User Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}