import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import { MessageSquare, Send, CheckCircle, AlertCircle, PhoneCall, Globe, ShieldCheck, Mail, Loader2 } from "lucide-react";

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
      await API.post("/contact/request", { message });
      setSuccess(true);
      setMessage("");
    } catch (err) {
      setError(err?.response?.data?.error || "Support node offline. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Support</h1>
        <p className="page-subtitle">Get help from the Sanyog team. We'll call you back shortly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Info Grid */}
        <div className="lg:col-span-1 space-y-4">
           {[
              { label: "Status", value: "Available", icon: Globe, color: "text-success", iconBg: 'bg-primary/10' },
              { label: "Support Level", value: "Priority Support", icon: ShieldCheck, color: "text-success", iconBg: 'bg-primary/10' },
              { label: "Contact Email", value: "sanyogconformity1@gmail.com", icon: Mail, color: "text-textSubLight dark:text-textSubDark", iconBg: 'bg-slate-100 dark:bg-darkBg' },
           ].map(item => (
              <div key={item.label} className="p-6 rounded-xl flex items-center gap-4 transition-all card">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 text-textSubLight dark:text-textSubDark">{item.label}</p>
                    <p className="text-[11px] font-black uppercase tracking-tight text-textMainLight dark:text-textMainDark">{item.value}</p>
                 </div>
              </div>
           ))}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-3">
          <div className="card-premium relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
             
             {success ? (
               <div className="py-12 text-center animate-in zoom-in-95 duration-700">
                 <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <CheckCircle className="w-10 h-10 text-success" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter uppercase mb-2 text-textMainLight dark:text-textMainDark">Request Sent!</h3>
                 <p className="text-sm font-medium max-w-xs mx-auto mb-10 text-textSubLight dark:text-textSubDark">Your callback request has been received. Our team will contact you shortly.</p>
                 <button onClick={() => setSuccess(false)}
                   className="btn-accent uppercase tracking-widest">
                   NEW REQUEST
                 </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit}>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border-4 border-primary/5">
                       <PhoneCall className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black uppercase tracking-tighter text-textMainLight dark:text-textMainDark">Request a Callback</h2>
                       <p className="text-xs font-bold uppercase tracking-widest opacity-60 text-textSubLight dark:text-textSubDark">Our team will call you back as soon as possible.</p>
                    </div>
                 </div>

                 {error && (
                   <div className="mb-8 p-5 rounded-2xl flex items-center gap-3 animate-in shake-in bg-error/10 border border-error/20 text-error">
                     <AlertCircle className="w-5 h-5" />
                     <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                   </div>
                 )}
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 leading-none text-textSubLight dark:text-textSubDark">Your Message (Optional)</label>
                       <textarea
                         rows={6}
                         placeholder="Describe what help you need..."
                         className="input-field font-black text-xs tracking-widest uppercase min-h-[180px]"
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         maxLength={2000}
                       />
                       <div className="flex justify-between mt-3 px-1">
                         <span className="text-[9px] font-black uppercase tracking-widest leading-none text-textSubLight dark:text-textSubDark">Characters</span>
                         <span className="text-[9px] font-black uppercase tracking-widest leading-none text-primary">{message.length}/2000</span>
                       </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-lightBorder dark:border-darkBorder">
                       <button type="submit" disabled={loading}
                         className="btn-primary">
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                         {loading ? "SENDING..." : "REQUEST CALLBACK"}
                       </button>
                    </div>
                 </div>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
