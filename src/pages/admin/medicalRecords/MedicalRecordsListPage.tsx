import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getMedicalRecords,
  createMedicalRecord, 
  deleteMedicalRecord, 
  getMedicalRecordsByPatientId 
} from "../../../services/adminServices/MedicalRecord.service"; 
import { getDoctors } from "../../../services/adminServices/Doctor.service";
import { getAppointments } from "../../../services/adminServices/Appointment.service";
import { getAllNurses } from "../../../services/patientServices/Staff.service"; 

// ─── Types ────────────────────────────────────────────────────────────────────
interface MedicalRecordDto {
  id: number;
  nurseId: number;
  doctorId: number;
  appointmentId: number;
  patientId: number;
  vitalId: number | null;
  createdDate: string;
}

interface CreateMedicalRecordRequest {
  nurseId: number | "";
  doctorId: number | "";
  appointmentId: number | "";
}

export default function MedicalRecordsListPage() {
  const navigate = useNavigate();
  
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [patients, setPatients] = useState<any[]>([]); 
  const [nurses, setNurses] = useState<any[]>([]); 
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchPatientId, setSearchPatientId] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedPatientId, setSelectedPatientId] = useState<number | "">("");
  const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
    nurseId: "",
    doctorId: "",
    appointmentId: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [recordsRes, doctorsRes, apptsRes, nursesRes] = await Promise.all([
        getMedicalRecords(),
        getDoctors(0, 100),             
        getAppointments(0, 100),
        getAllNurses() 
      ]);

      // FIX: Accessing data.content based on your provided response structure
      const recordsList = recordsRes.data?.content || [];
      const doctorsList = doctorsRes.data?.content || [];
      const apptsList = apptsRes.data?.content || [];
      
      // Nurses usually return data directly in a custom staff service, 
      // but check if it's also wrapped in .data
      const nursesList = nursesRes.data || nursesRes || [];

      setRecords(recordsList);
      setDoctors(doctorsList);
      setNurses(nursesList);
      setAppointments(apptsList);
      
      // Extract unique patients from the appointments list
      const uniquePatients = Array.from(new Set(apptsList.map((a: any) => a.patientId)))
        .map(id => {
          const appt = apptsList.find((a: any) => a.patientId === id);
          return { 
            id: appt.patientId, 
            firstName: appt.patientFirstName || "Patient", 
            lastName: appt.patientLastName || `#${appt.patientId}` 
          };
        });
      setPatients(uniquePatients);
      
    } catch (err) {
      console.error("Failed to fetch clinical data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchPatientId) {
        fetchInitialData();
        return;
    }
    setLoading(true);
    try {
      const res = await getMedicalRecordsByPatientId(Number(searchPatientId));
      // API search might return a direct list or a paginated object. 
      // Handling both to be safe:
      const results = res.data?.content || res.data || [];
      setRecords(results);
    } catch (err) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createMedicalRecord(formData);
      if (response.success) {
        setIsModalOpen(false);
        setFormData({ nurseId: "", doctorId: "", appointmentId: "" });
        setSelectedPatientId("");
        fetchInitialData();
      }
    } catch (err) {
      console.error("Error creating record:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this medical record permanently?")) {
      try {
        const res = await deleteMedicalRecord(id);
        if (res.success) {
            setRecords(prev => prev.filter(r => r.id !== id));
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const getStaffName = (list: any[], id: number) => {
    const person = list.find(p => p.id === id);
    return person ? `${person.firstName} ${person.lastName}` : `ID: ${id}`;
  };

  const filteredAppointments = appointments.filter(
    app => app.patientId === Number(selectedPatientId)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-heading">Medical Records</h1>
          <p className="text-slate-500 text-sm font-medium italic">Clinical history management</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm shadow-sm"
              placeholder="Search by Patient ID..."
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <i className="fa-solid fa-file-medical"></i> Create Record
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
            <div className="p-24 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading clinical data...</p>
            </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Reference</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Team</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Vitals</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length > 0 ? records.map(rec => (
                <tr key={rec.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#REC-{rec.id}</span>
                      <span className="text-[15px] font-black text-slate-900 mt-1">Patient ID: {rec.patientId}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <i className="fa-solid fa-user-doctor text-blue-500 text-[10px]"></i>
                        {getStaffName(doctors, rec.doctorId)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-2 tracking-tighter">
                        <i className="fa-solid fa-user-nurse text-amber-500"></i>
                        {getStaffName(nurses, rec.nurseId)}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all" 
                      onClick={() => navigate(`/dashboard/medical-records/${rec.id}/vitals`)}
                    >
                      <i className="fa-solid fa-heart-pulse"></i>
                      {rec.vitalId ? 'Update' : 'Add'}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/dashboard/medical-records/${rec.id}`)}
                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fa-solid fa-eye text-sm"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(rec.id)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900">Create Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><i className="fa-solid fa-circle-xmark text-3xl"></i></button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                <select 
                   className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none transition-all font-bold text-sm shadow-inner cursor-pointer"
                   value={selectedPatientId} 
                   onChange={(e) => {
                     setSelectedPatientId(e.target.value === "" ? "" : Number(e.target.value));
                     setFormData({...formData, appointmentId: ""});
                   }} 
                   required
                >
                  <option value="">Select from active patients...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Slot</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none transition-all font-bold text-sm shadow-inner disabled:opacity-50 cursor-pointer" 
                  value={formData.appointmentId} 
                  onChange={(e) => setFormData({...formData, appointmentId: Number(e.target.value)})} 
                  disabled={!selectedPatientId} 
                  required
                >
                  <option value="">Choose appointment...</option>
                  {filteredAppointments.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.appointmentDate} - {app.scheduleTimeStart.slice(0,5)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physician</label>
                  <select className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none transition-all font-bold text-sm shadow-inner cursor-pointer" value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: Number(e.target.value)})} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.firstName} {doc.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Nurse</label>
                  <select className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white outline-none transition-all font-bold text-sm shadow-inner cursor-pointer" value={formData.nurseId} onChange={(e) => setFormData({...formData, nurseId: Number(e.target.value)})} required>
                    <option value="">Select Nurse</option>
                    {nurses.map(n => <option key={n.id} value={n.id}>{n.firstName} {n.lastName}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-sm uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-5 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all text-sm uppercase">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RecordStat({ label, val, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block mb-1">{label}</span>
        <span className="text-2xl font-black text-slate-900 leading-none">{val}</span>
      </div>
    </div>
  );
}