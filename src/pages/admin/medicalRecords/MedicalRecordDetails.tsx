// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import { getMedicalRecords } from "../../../services/patientServices/medicalRecords.service";
// import { createVitals, getVitalsById } from "../../../services/adminServices/vitals.service";

// // ── Blood Group Options ──────────────────────────────────────
// const BLOOD_GROUPS = [
//   { value: "A_POSITIVE",  label: "A+"      },
//   { value: "A_NEGATIVE",  label: "A-"      },
//   { value: "B_POSITIVE",  label: "B+"      },
//   { value: "B_NEGATIVE",  label: "B-"      },
//   { value: "AB_POSITIVE", label: "AB+"     },
//   { value: "AB_NEGATIVE", label: "AB-"     },
//   { value: "O_POSITIVE",  label: "O+"      },
//   { value: "O_NEGATIVE",  label: "O-"      },
//   { value: "UNKNOWN",     label: "Unknown" },
// ];

// // ── Default Vitals Form Values ───────────────────────────────
// const DEFAULT_FORM = {
//   systolicBP:        120,
//   diastolicBP:       80,
//   heartRate:         72,
//   respirationRate:   16,
//   spo2:              98,
//   temperature:       36.6,
//   weight:            70.0,
//   height:            170.0,
//   bloodGroup:        "UNKNOWN",
//   ambulationHistory: "",
//   hasFeverHistory:   false,
//   bloodSugar:        90.0,
//   recordedAt:        new Date().toISOString().slice(0, 16),
// };

// function HumanBodySVG({ hasFever }: { hasFever: boolean }) {
//   return (
//     <div className="flex flex-col items-center gap-3">
//       {hasFever && (
//         <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
//           <i className="fa-solid fa-fire text-xs"></i> Fever Detected
//         </span>
//       )}

//       <svg viewBox="0 0 100 260" width="110" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
//         <circle
//           cx="50" cy="28" r="22"
//           fill={hasFever ? "#ef4444" : "#fcd5b5"}
//           stroke={hasFever ? "#b91c1c" : "#e8b48a"}
//           strokeWidth="1.5"
//           style={hasFever ? { animation: "pulse 1s infinite" } : {}}
//         />
//         <circle cx="43" cy="25" r="2.5" fill={hasFever ? "#fff" : "#666"} />
//         <circle cx="57" cy="25" r="2.5" fill={hasFever ? "#fff" : "#666"} />
//         {hasFever
//           ? <path d="M43 35 Q50 31 57 35" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
//           : <path d="M43 33 Q50 37 57 33" stroke="#c49a6c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
//         }
//         {hasFever && (
//           <text x="50" y="19" textAnchor="middle" fontSize="9" fill="#fff">🌡</text>
//         )}
//         <rect x="44" y="49" width="12" height="10" rx="4" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
//         <rect x="30" y="58" width="40" height="55" rx="10" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
//         <polyline
//           points="33,83 39,83 42,74 45,92 48,83 55,83 58,78 61,83 67,83"
//           fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"
//         />
//         <rect x="14" y="60" width="14" height="48" rx="7" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1.2" />
//         <ellipse cx="21" cy="113" rx="7" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
//         <rect x="72" y="60" width="14" height="48" rx="7" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1.2" />
//         <ellipse cx="79" cy="113" rx="7" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
//         <rect x="30" y="112" width="18" height="70" rx="9" fill="#3b82f6" stroke="#2563eb" strokeWidth="1.2" opacity="0.8" />
//         <ellipse cx="39" cy="186" rx="10" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
//         <rect x="52" y="112" width="18" height="70" rx="9" fill="#3b82f6" stroke="#2563eb" strokeWidth="1.2" opacity="0.8" />
//         <ellipse cx="61" cy="186" rx="10" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
//         <circle cx="21" cy="103" r="3" fill="#3b82f6">
//           <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
//         </circle>
//         <circle cx="50" cy="83" r="3" fill="#ef4444">
//           <animate attributeName="r" values="2;4;2" dur="0.9s" repeatCount="indefinite" />
//         </circle>
//       </svg>

//       <div className="flex gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
//         <span className="flex items-center gap-1">
//           <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span> Heart
//         </span>
//         <span className="flex items-center gap-1">
//           <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> SpO2
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function PatientArchivePage() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [records,          setRecords]          = useState<any[]>([]);
//   const [selectedRecord,   setSelectedRecord]   = useState<any>(null);
//   const [vitalsData,       setVitalsData]       = useState<any>(null);
//   const [formData,         setFormData]         = useState({ ...DEFAULT_FORM });
//   const [loading,          setLoading]          = useState(true);
//   const [workspaceLoading, setWorkspaceLoading] = useState(false);
//   const [isSubmitting,     setIsSubmitting]     = useState(false);
//   const [successMsg,       setSuccessMsg]       = useState("");

//   useEffect(() => { if (id) fetchRecords(); }, [id]);

//   async function fetchRecords() {
//     setLoading(true);
//     try {
//       const response = await getMedicalRecords(Number(id));
//       setRecords(response.data?.content || response.data || []);
//     } catch (err) { console.error(err); } 
//     finally { setLoading(false); }
//   }

//   async function handleOpenRecord(rec: any) {
//     setSelectedRecord(rec);
//     setVitalsData(null);
//     setSuccessMsg("");
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     if (rec.vitalId) {
//       setWorkspaceLoading(true);
//       try {
//         const res = await getVitalsById(rec.vitalId);
//         setVitalsData(res.data || res);
//       } catch (err) { console.error(err); } 
//       finally { setWorkspaceLoading(false); }
//     } else {
//       setFormData({ ...DEFAULT_FORM });
//     }
//   }


//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const payload = { ...formData, medicalRecordId: selectedRecord.id, recordedAt: formData.recordedAt + ":00" };
//       const res = await createVitals(payload);
//       if (res.success) {
//         setSuccessMsg("Vitals saved successfully!");
//         await fetchRecords();
//         setSelectedRecord(null);
//       }
//     } catch (err) { alert("Error saving vitals."); } 
//     finally { setIsSubmitting(false); }
//   }

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <i className="fa-solid fa-heart-pulse text-blue-600 text-5xl animate-pulse"></i>
//       <p className="text-slate-400 font-semibold tracking-widest text-sm uppercase">Loading Archive...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">
//       {/* ── HEADER (Updated to 95%) ── */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-[95%] mx-auto px-6 py-4 flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium">
//             <i className="fa-solid fa-arrow-left"></i> Back
//           </button>
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
//               <i className="fa-solid fa-notes-medical text-blue-600"></i>
//             </div>
//             <h1 className="text-base font-bold text-slate-800 leading-none tracking-tight">Clinical Workspace Patient #{id}</h1>
//           </div>
//           <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-tighter">
//             <i className="fa-solid fa-folder-open text-blue-500"></i>
//             <span>{records.length} Records</span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-[95%] mx-auto px-6 py-10 space-y-10">
//         {successMsg && (
//           <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 px-5 py-3 rounded-2xl text-sm font-medium shadow-sm animate-in slide-in-from-top-4">
//             <i className="fa-solid fa-circle-check text-blue-500"></i>
//             {successMsg}
//           </div>
//         )}

//         {!selectedRecord ? (
//           <div className="border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center bg-white hover:border-blue-300 transition-colors">
//             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
//               <i className="fa-solid fa-folder-magnifying-glass text-slate-300 text-3xl"></i>
//             </div>
//             <p className="text-slate-400 text-sm font-medium">Select a medical record folder from the clinical timeline to open workspace</p>
//           </div>
//         ) : workspaceLoading ? (
//           <div className="bg-white rounded-3xl p-20 text-center border border-slate-100"><i className="fa-solid fa-spinner text-blue-500 text-3xl animate-spin"></i></div>
//         ) : vitalsData ? (
//           <ReadModeWorkspace record={selectedRecord} vitals={vitalsData} onClose={() => setSelectedRecord(null)} />
//         ) : (
//           <CreateModeWorkspace record={selectedRecord} formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} onSubmit={handleSubmit} onClose={() => setSelectedRecord(null)} />
//         )}

//         <RecordsTable records={records} selectedId={selectedRecord?.id} onOpen={handleOpenRecord} />
//       </main>
//     </div>
//   );
// }

// // ── READ MODE ──
// function ReadModeWorkspace({ record, vitals, onClose }: any) {
//   return (
//     <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg animate-in zoom-in-95">
//       <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-blue-50">
//         <div className="flex items-center gap-4 text-blue-700">
//           <i className="fa-solid fa-shield-heart text-lg"></i>
//           <span className="font-bold">Authorized Record View: #REC-{record.id}</span>
//         </div>
//         <button onClick={onClose} className="text-slate-400 hover:text-slate-700 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-12">
//         <div className="lg:col-span-4 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center p-10 gap-5">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">Biometric Mapping</p>
//           <HumanBodySVG hasFever={vitals.hasFeverHistory} />
//           <div className="grid grid-cols-2 gap-3 w-full">
//             <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-sm">
//                 <p className="text-[9px] text-slate-400 font-bold uppercase">Heart</p>
//                 <p className="text-rose-500 font-bold text-base">{vitals.heartRate} <span className="text-[9px]">bpm</span></p>
//             </div>
//             <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-sm">
//                 <p className="text-[9px] text-slate-400 font-bold uppercase">Temp</p>
//                 <p className={`font-bold text-base ${vitals.hasFeverHistory ? 'text-red-500' : 'text-blue-600'}`}>{vitals.temperature}°C</p>
//             </div>
//           </div>
//         </div>
//         <div className="lg:col-span-8 p-8 space-y-6">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             <VitalCard icon="fa-solid fa-bolt" iconColor="text-blue-600" bg="bg-blue-50/50 border-blue-100" label="Blood Pressure" value={`${vitals.systolicBP}/${vitals.diastolicBP}`} unit="mmHg" />
//             <VitalCard icon="fa-solid fa-droplet" iconColor="text-blue-500" bg="bg-blue-50/30 border-blue-50" label="SpO2" value={vitals.spo2} unit="%" />
//             <VitalCard icon="fa-solid fa-syringe" iconColor="text-blue-400" bg="bg-blue-50/20 border-blue-50" label="Blood Sugar" value={vitals.bloodSugar} unit="mg/dL" />
//             <VitalCard icon="fa-solid fa-lungs" iconColor="text-blue-600" bg="bg-blue-50 border-blue-100" label="Respiration" value={vitals.respirationRate} unit="br/min" />
//             <VitalCard icon="fa-solid fa-weight-scale" iconColor="text-slate-700" bg="bg-slate-100 border-slate-200" label="Weight" value={vitals.weight} unit="kg" />
//             <VitalCard icon="fa-solid fa-ruler-vertical" iconColor="text-slate-500" bg="bg-slate-50 border-slate-200" label="Height" value={vitals.height} unit="cm" />
//           </div>
//           {vitals.ambulationHistory && (
//             <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
//               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Observations</p>
//               <p className="text-slate-600 text-sm leading-relaxed">{vitals.ambulationHistory}</p>
//             </div>
//           )}
//           <div className="flex gap-3">
//              <span className="px-4 py-1.5 rounded-xl border bg-blue-50 border-blue-100 text-blue-600 text-xs font-bold uppercase">Blood: {vitals.bloodGroup?.replace('_',' ')}</span>
//              {vitals.hasFeverHistory && <span className="px-4 py-1.5 rounded-xl border bg-red-50 border-red-200 text-red-600 text-xs font-bold uppercase animate-pulse">Fever Alert</span>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── CREATE MODE ──
// function CreateModeWorkspace({ record, formData, setFormData, isSubmitting, onSubmit, onClose }: any) {
//   const set = (field: string, val: any) => setFormData({ ...formData, [field]: val });
//   return (
//     <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl animate-in slide-in-from-top-4">
//       <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-blue-600 text-white">
//         <div className="flex items-center gap-4">
//           <i className="fa-solid fa-stethoscope text-lg"></i>
//           <span className="font-bold">Input Clinical Vitals: #REC-{record.id}</span>
//         </div>
//         <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">X</button>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-12">
//         <div className="lg:col-span-4 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center p-10 gap-5">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">Biometric Preview</p>
//           <HumanBodySVG hasFever={formData.hasFeverHistory} />
//         </div>
//         <div className="lg:col-span-8 p-8">
//           <form onSubmit={onSubmit} className="space-y-5">
//             <div className="grid grid-cols-2 gap-4">
//               <FormInput label="Systolic BP" icon="fa-solid fa-bolt" type="number" value={formData.systolicBP} onChange={(v: string) => set("systolicBP", +v)} />
//               <FormInput label="Diastolic BP" icon="fa-solid fa-bolt" type="number" value={formData.diastolicBP} onChange={(v: string) => set("diastolicBP", +v)} />
//               <FormInput label="Heart Rate" icon="fa-solid fa-heart-pulse" type="number" value={formData.heartRate} onChange={(v: string) => set("heartRate", +v)} />
//               <FormInput label="SpO2 (%)" icon="fa-solid fa-droplet" type="number" value={formData.spo2} onChange={(v: string) => set("spo2", +v)} />
//               <FormInput label="Temperature (°C)" icon="fa-solid fa-temperature-half" type="number" step="0.1" value={formData.temperature} onChange={(v: string) => set("temperature", +v)} />
//               <div className="space-y-2">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block"><i className="fa-solid fa-droplet mr-2 text-blue-500"></i>Blood Group</label>
//                 <select value={formData.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none">
//                   {BLOOD_GROUPS.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
//                 </select>
//               </div>
//               <FormInput label="Weight (kg)" icon="fa-solid fa-weight-scale" type="number" step="0.1" value={formData.weight} onChange={(v: string) => set("weight", +v)} />
//               <FormInput label="Height (cm)" icon="fa-solid fa-ruler-vertical" type="number" value={formData.height} onChange={(v: string) => set("height", +v)} />
//             </div>
//             <div className="flex justify-between items-center gap-4">
//                 <button type="button" onClick={() => set("hasFeverHistory", !formData.hasFeverHistory)} className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${formData.hasFeverHistory ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-400'}`}>
//                     <i className="fa-solid fa-fire mr-2"></i>{formData.hasFeverHistory ? 'Fever History: Active' : 'No Fever History'}
//                 </button>
//                 <button type="submit" disabled={isSubmitting} className="flex-[2] bg-blue-600 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50">
//                     {isSubmitting ? 'Processing...' : 'Synchronize Vitals'}
//                 </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── TABLE COMPONENT ──
// function RecordsTable({ records, selectedId, onOpen }: any) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-bold text-slate-800 flex items-center gap-4">
//         <i className="fa-solid fa-timeline text-blue-600"></i> Clinical Timeline <div className="flex-1 h-px bg-slate-200"></div>
//       </h2>
//       <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
//               <th className="text-left px-10 py-6">Medical Reference</th>
//               <th className="text-center px-10 py-6">Clinical Team</th>
//               <th className="text-center px-10 py-6">Status</th>
//               <th className="text-right px-10 py-6">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {records.map((rec: any) => (
//               <tr key={rec.id} className={`transition-colors ${selectedId === rec.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
//                 <td className="px-10 py-6">
//                   <div className="flex items-center gap-6">
//                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedId === rec.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
//                       <i className="fa-solid fa-file-waveform text-xl"></i>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400 font-medium uppercase mb-1">Created: {rec.createdDate || 'Mar 2026'}</p>
//                       <p className="text-lg font-black text-slate-800 leading-none">#REC-{rec.id}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-10 py-6 text-center space-x-2">
//                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold border border-blue-100 uppercase tracking-widest">Dr {rec.doctorId}</span>
//                   <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold border border-slate-200 uppercase tracking-widest">Ns {rec.nurseId}</span>
//                 </td>
//                 <td className="px-10 py-6 text-center">
//                   {rec.vitalId ? 
//                     <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1"><i className="fa-solid fa-check-circle"></i> Logged</span> :
//                     <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">Pending</span>
//                   }
//                 </td>
//                 <td className="px-10 py-6 text-right">
//                   <button onClick={() => onOpen(rec)} className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${selectedId === rec.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white'}`}>
//                     {selectedId === rec.id ? 'Active' : 'Open'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function VitalCard({ icon, iconColor, bg, label, value, unit }: any) {
//   return (
//     <div className={`border rounded-[1.5rem] p-5 space-y-3 transition-all hover:shadow-md ${bg}`}>
//       <i className={`${icon} ${iconColor} text-lg`}></i>
//       <div>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//         <p className="text-slate-800 font-black text-lg leading-none">{value}<span className="text-slate-400 text-xs font-medium ml-1">{unit}</span></p>
//       </div>
//     </div>
//   );
// }

// function FormInput({ label, icon, type, step, value, onChange }: any) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block"><i className={`${icon} mr-2 text-blue-500`}></i>{label}</label>
//       <input required type={type} step={step} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
//     </div>
//   );
// }

// ============================================================
// PatientArchivePage.tsx — With Full Error Handling UI
// Parses API errors like: { success: false, message: "...", status: 400 }
// Font Awesome CDN in index.html:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
// ============================================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getMedicalRecords } from "../../../services/patientServices/medicalRecords.service";
import { createVitals, getVitalsById } from "../../../services/adminServices/vitals.service";

const BLOOD_GROUPS = [
  { value: "A_POSITIVE",  label: "A+"      },
  { value: "A_NEGATIVE",  label: "A-"      },
  { value: "B_POSITIVE",  label: "B+"      },
  { value: "B_NEGATIVE",  label: "B-"      },
  { value: "AB_POSITIVE", label: "AB+"     },
  { value: "AB_NEGATIVE", label: "AB-"     },
  { value: "O_POSITIVE",  label: "O+"      },
  { value: "O_NEGATIVE",  label: "O-"      },
  { value: "UNKNOWN",     label: "Unknown" },
];

const DEFAULT_FORM = {
  systolicBP: 120, diastolicBP: 80, heartRate: 72, respirationRate: 16,
  spo2: 98, temperature: 36.6, weight: 70.0, height: 170.0,
  bloodGroup: "UNKNOWN", ambulationHistory: "", hasFeverHistory: false,
  bloodSugar: 90.0, recordedAt: new Date().toISOString().slice(0, 16),
};

// ============================================================
// ERROR PARSER
// Takes the raw caught error and extracts a clean object.
// Handles the API format:
//   { success: false, message: "fieldName: Human readable message", status: 400, path, timestamp }
// ============================================================
type ParsedError = {
  title: string;
  message: string;
  field?: string;      // e.g. "ambulationHistory" — used to highlight the matching input
  status?: number;
  path?: string;
  timestamp?: string;
};

function parseApiError(err: any): ParsedError {
  // Axios wraps the response under err.response.data
  // Fetch errors may put it directly on err.data
  const data = err?.response?.data || err?.data || null;

  if (data && data.success === false) {
    const rawMessage: string = data.message || "An unknown error occurred";

    // API sends messages like "ambulationHistory: Ambulation history is required"
    // We split on the first ": " to extract the field name separately
    const colonIndex = rawMessage.indexOf(": ");
    let field: string | undefined;
    let message: string;

    if (colonIndex !== -1) {
      field   = rawMessage.slice(0, colonIndex);   // "ambulationHistory"
      message = rawMessage.slice(colonIndex + 2);  // "Ambulation history is required"
    } else {
      message = rawMessage;
    }

    return { title: `Error ${data.status || ""}`, message, field, status: data.status, path: data.path, timestamp: data.timestamp };
  }

  // Generic fallback (network error, unexpected shape, etc.)
  return { title: "Request Failed", message: err?.message || "Something went wrong. Please try again." };
}

// ============================================================
// ERROR BANNER COMPONENT
// A dismissible red card showing: title, message, field badge,
// status code, API path, and timestamp
// ============================================================
function ErrorBanner({ error, onDismiss }: { error: ParsedError; onDismiss: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-2">

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-base"></i>
          </div>
          <div>
            <p className="font-bold text-red-700 text-sm">{error.title}</p>
            <p className="text-red-600 text-sm mt-0.5 leading-relaxed">{error.message}</p>
          </div>
        </div>
        <button onClick={onDismiss} className="text-red-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
          <i className="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      {/* Detail badges row — only shown when details are available */}
      {(error.field || error.path || error.timestamp || error.status) && (
        <div className="mt-3 pt-3 border-t border-red-100 flex flex-wrap gap-2">

          {/* Field name — most important, shown first */}
          {error.field && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 border border-red-200 rounded-lg text-[10px] font-bold text-red-600 uppercase tracking-widest">
              <i className="fa-solid fa-tag text-[9px]"></i> Field: {error.field}
            </span>
          )}

          {/* HTTP status code */}
          {error.status && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-100 rounded-lg text-[10px] font-bold text-red-400">
              <i className="fa-solid fa-signal text-[9px]"></i> {error.status}
            </span>
          )}

          {/* API path */}
          {error.path && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-100 rounded-lg text-[10px] font-medium text-slate-400">
              <i className="fa-solid fa-route text-[9px]"></i> {error.path}
            </span>
          )}

          {/* Timestamp */}
          {error.timestamp && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-100 rounded-lg text-[10px] font-medium text-slate-400">
              <i className="fa-solid fa-clock text-[9px]"></i> {error.timestamp}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HUMAN BODY SVG — head turns red when hasFever is true
// ============================================================
function HumanBodySVG({ hasFever }: { hasFever: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {hasFever && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
          <i className="fa-solid fa-fire text-xs"></i> Fever Detected
        </span>
      )}
      <svg viewBox="0 0 100 260" width="110" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        <circle cx="50" cy="28" r="22" fill={hasFever ? "#ef4444" : "#fcd5b5"} stroke={hasFever ? "#b91c1c" : "#e8b48a"} strokeWidth="1.5" />
        <circle cx="43" cy="25" r="2.5" fill={hasFever ? "#fff" : "#666"} />
        <circle cx="57" cy="25" r="2.5" fill={hasFever ? "#fff" : "#666"} />
        {hasFever
          ? <path d="M43 35 Q50 31 57 35" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          : <path d="M43 33 Q50 37 57 33" stroke="#c49a6c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        }
        {hasFever && <text x="50" y="19" textAnchor="middle" fontSize="9" fill="#fff">🌡</text>}
        <rect x="44" y="49" width="12" height="10" rx="4" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
        <rect x="30" y="58" width="40" height="55" rx="10" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
        <polyline points="33,83 39,83 42,74 45,92 48,83 55,83 58,78 61,83 67,83" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <rect x="14" y="60" width="14" height="48" rx="7" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1.2" />
        <ellipse cx="21" cy="113" rx="7" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
        <rect x="72" y="60" width="14" height="48" rx="7" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1.2" />
        <ellipse cx="79" cy="113" rx="7" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
        <rect x="30" y="112" width="18" height="70" rx="9" fill="#3b82f6" stroke="#2563eb" strokeWidth="1.2" opacity="0.8" />
        <ellipse cx="39" cy="186" rx="10" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
        <rect x="52" y="112" width="18" height="70" rx="9" fill="#3b82f6" stroke="#2563eb" strokeWidth="1.2" opacity="0.8" />
        <ellipse cx="61" cy="186" rx="10" ry="5" fill="#fcd5b5" stroke="#e8b48a" strokeWidth="1" />
        <circle cx="21" cy="103" r="3" fill="#3b82f6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="83" r="3" fill="#ef4444">
          <animate attributeName="r" values="2;4;2" dur="0.9s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="flex gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span> Heart</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> SpO2</span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function PatientArchivePage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [records,          setRecords]          = useState<any[]>([]);
  const [selectedRecord,   setSelectedRecord]   = useState<any>(null);
  const [vitalsData,       setVitalsData]       = useState<any>(null);
  const [formData,         setFormData]         = useState({ ...DEFAULT_FORM });
  const [loading,          setLoading]          = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [isSubmitting,     setIsSubmitting]     = useState(false);

  // Three notification states:
  // successMsg  → green banner (save worked)
  // submitError → red banner inside the form (save failed)
  // fetchError  → red banner at page level (load failed)
  const [successMsg,  setSuccessMsg]  = useState("");
  const [submitError, setSubmitError] = useState<ParsedError | null>(null);
  const [fetchError,  setFetchError]  = useState<ParsedError | null>(null);

  useEffect(() => { if (id) fetchRecords(); }, [id]);

  async function fetchRecords() {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await getMedicalRecords(Number(id));
      setRecords(response.data?.content || response.data || []);
    } catch (err) {
      setFetchError(parseApiError(err));  // show error in UI instead of alert
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenRecord(rec: any) {
    setSelectedRecord(rec);
    setVitalsData(null);
    setSuccessMsg("");
    setSubmitError(null);
    setFetchError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (rec.vitalId) {
      setWorkspaceLoading(true);
      try {
        const res = await getVitalsById(rec.vitalId);
        setVitalsData(res.data || res);
      } catch (err) {
        setFetchError(parseApiError(err));
      } finally {
        setWorkspaceLoading(false);
      }
    } else {
      setFormData({ ...DEFAULT_FORM });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);  // clear previous error before retrying
    setSuccessMsg("");
    try {
      const payload = { ...formData, medicalRecordId: selectedRecord.id, recordedAt: formData.recordedAt + ":00" };
      const res = await createVitals(payload);
      if (res.success) {
        setSuccessMsg("Vitals synchronized successfully!");
        await fetchRecords();
        setSelectedRecord(null);
      }
    } catch (err) {
      setSubmitError(parseApiError(err));  // show parsed error inside the form
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <i className="fa-solid fa-heart-pulse text-blue-600 text-5xl animate-pulse"></i>
      <p className="text-slate-400 font-semibold tracking-widest text-sm uppercase">Loading Archive...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[95%] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium">
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-notes-medical text-blue-600"></i>
            </div>
            <h1 className="text-base font-bold text-slate-800">Clinical Workspace — Patient <span className="text-blue-600">#{id}</span></h1>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-tight">
            <i className="fa-solid fa-folder-open text-blue-500"></i> {records.length} Records
          </div>
        </div>
      </header>

      <main className="max-w-[95%] mx-auto px-6 py-10 space-y-8">

        {/* Page-level fetch error */}
        {fetchError && <ErrorBanner error={fetchError} onDismiss={() => setFetchError(null)} />}

        {/* Success banner */}
        {successMsg && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 px-5 py-3 rounded-2xl text-sm font-medium shadow-sm animate-in slide-in-from-top-4">
            <i className="fa-solid fa-circle-check text-blue-500 text-base"></i>
            {successMsg}
          </div>
        )}

        {/* Workspace area */}
        {!selectedRecord ? (
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center bg-white hover:border-blue-300 transition-colors">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-folder-magnifying-glass text-slate-300 text-3xl"></i>
            </div>
            <p className="text-slate-400 text-sm font-medium">Select a record from the timeline below to open the workspace</p>
          </div>
        ) : workspaceLoading ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
            <i className="fa-solid fa-spinner text-blue-500 text-3xl animate-spin"></i>
            <p className="text-slate-400 mt-4 text-sm">Loading vitals...</p>
          </div>
        ) : vitalsData ? (
          <ReadModeWorkspace record={selectedRecord} vitals={vitalsData} onClose={() => setSelectedRecord(null)} />
        ) : (
          <CreateModeWorkspace
            record={selectedRecord}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onClose={() => { setSelectedRecord(null); setSubmitError(null); }}
            submitError={submitError}
            onDismissError={() => setSubmitError(null)}
          />
        )}

        <RecordsTable records={records} selectedId={selectedRecord?.id} onOpen={handleOpenRecord} />
      </main>
    </div>
  );
}

// ============================================================
// READ MODE
// ============================================================
function ReadModeWorkspace({ record, vitals, onClose }: any) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg animate-in zoom-in-95">
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-blue-50">
        <div className="flex items-center gap-4 text-blue-700">
          <i className="fa-solid fa-shield-heart text-lg"></i>
          <span className="font-bold">Authorized Record View — #REC-{record.id}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center p-10 gap-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">
            <i className="fa-solid fa-person mr-2 text-blue-400"></i>Biometric Mapping
          </p>
          <HumanBodySVG hasFever={vitals.hasFeverHistory} />
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-sm">
              <p className="text-[9px] text-slate-400 font-bold uppercase">Heart</p>
              <p className="text-rose-500 font-bold text-base">{vitals.heartRate} <span className="text-[9px] text-slate-400">bpm</span></p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-sm">
              <p className="text-[9px] text-slate-400 font-bold uppercase">Temp</p>
              <p className={`font-bold text-base ${vitals.hasFeverHistory ? "text-red-500" : "text-blue-600"}`}>{vitals.temperature}°C</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <VitalCard icon="fa-solid fa-bolt"           iconColor="text-blue-600"  bg="bg-blue-50 border-blue-100"    label="Blood Pressure" value={`${vitals.systolicBP}/${vitals.diastolicBP}`} unit="mmHg" />
            <VitalCard icon="fa-solid fa-droplet"        iconColor="text-blue-500"  bg="bg-blue-50/50 border-blue-50"  label="SpO2"           value={vitals.spo2}            unit="%" />
            <VitalCard icon="fa-solid fa-syringe"        iconColor="text-blue-400"  bg="bg-slate-50 border-slate-100"  label="Blood Sugar"    value={vitals.bloodSugar}      unit="mg/dL" />
            <VitalCard icon="fa-solid fa-lungs"          iconColor="text-blue-600"  bg="bg-blue-50 border-blue-100"    label="Respiration"    value={vitals.respirationRate} unit="br/min" />
            <VitalCard icon="fa-solid fa-weight-scale"   iconColor="text-slate-600" bg="bg-slate-100 border-slate-200" label="Weight"         value={vitals.weight}          unit="kg" />
            <VitalCard icon="fa-solid fa-ruler-vertical" iconColor="text-slate-500" bg="bg-slate-50 border-slate-200"  label="Height"         value={vitals.height}          unit="cm" />
          </div>
          {vitals.ambulationHistory && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                <i className="fa-solid fa-clipboard-list mr-2 text-blue-400"></i>Observations
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">{vitals.ambulationHistory}</p>
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            <span className="px-4 py-1.5 rounded-xl border bg-blue-50 border-blue-100 text-blue-600 text-xs font-bold uppercase">
              <i className="fa-solid fa-droplet mr-2"></i>Blood: {vitals.bloodGroup?.replace("_", " ")}
            </span>
            {vitals.hasFeverHistory && (
              <span className="px-4 py-1.5 rounded-xl border bg-red-50 border-red-200 text-red-600 text-xs font-bold uppercase animate-pulse">
                <i className="fa-solid fa-fire mr-2"></i>Fever Alert
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CREATE MODE — with inline error display
// submitError is passed in so the ErrorBanner renders inside the card
// hasError on FormInput turns the input border red
// ============================================================
function CreateModeWorkspace({ record, formData, setFormData, isSubmitting, onSubmit, onClose, submitError, onDismissError }: any) {
  const set = (field: string, val: any) => setFormData({ ...formData, [field]: val });

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-blue-600 text-white">
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-stethoscope text-lg"></i>
          <span className="font-bold">Input Clinical Vitals — #REC-{record.id}</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Body preview */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-100 flex flex-col items-center justify-center p-10 gap-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">
            <i className="fa-solid fa-person mr-2 text-blue-400"></i>Biometric Preview
          </p>
          <HumanBodySVG hasFever={formData.hasFeverHistory} />
        </div>

        {/* Form */}
        <div className="lg:col-span-8 p-8">

          {/* Error banner inside the form — shown after failed submit */}
          {submitError && (
            <div className="mb-6">
              <ErrorBanner error={submitError} onDismiss={onDismissError} />
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* hasError prop highlights the input red if the field matches the error */}
              <FormInput label="Systolic BP"      icon="fa-solid fa-bolt"             type="number"        value={formData.systolicBP}      onChange={(v: string) => set("systolicBP", +v)}      hasError={submitError?.field === "systolicBP"} />
              <FormInput label="Diastolic BP"     icon="fa-solid fa-bolt"             type="number"        value={formData.diastolicBP}     onChange={(v: string) => set("diastolicBP", +v)}     hasError={submitError?.field === "diastolicBP"} />
              <FormInput label="Heart Rate"       icon="fa-solid fa-heart-pulse"      type="number"        value={formData.heartRate}       onChange={(v: string) => set("heartRate", +v)}       hasError={submitError?.field === "heartRate"} />
              <FormInput label="SpO2 (%)"         icon="fa-solid fa-droplet"          type="number"        value={formData.spo2}            onChange={(v: string) => set("spo2", +v)}            hasError={submitError?.field === "spo2"} />
              <FormInput label="Temperature (°C)" icon="fa-solid fa-temperature-half" type="number" step="0.1" value={formData.temperature} onChange={(v: string) => set("temperature", +v)}    hasError={submitError?.field === "temperature"} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  <i className="fa-solid fa-droplet mr-2 text-blue-500"></i>Blood Group
                </label>
                <select value={formData.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none">
                  {BLOOD_GROUPS.map(bg => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
                </select>
              </div>
              <FormInput label="Weight (kg)"      icon="fa-solid fa-weight-scale"     type="number" step="0.1" value={formData.weight}      onChange={(v: string) => set("weight", +v)}          hasError={submitError?.field === "weight"} />
              <FormInput label="Height (cm)"      icon="fa-solid fa-ruler-vertical"   type="number"        value={formData.height}          onChange={(v: string) => set("height", +v)}          hasError={submitError?.field === "height"} />
            </div>

            {/* Notes textarea — turns red if "ambulationHistory" is the error field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <i className="fa-solid fa-clipboard-list mr-1 text-blue-500"></i> Clinical Notes
                {submitError?.field === "ambulationHistory" && (
                  <span className="ml-1 text-red-500 normal-case font-semibold text-[10px]">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i>Required
                  </span>
                )}
              </label>
              <textarea rows={3} placeholder="Enter observations, notes, or remarks..."
                value={formData.ambulationHistory} onChange={(e) => set("ambulationHistory", e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 placeholder-slate-300 resize-none transition-all ${
                  submitError?.field === "ambulationHistory"
                    ? "bg-red-50 border border-red-300 text-slate-700 focus:ring-red-300"
                    : "bg-slate-50 border border-slate-200 text-slate-700 focus:ring-blue-400"
                }`}
              />
            </div>

            {/* Fever toggle + Submit */}
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => set("hasFeverHistory", !formData.hasFeverHistory)}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  formData.hasFeverHistory
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-400"
                }`}>
                <i className={`fa-solid ${formData.hasFeverHistory ? "fa-fire" : "fa-circle"}`}></i>
                {formData.hasFeverHistory ? "Fever History: Active" : "No Fever History"}
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-[2] bg-blue-600 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2">
                {isSubmitting
                  ? <><i className="fa-solid fa-spinner animate-spin"></i> Processing...</>
                  : <><i className="fa-solid fa-floppy-disk"></i> Synchronize Vitals</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RECORDS TABLE
// ============================================================
function RecordsTable({ records, selectedId, onOpen }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-4">
        <i className="fa-solid fa-timeline text-blue-600"></i> Clinical Timeline
        <div className="flex-1 h-px bg-slate-200"></div>
      </h2>
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
              <th className="text-left px-10 py-6">Medical Reference</th>
              <th className="text-center px-10 py-6">Clinical Team</th>
              <th className="text-center px-10 py-6">Status</th>
              <th className="text-right px-10 py-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((rec: any) => (
              <tr key={rec.id} className={`transition-colors ${selectedId === rec.id ? "bg-blue-50/50" : "hover:bg-slate-50"}`}>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedId === rec.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"}`}>
                      <i className="fa-solid fa-file-waveform text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Created: {rec.createdDate || "Mar 2026"}</p>
                      <p className="text-lg font-black text-slate-800 leading-none">#REC-{rec.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6 text-center space-x-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold border border-blue-100 uppercase tracking-widest">
                    <i className="fa-solid fa-user-doctor mr-1"></i>Dr {rec.doctorId}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold border border-slate-200 uppercase tracking-widest">
                    <i className="fa-solid fa-user-nurse mr-1"></i>Ns {rec.nurseId}
                  </span>
                </td>
                <td className="px-10 py-6 text-center">
                  {rec.vitalId
                    ? <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1"><i className="fa-solid fa-circle-check"></i> Logged</span>
                    : <span className="text-slate-300 font-bold text-[10px] uppercase italic">Pending</span>
                  }
                </td>
                <td className="px-10 py-6 text-right">
                  <button onClick={() => onOpen(rec)}
                    className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${selectedId === rec.id ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white"}`}>
                    {selectedId === rec.id
                      ? <><i className="fa-solid fa-eye mr-2"></i>Active</>
                      : <><i className="fa-solid fa-folder-open mr-2"></i>Open</>
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// VITAL CARD
// ============================================================
function VitalCard({ icon, iconColor, bg, label, value, unit }: any) {
  return (
    <div className={`border rounded-[1.5rem] p-5 space-y-3 transition-all hover:shadow-md ${bg}`}>
      <i className={`${icon} ${iconColor} text-lg`}></i>
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-slate-800 font-black text-lg leading-none">{value}<span className="text-slate-400 text-xs font-medium ml-1">{unit}</span></p>
      </div>
    </div>
  );
}

// ============================================================
// FORM INPUT
// hasError = true → red border + warning icon on label
// ============================================================
function FormInput({ label, icon, type, step, value, onChange, hasError }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
        <i className={`${icon} text-blue-500`}></i> {label}
        {hasError && <i className="fa-solid fa-triangle-exclamation text-red-400 text-[9px] ml-1"></i>}
      </label>
      <input required type={type} step={step} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 outline-none transition-all ${
          hasError
            ? "bg-red-50 border border-red-300 text-slate-800 focus:ring-red-300"
            : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-blue-400"
        }`}
      />
    </div>
  );
}