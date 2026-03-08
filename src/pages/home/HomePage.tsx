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
  Linkedin,
  Twitter,
  Mail,
  Menu,
  X,
  CheckCircle2,
  ShieldCheck,
  Microscope,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Use react-router-dom

// Configuration
const stats = [
  { icon: <Award size={18} />, value: "490", label: "Awards" },
  { icon: <Users size={18} />, value: "6,700+", label: "Patients" },
  { icon: <Clock size={18} />, value: "22 Years", label: "Experience" },
];

const services = [
  { icon: <Brain size={32} />, title: "Brain Health Check", desc: "Comprehensive neurological assessments and cognitive testing using latest tech.", dark: false },
  { icon: <Activity size={32} />, title: "Liver Function Test", desc: "Complete hepatic panel with advanced biomarker analysis and screening.", dark: false },
  { icon: <Heart size={32} fill="currentColor" />, title: "Kidney Health Scan", desc: "Renal imaging and function evaluation for early detection of issues.", dark: true },
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">
      {/* Dynamic Header Fonts & Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
        
        .hero-title { letter-spacing: -0.04em; line-height: 0.9; }
        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.3); }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-15px) rotate(1deg); } 
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">MedDesk</span>
        </div>

        <ul className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-slate-500">
          {["Home", "About", "Departments", "Doctors"].map((item) => (
            <li key={item}><a href="#" className="hover:text-blue-600 transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">{item}</a></li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-[15px] font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-5 py-2 text-[15px] font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-all"
            >
              Create Account
            </button>
          </div>
          
          <button className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
            <PhoneCall size={16} /> Contact Us
          </button>
          
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-20 pt-12 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-20 items-center max-w-[1440px] mx-auto">
        <div className="space-y-10 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 shadow-sm">
            <Zap size={14} className="fill-blue-600" /> Fast Treatment Available
          </div>
          
          <h1 className="hero-title text-7xl lg:text-[10rem] font-black text-slate-900">
            QUICK <br /> <span className="text-blue-600">SMART</span> <br /> MEDIC
          </h1>
          
          <p className="text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            MedDesk is your destination for world-class treatments, compassionate doctors, and precise diagnostics all under one roof.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold flex items-center gap-3 hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-2xl active:scale-95">
              Explore Services <ArrowUpRight size={22} />
            </button>
            <div className="flex -space-x-3 items-center">
               {[1,2,3,4].map(i => (
                 <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
               ))}
               <p className="ml-5 text-sm font-bold text-slate-400">+2k Patients last month</p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Main Illustration Area */}
          <div className="w-[320px] h-[320px] md:w-[550px] md:h-[550px] bg-gradient-to-tr from-blue-50 to-white rounded-full flex items-center justify-center relative shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-10 rounded-full" />
            <Stethoscope size={300} strokeWidth={1} className="text-blue-200 animate-pulse" />
            
            {/* Floating Stat Chips */}
            {stats.map((s, i) => (
              <div 
                key={i}
                className="absolute glass-card px-5 py-4 rounded-[24px] shadow-2xl shadow-blue-100 flex items-center gap-4 animate-float"
                style={{ 
                  top: i === 0 ? '5%' : i === 1 ? '48%' : '82%',
                  right: i === 0 ? '0%' : i === 1 ? '-10%' : 'auto',
                  left: i === 2 ? '0%' : 'auto',
                  animationDelay: `${i * 1.5}s`
                }}
              >
                <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-100">
                  {s.icon}
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 leading-tight">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale">
           <span className="text-xl font-bold italic">HEALTHLINE</span>
           <span className="text-xl font-bold italic">MEDICARE</span>
           <span className="text-xl font-bold italic">PHARMA-CO</span>
           <span className="text-xl font-bold italic">GLOBAL HEALTH</span>
        </div>
      </div>

      {/* Services Section */}
      <section className="px-6 lg:px-20 py-24 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Our Health Services</h2>
            <p className="text-slate-500 max-w-md font-medium">Tailored medical solutions designed for your specific needs using state-of-the-art diagnostic equipment.</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all group">
            View All Departments <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div 
              key={i} 
              className={`group relative p-12 rounded-[48px] transition-all duration-500 border border-transparent ${
                s.dark ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-3 hover:border-blue-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 ${
                s.dark ? 'bg-blue-600 shadow-xl shadow-blue-500/20' : 'bg-blue-50 text-blue-600'
              }`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tight">{s.title}</h3>
              <p className={`mb-10 text-[15px] leading-relaxed font-medium ${s.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {s.desc}
              </p>
              <button className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-100">
                <ArrowUpRight size={24} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Specialists Section */}
      <section className="px-6 lg:px-20 py-28 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 space-y-5">
            <div className="text-blue-600 font-black tracking-widest text-xs uppercase">Certified Experts</div>
            <h2 className="text-5xl font-black text-slate-900">Meet Our Specialists</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, i) => (
              <div key={i} className="group overflow-hidden rounded-[40px] bg-[#F8FAFC] border border-slate-100 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="relative h-[360px] overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                     <div className="flex justify-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-blue-600 transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-blue-400 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-400 transition-colors"><Mail size={20} /></a>
                     </div>
                  </div>
                </div>
                <div className="p-8 text-center bg-white">
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h4>
                  <p className="text-blue-600 font-bold text-sm mb-3 uppercase tracking-wider">{doc.role}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-slate-400 text-xs font-bold">
                    <Clock size={12} /> {doc.exp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 lg:px-20 py-24 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
         <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
            <div className="p-8 bg-blue-600 rounded-[40px] text-white space-y-4 mt-8">
               <ShieldCheck size={40} strokeWidth={1.5} />
               <h4 className="text-xl font-bold">Secure Care</h4>
               <p className="text-sm text-blue-100 leading-relaxed">Your health records are encrypted and handled with 100% privacy.</p>
            </div>
            <div className="p-8 bg-white rounded-[40px] border border-slate-100 space-y-4 shadow-xl shadow-slate-200/50">
               <Microscope size={40} className="text-blue-600" strokeWidth={1.5} />
               <h4 className="text-xl font-bold text-slate-900">Modern Labs</h4>
               <p className="text-sm text-slate-500 leading-relaxed">We use AI-driven diagnostics for 99.9% result accuracy.</p>
            </div>
            <div className="col-span-2 p-10 bg-white rounded-[40px] border border-slate-100 flex items-center gap-8 shadow-xl shadow-slate-200/50">
               <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 size={40} />
               </div>
               <div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-1">ISO Certified Hospital</h4>
                  <p className="text-slate-500 font-medium">Global standards in hygiene and medical protocol.</p>
               </div>
            </div>
         </div>
         <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-5xl font-black text-slate-900 leading-tight">We Care For Your Health <br/> With Best Specialists.</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
               Our facility combines high-quality equipment with a welcoming environment. We believe that every patient deserves a personalized care plan.
            </p>
            <ul className="space-y-4">
               {['Over 500+ Qualified Doctors', '24/7 Emergency Support', 'Affordable Health Packages'].map(item => (
                 <li key={item} className="flex items-center gap-3 font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                    {item}
                 </li>
               ))}
            </ul>
         </div>
      </section>

      {/* Footer / CTA */}
      <footer className="bg-slate-950 text-slate-400 py-24 px-6 lg:px-20 mt-10">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 border-b border-slate-800/50 pb-20">
          <div className="space-y-10">
            <div className="flex items-center gap-3 text-white">
              <Heart size={32} fill="currentColor" className="text-blue-500" />
              <span className="text-3xl font-black tracking-tight">MedDesk</span>
            </div>
            <p className="max-w-md text-xl font-medium leading-relaxed text-slate-400">
              Transforming the global healthcare experience through innovative technology and deep medical expertise.
            </p>
            <div className="flex gap-4">
               {['fb', 'tw', 'ln', 'ig'].map(i => (
                 <div key={i} className="w-12 h-12 rounded-2xl border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer hover:text-white uppercase text-[10px] font-bold">
                   {i}
                 </div>
               ))}
            </div>
          </div>
          
          <div className="bg-slate-900 p-12 rounded-[56px] border border-slate-800 shadow-2xl">
            <h5 className="text-white font-black text-2xl mb-5">Stay Updated</h5>
            <p className="mb-8 text-slate-400 font-medium leading-relaxed">Join our community to get the latest health insights and news from our specialists.</p>
            {subscribed ? (
              <div className="text-green-400 flex items-center gap-3 font-bold bg-green-400/10 p-5 rounded-3xl border border-green-400/20">
                <CheckCircle2 size={24} /> Subscription successful! Check your inbox.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 flex-1 focus:ring-2 focus:ring-blue-600 outline-none text-white font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={() => email && setSubscribed(true)}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-bold tracking-widest uppercase">
          <p>© 2025 MedDesk Group. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}