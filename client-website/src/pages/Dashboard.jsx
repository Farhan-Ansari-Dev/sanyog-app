import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function StatusBadge({ status }) {
  const map = {
    submitted: { label: "Submitted", color: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
    "in-progress": { label: "In Progress", color: "bg-slate-100 text-slate-700" },
    "documents_required": { label: "Docs Required", color: "bg-orange-100 text-orange-700" },
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  };
  const s = map[status] || { label: status, color: "bg-gray-100 dark:bg-[#1E293B] text-gray-600 dark:text-slate-400" };
  return <span className={`badge ${s.color}`}>{s.label}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/10",
    },
    {
      label: "Pending Review",
      value: applications.filter((a) => ["submitted", "pending", "in-progress"].includes(a.status)).length,
      icon: Clock,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/10",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/10",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "rejected").length,
      icon: XCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/10",
    },
  ];

  const handleCallback = async () => {
    setCallbackLoading(true);
    setCallbackMsg("");
    try {
      await API.post("/contact/request", {
        message: "Client has requested a callback from the Sanyog team.",
      });
      setCallbackMsg("✅ Callback request sent!");
    } catch {
      setCallbackMsg("❌ Failed to send request.");
    } finally {
      setCallbackLoading(false);
      setTimeout(() => setCallbackMsg(""), 5000);
    }
  };

  const recentApps = applications.slice(0, 5);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
            Welcome back, {user.name || "Sanyog Partner"} 👋
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
            Reviewing your active certification pipeline and security status.
          </p>
        </div>
        <button onClick={fetchApps} className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-emerald-600 transition-colors font-bold">
          <RefreshCw className="w-4 h-4" /> Sync Stats
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`stat-card relative overflow-hidden group border ${border}`}>
            <div className={`absolute top-0 right-0 w-16 h-16 ${bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{loading ? "—" : value}</div>
            <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card-premium bg-gradient-to-br from-[#16A34A] to-[#15803d] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32"></div>
          <TrendingUp className="w-12 h-12 mb-4 text-white/40" />
          <h3 className="font-black text-2xl tracking-tighter mb-2">Launch Application</h3>
          <p className="text-emerald-50/70 text-sm font-medium mb-6 max-w-xs">
            Begin the certification process for BIS, ISI, CE, marking, and 60+ global schemes instantly.
          </p>
          <button
            onClick={() => navigate("/apply")}
            className="flex items-center gap-2 bg-white text-[#16A34A] font-black px-6 py-3 rounded-xl text-xs hover:scale-105 transition-transform shadow-xl shadow-emerald-900/20"
          >
            NEW APPLICATION <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="card-premium flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#161923] rounded-2xl flex items-center justify-center mb-4">
               <Phone className="w-6 h-6 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 leading-tight">Expert Consultation</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-6">
              Need immediate regulatory guidance? Request a back-call from our compliance architects.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCallback}
              disabled={callbackLoading}
              className="btn-primary text-xs px-6 py-3 bg-emerald-600 hover:bg-emerald-700"
            >
              {callbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              {callbackLoading ? "SENDING..." : "REQUEST CALLBACK"}
            </button>
            {callbackMsg && (
              <p className="text-xs font-black text-emerald-500 animate-in fade-in slide-in-from-left-2">{callbackMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <PlusCircle className="w-5 h-5 text-primary" /> Active Pipeline
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Tracking your 5 most recently updated compliance file entries.</p>
          </div>
          <button
            onClick={() => navigate("/my-applications")}
            className="text-xs font-black text-primary hover:underline hover:translate-x-1 transition-all flex items-center gap-2 tracking-widest"
          >
            EXPLORE ALL <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Hydrating data...</p>
          </div>
        ) : recentApps.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-[#0B0D13]/50 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-[#1E293B]">
            <FileText className="w-16 h-16 text-gray-200 dark:text-slate-800 mx-auto mb-6 opacity-50" />
            <h4 className="text-lg font-black text-gray-400 dark:text-slate-600 mb-1">Zero Records Found</h4>
            <p className="text-sm text-gray-300 dark:text-slate-700 font-medium max-w-xs mx-auto mb-8">You haven't initiated any certification sequences yet. Start your first application today.</p>
            <button onClick={() => navigate("/apply")} className="btn-accent px-8">
              START NOW
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#2A2D3E]">
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-6 py-4">Service Layer</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-6 py-4 hidden md:table-cell">Corporate Unit</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-6 py-4">Lifecycle Status</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-6 py-4 hidden lg:table-cell">Submission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#2A2D3E]">
                {recentApps.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-gray-50/80 dark:hover:bg-[#161923]/80 transition-colors cursor-pointer group">
                    <td className="px-6 py-5 text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {app.serviceName || app.certName || "—"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 dark:text-slate-400 font-medium hidden md:table-cell">
                      {app.companyName || "—"}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-400 dark:text-slate-500 font-bold hidden lg:table-cell font-mono">
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