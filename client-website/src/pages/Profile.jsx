import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Globe, 
  Shield, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return {}; }
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-gray-100 dark:border-[#2A2D3E] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 px-2 rounded-xl transition-colors duration-200">
      <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || user.phone || "",
    company: user.company || "",
    country: user.country || "",
  });

  const initial = user.name?.charAt(0)?.toUpperCase() || "U";

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulated
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
    } catch {
      setMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="page-header">
        <h1 className="page-title text-gray-900 dark:text-white">Account Profile</h1>
        <p className="page-subtitle">Manage your personal identification and corporate credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Avatar Card */}
        <div className="lg:col-span-4">
          <div className="card-premium text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
            
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#16A34A] to-emerald-400 rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3">
                <span className="text-4xl font-black text-white -rotate-3">{initial}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-[#1C1F2E] border-4 border-gray-100 dark:border-[#0B0D13] rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl">
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>

            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase">
              {user.name || "Sanyog Partner"}
            </h2>
            <p className="text-[10px] font-black text-primary dark:text-emerald-400 tracking-[0.2em] mt-2 mb-6 uppercase">{user.email || "No email linked"}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="badge bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black tracking-widest py-1 px-3">
                 VERIFIED PROTOCOL
              </span>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-[#2A2D3E] text-left">
               <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-black uppercase tracking-widest">Active nodes</span>
                  <span className="text-gray-900 dark:text-white font-black">12 ACTIVE</span>
               </div>
               <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-black uppercase tracking-widest">Trust Rating</span>
                  <span className="text-emerald-500 font-black">9.8/10</span>
               </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-premium">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Identity Ledger</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Verified registered corporate identification data.</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-secondary h-10 px-6 text-[10px] font-black uppercase tracking-widest">
                  MODIFY
                </button>
              )}
            </div>

            {msg.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 ${
                msg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
              }`}>
                {msg.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-bold">{msg.text}</span>
              </div>
            )}

            {editing ? (
              <form onSubmit={handleSave} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Personal Alias", field: "name", icon: User },
                    { label: "Network Address", field: "email", icon: Mail, type: "email" },
                    { label: "Direct Comms", field: "mobile", icon: Phone, type: "tel" },
                    { label: "Corporate Entity", field: "company", icon: Building2 },
                    { label: "Global Territory", field: "country", icon: Globe },
                  ].map(({ label, field, icon: Icon, type }) => (
                    <div key={field} className={field === "country" ? "md:col-span-2 text-left" : "text-left"}>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 leading-none">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                        <input
                          type={type || "text"}
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          className="input-field pl-12 h-14 font-black text-xs uppercase tracking-widest bg-slate-50/50 dark:bg-[#0B0D13]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary h-14 px-8 text-[10px] font-black uppercase flex-1">
                    ABORT
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary h-14 px-10 text-[10px] font-black uppercase flex-[2]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    {loading ? "TRANSMITTING..." : "COMMIT CHANGES"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Full Identity" value={user.name} />
                <InfoRow icon={Mail} label="Email Network" value={user.email} />
                <InfoRow icon={Phone} label="Mobile Access" value={user.mobile || user.phone} />
                <InfoRow icon={Building2} label="Corporate Entity" value={user.company} />
                <div className="md:col-span-2">
                  <InfoRow icon={Globe} label="Global Territory" value={user.country} />
                </div>
              </div>
            )}
          </div>

          {/* Infrastructure Security */}
          <div className="card shadow-lg bg-gradient-to-br from-[#0B0D13] to-[#161923] p-8 text-white border-0 relative overflow-hidden group rounded-[2.5rem]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all duration-700"></div>
             <div className="relative flex items-center justify-between">
                <div className="space-y-4">
                   <h3 className="text-lg font-black tracking-tighter flex items-center gap-3 uppercase">
                      <Lock className="w-6 h-6 text-emerald-400" />
                      Protocol Security
                   </h3>
                   <p className="text-xs text-slate-400 font-medium max-w-sm">Manage encryption matrices, biometric protocols and active sub-nodes.</p>
                </div>
                <button className="btn-primary h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">
                   CONFIGURE <ArrowRight className="ml-2 w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

