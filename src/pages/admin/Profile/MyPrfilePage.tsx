import React, { useEffect, useState } from 'react';
import { updateUser } from '../../../services/adminServices/user.service';

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Load user from localStorage
    const storedData = localStorage.getItem('user');
    if (storedData) {
      try {
        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);
        setFormData(parsedUser); // Sync form with user data
      } catch (e) {
        console.error("Failed to parse local user data");
      }
    }
  }, []);

  // Check role logic
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleSave = async () => {
    if (!isSuperAdmin) return;
    
    try {
      setLoading(true);
      const userId = user.id || user._id;
      
      // 2. Call your service method
      const response = await updateUser(userId, formData);
      
      if (response) {
        // 3. Update local state and storage
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Error: Only the backend can authorize this specific change.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-20 text-center">Loading session...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 animate-in fade-in duration-500">
      {/* Styles for fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* Header Profile Card */}
      <div className="relative bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user-circle text-slate-300 text-7xl"></i>
              )}
            </div>
            {isSuperAdmin && (
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                <i className="fas fa-camera"></i>
              </button>
            )}
          </div>

          {/* Identity Section */}
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <i className="fas fa-shield-alt"></i> {user?.role}
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {user?.firstName} <span className="text-blue-600">{user?.lastName}</span>
            </h2>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <i className="fas fa-globe"></i> @{user?.username}
            </p>
          </div>

          {/* Role-Based Edit Button */}
          <div className="md:ml-auto">
            {isSuperAdmin ? (
              !isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                  >
                    <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setFormData(user); }}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-300 transition-all"
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              )
            ) : (
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                Read Only Access
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Editable Information */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> 
              Personal Information
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
              <InfoField 
                icon="fa-envelope" label="Email Address" 
                value={formData.email} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, email: val})}
              />
              <InfoField 
                icon="fa-phone" label="Phone Number" 
                value={formData.phone} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, phone: val})}
              />
              <InfoField 
                icon="fa-calendar-alt" label="Birth Date" 
                value={formData.birthDate} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, birthDate: val})}
              />
              <InfoField 
                icon="fa-venus-mars" label="Gender" 
                value={formData.gender} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, gender: val})}
              />
              <InfoField 
                icon="fa-id-card" label="CIN (National ID)" 
                value={formData.cin} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, cin: val})}
              />
              <InfoField 
                icon="fa-map-marker-alt" label="Address" 
                value={formData.address} isEditing={isEditing}
                onChange={(val: string) => setFormData({...formData, address: val})}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Account Stats */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
             <h3 className="text-lg font-bold mb-6">Account Status</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-white/10">
                   <span className="text-sm text-slate-400 font-medium">User ID</span>
                   <span className="font-mono font-bold">#{(user?.id || user?._id)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-white/10">
                   <span className="text-sm text-slate-400 font-medium">Verified</span>
                   <i className="fas fa-check-circle text-green-400"></i>
                </div>
             </div>
             <p className="text-[10px] text-slate-500 mt-6 text-center uppercase tracking-widest font-bold">
               {isSuperAdmin ? "Administrator Access" : "Standard Access"}
             </p>
          </div>

          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white text-center space-y-4">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                <i className="fas fa-user-shield"></i>
             </div>
             <h4 className="text-lg font-bold">Privacy Control</h4>
             <p className="text-blue-100 text-xs leading-relaxed">
               {isSuperAdmin 
                 ? "You have permission to modify this identity." 
                 : "Your profile is locked. Contact an admin to change data."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper Component for displaying/editing fields
 */
function InfoField({ icon, label, value, isEditing, onChange }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-slate-50 p-3 rounded-2xl text-blue-600 w-12 h-12 flex items-center justify-center flex-shrink-0">
        <i className={`fas ${icon} text-lg`}></i>
      </div>
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        {isEditing ? (
          <input 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-blue-500"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <p className={`text-sm font-bold ${!value ? 'text-slate-300 italic font-medium' : 'text-slate-700'}`}>
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );
}