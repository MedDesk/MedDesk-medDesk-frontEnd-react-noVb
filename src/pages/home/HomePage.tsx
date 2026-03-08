import React, { useState } from "react";
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
  CalendarCheck,
  ClipboardList,
  FlaskConical,
  FileText,
  Linkedin,
  Twitter,
  Mail,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

// Configuration for Content
const stats = [
  { icon: <Award size={18} />, value: "490", label: "Awards" },
  { icon: <Users size={18} />, value: "6,700+", label: "Patients" },
  { icon: <Clock size={18} />, value: "22 Years", label: "Experience" },
];

const services = [
  { icon: <Brain />, title: "Brain Health Check", desc: "Comprehensive neurological assessments and cognitive testing.", dark: false },
  { icon: <Activity />, title: "Liver Function Test", desc: "Complete hepatic panel with advanced biomarker analysis.", dark: false },
  { icon: <Heart fill="currentColor" />, title: "Kidney Health Scan", desc: "Renal imaging and function evaluation for early detection.", dark: true },
];

const doctors = [
  { 
    name: "Dr. Sarah Mitchell", 
    role: "Neurologist", 
    exp: "14 yrs exp", 
    img: "https://i.pinimg.com/1200x/48/3a/61/483a616311979852c5b39993f6e0a752.jpg" 
  },
  { 
    name: "Dr. James Okafor", 
    role: "Cardiologist", 
    exp: "18 yrs exp", 
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=350" 
  },
  { 
    name: "Dr. Lena Vasquez", 
    role: "Radiologist", 
    exp: "11 yrs exp", 
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=350" 
  },
  { 
    name: "Dr. Tom Nguyen", 
    role: "Nephrologist", 
    exp: "16 yrs exp", 
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=350" 
  },
];

export default function MedDesk() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* Import Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
        
        .hero-title { letter-spacing: -0.03em; line-height: 0.95; }
        .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">MedDesk</span>
        </div>

        <ul className={`hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-500`}>
          {["Home", "About", "Departments", "Doctors"].map((item) => (
            <li key={item}><a href="#" className="hover:text-blue-600 transition-colors">{item}</a></li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-[15px] font-semibold hover:text-blue-600 transition-colors">Sign In</button>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md active:scale-95">
            <ArrowUpRight size={16} /> Contact Us
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center max-w-[1440px] mx-auto">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
            <Zap size={14} fill="currentColor" /> Fast Treatment
          </div>
          <h1 className="hero-title text-7xl lg:text-9xl font-extrabold text-slate-900">
            QUICK <br /> <span className="text-blue-600">SMART</span> <br /> MEDIC
          </h1>
          <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Your destination for world-class treatments, compassionate specialists, and precise diagnostics.
          </p>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl mx-auto lg:mx-0">
            <ArrowUpRight size={22} /> Explore More
          </button>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Decorative Circle */}
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-50/50 rounded-full flex items-center justify-center relative">
            <Stethoscope size={280} strokeWidth={1} className="text-blue-200" />
            
            {/* Floating Stats */}
            {stats.map((s, i) => (
              <div 
                key={i}
                className={`absolute glass-card px-4 py-3 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-3 animate-float`}
                style={{ 
                  top: i === 0 ? '10%' : i === 1 ? '45%' : '80%',
                  right: i === 0 ? '5%' : i === 1 ? '-5%' : 'auto',
                  left: i === 2 ? '5%' : 'auto',
                  animationDelay: `${i * 1.2}s`
                }}
              >
                <div className="bg-green-100 text-green-600 p-2 rounded-xl">{s.icon}</div>
                <div>
                  <div className="text-lg font-bold leading-none">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 lg:px-20 py-20 max-w-[1440px] mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
          Our Health Services <div className="h-1 w-12 bg-blue-600 rounded-full" />
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div 
              key={i} 
              className={`group p-10 rounded-[40px] transition-all duration-300 ${
                s.dark ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white hover:shadow-xl hover:-translate-y-2 border border-slate-50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                s.dark ? 'bg-blue-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className={`mb-8 leading-relaxed ${s.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {s.desc}
              </p>
              <button className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Meet Our Specialists</h2>
            <p className="text-slate-500 max-w-xl mx-auto">World-class expertise meets compassionate care in every department.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, i) => (
              <div key={i} className="group overflow-hidden rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all">
                <div className="relative h-[300px] overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{doc.role}</p>
                  <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                    <Clock size={12} /> {doc.exp}
                  </p>
                  <div className="flex justify-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-blue-600 transition-colors"><Linkedin size={18} /></button>
                    <button className="p-2 hover:text-blue-400 transition-colors"><Twitter size={18} /></button>
                    <button className="p-2 hover:text-red-400 transition-colors"><Mail size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20 px-6 lg:px-20 mt-20">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 border-b border-slate-800 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Heart size={24} fill="currentColor" className="text-blue-500" />
              <span className="text-2xl font-bold tracking-tight">MedDesk</span>
            </div>
            <p className="max-w-sm text-lg leading-relaxed">
              Transforming the healthcare experience through technology and compassion.
            </p>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800">
            <h5 className="text-white font-bold text-xl mb-4">Stay Healthy</h5>
            <p className="mb-6 text-sm">Join 12,000+ patients getting weekly wellness updates.</p>
            {subscribed ? (
              <div className="text-green-400 flex items-center gap-2 font-bold bg-green-400/10 p-4 rounded-2xl">
                <CheckCircle2 size={20} /> You're on the list!
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-slate-800 border-none rounded-2xl px-4 py-3 flex-1 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={() => email && setSubscribed(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-colors"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2025 MedDesk. Providing excellence in medicine.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}