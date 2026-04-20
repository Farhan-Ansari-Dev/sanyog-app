import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import { 
  LayoutDashboard, FileText, PlusCircle, User, LogOut, Shield,
  Menu, X, ChevronRight, MessageSquare, Sun, Moon,
  Settings as SettingsIcon, Bell, Clock, CheckCircle
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [userRes, notifRes] = await Promise.all([
          API.get("/auth/me"),
          API.get("/notifications")
        ]);
        setUser(userRes.data);
        setNotifications(notifRes.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const navItems = [
    { label: "Dashboard",   icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Applications", icon: FileText,    path: "/my-applications" },
    { label: "Apply Now",   icon: PlusCircle,      path: "/apply" },
    { label: "Client Profile", icon: User,          path: "/profile" },
    { label: "Support",     icon: MessageSquare,   path: "/support" },
    { label: "Settings",    icon: SettingsIcon,    path: "/settings" },
  ];

  return (
    <div className="flex h-screen font-sans antialiased text-textMainLight dark:text-textMainDark bg-lightBg dark:bg-darkBg transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col shadow-sm z-50 bg-lightCard dark:bg-darkCard border-r border-lightBorder dark:border-darkBorder transition-colors duration-300">
        <div className="h-24 flex items-center px-8 border-b border-lightBorder dark:border-darkBorder">
          <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-700 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 border-2 border-primary rounded-md"></div>
                  <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-primary rounded-full"></div>
                  <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-primary rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter uppercase text-textMainLight dark:text-textMainDark">DICE</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-primary/80 dark:text-primaryLight/80 uppercase tracking-widest">by</span>
                  <img src="/logo.png" alt="Sanyog" className="h-3 w-auto object-contain opacity-90 dark:brightness-0 dark:invert" 
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <span style={{display:'none'}} className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Sanyog</span>
                </div>
              </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold tracking-wide ${isActive ? 'bg-primary text-white shadow-[0_4px_14px_rgba(22,163,74,0.3)]' : 'text-textSubLight dark:text-textSubDark hover:bg-slate-50 dark:hover:bg-darkBg hover:text-primary dark:hover:text-primaryLight'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-6 space-y-3 border-t border-lightBorder dark:border-darkBorder">
           <button onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder text-textSubLight dark:text-textSubDark hover:bg-slate-50 dark:hover:bg-darkBg font-bold tracking-wide">
              {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-blue-600" />}
              <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
           </button>
           <button onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold text-sm transition-all cursor-pointer hover:bg-red-50 dark:hover:bg-error/10 tracking-wide">
              <LogOut className="w-5 h-5" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 z-40 shrink-0 bg-lightCard/85 dark:bg-darkCard/85 backdrop-blur-xl border-b border-lightBorder dark:border-darkBorder transition-colors duration-300">
          <div className="lg:hidden">
             <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl shadow-sm cursor-pointer bg-lightCard dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-textMainLight dark:text-textMainDark">
                <Menu className="w-6 h-6" />
             </button>
          </div>
          <div className="hidden lg:block">
             <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-textSubLight dark:text-textSubDark uppercase tracking-widest">Network Secure</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Notification Bell */}
             <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 transition-colors cursor-pointer rounded-xl text-textSubLight dark:text-textSubDark hover:text-primary dark:hover:text-primaryLight hover:bg-slate-50 dark:hover:bg-darkBg">
                   <Bell className="w-6 h-6" />
                   {notifications.filter(n => !n.read).length > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white dark:border-darkCard"></span>
                   )}
                </button>
                {/* Notification Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 top-14 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder">
                    <div className="px-5 py-4 font-black text-xs uppercase tracking-widest text-textMainLight dark:text-textMainDark border-b border-lightBorder dark:border-darkBorder">
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-textSubLight dark:text-textSubDark">No notifications yet</div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n._id} className="px-5 py-4 flex items-start gap-3 transition-colors cursor-pointer border-b border-lightBorder dark:border-darkBorder"
                            onClick={() => !n.read && markAsRead(n._id)}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.read ? 'bg-slate-100 dark:bg-darkBg' : 'bg-primary/20 dark:bg-primary/20'}`}>
                              {n.read ? <CheckCircle className="w-4 h-4 text-textSubLight dark:text-textSubDark" /> : <Clock className="w-4 h-4 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate ${n.read ? 'text-textSubLight dark:text-textSubDark' : 'text-textMainLight dark:text-textMainDark'}`}>{n.title}</p>
                              <p className="text-[10px] mt-0.5 leading-relaxed text-textSubLight dark:text-textSubDark">{n.desc}</p>
                              <p className="text-[9px] mt-1 font-bold uppercase tracking-widest text-textSubLight dark:text-textSubDark opacity-60">{getTimeAgo(n.createdAt)}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="px-5 py-3 text-center border-t border-lightBorder dark:border-darkBorder">
                      <button 
                        onClick={() => {
                          notifications.filter(n => !n.read).forEach(n => markAsRead(n._id));
                        }} 
                        className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline"
                      >Mark All Read</button>
                    </div>
                  </div>
                )}
             </div>
             <div className="h-10 w-px mx-1 bg-lightBorder dark:bg-darkBorder"></div>
             <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black tracking-tight leading-none mb-1 text-textMainLight dark:text-textMainDark">{user?.name || "Partner"}</p>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Verified Account</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all overflow-hidden">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-sm font-black text-primary">{user?.name?.charAt(0) || "U"}</span>
                   )}
                </div>
             </div>
          </div>
        </header>

        {/* Close notification on outside click */}
        {notifOpen && <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)}></div>}

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-80 p-6 flex flex-col bg-lightCard dark:bg-darkCard">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 font-black uppercase tracking-tighter text-textMainLight dark:text-textMainDark">
                   <Shield className="w-6 h-6 text-primary" /> Sanyog
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl cursor-pointer bg-lightBg dark:bg-darkBg">
                   <X className="w-5 h-5 text-textMainLight dark:text-textMainDark" />
                </button>
              </div>
              <div className="flex-1 space-y-2">
                 {navItems.map((item) => {
                   const isActive = location.pathname === item.path;
                   return (
                     <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                       className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all tracking-wide ${isActive ? 'bg-primary text-white shadow-[0_4px_14px_rgba(22,163,74,0.3)]' : 'text-textSubLight dark:text-textSubDark hover:bg-slate-50 dark:hover:bg-darkBg hover:text-primary dark:hover:text-primaryLight'}`}>
                       <item.icon className="w-5 h-5" /> {item.label}
                     </NavLink>
                   );
                 })}
              </div>
              <div className="pt-6 space-y-3 border-t border-lightBorder dark:border-darkBorder">
                 <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder text-textSubLight dark:text-textSubDark hover:bg-slate-50 dark:hover:bg-darkBg font-bold tracking-wide">
                    {isDark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
                 </button>
                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-error/10 tracking-wide">
                    <LogOut className="w-5 h-5" /> Sign Out
                 </button>
              </div>
           </aside>
        </div>
      )}
    </div>
  );
}
