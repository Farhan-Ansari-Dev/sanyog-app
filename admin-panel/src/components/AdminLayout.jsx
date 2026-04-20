import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Phone, FolderOpen, Users,
  LogOut, Menu, X, Bell, ChevronRight, Settings, Trash2, Sun, Moon
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
  const [isDark, setIsDark] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      const decoded = decodeToken(token);
      api.get('/admin/auth/me').then(r => {
        setAdmin({ name: r.data.name || decoded.name || 'Admin', role: r.data.role || decoded.role || 'admin', avatar: r.data.avatar });
      }).catch(() => {
        setAdmin({ name: decoded.name || decoded.email || 'Admin', role: decoded.role || 'admin', avatar: null });
      });
    }
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { clearAdminToken(); navigate('/login'); };

  const AvatarBubble = ({ size = 'md', className = '' }) => {
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    return admin?.avatar
      ? <img src={admin.avatar} alt="avatar" className={`${sz} rounded-xl object-cover border-2 border-primary/20 ${className}`} />
      : <div className={`${sz} rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-primary/20 ${className}`}>
          {(admin?.name || 'A').charAt(0).toUpperCase()}
        </div>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-lightCard dark:bg-darkCard border-r border-lightBorder dark:border-darkBorder transition-colors duration-300">
      
      {/* ── Logo / Brand ── */}
      <div className="h-24 flex items-center px-8 border-b border-lightBorder dark:border-darkBorder">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 shrink-0">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 border-2 border-primary rounded-md"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-primary rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tighter uppercase text-textMainLight dark:text-textMainDark">DICE</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-primary/80 uppercase tracking-widest">Admin</span>
                <img src="/logo.png" className="h-3 w-auto object-contain opacity-90 dark:brightness-0 dark:invert" alt="Sanyog" />
              </div>
            </div>
        </div>
      </div>

      {/* ── Admin Profile ── */}
      {admin && (
        <div className="px-6 py-5 border-b border-lightBorder dark:border-darkBorder">
          <div className="flex items-center gap-3">
            <AvatarBubble size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-textMainLight dark:text-textMainDark text-sm font-bold truncate">{admin.name}</p>
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">{admin.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-textSubLight dark:text-textSubDark text-[10px] font-black uppercase tracking-widest px-4 mb-4">Main Menu</p>
        {NAV.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          const isTrash = path === '/trash';
          
          let activeStyles = 'bg-primary text-white shadow-[0_4px_14px_rgba(22,163,74,0.3)]';
          let hoverStyles = 'text-textSubLight dark:text-textSubDark hover:bg-slate-50 dark:hover:bg-darkBg hover:text-primary dark:hover:text-primaryLight';
          
          if (isTrash) {
            hoverStyles = 'text-error/70 hover:bg-red-50 dark:hover:bg-error/10 hover:text-error';
            activeStyles = 'bg-error text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]';
          }

          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group font-bold tracking-wide ${isActive ? activeStyles : hoverStyles}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{label}</span>
              </div>
              {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="p-4 space-y-2 border-t border-lightBorder dark:border-darkBorder">
        <button onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer bg-lightBg dark:bg-darkBg text-textSubLight dark:text-textSubDark hover:text-primary font-bold tracking-wide">
           {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-blue-600" />}
           <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold text-sm transition-all cursor-pointer hover:bg-red-50 dark:hover:bg-error/10 tracking-wide">
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-darkBg font-sans antialiased text-textMainLight dark:text-textMainDark transition-colors duration-300">
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-72 z-[70] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 z-50 shadow-sm transition-transform duration-300">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-20 bg-lightCard/85 dark:bg-darkCard/85 backdrop-blur-xl border-b border-lightBorder dark:border-darkBorder px-6 lg:px-10 flex items-center justify-between shrink-0 shadow-sm z-40 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl shadow-sm cursor-pointer bg-lightCard dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-textMainLight dark:text-textMainDark">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-textMainLight dark:text-textMainDark tracking-tight">{title}</h1>
              {subtitle && <p className="text-[10px] font-black uppercase tracking-widest text-textSubLight dark:text-textSubDark mt-1">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
               <button onClick={() => setNotifOpen(!notifOpen)}
                 className="relative p-2 transition-colors cursor-pointer rounded-xl text-textSubLight dark:text-textSubDark hover:text-primary dark:hover:text-primaryLight hover:bg-slate-50 dark:hover:bg-darkBg">
                  <Bell className="w-6 h-6" />
                  {/* Badge example, if active notifications exist append badge logic here */}
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white dark:border-darkCard"></span>
               </button>
               {notifOpen && (
                 <div className="absolute right-0 top-14 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder animate-fade-in">
                   <div className="px-5 py-4 font-black text-xs uppercase tracking-widest text-textMainLight dark:text-textMainDark border-b border-lightBorder dark:border-darkBorder flex justify-between items-center">
                     <span>Notifications</span>
                     <button className="text-[9px] text-primary hover:underline">Mark all read</button>
                   </div>
                   <div className="p-2 space-y-1">
                     <div className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-darkBg rounded-xl cursor-pointer transition-colors border-b border-transparent dark:border-transparent">
                       <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                         <FileText className="w-4 h-4 text-primary" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-textMainLight dark:text-textMainDark">System Update</p>
                         <p className="text-[10px] text-textSubLight dark:text-textSubDark mt-0.5">Admin portal active.</p>
                       </div>
                     </div>
                   </div>
                   <div className="px-5 py-3 text-center border-t border-lightBorder dark:border-darkBorder">
                     <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View all</button>
                   </div>
                 </div>
               )}
            </div>

            <div className="h-10 w-px mx-1 bg-lightBorder dark:bg-darkBorder"></div>

            <Link to="/settings" className="flex items-center gap-3 cursor-pointer group">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black tracking-tight leading-none mb-1 text-textMainLight dark:text-textMainDark">{admin?.name || 'Admin'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">System Auth</p>
               </div>
               <AvatarBubble size="sm" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden p-4 lg:p-10 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
