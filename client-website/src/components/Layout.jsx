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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
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

  // ─── Dynamic color tokens ─────────────────────────────────────────────────
  const rootBg = isDark ? '#10141D' : '#F8FAFC';
  const sidebarBg = isDark ? '#161B22' : '#FFFFFF';
  const sidebarBorder = isDark ? '#2A2D3E' : '#E2E8F0';
  const headerBg = isDark ? 'rgba(22,27,34,0.7)' : 'rgba(255,255,255,0.7)';
  const textMain = isDark ? '#FFFFFF' : '#0F172A';
  const textSub = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#475569' : '#94A3B8';
  const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC';
  const cardBg = isDark ? '#1E242E' : '#F8FAFC';
  const cardBorder = isDark ? '#2A2D3E' : '#F1F5F9';

  return (
    <div
      className="flex h-screen font-sans antialiased transition-colors duration-300"
      style={{ backgroundColor: rootBg }}
    >
      
      {/* Sidebar - Desktop */}
      <aside
        className="hidden lg:flex w-72 flex-col shadow-sm z-50 transition-colors duration-300"
        style={{
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
        }}
      >
        <div
          className="h-24 flex items-center px-8"
          style={{ borderBottom: `1px solid ${cardBorder}` }}
        >
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Sanyog" className="h-10 w-auto object-contain" 
               onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
             />
             <div style={{display:'none'}} className="w-10 h-10 bg-[#16A34A]/10 rounded-2xl items-center justify-center">
                <Shield className="w-6 h-6 text-[#16A34A]" />
             </div>
             <span style={{ color: textMain }} className="text-xl font-black tracking-tighter uppercase">
               Sanyog <span className="text-[#16A34A] tracking-normal font-normal">Portal</span>
             </span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group"
                style={{
                  backgroundColor: isActive ? 'rgba(22,163,74,0.1)' : 'transparent',
                  color: isActive ? '#16A34A' : textSub,
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = hoverBg;
                    e.currentTarget.style.color = textMain;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = textSub;
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 transition-colors" />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

        <div
          className="p-6 space-y-3"
          style={{ borderTop: `1px solid ${cardBorder}` }}
        >
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
             style={{
               backgroundColor: cardBg,
               border: `1px solid ${isDark ? '#2A2D3E' : '#E2E8F0'}`,
               color: isDark ? '#CBD5E1' : '#475569',
             }}
           >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
              <span className="text-sm font-bold">{isDark ? "Light Mode" : "Dark Mode"}</span>
           </button>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 font-bold text-sm transition-all cursor-pointer"
             style={{ backgroundColor: 'transparent' }}
             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2'; }}
             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
           >
              <LogOut className="w-5 h-5" />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header
          className="h-20 flex items-center justify-between px-6 lg:px-10 z-40 shrink-0 backdrop-blur-xl transition-colors duration-300"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <div className="lg:hidden">
             <button
               onClick={() => setMobileOpen(true)}
               className="p-2 rounded-xl shadow-sm cursor-pointer"
               style={{ backgroundColor: isDark ? '#1E242E' : '#FFFFFF' }}
             >
                <Menu className="w-6 h-6" style={{ color: textMain }} />
             </button>
          </div>

          <div className="hidden lg:block">
             <div
               className="flex items-center gap-1.5 px-4 py-2 rounded-full"
               style={{
                 backgroundColor: isDark ? '#151921' : '#F1F5F9',
                 border: `1px solid ${isDark ? '#2A2D3E' : '#E2E8F0'}`,
               }}
             >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Secure</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="relative p-2 text-gray-500 hover:text-[#16A34A] transition-colors cursor-pointer">
                <Bell className="w-6 h-6" />
                <span
                  className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2"
                  style={{ borderColor: isDark ? '#161923' : '#FFFFFF' }}
                ></span>
             </button>
             <div className="h-10 w-px mx-1" style={{ backgroundColor: isDark ? '#2A2D3E' : '#E2E8F0' }}></div>
             <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black tracking-tight leading-none mb-1" style={{ color: textMain }}>User</p>
                   <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isDark ? '#60A5FA' : '#16A34A' }}>Client Account</p>
                </div>
                <div className="w-10 h-10 bg-[#16A34A]/10 rounded-xl flex items-center justify-center border-2 border-[#16A34A]/20 group-hover:border-[#16A34A] transition-all overflow-hidden">
                   <User className="w-6 h-6 text-[#16A34A]" />
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
           <aside
             className="absolute top-0 left-0 bottom-0 w-80 p-6 flex flex-col transition-colors duration-300"
             style={{ backgroundColor: sidebarBg }}
           >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 font-black uppercase tracking-tighter" style={{ color: textMain }}>
                   <Shield className="w-6 h-6 text-[#16A34A]" />
                   Sanyog
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl cursor-pointer"
                  style={{ backgroundColor: isDark ? '#1E242E' : '#F1F5F9' }}
                >
                   <X className="w-5 h-5" style={{ color: textMain }} />
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                 {navItems.map((item) => {
                   const isActive = location.pathname === item.path;
                   return (
                     <NavLink
                       key={item.path}
                       to={item.path}
                       onClick={() => setMobileOpen(false)}
                       className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all"
                       style={{
                         backgroundColor: isActive ? '#16A34A' : 'transparent',
                         color: isActive ? '#FFFFFF' : textSub,
                       }}
                     >
                       <item.icon className="w-5 h-5" />
                       {item.label}
                     </NavLink>
                   );
                 })}
              </div>

              <div style={{ borderTop: `1px solid ${sidebarBorder}` }} className="pt-6 space-y-3">
                 <button
                   onClick={toggleTheme}
                   className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer"
                   style={{
                     backgroundColor: cardBg,
                     border: `1px solid ${isDark ? '#2A2D3E' : '#E2E8F0'}`,
                     color: isDark ? '#CBD5E1' : '#475569',
                   }}
                 >
                    {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm font-bold">{isDark ? "Light Mode" : "Dark Mode"}</span>
                 </button>
                 <button
                   onClick={handleLogout}
                   className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 font-bold text-sm cursor-pointer"
                 >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                 </button>
              </div>
           </aside>
        </div>
      )}
    </div>
  );
}
