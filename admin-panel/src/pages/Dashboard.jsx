import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, XCircle, Phone, TrendingUp,
  RefreshCw, ArrowRight, Loader2, AlertCircle, Eye
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import { getAdminToken } from '../services/auth';

const STATUS_STYLE = {
  submitted: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-indigo-100 text-indigo-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  documents_required: 'bg-orange-100 text-orange-800',
  'additional-docs-required': 'bg-orange-100 text-orange-800',
  'documents-received': 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  'certificate-issued': 'bg-emerald-100 text-emerald-800',
  open: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800',
};

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase().replace(/ /g, '-');
  const cls = STATUS_STYLE[s] || 'bg-gray-100 text-gray-700';
  return <span className={`badge ${cls} capitalize`}>{status?.replace(/-/g, ' ') || '—'}</span>;
}

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); }
  catch { return {}; }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getAdminToken();
  const admin = decodeToken(token);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [appsRes, contactsRes] = await Promise.all([
        api.get('/admin/applications'),
        api.get('/admin/contact'),
      ]);
      setApps(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.applications || []);
      setContacts(Array.isArray(contactsRes.data) ? contactsRes.data : contactsRes.data?.contacts || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const stats = [
    { label: 'Total Applications', value: apps.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Review', value: apps.filter(a => ['submitted','pending','in-progress','under-review'].includes(a.status)).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Approved', value: apps.filter(a => ['approved','certificate-issued'].includes(a.status)).length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Contact Requests', value: contacts.length, icon: Phone, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  const recentApps = apps.slice(0, 10);
  const recentContacts = contacts.slice(0, 5);

  return (
    <AdminLayout title={`${getGreeting()}, ${admin.name || 'Admin'} 👋`} subtitle="Here's what's happening today.">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`stat-card border ${border}`}>
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="xl:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Recent Applications
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest {recentApps.length} entries</p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchAll} className="btn-ghost p-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => navigate('/applications')} className="btn-secondary text-xs px-3 py-1.5">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No applications yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="table-header">Client / Company</th>
                      <th className="table-header hidden sm:table-cell">Service</th>
                      <th className="table-header">Status</th>
                      <th className="table-header hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app) => (
                      <tr key={app._id || app.id} className="table-row">
                        <td className="table-cell">
                          <p className="font-semibold text-slate-900 text-xs">{app.companyName || '—'}</p>
                          <p className="text-slate-400 text-xs">{app.applicantName || app.mobile || '—'}</p>
                        </td>
                        <td className="table-cell hidden sm:table-cell">
                          <p className="text-xs font-medium truncate max-w-[140px]">{app.serviceName || app.certName || '—'}</p>
                          <p className="text-slate-400 text-xs">{app.serviceGroup || ''}</p>
                        </td>
                        <td className="table-cell"><StatusBadge status={app.status} /></td>
                        <td className="table-cell hidden lg:table-cell text-xs text-slate-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Contacts + Quick Actions */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'View All Applications', path: '/applications', icon: FileText },
                { label: 'Contact Requests', path: '/contact', icon: Phone },
                { label: 'Manage Documents', path: '/documents', icon: Eye },
              ].map(({ label, path, icon: Icon }) => (
                <button key={path} onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left border border-slate-100">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" /> Contact Requests
              </h3>
              <button onClick={() => navigate('/contact')} className="text-xs text-primary font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : recentContacts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No requests</div>
              ) : recentContacts.map((c) => (
                <div key={c._id || c.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900">{c.mobile || c.name || 'Unknown'}</span>
                    <StatusBadge status={c.status || 'open'} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.message || '—'}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
