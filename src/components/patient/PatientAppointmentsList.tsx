import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, X, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useToast } from '../Toast';

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
    const { showToast } = useToast();

    // Reschedule states
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [selectedApp, setSelectedApp] = useState<AppointmentData | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);
    const [doctorSchedules, setDoctorSchedules] = useState<any[]>([]);
    const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
    const [loadingAgenda, setLoadingAgenda] = useState(false);

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

    const canReschedule = (appointmentDateStr: string) => {
        const appDate = new Date(appointmentDateStr);
        const now = new Date();
        const diffInHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffInHours >= 24;
    };

    // --- Reschedule Logic ---
    const handleOpenReschedule = async (app: AppointmentData) => {
        setSelectedApp(app);
        setIsRescheduling(true);
        setLoadingAgenda(true);
        setRescheduleDate(null);
        setSelectedRescheduleSlot(null);

        try {
            const token = localStorage.getItem('token');
            // 1. Obtener los horarios del médico en TODAS las sedes para esta especialidad
            const officeRes = await api.get('/medical-offices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Recopilar todos los horarios de este doctor y especialidad en todas las oficinas
            const allSchedules: any[] = [];
            officeRes.data.forEach((office: any) => {
                const officeSchedules = office.schedules.filter((s: any) => 
                    s.doctorId === app.schedule.doctor.id && s.specialtyId === app.schedule.specialty.id
                ).map((s: any) => ({
                    ...s,
                    officeName: office.name // Guardar el nombre de la oficina para el slot
                }));
                allSchedules.push(...officeSchedules);
            });
            
            setDoctorSchedules(allSchedules);

            // 2. Obtener citas ya agendadas
            const appointmentsRes = await api.get(`/appointments/doctor/${app.schedule.doctor.id}`, {
                params: { specialtyId: app.schedule.specialty.id },
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookedAppointments(appointmentsRes.data);
        } catch (err) {
            console.error('Error al abrir agenda:', err);
            showToast('No se pudo cargar la disponibilidad del médico', 'error');
        } finally {
            setLoadingAgenda(false);
        }
    };

    const generateTimeSlots = (date: Date) => {
        if (!selectedApp) return [];
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const dayName = dayNames[date.getDay()];
        
        // Puede haber múltiples horarios en diferentes oficinas para el mismo día
        const matchingSchedules = doctorSchedules.filter(s => s.dayOfWeek === dayName);

        if (matchingSchedules.length === 0) return [];

        const allSlots: { time: string, scheduleId: string, officeName: string }[] = [];
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        matchingSchedules.forEach(schedule => {
            const scheduleStart = new Date(schedule.startTime);
            const scheduleEnd = new Date(schedule.endTime);

            let current = new Date(scheduleStart);
            const endHour = scheduleEnd.getHours();
            const endMin = scheduleEnd.getMinutes();

            while (current.getHours() < endHour || (current.getHours() === endHour && current.getMinutes() < endMin)) {
                const slotHour = current.getHours();
                const slotMin = current.getMinutes();
                const isFuture = !isToday || (slotHour > now.getHours() || (slotHour === now.getHours() && slotMin > now.getMinutes()));

                if (isFuture) {
                    const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    const isOccupied = bookedAppointments.some(ba => {
                        const baDate = new Date(ba.appointmentDate);
                        return baDate.getFullYear() === date.getFullYear() &&
                               baDate.getMonth() === date.getMonth() &&
                               baDate.getDate() === date.getDate() &&
                               baDate.getHours() === slotHour &&
                               baDate.getMinutes() === slotMin;
                    });

                    if (!isOccupied) {
                        allSlots.push({ 
                            time: timeString, 
                            scheduleId: schedule.id,
                            officeName: schedule.officeName 
                        });
                    }
                }
                current.setHours(current.getHours() + 1);
            }
        });

        // Ordenar por hora
        return allSlots.sort((a, b) => a.time.localeCompare(b.time));
    };

    const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<{time: string, scheduleId: string} | null>(null);

    const handleConfirmReschedule = async () => {
        if (!selectedApp || !rescheduleDate || !selectedRescheduleSlot) return;

        try {
            setLoading(true);
            const [hours, minutes] = selectedRescheduleSlot.time.split(':').map(Number);
            const newDate = new Date(rescheduleDate);
            newDate.setHours(hours, minutes, 0, 0);

            const token = localStorage.getItem('token');
            await api.patch(`/appointments/${selectedApp.id}/reschedule`, {
                scheduleId: selectedRescheduleSlot.scheduleId,
                appointmentDate: newDate.toISOString(),
                notes: 'Reagendado por el paciente'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast('Cita reagendada exitosamente', 'success');
            setIsRescheduling(false);
            fetchAppointments();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al reagendar la cita';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

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

                                {/* Botón de Reagendar */}
                                {(() => {
                                    const isPastDate = new Date(app.appointmentDate) < new Date();
                                    const isCompleted = app.status === 'COMPLETADA' || app.attendance === 'ATENDIDO' || app.attendance === 'NO_ASISTIO';
                                    const isBelongsToHistory = isPastDate || isCompleted;

                                    return !isBelongsToHistory && app.status !== 'CANCELADA' && (
                                        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {!canReschedule(app.appointmentDate) ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.8rem' }}>
                                                    <AlertCircle size={14} />
                                                    <span>Faltan menos de 24h. No se puede reagendar.</span>
                                                </div>
                                            ) : (
                                                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                                    ¿Necesitas cambiar la fecha?
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => handleOpenReschedule(app)}
                                                disabled={!canReschedule(app.appointmentDate)}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    padding: '0.625rem 1.25rem', 
                                                    backgroundColor: canReschedule(app.appointmentDate) ? '#EDE9FE' : '#f8fafc',
                                                    color: canReschedule(app.appointmentDate) ? '#5D5FEF' : '#94a3b8',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    cursor: canReschedule(app.appointmentDate) ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <RefreshCw size={16} />
                                                Reagendar Cita
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Reagendamiento */}
            {isRescheduling && selectedApp && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setIsRescheduling(false)}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C2434' }}>Reagendar Cita</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>Dr. {selectedApp.schedule.doctor.firstName} {selectedApp.schedule.doctor.lastName}</p>
                            </div>
                            <button onClick={() => setIsRescheduling(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={24} /></button>
                        </div>
                        
                        <div style={{ padding: '24px 30px', maxHeight: '70vh', overflowY: 'auto' }}>
                            {loadingAgenda ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>Cargando disponibilidad...</div>
                            ) : (
                                <>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}><Calendar size={18} /> Nueva Fecha</h4>
                                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
                                        {[...Array(14)].map((_, i) => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + i + 1); // Empezar desde mañana
                                            const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
                                            const hasSchedule = doctorSchedules.some(s => s.dayOfWeek === dayNames[d.getDay()]);
                                            
                                            if (!hasSchedule) return null;

                                            const isActive = rescheduleDate?.toDateString() === d.toDateString();
                                            return (
                                                <button key={i} onClick={() => { setRescheduleDate(d); setSelectedRescheduleSlot(null); }} style={{ flexShrink: 0, minWidth: '80px', height: '85px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: isActive ? '2px solid #5D5FEF' : '1px solid #E2E8F0', backgroundColor: isActive ? '#f5f3ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isActive ? '#5D5FEF' : '#64748B' }}>{d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}</span>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isActive ? '#5D5FEF' : '#1e293b' }}>{d.getDate()}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? '#5D5FEF' : '#64748B' }}>{d.toLocaleDateString('es-ES', { month: 'short' })}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}><Clock size={18} /> Nuevo Horario e Instalación</h4>
                                    {!rescheduleDate ? (
                                        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '16px', color: '#94A3B8' }}>Selecciona una fecha primero</div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                                            {generateTimeSlots(rescheduleDate).map((slot) => {
                                                const isActive = selectedRescheduleSlot?.time === slot.time && selectedRescheduleSlot?.scheduleId === slot.scheduleId;
                                                return (
                                                    <button 
                                                        key={`${slot.scheduleId}-${slot.time}`} 
                                                        onClick={() => setSelectedRescheduleSlot({ time: slot.time, scheduleId: slot.scheduleId })} 
                                                        style={{ 
                                                            padding: '12px 10px', 
                                                            borderRadius: '14px', 
                                                            border: isActive ? '2px solid #5D5FEF' : '1px solid #E2E8F0', 
                                                            backgroundColor: isActive ? '#f5f3ff' : 'white', 
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '4px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <span style={{ fontWeight: 800, color: isActive ? '#5D5FEF' : '#1e293b', fontSize: '1rem' }}>{slot.time}</span>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isActive ? '#5D5FEF' : '#64748B', textTransform: 'uppercase' }}>{slot.officeName}</span>
                                                    </button>
                                                );
                                            })}
                                            {generateTimeSlots(rescheduleDate).length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#94A3B8' }}>No hay turnos disponibles para este día</div>}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={{ padding: '20px 30px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                            <button 
                                onClick={handleConfirmReschedule}
                                disabled={!rescheduleDate || !selectedRescheduleSlot || loading}
                                style={{ width: '100%', padding: '14px', backgroundColor: '#5D5FEF', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: (!rescheduleDate || !selectedRescheduleSlot || loading) ? 'not-allowed' : 'pointer', opacity: (!rescheduleDate || !selectedRescheduleSlot || loading) ? 0.6 : 1, transition: 'all 0.2s' }}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Cambio de Fecha'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
