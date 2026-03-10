import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Added updatePatient to your service imports
import { getPatientById, updatePatient } from '../../../services/adminServices/patient.service';
import type { PatientDtoResponse } from '../../../types/Patient';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDtoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // --- NEW STATE FOR EDITING ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getPatientById(Number(id));
        if (response.success) {
          setPatient(response.data);
          setFormData(response.data); // Initialize form with current data
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  // --- HANDLE UPDATE API CALL ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updatePatient(Number(id), formData);
      if (response.success) {
        setPatient(response.data);
        setIsEditing(false); // Switch back to view mode
      }
    } catch (error) {
      alert("Failed to update patient information");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest">Loading Patient Profile...</div>;
  if (!patient) return <div className="p-20 text-center text-rose-500 font-bold">Patient not found.</div>;

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm mb-8">
        <div className="w-[90%] mx-auto flex items-center justify-between py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Patients
          </button>
          <div className="flex gap-3">
             {/* Toggle Button */}
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
             >
                <i className={`fa-solid ${isEditing ? 'fa-xmark' : 'fa-pen-to-square'} mr-2`}></i> 
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                <i className="fa-solid fa-print mr-2"></i> Print File
             </button>
          </div>
        </div>
      </div>

      <main className="w-[90%] mx-auto">
        
        {!isEditing ? (
          /* --- ORIGINAL DISPLAY FORM (Don't touch logic) --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-blue-600"></div>
                  <div className="relative pt-4">
                      {patient.profileImage ? (
                          <img src={patient.profileImage} className="w-32 h-32 rounded-[2rem] mx-auto object-cover border-4 border-white shadow-md bg-white" alt={fullName} />
                      ) : (
                          <div className="w-32 h-32 rounded-[2rem] mx-auto bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-black border-4 border-white shadow-md">
                              {patient.firstName.charAt(0)}
                          </div>
                      )}
                      <h2 className="text-2xl font-black text-slate-800 mt-5 leading-tight">{fullName}</h2>
                      <p className="text-blue-600 text-xs font-black uppercase tracking-widest mt-1">ID: #P-{patient.id}</p>
                      
                      <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                              <span className="inline-block mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase">Active</span>
                          </div>
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Registered</p>
                              <p className="text-xs font-bold text-slate-700 mt-1">{patient.registerDate}</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Patient Identifiers</h3>
                  <div className="space-y-5">
                      <InfoRow icon="fa-id-card" label="CIN Number" value={patient.cin || 'Not Provided'} />
                      <InfoRow icon="fa-shield-halved" label="CNSS Number" value={patient.cnss || 'Not Covered'} />
                      <InfoRow icon="fa-user-tag" label="Username" value={patient.username} />
                  </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
                      <i className="fa-solid fa-user-circle text-blue-600 text-xl"></i>
                      <h3 className="text-xl font-black text-slate-800">Detailed Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Contact Details</h4>
                          <MetaItem label="Email Address" value={patient.email} />
                          <MetaItem label="Phone Number" value={patient.phone} />
                          <MetaItem label="Residential Address" value={patient.address} />
                      </div>

                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Demographics</h4>
                          <MetaItem label="Birth Date" value={patient.birthDate} />
                          <MetaItem label="Gender" value={patient.gender} />
                          <MetaItem label="Marital Status" value={patient.maritalStatus} />
                          <MetaItem label="Patient Type" value={patient.patientType} isBadge />
                      </div>
                  </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Recent Activity Card */}
    <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80 text-white/70">Recent Activity</h4>
        <p className="text-sm font-bold leading-relaxed">No recent medical record found for this patient.</p>
        
        <div className="mt-6 flex flex-wrap gap-3">
            {/* Create Button */}
            <button 
                className="bg-white text-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-blue-700/20"
                onClick={() => navigate(`/dashboard/insert/medical-records/${patient.id}`)}
            >
                Create Medical Record
            </button>

            {/* View History Button (New) */}
            <button 
                className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2"
                onClick={() => navigate(`/dashboard/medical-records/${patient.id}`)}
            >
                <i className="fa-solid fa-eye"></i>
                View Medical Records
            </button>
        </div>
    </div>

    {/* Insurance Card */}
    <div className="bg-slate-800 rounded-[2rem] p-8 text-white">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Insurance & Coverage</h4>
        <div className="flex items-center gap-4">
            <i className="fa-solid fa-file-invoice-dollar text-2xl text-blue-400"></i>
            <div>
                <p className="text-[10px] font-bold opacity-60 uppercase">Coverage Status</p>
                <p className="text-sm font-black">{patient.cnss ? 'Active Coverage (CNSS)' : 'Private / Cash Pay'}</p>
            </div>
        </div>
    </div>
</div>
            </div>
          </div>
        ) : (
          /* --- NEW UPDATE FORM (Same UI Style) --- */
          <div className="max-w-5xl mx-auto animate-in zoom-in duration-300">
            <form onSubmit={handleUpdate} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                    <i className="fa-solid fa-user-pen text-blue-600 text-xl"></i>
                    <h3 className="text-xl font-black text-slate-800">Update Patient Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Section */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">General Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </div>
                        <FormInput label="Username" name="username" value={formData.username} onChange={handleInputChange} required />
                        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                        <FormInput label="Password" name="password" type="password" placeholder="Leave empty to keep current" onChange={handleInputChange} />
                    </div>

                    {/* Medical & Personal Section */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Demographics & Admin</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </FormSelect>
                            <FormInput label="Birth Date" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Patient Type" name="patientType" value={formData.patientType} onChange={handleInputChange}>
                                <option value="INPATIENT">Inpatient</option>
                                <option value="OUTPATIENT">Outpatient</option>
                                <option value="EMERGENCY">Emergency</option>
                            </FormSelect>
                            <FormSelect label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                                <option value="SINGLE">Single</option>
                                <option value="MARRIED">Married</option>
                                <option value="DIVORCED">Divorced</option>
                                <option value="WIDOWED">Widowed</option>
                                <option value="UNASSIGNED">Unassigned</option>
                            </FormSelect>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="CIN" name="cin" value={formData.cin} onChange={handleInputChange} />
                            <FormInput label="CNSS" name="cnss" value={formData.cnss} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                         <FormInput label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-50 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
                    >
                        Discard Changes
                    </button>
                    <button 
                        type="submit"
                        className="px-10 py-3.5 rounded-2xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm"
                    >
                        Save Patient Records
                    </button>
                </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Local Form Helpers ────────────────────────────────────────────────────────

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