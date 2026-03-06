// import React, { useState } from 'react';

// // Mock Data based on your image
// const INITIAL_PATIENTS = [
//   { id: 'P001', name: 'James Wilson', age: 41, gender: 'Male', diagnosis: 'Hypertension', doctor: 'Dr. Smith', status: 'Active' },
//   { id: 'P002', name: 'Maria Garcia', age: 34, gender: 'Female', diagnosis: 'Diabetes Type 2', doctor: 'Dr. Johnson', status: 'Active' },
//   { id: 'P003', name: 'Robert Chen', age: 48, gender: 'Male', diagnosis: 'Cardiac Arrhythmia', doctor: 'Dr. Smith', status: 'Critical' },
//   { id: 'P004', name: 'Emily Thompson', age: 25, gender: 'Female', diagnosis: 'Asthma', doctor: 'Dr. Patel', status: 'Active' },
//   { id: 'P005', name: 'David Kim', age: 61, gender: 'Male', diagnosis: 'Post-surgery recovery', doctor: 'Dr. Johnson', status: 'Discharged' },
//   { id: 'P006', name: 'Sofia Martinez', age: 36, gender: 'Female', diagnosis: 'Migraine', doctor: 'Dr. Patel', status: 'Pending' },
//   { id: 'P007', name: 'Michael Brown', age: 71, gender: 'Male', diagnosis: 'COPD', doctor: 'Dr. Smith', status: 'Critical' },
//   { id: 'P008', name: 'Aisha Patel', age: 28, gender: 'Female', diagnosis: 'Pregnancy checkup', doctor: 'Dr. Johnson', status: 'Active' },
// ];

// export default function PatientsPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeFilter, setActiveFilter] = useState('All');

//   // Filter Logic
//   const filteredPatients = INITIAL_PATIENTS.filter(p => {
//     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="space-y-6">
//       {/* --- TOP TOOLBAR --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="relative w-full max-w-md">
//           <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
//           <input
//             type="text"
//             placeholder="Search patients..."
//             className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
//           <i className="fa-solid fa-plus"></i>
//           Add Patient
//         </button>
//       </div>

//       {/* --- FILTER TABS --- */}
//       <div className="flex items-center gap-2">
//         {['All', 'Active', 'Discharged', 'Critical'].map((filter) => (
//           <button
//             key={filter}
//             onClick={() => setActiveFilter(filter)}
//             className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
//               activeFilter === filter 
//                 ? 'bg-blue-600 text-white shadow-md' 
//                 : 'bg-white text-slate-500 hover:bg-slate-50'
//             }`}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>

//       {/* --- PATIENTS TABLE --- */}
//       <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-slate-50">
//                 <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">ID</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Full Name</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Age</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Gender</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Diagnosis</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Doctor</th>
//                 <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</th>
//                 <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {filteredPatients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="px-8 py-5 text-sm font-bold text-slate-800">{patient.id}</td>
//                   <td className="px-6 py-5 text-sm font-medium text-slate-700">{patient.name}</td>
//                   <td className="px-6 py-5 text-sm text-slate-500">{patient.age}</td>
//                   <td className="px-6 py-5 text-sm text-slate-500">{patient.gender}</td>
//                   <td className="px-6 py-5 text-sm text-slate-500">{patient.diagnosis}</td>
//                   <td className="px-6 py-5 text-sm text-slate-500">{patient.doctor}</td>
//                   <td className="px-6 py-5">
//                     <StatusBadge status={patient.status} />
//                   </td>
//                   <td className="px-8 py-5">
//                     <div className="flex items-center justify-center gap-3">
//                       <button className="text-slate-400 hover:text-blue-500 transition-colors"><i className="fa-regular fa-eye"></i></button>
//                       <button className="text-slate-400 hover:text-amber-500 transition-colors"><i className="fa-solid fa-pen"></i></button>
//                       <button className="text-slate-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash"></i></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Sub-component for Status Badges
// function StatusBadge({ status }: { status: string }) {
//   const styles: any = {
//     Active: 'bg-emerald-100 text-emerald-600',
//     Critical: 'bg-rose-100 text-rose-600',
//     Discharged: 'bg-slate-100 text-slate-600',
//     Pending: 'bg-amber-100 text-amber-600',
//   };

//   return (
//     <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.Discharged}`}>
//       {status}
//     </span>
//   );
// }

import React, { useState } from 'react';
import type { CreatePatientRequest } from '../../types/Patient'; 
import PatientForm from '../../pages/patient/PatientForm'; // The form we created

// Mock Data
const INITIAL_PATIENTS = [
  { id: 'P001', name: 'James Wilson', age: 41, gender: 'Male', diagnosis: 'Hypertension', doctor: 'Dr. Smith', status: 'Active' },
  { id: 'P002', name: 'Maria Garcia', age: 34, gender: 'Female', diagnosis: 'Diabetes Type 2', doctor: 'Dr. Johnson', status: 'Active' },
  { id: 'P003', name: 'Robert Chen', age: 48, gender: 'Male', diagnosis: 'Cardiac Arrhythmia', doctor: 'Dr. Smith', status: 'Critical' },
  { id: 'P004', name: 'Emily Thompson', age: 25, gender: 'Female', diagnosis: 'Asthma', doctor: 'Dr. Patel', status: 'Active' },
  { id: 'P005', name: 'David Kim', age: 61, gender: 'Male', diagnosis: 'Post-surgery recovery', doctor: 'Dr. Johnson', status: 'Discharged' },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // --- STATE TO SHOW/HIDE THE FORM ---
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter Logic
  const filteredPatients = INITIAL_PATIENTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // --- HANDLER: CREATE PATIENT ---
  const handleCreatePatient = async (data: CreatePatientRequest) => {
    setLoading(true);
    try {
      console.log("Submitting Data:", data);
      
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsAdding(false); // Close the form
      alert("Patient created successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- TOP TOOLBAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Open Form on click */}
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Add Patient
        </button>
      </div>

      {/* --- FILTER TABS --- */}
      <div className="flex items-center gap-2">
        {['All', 'Active', 'Discharged', 'Critical'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeFilter === filter 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">ID</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Full Name</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Age</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Gender</th>
                <th className="px-6 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">{patient.id}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-700">{patient.name}</td>
                  <td className="px-6 py-5 text-sm text-slate-500">{patient.age}</td>
                  <td className="px-6 py-5 text-sm text-slate-500">{patient.gender}</td>
                  <td className="px-6 py-5"><StatusBadge status={patient.status} /></td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-400 hover:text-blue-500"><i className="fa-regular fa-eye"></i></button>
                      <button className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- OVERLAY MODAL FOR THE FORM --- */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsAdding(false)}
          ></div>
          
          {/* Form Container */}
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <PatientForm 
              onSubmit={handleCreatePatient} 
              onCancel={() => setIsAdding(false)}
              loading={loading}
            />
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-component
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Active: 'bg-emerald-100 text-emerald-600',
    Critical: 'bg-rose-100 text-rose-600',
    Discharged: 'bg-slate-100 text-slate-600',
    Pending: 'bg-amber-100 text-amber-600',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.Discharged}`}>
      {status}
    </span>
  );
}