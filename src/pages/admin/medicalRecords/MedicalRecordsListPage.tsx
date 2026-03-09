import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom'; // Added for navigation

// ─── Types ────────────────────────────────────────────────────────────────────
interface MedicalRecordDto {
  id: number;
  nurseId: number;
  doctorId: number;
  appointmentId: number;
  patientId: number; // Added to facilitate filtering
  vitalId: number;
  createdDate: string;
}

interface CreateMedicalRecordRequest {
  nurseId: number | "";
  doctorId: number | "";
  appointmentId: number | "";
  vitalId: number | "";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_NURSES = [
  { id: 101, name: "Nurse Amina Mansouri" },
  { id: 102, name: "Nurse Yassine Benali" },
  { id: 103, name: "Nurse Sarah Elbaz" },
];

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. Mustapha Elalami", specialty: "Cardiology" },
  { id: 2, name: "Dr. Sarah Mansouri", specialty: "Neurology" },
];

const MOCK_APPOINTMENTS = [
  { id: 1, patientId: 3, date: "2025-10-16", time: "09:00" },
  { id: 5, patientId: 3, date: "2025-11-02", time: "11:30" },
  { id: 2, patientId: 7, date: "2025-10-17", time: "10:00" },
  { id: 8, patientId: 2, date: "2025-10-21", time: "15:00" },
];

const INITIAL_RECORDS: MedicalRecordDto[] = [
  { id: 1, nurseId: 101, doctorId: 1, appointmentId: 1, patientId: 3, vitalId: 501, createdDate: "2025-03-06" },
];

export default function MedicalRecordsListPage() {
  const navigate = useNavigate(); // Initialize navigate
  const [records, setRecords] = useState<MedicalRecordDto[]>(INITIAL_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchPatientId, setSearchPatientId] = useState(""); // State for filtering
  
  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState<number | "">("");
  const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
    nurseId: "",
    doctorId: "",
    appointmentId: "",
    vitalId: Math.floor(Math.random() * 1000), 
  });

  // Filter Logic: Filter records by Patient ID string
  const filteredRecords = records.filter(rec => 
    String(rec.patientId).includes(searchPatientId)
  );

  // Filter appointments based on selected patient in Modal
  const filteredAppointments = MOCK_APPOINTMENTS.filter(
    app => app.patientId === Number(selectedPatientId)
  );

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MedicalRecordDto = {
      id: records.length + 1,
      nurseId: Number(formData.nurseId),
      doctorId: Number(formData.doctorId),
      appointmentId: Number(formData.appointmentId),
      patientId: Number(selectedPatientId), // Capture patient ID
      vitalId: Number(formData.vitalId),
      createdDate: new Date().toISOString().split('T')[0]
    };
    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    setFormData({ nurseId: "", doctorId: "", appointmentId: "", vitalId: "" });
    setSelectedPatientId("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Medical Records</h1>
          <p className="text-slate-500 text-sm font-medium italic">Patient history and clinical documentation</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Filter by Patient ID Input */}
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm shadow-sm"
              placeholder="Search by Patient ID..."
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <i className="fa-solid fa-file-medical"></i> Create New Record
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RecordStat label="Total Records" val={records.length} icon="fa-folder-open" color="text-blue-600" />
        <RecordStat label="Filtered Result" val={filteredRecords.length} icon="fa-filter" color="text-emerald-600" />
        <RecordStat label="Nurses on Duty" val={MOCK_NURSES.length} icon="fa-user-nurse" color="text-amber-600" />
      </div>

      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">ID & Patient</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Staff Involved</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Vitals</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRecords.map(rec => (
              <tr key={rec.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-bold text-slate-400 tracking-tighter uppercase">Ref: #REC-{rec.id}</span>
                    <span className="text-sm font-black text-blue-600 mt-1">Patient #{rec.patientId}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-700">
                      <i className="fa-solid fa-user-doctor text-blue-500 mr-2"></i>
                      {MOCK_DOCTORS.find(d => d.id === rec.doctorId)?.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      <i className="fa-solid fa-user-nurse text-amber-500 mr-2"></i>
                      {MOCK_NURSES.find(n => n.id === rec.nurseId)?.name}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  {/* Add Vitals Button */}
                 <button 
  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all" 
  onClick={() => navigate(`/dashboard/medical-records/${rec.id}`)}
>
  <i className="fa-solid fa-heart-pulse"></i>
  Add Vitals
</button>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    {/* See Details Button */}
                    <button 
                      onClick={() => navigate(`/dashboard/medical-records/${rec.id}`)}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                      title="See Details"
                    >
                      <i className="fa-solid fa-eye text-sm"></i>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                      <i className="fa-solid fa-file-pdf text-sm"></i>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRecords.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
            <p className="font-medium">No records found for Patient ID: {searchPatientId}</p>
          </div>
        )}
      </div>

      {/* Create Modal (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">New Medical Record</h2>
                <p className="text-slate-400 text-xs font-medium">Link clinical data to a patient appointment</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Step 1: Patient ID</label>
                <input 
                  type="number" 
                  placeholder="Enter Patient ID (e.g., 3)" 
                  value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-sm" 
                  required
                />
              </div>
              

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Step 2: Choose Appointment</label>
                <select 
  className="..."
  value={formData.appointmentId}
  // FIX: Convert value to Number
  onChange={(e) => setFormData({...formData, appointmentId: e.target.value === "" ? "" : Number(e.target.value)})}
  disabled={!selectedPatientId}
  required
>
                  <option value="">Select Appointment...</option>
                  {filteredAppointments.map(app => (
                    <option key={app.id} value={app.id}>
                      Appt #{app.id} — Date: {app.date} ({app.time})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Doctor</label>
                 <select 
  className="..."
  value={formData.doctorId}
  // FIX: Convert value to Number
  onChange={(e) => setFormData({...formData, doctorId: e.target.value === "" ? "" : Number(e.target.value)})}
  required
>
                    <option value="">Choose Doctor</option>
                    {MOCK_DOCTORS.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nurse</label>
                 <select 
  className="..."
  value={formData.nurseId}
  // FIX: Convert value to Number
  onChange={(e) => setFormData({...formData, nurseId: e.target.value === "" ? "" : Number(e.target.value)})}
  required
>
                    <option value="">Choose Nurse</option>
                    {MOCK_NURSES.map(nurse => <option key={nurse.id} value={nurse.id}>{nurse.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vital ID Reference</label>
                <div className="px-5 py-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-mono font-bold text-sm flex justify-between">
                  <span>#VIT-{formData.vitalId}</span>
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">Cancel</button>
                <button type="submit" className="py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm">Create Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function RecordStat({ label, val, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">{label}</span>
        <span className="text-xl font-black text-slate-800">{val}</span>
      </div>
    </div>
  );
}