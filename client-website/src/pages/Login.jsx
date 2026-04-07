import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft
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
          Resend OTP in <span className="font-semibold text-gray-600">{seconds}s</span>
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
              : "border-gray-200 bg-white text-gray-700"}
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
    <div style={{ background: 'linear-gradient(180deg, #0F2A5A 0%, #1E4DB7 100%)', fontFamily: '"Inter", sans-serif' }} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs / Radial Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Sanyog"
              className="h-14 w-auto object-contain drop-shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none' }} className="items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-blue-100 mt-2 text-sm font-medium tracking-wide">Client Portal — Secure Login</p>
        </div>

        {/* Card */}
        <div style={{ borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} className="bg-white overflow-hidden animate-fade-in">
          
          {/* Step 1: Enter Mobile */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="p-8">
              <div className="mb-8 text-center">
                <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-[14px] text-slate-500 mt-2">Enter your mobile number to securely sign in.</p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[14px]">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-[14px] font-semibold text-slate-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[16px] font-semibold text-slate-600">+91</span>
                    <div className="w-px h-5 bg-slate-200" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full pl-[72px] pr-4 py-3 border border-slate-200 outline-none rounded-xl text-[16px] tracking-wide font-medium text-slate-900 transition-all duration-200 focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/15 placeholder:font-normal placeholder:text-slate-400"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                className={`w-full h-12 text-[16px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  otpLoading || mobile.length !== 10
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#22C55E] text-white hover:bg-[#16A34A] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#22C55E]/20'
                }`}
              >
                {otpLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  : <>Send OTP</>
                }
              </button>

              <p className="text-center text-[14px] text-slate-500 mt-6">
                New here?{" "}
                <Link to="/register" className="text-[#1E3A8A] font-semibold hover:text-[#1E4DB7] transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {otpStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="p-8">
              <button
                type="button"
                onClick={() => { setOtpStep(1); setError(""); setOtpCode(""); }}
                className="flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-[#1E3A8A] transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              <div className="mb-8 text-center">
                <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">Verify OTP</h2>
                <p className="text-[14px] text-slate-500 mt-2">
                  Code sent to <span className="font-semibold text-slate-800">+91 {mobile}</span>
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[14px]">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8">
                <label className="block text-[14px] font-semibold text-slate-700 mb-3 text-center">
                  Enter 6-digit Code
                </label>
                <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className={`w-full h-12 text-[16px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  otpLoading || otpCode.length < 6
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#22C55E] text-white hover:bg-[#16A34A] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#22C55E]/20'
                }`}
              >
                {otpLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                  : <>Verify & Sign In</>
                }
              </button>

              {/* Resend Timer - re-mounts on each send to reset countdown */}
              <ResendTimer key={resendKey} onResend={handleResend} loading={otpLoading} />
            </form>
          )}
        </div>

        <p className="text-center text-blue-200/70 text-xs mt-6">
          © {new Date().getFullYear()} Sanyog Conformity Solutions Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}