import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Phone, Mail, Save, X, Hash } from 'lucide-react';

interface Specialty {
    id: string;
    name: string;
}

const DoctorRegistration: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        licenseId: '',
        specialtyIds: [] as string[]
    });

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axios.get('http://localhost:3000/specialties');
                setSpecialties(response.data);
            } catch (err) {
                console.error('Error fetching specialties:', err);
            }
        };
        fetchSpecialties();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await axios.post('http://localhost:3000/users/doctors', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                licenseId: formData.licenseId,
                specialtyIds: formData.specialtyIds
            });

            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                licenseId: '',
                specialtyIds: []
            });

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error('Error registering doctor:', err);
            setError(err.response?.data?.message || 'Error al registrar al médico');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doctor-reg-page">
            <div className="form-card">
                <div className="form-card-header">
                    <UserPlus size={20} className="text-primary" />
                    <h3>Registrar Nuevo Médico</h3>
                </div>

                <div className="form-card-body">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-error">
                                <X size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                <Save size={18} />
                                <span>Médico registrado exitosamente</span>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Nombre <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Ej. Juan"
                                    required
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Apellido <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Ej. Pérez"
                                    required
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Correo Electrónico <span className="text-danger">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="doctor@sicam.com"
                                        required
                                        className="form-input"
                                        disabled={loading}
                                    />
                                    <Mail className="input-icon" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Contraseña <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    minLength={6}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Teléfono
                                </label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0999999999"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                    <Phone className="input-icon" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Cédula Profesional
                                </label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        name="licenseId"
                                        value={formData.licenseId}
                                        onChange={handleChange}
                                        placeholder="Número de registro"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                    <Hash className="input-icon" size={18} />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">
                                    Especialidades <span className="text-danger">*</span>
                                </label>
                                <div className="specialties-grid">
                                    {specialties.map(spec => (
                                        <label key={spec.id} className="specialty-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={formData.specialtyIds.includes(spec.id)}
                                                onChange={() => {
                                                    const current = formData.specialtyIds;
                                                    const updated = current.includes(spec.id)
                                                        ? current.filter(id => id !== spec.id)
                                                        : [...current, spec.id];
                                                    setFormData(prev => ({ ...prev, specialtyIds: updated }));
                                                }}
                                                disabled={loading}
                                            />
                                            <span>{spec.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.specialtyIds.length === 0 && (
                                    <small className="text-danger">Selecciona al menos una especialidad</small>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || formData.specialtyIds.length === 0}
                            className="submit-btn"
                            style={{ width: 'auto', minWidth: '200px', height: 'auto', marginTop: '1.5rem' }}
                        >
                            {loading ? 'Registrando...' : 'Registrar Médico'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorRegistration;
