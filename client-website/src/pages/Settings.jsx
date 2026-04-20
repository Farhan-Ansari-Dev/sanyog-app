import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import { 
  Settings as SettingsIcon, Bell, Lock, Smartphone, Globe, Palette,
  Eye, EyeOff, CheckCircle, ShieldCheck, ChevronRight, Sun, Moon,
  Monitor, AlertCircle, Loader2, Save, Key, BellRing, BellOff
} from "lucide-react";

export default function Settings() {
  const { isDark, toggleTheme, isCompact, toggleCompact } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [user, setUser] = useState(null);

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 2FA state
  const [twoFA, setTwoFA] = useState(false);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    email: true, sms: false, push: true,
    applicationUpdates: true, promotions: false, security: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
        if (res.data.settings) {
          setNotifPrefs(res.data.settings.notifPrefs || notifPrefs);
        }
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, []);

  const saveSettings = async (prefs = notifPrefs) => {
    try {
      await API.put("/auth/me/settings", { 
        notifPrefs: prefs,
        compactMode: isCompact
      });
      showMsg("success", "Settings synchronized successfully.");
    } catch (err) {
      showMsg("error", "Failed to sync settings.");
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      showMsg("error", "Passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put("/auth/me/password", {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass
      });
      showMsg("success", "Password updated successfully.");
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      showMsg("error", err.response?.data?.error || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSmsToggle = async () => {
    if (!notifPrefs.sms && !user?.mobile) {
      const num = window.prompt("Enter your mobile number for SMS notifications:");
      if (!num) return;
      try {
        const res = await API.put("/auth/me", { mobile: num });
        setUser(res.data);
      } catch(e) {
        showMsg("error", "Failed to update mobile number.");
        return;
      }
    }
    const newPrefs = { ...notifPrefs, sms: !notifPrefs.sms };
    setNotifPrefs(newPrefs);
    saveSettings(newPrefs);
  };

  const handleNotifToggle = (key) => {
    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(newPrefs);
    saveSettings(newPrefs);
  };

  const Toggle = ({ checked, onChange }) => (
    <button onClick={onChange}
      className="w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: checked ? '#16A34A' : (isDark ? '#334155' : '#CBD5E1') }}>
      <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm"
        style={{ left: checked ? '28px' : '4px' }} />
    </button>
  );

  const textMain = isDark ? '#E2E8F0' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#64748B' : '#9CA3AF';
  const cardBg = isDark ? '#262F3D' : '#FFFFFF';
  const cardBorder = isDark ? '#334155' : '#F1F5F9';
  const rowBg = isDark ? '#1C222B' : '#F8FAFC';
  const inputBg = isDark ? '#1C222B' : '#FFFFFF';
  const inputBorder = isDark ? '#334155' : '#E2E8F0';

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase" style={{ color: textMain }}>Settings</h1>
        <p className="text-xs font-medium mt-2" style={{ color: textSub }}>
          Personalize your client portal experience and security preferences.
        </p>
      </div>

      {msg.text && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: msg.type === "success" ? (isDark ? 'rgba(22,163,74,0.15)' : '#F0FDF4') : (isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2'),
            border: `1px solid ${msg.type === "success" ? (isDark ? 'rgba(22,163,74,0.3)' : '#BBF7D0') : (isDark ? 'rgba(239,68,68,0.3)' : '#FECACA')}`,
            color: msg.type === "success" ? '#16A34A' : '#EF4444',
          }}>
          {msg.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab List */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#16A34A' : (isDark ? '#1C1F2E' : '#FFFFFF'),
                  color: isActive ? '#FFFFFF' : textSub,
                  border: isActive ? 'none' : `1px solid ${cardBorder}`,
                  boxShadow: isActive ? '0 8px 24px rgba(22,163,74,0.2)' : 'none',
                }}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="rounded-[2.5rem] p-8 transition-all duration-300"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>

            {/* ───────── GENERAL TAB ───────── */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="pb-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <h3 className="text-lg font-black tracking-tight leading-none mb-1" style={{ color: textMain }}>General Preferences</h3>
                  <p className="text-xs font-medium" style={{ color: textSub }}>Configure your basic account settings and regional parameters.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE' }}>
                        <Globe className="w-5 h-5" style={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                      </div>
                      <div>
                        <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>Portal Language</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>Portal language selection</p>
                      </div>
                    </div>
                    <select className="rounded-lg px-3 py-2 text-xs font-bold outline-none appearance-none min-w-[140px]"
                      style={{ backgroundColor: isDark ? '#1C1F2E' : '#FFFFFF', border: `1px solid ${inputBorder}`, color: textMain }}>
                      <option>ENGLISH (US)</option>
                      <option>HINDI (IN)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(168,85,247,0.15)' : '#F3E8FF' }}>
                        <Smartphone className="w-5 h-5" style={{ color: isDark ? '#C084FC' : '#7C3AED' }} />
                      </div>
                      <div>
                        <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>Session Timeout</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>Auto-logout after inactivity</p>
                      </div>
                    </div>
                    <select className="rounded-lg px-3 py-2 text-xs font-bold outline-none appearance-none min-w-[140px]"
                      style={{ backgroundColor: isDark ? '#1C1F2E' : '#FFFFFF', border: `1px solid ${inputBorder}`, color: textMain }}>
                      <option>30 MINUTES</option>
                      <option>1 HOUR</option>
                      <option>4 HOURS</option>
                      <option>NEVER</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ───────── SECURITY TAB ───────── */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="pb-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 mb-1" style={{ color: textMain }}>
                     <ShieldCheck className="w-5 h-5 text-emerald-500" /> Account Security
                  </h3>
                  <p className="text-xs font-medium" style={{ color: textSub }}>Manage passwords and multi-factor authentication.</p>
                </div>

                {/* Password Change Form */}
                <div className="rounded-2xl p-6" style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                  <h4 className="text-sm font-black mb-1 flex items-center gap-2" style={{ color: textMain }}>
                    <Key className="w-4 h-4 text-amber-500" /> Change Password
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: textMuted }}>Update your account password</p>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: textSub }}>Current Password</label>
                      <div className="relative">
                        <input type={showCurrent ? "text" : "password"} value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full pl-4 pr-12 h-12 rounded-xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }} />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: textMuted }}>
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: textSub }}>New Password</label>
                        <div className="relative">
                          <input type={showNew ? "text" : "password"} value={passwordForm.newPass}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                            placeholder="Min. 8 characters"
                            className="w-full pl-4 pr-12 h-12 rounded-xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                            style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }} />
                          <button type="button" onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: textMuted }}>
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: textSub }}>Confirm Password</label>
                        <input type="password" value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          placeholder="Repeat new password"
                          className="w-full pl-4 pr-4 h-12 rounded-xl text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
                          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={passwordLoading || !passwordForm.current || !passwordForm.newPass}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer disabled:opacity-40"
                        style={{ backgroundColor: '#16A34A' }}>
                        {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {passwordLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-5 rounded-2xl" style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5' }}>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>
                        {twoFA ? "Enabled — OTP required at login" : "Disabled — Enable for extra security"}
                      </p>
                    </div>
                  </div>
                  <Toggle checked={twoFA} onChange={() => { setTwoFA(!twoFA); showMsg("success", twoFA ? "2FA has been disabled." : "2FA has been enabled."); }} />
                </div>
              </div>
            )}

            {/* ───────── NOTIFICATIONS TAB ───────── */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="pb-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 mb-1" style={{ color: textMain }}>
                    <BellRing className="w-5 h-5 text-amber-500" /> Notification Preferences
                  </h3>
                  <p className="text-xs font-medium" style={{ color: textSub }}>Choose how and when you receive notifications.</p>
                </div>

                {/* Channels */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: textSub }}>Notification Channels</p>
                  <div className="space-y-3">
                    {[
                      { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Globe, color: "#3B82F6" },
                      { key: "sms", label: "SMS Notifications", desc: user?.mobile ? `Active: ${user.mobile}` : "Get alerts via text message", icon: Smartphone, color: "#8B5CF6" },
                      { key: "push", label: "Push Notifications", desc: "In-app real-time alerts", icon: Bell, color: "#F59E0B" },
                    ].map(({ key, label, desc, icon: Icon, color }) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-2xl"
                        style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: isDark ? `${color}20` : `${color}15` }}>
                            <Icon className="w-5 h-5" style={{ color }} />
                          </div>
                          <div>
                            <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>{label}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>{desc}</p>
                          </div>
                        </div>
                        <Toggle checked={notifPrefs[key]} onChange={() => key === 'sms' ? handleSmsToggle() : handleNotifToggle(key)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: textSub }}>Notification Types</p>
                  <div className="space-y-3">
                    {[
                      { key: "applicationUpdates", label: "Application Updates", desc: "Status changes, approvals, rejections" },
                      { key: "promotions", label: "Promotions & Offers", desc: "Special offers and new services" },
                      { key: "security", label: "Security Alerts", desc: "Login attempts and account changes" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-2xl"
                        style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                        <div>
                          <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>{label}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>{desc}</p>
                        </div>
                        <Toggle checked={notifPrefs[key]} onChange={() => handleNotifToggle(key)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ───────── APPEARANCE TAB ───────── */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div className="pb-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 mb-1" style={{ color: textMain }}>
                    <Palette className="w-5 h-5 text-purple-500" /> Appearance
                  </h3>
                  <p className="text-xs font-medium" style={{ color: textSub }}>Customize how your portal looks and feels.</p>
                </div>

                {/* Theme Selector */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: textSub }}>Theme Mode</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: "dark", label: "Dark Mode", desc: "Easy on the eyes", icon: Moon, active: isDark },
                      { key: "light", label: "Light Mode", desc: "Clean and bright", icon: Sun, active: !isDark },
                      { key: "system", label: "System Default", desc: "Match OS preference", icon: Monitor, active: false },
                    ].map(({ key, label, desc, icon: Icon, active }) => (
                      <button key={key}
                        onClick={() => { if (key === "dark" && !isDark) toggleTheme(); if (key === "light" && isDark) toggleTheme(); }}
                        className="p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer group"
                        style={{
                          backgroundColor: active ? (isDark ? 'rgba(22,163,74,0.1)' : '#F0FDF4') : rowBg,
                          border: `2px solid ${active ? '#16A34A' : cardBorder}`,
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: active ? '#16A34A' : (isDark ? '#1C1F2E' : '#E2E8F0') }}>
                          <Icon className="w-5 h-5" style={{ color: active ? '#FFFFFF' : textMuted }} />
                        </div>
                        <p className="text-sm font-black mb-0.5" style={{ color: textMain }}>{label}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: textSub }}>Accent Color</p>
                  <div className="flex gap-3">
                    {['#16A34A', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899'].map(color => (
                      <button key={color}
                        className="w-10 h-10 rounded-xl transition-all hover:scale-110 cursor-pointer"
                        style={{
                          backgroundColor: color,
                          border: color === '#16A34A' ? '3px solid white' : 'none',
                          boxShadow: color === '#16A34A' ? `0 0 0 2px ${color}` : 'none',
                        }} />
                    ))}
                  </div>
                </div>

                {/* Compact Mode */}
                <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: rowBg, border: `1px solid ${cardBorder}` }}>
                  <div>
                    <p className="text-sm font-black leading-none mb-1" style={{ color: textMain }}>Compact Mode</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>Reduce spacing for more content</p>
                  </div>
                  <Toggle checked={isCompact} onChange={() => { toggleCompact(); saveSettings(); }} />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button onClick={() => saveSettings()}
                className="flex items-center gap-2 px-10 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                style={{ backgroundColor: '#16A34A', boxShadow: '0 8px 24px rgba(22,163,74,0.15)' }}>
                <Save className="w-4 h-4" /> SAVE PARAMETERS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
