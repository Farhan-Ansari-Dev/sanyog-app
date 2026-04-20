import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
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

const STATUS_CFG = {
  submitted: { bg: '#3B82F620', color: '#3B82F6', border: '#3B82F630', icon: FileText, label: 'SUBMITTED' },
  pending: { bg: '#F59E0B20', color: '#F59E0B', border: '#F59E0B30', icon: Clock, label: 'PENDING' },
  "in-progress": { bg: '#6366F120', color: '#6366F1', border: '#6366F130', icon: RefreshCw, label: 'IN PROGRESS' },
  documents_required: { bg: '#F9731620', color: '#F97316', border: '#F9731630', icon: AlertCircle, label: 'DOCS REQUIRED' },
  approved: { bg: '#22C55E20', color: '#22C55E', border: '#22C55E30', icon: CheckCircle, label: 'APPROVED' },
  rejected: { bg: '#EF444420', color: '#EF4444', border: '#EF444430', icon: XCircle, label: 'REJECTED' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || { bg: '#64748B20', color: '#64748B', border: '#64748B30', icon: FileText, label: status };
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

export default function MyApplications() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/applications/my");
      setApplications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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

  const rootBg = isDark ? '#10141D' : '#F8FAFC';
  const sidebarBg = isDark ? '#161B22' : '#FFFFFF';
  const sidebarBorder = isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0';
  const headerBg = isDark ? 'rgba(22,27,34,0.85)' : 'rgba(255,255,255,0.85)';
  const textMain = isDark ? '#F1F5F9' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#64748B' : '#94A3B8';
  const cardBg = isDark ? '#161B22' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0';
  const inputBg = isDark ? '#0F172A' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const hoverRow = isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase" style={{ color: textMain }}>Compliance Portfolio</h1>
          <p className="text-sm font-bold uppercase tracking-widest opacity-60" style={{ color: textSub }}>
            {applications.length} ACTIVE REGULATORY ENTRIES DETECTED
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchApps}
            className="h-12 px-4 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer"
            style={{ backgroundColor: isDark ? '#1E242E' : '#FFFFFF', border: `1px solid ${cardBorder}`, color: textSub }}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => navigate("/apply")}
            className="h-12 px-6 rounded-xl font-black text-xs flex items-center gap-2 bg-[#16A34A] text-white transition-all cursor-pointer uppercase tracking-widest hover:bg-[#15803D]">
            NEW PROTOCOL <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {STATUS_OPTIONS.slice(1).map((opt) => {
          const isActive = filterStatus === opt.value;
          const cfg = STATUS_CFG[opt.value];
          return (
            <button key={opt.value}
              onClick={() => setFilterStatus(isActive ? "" : opt.value)}
              className="px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? cfg.bg : (isDark ? '#1C1F2E' : '#FFFFFF'),
                border: `1px solid ${isActive ? cfg.border : cardBorder}`,
                color: isActive ? cfg.color : textMuted,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}>
              {opt.label} <span className="ml-2 opacity-50">[{getCount(opt.value)}]</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#16A34A] opacity-30" />
          <input type="text" placeholder="FILTER BY SERVICE, COMPANY, OR ID..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 h-14 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
            style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }} />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-64 h-14 px-6 pr-12 rounded-xl text-xs font-black uppercase tracking-widest outline-none appearance-none transition-all focus:ring-2 focus:ring-[#16A34A]/30"
            style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16A34A] opacity-40 pointer-events-none" />
        </div>
      </div>

      {/* Data Grid */}
      <div className="rounded-[2.5rem] overflow-hidden transition-all" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#16A34A] opacity-20" />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: textMuted }}>Syncing Grid...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 m-4 rounded-[2.5rem] border-2 border-dashed"
            style={{ backgroundColor: isDark ? '#0B0D1380' : '#F8FAFC80', borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-20" style={{ color: textMuted }} />
            <h4 className="text-lg font-black mb-1 uppercase tracking-tighter" style={{ color: textSub }}>No Compatible Nodes Found</h4>
            <p className="text-[10px] font-medium max-w-xs mx-auto mb-10 uppercase tracking-widest" style={{ color: textMuted }}>
              Zero matches for the currently active filter sequence.
            </p>
            <button onClick={() => { setSearch(""); setFilterStatus(""); }}
              className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer"
              style={{ backgroundColor: isDark ? '#1E242E' : '#FFFFFF', border: `1px solid ${cardBorder}`, color: textSub }}>
              RESET GRID
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? '#0B0D13' : '#F8FAFC', borderBottom: `1px solid ${cardBorder}` }}>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5" style={{ color: textSub }}>Compliance Layer</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5" style={{ color: textSub }}>Corporate Unit</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5" style={{ color: textSub }}>Protocol Status</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 hidden xl:table-cell" style={{ color: textSub }}>Initiated</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] px-8 py-5 hidden lg:table-cell text-right" style={{ color: textSub }}>Reference</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app._id || app.id}
                    className="transition-colors cursor-pointer group"
                    style={{ borderBottom: `1px solid ${isDark ? '#161923' : '#F1F5F9'}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverRow; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight leading-none mb-1.5 group-hover:text-[#16A34A] transition-colors" style={{ color: textMain }}>
                          {app.serviceName || app.certName || "—"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: textSub }}>
                          {app.serviceGroup || "GLOBAL SCHEME"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: isDark ? '#1C1F2E' : '#F1F5F9', border: `1px solid ${isDark ? '#2A2D3E' : '#E2E8F0'}` }}>
                           <Building2 className="w-4 h-4" style={{ color: textMuted }} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter truncate max-w-[150px]" style={{ color: textSub }}>
                          {app.companyName || "SECURE UNIT"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6"><StatusBadge status={app.status} /></td>
                    <td className="px-8 py-6 hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-[10px] font-black font-mono uppercase" style={{ color: textMuted }}>
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell text-right">
                       <span className="text-[10px] font-black text-[#16A34A] opacity-30 group-hover:opacity-100 transition-opacity font-mono tracking-widest">
                          #{app._id?.slice(-10).toUpperCase() || "INTERNAL"}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between"
          style={{ backgroundColor: isDark ? '#0B0D1380' : '#F8FAFC80', borderTop: `1px solid ${isDark ? '#2A2D3E' : '#E2E8F0'}` }}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: textMuted }}>
               System Scan: {filtered.length} nodes resolved / {applications.length} total
            </span>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
