import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, X,
  Package, Settings, Building2, FileUp, CheckCircle2, AlertCircle,
  Mail, Globe, FileText, User, ChevronRight
} from "lucide-react";
import API from "../services/api";

const STEPS = [
  { label: "Category", icon: Package },
  { label: "Service", icon: Settings },
  { label: "Entity", icon: Building2 },
  { label: "Docs", icon: FileUp },
];

export default function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  const [services, setServices] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    companyName: "", applicantName: "", email: "", city: "",
    productDescription: "", additionalNotes: "",
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get("/catalog/services");
        setServices(data.flatServices || data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCatalogLoading(false);
      }
    };
    fetchServices();
  }, []);

  const groups = [...new Set(services.map((s) => s.group || s.category || s.serviceGroup))].filter(Boolean);
  const filteredServices = services.filter((s) => (s.group || s.category || s.serviceGroup) === selectedGroup);

  const updateForm = (field, value) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep3 = () => {
    if (!companyForm.companyName.trim()) return "Company entity name is required.";
    if (!companyForm.applicantName.trim()) return "Applicant identity is required.";
    if (!companyForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Valid network email is required.";
    if (!companyForm.city.trim()) return "Operations city is required.";
    return null;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && !selectedGroup) { setError("Select a service layer first."); return; }
    if (step === 2 && !selectedService) { setError("Select an active compliance service."); return; }
    if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
    }
    setStep((s) => s + 1);
  };

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError("");
    try {
      const payload = {
        serviceId: selectedService?._id || selectedService?.id,
        serviceName: selectedService?.name || selectedService?.title,
        companyName: companyForm.companyName,
        applicantName: companyForm.applicantName,
        email: companyForm.email,
        city: companyForm.city,
        productDescription: companyForm.productDescription,
      };

      const { data } = await API.post("/applications/submit", payload);
      setSubmittedId(data.id || data._id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Infrastructure rejection. Please verify docs.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase glow-primary">New Compliance Sequence</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest opacity-60">Initiating regulatory workflow protocol.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Progress System */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {STEPS.map((s, i) => {
              const current = i + 1 === step;
              const done = i + 1 < step;
              const Icon = s.icon;
              return (
                <div key={s.label} className={`flex items-start gap-5 group transition-all duration-500 ${current ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${
                    current ? 'bg-primary border-primary/20 text-white scale-110 shadow-emerald-500/20' : 
                    done ? 'bg-emerald-500 border-emerald-500/20 text-white' : 
                    'bg-white dark:bg-[#1C1F2E] border-gray-100 dark:border-[#2A2D3E] text-gray-400'
                  }`}>
                    {done ? <Check className="w-6 h-6 stroke-[3px]" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="pt-1">
                     <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ${current ? 'text-primary' : done ? 'text-emerald-500' : 'text-gray-500'}`}>Protocol 0{i+1}</p>
                     <p className={`text-sm font-black uppercase tracking-tight ${current ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Workflow Area */}
        <div className="lg:col-span-3">
          <div className="card-premium min-h-[500px] flex flex-col justify-between overflow-visible relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
            
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner shadow-emerald-500/5">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-3 uppercase">Transmission Verified</h2>
                <p className="text-gray-500 dark:text-slate-400 font-medium mb-10 max-w-sm">Application ID <span className="text-primary font-black">#{submittedId?.slice(-8).toUpperCase()}</span> is now active in the regulatory grid.</p>
                <div className="flex gap-4">
                  <button onClick={() => navigate("/my-applications")} className="btn-primary px-8">VIEW STATUS</button>
                  <button onClick={() => window.location.reload()} className="btn-secondary px-8">NEW PROTOCOL</button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-8 uppercase flex items-center gap-3">
                       <Package className="w-6 h-6 text-primary" />
                       Service Layer Selection
                    </h3>
                    {catalogLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                         <Loader2 className="animate-spin text-primary w-10 h-10 opacity-20" />
                         <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Fetching Catalog...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((g) => (
                          <button
                            key={g}
                            onClick={() => { setSelectedGroup(g); setSelectedService(null); handleNext(); }}
                            className={`p-5 rounded-2xl border-4 text-left transition-all hover:scale-[1.02] hover:shadow-2xl group flex flex-col justify-between h-32 ${
                              selectedGroup === g ? "border-primary bg-primary/5 shadow-emerald-500/10" : "border-gray-50 dark:border-[#161923] bg-gray-50 dark:bg-[#0B0D13]"
                            }`}
                          >
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">CATEGORY</span>
                            <span className="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">{g}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase flex items-center gap-3">
                       <Settings className="w-6 h-6 text-primary" />
                       Active Compliance Logic
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-10">Protocols available for {selectedGroup}</p>
                    <div className="grid grid-cols-1 gap-4">
                      {filteredServices.map((s) => (
                        <button
                          key={s._id || s.id}
                          onClick={() => { setSelectedService(s); handleNext(); }}
                          className={`w-full p-6 rounded-3xl border-4 text-left transition-all hover:translate-x-2 group flex items-center justify-between ${
                            selectedService?._id === s._id ? "border-primary bg-primary/5 shadow-2xl" : "border-gray-50 dark:border-[#161923] bg-gray-50 dark:bg-[#0B0D13]"
                          }`}
                        >
                           <div>
                              <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter block">{s.name || s.title}</span>
                              {s.description && <p className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase group-hover:text-gray-500">{s.description}</p>}
                           </div>
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedService?._id === s._id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-[#1C1F2E] text-gray-400'}`}>
                              <ChevronRight className="w-6 h-6" />
                           </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-10 uppercase flex items-center gap-3">
                       <Building2 className="w-6 h-6 text-primary" />
                       Corporate Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: "Entity Name", field: "companyName", icon: Building2 },
                        { label: "Applicant UID", field: "applicantName", icon: User },
                        { label: "Secure Email", field: "email", icon: Mail, type: "email" },
                        { label: "Operations Core", field: "city", icon: Globe },
                        { label: "Technical Bio / Specs", field: "productDescription", icon: FileText, full: true, area: true },
                      ].map((f) => (
                        <div key={f.field} className={f.full ? "md:col-span-2" : ""}>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 leading-none">{f.label}</label>
                           <div className="relative group">
                              <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                              {f.area ? (
                                <textarea 
                                  className="input-field pl-14 py-4 min-h-[140px] font-black text-sm dark:bg-[#0B0D13]" 
                                  value={companyForm[f.field]}
                                  onChange={(e) => updateForm(f.field, e.target.value)}
                                  placeholder={`Enter ${f.label.toLowerCase()} details here...`}
                                />
                              ) : (
                                <input 
                                  className="input-field pl-14 h-14 font-black text-sm dark:bg-[#0B0D13]" 
                                  value={companyForm[f.field]}
                                  onChange={(e) => updateForm(f.field, e.target.value)}
                                  placeholder={`Enter ${f.label.toLowerCase()}...`}
                                />
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-10 uppercase flex items-center gap-3">
                       <FileUp className="w-6 h-6 text-primary" />
                       Digital Evidence
                    </h3>
                    <div className="border-4 border-dashed border-gray-100 dark:border-[#2A2D3E] rounded-[3rem] p-16 text-center hover:border-primary/40 transition-all bg-gray-50/30 dark:bg-white/5 group relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative z-10">
                          <Upload className="w-16 h-16 text-primary/40 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Inject File Nodes</h4>
                          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-8 opacity-60">PDF / JPG / IMAGE PROTOCOLS (MAX 10MB EACH)</p>
                          <label className="btn-accent px-10 cursor-pointer shadow-2xl">
                             <input type="file" multiple className="hidden" onChange={handleFileAdd} />
                             BROWSER LOCAL
                          </label>
                       </div>
                    </div>

                    {files.length > 0 && (
                       <div className="mt-10 space-y-3">
                          <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">Queued for transmission</p>
                          {files.map((file, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#161923] rounded-2xl border-2 border-gray-100 dark:border-[#2A2D3E] shadow-sm animate-in slide-in-from-left-4 duration-300">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-primary" />
                                   </div>
                                   <div>
                                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[200px]">{file.name}</div>
                                      <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">NODE ACTIVE</div>
                                   </div>
                                </div>
                                <button onClick={() => removeFile(i)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                             </div>
                          ))}
                       </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-8 flex items-center gap-4 p-5 bg-red-500/10 text-red-500 rounded-2xl animate-in shake-in border border-red-500/20">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-[0.1em]">{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* Global Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-10 border-t dark:border-[#2A2D3E]">
              {step > 1 && !success && (
                <button onClick={() => setStep(step - 1)} className="btn-secondary h-16 sm:w-48 font-black tracking-widest text-xs">
                  <ArrowLeft className="w-5 h-5 mr-3" /> RETREAT
                </button>
              )}
              {!success && (
                step < 4 ? (
                  <button onClick={handleNext} className="btn-primary h-16 flex-1 font-black tracking-[0.2em] text-xs">
                    CONTINUE SEQUENCE <ArrowRight className="w-5 h-5 ml-3" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={submitLoading || files.length === 0} 
                    className="btn-accent h-16 flex-1 font-black tracking-[0.2em] text-sm shadow-primary/20"
                  >
                    {submitLoading ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : <CheckCircle2 className="w-6 h-6 mr-3" />}
                    {submitLoading ? "TRANSMITTING DATA..." : "FINALIZE PROTOCOL"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}