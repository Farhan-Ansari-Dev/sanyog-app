import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Settings as SettingsIcon
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Applications", icon: FileText, path: "/my-applications" },
  { label: "Apply", icon: PlusCircle, path: "/apply" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Support", icon: MessageSquare, path: "/support" },
  { label: "Settings", icon: SettingsIcon, path: "/settings" },
];

export default function Sidebar() {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Logo — auto-loaded from /logo.png */}
          <img
            src="/logo.png" 
            alt="Sanyog"
            className="h-8 w-auto object-contain"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div style={{display:'none'}} className="w-9 h-9 bg-white dark:bg-[#0F172A]/20 rounded-lg items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider px-4 mb-3">
          Navigation
        </p>
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setMobileOpen(false); }}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-sm">{label}</span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Logout & Theme */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        <button 
          onClick={toggleTheme}
          className="sidebar-link hover:bg-white/10 w-full mb-2"
        >
          {isDark ? <Sun className="w-5 h-5 shrink-0 text-yellow-400" /> : <Moon className="w-5 h-5 shrink-0 text-blue-200" />}
          <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button onClick={handleLogout} className="sidebar-link text-red-300 hover:bg-red-500/20 hover:text-red-200 w-full">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-primary flex items-center px-4 z-40 shadow-md">
        <div className="flex items-center gap-3 flex-1">
          <img src="/logo.png"  alt="Sanyog" className="h-7 w-auto object-contain"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }}
          />
          <Shield style={{display:'none'}} className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-sm">Sanyog Certify</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2 rounded-lg hover:bg-white dark:bg-[#0F172A]/10"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-primary z-40 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-14">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary min-h-screen shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
