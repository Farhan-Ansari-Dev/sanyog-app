import { useState, useEffect, useCallback } from 'react';
import {
  FolderOpen, Search, ExternalLink, Loader2, FileText,
  FileImage, File, RefreshCw, Download, Eye, AlertCircle, Filter
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const FILE_TYPES = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  jpg: { icon: FileImage, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  jpeg: { icon: FileImage, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  png: { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
  doc: { icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  docx: { icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
};

function getFileType(filename) {
  const ext = (filename || '').split('.').pop().toLowerCase();
  return { ext, ...(FILE_TYPES[ext] || { icon: File, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-[#1E293B]', badge: 'bg-slate-100 text-slate-700' }) };
}

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function Documents() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [openingDoc, setOpeningDoc] = useState(null);
  const [error, setError] = useState('');

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/applications');
      const list = Array.isArray(data) ? data : data?.applications || [];
      // Only include apps that have documents
      setApplications(list.filter(a => a.documents && a.documents.length > 0));
    } catch (e) {
      setError('Failed to load documents. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleViewDoc = async (docId, filename) => {
    setOpeningDoc(docId);
    try {
      const { data } = await api.get(`/admin/documents/${docId}/signed-url`);
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Could not retrieve document URL.');
      }
    } catch (e) {
      alert('Failed to open document. Please try again.');
    } finally {
      setOpeningDoc(null);
    }
  };

  // Flatten docs with app reference
  const allDocs = applications.flatMap(app =>
    (app.documents || []).map(doc => ({ ...doc, app }))
  );

  // Count all unique file types
  const allTypes = [...new Set(allDocs.map(d => {
    const name = d.filename || d.originalName || d.name || '';
    return name.split('.').pop().toLowerCase();
  }).filter(Boolean))];

  const filtered = allDocs.filter(doc => {
    const name = (doc.filename || doc.originalName || doc.name || '').toLowerCase();
    const company = (doc.app?.companyName || '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || company.includes(q);
    const ext = name.split('.').pop();
    const matchType = !typeFilter || ext === typeFilter;
    return matchSearch && matchType;
  });

  // Group filtered docs by application
  const grouped = filtered.reduce((acc, doc) => {
    const appId = doc.app?._id || doc.app?.id || 'unknown';
    if (!acc[appId]) acc[appId] = { app: doc.app, docs: [] };
    acc[appId].docs.push(doc);
    return acc;
  }, {});

  const totalDocs = allDocs.length;

  return (
    <AdminLayout title="Document Management" subtitle="View and access all uploaded client documents">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Documents', value: totalDocs, color: 'text-slate-900', bg: 'bg-slate-100' },
          { label: 'Applications with Docs', value: applications.length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'PDFs', value: allDocs.filter(d => (d.filename || d.name || '').toLowerCase().endsWith('.pdf')).length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Images', value: allDocs.filter(d => /\.(jpg|jpeg|png)$/i.test(d.filename || d.name || '')).length, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 border-0 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 h-9 text-xs"
          />
        </div>
        {allTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setTypeFilter('')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${!typeFilter ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                All
              </button>
              {allTypes.map(t => (
                <button key={t} onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all uppercase ${typeFilter === t ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={fetchDocs} className="btn-ghost h-9 ml-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">{totalDocs === 0 ? 'No documents uploaded yet' : 'No results match your search'}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.values(grouped).map(({ app, docs }) => {
            const appId = app?._id || app?.id;
            return (
              <div key={appId} className="card overflow-hidden">
                {/* App header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-[#1E293B] border-b border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app?.companyName || 'Unknown Company'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app?.serviceName || app?.certName || 'N/A'} •  {docs.length} document{docs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="badge bg-slate-200 text-slate-600 text-xs">
                    App #{(appId || '').slice(-6).toUpperCase()}
                  </span>
                </div>

                {/* Documents grid */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {docs.map((doc, idx) => {
                    const docId = doc._id || doc.id || `${appId}-${idx}`;
                    const filename = doc.filename || doc.originalName || doc.name || `Document ${idx + 1}`;
                    const { ext, icon: Icon, color, bg, badge } = getFileType(filename);
                    const isOpening = openingDoc === docId;

                    return (
                      <div key={docId} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-primary-light hover:shadow-sm transition-all duration-200 group">
                        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={filename}>{filename}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`badge ${badge} text-[10px] uppercase`}>{ext}</span>
                            {doc.size && <span className="text-[10px] text-slate-400">{formatBytes(doc.size)}</span>}
                          </div>
                          {doc.uploadedAt && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                            </p>
                          )}
                          <button
                            onClick={() => handleViewDoc(docId, filename)}
                            disabled={isOpening}
                            className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold hover:underline disabled:opacity-60"
                          >
                            {isOpening ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                            {isOpening ? 'Opening...' : 'View'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
