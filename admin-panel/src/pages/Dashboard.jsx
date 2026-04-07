import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const STATUS_MAP = {
  "Documents Received": "badge-blue",
  "Under Review": "badge-orange",
  "Submitted to Authority": "badge-purple",
  "Query Raised": "badge-red",
  "Approved / Completed": "badge-green",
};

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [appsRes, contactsRes] = await Promise.all([
          api.get("/admin/applications"),
          api.get("/admin/contact"),
        ]);
        setApps(appsRes.data || []);
        setContacts(contactsRes.data || []);
      } catch {
        // silently fail — individual pages handle errors
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusCounts = {};
  apps.forEach((a) => {
    const s = a.status || "Documents Received";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const openContacts = contacts.filter(
    (c) => c.status === "Open" || !c.status
  ).length;

  const recent = apps.slice(0, 5);

  if (loading) {
    return (
      <>
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Overview of your Sanyog admin operations</p>
        </div>
        <div className="page-body flex-center" style={{ minHeight: 200 }}>
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your Sanyog admin operations</p>
      </div>

      <div className="page-body">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{apps.length}</div>
            <div className="stat-detail">All time submissions</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Under Review</div>
            <div className="stat-value">
              {statusCounts["Under Review"] || 0}
            </div>
            <div className="stat-detail">Pending review</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value">
              {statusCounts["Approved / Completed"] || 0}
            </div>
            <div className="stat-detail">Completed certifications</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Open Callbacks</div>
            <div className="stat-value">{openContacts}</div>
            <div className="stat-detail">
              Awaiting response
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card mb-16">
          <div className="card-header">
            <h3>Status Breakdown</h3>
          </div>
          <div className="flex gap-12" style={{ flexWrap: "wrap" }}>
            {Object.entries(STATUS_MAP).map(([status, cls]) => (
              <div
                key={status}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                }}
              >
                <span className={`badge ${cls}`}>{status}</span>
                <span className="text-sm text-bold">
                  {statusCounts[status] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/applications")}
            >
              View All →
            </button>
          </div>

          {!recent.length ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Client applications will appear here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((app) => {
                    const statusClass =
                      STATUS_MAP[app.status] || "badge-default";
                    return (
                      <tr key={app._id}>
                        <td className="text-bold">
                          {app.companyName || "—"}
                        </td>
                        <td className="text-sm">
                          {app.serviceName || app.certification || "—"}
                        </td>
                        <td>
                          <span className={`badge ${statusClass}`}>
                            {app.status || "Documents Received"}
                          </span>
                        </td>
                        <td className="text-muted text-sm">
                          {formatDate(app.createdAt)}
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
    </>
  );
}
