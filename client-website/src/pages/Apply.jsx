import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useApplyStore } from "../store/useApplyStore";
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, X,
  Package, Settings, Building2, FileUp, CheckCircle2, AlertCircle,
  Mail, Globe, FileText, User, ChevronRight
} from "lucide-react";
import API from "../services/api";
import Skeleton from "../components/Skeleton";

const STEPS = [
  { label: "Category", icon: Package },
  { label: "Service", icon: Settings },
  { label: "Company Info", icon: Building2 },
  { label: "Documents", icon: FileUp },
];

export default function Apply() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  // Persistent Zustand Store
  const { currentStep, formData, setStep, updateForm, resetFlow } = useApplyStore();
  const { category: selectedGroup, service: selectedService, company: companyForm } = formData;

  // Transient Local State (UI, Loaders, Files)
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [services, setServices] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get("/catalog/services");
        const serviceList = Array.isArray(data) ? data : (data.flatServices || []);
        setServices(serviceList);
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

  const validateStep3 = () => {
    if (!companyForm.name?.trim()) return "Company name is required.";
    if (!companyForm.registrationNumber?.trim()) return "Applicant name or ID is required.";
    if (!companyForm.country?.trim()) return "Valid email is required.";
    if (!companyForm.industry?.trim()) return "City name is required.";
    return null;
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!selectedGroup) { setError("Please select a category."); return; }
      setStep(2);
    } else if (currentStep === 2) {
      if (!selectedService) { setError("Please select a service."); return; }
      setStep(3);
    } else if (currentStep === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(4);
    }
  };

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one document before submitting.");
      return;
    }
    setSubmitLoading(true);
    setUploadProgress(0);
    setError("");
    
    try {
      const payloadData = new FormData();
      payloadData.append("serviceId", selectedService?._id || selectedService?.id || "");
      payloadData.append("serviceName", selectedService?.name || selectedService?.title || "");
      payloadData.append("serviceGroup", selectedGroup || "");
      payloadData.append("companyName", companyForm.name);
      payloadData.append("applicantName", companyForm.registrationNumber);
      payloadData.append("email", companyForm.country); // aliased as email logic
      payloadData.append("city", companyForm.industry);   // aliased as city logic

      files.forEach((file) => {
        payloadData.append("files", file);
      });

      const data = await API.post("/applications", payloadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (ev) => {
          const pct = Math.round((ev.loaded * 100) / (ev.total || 1));
          setUploadProgress(pct);
        },
      });

      setSubmittedId(data._id || "SUCCESS");
      setSuccess(true);
      resetFlow(); // Clear Zustand storage on success
      setFiles([]);
    } catch (err) {
      setError(err?.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase glow-primary text-textMainLight dark:text-textMainDark">New Application</h1>
        <p className="text-sm font-bold mt-1 uppercase tracking-widest opacity-60 text-textSubLight dark:text-textSubDark">Complete the steps below to start your compliance request.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Progress System Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {STEPS.map((s, i) => {
              const current = i + 1 === currentStep;
              const done = i + 1 < currentStep;
              const Icon = s.icon;
              return (
                <div 
                  key={s.label} 
                  onClick={() => i + 1 < currentStep && setStep(i + 1)}
                  className={`flex items-start gap-5 group transition-all duration-500 ${current ? 'opacity-100' : 'opacity-30'} ${i + 1 < currentStep ? 'cursor-pointer hover:opacity-100' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${
                    current ? 'bg-primary border-primary/20 text-white scale-110 shadow-[0_4px_14px_rgba(22,163,74,0.3)]' : 
                    done ? 'bg-success border-success/20 text-white' : 
                    'bg-lightBg dark:bg-darkBg border-lightBorder dark:border-darkBorder text-textSubLight dark:text-textSubDark'
                  }`}>
                    {done ? <Check className="w-6 h-6 stroke-[3px]" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="pt-1">
                     <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ${current ? 'text-primary' : done ? 'text-success' : 'text-textSubLight dark:text-textSubDark'}`}>Step 0{i+1}</p>
                     <p className={`text-sm font-black uppercase tracking-tight ${current ? 'text-textMainLight dark:text-textMainDark' : 'text-textSubLight dark:text-textSubDark'}`}>{s.label}</p>
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
                <div className="w-24 h-24 bg-success/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner shadow-success/5">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-3 uppercase text-textMainLight dark:text-textMainDark">Application Submitted</h2>
                <p className="font-medium mb-10 max-w-sm text-textSubLight dark:text-textSubDark">Your application <span className="text-primary font-black">#{submittedId?.slice(-8).toUpperCase()}</span> has been received and is now being processed.</p>
                <div className="flex gap-4">
                  <button onClick={() => { setSuccess(false); navigate("/my-applications"); }} className="btn-primary px-8">VIEW MY APPLICATIONS</button>
                  <button onClick={() => { setSuccess(false); resetFlow(); }} className="btn-secondary px-8">START NEW APPLICATION</button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                {error && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">{error}</span>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black tracking-tight mb-8 uppercase flex items-center gap-3 text-textMainLight dark:text-textMainDark">
                       <Package className="w-6 h-6 text-primary" />
                       Select Service Category
                    </h3>
                    {catalogLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[1, 2, 3, 4].map(i => (
                           <Skeleton key={i} className="h-32 w-full !rounded-2xl" />
                         ))}
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                         <Package className="w-12 h-12 text-textSubLight dark:text-textSubDark" />
                         <p className="text-sm font-bold text-textSubLight dark:text-textSubDark">No service categories available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((g) => (
                          <button
                            key={g}
                            onClick={() => { updateForm({ category: g, service: null }); setError(""); setStep(2); }}
                            className="p-5 rounded-2xl border-4 text-left transition-all hover:scale-[1.02] hover:shadow-2xl group flex flex-col justify-between h-32 cursor-pointer bg-lightBg dark:bg-darkBg"
                            style={{
                              borderColor: selectedGroup === g ? '#16A34A' : 'transparent',
                              backgroundColor: selectedGroup === g ? 'rgba(22,163,74,0.1)' : undefined,
                            }}
                          >
                            <span className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors text-textSubLight dark:text-textSubDark">CATEGORY</span>
                            <span className="text-lg font-black leading-tight uppercase tracking-tighter text-textMainLight dark:text-textMainDark">{g}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black tracking-tight mb-2 uppercase flex items-center gap-3 text-textMainLight dark:text-textMainDark">
                       <Settings className="w-6 h-6 text-primary" />
                       Select Service
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-10">Compliance services available for {selectedGroup}</p>
                      <div className="grid grid-cols-1 gap-4">
                      {filteredServices.map((s) => (
                        <button
                          key={s._id || s.id}
                          onClick={() => { updateForm({ service: s }); setError(""); setStep(3); }}
                          className="w-full p-6 rounded-3xl border-4 text-left transition-all hover:translate-x-2 group flex items-center justify-between cursor-pointer bg-lightBg dark:bg-darkBg"
                          style={{
                            borderColor: selectedService?._id === s._id ? '#16A34A' : 'transparent',
                            backgroundColor: selectedService?._id === s._id ? 'rgba(22,163,74,0.1)' : undefined,
                          }}
                        >
                           <div>
                              <span className="text-lg font-black uppercase tracking-tighter block text-textMainLight dark:text-textMainDark">{s.name || s.title}</span>
                              {s.description && <p className="text-[10px] mt-1 font-bold tracking-widest uppercase text-textSubLight dark:text-textSubDark">{s.description}</p>}
                           </div>
                           <div className="w-10 h-10 bg-lightCard dark:bg-darkCard rounded-xl flex items-center justify-center transition-all">
                              <ChevronRight className="w-6 h-6 text-textSubLight dark:text-textSubDark" />
                           </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black tracking-tight mb-10 uppercase flex items-center gap-3 text-textMainLight dark:text-textMainDark">
                       <Building2 className="w-6 h-6 text-primary" />
                       Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: "Company Name", field: "name", icon: Building2 },
                        { label: "Applicant Name / ID", field: "registrationNumber", icon: User },
                        { label: "Contact Email", field: "country", icon: Mail, type: "email" },
                        { label: "City / Location", field: "industry", icon: Globe },
                      ].map((f) => (
                        <div key={f.field} className={f.full ? "md:col-span-2" : ""}>
                           <label className="block text-[10px] font-black uppercase tracking-widest mb-3 leading-none text-textSubLight dark:text-textSubDark">{f.label}</label>
                           <div className="relative group">
                              <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                              <input 
                                className="input-field pl-14 h-14 font-black text-sm" 
                                value={companyForm[f.field]}
                                onChange={(e) => updateForm({ company: { ...companyForm, [f.field]: e.target.value } })}
                                placeholder={`Enter ${f.label.toLowerCase()}...`}
                              />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-black tracking-tight mb-10 uppercase flex items-center gap-3 text-textMainLight dark:text-textMainDark">
                       <FileUp className="w-6 h-6 text-primary" />
                       Upload Documents
                    </h3>
                    <div className="border-4 border-dashed rounded-[3rem] p-16 text-center hover:border-primary/40 transition-all bg-lightBg dark:bg-darkBg border-lightBorder dark:border-darkBorder group relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative z-10">
                          <Upload className="w-16 h-16 text-primary/40 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="font-black text-xl uppercase tracking-tighter mb-2 text-textMainLight dark:text-textMainDark">Select files to upload</h4>
                          <p className="text-xs font-bold tracking-widest uppercase mb-8 opacity-60 text-textSubLight dark:text-textSubDark">PDF / JPG / PNG (MAX 10MB PER FILE)</p>
                          <label className="btn-accent px-10 cursor-pointer shadow-[0_4px_14px_rgba(22,163,74,0.3)]">
                             <input type="file" multiple className="hidden" onChange={handleFileAdd} />
                             CHOOSE FILES
                          </label>
                       </div>
                    </div>

                    {files.length > 0 && (
                       <div className="mt-10 space-y-3">
                          <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-4">Files to be uploaded</p>
                          {files.map((file, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-2xl border transition-all animate-in slide-in-from-left-4 duration-300 bg-lightCard dark:bg-darkCard border-lightBorder dark:border-darkBorder shadow-sm">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-primary" />
                                   </div>
                                   <div>
                                      <div className="text-sm font-black uppercase tracking-tight truncate max-w-[200px] text-textMainLight dark:text-textMainDark">{file.name}</div>
                                      <div className="text-[10px] font-bold tracking-widest uppercase text-textSubLight dark:text-textSubDark">{(file.size / 1024).toFixed(1)} KB</div>
                                   </div>
                                </div>
                                <button onClick={() => removeFile(i)} className="p-2 hover:bg-error/10 text-textSubLight dark:text-textSubDark hover:text-error rounded-xl transition-all cursor-pointer"><X className="w-5 h-5" /></button>
                             </div>
                          ))}
                       </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Global Actions */}
            <div className="flex flex-col gap-4 mt-8 pt-10 border-t border-lightBorder dark:border-darkBorder">
              {/* Upload Progress Bar */}
              {submitLoading && uploadProgress > 0 && (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Uploading to secure storage...</span>
                    <span className="text-[10px] font-black text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-lightBg dark:bg-darkBg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success to-[#4ADE80] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentStep > 1 && !success && (
                  <button onClick={() => setStep(currentStep - 1)} className="btn-secondary h-16 sm:w-48 font-black tracking-widest text-xs cursor-pointer">
                    <ArrowLeft className="w-5 h-5 mr-3" /> BACK
                  </button>
                )}
                {!success && (
                  currentStep < 4 ? (
                    <button onClick={handleNext} className="btn-primary h-16 flex-1 font-black tracking-[0.2em] text-xs cursor-pointer">
                      NEXT STEP <ArrowRight className="w-5 h-5 ml-3" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitLoading}
                      className="btn-accent h-16 flex-1 font-black tracking-[0.2em] text-sm shadow-[0_4px_14px_rgba(22,163,74,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      {submitLoading ? <Loader2 className="animate-spin w-6 h-6 mr-3" /> : <CheckCircle2 className="w-6 h-6 mr-3" />}
                      {submitLoading
                        ? uploadProgress > 0
                          ? `UPLOADING ${uploadProgress}%...`
                          : "PREPARING..."
                        : "SUBMIT APPLICATION"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}