import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft,
  Sun, Moon
} from "lucide-react";
import API from "../services/api";

// ─── Resend Countdown Timer ───────────────────────────────────────────────────
function ResendTimer({ onResend, loading }) {
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
  }, []);  // only run on mount (each time OTP is sent, parent re-mounts this)

  return (
    <div className="text-center mt-3">
      {canResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Resend OTP
        </button>
      ) : (
        <p className="text-sm text-gray-400">
          Resend OTP in <span className="font-semibold text-gray-600 dark:text-slate-400">{seconds}s</span>
        </p>
      )}
    </div>
  );
}

// ─── 6-Box OTP Input ──────────────────────────────────────────────────────────
function OtpBoxInput({ value, onChange }) {
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
    // Focus last filled box
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
              ? "border-primary bg-primary-50 text-primary"
              : "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-700 dark:text-slate-300"}
            focus:border-primary focus:ring-2 focus:ring-primary/20
          `}
        />
      ))}
    </div>
  );
}

// ─── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  // OTP Flow state
  const [mobile, setMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1 = enter mobile, 2 = enter OTP
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendKey, setResendKey] = useState(0); // increment to reset countdown

  // Theme state
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
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Shared
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otpCode.length === 6 && otpStep === 2) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setOtpLoading(true);
    try {
      await API.post("/auth/send-otp", { mobile: cleaned });
      setOtpStep(2);
      setOtpCode("");
      setResendKey((k) => k + 1);
      setSuccess("OTP sent! Check your WhatsApp messages.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");

    if (!otpCode || otpCode.replace(/\D/g, "").length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setOtpLoading(true);
    try {
      const { data } = await API.post("/auth/verify-otp", {
        mobile: mobile.replace(/\D/g, ""),
        code: otpCode,
      });
      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(msg);
      // Clear OTP inputs on wrong code so user can re-type
      setOtpCode("");
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = () => {
    setOtpCode("");
    setError("");
    handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-premium-dark font-['Inter'] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#22C55E]/10 selection:text-[#16A34A] transition-colors duration-500 relative overflow-hidden">
      {/* Premium Admin-style radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 bg-premium-dark" 
        style={{ background: 'radial-gradient(circle at center, #1E293B 0%, #10141D 100%)' }}
      />
      
      <div className="absolute top-8 right-8 z-50">
         <button 
           onClick={toggleTheme}
           className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1E242E]/80 backdrop-blur-md border border-white/10 text-white hover:scale-110 transition-all shadow-2xl"
         >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
         </button>
      </div>

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
          <div style={{ display: 'none' }} className="items-center justify-center w-14 h-14 bg-white dark:bg-[#0F172A] border border-slate-200 rounded-2xl shadow-sm">
            <Shield className="w-7 h-7 text-slate-800" />
          </div>
        </div>

        {/* Premium Logic Card */}
        <div 
          className="w-full bg-[#161B22] dark:bg-[#161B22] animate-fade-in overflow-hidden relative z-20 border border-white/5 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
        >
          
          {/* Step 1: Mobile Number */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="px-10 py-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase m-0 leading-none">Welcome Back</h2>
                <p className="text-[11px] text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] opacity-60">Please authenticate to access the grid</p>
              </div>

              {/* Minimal Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 text-red-400 px-4 py-3 rounded-2xl mb-8 text-xs border border-red-500/20 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[14px] border border-green-100 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Mobile Access Key</label>
                <div className="relative flex items-center group">
                  <span className="absolute left-5 text-sm font-black text-[#16A34A] select-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full pl-[60px] pr-4 h-16 bg-[#0B0D13]/60 border border-white/5 outline-none rounded-2xl text-base font-black text-white transition-all duration-300 focus:border-[#16A34A]/50 focus:bg-[#0B0D13] placeholder:text-slate-700"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                className="w-full h-16 text-xs text-white font-black rounded-2xl bg-[#16A34A] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#15803d] hover:shadow-[0_20px_40px_-10px_rgba(22,163,74,0.4)] disabled:opacity-30 disabled:pointer-events-none uppercase tracking-[0.2em]"
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...</> : <><RefreshCw className="w-4 h-4" /> REQUEST OTP</>}
              </button>

              <div className="mt-10 text-center pt-8 border-t border-white/5">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                  New to Sanyog?{" "}
                  <Link to="/register" className="text-[#16A34A] font-black hover:text-emerald-400 transition-colors">
                    CREATE ACCOUNT
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Verification */}
          {otpStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="px-10 py-12">
              <div className="text-center mb-10 relative">
                <button
                  type="button"
                  onClick={() => { setOtpStep(1); setError(""); setOtpCode(""); }}
                  className="absolute left-0 top-1.5 text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase m-0 leading-none">Verify OTP</h2>
                <p className="text-[11px] text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] opacity-60">
                  Code sent to <span className="text-[#16A34A]">+91 {mobile}</span>
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 text-red-400 px-4 py-3 rounded-2xl mb-8 text-xs border border-red-500/20 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-2xl mb-8 text-xs border border-emerald-500/20 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8">
                <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full h-16 text-xs text-white font-black rounded-2xl bg-[#16A34A] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#15803d] hover:shadow-[0_20px_40px_-10px_rgba(22,163,74,0.4)] disabled:opacity-30 disabled:pointer-events-none uppercase tracking-[0.2em]"
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> VERIFYING...</> : <><CheckCircle className="w-4 h-4" /> VERIFY & SIGN IN</>}
              </button>

              <div className="mt-8 transition-opacity text-center">
                <ResendTimer key={resendKey} onResend={handleResend} loading={otpLoading} />
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 mb-4 text-center z-10 w-full relative">
          <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Sanyog Conformity Solutions
          </p>
        </div>

      </div>
    </div>
  );
}