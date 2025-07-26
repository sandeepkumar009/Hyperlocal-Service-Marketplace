import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import BookingPage from './pages/booking/BookingPage';
import BookingSuccessPage from './pages/booking/BookingSuccessPage';
import UserDashboard from './pages/dashboards/UserDashboard';
import ProviderDashboard from './pages/dashboards/ProviderDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import RoleBasedRedirect from './components/common/RoleBasedRedirect'; // Import the new component

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public / User-Facing Routes */}
          <Route path="/" element={<RoleBasedRedirect><HomePage /></RoleBasedRedirect>} />
          <Route path="/services" element={<RoleBasedRedirect><ServicesPage /></RoleBasedRedirect>} />
          <Route path="/service/:id" element={<RoleBasedRedirect><ServiceDetailPage /></RoleBasedRedirect>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" inseam-id="register-page" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/booking/:serviceId" element={<BookingPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/provider" element={<ProviderDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
