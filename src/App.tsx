import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import WhatsAppSetup from "./components/whatsapp/WhatsAppSetup";
import InstagramSetup from "./components/instagram/InstagramSetup";
import IntegrationsPage from "./components/integrations/IntegrationsPage";
import AttendantManagement from "./components/admin/AttendantManagement";
import AccountManagement from "./components/admin/AccountManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthProvider from "./components/auth/AuthProvider";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/integrations"
            element={
              <ProtectedRoute requireIntegration={false}>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whatsapp-setup"
            element={
              <ProtectedRoute requireIntegration={false}>
                <WhatsAppSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instagram-setup"
            element={
              <ProtectedRoute requireIntegration={false}>
                <InstagramSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendant-management"
            element={
              <ProtectedRoute requireIntegration={false} requireAdmin={true}>
                <AttendantManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-management"
            element={
              <ProtectedRoute requireIntegration={false} requireAdmin={true}>
                <AccountManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Add a catch-all route that redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
