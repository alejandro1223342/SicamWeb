import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import api from './api';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import { ToastProvider, useToast } from './components/Toast';
import './index.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import DoctorRegistration from './pages/DoctorRegistration';
import MedicalOffices from './pages/MedicalOffices';
import MedicalHistory from './pages/MedicalHistory';
import MedicalHistoryList from './pages/MedicalHistoryList';
import Patients from './pages/Patients';
import Schedules from './pages/Schedules';
import AdminCatalogsPage from './pages/admin/AdminCatalogsPage';
import { SpecialtyProvider, useSpecialty } from './context/SpecialtyContext';
import PatientClinicalOffices from './pages/PatientClinicalOffices';
import Appointments from './pages/Appointments';
import PrintHistoryPage from './pages/PrintHistoryPage';
import GeneralHistory from './pages/GeneralHistory';
import GeneralHistoryList from './pages/GeneralHistoryList';
import AestheticHistory from './pages/AestheticHistory';
import NutritionHistory from './pages/NutritionHistory';
import PrintAestheticPage from './pages/PrintAestheticPage';
import PrintExamsPage from './pages/PrintExamsPage';
import PrintMealPlanPage from './pages/PrintMealPlanPage';
// Patient routes
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage';
import PaymentConfirmPage from './pages/PaymentConfirmPage';
import PaymentRedirectPage from './pages/PaymentRedirectPage';
import OnboardingPage from './pages/patient/OnboardingPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SpecialtySync from './components/SpecialtySync';
import { Outlet } from 'react-router-dom';

// Los componentes SignIn y SignUp se han movido a src/pages/auth/

// ToastProvider ya se ha movido al principio

// Componente de Sign In con diseño TailAdmin y conexión al backend
// ... (Skipping auth components update context, doing inline replacement for routes)

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const userString = localStorage.getItem('user');
  if (!userString) return <Navigate to="/signin" replace />;

  const user = JSON.parse(userString);
  const location = useLocation();

  if (user.role === 'PACIENTE' && !user.onboardingCompleted) {
    if (location.pathname !== '/patient/onboarding') {
      return <Navigate to="/patient/onboarding" replace />;
    }
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();

  // LOG PARA DIAGNÓSTICO
  console.log("APP RENDER | PATH:", location.pathname, "| KEY:", location.key);

  return (
    <ToastProvider>
      <SpecialtyProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Patient Routes - Now under DashboardLayout */}
          <Route path="/patient/onboarding" element={<OnboardingPage />} />
          <Route path="/patient" element={<RequireOnboarding><DashboardLayout /></RequireOnboarding>}>
            <Route index element={<Navigate to="/patient/clinics" replace />} />
            <Route path="dashboard" element={<Navigate to="/patient/clinics" replace />} />
            <Route path="clinics" element={<PatientClinicalOffices />} />
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="appointments" element={<PatientAppointmentsPage />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="doctor/new" element={<DoctorRegistration />} />
            <Route path="doctors" element={<DoctorRegistration />} />
            <Route path="medical-offices" element={<MedicalOffices />} />
            <Route path="catalogs" element={<AdminCatalogsPage />} />
            
            {/* Specialty-Specific Workspace */}
            <Route path="specialty/:specialtyId" element={<><SpecialtySync /><Outlet /></>}>
              <Route path="schedules" element={<Schedules />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<Patients />} />
              <Route path="medical-history/:patientId/:recordId?" element={<MedicalHistory />} />
              <Route path="aesthetic-history/:patientId/:recordId?" element={<AestheticHistory />} />
              <Route path="general-history/:patientId/:recordId?" element={<GeneralHistory />} />
              <Route path="general-history-list/:patientId" element={<GeneralHistoryList />} />
              <Route path="nutrition-history/:patientId/:recordId?" element={<NutritionHistory />} />
              <Route path="medical-history-list/:patientId" element={<MedicalHistoryList />} />
            </Route>

            {/* Redirects for shared legacy paths (Optional but good UX) */}
            <Route path="schedules" element={<Navigate to="/dashboard" replace />} />
            <Route path="appointments" element={<Navigate to="/dashboard" replace />} />
            <Route path="patients" element={<Navigate to="/dashboard" replace />} />
            <Route path="medical-history/:patientId/:recordId?" element={<Navigate to="/dashboard" replace />} />
            <Route path="aesthetic-history/:patientId/:recordId?" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Dedicated Print Routes (No Layout) */}
          <Route path="/print/history/:patientId/:recordId" element={<PrintHistoryPage />} />
          <Route path="/print/aesthetic/:patientId/:recordId" element={<PrintAestheticPage />} />
          <Route path="/print/exams/:patientId/:recordId" element={<PrintExamsPage />} />
          <Route path="/print/meal-plan/:patientId/:recordId" element={<PrintMealPlanPage />} />

          {/* Payment Routes */}
          <Route path="/payment/confirm" element={<PaymentConfirmPage />} />
          <Route path="/payment/redirecting" element={<PaymentRedirectPage />} />

          <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>404 - Página no encontrada</h1>
            <p>La ruta solicitada no existe.</p>
          </div>} />
        </Routes>
      </SpecialtyProvider>
    </ToastProvider>
  );
}

export default App;
