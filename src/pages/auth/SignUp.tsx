import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signUpSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar los términos y condiciones',
    }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        console.log(data);
        // TODO: Implement sign up logic with backend
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content">
                    <h1 className="auth-title">Registrarse</h1>
                    <p className="auth-subtitle">Ingresa tus datos para crear una cuenta</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                            {errors.password && (
                                <span className="error-message">{errors.password.message}</span>
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

                        <button type="submit" className="submit-btn">
                            Registrarse
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
