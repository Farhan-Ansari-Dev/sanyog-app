import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle, Loader2, LockKeyhole, Mail } from "lucide-react";
import api from "../services/api";
import { setAdminToken } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#22C55E]/10 selection:text-[#16A34A] relative">
      {/* Super subtle radial glow in background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'radial-gradient(circle at center, rgba(238,242,255,0.7) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">
        
        {/* Minimal Logo Section */}
        <div className="mb-10 w-full flex flex-col items-center relative z-20">
          <img
            src="/logo.png"
            alt="Sanyog"
            className="h-14 w-auto object-contain drop-shadow-sm transition-all duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none' }} className="items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Shield className="w-7 h-7 text-slate-800" />
          </div>
        </div>

        {/* The Premium Light Card */}
        <div 
          className="w-full bg-[#FFFFFF] animate-fade-in overflow-hidden relative z-20"
          style={{ borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(226, 232, 240, 0.8)' }}
        >
          <form onSubmit={handleSubmit} className="px-8 py-10 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-[26px] font-bold text-[#0F172A] tracking-tight m-0">Welcome Admin</h2>
              <p className="text-[14px] text-[#6B7280] mt-2 font-medium">Please sign in to manage the portal.</p>
            </div>

            {/* Minimal Alerts */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px] border border-red-100 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[14px] font-semibold text-[#0F172A] mb-2">Email</label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-[#6B7280]">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@sanyogconformity.com"
                  className="w-full pl-[46px] pr-4 h-14 bg-white border border-[#E5E7EB] outline-none rounded-xl text-[15px] font-medium text-[#0F172A] transition-all duration-200 focus:border-[#22C55E] placeholder:text-[#9CA3AF] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[14px] font-semibold text-[#0F172A] mb-2">Password</label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-[#6B7280]">
                  <LockKeyhole className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full pl-[46px] pr-4 h-14 bg-white border border-[#E5E7EB] outline-none rounded-xl text-[15px] font-medium text-[#0F172A] transition-all duration-200 focus:border-[#22C55E] placeholder:text-[#9CA3AF] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
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
