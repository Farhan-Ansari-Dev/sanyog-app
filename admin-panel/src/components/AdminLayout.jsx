import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Phone, FolderOpen, Users,
  LogOut, Menu, X, Bell, ChevronRight, Settings, Trash2, Shield
} from 'lucide-react';
import { clearAdminToken, getAdminToken } from '../services/auth';
import api from '../services/api';

const NAV = [
  { label: 'Dashboard',        icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Applications',     icon: FileText,         path: '/applications' },
  { label: 'Trash',            icon: Trash2,           path: '/trash' },
  { label: 'Contact Requests', icon: Phone,            path: '/contact' },
  { label: 'Documents',        icon: FolderOpen,       path: '/documents' },
  { label: 'Users',            icon: Users,            path: '/users' },
];

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); }
  catch { return {}; }
}

export default function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      const decoded = decodeToken(token);
      // Try to get fresh profile (avatar) from API
      api.get('/admin/auth/me').then(r => {
        setAdmin({ name: r.data.name || decoded.name || 'Admin', role: r.data.role || decoded.role || 'admin', avatar: r.data.avatar });
      }).catch(() => {
        setAdmin({ name: decoded.name || decoded.email || 'Admin', role: decoded.role || 'admin', avatar: null });
      });
    }
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { clearAdminToken(); navigate('/'); };

  const AvatarBubble = ({ size = 'md', className = '' }) => {
    const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
    return admin?.avatar
      ? <img src={admin.avatar} alt="avatar" className={`${sz} rounded-lg object-cover border border-white/20 ${className}`} />
      : <div className={`${sz} rounded-lg bg-white/20 flex items-center justify-center font-bold text-white ${className}`}>
          {(admin?.name || 'A').charAt(0).toUpperCase()}
        </div>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo / Brand ── */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* LOGO SLOT */}
          <img
            src="/icon.png"
            alt="Sanyog Logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none' }} className="items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Sanyog Admin</p>
              <p className="text-blue-300 text-xs">Control Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin Profile ── */}
      {admin && (
        <Link to="/settings" className="px-5 py-4 border-b border-white/10 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3">
            <AvatarBubble size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
              <p className="text-blue-300 text-xs capitalize">{admin.role}</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {NAV.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          const isTrash = path === '/trash';
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${isActive ? 'active' : ''} ${isTrash ? 'text-red-300 hover:bg-red-600/20 hover:text-red-200' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link to="/settings" className="sidebar-link">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-300 hover:bg-red-600/20 hover:text-red-200">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 bg-primary z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-14"><SidebarContent /></div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-primary min-h-screen shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shrink-0 shadow-sm z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden btn-ghost p-2">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button className="btn-ghost relative p-2" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-900">Notifications</p>
                    <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">New application received</p>
                        <p className="text-xs text-slate-400">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 text-center">
                    <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin avatar → settings */}
            <Link to="/settings" className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity">
              <AvatarBubble size="sm" className="!rounded-lg" />
              <span className="text-sm font-semibold text-slate-700">{admin?.name || 'Admin'}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
