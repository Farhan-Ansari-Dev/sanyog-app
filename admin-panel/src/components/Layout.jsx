import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../services/auth";
import { 
  LayoutDashboard, 
  ClipboardList, 
  FolderTree, 
  PhoneCall, 
  LogOut,
  Users,
  Settings as SettingsIcon,
  Moon,
  Sun
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-['Inter'] antialiased selection:bg-[#22C55E]/10 selection:text-[#16A34A]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0F172A] border-r border-[#E2E8F0] flex flex-col justify-between shadow-sm relative z-20">
        <div>
          {/* Brand/Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-[#F1F5F9]">
            <img 
              src="/logo.png" 
              alt="Sanyog" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              <ClipboardList className="w-5 h-5" />
              Applications
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              <FolderTree className="w-5 h-5" />
              Services
            </NavLink>

            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`
              }
            >
              <PhoneCall className="w-5 h-5" />
              Contact Requests
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                }`
              }
            >
              <Users className="w-5 h-5" />
              User Management
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#16A34A] shadow-sm" 
                    : "text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                }`
              }
            >
              <SettingsIcon className="w-5 h-5" />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-[#F1F5F9] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] flex flex-col gap-2">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[15px] font-medium text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 w-full overflow-x-hidden">
        <div className="flex-1 w-full p-4 sm:p-8">
          <div className="w-full h-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
