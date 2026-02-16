import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Phone, Mail, Save, X, Hash, Search } from 'lucide-react';

interface Specialty {
    id: string;
    name: string;
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    licenseId: string | null;
    specialties: Specialty[];
}

const DoctorRegistration: React.FC = () => {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingDoctors, setFetchingDoctors] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal toggle state
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
        fetchSpecialties();
        fetchDoctors();
    }, []);

    const fetchSpecialties = async () => {
        try {
            const response = await axios.get('http://localhost:3000/specialties');
            setSpecialties(response.data);
        } catch (err) {
            console.error('Error fetching specialties:', err);
        }
    };

    const fetchDoctors = async () => {
        setFetchingDoctors(true);
        try {
            const response = await axios.get('http://localhost:3000/users/doctors');
            setDoctors(response.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setFetchingDoctors(false);
        }
    };

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
            fetchDoctors(); // Refresh list

            // Success cleanup
            setTimeout(() => {
                setSuccess(false);
                setShowModal(false); // Close modal on success
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phone: '',
                    licenseId: '',
                    specialtyIds: []
                });
            }, 1500);

        } catch (err: any) {
            console.error('Error registering doctor:', err);
            setError(err.response?.data?.message || 'Error al registrar al médico');
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.licenseId && doctor.licenseId.includes(searchTerm))
    );

    return (
        <div className="management-page">
            <div className="management-container">
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-info">
                        <h1 className="page-title">Gestión de Médicos</h1>
                        <p className="page-subtitle">Visualiza y administra todo el personal médico registrado.</p>
                    </div>
                    <button
                        className="submit-btn"
                        onClick={() => setShowModal(true)}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
                    >
                        <UserPlus size={18} />
                        Registrar Médico
                    </button>
                </div>

                {/* Search and Stats Section */}
                <div className="list-controls-row">
                    <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', marginBottom: 0 }}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o cédula..."
                            className="form-input search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="stats-group">
                        <span className="count-label">Total Médicos:</span>
                        <span className="count-badge">{doctors.length}</span>
                    </div>
                </div>

                {/* Doctors List Card */}
                <div className="list-card card" style={{ marginTop: '1.5rem' }}>
                    <div className="table-responsive">
                        <table className="custom-table" style={{ background: 'white' }}>
                            <thead>
                                <tr>
                                    <th>Médico</th>
                                    <th>Contacto</th>
                                    <th>Especialidades</th>
                                    <th>Cédula</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchingDoctors ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="loader" style={{ margin: '0 auto' }}></div>
                                            <p className="mt-4 text-muted">Cargando médicos...</p>
                                        </td>
                                    </tr>
                                ) : filteredDoctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <p className="text-muted">No se encontraron médicos registrados.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoctors.map(doctor => (
                                        <tr key={doctor.id}>
                                            <td>
                                                <div className="doctor-info-cell">
                                                    <div className="avatar-placeholder">
                                                        {doctor.firstName[0]}{doctor.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="doctor-name">{doctor.firstName} {doctor.lastName}</div>
                                                        <div className="doctor-id text-muted">ID: {doctor.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-cell">
                                                    <div className="contact-item"><Mail size={14} /> {doctor.email}</div>
                                                    {doctor.phone && <div className="contact-item"><Phone size={14} /> {doctor.phone}</div>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="specialties-badges">
                                                    {doctor.specialties.map(spec => (
                                                        <span key={spec.id} className="status-badge status-active">
                                                            {spec.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="license-cell">
                                                    <Hash size={14} /> {doctor.licenseId || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button className="action-btn-outline" onClick={() => { }}>
                                                    Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content card registration-card">
                        <div className="modal-header">
                            <div className="card-title-group">
                                <div className="card-icon-wrapper">
                                    <UserPlus size={20} />
                                </div>
                                <h2 className="card-title">Registrar Nuevo Médico</h2>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="form-card-body mt-4">
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-error mb-4">
                                        <X size={18} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success mb-4">
                                        <Save size={18} />
                                        <span>Médico registrado exitosamente</span>
                                    </div>
                                )}

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Nombre <span className="text-danger">*</span></label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej. Juan" required className="form-input" disabled={loading} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Apellido <span className="text-danger">*</span></label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej. Pérez" required className="form-input" disabled={loading} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Correo Electrónico <span className="text-danger">*</span></label>
                                        <div className="input-with-icon">
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@sicam.com" required className="form-input" disabled={loading} />
                                            <Mail className="input-icon" size={18} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Contraseña <span className="text-danger">*</span></label>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********" required minLength={6} className="form-input" disabled={loading} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Teléfono</label>
                                        <div className="input-with-icon">
                                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="0999999999" className="form-input" disabled={loading} />
                                            <Phone className="input-icon" size={18} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Cédula Profesional</label>
                                        <div className="input-with-icon">
                                            <input type="text" name="licenseId" value={formData.licenseId} onChange={handleChange} placeholder="Número de registro" className="form-input" disabled={loading} />
                                            <Hash className="input-icon" size={18} />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label className="form-label">Especialidades <span className="text-danger">*</span></label>
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

                                <div className="modal-footer mt-6">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={loading || formData.specialtyIds.length === 0} className="submit-btn" style={{ width: 'auto', minWidth: '160px' }}>
                                        {loading ? 'Registrando...' : 'Registrar Médico'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorRegistration;
