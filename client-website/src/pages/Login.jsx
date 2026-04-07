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
          
          {/* Step 1: Mobile Number */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="px-8 py-10 sm:px-10">
              <div className="text-center mb-8">
                <h2 className="text-[26px] font-bold text-[#0F172A] tracking-tight m-0">Welcome Back</h2>
                <p className="text-[14px] text-[#6B7280] mt-2 font-medium">Enter your mobile number to securely sign in.</p>
              </div>

              {/* Minimal Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px] border border-red-100 font-medium">
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
                <label className="block text-[14px] font-semibold text-[#0F172A] mb-2">Mobile Number</label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-[16px] font-semibold text-[#6B7280] select-none">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="w-full pl-[56px] pr-4 h-14 bg-white border border-[#E5E7EB] outline-none rounded-xl text-[16px] font-medium text-[#0F172A] transition-all duration-200 focus:border-[#22C55E] placeholder:text-[#9CA3AF] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                className="w-full h-14 text-[16px] text-white font-[600] rounded-[10px] bg-[#22C55E] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#16A34A] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] disabled:opacity-65 disabled:pointer-events-none disabled:transform-none disabled:shadow-none"
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Send OTP"}
              </button>

              <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <p className="text-[14px] text-[#6B7280] font-medium">
                  New to Sanyog?{" "}
                  <Link to="/register" className="text-[#0F172A] font-bold hover:text-[#22C55E] hover:underline transition-colors">
                    Create Account
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
                  className="absolute left-0 top-1.5 text-[#6B7280] hover:text-[#0F172A] transition-colors p-1 rounded-lg hover:bg-slate-100"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-[26px] font-bold text-[#0F172A] tracking-tight m-0">Verify OTP</h2>
                <p className="text-[14px] text-[#6B7280] mt-2 font-medium">
                  Code sent to <span className="font-semibold text-[#0F172A]">+91 {mobile}</span>
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-[14px] border border-red-100 font-medium">
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
                <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full h-14 text-[16px] text-white font-[600] rounded-[10px] bg-[#22C55E] flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#16A34A] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] disabled:opacity-65 disabled:pointer-events-none disabled:transform-none disabled:shadow-none"
              >
                {otpLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "Verify & Sign In"}
              </button>

              <div className="mt-8 transition-opacity text-center">
                <ResendTimer key={resendKey} onResend={handleResend} loading={otpLoading} />
              </div>
            </form>
          )}
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