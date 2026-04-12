import React, { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { Loader2, Camera, User as UserIcon } from 'lucide-react';
import api from '../../api';

export default function PatientProfileForm() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const [genderOptions, setGenderOptions] = useState<{ id: string, name: string }[]>([]);
    const [emailSending, setEmailSending] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '',
        gender: '',
        birthDate: ''
    });

    useEffect(() => {
        fetchGenderOptions();
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const genderLabelMap: any = {
                    'M': 'Masculino',
                    'F': 'Femenino',
                    'O': 'Otro'
                };

                setFormData(prev => ({
                    ...prev,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    idNumber: user.idNumber || '',
                    gender: user.gender ? (genderLabelMap[user.gender] || user.gender) : '',
                    birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
                }));
                setPhotoUrl(user.photoUrl || null);
            } catch (e) {
                console.error("Error parsing user data");
            }
        }
    }, []);

    const fetchGenderOptions = async () => {
        try {
            const response = await api.get('/catalogs/type/GENDER');
            setGenderOptions(response.data);
        } catch (error) {
            console.error("Error fetching gender options:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Validaciones numéricas para cédula y teléfono (si fueran editables)
        if (name === 'idNumber' || name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendRecoveryLink = async () => {
        setEmailSending(true);
        try {
            await api.post('/auth/forgot-password', { email: formData.email });
            showToast('Se ha enviado un enlace de recuperación a tu correo', 'success');
        } catch (error: any) {
            console.error('Error enviando link de recuperación:', error);
            showToast(error.response?.data?.message || 'Error al enviar el enlace', 'error');
        } finally {
            setEmailSending(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Formato no permitido. Usa JPG, PNG o WEBP.', 'error');
            return;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('La imagen es demasiado grande (máx 5MB).', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploadingPhoto(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.patch('/users/patients/me/photo', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                const newPhotoUrl = res.data.photoUrl;
                setPhotoUrl(newPhotoUrl);
                
                // Actualizar localStorage
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const updatedUser = { ...user, photoUrl: newPhotoUrl };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                
                // Notificar al Header para actualizar el avatar en tiempo real
                window.dispatchEvent(new CustomEvent('userUpdate'));

                showToast('Foto de perfil actualizada', 'success');
            }
        } catch (error: any) {
            console.error('Error subiendo foto:', error);
            showToast(error.response?.data?.message || 'Error al subir la foto', 'error');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const getInitials = () => {
        return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            const updatePayload: any = {
                gender: formData.gender,
                birthDate: formData.birthDate
            };

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
            <div className="profile-header-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        position: 'relative'
                    }}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#94a3b8' }}>
                                {getInitials() || <UserIcon size={48} />}
                            </span>
                        )}
                        
                        {uploadingPhoto && (
                            <div style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
                            </div>
                        )}
                    </div>
                    
                    <label style={{ 
                        position: 'absolute', 
                        bottom: '4px', 
                        right: '4px', 
                        backgroundColor: 'var(--primary)', 
                        color: 'white', 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Camera size={18} />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploadingPhoto} />
                    </label>
                </div>
                <h2 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                    {formData.firstName} {formData.lastName}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{formData.email}</p>
            </div>

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
                            disabled
                            className="form-input disabled-input"
                            style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
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
                            disabled
                            className="form-input disabled-input"
                            style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Cédula / ID</label>
                        <input 
                            type="text" 
                            name="idNumber" 
                            value={formData.idNumber} 
                            onChange={handleChange} 
                            disabled
                            className="form-input disabled-input"
                            style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Género</label>
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            className="form-input"
                        >
                            <option value="">Seleccionar...</option>
                            {genderOptions.map(opt => (
                                <option key={opt.id} value={opt.name}>{opt.name}</option>
                            ))}
                        </select>
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
                            disabled
                            className="form-input disabled-input"
                            style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            name="birthDate" 
                            value={formData.birthDate} 
                            onChange={handleChange} 
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            <hr className="section-divider" />
            
            <div className="form-section">
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h3 className="section-title">Seguridad</h3>
                        <p className="section-subtitle">Gestiona la seguridad de tu cuenta y el acceso a Sican.</p>
                    </div>
                    <div style={{ 
                        marginTop: '16px', fontSize: '14px', color: '#64748b', background: '#f0f7ff', 
                        padding: '16px', borderRadius: '12px', border: '1px solid #dbeafe', width: '100%' 
                    }}>
                        <p style={{ margin: 0, fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>Cambio de Contraseña Seguro</p>
                        <p style={{ margin: 0, lineHeight: '1.5' }}>Por motivos de seguridad, para cambiar tu contraseña enviaremos un enlace de verificación único a tu correo electrónico registrado.</p>
                        <button 
                            type="button"
                            onClick={handleSendRecoveryLink}
                            disabled={emailSending}
                            style={{ 
                                marginTop: '16px', width: 'auto', minWidth: '200px', padding: '12px 24px', borderRadius: '10px', 
                                backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold',
                                cursor: emailSending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                            }}
                        >
                            {emailSending ? <Loader2 className="animate-spin" size={18} /> : null}
                            {emailSending ? 'Enviando...' : 'Solicitar Enlace por Email'}
                        </button>
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
