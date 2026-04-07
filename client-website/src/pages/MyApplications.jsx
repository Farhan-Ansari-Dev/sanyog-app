import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Filter, Search, Loader2, PlusCircle,
  RefreshCw, Calendar, Building2, ChevronDown
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "documents_required", label: "Docs Required" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  submitted: "bg-blue-100 text-blue-700 border border-blue-200",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "in-progress": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  documents_required: "bg-orange-100 text-orange-700 border border-orange-200",
  approved: "bg-green-100 text-green-700 border border-green-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

const STATUS_LABELS = {
  submitted: "Submitted",
  pending: "Pending",
  "in-progress": "In Progress",
  documents_required: "Docs Required",
  approved: "Approved",
  rejected: "Rejected",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-gray-100 dark:bg-[#1E293B] text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-[#334155]";
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`badge ${style} capitalize`}>{label}</span>
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

  // Stats summary
  const counts = STATUS_OPTIONS.slice(1).reduce((acc, s) => {
    acc[s.value] = applications.filter((a) => a.status === s.value).length;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#020617]">
      <Sidebar />
      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">{applications.length} total application{applications.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchApps} className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-primary transition-colors border border-gray-200 dark:border-[#334155] px-3 py-2 rounded-lg bg-white dark:bg-[#0F172A]">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => navigate("/apply")} className="btn-primary text-sm px-4 py-2.5">
              <PlusCircle className="w-4 h-4" /> New Application
            </button>
          </div>
        </div>

        {/* Mini stat pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { label: "Pending", status: "pending", color: "yellow" },
            { label: "Approved", status: "approved", color: "green" },
            { label: "Rejected", status: "rejected", color: "red" },
          ].map(({ label, status, color }) => (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? "" : status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterStatus === status
                  ? STATUS_STYLES[status]
                  : "bg-white dark:bg-[#0F172A] border-gray-200 dark:border-[#334155] text-gray-600 dark:text-slate-400 hover:border-gray-300"
              }`}
            >
              {label} ({counts[status] || 0})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 h-10 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 pr-8 h-10 text-sm w-full sm:w-48 appearance-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-[#1E293B] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold text-base">
                {applications.length === 0 ? "No applications yet" : "No results found"}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {applications.length === 0
                  ? "Submit your first certification application to get started."
                  : "Try adjusting your search or filter."}
              </p>
              {applications.length === 0 && (
                <button onClick={() => navigate("/apply")} className="btn-primary mt-5 text-sm px-5 py-2.5">
                  <PlusCircle className="w-4 h-4" /> Apply Now
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#020617] border-b border-gray-100 dark:border-[#1E293B]">
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Service</th>
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Company</th>
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Date Applied</th>
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((app) => (
                      <tr key={app._id || app.id} className="hover:bg-gray-50 dark:bg-[#020617] transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {app.serviceName || app.certName || "—"}
                          </p>
                          {app.serviceGroup && (
                            <p className="text-xs text-gray-400 mt-0.5">{app.serviceGroup}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-slate-400">{app.companyName || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map((app) => (
                  <div key={app._id || app.id} className="p-4 hover:bg-gray-50 dark:bg-[#020617] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm flex-1 pr-2">
                        {app.serviceName || app.certName || "—"}
                      </p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <Building2 className="w-3 h-3" /> {app.companyName || "—"}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer count */}
              <div className="px-6 py-3 border-t border-gray-50 bg-gray-50 dark:bg-[#020617]/50">
                <p className="text-xs text-gray-400">
                  Showing {filtered.length} of {applications.length} applications
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
