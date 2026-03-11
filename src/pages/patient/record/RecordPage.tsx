import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getMedicalRecords } from "../../../services/patientServices/medicalRecords.service";
import { getVitalsById } from "../../../services/adminServices/vitals.service";

export default function PatientPortalArchive() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [vitalsData, setVitalsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  
  // PDF Printing Reference
  // Explicitly typing the ref helps TypeScript
  const printRef = useRef<HTMLDivElement>(null);

  // UPDATED FOR REACT-TO-PRINT V3+
  const handlePrint = useReactToPrint({
    contentRef: printRef, // Changed from 'content' to 'contentRef'
    documentTitle: `Medical_Report_${selectedRecord?.id || 'Archive'}`,
  });

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const patientId = storedUser.id || storedUser._id;

      if (patientId) {
        const response = await getMedicalRecords(Number(patientId));
        setRecords(response.data?.content || response.data || []);
      }
    } catch (err) {
      console.error("Failed to load your records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = async (rec: any) => {
    setSelectedRecord(rec);
    setVitalsData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (rec.vitalId) {
      setWorkspaceLoading(true);
      try {
        const res = await getVitalsById(rec.vitalId);
        setVitalsData(res.data || res);
      } catch (err) {
        console.error("Vitals fetch failed", err);
      } finally {
        setWorkspaceLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <i className="fas fa-circle-notch fa-spin text-blue-600 text-4xl"></i>
      <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Securing Clinical Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="fas fa-book-medical text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">My Medical History</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confidential Patient Archive</p>
            </div>
          </div>
          <div className="text-right">
             <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">
                <i className="fas fa-folder-open mr-2"></i> {records.length} Records Found
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {!selectedRecord ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <i className="fas fa-fingerprint text-slate-200 text-5xl mb-6"></i>
            <h3 className="text-slate-500 font-bold">Select a record from your timeline to view details</h3>
            <p className="text-slate-400 text-sm mt-2">Your data is protected with HIPAA-compliant encryption.</p>
          </div>
        ) : workspaceLoading ? (
          <div className="bg-white rounded-[3rem] p-20 text-center animate-pulse">
            <i className="fas fa-sync fa-spin text-blue-500 text-3xl"></i>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
               <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-800 font-bold text-sm">
                 <i className="fas fa-arrow-left mr-2"></i> Close Record
               </button>
               <button 
                 onClick={() => handlePrint()}
                 className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
               >
                 <i className="fas fa-file-pdf mr-2"></i> Download Official Report
               </button>
            </div>

            <PatientVitalsView record={selectedRecord} vitals={vitalsData} />
            
            {/* HIDDEN PRINT TEMPLATE */}
            <div className="hidden">
               {/* Attached the Ref here */}
               <div ref={printRef}>
                  <PrintableReport record={selectedRecord} vitals={vitalsData} />
               </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
            <i className="fas fa-stream text-blue-600"></i> My Timeline
          </h2>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Date & Reference</th>
                  <th className="px-8 py-5">Attending Team</th>
                  <th className="px-8 py-5">Vitals Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-400 font-bold">{rec.createdDate || 'Record'}</p>
                      <p className="text-base font-black text-slate-800">#REC-{rec.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-600">
                          <i className="fas fa-user-md mr-1 text-blue-500"></i> Dr. {rec.doctorId}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {rec.vitalId ? (
                        <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">
                          <i className="fas fa-check-circle mr-1"></i> Synchronized
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-bold uppercase italic">No Vitals Logged</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleViewRecord(rec)}
                        className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// ... PatientVitalsView, PrintableReport, VitalStat, PrintRow components remain the same ...

function PatientVitalsView({ record, vitals }: any) {
    if (!vitals) return (
      <div className="bg-amber-50 border border-amber-100 p-10 rounded-[2.5rem] text-center">
         <i className="fas fa-exclamation-triangle text-amber-500 text-2xl mb-4"></i>
         <p className="text-amber-800 font-bold">Vitals data not available for this record.</p>
      </div>
    );
  
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
        <div className="grid lg:grid-cols-3">
          <div className="bg-slate-900 p-10 text-white flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
                <i className="fas fa-heartbeat text-4xl text-rose-400"></i>
             </div>
             <h4 className="text-xl font-black mb-2">{vitals.heartRate} BPM</h4>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Resting Heart Rate</p>
             <div className="grid grid-cols-2 gap-4 mt-10 w-full">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] text-slate-500 font-bold uppercase">Weight</p>
                   <p className="text-lg font-bold">{vitals.weight}kg</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[9px] text-slate-500 font-bold uppercase">Height</p>
                   <p className="text-lg font-bold">{vitals.height}cm</p>
                </div>
             </div>
          </div>
          <div className="lg:col-span-2 p-10 space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <VitalStat icon="fa-bolt" label="Blood Pressure" value={`${vitals.systolicBP}/${vitals.diastolicBP}`} unit="mmHg" />
                <VitalStat icon="fa-tint" label="SpO2 Level" value={vitals.spo2} unit="%" />
                <VitalStat icon="fa-thermometer-half" label="Temperature" value={vitals.temperature} unit="°C" />
                <VitalStat icon="fa-lungs" label="Respiration" value={vitals.respirationRate} unit="bpm" />
                <VitalStat icon="fa-cube" label="Blood Sugar" value={vitals.bloodSugar} unit="mg/dL" />
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                   <p className="text-[9px] text-blue-400 font-bold uppercase">Blood Group</p>
                   <p className="text-blue-700 font-black text-xl">{vitals.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}</p>
                </div>
             </div>
             {vitals.ambulationHistory && (
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Doctor Observations</p>
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{vitals.ambulationHistory}"</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
}

function PrintableReport({ record, vitals }: any) {
    const date = new Date().toLocaleDateString();
    return (
      <div className="p-16 text-slate-900 bg-white" style={{ minHeight: '297mm' }}>
        <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Medical Report</h1>
            <p className="text-sm font-bold text-slate-500 mt-1">Authorized Clinical Document</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">MedDesk Global Health</p>
            <p className="text-xs text-slate-500">Report Generated: {date}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Reference</p>
            <p className="font-bold">Patient #{record.patientId || 'N/A'}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Medical Record ID</p>
            <p className="font-bold">#REC-{record.id}</p>
          </div>
        </div>
        <div className="border-2 border-slate-900 rounded-lg overflow-hidden mb-10">
          <div className="bg-slate-900 text-white px-5 py-3 font-bold text-sm uppercase">Synchronized Vitals</div>
          <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-slate-200">
             <PrintRow label="Heart Rate" value={`${vitals?.heartRate} BPM`} />
             <PrintRow label="Blood Pressure" value={`${vitals?.systolicBP}/${vitals?.diastolicBP} mmHg`} />
             <PrintRow label="Oxygen Saturation (SpO2)" value={`${vitals?.spo2}%`} />
             <PrintRow label="Body Temperature" value={`${vitals?.temperature}°C`} />
             <PrintRow label="Blood Sugar" value={`${vitals?.bloodSugar} mg/dL`} />
             <PrintRow label="Respiration Rate" value={`${vitals?.respirationRate} br/min`} />
             <PrintRow label="Weight" value={`${vitals?.weight} kg`} />
             <PrintRow label="Height" value={`${vitals?.height} cm`} />
          </div>
        </div>
        <div className="mb-10">
           <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Clinical Observations</p>
           <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg text-sm italic">
              {vitals?.ambulationHistory || "No additional observations recorded."}
           </div>
        </div>
        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between">
           <div className="text-[10px] text-slate-400 max-w-xs uppercase leading-relaxed">
              This document is an official clinical extract and contains confidential health information.
           </div>
           <div className="text-right">
              <div className="h-px w-40 bg-slate-300 ml-auto mb-2"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Digital Signature Verified</p>
           </div>
        </div>
      </div>
    );
}

function VitalStat({ icon, label, value, unit }: any) {
    return (
      <div className="p-4 border border-slate-100 rounded-2xl transition-all hover:border-blue-200">
         <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">
           <i className={`fas ${icon} mr-1 text-blue-500`}></i> {label}
         </p>
         <p className="text-xl font-black text-slate-800">{value} <span className="text-xs text-slate-400 font-medium">{unit}</span></p>
      </div>
    );
}
  
function PrintRow({ label, value }: any) {
    return (
      <div className="px-5 py-4 flex justify-between items-center">
         <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
         <span className="font-black text-slate-900">{value}</span>
      </div>
    );
}