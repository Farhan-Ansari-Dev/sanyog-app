import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Activity, CheckCircle, PhoneCall, ChevronRight, Inbox } from "lucide-react";
import api from "../services/api";

const STATUS_MAP = {
  "Documents Received": "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-orange-50 text-orange-700 border-orange-200",
  "Submitted to Authority": "bg-purple-50 text-purple-700 border-purple-200",
  "Query Raised": "bg-red-50 text-red-700 border-red-200",
  "Approved / Completed": "bg-green-50 text-green-700 border-green-200",
};

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [appsRes, contactsRes] = await Promise.all([
          api.get("/admin/applications"),
          api.get("/admin/contact"),
        ]);
        setApps(appsRes.data || []);
        setContacts(contactsRes.data || []);
      } catch {
        // silently fail — individual pages handle errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusCounts = {};
  apps.forEach((a) => {
    const s = a.status || "Documents Received";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const openContacts = contacts.filter(
    (c) => c.status === "Open" || !c.status
  ).length;

  const recent = apps.slice(0, 5);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
        <p className="text-[#64748B] font-medium text-[15px]">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Dashboard Overview</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Real-time metrics and recent activities across your operations.</p>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Total</p>
            <h3 className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{apps.length}</h3>
            <p className="text-[13px] text-[#94A3B8] font-medium">All submissions</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Under Review</p>
            <h3 className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{statusCounts["Under Review"] || 0}</h3>
            <p className="text-[13px] text-[#94A3B8] font-medium">Pending action</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Approved</p>
            <h3 className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{statusCounts["Approved / Completed"] || 0}</h3>
            <p className="text-[13px] text-[#94A3B8] font-medium">Fully certified</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Callbacks</p>
            <h3 className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{openContacts}</h3>
            <p className="text-[13px] text-[#94A3B8] font-medium">Open requests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Table Area */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center bg-white dark:bg-[#0F172A]">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Recent Applications</h2>
              <button 
                onClick={() => navigate("/applications")}
                className="text-[14px] font-semibold text-[#22C55E] flex items-center hover:text-[#16A34A] transition-colors group"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="p-0 overflow-x-auto flex-1">
              {!recent.length ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-[#1E293B] rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Inbox className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">No applications found</h3>
                  <p className="text-[14px] text-[#64748B] max-w-[250px]">New client submissions will actively populate this feed.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-6 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] bg-white dark:bg-[#0F172A]">
                    {recent.map((app) => {
                      const statusRaw = app.status || "Documents Received";
                      const statusClass = STATUS_MAP[statusRaw] || "bg-slate-50 dark:bg-[#1E293B] text-slate-700 border-slate-200";
                      
                      return (
                        <tr key={app._id} className="hover:bg-slate-50 dark:bg-[#1E293B]/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-semibold text-[#0F172A]">{app.companyName || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[14px] text-[#475569] font-medium">{app.serviceName || app.certification || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold border ${statusClass}`}>
                              {statusRaw}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[13px] text-[#64748B] font-medium">{formatDate(app.createdAt)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Status Pipeline Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-5 border-b border-[#F1F5F9] bg-white dark:bg-[#0F172A]">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Pipeline Distribution</h2>
              <p className="text-[13px] text-[#64748B] mt-1 font-medium">Volumetric breakdown by stage</p>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              {Object.entries({
                "Documents Received": { color: "bg-blue-500", raw: "Documents Received" },
                "Under Review": { color: "bg-orange-500", raw: "Under Review" },
                "Submitted": { color: "bg-purple-500", raw: "Submitted to Authority" },
                "Query Raised": { color: "bg-red-500", raw: "Query Raised" },
                "Approved": { color: "bg-green-500", raw: "Approved / Completed" },
              }).map(([label, info]) => {
                const count = statusCounts[info.raw] || 0;
                const max = Math.max(1, apps.length);
                const pct = Math.round((count / max) * 100);

                return (
                  <div key={label} className="w-full">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[14px] font-semibold text-[#334155]">{label}</span>
                      <span className="text-[14px] font-bold text-[#0F172A]">{count}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${info.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
