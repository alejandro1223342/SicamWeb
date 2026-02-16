import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Building2,
    MapPin,
    Phone,
    Users,
    Search,
    Loader2,
    Plus,
    X,
    Pencil,
    UserPlus
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
}

interface Specialty {
    id: string;
    name: string;
}

interface Schedule {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    doctor: Doctor;
    specialty: Specialty;
}

interface MedicalOffice {
    id: string;
    name: string;
    address: string;
    phone: string;
    maxDoctors: number;
    isActive: boolean;
    schedules: Schedule[];
}

export default function MedicalOffices() {
    const [offices, setOffices] = useState<MedicalOffice[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals state
    const [showOfficeModal, setShowOfficeModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<MedicalOffice | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [officeForm, setOfficeForm] = useState({
        name: '',
        address: '',
        phone: '',
        maxDoctors: 2
    });
    const [assignDoctorId, setAssignDoctorId] = useState('');

    const fetchOffices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/medical-offices');
            setOffices(response.data);
        } catch (error) {
            console.error('Error fetching offices:', error);
            toast.error('Error al cargar los consultorios');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        fetchOffices();
        fetchDoctors();
    }, []);

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setOfficeForm({ name: '', address: '', phone: '', maxDoctors: 2 });
        setShowOfficeModal(true);
    };

    const handleOpenEditModal = (office: MedicalOffice) => {
        setIsEditing(true);
        setEditingId(office.id);
        setOfficeForm({
            name: office.name,
            address: office.address,
            phone: office.phone,
            maxDoctors: office.maxDoctors
        });
        setShowOfficeModal(true);
    };

    const handleSubmitOffice = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editingId) {
                await axios.patch(`http://localhost:3000/medical-offices/${editingId}`, officeForm);
                toast.success('Consultorio actualizado exitosamente');
            } else {
                await axios.post('http://localhost:3000/medical-offices', officeForm);
                toast.success('Consultorio creado exitosamente');
            }
            setShowOfficeModal(false);
            setOfficeForm({ name: '', address: '', phone: '', maxDoctors: 2 });
            fetchOffices();
        } catch (error) {
            toast.error(isEditing ? 'Error al actualizar el consultorio' : 'Error al crear el consultorio');
        }
    };

    const handleAssignDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOffice || !assignDoctorId) return;

        try {
            await axios.post(`http://localhost:3000/medical-offices/${selectedOffice.id}/assign/${assignDoctorId}`);
            toast.success('Médico asignado exitosamente');
            setShowAssignModal(false);
            setAssignDoctorId('');
            fetchOffices();
        } catch (error) {
            toast.error('Error al asignar el médico');
        }
    };

    const handleUnassignDoctor = async (officeId: string, doctorId: string) => {
        if (!confirm('¿Está seguro de querer desvincular a este médico de este consultorio?')) return;
        try {
            await axios.delete(`http://localhost:3000/medical-offices/${officeId}/unassign/${doctorId}`);
            toast.success('Médico desvinculado exitosamente');
            fetchOffices();
        } catch (error) {
            toast.error('Error al desvincular al médico');
        }
    };

    const filteredOffices = offices.filter(office =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get linked doctors from the new relationship
    // Note: Assuming the API now returns doctors linked via MedicalOfficeDoctor
    const getAssignedDoctors = (office: any) => {
        // Fallback to schedules if the new 'doctors' property isn't populated yet
        if (office.doctors && office.doctors.length > 0) {
            return office.doctors.map((d: any) => d.doctor);
        }

        // Old logic fallback
        const uniqueDoctors = new Map<string, Doctor>();
        office.schedules?.forEach((schedule: any) => {
            uniqueDoctors.set(schedule.doctor.id, schedule.doctor);
        });
        return Array.from(uniqueDoctors.values());
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="management-page">
            <Toaster position="top-right" />
            <div className="management-container">
                <div className="management-header">
                    <div>
                        <h1 className="page-title">Gestión de Consultorios</h1>
                        <p className="page-subtitle">Visualiza y administra los espacios físicos de la clínica</p>
                    </div>
                    <button className="submit-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleOpenCreateModal}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Nuevo Consultorio
                    </button>
                </div>

                <div className="management-controls">
                    <div className="search-wrapper" style={{ maxWidth: '400px', flex: 1 }}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            className="form-input search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="stats-group">
                        <span className="count-label">Total Consultorios:</span>
                        <span className="count-badge">{filteredOffices.length}</span>
                    </div>
                </div>

                {filteredOffices.length === 0 ? (
                    <div className="list-card card py-12 text-center" style={{ marginTop: '24px' }}>
                        <Building2 size={48} style={{ margin: '0 auto', color: 'var(--text-light)', opacity: 0.5 }} />
                        <p className="mt-4 text-muted">No se encontraron consultorios registrados.</p>
                        <button className="btn-secondary mt-4" onClick={fetchOffices}>
                            Reintentar cargar datos
                        </button>
                    </div>
                ) : (
                    <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
                        {filteredOffices.map((office) => {
                            const assignedDoctors = getAssignedDoctors(office);
                            const usagePercent = Math.min((assignedDoctors.length / office.maxDoctors) * 100, 100);

                            return (
                                <div key={office.id} className="chart-card list-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div className="card-title-group">
                                                <div className="card-icon-wrapper">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontWeight: 700, fontSize: '18px' }}>{office.name}</h3>
                                                    <div className="contact-item mt-1">
                                                        <MapPin size={14} /> {office.address}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`status-badge ${office.isActive ? 'status-active' : 'status-inactive'}`}>
                                                {office.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div className="contact-item mb-4">
                                            <Phone size={14} /> {office.phone}
                                        </div>

                                        <div className="mb-4">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-gray)' }}>Capacidad de Médicos</span>
                                                <span style={{ fontWeight: 700 }}>{assignedDoctors.length} / {office.maxDoctors}</span>
                                            </div>
                                            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${usagePercent}%`,
                                                    height: '100%',
                                                    background: usagePercent > 80 ? 'var(--danger)' : 'var(--success)',
                                                    transition: 'width 0.5s ease-in-out'
                                                }} />
                                            </div>
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Users size={14} /> Médicos Asignados
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {assignedDoctors.length > 0 ? assignedDoctors.map((doctor: Doctor) => (
                                                    <div key={doctor.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                                                            {doctor.firstName[0]}{doctor.lastName[0]}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '13px', fontWeight: 600 }}>{doctor.firstName} {doctor.lastName}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Habilitado para este consultorio</div>
                                                        </div>
                                                        <button
                                                            className="text-danger"
                                                            style={{ background: 'none', border: 'none', padding: '4px' }}
                                                            onClick={() => handleUnassignDoctor(office.id, doctor.id)}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                                                        Sin médicos asignados
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px 20px', background: '#F8FAFC', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            className="action-btn-outline"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                margin: '0',
                                                flex: 'none'
                                            }}
                                            onClick={() => handleOpenEditModal(office)}
                                            title="Editar información"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="submit-btn"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                padding: '0',
                                                background: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                border: '1px solid transparent',
                                                margin: '0',
                                                flex: 'none'
                                            }}
                                            onClick={() => {
                                                setSelectedOffice(office);
                                                setShowAssignModal(true);
                                            }}
                                            disabled={assignedDoctors.length >= office.maxDoctors}
                                            title={assignedDoctors.length >= office.maxDoctors ? 'Cupo Lleno' : 'Asignar Médico'}
                                        >
                                            <UserPlus size={16} color="white" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Nuevo/Editar Consultorio Modal */}
            {showOfficeModal && (
                <div className="modal-overlay">
                    <div className="modal-content card registration-card">
                        <div className="modal-header">
                            <div className="card-title-group">
                                <div className="card-icon-wrapper">
                                    <Building2 size={20} />
                                </div>
                                <h2 className="card-title">{isEditing ? 'Actualizar Consultorio' : 'Registrar Nuevo Consultorio'}</h2>
                            </div>
                            <button className="close-btn" onClick={() => setShowOfficeModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitOffice} className="form-card-body mt-4">
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">Nombre del Consultorio</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. Consultorio 303 - Oftalmología"
                                        value={officeForm.name}
                                        onChange={e => setOfficeForm({ ...officeForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Dirección / Ubicación</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Piso 3, Ala Este"
                                            value={officeForm.address}
                                            onChange={e => setOfficeForm({ ...officeForm, address: e.target.value })}
                                            required
                                        />
                                        <MapPin className="input-icon" size={18} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono / Extensión</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Ext. 303"
                                            value={officeForm.phone}
                                            onChange={e => setOfficeForm({ ...officeForm, phone: e.target.value })}
                                            required
                                        />
                                        <Phone className="input-icon" size={18} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Capacidad de Médicos</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min="1"
                                        max="10"
                                        value={officeForm.maxDoctors}
                                        onChange={e => setOfficeForm({ ...officeForm, maxDoctors: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer mt-6">
                                <button type="button" className="btn-secondary" onClick={() => setShowOfficeModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-btn" style={{ width: 'auto', minWidth: '160px' }}>
                                    {isEditing ? 'Actualizar Consultorio' : 'Crear Consultorio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Asignar Médico Modal */}
            {showAssignModal && selectedOffice && (
                <div className="modal-overlay">
                    <div className="modal-content card" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <div className="card-title-group">
                                <div className="card-icon-wrapper">
                                    <Users size={20} />
                                </div>
                                <h2 className="card-title">Asignar Médico a {selectedOffice.name}</h2>
                            </div>
                            <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAssignDoctor} className="form-card-body mt-4">
                            <div className="form-group full-width">
                                <label className="form-label">Seleccionar Médico</label>
                                <select
                                    className="form-input"
                                    value={assignDoctorId}
                                    onChange={e => setAssignDoctorId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un doctor...</option>
                                    {doctors
                                        .filter(d => !getAssignedDoctors(selectedOffice).some((ad: any) => ad.id === d.id))
                                        .map((doctor: Doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.firstName} {doctor.lastName}
                                            </option>
                                        ))}
                                </select>
                                <p className="text-muted mt-2" style={{ fontSize: '12px' }}>
                                    * Una vez asignado, el médico podrá configurar sus propios horarios para este consultorio.
                                </p>
                            </div>

                            <div className="modal-footer mt-6">
                                <button type="button" className="btn-secondary" onClick={() => setShowAssignModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-btn" style={{ width: 'auto' }} disabled={!assignDoctorId}>
                                    Vincular Médico
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
