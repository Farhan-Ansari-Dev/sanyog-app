import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Loader2, FolderTree, X } from "lucide-react";
import api from "../services/api";

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ id: null, category: "", name: "", slug: "", description: "", isActive: true });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/catalog/services");
      setServices(res.data.flatServices || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setForm({
        id: service._id,
        category: service.category,
        name: service.name,
        slug: service.slug,
        description: service.description || "",
        isActive: service.isActive
      });
      setIsEditing(true);
    } else {
      setForm({ id: null, category: "", name: "", slug: "", description: "", isActive: true });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/services/${form.id}`, form);
      } else {
        await api.post("/admin/services", form);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving service");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error deleting service");
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Services Catalog</h1>
          <p className="text-[15px] text-[#64748B] mt-1">Manage global system services and offerings.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="h-11 px-5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
            <p className="text-[#64748B] font-medium text-[15px]">Loading services...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Group / Category</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Slug Path</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white dark:bg-[#0F172A]">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex flex-col items-center justify-center p-16 text-center h-full">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-[#1E293B] rounded-full flex items-center justify-center mb-5 border border-slate-100">
                          <FolderTree className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No services configured</h3>
                        <p className="text-[15px] text-[#64748B]">Click "Add Service" to create your first catalog entry.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  services.map((svc) => (
                    <tr key={svc._id} className="hover:bg-slate-50 dark:bg-[#1E293B]/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-[14px] font-bold text-[#0F172A]">{svc.name}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-[14px] text-[#475569] font-medium">{svc.category}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-block bg-slate-100 text-slate-600 px-2.5 py-1 text-[12px] font-mono rounded-md border border-slate-200">
                          /{svc.slug}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {svc.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold border border-emerald-200">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse blur-[0.5px]"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[12px] font-bold border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(svc)}
                            className="p-2 text-[#64748B] hover:text-[#22C55E] hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                            title="Edit Service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(svc._id)}
                            className="p-2 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white dark:bg-[#0F172A] w-full max-w-lg rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-[#E2E8F0] overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
              <h2 className="text-[18px] font-bold text-[#0F172A]">{isEditing ? "Edit Service" : "Add New Service"}</h2>
              <button onClick={handleCloseModal} className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Service Group / Category</label>
                  <input 
                    type="text" 
                    className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all shadow-sm"
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})} 
                    required 
                    placeholder="e.g. Domestic Certification"
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Service Name</label>
                  <input 
                    type="text" 
                    className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all shadow-sm"
                    value={form.name} 
                    onChange={e => setForm({
                        ...form, 
                        name: e.target.value, 
                        slug: !isEditing ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : form.slug 
                    })} 
                    required 
                    placeholder="e.g. BIS Certification"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">URL Slug Path</label>
                  <input 
                    type="text" 
                    className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white dark:bg-[#0F172A] transition-all shadow-sm font-mono"
                    value={form.slug} 
                    onChange={e => setForm({...form, slug: e.target.value})} 
                    required 
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={form.isActive} 
                        onChange={e => setForm({...form, isActive: e.target.checked})} 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#0F172A] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
                    </div>
                    <span className="text-[14px] font-bold text-[#0F172A] group-hover:text-[#22C55E] transition-colors">Visible to public</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#F1F5F9] flex gap-3 justify-end">
                <button type="button" onClick={handleCloseModal} className="h-11 px-5 text-[14px] font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="h-11 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm">
                  {isEditing ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
