import React, { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = [
  "Documents Received",
  "Under Review",
  "Submitted to Authority",
  "Query Raised",
  "Approved / Completed",
];

const STATUS_BADGE = {
  "Documents Received": "badge-blue",
  "Under Review": "badge-orange",
  "Submitted to Authority": "badge-purple",
  "Query Raised": "badge-red",
  "Approved / Completed": "badge-green",
};

const SERVICE_GROUPS = [
  "Domestic Certification",
  "International Certification",
  "Testing Services",
  "Inspection Services",
];

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getDocIcon(mime) {
  if (mime === "application/pdf") return "📄";
  if (mime?.startsWith("image/")) return "🖼️";
  return "📎";
}

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [search, setSearch] = useState("");

  // Expanded row
  const [expandedId, setExpandedId] = useState(null);

  // Editing
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Document download
  const [downloadingDoc, setDownloadingDoc] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterGroup) params.serviceGroup = filterGroup;
      const res = await api.get("/admin/applications", { params });
      setApps(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatus, filterGroup]);

  const toggleExpand = (app) => {
    if (expandedId === app._id) {
      setExpandedId(null);
    } else {
      setExpandedId(app._id);
      setEditStatus(app.status || "Documents Received");
      setEditRemarks(app.remarks || "");
      setSaveMsg("");
    }
  };

  const saveChanges = async (appId) => {
    setSaving(true);
    setSaveMsg("");
    try {
      await api.patch(`/admin/applications/${appId}`, {
        status: editStatus,
        remarks: editRemarks,
      });
      setSaveMsg("Saved successfully!");
      await load();
    } catch (e) {
      setSaveMsg(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const downloadDocument = async (docId, fileName) => {
    setDownloadingDoc(docId);
    try {
      const res = await api.get(`/admin/documents/${docId}/signed-url`);
      const url = res.data?.url;
      if (url) {
        window.open(url, "_blank");
      }
    } catch (e) {
      alert("Failed to get download link: " + (e?.response?.data?.error || e.message));
    } finally {
      setDownloadingDoc("");
    }
  };

  // Client-side search filter
  const filtered = apps.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (a.companyName || "").toLowerCase().includes(q) ||
      (a.applicantName || "").toLowerCase().includes(q) ||
      (a.serviceName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.userMobile || "").includes(q)
    );
  });

  return (
    <>
      <div className="page-header">
        <h2>Applications</h2>
        <p>Manage all client certification applications</p>
      </div>

      <div className="page-body">
        {error && <p className="text-error mb-16">{error}</p>}

        {/* Filters */}
        <div className="filters-bar">
          <input
            className="input input-inline"
            placeholder="Search company, name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 240 }}
          />

          <select
            className="select input-inline"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="select input-inline"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Service Groups</option>
            {SERVICE_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={load}>
            ↻ Refresh
          </button>

          <span className="text-muted text-sm" style={{ marginLeft: "auto" }}>
            {filtered.length} application{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex-center" style={{ padding: 48 }}>
            <div className="spinner"></div>
          </div>
        ) : !filtered.length ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications found</h3>
              <p>Try adjusting your filters or wait for new submissions.</p>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th>Company</th>
                  <th>Applicant</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Docs</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const isExpanded = expandedId === app._id;
                  const badgeCls = STATUS_BADGE[app.status] || "badge-default";
                  const docCount = (app.documentsMeta || []).length;

                  return (
                    <React.Fragment key={app._id}>
                      <tr
                        key={app._id}
                        onClick={() => toggleExpand(app)}
                        style={{ cursor: "pointer" }}
                      >
                        <td style={{ fontSize: 14, color: "var(--text-muted)" }}>
                          {isExpanded ? "▼" : "▶"}
                        </td>
                        <td className="text-bold">
                          {app.companyName || "—"}
                        </td>
                        <td>
                          <div>{app.applicantName || "—"}</div>
                          <div className="text-xs text-muted">
                            {app.userMobile}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {app.serviceName || app.certification || "—"}
                          </div>
                          {app.serviceGroup && (
                            <div className="text-xs text-muted">
                              {app.serviceGroup}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${badgeCls}`}>
                            {app.status || "Documents Received"}
                          </span>
                        </td>
                        <td className="text-sm">
                          {docCount > 0 ? (
                            <span className="badge badge-default">
                              📎 {docCount}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-muted text-sm">
                          {formatDate(app.createdAt)}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${app._id}-row`} className="expand-row">
                          <td colSpan={7}>
                            <div className="expand-content">
                              {/* Application Details */}
                              <div className="expand-grid">
                                <div className="expand-field">
                                  <span className="label">Company</span>
                                  <span className="value">
                                    {app.companyName || "—"}
                                  </span>
                                </div>
                                <div className="expand-field">
                                  <span className="label">Applicant</span>
                                  <span className="value">
                                    {app.applicantName || "—"}
                                  </span>
                                </div>
                                <div className="expand-field">
                                  <span className="label">Email</span>
                                  <span className="value">
                                    {app.email || "—"}
                                  </span>
                                </div>
                                <div className="expand-field">
                                  <span className="label">City</span>
                                  <span className="value">
                                    {app.city || "—"}
                                  </span>
                                </div>
                                <div className="expand-field">
                                  <span className="label">Mobile</span>
                                  <span className="value">
                                    {app.userMobile}
                                  </span>
                                </div>
                                <div className="expand-field">
                                  <span className="label">Service Group</span>
                                  <span className="value">
                                    {app.serviceGroup || "—"}
                                  </span>
                                </div>
                                {app.description && (
                                  <div
                                    className="expand-field"
                                    style={{ gridColumn: "1 / -1" }}
                                  >
                                    <span className="label">Description</span>
                                    <span className="value">
                                      {app.description}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Documents */}
                              {(app.documentsMeta || []).length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                  <div className="text-xs text-bold text-muted" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                                    Documents ({app.documentsMeta.length})
                                  </div>
                                  <div className="docs-list">
                                    {app.documentsMeta.map((doc) => (
                                      <div className="doc-item" key={doc._id}>
                                        <span className="doc-icon">
                                          {getDocIcon(doc.mimeType)}
                                        </span>
                                        <div className="doc-info">
                                          <div className="doc-name">
                                            {doc.originalName}
                                          </div>
                                          <div className="doc-meta">
                                            {doc.mimeType} · {formatBytes(doc.sizeBytes)} · {formatDate(doc.createdAt)}
                                          </div>
                                        </div>
                                        <button
                                          className="btn btn-secondary btn-sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            downloadDocument(doc._id, doc.originalName);
                                          }}
                                          disabled={downloadingDoc === doc._id}
                                        >
                                          {downloadingDoc === doc._id ? (
                                            <span className="spinner" style={{ width: 14, height: 14 }}></span>
                                          ) : (
                                            "Download"
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Edit Status & Remarks */}
                              <div className="edit-section">
                                <div className="text-xs text-bold text-muted" style={{ textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                                  Update Application
                                </div>

                                <div className="edit-row">
                                  <div className="input-group" style={{ minWidth: 220 }}>
                                    <label>Status</label>
                                    <select
                                      className="select"
                                      value={editStatus}
                                      onChange={(e) =>
                                        setEditStatus(e.target.value)
                                      }
                                    >
                                      {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div
                                    className="input-group"
                                    style={{ flex: 1, minWidth: 280 }}
                                  >
                                    <label>Remarks (visible to client)</label>
                                    <input
                                      className="input"
                                      value={editRemarks}
                                      onChange={(e) =>
                                        setEditRemarks(e.target.value)
                                      }
                                      placeholder="Add remarks for the client..."
                                    />
                                  </div>

                                  <button
                                    className="btn btn-primary"
                                    onClick={() => saveChanges(app._id)}
                                    disabled={saving}
                                    style={{ alignSelf: "flex-end" }}
                                  >
                                    {saving ? (
                                      <>
                                        <span className="spinner" style={{ width: 14, height: 14 }}></span>
                                        Saving...
                                      </>
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </button>
                                </div>

                                {saveMsg && (
                                  <p
                                    className={
                                      saveMsg.includes("success")
                                        ? "text-success mt-8 text-sm"
                                        : "text-error mt-8 text-sm"
                                    }
                                  >
                                    {saveMsg}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
