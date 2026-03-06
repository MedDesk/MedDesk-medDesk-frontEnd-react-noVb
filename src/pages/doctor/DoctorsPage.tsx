import { useState } from "react";
// Import the form and types
import DoctorForm from "./DoctorForm";
import { type CreateDoctorRequest } from "../../types/Doctor";

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
const SPEC_MAP: Record<
  string,
  { color: string; bg: string; icon: string; border: string }
> = {
  CARDIOLOGY: {
    color: "text-rose-600",
    bg: "bg-rose-50",
    icon: "fa-heart-pulse",
    border: "group-hover:border-rose-200",
  },
  NEUROLOGY: {
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: "fa-brain",
    border: "group-hover:border-purple-200",
  },
  PEDIATRICS: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "fa-baby",
    border: "group-hover:border-amber-200",
  },
  GENERAL: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: "fa-stethoscope",
    border: "group-hover:border-blue-200",
  },
  ORTHOPEDICS: {
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    icon: "fa-bone",
    border: "group-hover:border-cyan-200",
  },
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  // 1. Added state to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doctors: DoctorDto[] = [
    {
      id: 4,
      firstName: "Mustapha",
      lastName: "Elalami",
      email: "dr.mustapha@example.com",
      phone: "+212 600-000000",
      profileImage: "https://i.pravatar.cc/150?u=mustapha",
      license_number: "DOC-2024-889-X",
      specialist: "CARDIOLOGY",
      address: "Casablanca",
    },
    {
      id: 5,
      firstName: "Sarah",
      lastName: "Mansouri",
      email: "s.mansouri@meddesk.com",
      phone: "+212 655-443322",
      profileImage: null,
      license_number: "DOC-2024-112-L",
      specialist: "NEUROLOGY",
      address: "Casablanca",
    },
    {
      id: 6,
      firstName: "Omar",
      lastName: "Benali",
      email: "o.benali@meddesk.com",
      phone: "+212 677-889900",
      profileImage: "https://i.pravatar.cc/150?u=omar",
      license_number: "DOC-2023-441-R",
      specialist: "PEDIATRICS",
      address: "Rabat",
    },
  ];

  const filtered = doctors.filter(
    (d) =>
      `${d.firstName} ${d.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      d.specialist.toLowerCase().includes(search.toLowerCase()),
  );

  // 2. Added submission handler
  const handleCreateDoctor = (data: CreateDoctorRequest) => {
    console.log("New Doctor Data:", data);
    // Add logic here to update state or refresh data from API
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Medical Staff
          </h1>
          <p className="text-slate-500 font-medium text-sm italic">
            Dedicated specialists at your service
          </p>
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

          {/* 3. Added onClick to open modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i> Add Doctor
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>

      {/* 4. Added the Form Modal component */}
      <DoctorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDoctor}
      />
    </div>
  );
}

// ─── Subcomponents (Card & Row) ──────────────────────────────────────────────
function DoctorCard({ doctor }: { doctor: DoctorDto }) {
  const spec = SPEC_MAP[doctor.specialist] || SPEC_MAP.GENERAL;
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div
      className={`group bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden ${spec.border}`}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${spec.bg}`}></div>

      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          {doctor.profileImage ? (
            <img
              src={doctor.profileImage}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white group-hover:border-blue-50 transition-all duration-500"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border-4 border-white shadow-sm bg-blue-50 text-blue-600`}
            >
              {initials}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></span>
        </div>

        <div
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${spec.bg} ${spec.color}`}
        >
          <i className={`fa-solid ${spec.icon} text-sm`}></i>{" "}
          {doctor.specialist}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          Dr. {doctor.firstName} {doctor.lastName}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
            License: {doctor.license_number}
          </span>
        </div>
      </div>

      <div className="space-y-3.5 mb-8">
        <ContactRow icon="fa-phone" text={doctor.phone} />
        <ContactRow icon="fa-envelope" text={doctor.email} />
        <ContactRow icon="fa-location-dot" text={doctor.address} />
      </div>

      <div className="flex gap-2 pt-6 border-t border-slate-50">
        <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2">
          <i className="fa-solid fa-circle-user text-xs"></i> View Profile
        </button>
        <button className="w-12 h-12 bg-slate-50 hover:bg-amber-100 hover:text-amber-600 text-slate-400 rounded-2xl transition-all flex items-center justify-center">
          <i className="fa-solid fa-pen-to-square text-xs"></i>
        </button>
        <button className="w-12 h-12 bg-slate-50 hover:bg-red-100 hover:text-red-600 text-slate-400 rounded-2xl transition-all flex items-center justify-center">
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
      <span className="text-sm font-medium truncate tracking-tight">
        {text}
      </span>
    </div>
  );
}
