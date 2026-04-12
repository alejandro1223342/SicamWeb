import React, { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { Loader2, Camera, User as UserIcon, ShieldAlert } from 'lucide-react';
import api from '../../api';

export default function DoctorProfileForm() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseId: '',
        appointmentRate: '0.00',
        specialties: [] as any[]
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                const data = res.data;
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    licenseId: data.licenseId || '',
                    appointmentRate: data.appointmentRate ? parseFloat(data.appointmentRate.toString()).toFixed(2) : '0.00',
                    specialties: data.specialties || []
                });
                setPhotoUrl(data.photoUrl || null);
                
                // Actualizar localStorage con datos frescos si es necesario
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const updatedUser = { ...user, ...data };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    // Notificar cambios globales (por si acaso el header no se enteró)
                    window.dispatchEvent(new CustomEvent('userUpdate'));
                }
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            showToast('Error al cargar la información del perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Formato no permitido. Usa JPG, PNG o WEBP.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('La imagen es demasiado grande (máx 5MB).', 'error');
            return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        setUploadingPhoto(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.patch('/users/me/photo', formDataPayload, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                const newPhotoUrl = res.data.photoUrl;
                setPhotoUrl(newPhotoUrl);
                
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    const updatedUser = { ...user, photoUrl: newPhotoUrl };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                
                window.dispatchEvent(new CustomEvent('userUpdate'));
                showToast('Foto de perfil actualizada', 'success');
            }
        } catch (error: any) {
            console.error('Error subiendo foto:', error);
            showToast('Error al subir la foto a Google Drive', 'error');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const getInitials = () => {
        if (!formData.firstName) return '';
        return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    };

    if (loading && !formData.firstName) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="profile-form">
            {/* Header / Avatar Section */}
            <div className="profile-header-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ 
                        width: '140px', 
                        height: '140px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        position: 'relative'
                    }}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#94a3b8' }}>
                                {getInitials() || <UserIcon size={56} />}
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
                                <Loader2 className="animate-spin" size={36} color="#3b82f6" />
                            </div>
                        )}
                    </div>
                    
                    <label style={{ 
                        position: 'absolute', 
                        bottom: '6px', 
                        right: '6px', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Camera size={20} />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploadingPhoto} />
                    </label>
                </div>
                <h2 style={{ marginTop: '1.25rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                    Dr. {formData.firstName} {formData.lastName}
                </h2>
                <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {formData.specialties.map((spec: any) => (
                        <span key={spec.id} style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#eff6ff', 
                            color: '#1d4ed8', 
                            borderRadius: '9999px', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            border: '1px solid #dbeafe'
                        }}>
                            {spec.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">Información Profesional</h3>
                
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Nombre(s)</label>
                        <input type="text" value={formData.firstName} disabled className="form-input disabled-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Apellido(s)</label>
                        <input type="text" value={formData.lastName} disabled className="form-input disabled-input" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Cédula Profesional</label>
                        <input type="text" value={formData.licenseId} disabled className="form-input disabled-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tarifa de Consulta</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span>
                            <input type="text" value={formData.appointmentRate} disabled className="form-input disabled-input" style={{ paddingLeft: '24px' }} />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input type="email" value={formData.email} disabled className="form-input disabled-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Teléfono de Contacto</label>
                        <input type="text" value={formData.phone} disabled className="form-input disabled-input" />
                    </div>
                </div>
            </div>

            <hr className="section-divider" style={{ margin: '2rem 0' }} />

            <div className="form-section">
                <h3 className="section-title">Seguridad de la Cuenta</h3>
                <div style={{ 
                    backgroundColor: '#fff7ed', 
                    border: '1px solid #ffedd5', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    display: 'flex', 
                    gap: '16px',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ backgroundColor: '#ffedd5', padding: '10px', borderRadius: '10px', color: '#9a3412' }}>
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 'bold', color: '#9a3412' }}>
                            Restablecimiento de Contraseña
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.925rem', color: '#c2410c', lineHeight: '1.5' }}>
                            Por políticas de seguridad institucional, los médicos no pueden cambiar su contraseña directamente desde el portal. 
                            <strong> Por favor, comuníquese con el departamento de Servicio Técnico para solicitar un restablecimiento seguro.</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic' }}>
                    * Los datos profesionales solo pueden ser modificados por el administrador.
                </p>
            </div>
        </div>
    );
}
