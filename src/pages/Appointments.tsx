import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useSpecialty } from '../context/SpecialtyContext';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
}

interface Office {
    name: string;
}

interface Schedule {
    doctor: Doctor;
    office: Office;
}

interface Appointment {
    id: string;
    appointmentDate: string;
    notes: string;
    type: 'PRIMERA_VEZ' | 'SUBSECUENTE';
    attendance: 'PROGRAMADA' | 'ATENDIDO' | 'NO_ASISTIO';
    status: string;
    patient: Patient;
    schedule: Schedule;
}

export default function Appointments() {
    const { specialtyId: urlSpecialtyId } = useParams<{ specialtyId: string }>();
    const { showToast } = useToast();
    const { activeSpecialty } = useSpecialty();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, [activeSpecialty, urlSpecialtyId]);

    const fetchAppointments = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);

            const targetSpecialtyId = urlSpecialtyId || activeSpecialty?.id;
            if (!targetSpecialtyId) return;

            const response = await api.get(`/appointments/doctor/${user.id}`, {
                params: { specialtyId: targetSpecialtyId }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showToast('Error al cargar las citas.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = async (appointmentId: string, newAttendance: 'ATENDIDO' | 'NO_ASISTIO') => {
        try {
            await api.patch(`/appointments/${appointmentId}/attendance`, { attendance: newAttendance });
            showToast(`Cita marcada como ${newAttendance === 'ATENDIDO' ? 'atendida' : 'no asistió'}.`, 'success');

            // Update local state
            setAppointments(prev => prev.map(app =>
                app.id === appointmentId ? { ...app, attendance: newAttendance } : app
            ));
        } catch (error) {
            console.error('Error updating attendance:', error);
            showToast('Error al actualizar la asistencia.', 'error');
        }
    };

    const getStatusColor = (attendance: string) => {
        switch (attendance) {
            case 'PROGRAMADA': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ATENDIDO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'NO_ASISTIO': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (attendance: string) => {
        switch (attendance) {
            case 'PROGRAMADA': return 'Programada';
            case 'ATENDIDO': return 'Atendido';
            case 'NO_ASISTIO': return 'No Asistió';
            default: return attendance;
        }
    };

    return (
        <div className="management-page">
            <div className="management-container">
                <div className="management-header">
                    <div>
                        <h1 className="page-title">Citas Programadas</h1>
                        <p className="page-subtitle">Gestiona la asistencia y visualiza tus próximas consultas.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                            <p className="text-muted">Cargando citas...</p>
                        </div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="card" style={{ padding: '60px', textAlign: 'center', borderRadius: '12px', background: 'white' }}>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>No tienes citas programadas actualmente.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {appointments.map(appointment => {
                            const date = new Date(appointment.appointmentDate);
                            return (
                                <div key={appointment.id} className="card" style={{ padding: '24px', borderRadius: '16px', background: 'white', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(93, 95, 239, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                                                    {appointment.patient.firstName} {appointment.patient.lastName}
                                                </h3>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                                                    {appointment.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={getStatusColor(appointment.attendance)} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid' }}>
                                            {getStatusLabel(appointment.attendance)}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', flexGrow: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                                            <Calendar size={18} />
                                            <span>{date.toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                                            <Clock size={18} />
                                            <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                                            <MapPin size={18} />
                                            <span>{appointment.schedule.office.name}</span>
                                        </div>
                                        {appointment.notes && (
                                            <div style={{ marginTop: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                                                "{appointment.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {appointment.attendance === 'PROGRAMADA' && (
                                        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
                                            <button
                                                onClick={() => handleAttendanceChange(appointment.id, 'NO_ASISTIO')}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', background: 'white', color: '#EF4444', border: '1px solid #FECACA', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                <XCircle size={18} /> No Asistió
                                            </button>
                                            <button
                                                onClick={() => handleAttendanceChange(appointment.id, 'ATENDIDO')}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', background: '#10B981', color: 'white', border: 'none', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#10B981'}
                                            >
                                                <CheckCircle size={18} /> Atendido
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
