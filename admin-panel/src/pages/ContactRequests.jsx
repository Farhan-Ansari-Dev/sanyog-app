import React, { useEffect, useState } from 'react';

import api from '../services/api.js';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

const STATUSES = ['Open', 'In Progress', 'Closed'];

export default function ContactRequests() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/admin/contact');
      setItems(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    setError('');
    try {
      await api.patch(`/admin/contact/${id}`, { status });
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to update request');
    } finally {
      setSavingId('');
    }
  };

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <h2 style={{ marginTop: 0, marginBottom: 0 }}>Callback Requests</h2>
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id}>
                <td style={{ fontWeight: 800 }}>{r.userMobile}</td>
                <td>{r.message || <span className="muted">(no message)</span>}</td>
                <td className="muted">{formatDate(r.createdAt)}</td>
                <td style={{ minWidth: 220 }}>
                  <select
                    className="select"
                    value={r.status || 'Open'}
                    onChange={(e) => updateStatus(r._id, e.target.value)}
                    disabled={savingId === r._id}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!items.length ? <p className="muted">No requests yet.</p> : null}
    </div>
  );
}
