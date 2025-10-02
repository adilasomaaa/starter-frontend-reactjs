import { Route, Routes } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import VerifyPage from './pages/auth/VerifyPage';
import ManageClient from './pages/dashboard/Client/ManageClient';
import ProfilPage from './pages/landing/ProfilPage';
import ManageUser from './pages/dashboard/ManageUser';
import ManageRole from './pages/dashboard/ManageRole';
import ManagePermissions from './pages/dashboard/ManagePermissions';

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
          <Route path="/dashboard/manage-clients" element={<ManageClient />} />
          <Route path="/dashboard/manage-users" element={<ManageUser />} />
          <Route path="/dashboard/manage-roles" element={<ManageRole />} />
          <Route path="/dashboard/manage-permissions" element={<ManagePermissions />} />
        </Route>

        <Route element={
          <LandingLayout />}
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilPage />} />
        </Route>
      
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  )
}

export default App
