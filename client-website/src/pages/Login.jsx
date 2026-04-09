import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft,
  Sun, Moon
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

  const [mobile, setMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  // Theme state
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (otpCode.length === 6 && otpStep === 2) {
      handleVerifyOtp();
    }
  }, [otpCode]);

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
      setOtpCode("");
    } finally {
      setOtpLoading(false);
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
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#475569' : '#94A3B8';

  return (
    <div
      className="min-h-screen font-['Inter'] flex flex-col items-center justify-center p-4 antialiased transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Radial glow — only in dark mode */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 40%, rgba(30,41,59,0.6) 0%, transparent 70%)'
            : 'none',
          opacity: isDark ? 1 : 0,
        }}
      />

      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{
            backgroundColor: isDark ? 'rgba(30,36,46,0.8)' : 'rgba(255,255,255,0.9)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <div className="w-full max-w-[440px] flex flex-col items-center relative z-10">

        {/* Logo */}
        <div className="mb-10 w-full flex flex-col items-center relative z-20">
          <img
            src="/logo.png"
            alt="Sanyog"
            className="h-14 w-auto object-contain drop-shadow-sm transition-all duration-300"
            style={{ filter: isDark ? 'none' : 'brightness(0.85)' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none' }} className="items-center justify-center w-14 h-14 rounded-2xl shadow-sm">
            <Shield className="w-7 h-7" style={{ color: textPrimary }} />
          </div>
        </div>

        {/* ─── Main Login Card ─── */}
        <div
          className="w-full overflow-hidden relative z-20 rounded-[2rem] transition-all duration-500"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: cardShadow,
          }}
        >

          {/* Step 1: Mobile Number */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="px-10 py-12">
              <div className="text-center mb-10">
                <h2
                  className="text-2xl font-black tracking-widest uppercase m-0 leading-none"
                  style={{ color: textPrimary }}
                >
                  Welcome Back
                </h2>
                <p
                  className="text-[11px] mt-4 font-bold uppercase tracking-[0.2em] opacity-60"
                  style={{ color: textSecondary }}
                >
                  Please authenticate to access the grid
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 text-red-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-red-500/20 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-emerald-500/20 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8">
                <label
                  className="block text-[10px] font-black uppercase tracking-widest mb-4 ml-1"
                  style={{ color: textSecondary }}
                >
                  Mobile Access Key
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-5 text-sm font-black text-[#16A34A] select-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full pl-[60px] pr-4 h-16 outline-none rounded-2xl text-base font-black transition-all duration-300 focus:ring-2 focus:ring-[#16A34A]/30"
                    style={{
                      backgroundColor: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: textPrimary,
                    }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* REQUEST OTP — Deep Forest Green */}
              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                className="w-full h-16 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: '#14532D',
                  boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14532D'; }}
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...</> : <><RefreshCw className="w-4 h-4" /> REQUEST OTP</>}
              </button>

              <div
                className="mt-10 text-center pt-8"
                style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0'}` }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: textMuted }}
                >
                  New to Sanyog?{" "}
                  <Link to="/register" className="text-[#16A34A] font-black hover:text-emerald-500 transition-colors">
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
                  className="absolute left-0 top-1.5 transition-colors p-1 rounded-lg"
                  style={{ color: textSecondary }}
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2
                  className="text-2xl font-black tracking-widest uppercase m-0 leading-none"
                  style={{ color: textPrimary }}
                >
                  Verify OTP
                </h2>
                <p
                  className="text-[11px] mt-4 font-bold uppercase tracking-[0.2em] opacity-60"
                  style={{ color: textSecondary }}
                >
                  Code sent to <span className="text-[#16A34A]">+91 {mobile}</span>
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 text-red-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-red-500/20 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-3 rounded-2xl mb-8 text-xs border border-emerald-500/20 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8">
                <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} isDark={isDark} />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full h-16 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: '#14532D',
                  boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14532D'; }}
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> VERIFYING...</> : <><CheckCircle className="w-4 h-4" /> VERIFY & SIGN IN</>}
              </button>

              <div className="mt-8 transition-opacity text-center">
                <ResendTimer key={resendKey} onResend={handleResend} loading={otpLoading} isDark={isDark} />
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 mb-4 text-center z-10 w-full relative">
          <p
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: textMuted }}
          >
            © {new Date().getFullYear()} Sanyog Conformity Solutions
          </p>
        </div>

      </div>
    </div>
  );
}