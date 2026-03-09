import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, updateDoctor } from '../../../services/doctorService';
import { type CreateDoctorRequest } from '../../../types/Doctor';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
  // --- TOGGLE STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getDoctorById(Number(id));
      if (response.success) {
        setDoctor(response.data);
        setFormData(response.data); // Initialize form with current data
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateDoctor(Number(id), formData);
      if (response.success) {
        setDoctor(response.data);
        setIsEditing(false); // Switch back to view mode
      }
    } catch (error) {
      alert("Failed to update doctor information");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest">Loading Doctor Profile...</div>;
  if (!doctor) return <div className="p-20 text-center text-rose-500 font-bold">Doctor not found.</div>;

  const fullName = `${doctor.firstName} ${doctor.lastName}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-slate-900">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm mb-8">
        <div className="w-[90%] mx-auto flex items-center justify-between py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Staff
          </button>
          <div className="flex gap-3">
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
             >
                <i className={`fa-solid ${isEditing ? 'fa-xmark' : 'fa-user-nurse'} mr-2`}></i> 
                {isEditing ? 'Cancel Edit' : 'Edit Doctor'}
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                <i className="fa-solid fa-print mr-2"></i> Export PDF
             </button>
          </div>
        </div>
      </div>

      <main className="w-[90%] mx-auto">
        
        {!isEditing ? (
          /* --- DISPLAY MODE --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-blue-600"></div>
                  <div className="relative pt-4 text-center flex flex-col items-center">
                      {doctor.profileImage ? (
                          <img src={doctor.profileImage} className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-md bg-white" alt={fullName} />
                      ) : (
                          <div className="w-32 h-32 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-black border-4 border-white shadow-md">
                              {doctor.firstName.charAt(0)}
                          </div>
                      )}
                      <h2 className="text-2xl font-black text-slate-800 mt-5 leading-tight">Dr. {fullName}</h2>
                      <p className="text-blue-600 text-xs font-black uppercase tracking-widest mt-1">{doctor.specialist.replace('_', ' ')}</p>
                      
                      <div className="mt-6 pt-6 border-t border-slate-50 w-full grid grid-cols-2 gap-4">
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">License</p>
                              <p className="text-xs font-bold text-slate-700 mt-1">{doctor.license_number}</p>
                          </div>
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                              <span className="inline-block mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Active</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Identifiers Card */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Staff Identification</h3>
                  <div className="space-y-5">
                      <InfoRow icon="fa-id-card" label="CIN Number" value={doctor.cin || 'N/A'} />
                      <InfoRow icon="fa-at" label="Username" value={doctor.username} />
                      <InfoRow icon="fa-phone-flip" label="Emergency Contact" value={doctor.emergency_contact || 'N/A'} />
                  </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Content */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
                      <i className="fa-solid fa-stethoscope text-blue-600 text-xl"></i>
                      <h3 className="text-xl font-black text-slate-800">Professional Profile</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Communication</h4>
                          <MetaItem label="Professional Email" value={doctor.email} />
                          <MetaItem label="Phone Number" value={doctor.phone} />
                          <MetaItem label="Clinic Address" value={doctor.address} />
                      </div>

                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Administrative</h4>
                          <MetaItem label="Birth Date" value={doctor.birthDate} />
                          <MetaItem label="Gender" value={doctor.gender} />
                          <MetaItem label="Specialty Field" value={doctor.specialist.replace('_', ' ')} isBadge />
                      </div>
                  </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- EDIT FORM MODE --- */
          <div className="max-w-5xl mx-auto animate-in zoom-in duration-300">
            <form onSubmit={handleUpdate} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                    <i className="fa-solid fa-user-doctor text-blue-600 text-xl"></i>
                    <h3 className="text-xl font-black text-slate-800">Edit Staff Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Section */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Basic Credentials</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </div>
                        <FormInput label="Username" name="username" value={formData.username} onChange={handleInputChange} required />
                        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        <FormInput label="Password" name="password" type="password" placeholder="••••••••" onChange={handleInputChange} />
                    </div>

                    {/* Professional Section */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Clinical Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </FormSelect>
                            <FormInput label="Birth Date" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Specialist Field" name="specialist" value={formData.specialist} onChange={handleInputChange}>
                                <option value="GENERAL_PRACTICE">General Practice</option>
                                <option value="CARDIOLOGY">Cardiology</option>
                                <option value="DERMATOLOGY">Dermatology</option>
                                <option value="NEUROLOGY">Neurology</option>
                                <option value="PEDIATRICS">Pediatrics</option>
                            </FormSelect>
                            <FormInput label="License Number" name="license_number" value={formData.license_number} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="CIN" name="cin" value={formData.cin} onChange={handleInputChange} />
                            <FormInput label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                         <FormInput label="Full Address" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-50 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
                    >
                        Discard
                    </button>
                    <button 
                        type="submit"
                        className="px-10 py-3.5 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm"
                    >
                        Save Doctor Profile
                    </button>
                </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Helpers (Simple components for reuse) ───────────────────────────────────

function FormInput({ label, ...props }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <input 
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm"
                {...props}
            />
        </div>
    )
}

function FormSelect({ label, children, ...props }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <select 
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm"
                {...props}
            >
                {children}
            </select>
        </div>
    )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-sm">
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function MetaItem({ label, value, isBadge }: { label: string; value: string; isBadge?: boolean }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
            {isBadge ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">
                    {value}
                </span>
            ) : (
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{value}</p>
            )}
        </div>
    );
}