import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api';
import { useSpecialty } from '../../context/SpecialtyContext';

const signInSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
    keepLoggedIn: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
    const navigate = useNavigate();
    const { refreshSpecialties } = useSpecialty();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            console.log('Inicio de sesión exitoso:', response.data);

            const { access_token, ...user } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Refresh specialties context to update sidebar immediately
            refreshSpecialties();

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

                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        {error && (
                            <div className="error-banner" style={{ 
                                backgroundColor: '#FEF2F2', 
                                color: '#EF4444', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                marginBottom: '20px',
                                border: '1px solid #FEE2E2',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico<span className="required">*</span>
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                placeholder="info@gmail.com"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña<span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Ingresa tu contraseña"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="error-message">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <label className="checkbox-label">
                                <input {...register('keepLoggedIn')} type="checkbox" />
                                <span>Mantener sesión iniciada</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>

                        <p className="auth-footer">
                            ¿No tienes una cuenta? <Link to="/signup">Registrarse</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
