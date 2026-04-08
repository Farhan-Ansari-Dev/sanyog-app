import { useState } from "react";
import api from "../services/api";
import { MessageSquare, Send, CheckCircle, AlertCircle, PhoneCall, Globe, ShieldCheck, Mail } from "lucide-react";

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
      setError(err?.response?.data?.error || "Support node offline. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase glow-blue">Regulatory Assistance</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 mt-1">Direct link to Sanyog compliance architects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Grid */}
        <div className="lg:col-span-1 space-y-4">
           {[
              { label: "Protocol Status", value: "Primary Link Active", icon: Globe, color: "text-emerald-500" },
              { label: "Priority Level", value: "Enterprise Secure", icon: ShieldCheck, color: "text-primary" },
              { label: "Network Log", value: "sanyog.support.internal", icon: Mail, color: "text-slate-400" },
           ].map(item => (
              <div key={item.label} className="card-premium p-5 flex items-center gap-4 border-slate-100 dark:border-[#2A2D3E]">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#1C1F2E] flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.value}</p>
                 </div>
              </div>
           ))}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2">
          <div className="card-premium p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
             
             {success ? (
               <div className="py-12 text-center animate-in zoom-in-95 duration-700">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <CheckCircle className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">Transmission complete</h3>
                 <p className="text-sm text-gray-500 dark:text-slate-400 font-medium max-w-xs mx-auto mb-10">Our agents have successfully logged your callback request and will establish contact shortly.</p>
                 <button onClick={() => setSuccess(false)} className="btn-primary px-10">NEW REQUEST</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit}>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-4 border-primary/5">
                       <PhoneCall className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Callback Protocol</h2>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Verified registered line attached.</p>
                    </div>
                 </div>

                 {error && (
                   <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-3 border border-red-500/20 animate-in shake-in">
                     <AlertCircle className="w-5 h-5" />
                     <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                   </div>
                 )}
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none">Transmission Description (Optional)</label>
                       <textarea
                         rows={6}
                         placeholder="DESCRIBE THE ASSISTANCE REQUIRED..."
                         className="input-field py-4 font-black text-xs tracking-widest uppercase dark:bg-[#0B0D13] min-h-[160px]"
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         maxLength={2000}
                       />
                       <div className="flex justify-between mt-3 px-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Secure Link Active</span>
                         <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">{message.length}/2000 BIT</span>
                       </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t dark:border-[#2A2D3E]">
                       <button
                         type="submit"
                         disabled={loading}
                         className="btn-primary h-14 px-10 font-black tracking-[0.2em] text-xs shadow-xl shadow-emerald-900/20"
                       >
                         {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                         {loading ? "TRANSMITTING..." : "OPEN SUPPORT LINK"}
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
