import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle, Loader2, LockKeyhole, Mail, Sun, Moon } from "lucide-react";
import api from "../services/api";
import { setAdminToken } from "../services/auth";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/admin/auth/login", { email, password });
      setAdminToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] font-['Inter'] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#22C55E]/10 selection:text-[#16A34A] relative transition-colors duration-300">
      
      {/* Top right theme toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-11 h-11 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-full shadow-sm flex items-center justify-center transition-all hover:scale-105"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-[#64748B]" />}
      </button>

      {/* Super subtle radial glow in background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'radial-gradient(circle at center, rgba(238,242,255,0.7) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">
        
        <div className="mb-10 w-full flex flex-col items-center relative z-20">
          <div className="w-16 h-16 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 transform -rotate-6 mb-4">
             <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
             </div>
          </div>
          <img
            src="/logo.png"
            alt="Sanyog"
            className="h-8 w-auto object-contain opacity-50"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* The Premium Light Card */}
        <div 
          className="w-full bg-[#FFFFFF] dark:bg-[#0F172A] animate-fade-in overflow-hidden relative z-20 border border-[rgba(226,232,240,0.8)] dark:border-[#1E293B] transition-colors duration-300"
          style={{ borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}
        >
          <form onSubmit={handleSubmit} className="px-8 py-10 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black tracking-tight m-0 dark:text-white uppercase"><span className="text-emerald-500">DICE</span> ADMIN</h2>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-2 font-black uppercase tracking-[0.2em]">Digital Identity & Certification Ecosystem</p>
            </div>

            {/* Minimal Alerts */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-[14px] border border-red-100 dark:border-red-500/20 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[14px] font-semibold text-[#0F172A] dark:text-slate-300 mb-2">Email</label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-[#6B7280] dark:text-[#94A3B8]">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Email"
                  className="w-full pl-[46px] pr-4 h-14 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] outline-none rounded-xl text-[15px] font-medium text-[#0F172A] dark:text-white transition-all duration-200 focus:border-[#22C55E] dark:focus:border-[#22C55E] placeholder:text-[#9CA3AF] dark:placeholder:text-[#64748B] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[14px] font-semibold text-[#0F172A] dark:text-slate-300 mb-2">Password</label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-[#6B7280] dark:text-[#94A3B8]">
                  <LockKeyhole className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Password"
                  className="w-full pl-[46px] pr-4 h-14 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] outline-none rounded-xl text-[15px] font-medium text-[#0F172A] dark:text-white transition-all duration-200 focus:border-[#22C55E] dark:focus:border-[#22C55E] placeholder:text-[#9CA3AF] dark:placeholder:text-[#64748B] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-14 text-[16px] text-white font-[600] rounded-[10px] bg-[#22C55E] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#16A34A] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] disabled:opacity-65 disabled:pointer-events-none disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 mb-4 text-center z-10 w-full relative">
          <p className="text-[#6B7280] text-[13px] font-medium tracking-wide">
            © {new Date().getFullYear()} Sanyog Conformity Solutions
          </p>
        </div>

      </div>
    </div>
  );
}
