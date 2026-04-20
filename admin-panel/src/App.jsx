import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ContactRequests from "./pages/ContactRequests";
import ServicesManagement from "./pages/ServicesManagement";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import { getAdminToken } from "./services/auth";

function ProtectedRoute({ children }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1E293B', color: '#fff', fontSize: '14px', borderRadius: '12px' } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="contacts" element={<ContactRequests />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;