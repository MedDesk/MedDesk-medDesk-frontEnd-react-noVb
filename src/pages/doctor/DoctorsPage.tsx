import { useState, useEffect } from "react";
import DoctorForm from "./DoctorForm";
import { type CreateDoctorRequest } from "../../types/Doctor";
import { getDoctors, createDoctor, deleteDoctor } from "../../services/doctorService";
import { useNavigate } from "react-router-dom"; // Cleaned up imports

// ─── Types ────────────────────────────────────────────────────────────────────
interface DoctorDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  specialist: string;
  license_number: string;
  address: string;
}

// ─── Specialty Mapping ────────────────────────────────────────────────────────
const SPEC_MAP: Record<string, { color: string; bg: string; icon: string; border: string }> = {
  CARDIOLOGY: { color: "text-rose-600", bg: "bg-rose-50", icon: "fa-heart-pulse", border: "group-hover:border-rose-200" },
  NEUROLOGY: { color: "text-purple-600", bg: "bg-purple-50", icon: "fa-brain", border: "group-hover:border-purple-200" },
  PEDIATRICS: { color: "text-amber-600", bg: "bg-amber-50", icon: "fa-baby", border: "group-hover:border-amber-200" },
  GENERAL_PRACTICE: { color: "text-blue-600", bg: "bg-blue-50", icon: "fa-stethoscope", border: "group-hover:border-blue-200" },
  ORTHOPEDICS: { color: "text-cyan-600", bg: "bg-cyan-50", icon: "fa-bone", border: "group-hover:border-cyan-200" },
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getDoctors(0, 100);
      setDoctors(response.data.content || []);
    } catch (error) {
      console.error("Failed to load doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreateDoctor = async (data: CreateDoctorRequest) => {
    try {
      await createDoctor(data);
      setIsModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert("Error creating doctor.");
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        alert("Error deleting doctor.");
      }
    }
  };

  const filtered = doctors.filter(
    (d) =>
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      d.specialist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medical Staff</h1>
          <p className="text-slate-500 font-medium text-sm italic">Dedicated specialists at your service</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              className="pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white w-64 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm shadow-sm"
              placeholder="Search name or specialty..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i> Add Doctor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Staff...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((doc) => (
            <DoctorCard 
              key={doc.id} 
              doctor={doc} 
              onDelete={() => handleDeleteDoctor(doc.id)} 
            />
          ))}
        </div>
      )}

      <DoctorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDoctor}
      />
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────────
function DoctorCard({ doctor, onDelete }: { doctor: DoctorDto; onDelete: () => void }) {
  // FIX: useNavigate must be called inside THIS component to be used here
  const navigate = useNavigate(); 
  
  const spec = SPEC_MAP[doctor.specialist] || SPEC_MAP.GENERAL_PRACTICE;
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div className={`group bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden ${spec.border}`}>
      <div className={`absolute top-0 left-0 w-full h-1.5 ${spec.bg}`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          {doctor.profileImage ? (
            <img src={doctor.profileImage} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white group-hover:border-blue-50 transition-all duration-500" />
          ) : (
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border-4 border-white shadow-sm bg-blue-50 text-blue-600`}>{initials}</div>
          )}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></span>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${spec.bg} ${spec.color}`}>
          <i className={`fa-solid ${spec.icon} text-sm`}></i> {doctor.specialist.replace('_', ' ')}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Dr. {doctor.firstName} {doctor.lastName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">License: {doctor.license_number}</span>
        </div>
      </div>

      <div className="space-y-3.5 mb-8">
        <ContactRow icon="fa-phone" text={doctor.phone} />
        <ContactRow icon="fa-envelope" text={doctor.email} />
        <ContactRow icon="fa-location-dot" text={doctor.address} />
      </div>

      <div className="flex gap-2 pt-6 border-t border-slate-50">
        <button 
          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2"
          onClick={() => navigate(`/dashboard/doctors/${doctor.id}`)} // FIX: Absolute path
        >
          <i className="fa-solid fa-circle-user text-xs"></i> Profile
        </button>
        <button className="w-12 h-12 bg-slate-50 hover:bg-amber-100 hover:text-amber-600 text-slate-400 rounded-2xl transition-all flex items-center justify-center">
          <i className="fa-solid fa-pen-to-square text-xs"></i>
        </button>
        <button 
          onClick={onDelete}
          className="w-12 h-12 bg-slate-50 hover:bg-red-100 hover:text-red-600 text-slate-400 rounded-2xl transition-all flex items-center justify-center"
        >
          <i className="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 group/row">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 group-hover/row:bg-blue-500 group-hover/row:text-white transition-all duration-300">
        <i className={`fa-solid ${icon} text-xs`}></i>
      </div>
      <span className="text-sm font-medium truncate tracking-tight">{text}</span>
    </div>
  );
}