import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, X,
  Package, Settings, Building2, FileUp, CheckCircle2, AlertCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const STEPS = [
  { label: "Service Group", icon: Package },
  { label: "Service", icon: Settings },
  { label: "Company Details", icon: Building2 },
  { label: "Documents", icon: FileUp },
];

export default function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Catalog
  const [services, setServices] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Selections
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    companyName: "", applicantName: "", email: "", city: "",
    productDescription: "", additionalNotes: "",
  });
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get("/catalog/services");
        setServices(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCatalogLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Derive groups from catalog
  const groups = [...new Set(services.map((s) => s.group || s.category || s.serviceGroup))].filter(Boolean);

  const filteredServices = services.filter(
    (s) => (s.group || s.category || s.serviceGroup) === selectedGroup
  );

  const updateForm = (field, value) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep3 = () => {
    if (!companyForm.companyName.trim()) return "Company name is required.";
    if (!companyForm.applicantName.trim()) return "Applicant name is required.";
    if (!companyForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Valid email is required.";
    if (!companyForm.city.trim()) return "City is required.";
    return null;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && !selectedGroup) { setError("Please select a service group."); return; }
    if (step === 2 && !selectedService) { setError("Please select a service."); return; }
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
      // Step 1: Submit application
      const payload = {
        serviceId: selectedService?._id || selectedService?.id,
        serviceName: selectedService?.name || selectedService?.title,
        serviceGroup: selectedGroup,
        ...companyForm,
      };
      const { data } = await API.post("/applications", payload);
      const appId = data._id || data.id;
      setSubmittedId(appId);

      // Step 2: Upload files if any
      if (files.length > 0 && appId) {
        setUploadProgress("Uploading documents...");
        const formData = new FormData();
        files.forEach((f) => formData.append("documents", f));
        await API.post(`/applications/${appId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitLoading(false);
      setUploadProgress("");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 pt-20 md:pt-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-2">
              Your certification application for <strong>{selectedService?.name || selectedService?.title}</strong> has been submitted successfully.
            </p>
            {submittedId && (
              <p className="text-xs text-gray-400 mb-6">Application ID: <span className="font-mono font-medium">{submittedId}</span></p>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate("/my-applications")} className="btn-primary">
                <Check className="w-4 h-4" /> View My Applications
              </button>
              <button onClick={() => { setStep(1); setSuccess(false); setSelectedGroup(""); setSelectedService(null); setCompanyForm({ companyName: "", applicantName: "", email: "", city: "", productDescription: "", additionalNotes: "" }); setFiles([]); }} className="btn-secondary">
                Apply Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 pt-20 md:pt-6 overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="page-title">Apply for Certification</h1>
          <p className="page-subtitle">Complete the form below to submit your certification application.</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map(({ label, icon: Icon }, i) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done ? "bg-green-500 text-white shadow" :
                      active ? "bg-primary text-white shadow-md shadow-blue-200" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold mt-1.5 hidden sm:block ${
                      active ? "text-primary" : done ? "text-green-600" : "text-gray-400"
                    }`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mt-[-16px] transition-all duration-300 ${done ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Service Group */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Service Group</h2>
              {catalogLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No service groups available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groups.map((group) => (
                    <button
                      key={group}
                      onClick={() => { setSelectedGroup(group); setSelectedService(null); setError(""); }}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedGroup === group
                          ? "border-primary bg-primary-50 shadow-sm"
                          : "border-gray-200 hover:border-primary-light hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                        selectedGroup === group ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <p className={`font-semibold text-sm ${selectedGroup === group ? "text-primary" : "text-gray-800"}`}>{group}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {services.filter((s) => (s.group || s.category || s.serviceGroup) === group).length} services
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Service */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Select Service</h2>
              <p className="text-sm text-gray-500 mb-4">Group: <span className="font-medium text-primary">{selectedGroup}</span></p>
              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No services in this group.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredServices.map((svc) => (
                    <button
                      key={svc._id || svc.id}
                      onClick={() => { setSelectedService(svc); setError(""); }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                        selectedService?._id === svc._id || selectedService?.id === svc.id
                          ? "border-primary bg-primary-50"
                          : "border-gray-200 hover:border-primary-light hover:bg-blue-50/50"
                      }`}
                    >
                      <div>
                        <p className={`font-semibold text-sm ${
                          selectedService?._id === svc._id || selectedService?.id === svc.id ? "text-primary" : "text-gray-800"
                        }`}>
                          {svc.name || svc.title}
                        </p>
                        {svc.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{svc.description}</p>
                        )}
                      </div>
                      {(selectedService?._id === svc._id || selectedService?.id === svc.id) && (
                        <Check className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Company Details */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Company Name *", field: "companyName", placeholder: "Your company name" },
                  { label: "Applicant Name *", field: "applicantName", placeholder: "Full name of applicant" },
                  { label: "Email Address *", field: "email", placeholder: "contact@company.com", type: "email" },
                  { label: "City *", field: "city", placeholder: "City of operation" },
                ].map(({ label, field, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type || "text"}
                      placeholder={placeholder}
                      value={companyForm[field]}
                      onChange={(e) => updateForm(field, e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Description</label>
                  <textarea
                    placeholder="Brief description of the product to be certified..."
                    value={companyForm.productDescription}
                    onChange={(e) => updateForm("productDescription", e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                  <textarea
                    placeholder="Any additional information or special requirements..."
                    value={companyForm.additionalNotes}
                    onChange={(e) => updateForm("additionalNotes", e.target.value)}
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Documents</h2>
              <p className="text-sm text-gray-500 mb-5">Upload supporting documents (optional — you can also upload later).</p>

              {/* Upload Zone */}
              <label className="block border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-8 text-center cursor-pointer transition-colors group mb-4">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary mx-auto mb-3 transition-colors" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC — max 10MB each</p>
                <input type="file" multiple onChange={handleFileAdd} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              </label>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2 mb-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <FileUp className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 line-clamp-1">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Application Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Application Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Group</span>
                    <span className="font-medium text-gray-800">{selectedGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium text-gray-800">{selectedService?.name || selectedService?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company</span>
                    <span className="font-medium text-gray-800">{companyForm.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Documents</span>
                    <span className="font-medium text-gray-800">{files.length} file(s)</span>
                  </div>
                </div>
              </div>

              {uploadProgress && (
                <p className="text-sm text-primary mt-3 animate-pulse">{uploadProgress}</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => { step === 1 ? navigate("/dashboard") : setStep((s) => s - 1); setError(""); }}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step < 4 ? (
              <button onClick={handleNext} className="btn-primary">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitLoading} className="btn-primary">
                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {submitLoading ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}