import React, { useEffect, useState } from "react";
import { PhoneCall, Loader2, RefreshCw, Phone, Trash2, MailOpen, AlertCircle } from "lucide-react";
import api from "../services/api";

const STATUSES = ["Open", "In Progress", "Closed"];

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactRequests() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/admin/contact");
      setItems(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load contact requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    setError("");
    try {
      await api.patch(`/admin/contact/${id}`, { status });
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to update request");
    } finally {
      setSavingId("");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Permanently discard this communication log? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/contact/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to log destruction");
    }
  };

  const openCount = items.filter((r) => r.status === "Open" || !r.status).length;
  const inProgressCount = items.filter((r) => r.status === "In Progress").length;

  return (
    <div className="animate-fade-in pb-12">
      {/* Dynamic Inbox Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3">
            Client Communications <span className="text-[12px] px-2 py-0.5 bg-[#22C55E] text-white rounded-md">{openCount} New</span>
          </h1>
          <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8] mt-2">Prioritize and resolve inbound callback requests.</p>
        </div>
        
        <button 
          onClick={load}
          className="h-11 px-6 bg-white dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#333333] text-[14px] text-[#0F172A] dark:text-white font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-[#222222] transition-colors shadow-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync Inbox
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/30 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Triage Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#111111] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#333333] shadow-sm flex flex-col items-start transition-colors">
          <p className="text-[12px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest mb-1">Total Logs</p>
          <div className="text-3xl font-bold text-[#0F172A] dark:text-white">{items.length}</div>
        </div>
        <div className="bg-white dark:bg-[#111111] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#333333] shadow-sm flex flex-col items-start border-l-4 border-l-red-500 transition-colors relative overflow-hidden group">
          <div className="absolute right-0 top-0 opacity-10 p-2"><PhoneCall className="w-16 h-16 text-red-500" /></div>
          <p className="text-[12px] font-bold text-red-500 uppercase tracking-widest mb-1 relative z-10">Unresolved</p>
          <div className="text-3xl font-bold text-[#0F172A] dark:text-white relative z-10">{openCount}</div>
        </div>
        <div className="bg-white dark:bg-[#111111] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#333333] shadow-sm flex flex-col items-start border-l-4 border-l-orange-500 transition-colors">
          <p className="text-[12px] font-bold text-orange-500 uppercase tracking-widest mb-1">In Progress</p>
          <div className="text-3xl font-bold text-[#0F172A] dark:text-white">{inProgressCount}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-[#E2E8F0] dark:border-[#333333] rounded-2xl shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="w-full h-72 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
            <p className="text-[#64748B] dark:text-[#94A3B8] font-medium text-[15px]">Decrypting communication logs...</p>
          </div>
        ) : !items.length ? (
          <div className="flex flex-col items-center justify-center p-16 text-center h-full">
            <div className="w-20 h-20 bg-slate-50 dark:bg-[#222222] rounded-full flex items-center justify-center mb-5 border border-slate-100 dark:border-[#333333]">
               <MailOpen className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white mb-2">Inbox Empty</h3>
            <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8]">All client inquiries have been successfully addressed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-[#080808] border-b border-[#E2E8F0] dark:border-[#333333]">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest w-1/4">Client Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest w-1/3">Message</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#222222] bg-white dark:bg-[#111111]">
                {items.map((r) => {
                  const isNew = r.status === "Open" || !r.status;
                  return (
                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl border ${isNew ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/10 dark:border-red-900/20' : 'bg-slate-50 border-slate-100 dark:bg-[#222222] dark:border-[#333333] text-slate-400 dark:text-slate-500'}`}>
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#0F172A] dark:text-white tracking-wide">{r.userMobile || r.userEmail || "Unknown"}</span>
                            {r.userMobile && r.userEmail && <span className="text-[10px] text-[#64748B] font-medium">{r.userEmail}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {r.message ? (
                          <div className="text-[13px] font-medium text-[#475569] dark:text-[#CBD5E1] line-clamp-2" title={r.message}>{r.message}</div>
                        ) : (
                          <div className="text-[13px] text-[#94A3B8] dark:text-[#64748B] italic">No specific message provided</div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-[#64748B] dark:text-[#94A3B8]">{formatDate(r.createdAt)}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3 items-center">
                          <div className="relative">
                            <select
                                className={`h-10 pl-4 pr-10 text-[13px] font-bold rounded-xl outline-none transition-all min-w-[140px] appearance-none cursor-pointer border ${
                                  r.status === 'Open' || !r.status 
                                  ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 focus:border-red-500' 
                                  : r.status === 'In Progress'
                                  ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/10 dark:border-orange-900/30 dark:text-orange-400 focus:border-orange-500'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400 focus:border-emerald-500'
                                }`}
                                value={r.status || "Open"}
                                onChange={(e) => updateStatus(r._id, e.target.value)}
                                disabled={savingId === r._id}
                              >
                                {STATUSES.map((s) => (
                                  <option key={s} value={s} className="bg-white dark:bg-[#111111] text-[#0F172A] dark:text-white">{s}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteRequest(r._id)}
                            className="p-2.5 text-[#64748B] dark:text-[#94A3B8] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            title="Purge Communication"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
