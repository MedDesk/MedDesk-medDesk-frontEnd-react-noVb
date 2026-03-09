import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface VitalDto {
  medicalRecordId: number;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  respirationRate: number;
  spo2: number;
  temperature: number;
  weight: number;
  height: number;
  bloodGroup: string;
  ambulationHistory: string;
  hasFeverHistory: boolean;
  bloodSugar: number;
  recordedAt: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_RECORD = {
  id: 1,
  patient: { id: 3, name: "Ali Hassan", age: 34, gender: "Male", avatar: "https://i.pravatar.cc/150?u=ali" },
  doctor: "Dr. Mustapha Elalami",
  nurse: "Fatima Zahra",
  appointmentId: 3,
  appointmentDate: "March 06, 2026",
  vitalId: 101,
  nurseId: 1,
  doctorId: 4,
};

const MOCK_VITAL: VitalDto = {
  medicalRecordId: 1,
  systolicBP: 120,
  diastolicBP: 80,
  heartRate: 72,
  respirationRate: 16,
  spo2: 98,
  temperature: 36.6,
  weight: 75.5,
  height: 178.0,
  bloodGroup: "O_POSITIVE",
  ambulationHistory: "Patient is walking independently without assistance.",
  hasFeverHistory: false,
  bloodSugar: 95.0,
  recordedAt: "2023-10-27T10:30:00",
};

const BLOOD_GROUPS = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
];

// ─── Vital status helpers ──────────────────────────────────────────────────────
function vitalStatus(key: string, val: number): "normal" | "warning" | "critical" {
  const ranges: Record<string, [number, number]> = {
    heartRate: [60, 100], systolicBP: [90, 130], diastolicBP: [60, 85],
    spo2: [95, 100], temperature: [36.1, 37.2], bloodSugar: [70, 100],
    respirationRate: [12, 20],
  };
  const r = ranges[key];
  if (!r) return "normal";
  if (val < r[0] || val > r[1])
    return val < r[0] * 0.9 || val > r[1] * 1.1 ? "critical" : "warning";
  return "normal";
}

const NORMAL_RANGES: Record<string, string> = {
  heartRate: "60–100 bpm", systolicBP: "90–130 mmHg", spo2: "95–100%",
  temperature: "36.1–37.2°C", bloodSugar: "70–100 mg/dL",
  respirationRate: "12–20/min", diastolicBP: "60–85 mmHg",
};

// Per-status Tailwind classes
const ST = {
  normal:   { border: "border-l-green-600",  iconBg: "bg-green-50",   iconTx: "text-green-600",   pillBg: "bg-green-50",   pillTx: "text-green-600",   svg: "#16a34a", label: "Normal"   },
  warning:  { border: "border-l-amber-600",  iconBg: "bg-amber-50",   iconTx: "text-amber-600",   pillBg: "bg-amber-50",   pillTx: "text-amber-600",   svg: "#d97706", label: "Watch"    },
  critical: { border: "border-l-red-600",    iconBg: "bg-red-50",     iconTx: "text-red-600",     pillBg: "bg-red-50",     pillTx: "text-red-600",     svg: "#dc2626", label: "Critical" },
};

// shared input className
const INP = [
  "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50",
  "text-slate-800 text-sm font-medium outline-none transition-all appearance-none",
  "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100",
].join(" ");

// ─── Sparkline ─────────────────────────────────────────────────────────────────
function Spark({ color }: { color: string }) {
  const pts = [0,3,1,5,4,2,6,4,3,2,5,3,8,1,6,4,10,2,9,5,12,3]
    .reduce((acc, y, i) => acc + (i % 2 === 0 ? `${i * 5},${20 - y * 2} ` : ""), "");
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
  );
}

// ─── Body SVG Map ──────────────────────────────────────────────────────────────
function BodyMap({ onRegionClick }: { onRegionClick: (r: string) => void }) {
  const dots = [
    { id: "head",    cx: 130, cy: 55,  color: "#f59e0b" },
    { id: "chest",   cx: 130, cy: 130, color: "#ef4444" },
    { id: "abdomen", cx: 130, cy: 185, color: "#3b82f6" },
    { id: "leftarm", cx: 88,  cy: 140, color: "#8b5cf6" },
    { id: "legs",    cx: 130, cy: 265, color: "#10b981" },
  ];
  return (
    <svg viewBox="0 60 260 290" width="100%" style={{ maxWidth: 220 }}>
      <g opacity="0.18" fill="#60a5fa">
        <ellipse cx="130" cy="75"  rx="28" ry="30" />
        <rect x="120" y="103" width="20" height="14" rx="4"  />
        <rect x="90"  y="117" width="80" height="90" rx="14" />
        <rect x="66"  y="122" width="22" height="72" rx="11" />
        <rect x="172" y="122" width="22" height="72" rx="11" />
        <rect x="96"  y="207" width="30" height="95" rx="12" />
        <rect x="134" y="207" width="30" height="95" rx="12" />
      </g>
      {dots.map((d) => (
        <g key={d.id} style={{ cursor: "pointer" }} onClick={() => onRegionClick(d.id)}>
          <circle cx={d.cx} cy={d.cy} r="16" fill={d.color} opacity="0.15" />
          <circle cx={d.cx} cy={d.cy} r="10" fill={d.color} />
          <circle cx={d.cx} cy={d.cy} r="14" fill="none" stroke={d.color} strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r"       values="14;18;14"   dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5"  dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ─── Vital Card ────────────────────────────────────────────────────────────────
function VitalCard({ label, value, unit, statusKey, icon }: {
  label: string; value: number | string; unit: string; statusKey: string; icon: string;
}) {
  const numVal = typeof value === "number" ? value : parseFloat(String(value));
  const s = isNaN(numVal) ? ST.normal : ST[vitalStatus(statusKey, numVal)];

  return (
    <div className={`bg-white border border-slate-200 border-l-4 ${s.border} rounded-2xl px-4 py-3 flex items-center justify-between hover:shadow-md transition-shadow duration-150`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${s.iconBg} ${s.iconTx}`}>
          {icon}
        </div>
        <div>
          <div className="text-[0.6rem] font-semibold tracking-wider uppercase text-slate-400 mb-0.5">{label}</div>
          <div className="text-xl font-bold text-slate-800 leading-none">
            {value}<span className="text-xs font-medium text-slate-400"> {unit}</span>
          </div>
          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${s.pillBg} ${s.pillTx}`}>
            ● {s.label}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Spark color={s.svg} />
        <span className="text-[0.6rem] text-slate-400 text-right">
          Normal: {NORMAL_RANGES[statusKey] ?? ""}
        </span>
      </div>
    </div>
  );
}

// ─── Disabled meta field ───────────────────────────────────────────────────────
function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.6rem] font-semibold tracking-widest uppercase text-slate-400">{label}</span>
      <input
        value={value} disabled readOnly
        className="px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 text-xs font-medium w-full cursor-default outline-none"
      />
    </div>
  );
}

// ─── Form field wrapper ────────────────────────────────────────────────────────
function VField({ label, unit, span2, children }: {
  label: string; unit?: string; span2?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5${span2 ? " col-span-2" : ""}`}>
      <label className="text-[0.68rem] font-semibold tracking-wide text-slate-500">
        {label}{unit && <span className="text-slate-400 font-normal"> ({unit})</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Section divider label ─────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.63rem] font-bold tracking-[0.09em] uppercase text-blue-600 pt-2.5 pb-1 border-b border-blue-50 mb-1">
      {children}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MedicalRecordDetails() {
  const navigate = useNavigate();

  const [vital, setVital]               = useState<VitalDto>(MOCK_VITAL);
  const [form,  setForm]                = useState<VitalDto>(MOCK_VITAL);
  const [saved, setSaved]               = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const handleField = (k: keyof VitalDto, v: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVital(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const bmi = (vital.weight / (vital.height / 100) ** 2).toFixed(1);

  return (
    <div className="bg-slate-100 min-h-screen">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          ← Back to Records
        </button>
        <span className="font-bold text-sm text-slate-800">Medical Records</span>
        <div />
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-[320px_1fr] gap-5 px-8 py-6 max-w-[1400px] mx-auto">

        {/* ══ LEFT COL ══ */}
        <div className="flex flex-col gap-4">

          {/* Patient card */}
          <div
            className="rounded-2xl p-6 flex items-center gap-4 shadow-[0_4px_20px_rgba(37,99,235,0.25)]"
            style={{ background: "linear-gradient(135deg,#1e40af 0%,#2563eb 60%,#3b82f6 100%)" }}
          >
            <img
              src={MOCK_RECORD.patient.avatar}
              alt={MOCK_RECORD.patient.name}
              className="w-16 h-16 rounded-2xl object-cover border-[3px] border-white/30 flex-shrink-0"
            />
            <div>
              <div className="text-base font-bold text-white">{MOCK_RECORD.patient.name}</div>
              <div className="text-xs text-white/70 mt-0.5 mb-2">
                {MOCK_RECORD.patient.age} yrs · {MOCK_RECORD.patient.gender}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {vital.bloodGroup.replace("_", " ")}
                </span>
                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white/15 text-blue-100">
                  BMI {bmi}
                </span>
                {vital.hasFeverHistory && (
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-red-400/30 text-red-200">
                    Fever Hx
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Record info — disabled form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-[0.68rem] font-bold tracking-widest uppercase text-slate-400 mb-3">
              Record Info
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetaField label="Record ID"   value={`#REC-${MOCK_RECORD.id}`} />
              <MetaField label="Appointment" value={`#${MOCK_RECORD.appointmentId}`} />
              <MetaField label="Date"        value={MOCK_RECORD.appointmentDate} />
              <MetaField label="Doctor"      value={MOCK_RECORD.doctor} />
              <MetaField label="Nurse"       value={MOCK_RECORD.nurse} />
              <MetaField label="Vital ID"    value={`#${MOCK_RECORD.vitalId}`} />
            </div>
          </div>

          {/* Body map */}
          <div
            className="flex-1 rounded-2xl p-5 border border-blue-200"
            style={{ background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)" }}
          >
            <div className="text-[0.68rem] font-bold tracking-widest uppercase text-blue-500 mb-0.5">
              Body Region
            </div>
            <div className="text-[0.68rem] text-slate-400 mb-2">Click a region to update vitals</div>
            {activeRegion && (
              <span className="inline-block bg-blue-100 text-blue-700 text-[0.65rem] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                Selected: <b>{activeRegion}</b>
              </span>
            )}
            <div className="flex justify-center">
              <BodyMap onRegionClick={(r) => setActiveRegion(r === activeRegion ? null : r)} />
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-3">
              {[
                { dot: "bg-red-400",     label: "HR",   val: `${vital.heartRate} bpm` },
                { dot: "bg-blue-400",    label: "BP",   val: `${vital.systolicBP}/${vital.diastolicBP} mmHg` },
                { dot: "bg-emerald-400", label: "SpO2", val: `${vital.spo2}%` },
                { dot: "bg-amber-400",   label: "Temp", val: `${vital.temperature}°C` },
              ].map((q) => (
                <div key={q.label} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${q.dot}`} />
                  {q.label} <b>{q.val}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT COL ══ */}
        <div className="flex flex-col gap-2.5">

          {/* Vitals header */}
          <div className="flex justify-between items-start flex-wrap gap-3 mb-1">
            <div>
              <div className="text-base font-bold text-slate-800">Live Vitals</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Recorded {new Date(vital.recordedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                {vital.bloodGroup.replace(/_/g, " ")}
              </span>
              {vital.hasFeverHistory
                ? <span className="text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">Fever</span>
                : <span className="text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-600">No Fever</span>
              }
              <span className="text-[0.6rem] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                {vital.respirationRate} br/min
              </span>
            </div>
          </div>

          <VitalCard label="Heart Rate"        value={vital.heartRate}       unit="bpm"   statusKey="heartRate"       icon="♥"  />
          <VitalCard label="Blood Pressure"    value={`${vital.systolicBP}/${vital.diastolicBP}`} unit="mmHg" statusKey="systolicBP" icon="⚡" />
          <VitalCard label="Temperature"       value={vital.temperature}     unit="°C"    statusKey="temperature"     icon="🌡" />
          <VitalCard label="SpO2"              value={vital.spo2}            unit="%"     statusKey="spo2"            icon="💧" />
          <VitalCard label="Blood Sugar"       value={vital.bloodSugar}      unit="mg/dL" statusKey="bloodSugar"      icon="🩸" />
          <VitalCard label="Respiration Rate"  value={vital.respirationRate} unit="/min"  statusKey="respirationRate" icon="🫁" />

          {/* Ambulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
            <div className="text-[0.63rem] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
              Ambulation Notes
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{vital.ambulationHistory}</p>
            <div className="text-[0.65rem] text-slate-400 mt-1.5">
              Recorded {new Date(vital.recordedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Vitals Entry Form ── */}
      <div className="bg-white border-t border-slate-200 px-8 py-8 max-w-[1400px] mx-auto w-full">

        <div className="flex justify-between items-center flex-wrap gap-4 mb-7">
          <div>
            <div className="text-lg font-bold text-slate-800">Enter / Update Vitals</div>
            <div className="text-xs text-slate-400 mt-0.5">Submit new vital readings for this patient</div>
          </div>
          {saved && (
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-semibold">
              ✓ Vitals saved successfully
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-2">

          {/* Cardiovascular */}
          <SectionLabel>Cardiovascular</SectionLabel>
          <div className="grid grid-cols-4 gap-3.5 mb-2">
            <VField label="Systolic BP" unit="mmHg">
              <input type="number" className={INP} value={form.systolicBP} min={50} max={250}
                onChange={(e) => handleField("systolicBP", +e.target.value)} />
            </VField>
            <VField label="Diastolic BP" unit="mmHg">
              <input type="number" className={INP} value={form.diastolicBP} min={30} max={150}
                onChange={(e) => handleField("diastolicBP", +e.target.value)} />
            </VField>
            <VField label="Heart Rate" unit="bpm">
              <input type="number" className={INP} value={form.heartRate} min={30} max={220}
                onChange={(e) => handleField("heartRate", +e.target.value)} />
            </VField>
            <VField label="Respiration Rate" unit="/min">
              <input type="number" className={INP} value={form.respirationRate} min={5} max={50}
                onChange={(e) => handleField("respirationRate", +e.target.value)} />
            </VField>
          </div>

          {/* Metabolic */}
          <SectionLabel>Metabolic</SectionLabel>
          <div className="grid grid-cols-4 gap-3.5 mb-2">
            <VField label="SpO2" unit="%">
              <input type="number" className={INP} value={form.spo2} min={50} max={100} step={0.1}
                onChange={(e) => handleField("spo2", +e.target.value)} />
            </VField>
            <VField label="Temperature" unit="°C">
              <input type="number" className={INP} value={form.temperature} min={34} max={42} step={0.1}
                onChange={(e) => handleField("temperature", +e.target.value)} />
            </VField>
            <VField label="Blood Sugar" unit="mg/dL">
              <input type="number" className={INP} value={form.bloodSugar} min={20} max={600} step={0.1}
                onChange={(e) => handleField("bloodSugar", +e.target.value)} />
            </VField>
            <VField label="Blood Group">
              <select className={`${INP} cursor-pointer`} value={form.bloodGroup}
                onChange={(e) => handleField("bloodGroup", e.target.value)}>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg.replace("_", " ")}</option>
                ))}
              </select>
            </VField>
          </div>

          {/* Anthropometric */}
          <SectionLabel>Anthropometric</SectionLabel>
          <div className="grid grid-cols-4 gap-3.5 mb-2">
            <VField label="Weight" unit="kg">
              <input type="number" className={INP} value={form.weight} min={1} max={500} step={0.1}
                onChange={(e) => handleField("weight", +e.target.value)} />
            </VField>
            <VField label="Height" unit="cm">
              <input type="number" className={INP} value={form.height} min={50} max={250} step={0.1}
                onChange={(e) => handleField("height", +e.target.value)} />
            </VField>
            <VField label="Recorded At" span2>
              <input type="datetime-local" className={INP} value={form.recordedAt.slice(0, 16)}
                onChange={(e) => handleField("recordedAt", e.target.value + ":00")} />
            </VField>
          </div>

          {/* Clinical Notes */}
          <SectionLabel>Clinical Notes</SectionLabel>
          <div className="grid grid-cols-4 gap-3.5 mb-2">
            <VField label="Ambulation History" span2>
              <textarea
                className={`${INP} resize-y min-h-[80px] leading-relaxed`}
                rows={3}
                value={form.ambulationHistory}
                onChange={(e) => handleField("ambulationHistory", e.target.value)}
              />
            </VField>
            <VField label="Fever History">
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleField("hasFeverHistory", !form.hasFeverHistory)}
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center flex-shrink-0 border-none cursor-pointer transition-all duration-200 ${
                    form.hasFeverHistory ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow block" />
                </button>
                <span className="text-sm text-slate-500 font-medium">
                  {form.hasFeverHistory ? "Yes — fever history" : "No fever history"}
                </span>
              </div>
            </VField>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setForm(vital); setSaved(false); }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-transparent text-slate-500 font-semibold text-sm cursor-pointer hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl border-none text-white font-bold text-sm cursor-pointer flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}
            >
              Save Vitals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
