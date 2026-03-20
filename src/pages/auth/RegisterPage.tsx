import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/adminServices/Auth.service';
import { 
  Heart, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus,
  ArrowLeft
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Form State using the data structure you provided
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try{
      setIsLoading(true);
        setError(null);
          const response = await register(formData);
          if(response.success){
            setRegistered(true);
          }
          
    }catch(err:any){
      const errorMessage = err.response?.data?.message || "Connection lost. Please try again.";
      setError(errorMessage);
    }finally{ 
      setIsLoading(false);
    }
    
    
    
      
    setTimeout(() => {
      console.log("Registered Data:", formData);
      setIsLoading(false);
      navigate('/login'); // Redirect to login after success
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex font-['Inter'] selection:bg-blue-100">
      {/* Dynamic Font Import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* LEFT SIDE: Decorative Brand Panel */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          alt="Hospital hallway"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-slate-950" />
        
        <div className="relative z-10 w-full p-12 flex flex-col justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white p-2 rounded-xl">
              <Heart size={24} className="text-blue-600 fill-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-heading">MedDesk</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-black text-white leading-tight font-heading">
              Join Our <br /> <span className="text-blue-400">Medical</span> <br /> Community.
            </h1>
            <p className="text-blue-100/70 text-lg font-medium leading-relaxed">
              Start managing your healthcare operations with precision and ease.
            </p>
          </div>

          <div className="space-y-4">
             {["Instant account setup", "Dedicated support team", "All-in-one health suite"].map((text, i) => (
               <div key={i} className="flex items-center gap-3 text-white font-semibold text-sm">
                 <div className="bg-blue-500/20 p-1 rounded-full text-blue-400"><CheckCircle2 size={16} /></div>
                 {text}
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-[#F8FAFC]">
        <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 font-heading tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Please fill in your professional details below.</p>
            <p>
              {isRegistered && <span className="text-green-600 font-bold mt-4 block">Registration successful! Redirecting to login...</span>}
              {error && <span className="text-rose-500 font-bold mt-4 block">{error}</span>}
            </p>
          </div>
          

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: First & Last Name */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input
                    required
                    name="firstName"
                    placeholder="e.g. Hanan"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  placeholder="e.g. Mansouri"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Username & Phone */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                <input
                  required
                  name="username"
                  placeholder="hana"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input
                    required
                    name="phone"
                    placeholder="+212..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="s.hana@gmail.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 4: Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  required
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 focus:bg-white transition-all font-medium"
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create My Account
                    <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an admin account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">Sign In here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}