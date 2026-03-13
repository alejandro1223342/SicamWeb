import React, { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api';

export default function PatientProfileForm() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || ''
                }));
            } catch (e) {
                console.error("Error parsing user data");
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        setLoading(true);
        try {
            const updatePayload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            };

            // Sólo incluir contraseña si el usuario escribió algo en el campo
            if (formData.password) {
                updatePayload.password = formData.password;
            }
            
            // Note: Not updating email to avoid auth issues if it's the primary login

            const token = localStorage.getItem('token');
            const res = await api.patch('/users/patients/me', updatePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                showToast('Perfil actualizado correctamente', 'success');
                // Update local storage user
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const updatedUser = { ...user, ...res.data };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                
                // Limpiar campos de contraseña
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));
            }
        } catch (error: any) {
            console.error('Error actualizando perfil:', error);
            showToast(error.response?.data?.message || 'Error al actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
                <h3 className="section-title">Información Personal</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Apellidos</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            disabled
                            className="form-input disabled-input"
                            title="El correo no se puede modificar directamente"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            <hr className="section-divider" />
            
            <div className="form-section">
                <div className="section-header">
                    <h3 className="section-title">Seguridad</h3>
                    <p className="section-subtitle">Llena estos campos únicamente si deseas cambiar tu contraseña.</p>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nueva Contraseña</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange}
                                placeholder="Dejar en blanco para no cambiar"
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

                    <div className="form-group">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            placeholder="Repite la nueva contraseña" 
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                    style={{ maxWidth: '200px', marginLeft: 'auto' }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
