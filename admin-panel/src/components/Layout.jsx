import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../services/auth";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Sanyog</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📋</span>
            Applications
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📂</span>
            Services
          </NavLink>

          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📞</span>
            Contact Requests
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <span className="icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
