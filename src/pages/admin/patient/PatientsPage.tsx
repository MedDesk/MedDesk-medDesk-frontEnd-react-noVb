import React, { useState, useEffect } from 'react';
import type { CreatePatientRequest, PatientDtoResponse } from '../../../types/Patient'; 
import PatientForm from './PatientForm';
import { getPatients, createPatient, deletePatient } from '../../../services/patientService';
import { useNavigate } from 'react-router-dom';

// Color mapping for all patient types
const TYPE_COLORS: Record<string, string> = {
  EMERGENCY: 'bg-rose-100 text-rose-600 border-rose-200',
  INPATIENT: 'bg-blue-100 text-blue-600 border-blue-200',
  OUTPATIENT: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  REFERRAL: 'bg-purple-100 text-purple-600 border-purple-200',
  OTHER: 'bg-slate-100 text-slate-600 border-slate-200',
  UNASSIGNED: 'bg-slate-50 text-slate-400 border-slate-100',
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [patients, setPatients] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getPatients(0, 100);
      if (response.success) {
        const mappedData = response.data.content.map((p: PatientDtoResponse) => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          email: p.email,
          phone: p.phone, // Phone number from data
          image: p.profileImage, 
          age: calculateAge(p.birthDate),
          gender: p.gender,
          type: p.patientType, // EMERGENCY, INPATIENT, etc.
        }));
        setPatients(mappedData);
        console.log(patients)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  function calculateAge(birthDate: string) {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return age > 0 ? age : 0;
  }

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.id).includes(searchTerm);
    const matchesFilter = activeFilter === 'All' || p.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDeletePatient = async (id: number) => {
    if (window.confirm("Remove this patient from records?")) {
      await deletePatient(id);
      fetchPatients();
    }
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text" placeholder="Search by name or ID..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95 transition-all">
          <i className="fa-solid fa-plus"></i> Add Patient
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'INPATIENT', 'OUTPATIENT', 'EMERGENCY', 'REFERRAL'].map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilter === f ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Patient</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Contact Details</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 text-center">Type</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Demographics</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPatients.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    {/* Profile Image with fallback to Initials */}
                    {p.image ? (
                      <img src={p.image} className="w-11 h-11 rounded-2xl object-cover bg-slate-100 shadow-sm" />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-black text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: #P-{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                     <i className="fa-solid fa-phone text-blue-500 text-[10px]"></i>
                     {p.phone}
                   </div>
                   <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 lowercase">
                     <i className="fa-solid fa-envelope text-slate-300"></i>
                     {p.email}
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${TYPE_COLORS[p.type] || TYPE_COLORS.OTHER}`}>
                      {p.type}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="text-xs font-black text-slate-600 uppercase tracking-tighter">{p.gender}</div>
                   <div className="text-[11px] text-slate-400 font-bold">{p.age} Yrs</div>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                      <button className="w-9 h-9 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm bg-slate-50 flex items-center justify-center"
                      onClick={() => navigate(`/dashboard/patients/${p.id}`)}
                    ><i className="fa-regular fa-eye text-sm"></i></button>
                    <button onClick={() => handleDeletePatient(p.id)} className="w-9 h-9 rounded-xl text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm bg-slate-50 flex items-center justify-center"><i className="fa-solid fa-trash-can text-sm"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && !loading && (
          <div className="p-20 text-center text-slate-400 italic">No patients found.</div>
        )}
      </div>

      {/* MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/30">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <PatientForm onSubmit={async (data) => {
              setLoading(true);
              const res = await createPatient(data);
              if (res.success) { setIsAdding(false); fetchPatients(); }
              setLoading(false);
            }} onCancel={() => setIsAdding(false)} loading={loading} />
          </div>
        </div>
      )}
    </div>
  );
}