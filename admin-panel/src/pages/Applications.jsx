import React, { useEffect, useMemo, useState } from 'react';

import api from '../services/api.js';

const STATUSES = [
  'Documents Received',
  'Under Review',
  'Submitted to Authority',
  'Query Raised',
  'Approved / Completed',
];

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [serviceGroupFilter, setServiceGroupFilter] = useState('');

  const [drafts, setDrafts] = useState({});

  const openDocument = async (docId) => {
    setError('');
    try {
      const res = await api.get(`/admin/documents/${docId}/signed-url`);
      const url = res?.data?.url;
      if (!url) {
        setError('No URL returned for document');
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to open document');
    }
  };

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (serviceGroupFilter) params.serviceGroup = serviceGroupFilter;

      const res = await api.get('/admin/applications', { params });
      setApps(res.data);
      const nextDrafts = {};
      res.data.forEach((a) => {
        nextDrafts[a._id] = { status: a.status || '', remarks: a.remarks || '' };
      });
      setDrafts(nextDrafts);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const count = useMemo(() => apps.length, [apps]);

  const save = async (id) => {
    setSavingId(id);
    setError('');
    try {
      const payload = drafts[id];
      await api.patch(`/admin/applications/${id}`, payload);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to update application');
    } finally {
      setSavingId('');
    }
  };

  if (loading) {
    return <div className="card">Loading…</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <h2 style={{ marginTop: 0, marginBottom: 0 }}>Applications</h2>
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      <div className="row" style={{ marginTop: 12, marginBottom: 12 }}>
        <div>
          <label className="muted">Status</label>
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className="muted">Service Group</label>
          <select className="select" value={serviceGroupFilter} onChange={(e) => setServiceGroupFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Domestic Certification">Domestic Certification</option>
            <option value="International Certification">International Certification</option>
            <option value="Testing Services">Testing Services</option>
            <option value="Inspection Services">Inspection Services</option>
            <option value="Regulatory Approvals">Regulatory Approvals</option>
          </select>
        </div>
      </div>

      <p className="muted">Total: {count}</p>
      {error ? <p className="error">{error}</p> : null}

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Certification</th>
              <th>Details</th>
              <th>Status / Remarks</th>
              <th>Docs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a._id}>
                <td>
                  <div style={{ fontWeight: 800 }}>{a.userMobile}</div>
                  <div className="muted">Updated: {formatDate(a.updatedAt)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 800 }}>{a.serviceName || a.certification}</div>
                  {a.serviceGroup ? <div className="muted">{a.serviceGroup}</div> : null}
                  <span className="badge">{a.status}</span>
                </td>
                <td>
                  <div><b>Company:</b> {a.companyName || '-'}</div>
                  <div><b>Applicant:</b> {a.applicantName || '-'}</div>
                  <div><b>Email:</b> {a.email || '-'}</div>
                  <div><b>City:</b> {a.city || '-'}</div>
                </td>
                <td style={{ minWidth: 260 }}>
                  <select
                    className="select"
                    value={drafts[a._id]?.status || ''}
                    onChange={(e) => setDrafts((p) => ({ ...p, [a._id]: { ...p[a._id], status: e.target.value } }))}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div style={{ height: 8 }} />
                  <input
                    className="input"
                    value={drafts[a._id]?.remarks || ''}
                    onChange={(e) => setDrafts((p) => ({ ...p, [a._id]: { ...p[a._id], remarks: e.target.value } }))}
                    placeholder="Remarks visible to client"
                  />
                </td>
                <td style={{ minWidth: 180 }}>
                  {(a.documentsMeta || []).length ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {a.documentsMeta.map((d) => (
                        <li key={d._id}>
                          <button className="btn secondary" type="button" onClick={() => openDocument(d._id)}>
                            Open
                          </button>
                          <span className="muted" style={{ marginLeft: 8 }}>
                            {d.originalName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (a.documents || []).length ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {a.documents.map((d) => (
                        <li key={d}>
                          <a href={String(d).startsWith('http') ? d : `${api.defaults.baseURL}${d}`} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="muted">No docs</span>
                  )}
                </td>
                <td>
                  <button className="btn" onClick={() => save(a._id)} disabled={savingId === a._id}>
                    {savingId === a._id ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
