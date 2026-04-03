import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, RefreshCw, Loader2, Save, FileText,
  AlertCircle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, X, Trash2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'documents-received', label: 'Documents Received' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'additional-docs-required', label: 'Additional Docs Required' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'certificate-issued', label: 'Certificate Issued' },
];

const STATUS_STYLE = {
  submitted: 'bg-blue-100 text-blue-800',
  'documents-received': 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'additional-docs-required': 'bg-orange-100 text-orange-800',
  documents_required: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  'certificate-issued': 'bg-emerald-100 text-emerald-800',
};

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase().replace(/ /g, '-');
  return <span className={`badge ${STATUS_STYLE[s] || 'bg-gray-100 text-gray-700'} capitalize whitespace-nowrap`}>{(status || '').replace(/-/g, ' ') || '—'}</span>;
}

const PAGE_SIZE = 10;

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [edits, setEdits] = useState({});
  const [feedback, setFeedback] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (groupFilter) params.set('serviceGroup', groupFilter);
      const { data } = await api.get(`/admin/applications?${params}`);
      const list = Array.isArray(data) ? data : data?.applications || [];
      setApps(list);
      const uniqueGroups = [...new Set(list.map(a => a.serviceGroup).filter(Boolean))];
      setGroups(uniqueGroups);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statusFilter, groupFilter]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const filtered = apps.filter(app => {
    const q = search.toLowerCase();
    return !q ||
      (app.companyName || '').toLowerCase().includes(q) ||
      (app.applicantName || '').toLowerCase().includes(q) ||
      (app.mobile || '').includes(q) ||
      (app.serviceName || app.certName || '').toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getEdit = (id, field, fallback) => edits[id]?.[field] ?? fallback;
  const setEdit = (id, field, val) => setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const handleSave = async (app) => {
    const id = app._id || app.id;
    setSaving(s => ({ ...s, [id]: true }));
    try {
      const payload = {};
      if (edits[id]?.status) payload.status = edits[id].status;
      if (edits[id]?.remarks !== undefined) payload.remarks = edits[id].remarks;
      await api.patch(`/admin/applications/${id}`, payload);
      setFeedback(f => ({ ...f, [id]: 'success' }));
      setTimeout(() => setFeedback(f => { const n = {...f}; delete n[id]; return n; }), 3000);
      setApps(prev => prev.map(a => (a._id || a.id) === id ? { ...a, ...payload } : a));
      setEdits(e => { const n = {...e}; delete n[id]; return n; });
    } catch {
      setFeedback(f => ({ ...f, [id]: 'error' }));
      setTimeout(() => setFeedback(f => { const n = {...f}; delete n[id]; return n; }), 3000);
    } finally {
      setSaving(s => ({ ...s, [id]: false }));
    }
  };

  const handleDelete = async (app) => {
    const id = app._id || app.id;
    if (!window.confirm(`Move "${app.companyName || 'this application'}" to trash?`)) return;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      await api.delete(`/admin/applications/${id}`);
      setApps(prev => prev.filter(a => (a._id || a.id) !== id));
      showToast('Application moved to trash. Restore from Trash page.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed', 'error');
    } finally {
      setDeleting(d => ({ ...d, [id]: false }));
    }
  };

  const clearFilters = () => { setSearch(''); setStatusFilter(''); setGroupFilter(''); setPage(1); };

  const stats = [
    { label: 'Total', value: apps.length, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Pending', value: apps.filter(a => ['submitted','pending','under-review'].includes(a.status)).length, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Approved', value: apps.filter(a => ['approved','certificate-issued'].includes(a.status)).length, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  return (
    <AdminLayout title="Applications Management" subtitle="Review and update certification applications">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.msg}
        </div>
      )}
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 border-0 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search company, applicant, mobile..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 h-9 text-xs" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="select-field h-9 text-xs pr-8 min-w-40">
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {groups.length > 0 && (
            <div className="relative">
              <select value={groupFilter} onChange={e => { setGroupFilter(e.target.value); setPage(1); }}
                className="select-field h-9 text-xs pr-8 min-w-40">
                <option value="">All Groups</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          )}
          {(search || statusFilter || groupFilter) && (
            <button onClick={clearFilters} className="btn-ghost h-9 text-xs gap-1.5">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <button onClick={fetchApps} className="btn-ghost h-9 ml-auto">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">{apps.length === 0 ? 'No applications found' : 'No results match your filters'}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header">Client & Company</th>
                    <th className="table-header hidden md:table-cell">Service</th>
                    <th className="table-header hidden lg:table-cell">City</th>
                    <th className="table-header">Status</th>
                    <th className="table-header hidden lg:table-cell">Remarks</th>
                    <th className="table-header hidden xl:table-cell">Date</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((app) => {
                    const id = app._id || app.id;
                    const isSaving = saving[id];
                    const fb = feedback[id];
                    const hasEdits = !!edits[id];
                    return (
                      <tr key={id} className="table-row">
                        <td className="table-cell">
                          <p className="font-semibold text-slate-900 text-xs">{app.companyName || '—'}</p>
                          <p className="text-slate-500 text-xs">{app.applicantName || '—'}</p>
                          <p className="text-slate-400 text-xs">{app.mobile || ''}</p>
                        </td>
                        <td className="table-cell hidden md:table-cell">
                          <p className="text-xs font-medium max-w-[140px] truncate">{app.serviceName || app.certName || '—'}</p>
                          <p className="text-slate-400 text-xs truncate max-w-[140px]">{app.serviceGroup || ''}</p>
                        </td>
                        <td className="table-cell hidden lg:table-cell text-xs text-slate-500">{app.city || '—'}</td>
                        <td className="table-cell">
                          <select
                            value={getEdit(id, 'status', app.status || '')}
                            onChange={e => setEdit(id, 'status', e.target.value)}
                            className="select-field text-xs h-8 min-w-36"
                          >
                            {STATUS_OPTIONS.slice(1).map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="table-cell hidden lg:table-cell">
                          <input
                            type="text"
                            placeholder="Add remarks..."
                            value={getEdit(id, 'remarks', app.remarks || '')}
                            onChange={e => setEdit(id, 'remarks', e.target.value)}
                            className="input-field text-xs h-8 min-w-40"
                          />
                        </td>
                        <td className="table-cell hidden xl:table-cell text-xs text-slate-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            {fb === 'success' && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                            {fb === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                            {(hasEdits || !fb) && (
                              <button
                                onClick={() => handleSave(app)}
                                disabled={isSaving || !hasEdits}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  hasEdits
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Save
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(app)}
                              disabled={deleting[id]}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Move to trash"
                            >
                              {deleting[id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">
                Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg = page <= 3 ? i+1 : page - 2 + i;
                  if (pg < 1 || pg > totalPages) return null;
                  return (
                    <button key={pg} onClick={() => setPage(pg)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${pg === page ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-600'}`}>
                      {pg}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                  className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
