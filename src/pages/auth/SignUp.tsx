import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '../../components/Toast';

const signUpSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo'),
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const passwordValue = watch('password', '');
    const confirmPasswordValue = watch('confirmPassword', '');

    const requirements = [
        { label: 'Mínimo 8 caracteres', test: passwordValue.length >= 8 },
        { label: 'Una mayúscula', test: /[A-Z]/.test(passwordValue) },
        { label: 'Una minúscula', test: /[a-z]/.test(passwordValue) },
        { label: 'Un número', test: /[0-9]/.test(passwordValue) },
        { label: 'Un símbolo', test: /[^A-Za-z0-9]/.test(passwordValue) },
    ];

    const onSubmit = async () => {
        setError('');
        setLoading(true);

        try {

            // Redirigir al login después de registro exitoso
            showToast('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');
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
                        <div className="form-row-2">
                            <div className="form-group">
                                <label htmlFor="firstName" className="form-label">
                                    Nombre<span className="required">*</span>
                                </label>
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    id="firstName"
                                    placeholder="Ingresa tu nombre"
                                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                                />
                                {errors.firstName && (
                                    <span className="error-message">{errors.firstName.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName" className="form-label">
                                    Apellido<span className="required">*</span>
                                </label>
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    id="lastName"
                                    placeholder="Ingresa tu apellido"
                                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                                />
                                {errors.lastName && (
                                    <span className="error-message">{errors.lastName.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico<span className="required">*</span>
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                placeholder="Ingresa tu correo"
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
                            
                            {/* Password Requirements Checklist */}
                            {passwordValue && (
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
                                    {requirements.map((req, index) => (
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
                            
                            {errors.password && !passwordValue && (
                                <span className="error-message">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmar Contraseña<span className="required">*</span>
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    {...register('confirmPassword')}
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    placeholder="Repite tu contraseña"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message">{errors.confirmPassword.message}</span>
                            )}
                            {confirmPasswordValue && passwordValue === confirmPasswordValue && (
                                <div style={{ marginTop: '4px', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={14} /> Las contraseñas coinciden
                                </div>
                            )}
                        </div>

                        <label className="checkbox-label terms-label">
                            <input {...register('agreeToTerms')} type="checkbox" />
                            <span>
                                Al crear una cuenta aceptas los{' '}
                                <Link to="/terms">Términos y Condiciones</Link> y nuestra{' '}
                                <Link to="/privacy">Política de Privacidad</Link>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <span className="error-message">{errors.agreeToTerms.message}</span>
                        )}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creando cuenta...
                                </span>
                            ) : (
                                'Registrarse'
                            )}
                        </button>

                        <p className="auth-footer">
                            ¿Ya tienes una cuenta? <Link to="/signin">Iniciar Sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
