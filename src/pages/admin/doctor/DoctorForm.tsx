import React, { useState } from 'react';
import { type CreateDoctorRequest, type SpecialistType } from '../../../types/Doctor'; 

interface DoctorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDoctorRequest) => void;
}

const SPECIALTIES: SpecialistType[] = [
  'CARDIOLOGY', 'DERMATOLOGY', 'NEUROLOGY', 'PEDIATRICS', 'GENERAL_PRACTICE', 'OTHER'
];

export default function DoctorForm({ isOpen, onClose, onSubmit }: DoctorFormProps) {
  const [formData, setFormData] = useState<CreateDoctorRequest>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    profileImage: null,
    gender: 'MALE',
    birthDate: '',
    address: '',
    cin: '',
    emergency_contact: '',
    license_number: '',
    specialist: 'GENERAL_PRACTICE',
  });

  
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Doctor</h2>
            <p className="text-slate-500 text-sm font-medium">Register a new medical specialist to the platform</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" name="firstName" icon="fa-user" value={formData.firstName} onChange={handleChange} required />
                <FormInput label="Last Name" name="lastName" icon="fa-user" value={formData.lastName} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Gender</label>
                    <div className="relative">
                        <i className="fa-solid fa-venus-mars absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium appearance-none"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                </div>
                <FormInput label="Birth Date" name="birthDate" type="date" icon="fa-calendar" value={formData.birthDate} onChange={handleChange} required />
              </div>

              <FormInput label="CIN (Identity Number)" name="cin" icon="fa-id-card" value={formData.cin} onChange={handleChange} required />
              <FormInput label="Address" name="address" icon="fa-location-dot" value={formData.address} onChange={handleChange} required />
            </div>

            {/* Professional & Contact Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Professional Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Email" name="email" type="email" icon="fa-envelope" value={formData.email} onChange={handleChange} required />
                <FormInput label="Phone" name="phone" icon="fa-phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Username" name="username" icon="fa-at" value={formData.username} onChange={handleChange} required />
                <FormInput label="Password" name="password" type="password" icon="fa-lock" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Specialist Field</label>
                    <div className="relative">
                        <i className="fa-solid fa-stethoscope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <select 
                            name="specialist" 
                            value={formData.specialist} 
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium appearance-none"
                        >
                            {SPECIALTIES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <FormInput label="License Number" name="license_number" icon="fa-certificate" value={formData.license_number} onChange={handleChange} required />
              </div>

              <FormInput label="Emergency Contact" name="emergency_contact" icon="fa-truck-medical" value={formData.emergency_contact} onChange={handleChange} required />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex gap-4 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Create Doctor Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Sub-component for form inputs
function FormInput({ label, icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <i className={`fa-solid ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm`}></i>
        <input 
          {...props}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );
}