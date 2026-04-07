import React, { useState, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, Inbox, Search, RefreshCw, Loader2, Save, FileText, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";

const STATUS_OPTIONS = [
  "Documents Received",
  "Under Review",
  "Submitted to Authority",
  "Query Raised",
  "Approved / Completed",
];

const STATUS_BADGE = {
  "Documents Received": "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-orange-50 text-orange-700 border-orange-200",
  "Submitted to Authority": "bg-purple-50 text-purple-700 border-purple-200",
  "Query Raised": "bg-red-50 text-red-700 border-red-200",
  "Approved / Completed": "bg-green-50 text-green-700 border-green-200",
};

const SERVICE_GROUPS = [
  "Domestic Certification",
  "International Certification",
  "Testing Services",
  "Inspection Services",
];

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getDocIcon(mime) {
  if (mime === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
  if (mime?.startsWith("image/")) return <FileText className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-slate-500" />;
}

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [search, setSearch] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [downloadingDoc, setDownloadingDoc] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    userMobile: "", applicantName: "", email: "", companyName: "", serviceName: "", serviceGroup: "", status: "Documents Received", remarks: ""
  });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterGroup) params.serviceGroup = filterGroup;
      const res = await api.get("/admin/applications", { params });
      setApps(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatus, filterGroup]);

  const toggleExpand = (app) => {
    if (expandedId === app._id) {
      setExpandedId(null);
    } else {
      setExpandedId(app._id);
      setEditStatus(app.status || "Documents Received");
      setEditRemarks(app.remarks || "");
      setSaveMsg("");
    }
  };

  const saveChanges = async (appId) => {
    setSaving(true);
    setSaveMsg("");
    try {
      await api.patch(`/admin/applications/${appId}`, {
        status: editStatus,
        remarks: editRemarks,
      });
      setSaveMsg("Saved successfully!");
      await load();
    } catch (e) {
      setSaveMsg(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application? It will be moved to the trash.")) return;
    try {
      await api.delete(`/admin/applications/${appId}`);
      await load();
      if (expandedId === appId) setExpandedId(null);
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/applications", createForm);
      setShowCreateModal(false);
      setCreateForm({
        userMobile: "", applicantName: "", email: "", companyName: "", serviceName: "", serviceGroup: "", status: "Documents Received", remarks: ""
      });
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to create application");
    } finally {
      setCreating(false);
    }
  };

  const downloadDocument = async (docId, fileName) => {
    setDownloadingDoc(docId);
    try {
      const res = await api.get(`/admin/documents/${docId}/signed-url`);
      const url = res.data?.url;
      if (url) {
        window.open(url, "_blank");
      }
    } catch (e) {
      alert("Failed to get download link: " + (e?.response?.data?.error || e.message));
    } finally {
      setDownloadingDoc("");
    }
  };

  const filtered = apps.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (a.companyName || "").toLowerCase().includes(q) ||
      (a.applicantName || "").toLowerCase().includes(q) ||
      (a.serviceName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.userMobile || "").includes(q)
    );
  });

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">Applications</h1>
          <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8] mt-1">Manage all client certification applications sequentially.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="h-11 px-5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Application
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-[#111111] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#333333] shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="w-full pl-10 pr-4 h-10 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all"
            placeholder="Search company, name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-auto">
          <select
            className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] text-[14px] text-[#0F172A] dark:text-[#F8FAFC] rounded-xl outline-none focus:border-[#22C55E] appearance-none cursor-pointer"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <div className="relative w-full md:w-56">
          <FolderTree className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] text-[14px] text-[#0F172A] dark:text-[#F8FAFC] rounded-xl outline-none focus:border-[#22C55E] appearance-none cursor-pointer"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Service Groups</option>
            {SERVICE_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <button 
          className="h-10 px-5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] text-[14px] text-[#0F172A] font-medium rounded-xl hover:bg-slate-50 dark:bg-[#1E293B] flex items-center gap-2 transition-colors w-full md:w-auto justify-center shadow-sm"
          onClick={load}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        <div className="text-[13px] font-semibold text-[#64748B] bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
          {filtered.length} Results
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#333333] rounded-2xl shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
            <p className="text-[#64748B] dark:text-[#94A3B8] font-medium text-[15px]">Loading applications...</p>
          </div>
        ) : !filtered.length ? (
          <div className="flex flex-col items-center justify-center p-16 text-center h-full">
            <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white mb-2">No applications found</h3>
            <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8]">Client submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-[#080808] border-b border-[#E2E8F0] dark:border-[#333333]">
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Company & Service</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#222222] bg-white dark:bg-[#111111]">
                {filtered.map((a) => {
                  const isExpanded = expandedId === a._id;
                  const badgeClasses = STATUS_BADGE[a.status] || "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                  return (
                    <React.Fragment key={a._id}>
                      {/* Main row */}
                      <tr 
                        onClick={() => toggleExpand(a)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-50 dark:bg-[#1A1A1A]' : 'hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'
                        }`}
                      >
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold border ${badgeCls}`}>
                            {app.status || "Documents Received"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {docCount > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[12px] font-bold border border-slate-200">
                              <FileText className="w-3.5 h-3.5" />
                              {docCount}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[13px] text-[#64748B] font-medium">{formatDate(app.createdAt)}</span>
                        </td>
                      </tr>

                      {/* Expanding Configuration Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50 dark:bg-[#1E293B]/50">
                          <td colSpan={7} className="border-b-2 border-[#22C55E]/20 p-0">
                            <div className="p-6 lg:p-8 animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                              
                              {/* Left Column: Details & Documents */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Application Details</h4>
                                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div><p className="text-[12px] text-[#64748B] mb-0.5">Company</p><p className="text-[14px] font-semibold text-[#0F172A]">{app.companyName || "—"}</p></div>
                                    <div><p className="text-[12px] text-[#64748B] mb-0.5">Applicant</p><p className="text-[14px] font-semibold text-[#0F172A]">{app.applicantName || "—"}</p></div>
                                    <div><p className="text-[12px] text-[#64748B] mb-0.5">Email</p><p className="text-[14px] font-semibold text-[#0F172A] break-all">{app.email || "—"}</p></div>
                                    <div><p className="text-[12px] text-[#64748B] mb-0.5">City</p><p className="text-[14px] font-semibold text-[#0F172A]">{app.city || "—"}</p></div>
                                  </div>
                                  {app.description && (
                                    <div className="mt-4 bg-white dark:bg-[#0F172A] p-3 rounded-lg border border-slate-200 text-[14px] text-[#475569]">
                                      <span className="font-semibold text-slate-700 block mb-1">Description:</span>
                                      {app.description}
                                    </div>
                                  )}
                                </div>

                                {docCount > 0 && (
                                  <div>
                                    <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Uploaded Documents</h4>
                                    <div className="space-y-3 lg:max-h-[300px] lg:overflow-y-auto pr-2">
                                      {app.documentsMeta.map((doc) => (
                                        <div key={doc._id} className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] p-3 rounded-xl flex items-center gap-3 shadow-sm hover:border-[#22C55E]/50 transition-colors">
                                          <div className="p-2 bg-slate-50 dark:bg-[#1E293B] rounded-lg">
                                            {getDocIcon(doc.mimeType)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-[#0F172A] truncate" title={doc.originalName}>{doc.originalName}</p>
                                            <p className="text-[12px] text-[#64748B] mt-0.5">{formatBytes(doc.sizeBytes)} • {formatDate(doc.createdAt)}</p>
                                          </div>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); downloadDocument(doc._id, doc.originalName); }}
                                            disabled={downloadingDoc === doc._id}
                                            className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A] hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E] transition-all disabled:opacity-50 flex-shrink-0"
                                            title="Download Document"
                                          >
                                            {downloadingDoc === doc._id ? <Loader2 className="w-5 h-5 animate-spin text-[#22C55E]" /> : <Download className="w-5 h-5" />}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Column: Edit Status/Remarks */}
                              <div>
                                <div className="bg-white dark:bg-[#0F172A] p-5 rounded-2xl border border-[#E2E8F0] shadow-sm sticky top-4">
                                  <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">Update Pipeline Stage</h4>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Official Status</label>
                                      <select
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] font-medium text-[#0F172A] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all shadow-sm"
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                      >
                                        {STATUS_OPTIONS.map((s) => (
                                          <option key={s} value={s}>{s}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[13px] font-semibold text-[#334155] mb-1.5 flex justify-between">
                                        Remarks
                                        <span className="text-[#94A3B8] font-normal text-xs">Visible to Client</span>
                                      </label>
                                      <textarea
                                        className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all shadow-sm resize-none min-h-[100px]"
                                        value={editRemarks}
                                        onChange={(e) => setEditRemarks(e.target.value)}
                                        placeholder="Add notes, next steps, or specific queries..."
                                      />
                                    </div>

                                    <div className="pt-2">
                                      <button
                                        onClick={() => saveChanges(app._id)}
                                        disabled={saving}
                                        className="w-full h-11 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-[14px] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                      >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {saving ? "Updating..." : "Save Changes"}
                                      </button>
                                      {saveMsg && (
                                        <p className={`mt-3 text-[13px] font-bold text-center ${saveMsg.includes("success") ? "text-[#16A34A]" : "text-red-500"}`}>
                                          {saveMsg}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex justify-end">
                                    <button 
                                      onClick={() => deleteApplication(app._id)}
                                      className="h-10 px-4 flex items-center gap-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-[13px] rounded-lg transition-colors border border-red-100 hover:border-red-500 w-full justify-center"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Application
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative bg-white dark:bg-[#0F172A] w-full max-w-2xl rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
              <h2 className="text-[18px] font-bold text-[#0F172A]">Create New Application</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Mobile Number *</label>
                  <input required type="text" className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.userMobile} onChange={e => setCreateForm({...createForm, userMobile: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Service Name *</label>
                  <input required type="text" className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.serviceName} onChange={e => setCreateForm({...createForm, serviceName: e.target.value})} placeholder="e.g. BIS Registration" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Applicant Name</label>
                  <input type="text" className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.applicantName} onChange={e => setCreateForm({...createForm, applicantName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Company Name</label>
                  <input type="text" className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.companyName} onChange={e => setCreateForm({...createForm, companyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Email</label>
                  <input type="email" className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Service Group</label>
                  <select className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]" value={createForm.serviceGroup} onChange={e => setCreateForm({...createForm, serviceGroup: e.target.value})}>
                    <option value="">Select Group (Optional)</option>
                    {SERVICE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Initial Remarks</label>
                <textarea className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E] resize-none min-h-[80px]" value={createForm.remarks} onChange={e => setCreateForm({...createForm, remarks: e.target.value})} />
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreateModal(false)} className="h-11 px-5 text-[14px] font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={creating} className="h-11 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-70 text-white text-[14px] font-semibold rounded-xl flex items-center gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
