import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, Loader2, RefreshCw, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

export default function Trash() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [confirmPurge, setConfirmPurge] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/applications?showDeleted=true');
      setApps(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to load trash', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id) => {
    setActionId(id);
    try {
      await api.post(`/admin/applications/${id}/restore`);
      setApps(prev => prev.filter(a => a._id !== id));
      showToast('Application restored successfully');
    } catch (err) {
      showToast(err.response?.data?.error || 'Restore failed', 'error');
    } finally { setActionId(null); }
  };

  const handlePurge = async (id) => {
    setActionId(id);
    try {
      await api.delete(`/admin/applications/${id}/purge`);
      setApps(prev => prev.filter(a => a._id !== id));
      showToast('Application permanently deleted');
      setConfirmPurge(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed', 'error');
    } finally { setActionId(null); }
  };

  return (
    <AdminLayout title="Trash" subtitle={`${apps.length} deleted application${apps.length !== 1 ? 's' : ''}`}>
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Purge Confirm Modal */}
      {confirmPurge && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-fade-in">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Permanently Delete?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This action <strong>cannot be undone</strong>. The application and all its data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmPurge(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handlePurge(confirmPurge)} disabled={actionId === confirmPurge} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                {actionId === confirmPurge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Application Trash</h2>
              <p className="text-xs text-slate-400">Deleted applications can be restored or permanently removed</p>
            </div>
          </div>
          <button onClick={fetchTrash} className="btn-ghost p-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Warning */}
        <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          Items in trash were soft-deleted. Restore to bring them back, or purge to permanently remove.
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Trash is empty</p>
            <p className="text-xs text-slate-400 mt-1">Deleted applications will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {apps.map(app => (
              <div key={app._id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{app.companyName || '—'}</p>
                  <p className="text-xs text-slate-500">{app.applicantName} • {app.serviceName || app.certification}</p>
                  <p className="text-xs text-red-400 mt-1">
                    Deleted {app.deletedAt ? new Date(app.deletedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    {app.deletedBy ? ` by ${app.deletedBy}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRestore(app._id)}
                    disabled={actionId === app._id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {actionId === app._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                    Restore
                  </button>
                  <button
                    onClick={() => setConfirmPurge(app._id)}
                    disabled={actionId === app._id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Purge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
