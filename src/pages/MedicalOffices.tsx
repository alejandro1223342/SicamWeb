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
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchOffices();
    }, []);

    const filteredOffices = offices.filter(office =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group schedules by doctor to show which doctors use the office
    const getDoctorsInOffice = (office: MedicalOffice) => {
        const uniqueDoctors = new Map<string, Doctor>();
        office.schedules.forEach(schedule => {
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
            <div className="management-container">
                <div className="management-header">
                    <div>
                        <h1 className="page-title">Gestión de Consultorios</h1>
                        <p className="page-subtitle">Visualiza y administra los espacios físicos de la clínica</p>
                    </div>
                    <button className="submit-btn" style={{ width: 'auto', padding: '10px 24px' }}>
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
                            const assignedDoctors = getDoctorsInOffice(office);
                            const usagePercent = Math.min((assignedDoctors.length / office.maxDoctors) * 100, 100);

                            return (
                                <div key={office.id} className="chart-card list-card" style={{ padding: '0' }}>
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

                                    <div style={{ padding: '20px' }}>
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

                                        <div>
                                            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Users size={14} /> Médicos Asignados
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {assignedDoctors.length > 0 ? assignedDoctors.map(doctor => (
                                                    <div key={doctor.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                                                            {doctor.firstName[0]}{doctor.lastName[0]}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '13px', fontWeight: 600 }}>{doctor.firstName} {doctor.lastName}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Clock size={10} /> Consultorio compartido
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                                                        Sin médicos asignados
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px 20px', background: '#F8FAFC', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button className="action-btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                            Editar Info
                                        </button>
                                        <button className="submit-btn" style={{ fontSize: '12px', width: 'auto', padding: '6px 12px', background: 'var(--primary)' }}>
                                            Gestionar Horarios
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
