import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Shield, Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft,
  Sun, Moon, Mail, Key
} from "lucide-react";
import API from "../services/api";

// ─── Resend Countdown Timer ───────────────────────────────────────────────────
function ResendTimer({ onResend, loading, isDark }) {
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setSeconds(30);
    setCanResend(false);
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mt-3">
      {canResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="text-sm text-[#16A34A] font-semibold hover:underline flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Resend OTP
        </button>
      ) : (
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          Resend OTP in <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{seconds}s</span>
        </p>
      )}
    </div>
  );
}

// ─── 6-Box OTP Input ──────────────────────────────────────────────────────────
function OtpBoxInput({ value, onChange, isDark }) {
  const inputs = useRef([]);
  const digits = value.split("");

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = val;
    onChange(newDigits.join(""));
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    const lastIdx = Math.min(pasted.length, 5);
    inputs.current[lastIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ""}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          autoFocus={idx === 0}
          className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
            ${digits[idx]
              ? "border-[#16A34A] bg-[#16A34A]/10 text-[#16A34A]"
              : isDark
                ? "border-[#334155] bg-[#0F172A] text-slate-300"
                : "border-gray-200 bg-white text-gray-700"}
            focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20
          `}
        />
      ))}
    </div>
  );
}

// ─── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp" or "password"
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  const { isDark, toggleTheme } = useTheme();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (otpCode.length === 6 && otpStep === 2 && loginMethod === "otp") {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email });
      setOtpStep(2);
      setOtpCode("");
      setResendKey((k) => k + 1);
      setSuccess("OTP sent! Please check your email inbox.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to send OTP.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!otpCode || otpCode.replace(/\D/g, "").length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/verify-otp", {
        email: email.toLowerCase(),
        code: otpCode,
      });
      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid OTP.";
      setError(msg);
      setOtpCode("");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login-password", {
        email: email.toLowerCase(),
        password: password,
      });
      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtpCode("");
    setError("");
    handleSendOtp();
  };

  // ── Dynamic color tokens ───────────────────────────────────────────────────
  const bg = isDark ? '#10141D' : '#F1F5F9';
  const cardBg = isDark ? '#161B22' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const cardShadow = isDark 
    ? '0 32px 64px -16px rgba(0,0,0,0.6)' 
    : '0 20px 50px -12px rgba(0,0,0,0.12)';
  const inputBg = isDark ? 'rgba(11,13,19,0.6)' : '#F8FAFC';
  const inputBorder = isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textSecondary = isDark ? '#CBD5E1' : '#64748B';
  const textMuted = isDark ? '#64748B' : '#94A3B8';

  return (
    <div
      className="min-h-screen font-['Inter'] flex flex-col items-center justify-center p-4 antialiased transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 30%, rgba(22,163,74,0.15) 0%, transparent 70%)'
            : 'none',
          opacity: isDark ? 0.8 : 0,
        }}
      />

      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{
            backgroundColor: isDark ? 'rgba(30,36,46,0.8)' : 'rgba(255,255,255,0.9)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">
        <div className="mb-10 w-full flex flex-col items-center relative z-20">
          <div className="w-16 h-16 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 transform rotate-6 mb-4">
             <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
             </div>
          </div>
          <img
            src="/logo.png" alt="Sanyog"
            className="h-8 w-auto object-contain opacity-50"
            style={{ filter: isDark ? 'none' : 'brightness(0.85)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div
          className="w-full overflow-hidden relative z-20 rounded-[2rem] transition-all duration-500"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
        >
          {/* Method Switcher */}
          <div className="flex p-1 bg-gray-100 dark:bg-[#0B0D13] mx-10 mt-8 rounded-2xl border dark:border-[#2A2D3E]">
             <button onClick={() => { setLoginMethod("otp"); setOtpStep(1); setError(""); }}
               className={`flex-1 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'otp' ? 'bg-white dark:bg-[#1E242E] shadow-xl text-[#16A34A]' : 'text-gray-400 hover:text-gray-600'}`}>
                OTP Code
             </button>
             <button onClick={() => { setLoginMethod("password"); setError(""); }}
               className={`flex-1 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'password' ? 'bg-white dark:bg-[#1E242E] shadow-xl text-[#16A34A]' : 'text-gray-400 hover:text-gray-600'}`}>
                Password
             </button>
          </div>

          <div className="px-10 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tighter uppercase m-0 leading-none" style={{ color: textPrimary }}>
                DICE <span className="text-emerald-500">PORTAL</span>
              </h2>
              <p className="text-[9px] mt-4 font-black uppercase tracking-[0.3em] opacity-40" style={{ color: textSecondary }}>
                Digital Identity & Certification Ecosystem
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 text-red-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-red-500/20 font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-emerald-500/20 font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 shrink-0" /> {success}
              </div>
            )}

            {/* OTP FLOW */}
            {loginMethod === 'otp' && (
              <>
                {otpStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-4 ml-1" style={{ color: textSecondary }}>Your Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#16A34A]" />
                        <input type="email" placeholder="name@company.com" value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                          className="w-full pl-[60px] pr-4 h-16 outline-none rounded-2xl text-base font-black transition-all duration-300 focus:ring-2 focus:ring-[#16A34A]/30"
                          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} required autoFocus />
                      </div>
                    </div>
                    <button type="submit" disabled={loading || !email.includes('@')}
                      className="w-full h-16 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 uppercase tracking-[0.2em]"
                      style={{ backgroundColor: '#14532D', boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)' }}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {loading ? "SYNCHRONIZING..." : "SEND EMAIL OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-8">
                     <div className="mb-8">
                        <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} isDark={isDark} />
                     </div>
                     <button type="submit" disabled={loading || otpCode.length < 6}
                        className="w-full h-16 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 uppercase tracking-[0.2em]"
                        style={{ backgroundColor: '#14532D', boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)' }}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {loading ? "VERIFYING..." : "VERIFY & SIGN IN"}
                     </button>
                     <div className="mt-8 text-center text-xs">
                        <ResendTimer key={resendKey} onResend={handleResend} loading={loading} isDark={isDark} />
                        <button type="button" onClick={() => setOtpStep(1)} className="mt-3 text-[#16A34A] font-black uppercase tracking-widest hover:underline block mx-auto">Change Email</button>
                     </div>
                  </form>
                )}
              </>
            )}

            {/* PASSWORD FLOW */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-4 ml-1" style={{ color: textSecondary }}>Your Email</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#16A34A]" />
                       <input type="email" placeholder="name@company.com" value={email}
                         onChange={(e) => { setEmail(e.target.value); setError(""); }}
                         className="w-full pl-[60px] pr-4 h-16 outline-none rounded-2xl text-base font-black transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                         style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} required />
                    </div>
                 </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-4 ml-1" style={{ color: textSecondary }}>Password</label>
                    <div className="relative">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#16A34A]" />
                       <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                         onChange={(e) => { setPassword(e.target.value); setError(""); }}
                         className="w-full pl-[60px] pr-14 h-16 outline-none rounded-2xl text-base font-black transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                         style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textPrimary }} required />
                       <button type="button" onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       </button>
                    </div>
                 </div>
                 <button type="submit" disabled={loading}
                    className="w-full h-16 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 uppercase tracking-[0.2em]"
                    style={{ backgroundColor: '#14532D', boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-4 h-4" />}
                    {loading ? "AUTHENTICATING..." : "SIGN IN"}
                 </button>
              </form>
            )}
            
            <div className="mt-10 text-center pt-8" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0'}` }}>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>
                New Partner?{" "}
                <Link to="/register" className="text-[#16A34A] font-black hover:text-emerald-500 transition-colors">REGISTER NOW</Link>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-[11px] font-bold uppercase tracking-widest text-center" style={{ color: textMuted }}>© {new Date().getFullYear()} Sanyog Conformity Solutions</p>
      </div>
    </div>
  );
}