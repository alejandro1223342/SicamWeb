import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { SpecialtyProvider } from './context/SpecialtyContext';
import './index.css';

// Importación Síncrona (Solo componentes críticos y pequeños para la primera carga)
import GlobalLoader from './components/layout/GlobalLoader';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Importaciones Dinámicas (Lazy Loading para Code Splitting)
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DoctorRegistration = lazy(() => import('./pages/DoctorRegistration'));
const MedicalOffices = lazy(() => import('./pages/MedicalOffices'));
const MedicalHistory = lazy(() => import('./pages/MedicalHistory'));
const MedicalHistoryList = lazy(() => import('./pages/MedicalHistoryList'));
const Patients = lazy(() => import('./pages/Patients'));
const Schedules = lazy(() => import('./pages/Schedules'));
const AdminCatalogsPage = lazy(() => import('./pages/admin/AdminCatalogsPage'));
const PatientClinicalOffices = lazy(() => import('./pages/PatientClinicalOffices'));
const Appointments = lazy(() => import('./pages/Appointments'));
const PrintHistoryPage = lazy(() => import('./pages/PrintHistoryPage'));
const GeneralHistory = lazy(() => import('./pages/GeneralHistory'));
const GeneralHistoryList = lazy(() => import('./pages/GeneralHistoryList'));
const AestheticHistory = lazy(() => import('./pages/AestheticHistory'));
const NutritionHistory = lazy(() => import('./pages/NutritionHistory'));
const CabinHistory = lazy(() => import('./pages/CabinHistory'));
const CabinHistoryList = lazy(() => import('./pages/CabinHistoryList'));
const PrintAestheticPage = lazy(() => import('./pages/PrintAestheticPage'));
const PrintExamsPage = lazy(() => import('./pages/PrintExamsPage'));
const PrintMealPlanPage = lazy(() => import('./pages/PrintMealPlanPage'));
const PrintPrescriptionPage = lazy(() => import('./pages/PrintPrescriptionPage'));
const PatientProfilePage = lazy(() => import('./pages/patient/PatientProfilePage'));
const PatientAppointmentsPage = lazy(() => import('./pages/patient/PatientAppointmentsPage'));
const PaymentConfirmPage = lazy(() => import('./pages/PaymentConfirmPage'));
const PaymentRedirectPage = lazy(() => import('./pages/PaymentRedirectPage'));
const OnboardingPage = lazy(() => import('./pages/patient/OnboardingPage'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const LogoutPage = lazy(() => import('./pages/auth/LogoutPage'));
const SpecialtySync = lazy(() => import('./components/SpecialtySync'));
const DoctorProfilePage = lazy(() => import('./pages/doctor/DoctorProfilePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));

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
  return (
    <ToastProvider>
      <SpecialtyProvider>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<LogoutPage />} />
            
            {/* Payment Routes */}
            <Route path="/payment/confirm" element={<PaymentConfirmPage />} />
            <Route path="/payment/redirecting" element={<PaymentRedirectPage />} />

            {/* Rutas Protegidas - Solo Pacientes */}
            <Route element={<ProtectedRoute allowedRoles={['PACIENTE']} />}>
              <Route path="/patient/onboarding" element={<OnboardingPage />} />
              <Route path="/patient" element={<RequireOnboarding><DashboardLayout /></RequireOnboarding>}>
                <Route index element={<Navigate to="/patient/clinics" replace />} />
                <Route path="dashboard" element={<Navigate to="/patient/clinics" replace />} />
                <Route path="clinics" element={<PatientClinicalOffices />} />
                <Route path="profile" element={<PatientProfilePage />} />
                <Route path="appointments" element={<PatientAppointmentsPage />} />
              </Route>
            </Route>

            {/* Rutas Protegidas - Solo Médicos, Secretarias y Administradores */}
            <Route element={<ProtectedRoute allowedRoles={['MEDICO', 'ADMIN', 'SECRETARIA']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="doctor/new" element={<DoctorRegistration />} />
                <Route path="doctors" element={<DoctorRegistration />} />
                <Route path="medical-offices" element={<MedicalOffices />} />
                <Route path="catalogs" element={<AdminCatalogsPage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
                
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
                  <Route path="cabin-history/:patientId/:recordId?" element={<CabinHistory />} />
                  <Route path="cabin-history-list/:patientId" element={<CabinHistoryList />} />
                </Route>

                {/* Redirects for shared legacy paths */}
                <Route path="schedules" element={<Navigate to="/dashboard" replace />} />
                <Route path="appointments" element={<Navigate to="/dashboard" replace />} />
                <Route path="patients" element={<Navigate to="/dashboard" replace />} />
                <Route path="medical-history/:patientId/:recordId?" element={<Navigate to="/dashboard" replace />} />
                <Route path="aesthetic-history/:patientId/:recordId?" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* Dedicated Print Routes (Requieren autenticación de STAFF) */}
            <Route element={<ProtectedRoute allowedRoles={['MEDICO', 'ADMIN', 'SECRETARIA']} />}>
              <Route path="/print/prescription" element={<PrintPrescriptionPage />} />
              <Route path="/print/history/:patientId/:recordId" element={<PrintHistoryPage />} />
              <Route path="/print/aesthetic/:patientId/:recordId" element={<PrintAestheticPage />} />
              <Route path="/print/exams/:patientId/:recordId" element={<PrintExamsPage />} />
              <Route path="/print/meal-plan/:patientId/:recordId" element={<PrintMealPlanPage />} />
            </Route>

            <Route path="*" element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>404 - Página no encontrada</h1>
                <p>La ruta solicitada no existe.</p>
              </div>
            } />
          </Routes>
        </Suspense>
      </SpecialtyProvider>
    </ToastProvider>
  );
}

export default App;
