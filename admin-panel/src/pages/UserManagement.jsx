import React, { useEffect, useState } from "react";
import { Users, Loader2, RefreshCw, Mail, Search, ShieldCheck } from "lucide-react";
import api from "../services/api";

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadUsers = async () => {
        setError("");
        setLoading(true);
        try {
            // Note: Waiting for backend permissions to wire up properly
            // Will fallback to empty array if route missing in backend currently
            const res = await api.get("/admin/users/clients");
            setUsers(res.data || []);
        } catch (err) {
            console.warn("User route may not be wired up yet:", err);
            // Don't show hard error here since we know the route is missing
            setError("Backend route for users is not accessible yet. Please wire it up in server.js!");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (u.mobile || "").includes(q) ||
            (u.email || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="animate-fade-in pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">User Management</h1>
                    <p className="text-[15px] text-[#64748B] mt-1">View registered mobile application client accounts.</p>
                </div>
                
                <button 
                    onClick={loadUsers}
                    className="h-11 px-5 bg-white border border-[#E2E8F0] text-[14px] text-[#0F172A] font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Directory
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 font-medium flex gap-3 items-center">
                    <ShieldCheck className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6 max-w-md">
                <div className="relative w-full">
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        className="w-full pl-10 pr-4 h-10 bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] rounded-xl outline-none focus:border-[#22C55E] focus:bg-white transition-all"
                        placeholder="Search by verified mobile number or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-4" />
                        <p className="text-[#64748B] font-medium text-[15px]">Loading user directory...</p>
                    </div>
                ) : !filteredUsers.length ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center h-full">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No users found</h3>
                        <p className="text-[15px] text-[#64748B]">Directory is currently empty or pending backend attachment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mobile Number (Primary ID)</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Email Address</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Total Applications</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Registered On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9] bg-white">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <span className="text-[14px] font-bold text-[#0F172A]">{u.mobile}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {u.email ? (
                                                <div className="text-[14px] text-[#475569] flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    {u.email}
                                                </div>
                                            ) : (
                                                <div className="text-[14px] text-[#94A3B8] italic">Unverified</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[13px] font-bold border border-slate-200">
                                                {u.applicationCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <span className="text-[13px] font-medium text-[#64748B]">{formatDate(u.createdAt)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
