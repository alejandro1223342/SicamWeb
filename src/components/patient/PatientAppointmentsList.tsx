import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import api from '../../api';

interface AppointmentData {
    id: string;
    appointmentDate: string;
    status: string;
    attendance: string;
    schedule: {
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
        };
        specialty: {
            id: string;
            name: string;
        };
        office: {
            id: string;
            name: string;
        };
    };
}

export default function PatientAppointmentsList() {
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, UPCOMING, PAST

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/appointments/patient/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAppointments(res.data);
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            setError('No se pudieron cargar las citas. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            dateStr: date.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
            timeStr: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    const getStatusBadge = (status: string, attendance: string, appointmentDateStr: string) => {
        const appointmentDate = new Date(appointmentDateStr);
        const now = new Date();

        if (status === 'CANCELADA') {
            return <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Cancelada</span>;
        }

        if (attendance === 'ATENDIDO') {
            return <span style={{ backgroundColor: '#dcfce7', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Asistió</span>;
        }
        
        if (attendance === 'NO_ASISTIO') {
            return <span style={{ backgroundColor: '#fef3c7', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>No Asistió</span>;
        }

        if (appointmentDate < now) {
            return <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Pasada</span>;
        }

        return <span style={{ backgroundColor: '#ede9fe', color: '#5D5FEF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Programada</span>;
    };

    const filteredAppointments = appointments.filter(app => {
        const isPastDate = new Date(app.appointmentDate) < new Date();
        const isCompleted = app.status === 'COMPLETADA' || app.attendance === 'ATENDIDO' || app.attendance === 'NO_ASISTIO';
        const isCancelled = app.status === 'CANCELADA';
        
        // Consider it 'PAST' (Historial) if the date has passed OR if it has already been attended/missed.
        const belongsToHistory = isPastDate || isCompleted;

        if (filter === 'UPCOMING') {
            return !belongsToHistory && !isCancelled;
        }
        
        if (filter === 'PAST') {
            return belongsToHistory && !isCancelled;
        }
        
        // ALL shows everything
        return true;
    });

    if (loading) {
        return <div className="loading-state">Cargando tus citas...</div>;
    }

    if (error) {
        return <div className="error-banner">{error}</div>;
    }

    return (
        <div className="appointments-list-container">
            {/* Filtros */}
            <div className="filters-row" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('ALL')}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: filter === 'ALL' ? '#5D5FEF' : 'transparent', color: filter === 'ALL' ? 'white' : '#475569', cursor: 'pointer' }}
                >
                    Todas
                </button>
                <button 
                    className={`btn ${filter === 'UPCOMING' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('UPCOMING')}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: filter === 'UPCOMING' ? '#5D5FEF' : 'transparent', color: filter === 'UPCOMING' ? 'white' : '#475569', cursor: 'pointer' }}
                >
                    Próximas
                </button>
                <button 
                    className={`btn ${filter === 'PAST' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter('PAST')}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: filter === 'PAST' ? '#5D5FEF' : 'transparent', color: filter === 'PAST' ? 'white' : '#475569', cursor: 'pointer' }}
                >
                    Historial
                </button>
            </div>

            {/* Lista de citas */}
            {filteredAppointments.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
                    <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#334155', marginBottom: '0.5rem' }}>No tienes citas en esta categoría</h3>
                    <p style={{ color: '#64748b' }}>Las citas que programes aparecerán aquí.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredAppointments.map((app) => {
                        const { dateStr, timeStr } = formatDateTime(app.appointmentDate);
                        return (
                            <div key={app.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
                                            Dr. {app.schedule.doctor.firstName} {app.schedule.doctor.lastName}
                                        </h4>
                                        <span style={{ fontSize: '0.875rem', color: '#5D5FEF', fontWeight: 500 }}>{app.schedule.specialty.name}</span>
                                    </div>
                                    <div>
                                        {getStatusBadge(app.status, app.attendance, app.appointmentDate)}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                        <Calendar size={18} color="#94a3b8" />
                                        <span style={{ textTransform: 'capitalize' }}>{dateStr}</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                        <Clock size={18} color="#94a3b8" />
                                        <span>{timeStr}</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                        <MapPin size={18} color="#94a3b8" />
                                        <span>{app.schedule.office.name}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
