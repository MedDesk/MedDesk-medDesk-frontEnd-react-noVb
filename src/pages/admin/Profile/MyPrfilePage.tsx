import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Camera,
  Edit3,
  Globe
} from 'lucide-react';
import { getUserById } from '../../../services/adminServices/user.service';

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Get current user ID from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.id) {
          // 2. Fetch fresh data from API
          const response = await getUserById(storedUser.id);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
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
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-slate-300" />
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
              <Camera size={18} />
            </button>
          </div>

          {/* Identity Section */}
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} /> {user?.role || 'Patient'}
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {user?.firstName} <span className="text-blue-600">{user?.lastName}</span>
            </h2>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Globe size={16} /> @{user?.username}
            </p>
          </div>

          <div className="md:ml-auto">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Contact & Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> 
              Personal Information
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
              <InfoBox icon={<Mail />} label="Email Address" value={user?.email} />
              <InfoBox icon={<Phone />} label="Phone Number" value={user?.phone || "Not provided"} />
              <InfoBox icon={<Calendar />} label="Birth Date" value={user?.birthDate || "Not provided"} />
              <InfoBox icon={<User />} label="Gender" value={user?.gender || "Not provided"} />
              <InfoBox icon={<CreditCard />} label="CIN (National ID)" value={user?.cin || "Not provided"} />
              <InfoBox icon={<MapPin />} label="Living Address" value={user?.address || "Not provided"} />
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
                   <span className="font-mono font-bold">#{user?.id?.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-white/10">
                   <span className="text-sm text-slate-400 font-medium">Verified</span>
                   <CheckCircle className="text-green-400" size={18} />
                </div>
             </div>
             <p className="text-[10px] text-slate-500 mt-6 text-center uppercase tracking-widest font-bold">
               Joined MedDesk Since 2024
             </p>
          </div>

          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white text-center space-y-4">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck size={32} />
             </div>
             <h4 className="text-lg font-bold">Privacy Control</h4>
             <p className="text-blue-100 text-xs leading-relaxed">Your data is stored securely using HIPAA-compliant encryption standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-slate-50 p-3 rounded-2xl text-blue-600">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className={`text-sm font-bold ${value === 'Not provided' ? 'text-slate-300 italic font-medium' : 'text-slate-700'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function CheckCircle({ className, size }: { className: string, size: number }) {
  return (
    <div className={`rounded-full bg-green-400/20 p-1 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}