import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import type { PatientDtoResponse } from '../../types/Patient';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDtoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getPatientById(Number(id));
        if (response.success) {
          setPatient(response.data);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

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
             <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                <i className="fa-solid fa-pen-to-square mr-2"></i> Edit Profile
             </button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                <i className="fa-solid fa-print mr-2"></i> Print File
             </button>
          </div>
        </div>
      </div>

      <main className="w-[90%] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Summary */}
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

            {/* Quick Metadata */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Patient Identifiers</h3>
                <div className="space-y-5">
                    <InfoRow icon="fa-id-card" label="CIN Number" value={patient.cin || 'Not Provided'} />
                    <InfoRow icon="fa-shield-halved" label="CNSS Number" value={patient.cnss || 'Not Covered'} />
                    <InfoRow icon="fa-user-tag" label="Username" value={patient.username} />
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal & Demographic Section */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
                    <i className="fa-solid fa-user-circle text-blue-600 text-xl"></i>
                    <h3 className="text-xl font-black text-slate-800">Detailed Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Contact Details</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                <p className="text-sm font-bold text-slate-700">{patient.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><i className="fa-solid fa-phone"></i></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                                <p className="text-sm font-bold text-slate-700">{patient.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><i className="fa-solid fa-location-dot"></i></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Residential Address</p>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{patient.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Demographics */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Demographics</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <MetaItem label="Birth Date" value={patient.birthDate} />
                            <MetaItem label="Gender" value={patient.gender} />
                            <MetaItem label="Marital Status" value={patient.maritalStatus} />
                            <MetaItem label="Patient Type" value={patient.patientType} isBadge />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Extra Section (Placeholder for Appointments) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Recent Activity</h4>
                    <p className="text-sm font-bold leading-relaxed">No recent medical record found for this patient.</p>
                    <button className="mt-6 bg-white text-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 transition-colors">
                        Create Medical Record
                    </button>
                </div>
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
      </main>
    </div>
  );
}

// ─── Local Helpers ────────────────────────────────────────────────────────────

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