import React, { useEffect, useState } from "react";
import { Users, Loader2, RefreshCw, Mail, Search, ShieldCheck, UserPlus, Trash2, Shield, UserCircle2, X } from "lucide-react";
import api from "../services/api";

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState("clients");
    const [users, setUsers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", role: "ops", password: "" });
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        setError("");
        setLoading(true);
        try {
            if (activeTab === "clients") {
                const res = await api.get("/admin/users/clients");
                setUsers(res.data || []);
            } else {
                const res = await api.get("/admin/users/staff");
                setStaff(res.data || []);
            }
        } catch (err) {
            console.error("User management error:", err);
            setError(err?.response?.data?.error || "Failed to load directory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/admin/users/staff", form);
            setShowModal(false);
            setForm({ name: "", email: "", role: "ops", password: "" });
            loadData();
        } catch (err) {
            alert(err?.response?.data?.error || "Failed to create staff account.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm("Are you sure you want to completely revoke and delete this admin user?")) return;
        try {
            await api.delete(`/admin/users/staff/${id}`);
            loadData();
        } catch (err) {
            alert(err?.response?.data?.error || "Failed to delete staff.");
        }
    };

    const filteredUsers = users.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (u.mobile || "").includes(q) || (u.email || "").toLowerCase().includes(q);
    });

    const filteredStaff = staff.filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (s.name || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q);
    });

    return (
        <div className="animate-fade-in pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">System Access & Users</h1>
                    <p className="text-[15px] text-[#64748B] mt-1">Manage portal application clients and internal admin staff.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    {activeTab === "staff" && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="flex-1 sm:flex-none h-11 px-5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Staff
                        </button>
                    )}
                    <button 
                        onClick={loadData}
                        className="flex-1 sm:flex-none h-11 px-5 bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-[#F1F5F9] rounded-xl max-w-sm">
                <button 
                    onClick={() => setActiveTab("clients")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-lg transition-all ${
                        activeTab === "clients" ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                >
                    <UserCircle2 className="w-4 h-4" />
                    Mobile Clients
                </button>
                <button 
                    onClick={() => setActiveTab("staff")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-bold rounded-lg transition-all ${
                        activeTab === "staff" ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                >
                    <Shield className="w-4 h-4" />
                    Internal Staff
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                {/* Search Bar matching inside container for clean look */}
                <div className="p-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            className="w-full pl-10 pr-4 h-10 bg-white border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E] transition-all"
                            placeholder={activeTab === "clients" ? "Search clients by phone or email..." : "Search staff by name or email..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
                        <p className="text-[#64748B] font-medium text-[15px]">Loading directory...</p>
                    </div>
                ) : activeTab === "clients" ? (
                    /* CLIENTS TABLE */
                    !filteredUsers.length ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <UserCircle2 className="w-12 h-12 text-slate-300 mb-4" />
                            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No clients found</h3>
                            <p className="text-[14px] text-[#64748B]">Directory is completely empty.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-[#E2E8F0]">
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mobile Number</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Email Address</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Applications</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-[#0F172A]">{u.mobile}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#475569]">{u.email || <span className="text-slate-400 italic">None</span>}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">{u.applicationCount || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-[13px] text-[#64748B]">{formatDate(u.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    /* STAFF TABLE */
                    !filteredStaff.length ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <Shield className="w-12 h-12 text-slate-300 mb-4" />
                            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No staff found</h3>
                            <p className="text-[14px] text-[#64748B]">Click 'Add Staff' to provision admin accounts.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-[#E2E8F0]">
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Staff Name</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Access Role</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {filteredStaff.map((s) => (
                                        <tr key={s._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                        {s.name.substring(0, 2)}
                                                    </div>
                                                    <span className="font-bold text-[#0F172A] text-[14px]">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#475569]">{s.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${s.role === 'admin' ? 'bg-purple-100 text-purple-700' : s.role === 'viewer' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {s.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {s.isActive ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Active</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-400">Suspended</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button 
                                                    onClick={() => handleDeleteStaff(s._id)}
                                                    className="p-1.5 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Revoke & Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* CREATE STAFF MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden animate-fade-in">
                        <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
                            <h2 className="text-[18px] font-bold text-[#0F172A]">Provision Admin User</h2>
                            <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#0F172A]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateStaff} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]"
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Email (Login ID)</label>
                                    <input 
                                        type="email" 
                                        required 
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]"
                                        value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Secure Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]"
                                        value={form.password}
                                        onChange={e => setForm({...form, password: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Access Clearance (Role)</label>
                                    <select 
                                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E]"
                                        value={form.role}
                                        onChange={e => setForm({...form, role: e.target.value})}
                                    >
                                        <option value="admin">Super Admin (Full Access)</option>
                                        <option value="ops">Operations (Standard)</option>
                                        <option value="viewer">Viewer (Read Only)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 pt-5 border-t border-[#F1F5F9] flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="h-11 px-5 text-[14px] font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl">Cancel</button>
                                <button type="submit" disabled={saving} className="h-11 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-70 text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2">
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create Provision
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
