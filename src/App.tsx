import { Navigate, Route, Routes } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import LandingPage from './pages/landing/LandingPage';
import AuthLayout from './layouts/AuthLayout';
import NotFound from './pages/NotFound';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import VerifyPage from './pages/auth/VerifyPage';
import ManageUser from './pages/dashboard/ManageClient';

function RootRedirect() {
  const { user, token, isLoading } = useAuth();
  if (isLoading) return null;

  if (!token || !user) return <Navigate to="/login" replace />;

}

function App() {
  return (
    <Routes>


        {/* auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        {/* admin-only */}
        <Route
          element={
            <ProtectedRoute roles={["admin"]} redirectTo="/">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/manage-users" element={<ManageUser />} />
        </Route>

        {/* client-only (kalau mau admin juga bisa akses, tambahkan "admin" di roles) */}
        <Route
          element={
            <ProtectedRoute roles={["client","admin"]} redirectTo="/">
              <LandingLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<LandingPage />} />
        </Route>
      
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  )
}

export default App
