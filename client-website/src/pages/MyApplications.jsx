import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Filter, Search, Loader2, PlusCircle,
  RefreshCw, Calendar, Building2, ChevronDown, 
  Clock, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import API from "../services/api";

const STATUS_OPTIONS = [
  { value: "", label: "ALL STATUSES" },
  { value: "submitted", label: "SUBMITTED" },
  { value: "pending", label: "PENDING" },
  { value: "in-progress", label: "IN PROGRESS" },
  { value: "documents_required", label: "DOCS REQUIRED" },
  { value: "approved", label: "APPROVED" },
  { value: "rejected", label: "REJECTED" },
];

const STATUS_CONFIG = {
  submitted: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
  pending: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  "in-progress": { color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: RefreshCw },
  documents_required: { color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: AlertCircle },
  approved: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  rejected: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { color: "bg-slate-500/10 text-slate-500 border-slate-500/20", icon: FileText };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ')}
    </span>
  );
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const filtered = applications.filter((app) => {
    const matchStatus = !filterStatus || app.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (app.serviceName || app.certName || "").toLowerCase().includes(q) ||
      (app.companyName || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const getCount = (status) => applications.filter(a => a.status === status).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase glow-blue">Compliance Portfolio</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">
            {applications.length} ACTIVE REGULATORY ENTRIES DETECTED
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchApps} className="btn-secondary h-12 px-4 text-xs font-black">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => navigate("/apply")} className="btn-primary h-12 px-6 text-xs font-black tracking-widest">
            NEW PROTOCOL <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {STATUS_OPTIONS.slice(1).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(filterStatus === opt.value ? "" : opt.value)}
            className={`px-4 py-2.5 rounded-2xl text-[10px] font-black border transition-all duration-300 uppercase tracking-widest ${
              filterStatus === opt.value
                ? STATUS_CONFIG[opt.value].color + " shadow-lg scale-105"
                : "bg-white dark:bg-[#1C1F2E] border-gray-100 dark:border-[#2A2D3E] text-gray-400 hover:border-primary/40"
            }`}
          >
            {opt.label} <span className="ml-2 opacity-40">[{getCount(opt.value)}]</span>
          </button>
        ))}
      </div>

      {/* Search & Meta Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="FILTER BY SERVICE, COMPANY, OR ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 h-14 font-black text-xs tracking-widest uppercase bg-white dark:bg-[#161923]"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field pl-6 pr-12 h-14 font-black text-xs tracking-widest uppercase bg-white dark:bg-[#161923] w-full lg:w-64 appearance-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 pointer-events-none" />
        </div>
      </div>

      {/* Elegant Data Grid */}
      <div className="card-premium p-1 overflow-hidden relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Syncing Grid...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 dark:bg-[#0B0D13]/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-[#1E293B] m-4">
            <FileText className="w-16 h-16 text-gray-200 dark:text-slate-800 mx-auto mb-6 opacity-30" />
            <h4 className="text-lg font-black text-gray-400 dark:text-slate-600 mb-1 uppercase tracking-tighter">No Compatible Nodes found</h4>
            <p className="text-sm text-gray-300 dark:text-slate-700 font-medium max-w-xs mx-auto mb-10 uppercase tracking-widest text-[10px]">Zero matches for the currently active filter sequence.</p>
            <button onClick={() => { setSearch(""); setFilterStatus(""); }} className="btn-secondary px-8 text-xs font-black">RESET GRID</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0B0D13] border-b border-gray-100 dark:border-[#2A2D3E]">
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-8 py-5">Compliance Layer</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-8 py-5">Corporate Unit</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-8 py-5">Protocol Status</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-8 py-5 hidden xl:table-cell">Initiated</th>
                  <th className="text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest px-8 py-5 hidden lg:table-cell text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#161923]">
                {filtered.map((app) => (
                  <tr key={app._id || app.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none mb-1.5">
                          {app.serviceName || app.certName || "—"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                          {app.serviceGroup || "GLOBAL SCHEME"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-[#1C1F2E] rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#2A2D3E]">
                           <Building2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs font-black text-gray-600 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">{app.companyName || "SECURE UNIT"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-6 hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-[10px] font-black font-mono text-gray-400 uppercase">
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell text-right">
                       <span className="text-[10px] font-black text-primary opacity-40 group-hover:opacity-100 transition-opacity font-mono tracking-widest">
                          #{app._id?.slice(-10).toUpperCase() || "INTERNAL"}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Meta Stats Footer */}
        <div className="px-8 py-4 bg-gray-50/50 dark:bg-[#0B0D13]/50 border-t border-gray-100 dark:border-[#2A2D3E] flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.2em]">
               System Scan: {filtered.length} nodes resolved / {applications.length} total
            </span>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150"></div>
            </div>
        </div>
      </div>
    </div>
  );
}

