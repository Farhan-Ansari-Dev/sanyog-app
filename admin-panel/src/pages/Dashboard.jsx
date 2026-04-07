import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Activity, CheckCircle, PhoneCall, ChevronRight, Inbox, Plus, Shield, ArrowUpRight, BarChart3, AlertTriangle } from "lucide-react";
import api from "../services/api";

const STATUS_MAP = {
  "Documents Received": "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
  "Under Review": "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
  "Submitted to Authority": "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
  "Query Raised": "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
  "Approved / Completed": "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
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
    let intervalId;

    const fetchDashboardData = async () => {
      try {
        const [appsRes, contactsRes] = await Promise.all([
          api.get("/admin/applications"),
          api.get("/admin/contact"),
        ]);
        setApps(appsRes.data || []);
        setContacts(contactsRes.data || []);
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Engage true "Live" mode by syncing every 30 seconds silently.
    intervalId = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const statusCounts = {};
  const certCounts = {};
  
  apps.forEach((a) => {
    const s = a.status || "Documents Received";
    const cert = a.serviceName || a.certification || "Uncategorized";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
    certCounts[cert] = (certCounts[cert] || 0) + 1;
  });

  // Calculate top 4 certifications by volume
  const topCerts = Object.entries(certCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const openContacts = contacts.filter((c) => c.status === "Open" || !c.status).length;
  const recent = apps.slice(0, 6);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-[#22C55E]" />
          <div className="absolute inset-0 border-4 border-[#22C55E]/20 rounded-full animate-pulse"></div>
        </div>
        <p className="text-[#64748B] dark:text-[#94A3B8] font-medium text-[15px] mt-6">Syncing Live Sanyog Operations...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-12">
      {/* Dynamic Live Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Operations Center</h1>
            <span className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-200 dark:border-green-800/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8]">Manage Sanyog Conformity clients, regulatory pipelines, and compliance data.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/applications")} className="h-10 px-4 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[13px] font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#22C55E]" /> New Application
          </button>
          <button onClick={() => navigate("/users")} className="h-10 px-4 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-[13px] font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" /> Manage Staff
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-20 h-20 text-blue-600" />
          </div>
          <div className="relative z-10">
            <p className="text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">Total Volume</p>
            <h3 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-none mb-2">{apps.length}</h3>
            <p className="text-[13px] text-[#22C55E] font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> Lifetime submissions
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-20 h-20 text-orange-600" />
          </div>
          <div className="relative z-10">
            <p className="text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">Under Scrutiny</p>
            <h3 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-none mb-2">{statusCounts["Under Review"] || 0}</h3>
            <p className="text-[13px] text-orange-500 font-medium flex items-center gap-1">Action required internally</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-20 h-20 text-red-600" />
          </div>
          <div className="relative z-10">
            <p className="text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">Queries Raised</p>
            <h3 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-none mb-2">{statusCounts["Query Raised"] || 0}</h3>
            <p className="text-[13px] text-red-500 font-medium flex items-center gap-1">Awaiting client fix</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PhoneCall className="w-20 h-20 text-purple-600" />
          </div>
          <div className="relative z-10">
            <p className="text-[13px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">Open Leads</p>
            <h3 className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-none mb-2">{openContacts}</h3>
            <p className="text-[13px] text-purple-500 font-medium flex items-center gap-1">Pending callback</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Feed: Recent Applications */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-[#F1F5F9] dark:border-[#1E293B] flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">Live Pipeline Activity</h2>
              <button 
                onClick={() => navigate("/applications")}
                className="text-[13px] font-bold text-[#22C55E] flex items-center hover:text-[#16A34A] transition-colors group"
              >
                Expand Logs
                <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="p-0 overflow-x-auto flex-1">
              {!recent.length ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-[#1E293B] rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                    <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Pipeline is clear</h3>
                  <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] max-w-[250px]">New certificate enrollments will stream here instantly.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#F8FAFC] dark:bg-[#1E293B]/30 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                      <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Certification</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Stage</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1E293B] bg-white dark:bg-[#0F172A]">
                    {recent.map((app) => {
                      const statusRaw = app.status || "Documents Received";
                      const statusClass = STATUS_MAP[statusRaw] || "bg-slate-50 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
                      
                      return (
                        <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/50 transition-colors cursor-pointer" onClick={() => navigate("/applications")}>
                          <td className="px-6 py-5">
                            <span className="text-[13px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{app.companyName || "—"}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[13px] text-[#475569] dark:text-[#CBD5E1] font-semibold">{app.serviceName || app.certification || "—"}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusClass}`}>
                              {statusRaw}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-medium">{formatDate(app.createdAt)}</span>
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

        {/* Analytics Sider */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Certification Distribution Chart Placeholder */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm p-6 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BarChart3 className="w-24 h-24 text-indigo-600" />
             </div>
             <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1 relative z-10">Volume by Standard</h2>
             <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-medium mb-6 relative z-10">Historical market demand</p>
             
             <div className="space-y-5 relative z-10">
                {topCerts.length === 0 ? (
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[13px]">Insufficient data to map distributions.</p>
                ) : topCerts.map(([name, count], idx) => {
                  const max = apps.length || 1;
                  const pct = Math.round((count / max) * 100);
                  const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
                  return (
                    <div key={name}>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[13px] font-bold text-[#334155] dark:text-[#CBD5E1] truncate pr-4">{name}</span>
                        <span className="text-[12px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-[#1E293B] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${colors[idx % colors.length]}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  )
                })}
             </div>
          </div>

          {/* Core Pipeline Status */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-sm p-6 overflow-hidden">
             <h2 className="text-[16px] font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">State Configuration</h2>
             <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-medium mb-6">Workflow checkpoints overview</p>

             <div className="flex flex-col gap-4">
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
                  <div key={label} className="w-full group">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[13px] font-semibold text-[#334155] dark:text-[#CBD5E1] transition-colors">{label}</span>
                      <span className="text-[13px] font-bold text-[#0F172A] dark:text-[#F8FAFC] bg-slate-50 dark:bg-[#1E293B] px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 dark:bg-[#1E293B] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${info.color}`} style={{ width: `${pct}%` }}></div>
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
