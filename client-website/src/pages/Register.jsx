import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Shield, User, Mail, Lock, Phone, Building2, Globe, Eye, EyeOff, Loader2, Check, AlertCircle, ArrowRight, ArrowLeft, Sun, Moon } from "lucide-react";
import API from "../services/api";

const countries = [
  "India", "United States", "United Kingdom", "UAE", "Saudi Arabia", "Germany",
  "France", "Australia", "Canada", "Japan", "Singapore", "Malaysia", "Other"
];

export default function Register() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    mobile: "", company: "", country: "",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Valid email is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const validateStep2 = () => {
    if (!form.mobile.match(/^\d{10}$/)) return "Enter a valid 10-digit mobile number.";
    if (!form.company.trim()) return "Company name is required.";
    if (!form.country) return "Please select your country.";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      // Backend now prioritizes email. mobile is optional or handled later.
      const { data } = await API.post("/auth/register", {
        name: form.name, 
        email: form.email.toLowerCase(), 
        password: form.password,
        company: form.company,
        country: form.country,
        mobile: form.mobile,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Account", icon: User },
    { label: "Company", icon: Building2 },
  ];

  // ─── Dynamic Color Tokens ─────────────────────────────────────────────────
  const bg = isDark ? '#10141D' : '#F1F5F9';
  const cardBg = isDark ? '#161B22' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const cardShadow = isDark ? '0 32px 64px -16px rgba(0,0,0,0.5)' : '0 20px 50px -12px rgba(0,0,0,0.1)';
  const textMain = isDark ? '#FFFFFF' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#475569' : '#94A3B8';
  const inputBg = isDark ? '#0F172A' : '#FFFFFF';
  const inputBorder = isDark ? '#334155' : '#E2E8F0';
  const labelColor = isDark ? '#CBD5E1' : '#374151';

  return (
    <div
      className="min-h-screen font-['Inter'] flex items-center justify-center p-4 antialiased transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDark ? 'radial-gradient(ellipse at 50% 30%, rgba(30,41,59,0.5) 0%, transparent 70%)' : 'none',
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
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <img
              src="/logo.png" alt="Sanyog"
              className="h-12 w-auto object-contain drop-shadow-lg"
              style={{ filter: isDark ? 'none' : 'brightness(0.85)' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div style={{ display: 'none' }} className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
              ><Shield className="w-8 h-8" style={{ color: textMain }} />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: textMain }}>Create Account</h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60" style={{ color: textSub }}>
            Register for Sanyog Client Portal
          </p>
        </div>

        <div
          className="rounded-[2rem] overflow-hidden transition-all duration-500"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
        >
          {/* Progress */}
          <div className="p-6 pb-0">
            <div className="flex items-center mb-6">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                      style={{
                        backgroundColor: step > i + 1 ? '#16A34A' : step === i + 1 ? '#16A34A' : (isDark ? '#1E293B' : '#F1F5F9'),
                        color: step >= i + 1 ? '#FFF' : textMuted,
                        boxShadow: step === i + 1 ? '0 4px 12px rgba(22,163,74,0.3)' : 'none',
                      }}
                    >
                      {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      className="text-xs font-bold hidden sm:block"
                      style={{ color: step === i + 1 ? '#16A34A' : step > i + 1 ? '#16A34A' : textMuted }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 rounded transition-all duration-300" style={{ backgroundColor: step > i + 1 ? '#16A34A' : (isDark ? '#1E293B' : '#E2E8F0') }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 pb-8">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl mb-5 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black tracking-tight mb-4" style={{ color: textMain }}>Account Details</h2>
                {[
                  { label: "Full Name", field: "name", icon: User, type: "text", placeholder: "Your full name" },
                  { label: "Email Address", field: "email", icon: Mail, type: "email", placeholder: "you@company.com" },
                ].map(({ label, field, icon: Icon, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>{label} *</label>
                    <div className="relative">
                      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                      <input
                        type={type} placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) => update(field, e.target.value)}
                        className="w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                        style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                      />
                    </div>
                  </div>
                ))}

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                    <input
                      type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="w-full pl-12 pr-12 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: textMuted }}>
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          form.password.length >= i * 2
                            ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-yellow-400" : i <= 3 ? "bg-blue-400" : "bg-green-400"
                            : isDark ? "bg-slate-700" : "bg-gray-200"
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                    <input
                      type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      className="w-full pl-12 pr-12 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: textMuted }}>
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button onClick={handleNext}
                  className="w-full h-14 text-xs text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-[0.2em] mt-2 cursor-pointer"
                  style={{ backgroundColor: '#14532D', boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14532D'; }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-black tracking-tight mb-4" style={{ color: textMain }}>Company Details</h2>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: textMuted }}>+91</span>
                    <input type="tel" maxLength={10} placeholder="10-digit number"
                      value={form.mobile} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-14 pr-4 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                    <input type="text" placeholder="Your company name"
                      value={form.company} onChange={(e) => update("company", e.target.value)}
                      className="w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: labelColor }}>Country *</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textMuted }} />
                    <select value={form.country} onChange={(e) => update("country", e.target.value)}
                      className="w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30 appearance-none"
                      style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                      color: textSub,
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: '#14532D', boxShadow: '0 8px 24px -4px rgba(20,83,45,0.4)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#14532D'; }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-xs mt-5" style={{ color: textMuted }}>
              Already have an account?{" "}
              <Link to="/login" className="text-[#16A34A] font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-[11px] font-bold uppercase tracking-widest mt-6" style={{ color: textMuted }}>
          © {new Date().getFullYear()} Sanyog Conformity Solutions
        </p>
      </div>
    </div>
  );
}
