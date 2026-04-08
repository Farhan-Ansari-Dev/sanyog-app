import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Smartphone, 
  Globe, 
  Palette,
  Eye,
  CheckCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleSave = () => {
    setMsg({ type: "success", text: "Settings saved successfully!" });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Personalize your client portal experience and security preferences.</p>
      </div>

      {msg.text && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Tab List */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-emerald-900/20" 
                    : "bg-white dark:bg-[#1C1F2E] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-[#2A2D3E] hover:border-primary/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="text-sm font-bold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3">
          <div className="card-premium">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-[#2A2D3E] pb-4">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">General Preferences</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure your basic account settings and regional parameters.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-[#2A2D3E] bg-slate-50/50 dark:bg-[#161923]/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">Portal Language</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Protocol Display</p>
                      </div>
                    </div>
                    <select className="bg-white dark:bg-[#1C1F2E] border border-slate-200 dark:border-[#2A2D3E] rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/40 appearance-none min-w-[140px]">
                      <option>ENGLISH (US)</option>
                      <option>HINDI (IN)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-[#2A2D3E] bg-slate-50/50 dark:bg-[#161923]/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">2FA Verification</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary Security Layer</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 dark:bg-[#2A2D3E] rounded-full relative cursor-pointer group">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all group-hover:scale-110"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-[#2A2D3E] pb-4">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 mb-1">
                     <ShieldCheck className="w-5 h-5 text-emerald-500" />
                     Security Protocol
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage encryption barriers and session authentication.</p>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-[#2A2D3E] hover:border-primary/50 transition-all text-left group">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                         <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">Modify Password</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last updated 45 days ago</p>
                       </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button onClick={handleSave} className="btn-primary h-12 px-10 text-[10px] font-black tracking-widest uppercase shadow-xl shadow-emerald-900/10">
                SAVE PARAMETERS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
