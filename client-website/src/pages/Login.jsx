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
    <div className="min-h-screen bg-[#0F172A] font-['Inter'] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#22C55E]/20 selection:text-[#16A34A]">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        
        {/* Minimal Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Sanyog"
            className="h-10 w-auto object-contain drop-shadow-sm mb-6"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none' }} className="items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl mb-6">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* The Premium Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl shadow-black/40 border border-slate-100 overflow-hidden animate-fade-in">
          
          {/* Step 1: Mobile Number */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="px-8 py-10 sm:px-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in</h2>
                <p className="text-[14px] text-slate-500 mt-2 font-medium">To access your Client Portal</p>
              </div>

              {/* Minimal Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium border border-red-100/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[13px] font-medium border border-green-100/50">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-8 relative transition-all">
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Mobile Number</label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-[15px] font-medium text-slate-500 select-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10 digits"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full pl-[56px] pr-4 h-12 bg-slate-50/50 border border-slate-200 outline-none rounded-xl text-[15px] font-medium text-slate-900 transition-all focus:bg-white focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 placeholder:font-normal placeholder:text-slate-400"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                className={`w-full h-12 text-[15px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  otpLoading || mobile.length !== 10
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#22C55E] text-white hover:bg-[#16A34A] hover:shadow-md hover:shadow-[#22C55E]/20 active:scale-[0.98]'
                }`}
              >
                {otpLoading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : "Continue"
                }
              </button>

              <div className="mt-8 text-center">
                <p className="text-[13px] text-slate-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-[#1E3A8A] font-semibold hover:text-[#1E4DB7] transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Verification */}
          {otpStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="px-8 py-10 sm:px-10">
              <div className="text-center mb-8 relative">
                <button
                  type="button"
                  onClick={() => { setOtpStep(1); setError(""); setOtpCode(""); }}
                  className="absolute left-0 top-1 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify it's you</h2>
                <p className="text-[14px] text-slate-500 mt-2 font-medium">
                  Code sent to +91 {mobile}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-[13px] font-medium border border-red-100/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-[#16A34A] px-4 py-3 rounded-xl mb-6 text-[13px] font-medium border border-green-100/50">
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
                className={`w-full h-12 text-[15px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  otpLoading || otpCode.length < 6
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#22C55E] text-white hover:bg-[#16A34A] hover:shadow-md hover:shadow-[#22C55E]/20 active:scale-[0.98]'
                }`}
              >
                {otpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
              </button>

              <div className="mt-8 transition-opacity">
                <ResendTimer key={resendKey} onResend={handleResend} loading={otpLoading} />
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500/70 text-[12px] font-medium tracking-wide">
            © {new Date().getFullYear()} Sanyog Conformity Solutions
          </p>
        </div>
      </div>
    </div>
  );
}