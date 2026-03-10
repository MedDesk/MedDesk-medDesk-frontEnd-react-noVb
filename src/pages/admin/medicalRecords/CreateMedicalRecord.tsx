import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMedicalRecord } from "../../../services/adminServices/MedicalRecord.service"; 
import { getDoctors } from "../../../services/adminServices/Doctor.service";
import { getByPatientId } from "../../../services/adminServices/Appointment.service"; 
import { getAllNurses } from "../../../services/patientServices/Staff.service"; 
import { getPatientById } from "../../../services/patientServices/Patient.service"; 
import { User, Calendar, ShieldCheck, ArrowLeft, Fingerprint, AlertCircle } from 'lucide-react'; 
export default function CreateMedicalRecord() {
  const navigate = useNavigate();
  const { patientId } = useParams(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 1. ADD ERROR STATE
  const [patient, setPatient] = useState<any>(null);
  const [nurses, setNurses] = useState<any[]>([]); 
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nurseId: "",
    doctorId: "",
    appointmentId: "",
  });

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const id = Number(patientId);
        const [patientRes, apptsRes, doctorsRes, nursesRes] = await Promise.all([
          getPatientById(id),
          getByPatientId(id),
          getDoctors(0, 100),
          getAllNurses()
        ]);
        setPatient(patientRes.data || patientRes); 
        setAppointments(apptsRes || []);
        setDoctors(doctorsRes.data?.content || []);
        setNurses(nursesRes.data || nursesRes || []);
      } catch (err) {
        console.error("Critical error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors before submission

    try {
      const response = await createMedicalRecord({
        nurseId: Number(formData.nurseId),
        doctorId: Number(formData.doctorId),
        appointmentId: Number(formData.appointmentId)
      });
      
      if (response.success) {
        navigate('/dashboard/medical-records');
      } else {
        // Handle case where success is false but didn't throw an exception
        setError(response.message);
      }
    } catch (err: any) {
      // 2. CATCH THE BACKEND ERROR MESSAGE
      // This reads the "Medical record already exists..." message from your Spring Boot response
      const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Patient Data...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-10 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to List
      </button>

      <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">New Clinical Entry</h2>
            <p className="text-slate-400 font-medium italic">Documenting medical history for this patient</p>
          </div>

          {/* 3. ERROR ALERT DISPLAY */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-100 p-5 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </div>
          )}

          <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30"><User size={40} /></div>
            <div className="text-center md:text-left flex-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Authenticated Patient</p>
                <h3 className="text-3xl font-black text-white tracking-tight leading-none">{patient?.firstName} {patient?.lastName}</h3>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                <Fingerprint className="text-blue-400" size={24} />
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Database ID</p>
                    <p className="text-white font-black font-mono leading-none tracking-wider">#{patient?.id || patientId}</p>
                </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-500 ml-3 tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" /> Appointment Slot
              </label>
              <select 
                className={`w-full px-8 py-6 rounded-[2.2rem] border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-800 transition-all appearance-none cursor-pointer ${error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-200'}`}
                value={formData.appointmentId}
                onChange={(e) => {
                  setFormData({...formData, appointmentId: e.target.value});
                  setError(null); // 4. CLEAR ERROR WHEN SELECTION CHANGES
                }}
                required
              >
                <option value="">Select the related visit date...</option>
                {appointments.map(app => (
                  <option key={app.id} value={app.id}>{app.appointmentDate} — {app.scheduleTimeStart.slice(0,5)} (Ref: #{app.id})</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-500 ml-3 tracking-widest text-slate-400">Primary Physician</label>
                <select className="w-full px-8 py-6 rounded-[2.2rem] border border-slate-200 bg-slate-50 focus:bg-white outline-none font-bold text-slate-800 appearance-none cursor-pointer" value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-500 ml-3 tracking-widest text-slate-400">Attending Nurse</label>
                <select className="w-full px-8 py-6 rounded-[2.2rem] border border-slate-200 bg-slate-50 focus:bg-white outline-none font-bold text-slate-800 appearance-none cursor-pointer" value={formData.nurseId} onChange={(e) => setFormData({...formData, nurseId: e.target.value})} required>
                  <option value="">Select Nurse</option>
                  {nurses.map(n => <option key={n.id} value={n.id}>{n.firstName} {n.lastName}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-8">
              <button type="submit" className="w-full py-7 rounded-[2.5rem] font-black text-white bg-blue-600 hover:bg-slate-900 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-[0.25em] active:scale-95 group">
                <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                Initialize Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}