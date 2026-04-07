import { useEffect, useState } from "react";
import { PhoneCall, Loader2, RefreshCw, Phone, Trash2 } from "lucide-react";
import api from "../services/api";

const STATUSES = ["Open", "In Progress", "Closed"];

const STATUS_BADGE = {
  Open: "bg-red-50 text-red-700 border-red-200",
  "In Progress": "bg-orange-50 text-orange-700 border-orange-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

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
    if (!window.confirm("Are you sure you want to permanently delete this contact request?")) return;
    try {
      await api.delete(`/admin/contact/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete request");
    }
  };

  const openCount = items.filter((r) => r.status === "Open" || !r.status).length;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Contact Requests</h1>
          <p className="text-[15px] text-[#64748B] mt-1">Manage client callback requests and inquiries.</p>
        </div>
        
        <button 
          onClick={load}
          className="h-11 px-5 bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-start">
          <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Total</p>
          <div className="text-2xl font-bold text-[#0F172A]">{items.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col items-start border-l-4 border-l-red-500">
          <p className="text-[13px] font-bold text-red-500 uppercase tracking-wider mb-1">Open</p>
          <div className="text-2xl font-bold text-[#0F172A]">{openCount}</div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
            <p className="text-[#64748B] font-medium text-[15px]">Loading requests...</p>
          </div>
        ) : !items.length ? (
          <div className="flex flex-col items-center justify-center p-16 text-center h-full">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
              <PhoneCall className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No contact requests yet</h3>
            <p className="text-[15px] text-[#64748B]">Client callback requests will neatly appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Client Mobile</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Message Description</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Created Timestamp</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white">
                {items.map((r) => {
                  const isNew = r.status === "Open" || !r.status;
                  return (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isNew ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                            <Phone className="w-4 h-4" />
                          </div>
                          <span className="text-[14px] font-bold text-[#0F172A]">{r.userMobile}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-[250px]">
                        {r.message ? (
                          <div className="text-[14px] text-[#475569] truncate" title={r.message}>{r.message}</div>
                        ) : (
                          <div className="text-[14px] text-[#94A3B8] italic">(no specific message)</div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-[#64748B]">{formatDate(r.createdAt)}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3 items-center">
                          <select
                            className="h-10 pl-4 pr-8 bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white transition-all min-w-[140px] appearance-none relative"
                            style={{
                               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'right 12px center'
                            }}
                            value={r.status || "Open"}
                            onChange={(e) => updateStatus(r._id, e.target.value)}
                            disabled={savingId === r._id}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteRequest(r._id)}
                            className="p-2 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Request"
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
