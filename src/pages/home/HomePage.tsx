import React, { useState, useEffect } from "react";
import {
  Zap,
  ArrowUpRight,
  Stethoscope,
  Award,
  Users,
  Clock,
  Brain,
  Activity,
  Heart,
  Linkedin,
  Twitter,
  Mail,
  Menu,
  X,
  CheckCircle2,
  ShieldCheck,
  Microscope,
  PhoneCall,
  CalendarCheck,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Configuration ─────────────────────────────────────────────────────────
const stats = [
  { icon: <Award size={18} />, value: "490", label: "Awards" },
  { icon: <Users size={18} />, value: "6,700+", label: "Patients" },
  { icon: <Clock size={18} />, value: "22 Years", label: "Experience" },
];

const services = [
  {
    icon: <Brain size={32} />,
    title: "Brain Health Check",
    desc: "Comprehensive neurological assessments and cognitive testing using latest tech.",
    dark: false,
    color: "blue",
  },
  {
    icon: <Activity size={32} />,
    title: "Liver Function Test",
    desc: "Complete hepatic panel with advanced biomarker analysis and screening.",
    dark: false,
    color: "emerald",
  },
  {
    icon: <Heart size={32} fill="currentColor" />,
    title: "Kidney Health Scan",
    desc: "Renal imaging and function evaluation for early detection of issues.",
    dark: true,
    color: "rose",
  },
];

const doctors = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Neurologist",
    exp: "14 yrs exp",
    img: "https://i.pinimg.com/1200x/48/3a/61/483a616311979852c5b39993f6e0a752.jpg",
    rating: "4.9",
  },
  {
    name: "Dr. James Okafor",
    role: "Cardiologist",
    exp: "18 yrs exp",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=350",
    rating: "4.8",
  },
  {
    name: "Dr. Lena Vasquez",
    role: "Radiologist",
    exp: "11 yrs exp",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=350",
    rating: "4.9",
  },
  {
    name: "Dr. Tom Nguyen",
    role: "Nephrologist",
    exp: "16 yrs exp",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=350",
    rating: "4.7",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function MedDesk() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">
      {/* ── Fonts & Global Styles ─────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
          
          * { font-family: 'Manrope', sans-serif; }
          h1, h2, h3, h4, .font-display { font-family: 'Syne', sans-serif; }

          :root {
            --blue: #1D6BF3;
            --blue-dark: #1251C5;
            --blue-light: #EEF4FF;
            --teal: #0ABFBC;
            --slate-bg: #F7F9FC;
          }

          .hero-title { 
            letter-spacing: -0.05em; 
            line-height: 0.88; 
          }
          
          .glass { 
            background: rgba(255,255,255,0.72); 
            backdrop-filter: blur(20px); 
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.5); 
          }

          .mesh-bg {
            background: 
              radial-gradient(ellipse 80% 60% at 20% 40%, rgba(29,107,243,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 20%, rgba(10,191,188,0.06) 0%, transparent 60%),
              #F7F9FC;
          }

          .cta-gradient {
            background: linear-gradient(135deg, #1D6BF3 0%, #0ABFBC 100%);
          }
          
          .card-hover {
            transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 24px 60px -12px rgba(29,107,243,0.18);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1.5deg); }
          }
          .float { animation: float 5s ease-in-out infinite; }

          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.7; }
            70% { transform: scale(1.08); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
          }
          .pulse-ring::before {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 2px solid rgba(29,107,243,0.4);
            animation: pulse-ring 2.5s ease-out infinite;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.7s ease forwards; }
          .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
          .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
          .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
          .fade-up-4 { animation-delay: 0.55s; opacity: 0; }

          .nav-link {
            position: relative;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--blue);
            border-radius: 99px;
            transition: width 0.25s ease;
          }
          .nav-link:hover::after { width: 100%; }

          .doc-card img { transition: transform 0.6s cubic-bezier(.4,0,.2,1); }
          .doc-card:hover img { transform: scale(1.07); }
          .doc-card .overlay { opacity: 0; transition: opacity 0.4s ease; }
          .doc-card:hover .overlay { opacity: 1; }
          .doc-card .socials { transform: translateY(12px); transition: transform 0.4s ease; }
          .doc-card:hover .socials { transform: translateY(0); }

          .appt-btn {
            background: linear-gradient(135deg, #1D6BF3, #0ABFBC);
            background-size: 200%;
            transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.3s ease;
          }
          .appt-btn:hover {
            background-position: right center;
            transform: translateY(-2px);
            box-shadow: 0 20px 50px -10px rgba(29,107,243,0.5);
          }
          .appt-btn:active { transform: scale(0.97); }

          .tag-pill {
            background: linear-gradient(135deg, rgba(29,107,243,0.08), rgba(10,191,188,0.08));
            border: 1px solid rgba(29,107,243,0.15);
          }
        `,
        }}
      />

      {/* ── Navigation ────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 px-6 lg:px-16 py-4 flex items-center justify-between ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-sm shadow-blue-100/50 border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-[#1D6BF3] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "Syne, sans-serif" }}>
            Med<span className="text-[#1D6BF3]">Desk</span>
          </span>
        </div>

        <ul className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-500">
          {["Home", "About", "Departments", "Doctors"].map((item) => (
            <li key={item}>
              <a href="#" className="nav-link hover:text-slate-900 transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-[14px] font-bold text-slate-500 hover:text-[#1D6BF3] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2.5 text-[14px] font-bold text-[#1D6BF3] border border-blue-200 rounded-full hover:bg-blue-50 transition-all"
            >
              Create Account
            </button>
          </div>

          <button
            onClick={() => navigate("/clinic-schedule")}
            className="appt-btn text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"
          >
            <CalendarCheck size={16} />
            <span className="hidden sm:block">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </button>

          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-bold text-slate-700">
          {["Home", "About", "Departments", "Doctors"].map((item) => (
            <a key={item} href="#" className="hover:text-[#1D6BF3] transition-colors" onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <button
            onClick={() => { navigate("/clinic-schedule"); setMenuOpen(false); }}
            className="appt-btn text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mt-4"
          >
            <CalendarCheck size={20} /> Book Appointment
          </button>
        </div>
      )}

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="mesh-bg relative px-6 lg:px-20 pt-12 pb-28 lg:pt-20 lg:pb-36 grid lg:grid-cols-2 gap-16 items-center max-w-[1440px] mx-auto overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

        {/* Left */}
        <div className="space-y-8 text-center lg:text-left z-10 relative">
          <div className="fade-up fade-up-1 inline-flex items-center gap-2 tag-pill text-[#1D6BF3] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="fill-blue-400 text-blue-400" /> Fast Treatment Available
          </div>

          <h1 className="fade-up fade-up-2 hero-title text-[clamp(5rem,12vw,10rem)] font-black text-slate-900">
            QUICK{" "}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: "3px #1D6BF3",
                color: "transparent",
              }}
            >
              SMART
            </span>
            <br />
            MEDIC
          </h1>

          <p className="fade-up fade-up-3 text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            MedDesk is your destination for world-class treatments, compassionate
            doctors, and precise diagnostics — all under one roof.
          </p>

          <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
            {/* Primary CTA */}
            <button
              onClick={() => navigate("/clinic-schedule")}
              className="appt-btn text-white px-10 py-5 rounded-2xl text-[17px] font-bold flex items-center gap-3 shadow-2xl shadow-blue-300/40"
            >
              <CalendarCheck size={22} />
              Book an Appointment
            </button>

            {/* Secondary */}
            <button className="group flex items-center gap-3 text-slate-500 font-bold text-[15px] hover:text-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm">
                <ChevronRight size={18} className="text-[#1D6BF3]" />
              </div>
              Explore Services
            </button>
          </div>

          {/* Social proof */}
          <div className="fade-up fade-up-4 flex items-center gap-4 justify-center lg:justify-start pt-2">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="user"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-[13px] font-bold text-slate-400">+2k Patients last month</p>
            </div>
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="relative flex justify-center items-center">
          <div className="w-[280px] h-[280px] md:w-[520px] md:h-[520px] relative flex items-center justify-center">
            {/* Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-100/60 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute inset-8 rounded-full border border-dashed border-blue-200/50 animate-spin" style={{ animationDuration: "35s", animationDirection: "reverse" }} />

            {/* Center circle */}
            <div className="w-[220px] h-[220px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-tr from-blue-50 to-[#EEF8FF] flex items-center justify-center shadow-2xl shadow-blue-100/50">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(#1D6BF3_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.06]" />
              <Stethoscope size={180} strokeWidth={0.8} className="text-blue-300 animate-pulse" style={{ animationDuration: "3s" }} />
            </div>

            {/* Floating stat chips */}
            {stats.map((s, i) => (
              <div
                key={i}
                className="glass absolute px-4 py-3.5 rounded-[22px] shadow-xl shadow-blue-100/60 flex items-center gap-3 float"
                style={{
                  top: i === 0 ? "4%" : i === 1 ? "50%" : "84%",
                  right: i === 0 ? "2%" : i === 1 ? "-8%" : "auto",
                  left: i === 2 ? "2%" : "auto",
                  animationDelay: `${i * 1.6}s`,
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#1D6BF3] text-white flex items-center justify-center shadow-md shadow-blue-200">
                  {s.icon}
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight" style={{ fontFamily: "Syne" }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Appointment CTA Banner ────────────────────────── */}
      <section className="px-6 lg:px-20 max-w-[1440px] mx-auto -mt-6 mb-16 relative z-20">
        <div
          className="rounded-[32px] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #1D6BF3 0%, #0ABFBC 100%)" }}
        >
          {/* Decorative */}
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute left-1/2 bottom-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2" />

          <div className="flex items-center gap-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <CalendarCheck size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white" style={{ fontFamily: "Syne" }}>
                Ready to See a Specialist?
              </h3>
              <p className="text-blue-100 text-sm font-medium mt-1">
                Pick a time that works for you — online booking, instant confirmation.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 shrink-0">
            <div className="flex items-center gap-3 text-white/80 text-sm font-semibold">
              <CheckCircle2 size={16} className="text-white" /> Same-day appointments available
            </div>
            <button
              onClick={() => navigate("/clinic-schedule")}
              className="bg-white text-[#1D6BF3] font-black px-8 py-4 rounded-2xl text-sm flex items-center gap-2 hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:scale-97"
            >
              <CalendarCheck size={18} /> Schedule Now
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ─────────────────────────────────────── */}
      <div className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-30 grayscale">
          {["HEALTHLINE", "MEDICARE", "PHARMA-CO", "GLOBAL HEALTH"].map((brand) => (
            <span key={brand} className="text-xl font-black tracking-wider" style={{ fontFamily: "Syne" }}>
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ── Services Section ───────────────────────────────── */}
      <section className="px-6 lg:px-20 py-24 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <p className="text-xs font-black text-[#1D6BF3] uppercase tracking-widest">What We Offer</p>
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "Syne" }}>
              Our Health Services
            </h2>
            <p className="text-slate-500 max-w-md font-medium leading-relaxed">
              Tailored medical solutions designed for your specific needs using state-of-the-art diagnostic equipment.
            </p>
          </div>
          <button className="text-[#1D6BF3] font-bold flex items-center gap-2 group hover:gap-4 transition-all text-sm">
            View All Departments
            <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className={`card-hover group relative p-10 rounded-[40px] border ${
                s.dark
                  ? "bg-slate-900 text-white border-transparent shadow-2xl"
                  : "bg-white hover:border-blue-100 border-slate-100 shadow-sm"
              }`}
            >
              {/* Tag */}
              <div
                className={`absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  s.dark ? "bg-white/10 text-white/60" : "tag-pill text-[#1D6BF3]"
                }`}
              >
                Popular
              </div>

              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${
                  s.dark
                    ? "bg-gradient-to-br from-[#1D6BF3] to-[#0ABFBC] shadow-xl"
                    : "bg-blue-50 text-[#1D6BF3]"
                }`}
              >
                {s.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ fontFamily: "Syne" }}>
                {s.title}
              </h3>
              <p className={`mb-8 text-[15px] leading-relaxed font-medium ${s.dark ? "text-slate-400" : "text-slate-500"}`}>
                {s.desc}
              </p>

              <button
                onClick={() => navigate("/clinic-schedule")}
                className={`flex items-center gap-2 text-sm font-black transition-all group/btn ${
                  s.dark
                    ? "text-[#0ABFBC] hover:text-white"
                    : "text-[#1D6BF3] hover:text-[#1251C5]"
                }`}
              >
                Book this service
                <ArrowUpRight
                  size={18}
                  className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Doctors Section ───────────────────────────────── */}
      <section className="px-6 lg:px-20 py-28 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 space-y-5">
            <p className="text-[#1D6BF3] font-black tracking-widest text-xs uppercase">Certified Experts</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Syne" }}>
              Meet Our Specialists
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#1D6BF3] to-[#0ABFBC] mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, i) => (
              <div
                key={i}
                className="doc-card group overflow-hidden rounded-[36px] bg-[#F7F9FC] border border-slate-100 transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(29,107,243,0.15)]"
              >
                <div className="relative h-[340px] overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-7">
                    <div className="socials flex justify-center gap-3">
                      {[Linkedin, Twitter, Mail].map((Icon, j) => (
                        <a
                          key={j}
                          href="#"
                          className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl text-white hover:bg-[#1D6BF3] transition-colors flex items-center justify-center"
                        >
                          <Icon size={17} />
                        </a>
                      ))}
                    </div>
                  </div>
                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-black text-slate-700">{doc.rating}</span>
                  </div>
                </div>
                <div className="p-7 bg-white">
                  <h4 className="text-[17px] font-bold text-slate-900 mb-0.5" style={{ fontFamily: "Syne" }}>
                    {doc.name}
                  </h4>
                  <p className="text-[#1D6BF3] font-bold text-xs mb-3 uppercase tracking-wider">{doc.role}</p>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-slate-400 text-xs font-bold">
                      <Clock size={11} /> {doc.exp}
                    </div>
                    <button
                      onClick={() => navigate("/clinic-schedule")}
                      className="w-9 h-9 rounded-xl bg-blue-50 text-[#1D6BF3] hover:bg-[#1D6BF3] hover:text-white transition-all flex items-center justify-center"
                    >
                      <CalendarCheck size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book CTA below doctors */}
          <div className="mt-14 text-center">
            <button
              onClick={() => navigate("/clinic-schedule")}
              className="appt-btn inline-flex items-center gap-3 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-300/40"
            >
              <CalendarCheck size={22} />
              Schedule with a Specialist
              <ArrowUpRight size={20} />
            </button>
            <p className="text-slate-400 text-sm font-medium mt-4">
              No waiting lines · Online booking · Instant confirmation
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section className="px-6 lg:px-20 py-24 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
          <div className="p-8 rounded-[36px] text-white space-y-4 mt-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1D6BF3, #0ABFBC)" }}>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <ShieldCheck size={38} strokeWidth={1.5} className="relative z-10" />
            <h4 className="text-xl font-bold relative z-10" style={{ fontFamily: "Syne" }}>Secure Care</h4>
            <p className="text-sm text-blue-100 leading-relaxed relative z-10">
              Your health records are encrypted and handled with 100% privacy.
            </p>
          </div>
          <div className="p-8 bg-white rounded-[36px] border border-slate-100 space-y-4 shadow-xl shadow-slate-200/40 card-hover">
            <Microscope size={38} className="text-[#1D6BF3]" strokeWidth={1.5} />
            <h4 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Syne" }}>Modern Labs</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              We use AI-driven diagnostics for 99.9% result accuracy.
            </p>
          </div>
          <div className="col-span-2 p-8 bg-white rounded-[36px] border border-slate-100 flex items-center gap-7 shadow-xl shadow-slate-200/40 card-hover">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={34} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "Syne" }}>
                ISO Certified Hospital
              </h4>
              <p className="text-slate-500 font-medium text-sm">Global standards in hygiene and medical protocol.</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <p className="text-xs font-black text-[#1D6BF3] uppercase tracking-widest">Why MedDesk</p>
          <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight" style={{ fontFamily: "Syne" }}>
            We Care For Your Health With Best Specialists.
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Our facility combines high-quality equipment with a welcoming environment. Every patient deserves a personalized care plan.
          </p>
          <ul className="space-y-4">
            {["Over 500+ Qualified Doctors", "24/7 Emergency Support", "Affordable Health Packages"].map((item) => (
              <li key={item} className="flex items-center gap-3 font-semibold text-slate-700">
                <div className="w-6 h-6 rounded-full bg-[#1D6BF3] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-200">
                  <CheckCircle2 size={13} />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/clinic-schedule")}
            className="appt-btn inline-flex items-center gap-3 text-white px-9 py-4 rounded-2xl font-bold shadow-xl shadow-blue-300/30"
          >
            <CalendarCheck size={20} />
            Book Your Visit Today
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-24 px-6 lg:px-20 mt-10">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 border-b border-slate-800/50 pb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1D6BF3] rounded-2xl flex items-center justify-center">
                <Heart size={20} fill="white" className="text-white" />
              </div>
              <span className="text-3xl font-black text-white" style={{ fontFamily: "Syne" }}>
                Med<span className="text-[#0ABFBC]">Desk</span>
              </span>
            </div>
            <p className="max-w-md text-lg font-medium leading-relaxed text-slate-400">
              Transforming the global healthcare experience through innovative technology and deep medical expertise.
            </p>

            {/* Footer appointment CTA */}
            <button
              onClick={() => navigate("/clinic-schedule")}
              className="appt-btn inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-bold"
            >
              <CalendarCheck size={18} />
              Schedule an Appointment
            </button>

            <div className="flex gap-3">
              {["fb", "tw", "ln", "ig"].map((i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-2xl border border-slate-800 flex items-center justify-center hover:bg-[#1D6BF3] hover:border-[#1D6BF3] transition-all cursor-pointer uppercase text-[10px] font-black tracking-widest"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[44px] border border-slate-800 shadow-2xl">
            <h5 className="text-white font-black text-2xl mb-3" style={{ fontFamily: "Syne" }}>
              Stay Updated
            </h5>
            <p className="mb-8 text-slate-400 font-medium leading-relaxed text-sm">
              Join our community to get the latest health insights and news from our specialists.
            </p>
            {subscribed ? (
              <div className="text-emerald-400 flex items-center gap-3 font-bold bg-emerald-400/10 p-5 rounded-3xl border border-emerald-400/20 text-sm">
                <CheckCircle2 size={22} /> Subscription successful! Check your inbox.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 flex-1 focus:ring-2 focus:ring-[#1D6BF3] outline-none text-white font-medium transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  className="appt-btn text-white px-7 py-4 rounded-2xl font-black text-sm"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-bold tracking-widest uppercase">
          <p>© 2025 MedDesk Group. All rights reserved.</p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}