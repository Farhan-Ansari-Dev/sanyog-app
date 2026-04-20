import React, { useState, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, Inbox, Search, RefreshCw, Loader2, Save, FileText, Plus, Trash2, X, FolderTree } from "lucide-react";
import api from "../services/api";
import Skeleton from "../components/Skeleton";

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

  // Bulk Processing & Export State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    userMobile: "", applicantName: "", email: "", companyName: "", serviceName: "", serviceGroup: "", status: "Documents Received", remarks: ""
  });
  const [creating, setCreating] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const triggerDelete = (appId) => {
    setDeleteConfirmId(appId);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/applications/${deleteConfirmId}`);
      await load();
      if (expandedId === deleteConfirmId) setExpandedId(null);
      setDeleteConfirmId(null);
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete");
    } finally {
      setDeleting(false);
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

  // Bulk Operations & CSV Export
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(a => a._id));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || !selectedIds.length) return;
    setBulkProcessing(true);
    try {
      await api.patch('/admin/applications/bulk/update', {
        applicationIds: selectedIds,
        status: bulkStatus
      });
      setSelectedIds([]);
      setBulkStatus("");
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || "Bulk update failed");
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleExportCsv = () => {
    if (!filtered.length) return;
    const headers = ["ID", "Company", "Applicant", "Service", "Mobile", "Status", "Date"];
    const rows = filtered.map(a => [
      a._id,
      `"${(a.companyName || '').replace(/"/g, '""')}"`,
      `"${(a.applicantName || '').replace(/"/g, '""')}"`,
      `"${(a.serviceName || '').replace(/"/g, '""')}"`,
      a.userMobile,
      `"${(a.status || '').replace(/"/g, '""')}"`,
      new Date(a.createdAt).toISOString().split('T')[0]
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DICE_Applications_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">Applications</h1>
          <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8] mt-1">Manage and track all certification applications.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button 
            onClick={handleExportCsv}
            className="h-11 px-5 border border-[#E2E8F0] dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-11 px-5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Plus className="w-5 h-5" />
            Add Application
          </button>
        </div>
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
            className="w-full pl-10 pr-4 h-10 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[14px] text-[#0F172A] dark:text-white rounded-xl outline-none focus:border-[#22C55E] transition-all"
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
          className="h-10 px-5 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[14px] text-[#0F172A] dark:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2 transition-colors w-full md:w-auto justify-center shadow-sm"
          onClick={load}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        <div className="text-[13px] font-semibold text-[#64748B] dark:text-[#94A3B8] bg-slate-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg whitespace-nowrap">
          {filtered.length} Results
        </div>
      </div>

      {/* Bulk Processing Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1E293B] dark:bg-[#0F172A] p-3 rounded-2xl shadow-lg border border-[#334155] dark:border-blue-900/50 mb-6 flex flex-col md:flex-row gap-4 items-center animate-fade-in-up text-white sticky top-20 z-40">
          <div className="px-3 py-1 bg-white/10 rounded-lg text-sm font-bold shadow-inner">
            {selectedIds.length} Selected
          </div>
          <div className="flex-1 w-full md:w-auto relative">
             <select
               className="w-full h-10 px-4 bg-slate-900/50 border border-[#334155] text-[14px] text-white rounded-xl outline-none focus:border-blue-500 appearance-none"
               value={bulkStatus}
               onChange={e => setBulkStatus(e.target.value)}
             >
               <option value="">Choose new status...</option>
               {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || bulkProcessing}
              className="flex-1 md:flex-none h-10 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-[14px] flex items-center gap-2 transition"
            >
              {bulkProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Apply Bulk Change
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#333333] rounded-2xl shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="w-full">
            <div className="bg-[#F8FAFC] dark:bg-[#080808] border-b border-[#E2E8F0] dark:border-[#333333] h-12 flex items-center px-6" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex h-[72px] px-6 items-center gap-4 border-b border-[#F1F5F9] dark:border-[#222222]">
                <Skeleton className="w-[200px] h-10" />
                <Skeleton className="w-[150px] h-10" />
                <Skeleton className="w-[100px] h-8" />
                <div className="flex-1" />
                <Skeleton className="w-[80px] h-8" />
              </div>
            ))}
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
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300" 
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
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
                          } ${selectedIds.includes(a._id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-300 pointer-events-auto"
                              checked={selectedIds.includes(a._id)}
                              onChange={() => toggleSelect(a._id)}
                            />
                          </td>
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
                            <td colSpan={5} className="border-l-4 border-[#22C55E] p-0">
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
                                      <RefreshCw className="w-4 h-4" /> Application Status Control
                                    </h4>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-[13px] font-semibold text-[#334155] dark:text-[#E2E8F0] mb-1.5">Application Status</label>
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
                                          Admin Notes
                                        </label>
                                        <textarea
                                          className="w-full p-3 bg-[#F8FAFC] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] text-[13px] text-[#0F172A] dark:text-white rounded-lg outline-none focus:border-[#22C55E] min-h-[100px] resize-none"
                                          placeholder="Enter internal notes, queries raised to client, or completion details..."
                                          value={editRemarks}
                                          onChange={e => setEditRemarks(e.target.value)}
                                        ></textarea>
                                        <p className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> These notes are visible to the client.
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
                                            onClick={() => setDeleteConfirmId(a._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[13px] font-bold rounded-xl transition-colors border border-red-100 dark:border-red-500/20"
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

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#000000]/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-md rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Delete Application</h3>
              <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                Are you completely sure you want to permanently delete this application? It will be moved to the trash and cannot be undone from this panel.
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-center">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#334155] text-[#334155] dark:text-white font-semibold rounded-xl text-[14px] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                disabled={deleting}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-semibold rounded-xl text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {deleting ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
