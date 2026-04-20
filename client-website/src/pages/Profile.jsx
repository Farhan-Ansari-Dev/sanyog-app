import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  User, Mail, Phone, Building2, Globe, Shield, Camera,
  CheckCircle, AlertCircle, Loader2, Lock, ArrowRight
} from "lucide-react";
import API from "../services/api";

function InfoRow({ icon: Icon, label, value, isDark }) {
  return (
    <div className="flex items-start gap-4 py-5 px-2 rounded-xl transition-colors duration-200 cursor-default"
      style={{ borderBottom: `1px solid ${isDark ? '#2A2D3E' : '#F1F5F9'}` }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: isDark ? 'rgba(22,163,74,0.15)' : '#F0FDF4' }}>
        <Icon className="w-5 h-5 text-[#16A34A]" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] mb-1" style={{ color: isDark ? '#64748B' : '#94A3B8' }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{value || "—"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", company: "", country: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          mobile: res.data.mobile || "",
          company: res.data.company || "",
          country: res.data.country || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await API.put("/auth/me", form);
      setUser(res.data);
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
    } catch { 
      setMsg({ type: "error", text: "Failed to update profile." }); 
    } finally { 
      setLoading(false); 
      setTimeout(() => setMsg({ type: "", text: "" }), 4000); 
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: "error", text: "Image must be under 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await API.put("/auth/me", { avatar: reader.result });
        setUser(res.data);
        setMsg({ type: "success", text: "Profile picture updated!" });
      } catch (err) {
        setMsg({ type: "error", text: "Upload failed" });
      }
    };
    reader.readAsDataURL(file);
  };

  const textMain = isDark ? '#E2E8F0' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#64748B' : '#CBD5E1';
  const cardBg = isDark ? '#262F3D' : '#FFFFFF';
  const cardBorder = isDark ? '#334155' : '#F1F5F9';
  const inputBorder = isDark ? '#334155' : '#E2E8F0';

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4" style={{ color: textMain }}>
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A] opacity-20" />
        <p className="text-xs font-black uppercase tracking-widest opacity-40">Loading identity data...</p>
      </div>
    );
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase" style={{ color: textMain }}>Account Profile</h1>
        <p className="text-xs font-medium mt-2" style={{ color: textSub }}>Manage your personal identification and corporate credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Avatar Card */}
        <div className="lg:col-span-4">
          <div className="rounded-[2.5rem] p-8 text-center relative overflow-hidden transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#16A34A] to-emerald-400 rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover -rotate-3" />
                ) : (
                  <span className="text-4xl font-black text-white -rotate-3">{initial}</span>
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl cursor-pointer"
                style={{ backgroundColor: isDark ? '#1C1F2E' : '#FFFFFF', border: `4px solid ${isDark ? '#0B0D13' : '#F1F5F9'}` }}>
                <Camera className="w-4 h-4 text-[#16A34A]" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <h2 className="text-xl font-black tracking-tight leading-tight uppercase" style={{ color: textMain }}>
              {user?.name || "Sanyog Partner"}
            </h2>
            <p className="text-[10px] font-black text-[#16A34A] tracking-[0.2em] mt-2 mb-6 uppercase">{user?.email || "No email linked"}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                style={{ backgroundColor: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16A34A' }}>
                VERIFIED ACCOUNT
              </span>
            </div>
            <div className="space-y-4 pt-6 text-left" style={{ borderTop: `1px solid ${cardBorder}` }}>
               <div className="flex items-center justify-between text-[10px]">
                  <span className="font-black uppercase tracking-widest" style={{ color: textMuted }}>Identity Rank</span>
                  <span className="font-black" style={{ color: textMain }}>PARTNER NODE</span>
               </div>
               <div className="flex items-center justify-between text-[10px]">
                  <span className="font-black uppercase tracking-widest" style={{ color: textMuted }}>Trust Rating</span>
                  <span className="font-black text-emerald-500">9.8/10</span>
               </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[2.5rem] p-8 transition-all" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tighter uppercase" style={{ color: textMain }}>Your Details</h3>
                <p className="text-xs mt-1 font-medium" style={{ color: textSub }}>Manage your personal and company information.</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)}
                  className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all"
                  style={{ backgroundColor: isDark ? '#1E242E' : '#FFFFFF', border: `1px solid ${cardBorder}`, color: textSub }}>
                  MODIFY
                </button>
              )}
            </div>

            {msg.text && (
              <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4"
                style={{
                  backgroundColor: msg.type === "success" ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${msg.type === "success" ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  color: msg.type === "success" ? '#16A34A' : '#EF4444',
                }}>
                {msg.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-bold">{msg.text}</span>
              </div>
            )}

            {editing ? (
              <form onSubmit={handleSave} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", field: "name", icon: User },
                    { label: "Email Address", field: "email", icon: Mail, type: "email" },
                    { label: "Phone Number", field: "mobile", icon: Phone, type: "tel" },
                    { label: "Company", field: "company", icon: Building2 },
                    { label: "Country", field: "country", icon: Globe },
                  ].map(({ label, field, icon: Icon, type }) => (
                    <div key={field} className={field === "country" ? "md:col-span-2 text-left" : "text-left"}>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-3 leading-none" style={{ color: textSub }}>{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16A34A] opacity-50" />
                        <input type={type || "text"} value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          className="w-full pl-12 h-14 rounded-xl text-xs font-black outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                          style={{ backgroundColor: isDark ? '#0B0D13' : '#F8FAFC', border: `1px solid ${inputBorder}`, color: textMain }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditing(false)}
                    className="flex-1 h-14 px-8 rounded-xl font-black text-[10px] uppercase cursor-pointer transition-all"
                    style={{ backgroundColor: isDark ? '#1E242E' : '#FFFFFF', border: `1px solid ${cardBorder}`, color: textSub }}>
                    CANCEL
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] h-14 px-10 rounded-xl font-black text-[10px] uppercase text-white cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ backgroundColor: '#16A34A' }}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {loading ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Full Name" value={user?.name} isDark={isDark} />
                <InfoRow icon={Mail} label="Email Address" value={user?.email} isDark={isDark} />
                <InfoRow icon={Phone} label="Phone Number" value={user?.mobile} isDark={isDark} />
                <InfoRow icon={Building2} label="Company" value={user?.company} isDark={isDark} />
                <div className="md:col-span-2">
                  <InfoRow icon={Globe} label="Country" value={user?.country} isDark={isDark} />
                </div>
              </div>
            )}
          </div>

          {/* Security Banner */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0B0D13] to-[#161923] p-8 text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#16A34A]/20 blur-3xl group-hover:bg-[#16A34A]/40 transition-all duration-700"></div>
             <div className="relative flex items-center justify-between">
                <div className="space-y-4">
                   <h3 className="text-lg font-black tracking-tighter flex items-center gap-3 uppercase">
                      <Lock className="w-6 h-6 text-emerald-400" /> Account Security
                   </h3>
                   <p className="text-xs text-slate-400 font-medium max-w-sm">Change your password, manage login settings and account security.</p>
                </div>
                <button onClick={() => navigate("/settings")}
                  className="bg-[#16A34A] text-white h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-[#15803D] transition-colors shadow-xl shadow-emerald-900/40">
                   CONFIGURE <ArrowRight className="ml-2 w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
