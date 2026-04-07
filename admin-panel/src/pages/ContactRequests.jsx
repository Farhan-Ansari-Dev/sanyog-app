import { useEffect, useState } from "react";
import api from "../services/api";

const STATUSES = ["Open", "In Progress", "Closed"];

const STATUS_BADGE = {
  Open: "badge-red",
  "In Progress": "badge-orange",
  Closed: "badge-green",
};

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString();
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

  const openCount = items.filter((r) => r.status === "Open" || !r.status).length;

  return (
    <>
      <div className="page-header">
        <h2>Contact Requests</h2>
        <p>
          Manage client callback requests — {openCount} open
        </p>
      </div>

      <div className="page-body">
        {error && <p className="text-error mb-16">{error}</p>}

        <div className="flex-between mb-16">
          <div className="flex gap-12">
            <div className="stat-card" style={{ padding: "12px 20px" }}>
              <span className="text-xs text-muted" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Total</span>
              <div className="text-bold" style={{ fontSize: 20, marginTop: 2 }}>{items.length}</div>
            </div>
            <div className="stat-card" style={{ padding: "12px 20px" }}>
              <span className="text-xs text-muted" style={{ textTransform: "uppercase", letterSpacing: 1 }}>Open</span>
              <div className="text-bold" style={{ fontSize: 20, marginTop: 2, color: "var(--accent-red)" }}>{openCount}</div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={load}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 48 }}>
            <div className="spinner"></div>
          </div>
        ) : !items.length ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📞</div>
              <h3>No contact requests yet</h3>
              <p>Client callback requests will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
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
                {items.map((r) => {
                  const badgeCls = STATUS_BADGE[r.status] || "badge-red";
                  return (
                    <tr key={r._id}>
                      <td className="text-bold">{r.userMobile}</td>
                      <td className="text-sm">
                        {r.message || (
                          <span className="text-muted">(no message)</span>
                        )}
                      </td>
                      <td className="text-muted text-sm">
                        {formatDate(r.createdAt)}
                      </td>
                      <td style={{ minWidth: 180 }}>
                        <select
                          className="select"
                          value={r.status || "Open"}
                          onChange={(e) =>
                            updateStatus(r._id, e.target.value)
                          }
                          disabled={savingId === r._id}
                          style={{ width: "auto", minWidth: 160 }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
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
