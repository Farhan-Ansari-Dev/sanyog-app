import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ContactRequests from "./pages/ContactRequests";
import ServicesManagement from "./pages/ServicesManagement";
import Layout from "./components/Layout";
import { getAdminToken } from "./services/auth";

function ProtectedRoute({ children }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;