import React, { useState } from 'react';
import {type CreatePatientRequest }  from '../../types/Patient';

interface Props {
  onSubmit: (data: CreatePatientRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function PatientForm({ onSubmit, onCancel, loading }: Props) {
  const [formData, setFormData] = useState<CreatePatientRequest>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    profileImage: null,
    gender: 'FEMALE',
    birthDate: '',
    address: '',
    cin: '',
    patientType: 'OUTPATIENT',
    cnss: null,
    maritalStatus: 'SINGLE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <i className="fa-solid fa-user-plus text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Register New Patient</h2>
          <p className="text-xs text-slate-400">Please fill in all medical and personal information correctly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- SECTION: PERSONAL INFORMATION --- */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
            <i className="fa-solid fa-address-card"></i> Personal Details
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="e.g. Hanan" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="e.g. Mansouri" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Birth Date</label>
              <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+212..." />
          </div>

          <div>
            <label className={labelClass}>Full Address</label>
            <textarea name="address" rows={2} value={formData.address} onChange={handleChange} className={inputClass} placeholder="Street address, City..."></textarea>
          </div>
        </div>

        {/* --- SECTION: ACCOUNT & SYSTEM INFO --- */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved"></i> Account & Identity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Username</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} className={inputClass} placeholder="hana123" />
            </div>
            <div>
              <label className={labelClass}>CIN / ID Card</label>
              <input type="text" name="cin" required value={formData.cin} onChange={handleChange} className={inputClass} placeholder="CD987..." />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="email@example.com" />
          </div>

          <div>
            <label className={labelClass}>Account Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Patient Type</label>
              <select name="patientType" value={formData.patientType} onChange={handleChange} className={inputClass}>
                <option value="INPATIENT">Inpatient</option>
                <option value="OUTPATIENT">Outpatient</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- FORM ACTIONS --- */}
      <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
          Create Patient Profile
        </button>
      </div>
    </form>
  );
}