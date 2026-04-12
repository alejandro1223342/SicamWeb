import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, RotateCcw, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, Circle } from 'lucide-react';
import api from '../../api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Token de recuperación no encontrado. Por favor solicita uno nuevo.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
        if (!complexityRegex.test(password)) {
            setError('La contraseña no cumple con todos los requisitos de seguridad');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/reset-password', { token, password });
            setSuccess(true);
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err: any) {
            console.error('Error al restablecer contraseña:', err);
            setError(err.response?.data?.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-content text-center" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{ 
                                background: 'rgba(93, 95, 239, 0.1)', 
                                padding: '20px', 
                                borderRadius: '50%', 
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CheckCircle2 size={48} />
                            </div>
                        </div>
                        <h1 className="auth-title" style={{ fontSize: '28px', marginBottom: '16px' }}>¡Contraseña Cambiada!</h1>
                        <p className="auth-subtitle" style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Tu contraseña ha sido restablecida con éxito.<br />
                            Serás redirigido al inicio de sesión en unos segundos...
                        </p>
                        <Link to="/signin" className="submit-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
                            Ir al inicio de sesión ahora
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
                        <div style={{ 
                            background: 'rgba(93, 95, 239, 0.1)', 
                            padding: '16px', 
                            borderRadius: '50%',
                            color: 'var(--primary)',
                            position: 'relative'
                        }}>
                            <Lock size={32} />
                            <RotateCcw 
                                size={16} 
                                style={{ 
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px',
                                    fontWeight: 'bold'
                                }} 
                            />
                        </div>
                    </div>

                    <h1 className="auth-title">Restablecer Contraseña</h1>
                    <p className="auth-subtitle">
                        Ingresa tu nueva contraseña a continuación. Asegúrate de que cumpla con todos los requisitos de seguridad.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Security Info Box matching Image 2 */}
                        <div style={{ 
                            backgroundColor: '#FFFBEB', 
                            border: '1px solid #FEF3C7', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            marginBottom: '24px' 
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
                                Información de Seguridad
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '13px', color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={14} /> Este enlace es válido por 1 hora únicamente
                                </div>
                                <div style={{ fontSize: '13px', color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={14} /> Solo puede ser usado una vez
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="error-banner" style={{ marginBottom: '20px' }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Nueva Contraseña<span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Mínimo 8 caracteres"
                                    className={`form-input ${password && password.length < 8 ? 'error' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            
                            {/* Password Requirements Checklist */}
                            {password && (
                                <div style={{ 
                                    marginTop: '12px', 
                                    padding: '12px', 
                                    backgroundColor: '#F8FAFC', 
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gap: '8px'
                                }}>
                                    {[
                                        { label: 'Mínimo 8 caracteres', test: password.length >= 8 },
                                        { label: 'Una mayúscula', test: /[A-Z]/.test(password) },
                                        { label: 'Una minúscula', test: /[a-z]/.test(password) },
                                        { label: 'Un número', test: /[0-9]/.test(password) },
                                        { label: 'Un símbolo', test: /[^A-Za-z0-9]/.test(password) },
                                    ].map((req, index) => (
                                        <div key={index} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '6px',
                                            fontSize: '12px',
                                            color: req.test ? '#10B981' : '#94A3B8',
                                            transition: 'all 0.2s'
                                        }}>
                                            {req.test ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmar Nueva Contraseña<span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    placeholder="Repite tu nueva contraseña"
                                    className={`form-input ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            {confirmPassword && (
                                <div style={{ 
                                    marginTop: '8px', 
                                    fontSize: '12px', 
                                    color: password === confirmPassword ? '#10B981' : '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {password === confirmPassword ? (
                                        <><CheckCircle2 size={14} /> Las contraseñas coinciden</>
                                    ) : (
                                        <><AlertTriangle size={14} /> Las contraseñas no coinciden</>
                                    )}
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={
                                loading || 
                                !token || 
                                password.length < 8 || 
                                !(/[A-Z]/.test(password)) || 
                                !(/[a-z]/.test(password)) || 
                                !(/[0-9]/.test(password)) || 
                                !(/[^A-Za-z0-9]/.test(password)) ||
                                password !== confirmPassword
                            }
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    Restableciendo...
                                </span>
                            ) : (
                                'Restablecer Contraseña'
                            )}
                        </button>

                        <p className="auth-footer" style={{ marginTop: '24px' }}>
                            <Link to="/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                                Volver al Inicio de Sesión
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
