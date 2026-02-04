import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Applications from './pages/Applications.jsx';
import ContactRequests from './pages/ContactRequests.jsx';
import { clearAdminToken, getAdminToken } from './services/auth.js';

function Shell({ children }) {
  const navigate = useNavigate();
  const token = getAdminToken();

  const logout = () => {
    clearAdminToken();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Sanyog Admin</div>
          <div className="muted">Applications & callback requests</div>
        </div>
        <div className="nav">
          <NavLink to="/applications">Applications</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {token ? (
            <button className="btn danger" onClick={logout}>Logout</button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function RequireAdmin({ children }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Shell>
              <Login />
            </Shell>
          }
        />
        <Route
          path="/applications"
          element={
            <Shell>
              <RequireAdmin>
                <Applications />
              </RequireAdmin>
            </Shell>
          }
        />
        <Route
          path="/contact"
          element={
            <Shell>
              <RequireAdmin>
                <ContactRequests />
              </RequireAdmin>
            </Shell>
          }
        />
        <Route path="/" element={<Navigate to="/applications" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
