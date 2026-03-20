import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/adminServices/Auth.service';
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle2, UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', phone: ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await register(formData);
      if (response.success) {
        setRegistered(true);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Connection lost. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-slate-200 py-3 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="h-screen bg-white flex font-['Inter'] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* LEFT PANEL */}
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
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white leading-tight font-heading">
              Join Our <br /> <span className="text-blue-400">Medical</span> <br /> Community.
            </h1>
            <p className="text-blue-100/70 text-lg font-medium leading-relaxed">
              Start managing your healthcare operations with precision and ease.
            </p>
          </div>
          <div className="space-y-3">
            {["Instant account setup", "Dedicated support team", "All-in-one health suite"].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="bg-blue-500/20 p-1 rounded-full text-blue-400"><CheckCircle2 size={16} /></div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-2xl bg-white px-12 py-8 rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100">

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 font-heading tracking-tight">Create Account</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-sm text-slate-400">Not a patient?</p>
              <span
                onClick={() => navigate("/register-cabinet")}
                className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Register a hospital instead
              </span>
            </div>
            {isRegistered && <p className="text-green-600 text-sm font-semibold mt-2">Registration successful! Redirecting...</p>}
            {error && <p className="text-rose-500 text-sm font-semibold mt-2">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-8">
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input required name="firstName" placeholder="First name" className={inputClass} onChange={handleChange} />
              </div>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input required name="lastName" placeholder="Last name" className={inputClass} onChange={handleChange} />
              </div>
            </div>

            {/* Username & Phone */}
            <div className="grid grid-cols-2 gap-8">
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input required name="username" placeholder="Username" className={inputClass} onChange={handleChange} />
              </div>
              <div className="relative">
                <Phone className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input required name="phone" placeholder="+212..." className={inputClass} onChange={handleChange} />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input required name="email" type="email" placeholder="Email address" className={inputClass} onChange={handleChange} />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input
                required name="password" type={showPw ? 'text' : 'password'} placeholder="Create password"
                className={inputClass + " pr-10"}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit" disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-60 group"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Create Account</span><UserPlus size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                }
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline underline-offset-2">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}