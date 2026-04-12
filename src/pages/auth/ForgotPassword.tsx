import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, RotateCcw, Loader2 } from 'lucide-react';
import api from '../../api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setError('');
        
        if (!email.trim()) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err: any) {
            console.error('Error al solicitar recuperación:', err);
            setError(err.response?.data?.message || 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
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
                                <Mail size={48} />
                            </div>
                        </div>
                        <h1 className="auth-title" style={{ fontSize: '28px', marginBottom: '16px' }}>¡Enlace enviado!</h1>
                        <p className="auth-subtitle" style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Hemos enviado un enlace de recuperación a <br />
                            <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>{email}</strong>. <br />
                            Por favor revisa tu bandeja de entrada.
                        </p>
                        <Link to="/signin" className="submit-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
                            Volver al inicio de sesión
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
                    {/* Icon section matching example */}
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

                    <h1 className="auth-title">Recuperar Contraseña</h1>
                    <p className="auth-subtitle">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                    </p>

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
                            <div className="input-with-icon">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="tu@email.com"
                                    className={`form-input ${error ? 'error' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <div className="input-icon">
                                    <Mail size={20} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar enlace de recuperación'
                            )}
                        </button>

                        <p className="auth-footer" style={{ marginTop: '24px' }}>
                            ¿Recordaste tu contraseña? <Link to="/signin">Inicia sesión aquí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
