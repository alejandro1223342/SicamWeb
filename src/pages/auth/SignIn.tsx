import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signInSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
    keepLoggedIn: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInFormData) => {
        console.log(data);
        // TODO: Implement sign in logic
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content">
                    <h1 className="auth-title">Iniciar Sesión</h1>
                    <p className="auth-subtitle">Ingresa tu correo y contraseña para iniciar sesión</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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

                        <button type="submit" className="submit-btn">
                            Iniciar Sesión
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
