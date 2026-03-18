import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle 
} from 'lucide-react';
import { login } from "../../services/adminServices/Auth.service"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
   // and we send the credentials too but we handle that in the interceptor of the apiClient
    const response = await login({ email, password });

    if (response.success) {
      // because the token has no expiration time long
      localStorage.setItem('accessToken', response.data.accessToken);
      
      
      // store user data to display in the dashboard
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const userRole = response.data.user.role;
      const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT', 'STAFF'];

      if (allowedRoles.includes(userRole)) {
        navigate('/dashboard');
      } else {
        setError("Unauthorized: Access denied for this role.");
        localStorage.clear();
      }
    } else {
      setError(response.message || "Invalid credentials.");
    }
    
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Connection lost. Please try again.";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex font-['Inter'] selection:bg-blue-100">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        h1, h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* LEFT SIDE: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
          alt="Medical background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-slate-900/90" />
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <Heart size={24} className="text-blue-600 fill-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-heading">MedDesk</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-6xl font-black text-white leading-tight font-heading tracking-tighter">
              Smarter Care <br /> Starts With <br /> <span className="text-blue-400">Better Data.</span>
            </h1>
            <div className="space-y-4">
              {["Access real-time patient analytics", "Secure HIPAA-compliant storage", "AI-driven diagnostic assistance"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-blue-100/80 font-medium">
                  <CheckCircle2 size={20} className="text-blue-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[32px] flex items-center gap-4 max-w-sm">
             <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-300">
                <ShieldCheck size={32} />
             </div>
             <div>
                <p className="text-white font-bold">Secure Access Only</p>
                <p className="text-blue-200 text-xs">End-to-end encrypted session management.</p>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-black text-slate-900 font-heading tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Enter your hospital credentials below.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@meddesk.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-medium text-slate-900 shadow-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-slate-500 font-medium">
              New to MedDesk?{' '}
              <Link to="/Register" className="text-blue-600 font-bold hover:underline underline-offset-4">Create admin account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}