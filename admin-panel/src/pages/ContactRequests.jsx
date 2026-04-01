import { useState, useEffect, useCallback } from 'react';
import { Phone, RefreshCw, Loader2, Save, AlertCircle, CheckCircle, MessageSquare, Calendar, Filter } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_STYLE = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-700',
};

const FILTER_OPTIONS = [
  { value: '', label: 'All Requests' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];

function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLE[(status||'').toLowerCase()] || 'bg-gray-100 text-gray-700'} capitalize`}>
      {(status || 'open').replace(/-/g, ' ')}
    </span>
  );
}

export default function ContactRequests() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [feedback, setFeedback] = useState({});

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/contact');
      const list = Array.isArray(data) ? data : data?.contacts || [];
      setContacts(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const filtered = filter ? contacts.filter(c => (c.status || 'open') === filter) : contacts;

  const getStatus = (c) => {
    const id = c._id || c.id;
    return selectedStatus[id] ?? (c.status || 'open');
  };

  const handleSave = async (c) => {
    const id = c._id || c.id;
    setSaving(s => ({ ...s, [id]: true }));
    try {
      await api.patch(`/admin/contact/${id}`, { status: getStatus(c) });
      setFeedback(f => ({ ...f, [id]: 'success' }));
      setContacts(prev => prev.map(p => (p._id || p.id) === id ? { ...p, status: getStatus(c) } : p));
      setTimeout(() => setFeedback(f => { const n = {...f}; delete n[id]; return n; }), 3000);
    } catch {
      setFeedback(f => ({ ...f, [id]: 'error' }));
      setTimeout(() => setFeedback(f => { const n = {...f}; delete n[id]; return n; }), 3000);
    } finally {
      setSaving(s => ({ ...s, [id]: false }));
    }
  };

  const counts = {
    total: contacts.length,
    open: contacts.filter(c => (c.status || 'open') === 'open').length,
    'in-progress': contacts.filter(c => c.status === 'in-progress').length,
    closed: contacts.filter(c => c.status === 'closed').length,
  };

  return (
    <AdminLayout title="Contact & Callback Requests" subtitle="Manage incoming client contact requests">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total', value: counts.total, color: 'text-slate-900', bg: 'bg-slate-100' },
          { label: 'Open', value: counts.open, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'In Progress', value: counts['in-progress'], color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Closed', value: counts.closed, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 border-0 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Refresh */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === opt.value ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-light'
              }`}
            >
              {opt.label}
              {opt.value ? ` (${counts[opt.value] || 0})` : ` (${counts.total})`}
            </button>
          ))}
        </div>
        <button onClick={fetchContacts} className="btn-ghost ml-auto h-9">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline text-xs">Refresh</span>
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No contact requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const id = c._id || c.id;
            const isSaving = saving[id];
            const fb = feedback[id];
            const curStatus = getStatus(c);
            const hasChanged = selectedStatus[id] !== undefined && selectedStatus[id] !== (c.status || 'open');

            return (
              <div key={id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.mobile || c.name || 'Unknown Client'}</p>
                      {c.email && <p className="text-xs text-slate-400">{c.email}</p>}
                    </div>
                  </div>
                  <StatusBadge status={c.status || 'open'} />
                </div>

                {/* Message */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">Message</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.message || 'No message provided.'}</p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {c.createdAt ? new Date(c.createdAt).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  }) : 'Unknown date'}
                </div>

                {/* Status update */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <select
                    value={curStatus}
                    onChange={e => setSelectedStatus(s => ({ ...s, [id]: e.target.value }))}
                    className="select-field text-xs h-9 flex-1"
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSave(c)}
                    disabled={isSaving || !hasChanged}
                    className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      hasChanged ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     fb === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> :
                     fb === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> :
                     <Save className="w-3.5 h-3.5" />}
                    {isSaving ? 'Saving...' : fb === 'success' ? 'Saved!' : fb === 'error' ? 'Error' : 'Update'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
