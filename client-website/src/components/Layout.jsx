import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  Sun,
  Moon,
  Settings as SettingsIcon,
  Bell
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Applications", icon: FileText, path: "/my-applications" },
    { label: "Apply Now", icon: PlusCircle, path: "/apply" },
    { label: "Client Profile", icon: User, path: "/profile" },
    { label: "Support", icon: MessageSquare, path: "/support" },
    { label: "Settings", icon: SettingsIcon, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#10141D] font-sans antialiased">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-[#161B22] border-r border-[#E2E8F0] dark:border-[#2A2D3E] shadow-sm z-50">
        <div className="h-24 flex items-center px-8 border-b border-[#F1F5F9] dark:border-[#2A2D3E]">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Sanyog" className="h-10 w-auto object-contain" 
               onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
             />
             <div style={{display:'none'}} className="w-10 h-10 bg-primary/10 rounded-2xl items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
             </div>
             <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Sanyog <span className="text-primary tracking-normal font-normal">Portal</span></span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors`} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100`} />
              </NavLink>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#F1F5F9] dark:border-[#2A2D3E] space-y-3">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#151921] border border-slate-100 dark:border-[#2A2D3E] text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-[#1D222D]"
           >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
              <span className="text-sm font-bold">{isDark ? "Light Mode" : "Dark Mode"}</span>
           </button>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold text-sm"
           >
              <LogOut className="w-5 h-5" />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 glass flex items-center justify-between px-6 lg:px-10 z-40 shrink-0">
          <div className="lg:hidden">
             <button onClick={() => setMobileOpen(true)} className="p-2 bg-white dark:bg-[#1E242E] rounded-xl shadow-sm">
                <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
             </button>
          </div>

          <div className="hidden lg:block">
             <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#151921] rounded-full border border-gray-200 dark:border-[#2A2D3E]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Secure</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#161923]"></span>
             </button>
             <div className="h-10 w-px bg-gray-200 dark:bg-[#2A2D3E] mx-1"></div>
             <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">User</p>
                   <p className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase tracking-wider">Client Account</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all overflow-hidden">
                   <User className="w-6 h-6 text-primary" />
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-[#161B22] p-6 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 font-black uppercase tracking-tighter">
                   <Shield className="w-6 h-6 text-primary" />
                   Sanyog
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-[#1E242E]">
                   <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                 {navItems.map((item) => (
                   <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                        isActive ? "bg-primary text-white" : "text-gray-500 dark:text-slate-400"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                 ))}
              </div>

              <div className="pt-6 border-t dark:border-[#2A2D3E]">
                 <button onClick={handleLogout} className="w-full btn-secondary text-red-500">Sign Out</button>
              </div>
           </aside>
        </div>
      )}
    </div>
  );
}
