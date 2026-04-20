import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FileText, Clock, CheckCircle, XCircle, PlusCircle,
  Phone, RefreshCw, ArrowRight, TrendingUp, AlertCircle, Loader2
} from "lucide-react";
import API from "../services/api";

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return {}; }
}

function StatusBadge({ status, isDark }) {
  const map = {
    submitted: { label: "Submitted", bg: isDark ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981', border: isDark ? 'rgba(16,185,129,0.2)' : '#A7F3D0' },
    pending: { label: "Pending", bg: isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB', color: '#F59E0B', border: isDark ? 'rgba(245,158,11,0.2)' : '#FDE68A' },
    "in-progress": { label: "In Progress", bg: isDark ? 'rgba(99,102,241,0.15)' : '#EEF2FF', color: '#6366F1', border: isDark ? 'rgba(99,102,241,0.2)' : '#C7D2FE' },
    "documents_required": { label: "Docs Required", bg: isDark ? 'rgba(249,115,22,0.15)' : '#FFF7ED', color: '#F97316', border: isDark ? 'rgba(249,115,22,0.2)' : '#FED7AA' },
    approved: { label: "Approved", bg: isDark ? 'rgba(34,197,94,0.15)' : '#F0FDF4', color: '#22C55E', border: isDark ? 'rgba(34,197,94,0.2)' : '#BBF7D0' },
    rejected: { label: "Rejected", bg: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', color: '#EF4444', border: isDark ? 'rgba(239,68,68,0.2)' : '#FECACA' },
  };
  const s = map[status] || { label: status, bg: isDark ? '#1E293B' : '#F1F5F9', color: isDark ? '#94A3B8' : '#64748B', border: isDark ? '#334155' : '#E2E8F0' };
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackMsg, setCallbackMsg] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/applications/my");
      setApplications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  const textMain = isDark ? '#FFFFFF' : '#0F172A';
  const textSub = isDark ? '#CBD5E1' : '#64748B';
  const textMuted = isDark ? '#94A3B8' : '#94A3B8';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
  const tableBorder = isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9';
  const hoverRow = isDark ? 'rgba(255,255,255,0.05)' : '#FAFAFA';

  const stats = [
    { label: "Total Applications", value: applications.length, icon: FileText, nav: "/my-applications" },
    { label: "Pending Review", value: applications.filter((a) => {
      const s = (a.status || "").toLowerCase();
      return !s.includes("approved") && !s.includes("rejected");
    }).length, icon: Clock, nav: "/my-applications" },
    { label: "Approved", value: applications.filter((a) => (a.status || "").toLowerCase().includes("approved")).length, icon: CheckCircle, nav: "/my-applications" },
    { label: "Rejected", value: applications.filter((a) => (a.status || "").toLowerCase().includes("rejected")).length, icon: XCircle, nav: "/my-applications" },
  ];

  const handleCallback = async () => {
    setCallbackLoading(true);
    setCallbackMsg("");
    try {
      await API.post("/contact/request", { message: "Client has requested a callback from the Sanyog team." });
      setCallbackMsg("✅ Callback request sent!");
    } catch { setCallbackMsg("❌ Failed to send request."); }
    finally { setCallbackLoading(false); setTimeout(() => setCallbackMsg(""), 5000); }
  };

  const recentApps = applications.slice(0, 5);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-none mb-2" style={{ color: textMain }}>
            Welcome back, {user.name || "Sanyog Partner"} 👋
          </h1>
          <p className="text-sm font-medium" style={{ color: textSub }}>
            Here's an overview of your applications and account activity.
          </p>
        </div>
        <button onClick={fetchApps}
          className="hidden md:flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
          style={{ color: textSub }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#16A34A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textSub; }}>
          <RefreshCw className="w-4 h-4" /> Sync Stats
        </button>
      </div>

      {/* Stats — CLICKABLE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label}
            onClick={() => navigate(stat.nav)}
            className="relative overflow-hidden group rounded-[2rem] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-100 text-[#16A34A] dark:bg-emerald-900/10 dark:border-emerald-900/20 relative shadow-sm w-fit mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] absolute -top-0.5 -right-0.5 animate-pulse"></div>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black tracking-tighter mb-1" style={{ color: textMain }}>{loading ? "—" : stat.value}</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: textSub }}>{stat.label}</div>
            <ArrowRight className="absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#16A34A]" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#16A34A] to-[#15803d] text-white relative overflow-hidden group p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32"></div>
          <TrendingUp className="w-12 h-12 mb-4 text-white/40" />
          <h3 className="font-black text-2xl tracking-tighter mb-2">Launch Application</h3>
          <p className="text-emerald-50/70 text-sm font-medium mb-6 max-w-xs">
            Begin the certification process for BIS, ISI, CE, marking, and 60+ global schemes instantly.
          </p>
          <button onClick={() => navigate("/apply")}
            className="flex items-center gap-2 bg-white text-[#16A34A] font-black px-6 py-3 rounded-xl text-xs hover:scale-105 transition-transform shadow-xl shadow-emerald-900/20 cursor-pointer">
            NEW APPLICATION <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
          <div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: isDark ? '#161923' : '#F1F5F9' }}>
               <Phone className="w-6 h-6" style={{ color: textMuted }} />
            </div>
            <h3 className="font-black text-xl mb-2 leading-tight" style={{ color: textMain }}>Expert Consultation</h3>
            <p className="text-sm font-medium mb-6" style={{ color: textSub }}>
              Need immediate regulatory guidance? Request a back-call from our compliance architects.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleCallback} disabled={callbackLoading}
              className="text-xs px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 uppercase tracking-wider">
              {callbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              {callbackLoading ? "SENDING..." : "REQUEST CALLBACK"}
            </button>
            {callbackMsg && <p className="text-xs font-black text-emerald-500">{callbackMsg}</p>}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="rounded-[2.5rem] p-8 transition-all duration-300"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3" style={{ color: textMain }}>
              <PlusCircle className="w-5 h-5 text-[#16A34A]" /> Active Pipeline
            </h2>
            <p className="text-xs mt-1 font-medium" style={{ color: textSub }}>Tracking your 5 most recently updated compliance file entries.</p>
          </div>
          <button onClick={() => navigate("/my-applications")}
            className="text-xs font-black text-[#16A34A] hover:underline transition-all flex items-center gap-2 tracking-widest cursor-pointer">
            EXPLORE ALL <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#16A34A] opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: textMuted }}>Loading...</p>
          </div>
        ) : recentApps.length === 0 ? (
          <div className="text-center py-20 rounded-[2rem] border-2 border-dashed"
            style={{ backgroundColor: isDark ? 'rgba(11,13,19,0.5)' : 'rgba(248,250,252,0.5)', borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-30" style={{ color: textMuted }} />
            <h4 className="text-lg font-black mb-1" style={{ color: textSub }}>No Applications Yet</h4>
            <p className="text-sm font-medium max-w-xs mx-auto mb-8" style={{ color: textMuted }}>
              You haven't submitted any applications yet. Start one now!
            </p>
            <button onClick={() => navigate("/apply")}
              className="bg-[#16A34A] text-white font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer hover:bg-[#15803D] transition-colors">
              START NOW
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${tableBorder}` }}>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4" style={{ color: textSub }}>Service</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 hidden md:table-cell" style={{ color: textSub }}>Company</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4" style={{ color: textSub }}>Status</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 hidden lg:table-cell" style={{ color: textSub }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id || app.id}
                    className="transition-colors cursor-pointer group"
                    style={{ borderBottom: `1px solid ${tableBorder}` }}
                    onClick={() => navigate("/my-applications")}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverRow; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="px-6 py-5 text-sm font-black transition-colors" style={{ color: textMain }}>
                      {app.serviceName || app.certName || "—"}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium hidden md:table-cell" style={{ color: textSub }}>
                      {app.companyName || "—"}
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={app.status} isDark={isDark} /></td>
                    <td className="px-6 py-5 text-xs font-bold hidden lg:table-cell font-mono" style={{ color: textMuted }}>
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}