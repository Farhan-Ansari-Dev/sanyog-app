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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary to-primary-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sanyog Certify</h1>
          <p className="text-blue-200 mt-1 text-sm">Client Portal — Secure Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

          {/* Step 1: Enter Mobile */}
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} className="p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enter Mobile Number</h2>
                <p className="text-sm text-gray-500 mt-1">We'll send an OTP to your WhatsApp</p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-600">+91</span>
                    <div className="w-px h-5 bg-gray-300" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="input-field pl-16 text-lg tracking-wide font-medium"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Indian mobile numbers only (+91)</p>
              </div>

              <button
                type="submit"
                disabled={otpLoading || mobile.length !== 10}
                style={{ background: otpLoading || mobile.length !== 10 ? '#ccc' : '#25D366' }}
                className="w-full h-12 text-base rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed"
              >
                {otpLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</>
                  : <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Send OTP via WhatsApp
                    </>
                }
              </button>

              <p className="text-center text-sm text-gray-500 mt-5">
                New to Sanyog?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
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
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                  WhatsApp OTP sent to <span className="font-bold text-gray-800">+91 {mobile}</span>
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              {/* 6-Box OTP input */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <OtpBoxInput value={otpCode} onChange={setOtpCode} key={resendKey} />
                <p className="text-xs text-gray-400 text-center mt-2">OTP is valid for 10 minutes</p>
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="btn-primary w-full h-12 text-base"
              >
                {otpLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                  : <><ArrowRight className="w-5 h-5" /> Verify & Sign In</>
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