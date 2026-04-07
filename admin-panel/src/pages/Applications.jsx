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
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#22C55E] text-white' : 'bg-slate-100 text-[#64748B] dark:bg-[#222222] dark:text-[#94A3B8]'}`}>
                                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                              <div>
                                <div className="font-bold text-[#0F172A] dark:text-white text-[14px]">{a.companyName || "N/A"}</div>
                                <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">{a.serviceName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="font-semibold text-[#334155] dark:text-[#E2E8F0] text-[14px]">{a.applicantName}</div>
                            <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">{a.userMobile}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${badgeClasses}`}>
                              {a.status || "Documents Received"}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-[13px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                            {formatDate(a.createdAt)}
                          </td>
                        </tr>

                        {/* Expanding Configuration Row */}
                        {isExpanded && (
                          <tr className="bg-[#F8FAFC] dark:bg-[#0A0A0A] border-b border-[#E2E8F0] dark:border-[#333333]">
                            <td colSpan={4} className="border-l-4 border-[#22C55E] p-0">
                              <div className="p-6 lg:p-8 animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Left Column: Details & Documents */}
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-[#333333] pb-2">Application Details</h4>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                      <div><p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-0.5">Company</p><p className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{a.companyName || "—"}</p></div>
                                      <div><p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-0.5">Applicant</p><p className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{a.applicantName || "—"}</p></div>
                                      <div><p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-0.5">Service</p><p className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{a.serviceName || "—"}</p></div>
                                      <div><p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-0.5">Mobile</p><p className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{a.userMobile}</p></div>
                                      <div><p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-0.5">Email</p><p className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{a.email || "—"}</p></div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-[#333333] pb-2">Submitted Documents</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {(!a.documentsMeta || a.documentsMeta.length === 0) ? (
                                        <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] italic">No documents uploaded</p>
                                      ) : (
                                        a.documentsMeta.map((doc, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-xl group hover:border-[#22C55E] transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4" />
                                              </div>
                                              <div className="flex flex-col overflow-hidden">
                                                <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white truncate" title={doc.fileName}>{doc.fileName}</span>
                                                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mt-0.5">
                                                  {doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'FILE'}
                                                </span>
                                              </div>
                                            </div>
                                            <button 
                                              onClick={() => downloadDocument(doc.fileId, doc.fileName)}
                                              disabled={downloadingDoc === doc.fileId}
                                              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#333333] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-[#0F172A] dark:hover:text-white transition-colors shrink-0 disabled:opacity-50"
                                              title="Download Document"
                                            >
                                              {downloadingDoc === doc.fileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                            </button>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                  </div>

                                {/* Right Column: Edit Status/Remarks */}
                                <div>
                                  <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-xl p-5 shadow-sm">
                                    <h4 className="text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-[#333333] pb-3 flex items-center gap-2">
                                      <RefreshCw className="w-4 h-4" /> Workflow State Control
                                    </h4>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#E2E8F0] mb-1.5">Application Milestone</label>
                                        <select
                                          className="w-full h-10 px-3 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] text-[13px] font-semibold text-[#0F172A] dark:text-white rounded-lg outline-none focus:border-[#22C55E]"
                                          value={editStatus}
                                          onChange={e => setEditStatus(e.target.value)}
                                        >
                                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                      </div>
                                      
                                      <div>
                                        <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#E2E8F0] mb-1.5 flex justify-between">
                                          Administrative Remarks
                                        </label>
                                        <textarea
                                          className="w-full p-3 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] text-[13px] text-[#0F172A] dark:text-white rounded-lg outline-none focus:border-[#22C55E] min-h-[100px] resize-none"
                                          placeholder="Enter internal notes, queries raised to client, or completion details..."
                                          value={editRemarks}
                                          onChange={e => setEditRemarks(e.target.value)}
                                        ></textarea>
                                        <p className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> These remarks dynamically echo to the client portal.
                                        </p>
                                      </div>

                                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#333333]">
                                        <div className="flex items-center gap-2">
                                            {saveMsg && (
                                              <span className={`text-[12px] font-bold ${saveMsg.includes('Failed') ? 'text-red-500' : 'text-[#22C55E]'}`}>
                                                {saveMsg}
                                              </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                          <button
                                            onClick={() => deleteApplication(a._id)}
                                            className="h-9 px-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                            Purge
                                          </button>
                                          <button
                                            onClick={() => saveChanges(a._id)}
                                            disabled={saving}
                                            className="h-9 px-5 bg-[#0F172A] dark:bg-[#F8FAFC] hover:bg-[#334155] dark:hover:bg-white text-white dark:text-[#0F172A] text-[13px] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                                          >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Commit Changes
                                          </button>
                                        </div>
                                      </div>
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
