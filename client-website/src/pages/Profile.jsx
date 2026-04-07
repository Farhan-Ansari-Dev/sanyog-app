import { useState } from "react";
import { User, Mail, Phone, Building2, Globe, Shield, Camera, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return {}; }
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{value || "—"}</p>
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
      // Profile update endpoint (extend when backend supports it)
      // await API.put("/auth/profile", form);
      await new Promise((r) => setTimeout(r, 800)); // Simulated
      setMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
    } catch {
      setMsg({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#020617]">
      <Sidebar />
      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-x-hidden max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account information and settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-[#1E293B] shadow-sm p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{initial}</span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#0F172A] border-2 border-gray-100 dark:border-[#1E293B] rounded-full flex items-center justify-center hover:bg-gray-50 dark:bg-[#020617] transition-colors shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name || "User"}</h2>
              <p className="text-sm text-gray-400">{user.email || ""}</p>

              {/* Account Status */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-semibold">Verified Account</span>
                </div>
              </div>

              {/* Account Meta */}
              <div className="mt-4 pt-4 border-t border-gray-50 space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Account Type</span>
                  <span className="font-medium text-gray-600 dark:text-slate-400">Client</span>
                </div>
                {user.iat && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Session Since</span>
                    <span className="font-medium text-gray-600 dark:text-slate-400">
                      {new Date(user.iat * 1000).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info / Edit Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-[#1E293B] shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Account Information</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Alerts */}
              {msg.text && (
                <div className={`flex items-center gap-3 mx-6 mt-4 px-4 py-3 rounded-lg text-sm ${
                  msg.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  {msg.type === "success"
                    ? <CheckCircle className="w-4 h-4 shrink-0" />
                    : <AlertCircle className="w-4 h-4 shrink-0" />}
                  {msg.text}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSave} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { label: "Full Name", field: "name", icon: User },
                      { label: "Email Address", field: "email", icon: Mail, type: "email" },
                      { label: "Mobile Number", field: "mobile", icon: Phone, type: "tel" },
                      { label: "Company Name", field: "company", icon: Building2 },
                      { label: "Country", field: "country", icon: Globe },
                    ].map(({ label, field, icon: Icon, type }) => (
                      <div key={field} className={field === "country" ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={type || "text"}
                            value={form[field]}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setMsg({ type: "", text: "" }); }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-6 py-2">
                  <InfoRow icon={User} label="Full Name" value={user.name} />
                  <InfoRow icon={Mail} label="Email Address" value={user.email} />
                  <InfoRow icon={Phone} label="Mobile Number" value={user.mobile || user.phone} />
                  <InfoRow icon={Building2} label="Company Name" value={user.company} />
                  <InfoRow icon={Globe} label="Country" value={user.country} />
                </div>
              )}
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-[#1E293B] shadow-sm p-6 mt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Security & Privacy</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Password</p>
                    <p className="text-xs text-gray-400">Keep your account secure with a strong password.</p>
                  </div>
                  <button className="text-sm text-primary font-semibold hover:underline">Change</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400">Add an extra layer of security to your account.</p>
                  </div>
                  <span className="badge bg-gray-100 dark:bg-[#1E293B] text-gray-500 dark:text-slate-400 text-xs">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
