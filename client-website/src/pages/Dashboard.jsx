import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Clock, CheckCircle, XCircle, PlusCircle,
  Phone, RefreshCw, ArrowRight, TrendingUp, AlertCircle, Loader2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return {}; }
}

function StatusBadge({ status }) {
  const map = {
    submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    "in-progress": { label: "In Progress", color: "bg-indigo-100 text-indigo-700" },
    "documents_required": { label: "Docs Required", color: "bg-orange-100 text-orange-700" },
    approved: { label: "Approved", color: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  };
  const s = map[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  return <span className={`badge ${s.color}`}>{s.label}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = decodeToken(token);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackMsg, setCallbackMsg] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/applications/my");
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Pending Review",
      value: applications.filter((a) => ["submitted", "pending", "in-progress"].includes(a.status)).length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "approved").length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "rejected").length,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  ];

  const handleCallback = async () => {
    setCallbackLoading(true);
    setCallbackMsg("");
    try {
      await API.post("/contact/request", {
        message: "Client has requested a callback from the Sanyog team.",
      });
      setCallbackMsg("✅ Callback request sent! Our team will contact you shortly.");
    } catch {
      setCallbackMsg("❌ Failed to send request. Please try again.");
    } finally {
      setCallbackLoading(false);
      setTimeout(() => setCallbackMsg(""), 5000);
    }
  };

  const recentApps = applications.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name || "Client"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's an overview of your certification applications.
            </p>
          </div>
          <button onClick={fetchApps} className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`stat-card border ${border}`}>
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{loading ? "—" : value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-bold text-lg mb-1">Apply for Certification</h3>
            <p className="text-blue-100 text-sm mb-4">
              Start a new application for BIS, CE, or 60+ other certifications.
            </p>
            <button
              onClick={() => navigate("/apply")}
              className="flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Apply Now
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <Phone className="w-8 h-8 mb-3 text-gray-400" />
            <h3 className="font-bold text-lg text-gray-900 mb-1">Need Help?</h3>
            <p className="text-gray-500 text-sm mb-4">
              Request a callback from our certification experts — available 24/7.
            </p>
            {callbackMsg && (
              <p className="text-sm mb-3 font-medium">{callbackMsg}</p>
            )}
            <button
              onClick={handleCallback}
              disabled={callbackLoading}
              className="btn-secondary text-sm px-5 py-2.5"
            >
              {callbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              {callbackLoading ? "Sending..." : "Request Callback"}
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Recent Applications
            </h2>
            <button
              onClick={() => navigate("/my-applications")}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : recentApps.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No applications yet</p>
              <p className="text-gray-300 text-sm">Start your first certification application</p>
              <button onClick={() => navigate("/apply")} className="btn-primary mt-4 text-sm px-5 py-2.5">
                <PlusCircle className="w-4 h-4" /> Apply Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Service</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Company</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApps.map((app) => (
                    <tr key={app._id || app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.serviceName || app.certName || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {app.companyName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}