import { useEffect, useState } from "react";
import api from "../api";

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
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle">Manage catalog offerings</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Service
        </button>
      </header>

      {error ? (
        <div className="error-box">{error}</div>
      ) : loading ? (
        <div className="loading-state">Loading services...</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc._id}>
                    <td>
                      <strong>{svc.name}</strong>
                    </td>
                    <td>{svc.category}</td>
                    <td><span className="badge badge-pending">{svc.slug}</span></td>
                    <td>
                      {svc.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-pending">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: "8px" }} onClick={() => handleOpenModal(svc)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(svc._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
              backgroundColor: '#1E1E2F', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '500px', border: '1px solid #3A3A55'
          }}>
            <h2 style={{ marginBottom: '24px', color: '#FFF' }}>{isEditing ? "Edit Service" : "Add Service"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#A0A0B0' }}>Category</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3A3A55', backgroundColor: '#2A2A3F', color: '#FFF' }}
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  required 
                  placeholder="e.g. Domestic Certification"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#A0A0B0' }}>Name</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3A3A55', backgroundColor: '#2A2A3F', color: '#FFF' }}
                  value={form.name} 
                  onChange={e => setForm({
                      ...form, 
                      name: e.target.value, 
                      slug: !isEditing ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') : form.slug 
                  })} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#A0A0B0' }}>Slug</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3A3A55', backgroundColor: '#2A2A3F', color: '#FFF' }}
                  value={form.slug} 
                  onChange={e => setForm({...form, slug: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#A0A0B0' }}>
                  <input 
                    type="checkbox" 
                    checked={form.isActive} 
                    onChange={e => setForm({...form, isActive: e.target.checked})} 
                    style={{ marginRight: '8px' }}
                  />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEditing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
