import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './index.css';

// Componente de Sign In con diseño TailAdmin
function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Ingresa tu correo y contraseña para iniciar sesión</p>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="info@gmail.com"
                className="form-input"
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
                  placeholder="Ingresa tu contraseña"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Mantener sesión iniciada</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="submit-btn">
              Iniciar Sesión
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

// Componente de Sign Up con diseño TailAdmin
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <h1 className="auth-title">Registrarse</h1>
          <p className="auth-subtitle">Ingresa tus datos para crear una cuenta</p>

          <form className="auth-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Nombre<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Ingresa tu nombre"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Apellido<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Ingresa tu apellido"
                  className="form-input"
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
                placeholder="Ingresa tu correo"
                className="form-input"
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
                  placeholder="Ingresa tu contraseña"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-label">
              <input type="checkbox" />
              <span>
                Al crear una cuenta aceptas los{' '}
                <a href="/terms">Términos y Condiciones</a> y nuestra{' '}
                <a href="/privacy">Política de Privacidad</a>
              </span>
            </label>

            <button type="submit" className="submit-btn">
              Registrarse
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
