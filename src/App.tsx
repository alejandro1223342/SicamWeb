import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from './api';
import './index.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import DoctorRegistration from './pages/DoctorRegistration';
import MedicalOffices from './pages/MedicalOffices';
import MedicalHistory from './pages/MedicalHistory';
import Patients from './pages/Patients';
import Schedules from './pages/Schedules';
import PatientDashboard from './pages/PatientDashboard';
import { SpecialtyProvider } from './context/SpecialtyContext';

// Componente de Sign In con diseño TailAdmin y conexión al backend
function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Inicio de sesión exitoso:', response.data);

      const { access_token, ...user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirigir al dashboard según el rol
      if (user.role === 'PACIENTE') {
        navigate('/patient/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);

      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrecto');
      } else {
        setError('Error al intentar iniciar sesión. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Ingresa tu correo y contraseña para iniciar sesión</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@gmail.com"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña<span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" disabled={loading} />
                <span>Mantener sesión iniciada</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <p className="auth-footer">
              ¿No tienes una cuenta? <a href="/signup">Registrarse</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Componente de Sign Up con diseño TailAdmin y conexión al backend
function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Correo electrónico inválido');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/patients', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      console.log('Usuario creado exitosamente:', response.data);

      // Redirigir al login después de registro exitoso
      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      navigate('/signin');
    } catch (err: any) {
      console.error('Error al crear usuario:', err);

      if (err.response?.status === 409) {
        setError('Este correo electrónico ya está registrado');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al crear la cuenta. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <h1 className="auth-title">Registrarse</h1>
          <p className="auth-subtitle">Ingresa tus datos para crear una cuenta</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Nombre<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Apellido<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ingresa tu apellido"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña<span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <span>
                Al crear una cuenta aceptas los{' '}
                <a href="/terms">Términos y Condiciones</a> y nuestra{' '}
                <a href="/privacy">Política de Privacidad</a>
              </span>
            </label>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <p className="auth-footer">
              ¿Ya tienes una cuenta? <a href="/signin">Iniciar Sesión</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  // LOG PARA DIAGNÓSTICO
  console.log("APP RENDER | PATH:", location.pathname, "| KEY:", location.key);

  return (
    <SpecialtyProvider>
      <Routes key={location.pathname}>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />


        {/* Dashboard Routes - Standard Nested Structure */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="doctor/new" element={<DoctorRegistration />} />
          <Route path="medical-offices" element={<MedicalOffices />} />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="patients" element={<Patients />} />
          <Route path="schedules" element={<Schedules />} />
        </Route>

        <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>404 - Página no encontrada</h1>
          <p>La ruta solicitada no existe.</p>
        </div>} />
      </Routes>
    </SpecialtyProvider>
  );
}

export default App;
