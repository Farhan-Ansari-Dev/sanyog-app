import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Trash2, Shield, Eye, EyeOff, Search,
  RefreshCw, Loader2, AlertCircle, CheckCircle, X, Edit2,
  Phone, Building2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
  Lock, Mail, UserCheck, UserX, Clock, Calendar, Badge
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { getAdminToken } from '../services/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); }
  catch { return {}; }
}

const ROLE_STYLES = {
  admin: 'bg-purple-100 text-purple-800',
  ops: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-700',
};
const ROLE_LABELS = { admin: 'Super Admin', ops: 'Operations', viewer: 'Viewer' };

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900 text-center mb-2">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Staff Modal ──────────────────────────────────────────────────────────
function AddStaffModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ops' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => { setForm({ name: '', email: '', password: '', role: 'ops' }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/admin/users/staff', form);
      onSuccess(data);
      reset();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user.');
    } finally { setLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Staff Member</h3>
              <p className="text-xs text-slate-400">Create a new admin portal account</p>
            </div>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="btn-ghost p-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field pl-9 text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role *</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="select-field pl-9 text-sm">
                  <option value="ops">Operations</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" placeholder="staff@sanyog.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field pl-9 text-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pl-9 pr-10 text-sm" required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role info */}
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
            <p><span className="font-semibold text-purple-700">Super Admin:</span> Full access, can manage staff</p>
            <p><span className="font-semibold text-blue-700">Operations:</span> Manage applications & contacts</p>
            <p><span className="font-semibold text-gray-600">Viewer:</span> Read-only access</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { reset(); onClose(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Staff Modal ─────────────────────────────────────────────────────────
function EditStaffModal({ open, user, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', role: 'ops', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name, role: user.role, password: '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    if (form.password && form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const payload = { name: form.name, role: form.role };
      if (form.password) payload.password = form.password;
      await api.patch(`/admin/users/staff/${user._id}`, payload);
      onSuccess({ ...user, ...payload });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user.');
    } finally { setLoading(false); }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit {user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="select-field text-sm">
              <option value="ops">Operations</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type={showPw ? 'text' : 'password'} placeholder="New password (optional)"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pl-9 pr-10 text-sm" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Staff Tab ────────────────────────────────────────────────────────────────
function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [notify, setNotify] = useState({ type: '', msg: '' });

  const token = getAdminToken();
  const me = decodeToken(token);

  const showNotify = (type, msg) => {
    setNotify({ type, msg });
    setTimeout(() => setNotify({ type: '', msg: '' }), 3500);
  };

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users/staff');
      setStaff(data);
    } catch { showNotify('error', 'Failed to load staff list.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const handleToggleActive = async (user) => {
    const id = user._id;
    setTogglingId(id);
    try {
      await api.patch(`/admin/users/staff/${id}`, { isActive: !user.isActive });
      setStaff(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
      showNotify('success', `${user.name} ${!user.isActive ? 'activated' : 'deactivated'}.`);
    } catch { showNotify('error', 'Failed to update status.'); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/staff/${confirm.id}`);
      setStaff(prev => prev.filter(u => u._id !== confirm.id));
      showNotify('success', `${confirm.name} deleted successfully.`);
      setConfirm(null);
    } catch (err) {
      showNotify('error', err.response?.data?.error || 'Failed to delete user.');
    } finally { setDeleteLoading(false); }
  };

  const filtered = staff.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const isAdmin = me.role === 'admin' || me.role === 'superadmin';

  return (
    <>
      <AddStaffModal open={showAdd} onClose={() => setShowAdd(false)}
        onSuccess={u => { setStaff(prev => [u, ...prev]); showNotify('success', `${u.name} created successfully.`); }} />
      <EditStaffModal open={!!editUser} user={editUser} onClose={() => setEditUser(null)}
        onSuccess={updated => { setStaff(prev => prev.map(u => u._id === updated._id ? { ...u, ...updated } : u)); showNotify('success', 'Staff updated.'); }} />
      <ConfirmModal open={!!confirm} title="Delete Staff Member"
        message={`Are you sure you want to permanently delete "${confirm?.name}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleteLoading} />

      {/* Notification toast */}
      {notify.msg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in ${notify.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notify.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notify.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 h-9 text-xs" />
        </div>
        <button onClick={fetchStaff} className="btn-ghost h-9">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        {isAdmin && (
          <button onClick={() => setShowAdd(true)} className="btn-primary h-9">
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Staff', value: staff.length, color: 'text-slate-900', bg: 'bg-slate-100' },
          { label: 'Active', value: staff.filter(u => u.isActive).length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Inactive', value: staff.filter(u => !u.isActive).length, color: 'text-red-700', bg: 'bg-red-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 border-0 ${bg}`}>
            <p className={`text-xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{staff.length === 0 ? 'No staff members' : 'No results'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Staff Member</th>
                  <th className="table-header hidden sm:table-cell">Role</th>
                  <th className="table-header hidden md:table-cell">Status</th>
                  <th className="table-header hidden lg:table-cell">Last Login</th>
                  <th className="table-header hidden lg:table-cell">Created</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const isSelf = user.email === me.email;
                  return (
                    <tr key={user._id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 ${user.isActive ? 'bg-primary' : 'bg-slate-300'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              {user.name}
                              {isSelf && <span className="badge bg-blue-100 text-blue-700 text-[10px] py-0">You</span>}
                            </p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className={`badge ${ROLE_STYLES[user.role] || 'bg-gray-100 text-gray-700'}`}>
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      </td>
                      <td className="table-cell hidden md:table-cell">
                        <button
                          onClick={() => isAdmin && !isSelf && handleToggleActive(user)}
                          disabled={togglingId === user._id || !isAdmin || isSelf}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${!isAdmin || isSelf ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
                        >
                          {togglingId === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : user.isActive ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-green-500" />
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                              <span className="text-slate-400">Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="table-cell hidden lg:table-cell text-xs text-slate-400">
                        {user.lastLoginAt ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(user.lastLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="table-cell hidden lg:table-cell text-xs text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAdmin && (
                            <button onClick={() => setEditUser(user)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAdmin && !isSelf && (
                            <button onClick={() => setConfirm({ id: user._id, name: user.name })}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
    </>
  );
}

// ─── Clients Tab ──────────────────────────────────────────────────────────────
function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortDir, setSortDir] = useState('desc');
  const [notify, setNotify] = useState({ type: '', msg: '' });

  const showNotify = (type, msg) => {
    setNotify({ type, msg });
    setTimeout(() => setNotify({ type: '', msg: '' }), 3500);
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users/clients');
      setClients(data);
    } catch { showNotify('error', 'Failed to load clients.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/clients/${confirm.id}`);
      setClients(prev => prev.filter(c => c._id !== confirm.id));
      showNotify('success', `Client ${confirm.mobile} deleted.`);
      setConfirm(null);
    } catch (err) {
      showNotify('error', err.response?.data?.error || 'Failed to delete client.');
    } finally { setDeleteLoading(false); }
  };

  const filtered = clients
    .filter(c => !search || c.mobile.includes(search))
    .sort((a, b) => {
      const da = new Date(a.lastActivity || 0);
      const db = new Date(b.lastActivity || 0);
      return sortDir === 'desc' ? db - da : da - db;
    });

  return (
    <>
      <ConfirmModal open={!!confirm} title="Delete Client User"
        message={`Delete client ${confirm?.mobile}? Their login access will be removed. Applications data is kept.`}
        onConfirm={handleDelete} onCancel={() => setConfirm(null)} loading={deleteLoading} />

      {notify.msg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in ${notify.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notify.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notify.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Clients', value: clients.length, color: 'text-slate-900', bg: 'bg-slate-100' },
          { label: 'Verified', value: clients.filter(c => c.isVerified).length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'With Apps', value: clients.filter(c => c.applications > 0).length, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 border-0 ${bg}`}>
            <p className={`text-xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by mobile number..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 h-9 text-xs" />
        </div>
        <button
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="btn-ghost h-9 text-xs gap-1.5"
        >
          {sortDir === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
        <button onClick={fetchClients} className="btn-ghost h-9">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{clients.length === 0 ? 'No registered clients yet' : 'No results found'}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header">Mobile Number</th>
                    <th className="table-header hidden sm:table-cell">Status</th>
                    <th className="table-header hidden md:table-cell">Applications</th>
                    <th className="table-header hidden lg:table-cell">Last Activity</th>
                    <th className="table-header hidden lg:table-cell">Registered</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(client => (
                    <tr key={client._id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{client.mobile}</p>
                            <p className="text-[10px] text-slate-400">Client ID: {String(client._id).slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        {client.isVerified ? (
                          <span className="badge bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                            <UserCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                            <UserX className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="table-cell hidden md:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${client.applications > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                          {client.applications} app{client.applications !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="table-cell hidden lg:table-cell text-xs text-slate-400">
                        {client.lastActivity ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(client.lastActivity).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="table-cell hidden lg:table-cell text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(client.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-end">
                          <button onClick={() => setConfirm({ id: client._id, mobile: client.mobile })}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {clients.length} clients</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserManagement() {
  const [tab, setTab] = useState('staff'); // 'staff' | 'clients'

  return (
    <AdminLayout title="User Management" subtitle="Manage admin staff and client users">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { id: 'staff', label: 'Admin Staff', icon: Shield },
          { id: 'clients', label: 'Client Users', icon: Phone },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === id
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'staff' ? <StaffTab /> : <ClientsTab />}
    </AdminLayout>
  );
}
