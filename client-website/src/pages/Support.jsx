import { useState } from "react";
import api from "../services/api";
import { MessageSquare, Send, CheckCircle, AlertCircle, PhoneCall } from "lucide-react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/contact/request", { message });
      setSuccess(true);
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit support request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Request Callback</h1>
              <p className="text-sm text-slate-600 mt-1">
                Our support team will call you back on your registered mobile number perfectly.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800 mb-1">Request Received!</h3>
              <p className="text-green-600 text-sm">
                Our team has been notified and will contact you shortly.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-200 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    How can we help you? (Optional but helpful)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Briefly describe what you need assistance with..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 ring-primary/10 transition-all resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={2000}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400">
                      Your registered phone number will be attached automatically.
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {message.length}/2000
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Sending..." : "Request Callback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
