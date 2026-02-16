import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Edit, Mail, Phone, ClipboardList, PlusCircle, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSpecialty } from '../context/SpecialtyContext';
import { useNavigate } from 'react-router-dom';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    idNumber: string | null;
    birthDate: string | null;
    gender: string | null;
    createdAt: string;
}

const Patients: React.FC = () => {
    const { activeSpecialty } = useSpecialty();
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingPatients, setFetchingPatients] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '',
        birthDate: '',
        gender: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setFetchingPatients(true);
        try {
            // Check if there is a specific endpoint for patients or use the general users one
            // For now, mocking until backend is confirmed, but trying the logical endpoint
            const response = await axios.get('http://localhost:3000/users/patients');
            setPatients(response.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
            // Fallback empty list if error
            setPatients([]);
        } finally {
            setFetchingPatients(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            idNumber: '',
            birthDate: '',
            gender: ''
        });
        setIsEditing(false);
        setSelectedPatientId(null);
    };

    const handleEditClick = (patient: Patient) => {
        setFormData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone || '',
            idNumber: patient.idNumber || '',
            birthDate: patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '',
            gender: patient.gender || ''
        });
        setIsEditing(true);
        setSelectedPatientId(patient.id);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && selectedPatientId) {
                await axios.patch(`http://localhost:3000/users/patients/${selectedPatientId}`, formData);
                toast.success('Paciente actualizado correctamente');
            } else {
                await axios.post('http://localhost:3000/users/patients', formData);
                toast.success('Paciente registrado correctamente');
            }

            fetchPatients();
            setTimeout(() => {
                setShowModal(false);
                resetForm();
            }, 1000);
        } catch (err: any) {
            console.error('Error saving patient:', err);
            const msg = err.response?.data?.message || 'Error al guardar los datos del paciente';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.idNumber && patient.idNumber.includes(searchTerm))
    );

    const goToMedicalHistory = (patientId: string) => {
        // En un sistema real, guardaríamos el paciente seleccionado en un contexto o lo pasaríamos por URL
        navigate('/dashboard/medical-history', { state: { patientId } });
    };

    return (
        <div className="management-page">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="management-container">
                {/* Header */}
                <div className="management-header">
                    <div>
                        <h1 className="page-title">Gestión de Pacientes</h1>
                        <p className="page-subtitle">Visualiza y administra tus pacientes de {activeSpecialty?.name || 'la clínica'}.</p>
                    </div>
                    <button
                        className="submit-btn"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
                    >
                        <UserPlus size={18} />
                        Registrar Paciente
                    </button>
                </div>

                {/* Controls */}
                <div className="management-controls" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o identificación..."
                            className="form-input search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="stats-group">
                        <span className="count-label" style={{ fontWeight: '500', color: 'var(--text-gray)' }}>Total:</span>
                        <span className="count-badge" style={{ background: 'var(--primary)', color: 'white', padding: '2px 10px', borderRadius: '12px', marginLeft: '8px', fontSize: '13px' }}>
                            {patients.length}
                        </span>
                    </div>
                </div>

                {/* Patient List */}
                <div className="list-card card" style={{ marginTop: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Identificación</th>
                                    <th>Contacto</th>
                                    <th>Fecha Registro</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchingPatients ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                                                <Loader2 className="animate-spin text-primary" size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                                                <p className="text-muted">Cargando pacientes...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12" style={{ padding: '60px' }}>
                                            <p className="text-muted">No se encontraron pacientes registrados.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPatients.map(patient => (
                                        <tr key={patient.id}>
                                            <td>
                                                <div className="doctor-info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="avatar-placeholder" style={{ width: '40px', height: '40px', background: '#F3F4F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--primary)' }}>
                                                        {patient.firstName[0]}{patient.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="doctor-name" style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{patient.firstName} {patient.lastName}</div>
                                                        <div className="doctor-id text-muted" style={{ fontSize: '12px', color: 'var(--text-gray)' }}>ID: {patient.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="license-cell" style={{ fontSize: '14px' }}>
                                                    {patient.idNumber || 'Sin ID'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-cell" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div className="contact-item" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {patient.email}</div>
                                                    {patient.phone && <div className="contact-item" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {patient.phone}</div>}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="action-btn-outline"
                                                        onClick={() => goToMedicalHistory(patient.id)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', width: '36px', height: '36px', color: 'var(--primary)', borderColor: '#E5E7EB' }}
                                                        title="Nueva Historia Clínica"
                                                    >
                                                        <PlusCircle size={18} />
                                                    </button>
                                                    <button
                                                        className="action-btn-outline"
                                                        onClick={() => handleEditClick(patient)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', width: '36px', height: '36px', color: 'var(--text-gray)', borderColor: '#E5E7EB' }}
                                                        title="Editar Paciente"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className="action-btn-outline"
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', width: '36px', height: '36px', color: 'var(--success)', borderColor: '#d1fae5' }}
                                                        title="Historias Previas"
                                                    >
                                                        <ClipboardList size={18} />
                                                    </button>
                                                </div>
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
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content card" style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '0', overflow: 'hidden' }}>
                        <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(93, 95, 239, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    {isEditing ? <Edit size={20} /> : <UserPlus size={20} />}
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-gray)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label className="form-label">Nombre <span className="text-danger">*</span></label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" disabled={loading} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Apellido <span className="text-danger">*</span></label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-input" disabled={loading} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cédula / ID <span className="text-danger">*</span></label>
                                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required className="form-input" disabled={loading} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Género</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-input" disabled={loading}>
                                        <option value="">Seleccionar...</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="O">Otro</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Correo Electrónico <span className="text-danger">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" disabled={loading} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" disabled={loading} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Fecha de Nacimiento</label>
                                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-input" disabled={loading} />
                                </div>
                            </div>

                            <div className="modal-footer" style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-btn" disabled={loading} style={{ width: 'auto', padding: '10px 32px' }}>
                                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar Paciente' : 'Registrar Paciente')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
